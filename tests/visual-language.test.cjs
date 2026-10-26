const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const genders=["masculine","neuter","feminine","plural"];
const articles={masculine:"der",neuter:"das",feminine:"die",plural:"die"};

function runtime(){
  const elements=new Map();
  class Element{
    constructor(tag="div"){
      this.tagName=tag.toUpperCase();
      this.children=[];
      this.text="";
      this.hidden=false;
      this.value="";
      this.dataset={};
      this.style={properties:{},setProperty(name,value){this.properties[name]=String(value)}};
      this.attributes={};
      this.className="";
      this.innerHTML="";
      this.classList={
        contains:name=>this.className.split(/\s+/).includes(name),
        toggle:(name,force)=>{
          const enabled=force===undefined?!this.classList.contains(name):force;
          this.className=[...this.className.split(/\s+/).filter(item=>item&&item!==name),...(enabled?[name]:[])].join(" ");
          return enabled;
        },
        add:name=>this.classList.toggle(name,true),
        remove:name=>this.classList.toggle(name,false)
      };
    }
    get parentElement(){return this.parent||(this.parent=new Element())}
    get textContent(){return this.text+this.children.map(child=>child.textContent).join("")}
    set textContent(value){this.text=value==null?"":String(value);this.children=[]}
    append(...children){this.children.push(...children)}
    appendChild(child){this.append(child)}
    replaceChildren(...children){this.text="";this.children=[...children]}
    setAttribute(name,value){this.attributes[name]=String(value)}
    addEventListener(){}
    querySelectorAll(){return []}
  }
  const document={
    createElement:tag=>new Element(tag),
    createDocumentFragment:()=>new Element("#document-fragment"),
    createTextNode:text=>({textContent:text}),
    getElementById(id){
      if(!elements.has(id))elements.set(id,new Element());
      return elements.get(id);
    },
    querySelector:()=>new Element()
  };
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const context=vm.createContext({document,localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(script,context);
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0);
  vm.runInContext(`${source.slice(0,bindings)}
    renderLessonPath=()=>{};
    renderCorrection=()=>{};
    updatePageTitle=()=>{};
    globalThis.runtime={
      definitions:deckDefinitions,variantsForStage,sceneArt,genderLabels,standaloneOccurrence,slashRuns,ruleVisualKinds,frequencyScale,
      lessonCatalog,lessonClasses,lessonClassGlyphs,renderLibrary,
      scenes:localPrepositionScenes,
      renderCard(lessonId,stageIndex,card,status=""){
        activeDeckId=lessonId;
        activeStageIndex=stageIndex;
        deck=[card];
        index=0;
        verificationMode=activeStage().mode==="input";
        verified=status==="correct";
        answerRevealed=status==="revealed";
        render();
      }
    };
  })();`,context);
  return {app:context.runtime,elements};
}

function descendants(element){
  return (element.children||[]).flatMap(child=>[child,...descendants(child)]);
}

function standaloneCount(text,word){
  const escaped=word.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return (text.match(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,"giu"))||[]).length;
}

function lessonCards(app,lessonId){
  return app.definitions[lessonId].stages.flatMap(stage=>app.variantsForStage(stage));
}

function nounWordsOf(noun){
  return [noun.word,noun.plural?.word,noun.exampleWord,noun.plural?.exampleWord].filter(Boolean);
}

function findCard(app,lessonId,predicate){
  for(const [stageIndex,stage] of app.definitions[lessonId].stages.entries()){
    const card=stage.cards.find(predicate);
    if(card)return {card,stageIndex};
  }
  assert.fail(`no matching card in ${lessonId}`);
}

test("local-preposition scenes and cues come from explicit card data",()=>{
  const {app}=runtime();
  const lesson=app.definitions["local-prepositions"];
  assert.deepEqual(new Set(Object.keys(app.scenes)),new Set(lesson.cards.map(card=>card.targetId)));
  for(const card of lessonCards(app,"local-prepositions")){
    assert.ok(card.scene,card.id);
    assert.ok(app.sceneArt(card.scene),`${card.id}: unknown scene ${card.scene.kind}`);
    assert.equal(card.cue,card.scene.motion?"Wohin?":"Wo?",card.id);
    assert.ok(card.practiceSupport.label.startsWith(card.cue),card.id);
    assert.ok(card.practiceSupport.text.startsWith(card.translation),card.id);
    for(const answer of card.response.accepted){
      assert.equal(app.standaloneOccurrence(card.practiceSupport.text,answer.replace(/[?!.,]+$/,"")),null,`${card.id}: ${answer}`);
    }
  }
});

test("possessive cards carry a consistent noun, answer split and paradigm",()=>{
  const {app}=runtime();
  const cards=lessonCards(app,"possessive-cases");
  assert.ok(cards.length>=40);
  for(const card of cards){
    const {noun,answerParts,paradigm}=card;
    assert.ok(genders.includes(noun.gender),card.id);
    assert.equal(noun.article,articles[noun.gender],card.id);
    assert.equal(`${answerParts.stem}${answerParts.ending}`,card.word,card.id);
    assert.deepEqual(Array.from(paradigm.columns,column=>column.gender),genders,card.id);
    const active=paradigm.rows[paradigm.active.row].cells[paradigm.active.column];
    assert.equal(`${active.stem}${active.ending}`,card.word,card.id);
    assert.equal(paradigm.columns[paradigm.active.column].gender,noun.gender,card.id);
    assert.equal(paradigm.rows[paradigm.active.row].title,card.targetId.includes("dative")?"Dativ":"Akkusativ",card.id);
    assert.equal(standaloneCount(card.example,card.word),1,`${card.id}: answer must appear once in the example`);
    assert.equal(standaloneCount(card.example,noun.exampleWord),1,`${card.id}: noun must appear once in the example`);
    const nounLine=`${noun.article} ${noun.word} ${app.genderLabels[noun.gender]}`;
    for(const answer of card.response.accepted)assert.equal(standaloneCount(nounLine,answer),0,`${card.id}: noun gender line leaks ${answer}`);
  }
});

test("learn cards show the answer split, gender dot, case strip and example focus",()=>{
  const {app,elements}=runtime();
  const lesson=app.definitions["possessive-cases"];
  const card=lesson.cards.find(item=>item.id==="possessive-accusative-masculine-brother");
  app.renderCard("possessive-cases",0,card);
  const headword=elements.get("question-word");
  assert.equal(headword.textContent,"meinen");
  assert.deepEqual(headword.children.map(child=>[child.className,child.textContent]),[["form-stem","mein"],["form-ending gender-masculine","en"]]);
  const nounLine=elements.get("noun-gender");
  assert.equal(nounLine.hidden,false);
  assert.deepEqual(nounLine.children.map(child=>child.textContent),["","der Bruder","чоловічий рід"]);
  assert.equal(nounLine.children[0].className,"gender-dot gender-masculine");
  assert.equal(nounLine.children[0].attributes["aria-hidden"],"true");
  const paradigm=elements.get("card-paradigm");
  assert.equal(paradigm.hidden,false);
  assert.equal(paradigm.children[0].textContent,"Akkusativ · mein + закінчення");
  const strip=paradigm.children[1];
  assert.equal(strip.tagName,"OL");
  assert.deepEqual(strip.children.map(tile=>tile.children.map(child=>child.textContent)),[["-en","der"],["—","das"],["-e","die"],["-e","Plural"]]);
  const active=descendants(paradigm).filter(node=>node.attributes?.["aria-current"]==="true");
  assert.equal(active.length,1);
  assert.equal(active[0],strip.children[0]);
  assert.equal(active[0].className,"case-tile gender-masculine active");
  assert.equal(descendants(paradigm).some(node=>node.tagName==="TABLE"),false);
  const example=elements.get("example");
  assert.equal(example.textContent,card.example);
  const focus=example.children.filter(child=>child.className.startsWith("example-focus"));
  assert.deepEqual(focus.map(child=>child.textContent),["meinen","Bruder"]);
  assert.equal(focus[0].children.at(-1).className,"example-ending");
  assert.equal(focus[0].children.at(-1).textContent,"en");

  const neuter=lesson.cards.find(item=>item.id==="possessive-accusative-neuter-our-car");
  app.renderCard("possessive-cases",0,neuter);
  assert.equal(elements.get("question-word").textContent,"unser");
  assert.equal(elements.get("question-word").children.length,1);
  assert.equal(elements.get("question-word").children[0].className,"");
});

test("noun metadata is explicit, valid and covers the planned lessons",()=>{
  const {app}=runtime();
  const coverage={};
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    const targets=new Set();
    for(const stage of definition.stages)for(const card of stage.cards){
      const noun=card.noun;
      if(!noun)continue;
      targets.add(card.targetId);
      const label=`${lessonId}: ${card.id}`;
      assert.ok(genders.includes(noun.gender),label);
      assert.equal(noun.article,articles[noun.gender],label);
      assert.ok(noun.word&&!noun.word.includes(" "),label);
      if(noun.plural){
        assert.notEqual(noun.gender,"plural",label);
        assert.equal(noun.plural.article,"die",label);
      }
      const text=card.example||card.word;
      if(noun.exampleWord)assert.equal(standaloneCount(text,noun.exampleWord),1,`${label}: ${noun.exampleWord}`);
      if(noun.plural?.exampleWord)assert.equal(standaloneCount(text,noun.plural.exampleWord),1,`${label}: ${noun.plural.exampleWord}`);
      // A headword that names an article + noun must agree with the authored gender.
      const phrases=card.word.split(" / ");
      const entries=[`${noun.article} ${noun.word}`,...(noun.plural?[`die ${noun.plural.word}`]:[])];
      if(phrases.every(phrase=>/^(der|das|die) \S+$/.test(phrase)))assert.deepEqual(phrases,entries,label);
    }
    if(targets.size)coverage[lessonId]=targets.size;
  }
  assert.deepEqual(coverage,{
    possessives:22,"possessive-cases":8,"local-prepositions":26,"time-worksheet-vocabulary":22,
    "everyday-vocabulary":8,"travel-transport":42,"giving-directions":6,"es-gibt-leisure":44,
    "temporal-prepositions":12,"indefinite-articles":21
  });
});

test("Nominativ possessives share the possessive answer split and case strip",()=>{
  const {app,elements}=runtime();
  const cards=app.definitions.possessives.stages.flatMap(stage=>stage.cards).filter(card=>card.answerParts);
  assert.equal(new Set(cards.map(card=>card.word)).size,10);
  for(const card of cards){
    const {noun,answerParts,paradigm}=card;
    assert.equal(`${answerParts.stem}${answerParts.ending}`,card.word,card.id);
    assert.equal(paradigm.rows[paradigm.active.row].title,"Nominativ",card.id);
    assert.equal(paradigm.columns[paradigm.active.column].gender,noun.gender,card.id);
    assert.equal(standaloneCount(card.example,card.word),1,card.id);
  }
  const {card,stageIndex}=findCard(app,"possessives",item=>item.word==="meine");
  app.renderCard("possessives",stageIndex,card);
  assert.deepEqual(elements.get("question-word").children.map(child=>[child.className,child.textContent]),[["form-stem","mein"],["form-ending gender-feminine","e"]]);
  const strip=elements.get("card-paradigm").children[1];
  assert.equal(elements.get("card-paradigm").children[0].textContent,"Nominativ · mein + закінчення");
  assert.deepEqual(strip.children.map(tile=>tile.children[0].textContent),["—","—","-e","-e"]);
  assert.equal(strip.children[2].attributes["aria-current"],"true");
});

test("noun headwords carry their own gender dots and the line shows labels only",()=>{
  const {app,elements}=runtime();
  const single=findCard(app,"travel-transport",item=>item.word==="der Bahnhof");
  app.renderCard("travel-transport",single.stageIndex,single.card);
  const headword=elements.get("question-word");
  assert.equal(headword.textContent,"der Bahnhof");
  assert.equal(headword.children.length,1);
  assert.equal(headword.children[0].className,"headword-noun");
  assert.equal(headword.children[0].children[0].className,"gender-dot gender-masculine");
  const nounLine=elements.get("noun-gender");
  assert.equal(nounLine.hidden,false);
  assert.ok(nounLine.classList.contains("labels-only"));
  assert.deepEqual(nounLine.children.map(child=>child.textContent),["чоловічий рід"]);

  const pair=findCard(app,"es-gibt-leisure",item=>item.word==="das Kino / die Kinos");
  app.renderCard("es-gibt-leisure",pair.stageIndex,pair.card);
  assert.equal(headword.textContent,"das Kino / die Kinos");
  assert.deepEqual(headword.children.filter(child=>child.className==="headword-noun").map(group=>group.children[0].className),
    ["gender-dot gender-neuter","gender-dot gender-plural"]);
  assert.deepEqual(nounLine.children.map(child=>child.textContent),["середній рід","/","множина"]);
  assert.equal(nounLine.children[1].attributes["aria-hidden"],"true");

  const phrase=findCard(app,"travel-transport",item=>item.word==="mit dem Zug fahren");
  app.renderCard("travel-transport",phrase.stageIndex,phrase.card);
  assert.equal(headword.textContent,"mit dem Zug fahren");
  assert.equal(headword.children.length,0);
  assert.equal(nounLine.classList.contains("labels-only"),false);
  assert.deepEqual(nounLine.children.map(child=>child.textContent),["","der Zug","чоловічий рід"]);
});

test("example focus marks each noun form in its own gender",()=>{
  const {app,elements}=runtime();
  const {card,stageIndex}=findCard(app,"time-worksheet-vocabulary",item=>item.word==="der Baum / die Bäume");
  app.renderCard("time-worksheet-vocabulary",stageIndex,card);
  const focus=()=>elements.get("example").children.filter(child=>child.className.startsWith("example-focus"));
  assert.deepEqual(focus().map(child=>[child.textContent,child.className]),[["Bäumen","example-focus gender-plural"]]);
  assert.equal(elements.get("example").textContent,card.example);

  const vocabulary=findCard(app,"travel-transport",item=>item.word==="die Haltestelle");
  app.renderCard("travel-transport",vocabulary.stageIndex,vocabulary.card);
  assert.deepEqual(focus().map(child=>[child.textContent,child.className]),[["Haltestelle","example-focus gender-feminine"]]);
});

test("local-preposition practice keeps the given noun visible and the meaning separate",()=>{
  const {app,elements}=runtime();
  const lesson=app.definitions["local-prepositions"];
  for(const card of lesson.cards){
    assert.equal(card.noun.givenInPractice,true,card.id);
    assert.equal(card.practiceSupport.text,card.translation,card.id);
    assert.equal(card.practiceSupport.label,`${card.cue} · значення`,card.id);
  }
  const stageIndex=lesson.stages.findIndex(stage=>stage.mode==="input");
  const card=app.variantsForStage(lesson.stages[stageIndex]).find(item=>item.targetId==="local-dative-zwischen-fenstern");
  app.renderCard("local-prepositions",stageIndex,card);
  assert.equal(elements.get("noun-gender").hidden,false);
  assert.deepEqual(elements.get("noun-gender").children.map(child=>child.textContent),["","die Fenster","множина"]);
  app.renderCard("local-prepositions",stageIndex,card,"correct");
  const focus=elements.get("example").children.filter(child=>child.className.startsWith("example-focus"));
  assert.deepEqual(focus.map(child=>[child.textContent,child.className]),[["Fenstern","example-focus gender-plural"]]);
});

const auxiliaryForms={haben:["habe","hast","hat","haben","habt"],sein:["bin","bist","ist","sind","seid"]};

function formText(parts){
  return `${parts.stem}${parts.ending}`;
}

function nodeParts(element){
  return element.children.map(child=>[child.className,child.textContent]);
}

const verbPersons=["ich","du","er/sie/es","wir","ihr","sie/Sie"];
const subjectPersons={ich:[0],du:[1],er:[2],es:[2],wir:[3],ihr:[4],sie:[2,5]};

test("verb cards carry a person strip whose active tile is the answer form",()=>{
  const {app}=runtime();
  const covered={};
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      for(const card of app.variantsForStage(stage)){
        const {paradigm,answerParts}=card;
        if(!paradigm?.columns||paradigm.columns.length!==verbPersons.length||paradigm.columns.some((column,index)=>column.label!==verbPersons[index]))continue;
        const label=`${stage.id}: ${card.word}`;
        covered[lessonId]=(covered[lessonId]||0)+1;
        assert.equal(paradigm.forms,true,label);
        assert.deepEqual(Array.from(paradigm.rows,row=>[row.label,row.title]),[["Präs.","Präsens"]],label);
        const forms=paradigm.rows[0].cells;
        assert.deepEqual(forms[paradigm.active.column],answerParts,label);
        // A vowel is marked only for a vowel change, exactly where the stem differs from the wir stem.
        const changedTo=paradigm.title.includes(" → ")?paradigm.title.split(" → ").pop():null;
        for(const form of forms){
          assert.equal(Boolean(form.vowel),Boolean(changedTo)&&form.stem!==forms[3].stem,`${label}: ${formText(form)}`);
          if(!form.vowel)continue;
          assert.ok(form.vowel.start>=0&&form.vowel.start<form.vowel.end&&form.vowel.end<=form.stem.length,`${label}: ${formText(form)}`);
          assert.equal(form.stem.slice(form.vowel.start,form.vowel.end),changedTo,`${label}: ${formText(form)}`);
        }
        const answer=formText(answerParts);
        assert.equal(standaloneCount(card.word,answer),1,label);
        if(stage.mode==="learn"){
          const person=paradigm.columns[paradigm.active.column].label.split("/")[0];
          assert.ok(card.word.toLowerCase().startsWith(person),label);
          assert.equal(standaloneCount(card.example,answer),1,label);
        }else{
          assert.equal(standaloneCount(card.response.accepted[0],answer),1,label);
          const subject=subjectPersons[card.word.split(" ")[0].toLowerCase()];
          if(subject)assert.ok(subject.includes(paradigm.active.column),label);
        }
      }
    }
  }
  assert.deepEqual(covered,{sein:22,conjugation:66,"strong-verbs":120,koennen:48,haben:54,werden:12});
  for(const stage of app.definitions["strong-verbs"].stages)assert.equal(stage.cards.length,42,stage.id);
});

test("verb strips name what changes in the caption",()=>{
  const {app,elements}=runtime();
  const strip=(lessonId,word)=>{
    const {card,stageIndex}=findCard(app,lessonId,item=>item.word===word);
    app.renderCard(lessonId,stageIndex,card);
    const figure=elements.get("card-paradigm");
    assert.equal(figure.hidden,false,word);
    const tiles=figure.children[1].children;
    return [figure.children[0].textContent,tiles.map(tile=>tile.children[0].textContent).join(" "),tiles.findIndex(tile=>tile.className.split(" ").includes("active"))];
  };
  assert.deepEqual(strip("sein","du bist"),["Präsens · sein","bin bist ist sind seid sind",1]);
  assert.deepEqual(strip("conjugation","du arbeitest"),["Präsens · arbeiten · додаткове e","arbeite arbeitest arbeitet arbeiten arbeitet arbeiten",1]);
  assert.deepEqual(strip("haben","du hast"),["Präsens · haben · du, er/sie/es без b","habe hast hat haben habt haben",1]);
  assert.deepEqual(strip("koennen","er / sie / es kann"),["Präsens · können · ö → a","kann kannst kann können könnt können",2]);
  assert.deepEqual(nodeParts(elements.get("card-paradigm").children[1].children[2].children[0]),[["form-stem","k"],["form-vowel","a"],["form-stem","nn"]]);
});

test("strong-verb learn cards mark the changed vowel in the headword, strip and example",()=>{
  const {app,elements}=runtime();
  const headword=word=>{
    const {card,stageIndex}=findCard(app,"strong-verbs",item=>item.word===word);
    app.renderCard("strong-verbs",stageIndex,card);
    return nodeParts(elements.get("question-word"));
  };
  assert.deepEqual(headword("du fährst"),[["form-context","du "],["form-stem","f"],["form-vowel","ä"],["form-stem","hr"],["form-ending","st"]]);
  assert.deepEqual(headword("ich weiß"),[["form-context","ich "],["form-stem","w"],["form-vowel","ei"],["form-stem","ß"]]);
  assert.deepEqual(headword("wir fahren"),[["form-context","wir "],["form-stem","fahr"],["form-ending","en"]]);
  assert.deepEqual(headword("er / sie / es fängt an"),[["form-context","er / sie / es "],["form-stem","f"],["form-vowel","ä"],["form-stem","ng"],["form-ending","t"],["form-context"," an"]]);

  const {card,stageIndex}=findCard(app,"strong-verbs",item=>item.word==="du fährst");
  app.renderCard("strong-verbs",stageIndex,card);
  const figure=elements.get("card-paradigm");
  assert.equal(figure.hidden,false);
  assert.equal(figure.children[0].textContent,"Präsens · fahren · a → ä");
  const strip=figure.children[1];
  assert.equal(strip.className,"case-strip forms");
  assert.deepEqual(strip.children.map(tile=>tile.children[0].textContent),["fahre","fährst","fährt","fahren","fahrt","fahren"]);
  assert.deepEqual(strip.children.map(tile=>tile.className.split(" ").includes("active")),[false,true,false,false,false,false]);
  assert.deepEqual(nodeParts(strip.children[1].children[0]),[["form-stem","f"],["form-vowel","ä"],["form-stem","hr"],["form-ending","st"]]);
  const focus=elements.get("example").children.filter(child=>child.className.startsWith("example-focus"));
  assert.equal(focus.length,1);
  assert.deepEqual(nodeParts(focus[0]),[["","f"],["example-vowel","ä"],["","hr"],["example-ending","st"]]);
});

test("strong-verb practice hides the split and strip until Check",()=>{
  const {app,elements}=runtime();
  const {card,stageIndex}=findCard(app,"strong-verbs",item=>item.answer==="fängt / an");
  const [variant]=app.variantsForStage(app.definitions["strong-verbs"].stages[stageIndex]).filter(item=>item.word===card.word);
  app.renderCard("strong-verbs",stageIndex,variant);
  assert.equal(elements.get("card-paradigm").hidden,true);
  assert.equal(descendants(elements.get("question-word")).some(node=>node.className?.startsWith("form-")),false);
  assert.equal(standaloneCount(elements.get("question-word").textContent,"fängt"),0);
  app.renderCard("strong-verbs",stageIndex,variant,"correct");
  assert.equal(elements.get("card-paradigm").hidden,false);
  const focus=elements.get("example").children.filter(child=>child.className.startsWith("example-focus"));
  assert.deepEqual(focus.map(child=>child.textContent),["fängt"]);
  assert.equal(focus[0].children[1].className,"example-vowel");
});

test("Perfekt cards name their auxiliary and show the haben/sein panel on learn cards and after Check",()=>{
  const {app,elements}=runtime();
  const lesson=app.definitions.perfekt;
  const framed=lesson.stages.filter(stage=>stage.id.startsWith("perfekt-frame")||stage.id.startsWith("perfekt-auxiliary"));
  assert.equal(framed.length,4);
  for(const stage of lesson.stages){
    const stageIndex=lesson.stages.indexOf(stage);
    for(const card of app.variantsForStage(stage)){
      const label=`${stage.id}: ${card.id}`;
      if(!framed.includes(stage)){
        assert.equal(card.auxiliary,undefined,label);
        continue;
      }
      const {verb,form}=card.auxiliary;
      assert.ok(auxiliaryForms[verb]?.includes(form),label);
      assert.equal(standaloneCount(card.word,form),1,label);
      for(const answer of card.response.accepted)assert.equal(standaloneCount(answer,form)>0,true,label);
      app.renderCard("perfekt",stageIndex,card);
      const figure=elements.get("card-auxiliary");
      assert.equal(figure.hidden,stage.mode==="input",label);
      for(const status of stage.mode==="input"?["correct","revealed"]:[""]){
        app.renderCard("perfekt",stageIndex,card,status);
        assert.equal(figure.hidden,false,`${label}: ${status}`);
        assert.equal(figure.children[0].tagName,"FIGCAPTION",label);
        const items=figure.children[1].children;
        assert.deepEqual(items.map(item=>item.className),[
          `auxiliary-choice aux-sein${verb==="sein"?" active":""}`,
          `auxiliary-choice aux-haben${verb==="haben"?" active":""}`
        ],label);
        assert.deepEqual(items.map(item=>item.attributes["aria-current"]),[verb==="sein"?"true":undefined,verb==="haben"?"true":undefined],label);
        assert.deepEqual(items.map(item=>item.children[0].attributes["aria-hidden"]),["true","true"],label);
        assert.deepEqual(items.map(item=>item.children[1].children[0].textContent),["sein","haben"],label);
        const focus=elements.get("example").children.filter(child=>child.className===`example-focus aux-${verb}`);
        assert.equal(focus.length,1,`${label}: ${elements.get("example").textContent}`);
      }
    }
  }
  const {card,stageIndex}=findCard(app,"perfekt",item=>item.id==="perfekt-frame-hausaufgaben");
  app.renderCard("perfekt",stageIndex,card);
  assert.deepEqual(nodeParts(elements.get("example")),[["example-focus aux-haben","haben"],[""," + gemacht"]]);
  const sein=findCard(app,"perfekt",item=>item.id==="perfekt-auxiliary-movement-berlin");
  app.renderCard("perfekt",sein.stageIndex,sein.card);
  assert.deepEqual(nodeParts(elements.get("example")),[["","Er "],["example-focus aux-sein","ist"],[""," nach Berlin gefahren."]]);
});

test("personal pronoun cards highlight the case form in a Nom./Akk./Dat. strip",()=>{
  const {app,elements}=runtime();
  const lesson=app.definitions["personal-pronoun-cases"];
  for(const stage of lesson.stages){
    for(const card of app.variantsForStage(stage)){
      const label=`${stage.id}: ${card.id}`,{paradigm,answerParts}=card;
      const [,caseName,person]=card.id.split("-");
      assert.equal(card.person,person,label);
      assert.deepEqual(Array.from(paradigm.columns,column=>column.label),["Nom.","Akk.","Dat."],label);
      assert.equal(paradigm.active.column,{accusative:1,dative:2}[caseName],label);
      assert.deepEqual(paradigm.rows[paradigm.active.row].cells[paradigm.active.column],answerParts,label);
      if(stage.mode==="learn")assert.equal(standaloneCount(card.example,formText(answerParts)),1,label);
      else assert.equal(card.response.accepted[0],formText(answerParts),label);
    }
  }
  const {card,stageIndex}=findCard(app,"personal-pronoun-cases",item=>item.id.startsWith("pronoun-accusative-er-"));
  app.renderCard("personal-pronoun-cases",stageIndex,card);
  const figure=elements.get("card-paradigm");
  assert.equal(figure.children[0].textContent,"er (він) · Personalpronomen");
  const tiles=figure.children[1].children;
  assert.deepEqual(tiles.map(tile=>tile.children[0].textContent),["er","ihn","ihm"]);
  assert.deepEqual(tiles.map(tile=>tile.className.split(" ").includes("active")),[false,true,false]);
});

test("past-verb cards name the Perfekt auxiliary unless both are possible",()=>{
  const {app,elements}=runtime();
  let marked=0;
  for(const lessonId of ["past-verbs","past-verbs-a2","past-verbs-b1"]){
    const lesson=app.definitions[lessonId];
    for(const [stageIndex,stage] of lesson.stages.entries()){
      for(const card of app.variantsForStage(stage)){
        const label=`${stage.id}: ${card.word}`;
        const perfect=stage.mode==="learn"?card.word.split(" · ").pop():card.response.accepted[0].split(" / ").pop();
        const first=perfect.split(" ")[0];
        if(first==="hat/ist"){
          assert.equal(card.auxiliary,undefined,label);
          continue;
        }
        const verb={hat:"haben",ist:"sein"}[first];
        assert.ok(verb,label);
        assert.equal(card.auxiliary.verb,verb,label);
        assert.ok(auxiliaryForms[verb].includes(card.auxiliary.form),label);
        app.renderCard(lessonId,stageIndex,card,stage.mode==="input"?"correct":"");
        assert.equal(elements.get("card-auxiliary").hidden,false,label);
        // Only a present-tense auxiliary of a Perfekt example is marked, never an infinitive or a Präteritum verb.
        const focus=elements.get("example").children.filter(child=>child.className.startsWith("example-focus aux-"));
        for(const span of focus){
          marked++;
          assert.equal(span.className,`example-focus aux-${verb}`,label);
          assert.ok(auxiliaryForms[verb].includes(span.textContent.toLowerCase()),`${label}: ${span.textContent}`);
          assert.equal(standaloneCount(card.example,perfect.split(" ").pop()),1,label);
        }
        assert.ok(focus.length<=1,label);
      }
    }
  }
  assert.equal(marked,172);
  const {card,stageIndex}=findCard(app,"past-verbs",item=>item.word.startsWith("bleiben "));
  app.renderCard("past-verbs",stageIndex,card);
  assert.deepEqual(nodeParts(elements.get("example")),[["","Ich "],["example-focus aux-sein","bin"],[""," zu Hause geblieben."]]);
});

const clauseRoleOrders=[["first","verb","middle","end"],["link","middle","end"]];

function structureText(structure){
  return Array.from(structure,clause=>Array.from(clause,slot=>slot.text).join(" ")).join(", ");
}

// Position boxes cover word-order rules and sentence builds; every other card stays without them.
const structureCoverage={
  "separable-verbs":()=>true,
  "word-order":()=>true,
  koennen:stage=>/^(koennen|wollen)-order-/.test(stage.id),
  perfekt:(stage,card)=>card.id.startsWith("perfekt-frame-"),
  "temporal-prepositions":(stage,card)=>card.type==="sentence-build",
  "mit-ohne":(stage,card)=>card.type==="sentence-build"
};
const structureCounts={"separable-verbs":28,"word-order":37,koennen:35,perfekt:12,"temporal-prepositions":30,"mit-ohne":12};

test("sentence structures are explicit, ordered and rebuild the card's sentence",()=>{
  const {app}=runtime();
  const counts={};
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      for(const card of app.variantsForStage(stage)){
        const label=`${stage.id}: ${card.id}`;
        const covered=Boolean(structureCoverage[lessonId]?.(stage,card));
        assert.equal(Boolean(card.structure),covered,label);
        if(!card.structure)continue;
        counts[lessonId]=(counts[lessonId]||0)+1;
        assert.ok(card.structure.length>0,label);
        for(const clause of card.structure){
          const roles=Array.from(clause,slot=>slot.role);
          const order=clauseRoleOrders.find(candidate=>candidate.includes(roles[0])&&roles.every(role=>candidate.includes(role)));
          assert.ok(order,`${label}: ${roles}`);
          assert.deepEqual(roles,order.filter(role=>roles.includes(role)),`${label}: order`);
          assert.ok(roles.includes("verb")||roles.includes("end"),`${label}: verb`);
          for(const slot of clause)assert.equal(slot.text,slot.text.trim(),label);
        }
        const text=structureText(card.structure);
        if(card.type==="sentence-build")assert.equal(text,card.response.accepted[0].replace(/[.?!]$/,""),label);
        else assert.ok([card.word,card.example].some(source=>app.standaloneOccurrence(source||"",text)),`${label}: ${text}`);
      }
    }
  }
  assert.deepEqual(counts,structureCounts);
});

test("position boxes show on learn cards and after Check, with the verb parts in the accent",()=>{
  const {app,elements}=runtime();
  const slots=figure=>descendants(figure).filter(node=>node.tagName==="LI");
  const summary=figure=>slots(figure).map(item=>[item.className,item.children[0].textContent,item.children[1].textContent]);
  const {card,stageIndex}=findCard(app,"separable-verbs",item=>item.word==="aufstehen");
  app.renderCard("separable-verbs",stageIndex,card);
  const figure=elements.get("card-structure");
  assert.equal(figure.hidden,false);
  assert.equal(figure.children[0].textContent,"Порядок слів");
  assert.deepEqual(summary(figure),[
    ["structure-slot slot-first","Ich","Поз. 1"],
    ["structure-slot slot-verb verb-part","stehe","Дієсл. 2"],
    ["structure-slot slot-middle","um sieben Uhr","Середина"],
    ["structure-slot slot-end verb-part","auf","Кінець"]
  ]);
  assert.ok(slots(figure).every(item=>item.children[0].lang==="de"&&item.children[1].tagName==="ABBR"&&item.children[1].title));

  const weil=findCard(app,"separable-verbs",item=>item.word==="Ich bleibe zu Hause, weil ich früh aufstehe.");
  app.renderCard("separable-verbs",weil.stageIndex,weil.card);
  assert.equal(figure.hidden,true);
  assert.equal(figure.children.length,0);
  app.renderCard("separable-verbs",weil.stageIndex,weil.card,"correct");
  assert.equal(figure.hidden,false);
  const sentence=figure.children[1];
  assert.deepEqual(sentence.children.map(node=>node.tagName),["OL","SPAN","OL"]);
  assert.equal(sentence.children[1].attributes["aria-hidden"],"true");
  assert.deepEqual(summary(figure).map(([className,,short])=>[className.replace("structure-slot ",""),short]),[
    ["slot-first","Поз. 1"],["slot-verb verb-part","Дієсл. 2"],["slot-middle","Середина"],
    ["slot-link","Сполучник"],["slot-middle","Середина"],["slot-end verb-part","Кінець"]
  ]);

  const nonSeparable=findCard(app,"separable-verbs",item=>item.word==="Ich verstehe die Aufgabe.");
  app.renderCard("separable-verbs",nonSeparable.stageIndex,nonSeparable.card);
  assert.deepEqual(summary(figure).map(([,text])=>text),["Ich","verstehe","die Aufgabe"]);
});

test("position boxes label a verb-first question, keep the infinitive at the end and frame Perfekt",()=>{
  const {app,elements}=runtime();
  const summary=()=>descendants(elements.get("card-structure")).filter(node=>node.tagName==="LI").map(item=>[item.className.replace("structure-slot ",""),item.children[0].textContent,item.children[1].textContent]);

  const question=findCard(app,"word-order",item=>item.word==="Ist der Mann da?");
  app.renderCard("word-order",question.stageIndex,question.card);
  assert.equal(elements.get("card-structure").hidden,true);
  app.renderCard("word-order",question.stageIndex,question.card,"correct");
  assert.deepEqual(summary(),[["slot-verb verb-part","Ist","Дієсл. 1"],["slot-middle","der Mann da","Середина"]]);

  const rule=findCard(app,"word-order",item=>item.word==="Am Morgen mag ich Kaffee trinken.");
  app.renderCard("word-order",rule.stageIndex,rule.card);
  assert.deepEqual(summary().map(([,text,short])=>`${text}/${short}`),["Am Morgen/Поз. 1","mag/Дієсл. 2","ich Kaffee/Середина","trinken/Кінець"]);

  const modal=findCard(app,"koennen",item=>item.word==="Kannst du mir bitte helfen?");
  app.renderCard("koennen",modal.stageIndex,modal.card,"revealed");
  assert.deepEqual(summary(),[["slot-verb verb-part","Kannst","Дієсл. 1"],["slot-middle","du mir bitte","Середина"],["slot-end verb-part","helfen","Кінець"]]);

  const frame=findCard(app,"perfekt",item=>item.id==="perfekt-frame-ankommen");
  app.renderCard("perfekt",frame.stageIndex,frame.card);
  assert.equal(elements.get("card-auxiliary").hidden,false);
  assert.deepEqual(summary().map(([className,text])=>[className,text]),[
    ["slot-first","Der Bus"],["slot-verb verb-part","ist"],["slot-middle","spät"],["slot-end verb-part","angekommen"]
  ]);
});

// Concept visuals (Phase 4 pilot): the frequency bar on the frequency lesson, the clock on spoken clock times.
const conceptCoverage={
  frequency:{covered:()=>true,count:32},
  clock:{covered:(lessonId,stage)=>lessonId==="time-expressions"&&stage.id.startsWith("spoken-time-"),count:15}
};
const pictureCoverage={lessons:["travel-transport","everyday-vocabulary","time-worksheet-vocabulary","giving-directions","es-gibt-leisure"],count:241};

function stageVariants(app,lessonId,stageId){
  const stageIndex=app.definitions[lessonId].stages.findIndex(stage=>stage.id===stageId);
  assert.ok(stageIndex>=0,stageId);
  return {stageIndex,variants:app.variantsForStage(app.definitions[lessonId].stages[stageIndex])};
}

test("frequency and clock data are explicit, valid and cover exactly the pilot cards",()=>{
  const {app}=runtime();
  const counts={frequency:0,clock:0};
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      for(const card of app.variantsForStage(stage)){
        const label=`${stage.id}: ${card.id}`;
        assert.equal(Boolean(card.frequency),lessonId==="frequency",label);
        assert.equal(Boolean(card.clock),conceptCoverage.clock.covered(lessonId,stage),label);
        if(card.frequency){
          counts.frequency+=1;
          const {scale,active}=card.frequency,percents=Array.from(scale,step=>step.percent);
          assert.deepEqual(Array.from(scale,step=>step.word),["nie","fast nie","selten","manchmal","oft","meistens","fast immer","immer"],label);
          assert.equal(percents[0],0,label);
          assert.equal(percents.at(-1),100,label);
          assert.ok(percents.every((percent,index)=>!index||percent>percents[index-1]),`${label}: ascending`);
          assert.equal(scale[active].word,card.word,label);
          assert.ok(card.response.accepted.includes(card.word)||stage.mode!=="input"||card.type==="cloze",label);
        }
        if(card.clock){
          counts.clock+=1;
          const {hour,minute}=card.clock;
          assert.ok(Number.isInteger(hour)&&hour>=1&&hour<=12,label);
          assert.ok(Number.isInteger(minute)&&minute>=0&&minute<60,label);
          assert.equal(`${hour}:${String(minute).padStart(2,"0")}`,card.translation,label);
        }
      }
    }
  }
  assert.deepEqual(counts,{frequency:conceptCoverage.frequency.count,clock:conceptCoverage.clock.count});
});

test("the frequency bar names every step on learn cards and shows only the percent before Check",()=>{
  const {app,elements}=runtime();
  const steps=()=>descendants(elements.get("card-frequency")).filter(node=>node.tagName==="LI");
  const {card,stageIndex}=findCard(app,"frequency",item=>item.word==="manchmal");
  app.renderCard("frequency",stageIndex,card);
  const figure=elements.get("card-frequency");
  assert.equal(figure.hidden,false);
  assert.equal(figure.children[0].textContent,"manchmal · ≈ 40 %");
  assert.deepEqual(steps().map(item=>item.textContent),["nie","fast nie","selten","manchmal","oft","meistens","fast immer","immer"]);
  assert.deepEqual(steps().filter(item=>item.classList.contains("active")).map(item=>item.textContent),["manchmal"]);
  assert.equal(steps()[3].attributes["aria-current"],"true");
  const track=descendants(figure).find(node=>node.className==="frequency-track");
  assert.equal(track.attributes["aria-hidden"],"true");

  const practice=stageVariants(app,"frequency","frequency-scale-recall");
  for(const variant of practice.variants){
    app.renderCard("frequency",practice.stageIndex,variant);
    const label=variant.id,active=variant.frequency.scale[variant.frequency.active];
    assert.equal(figure.hidden,false,label);
    assert.equal(figure.children[0].textContent,`≈ ${active.percent} % часу`,label);
    assert.equal(steps().length,0,label);
    for(const step of variant.frequency.scale)assert.equal(standaloneCount(figure.textContent,step.word),0,`${label}: ${step.word}`);
    app.renderCard("frequency",practice.stageIndex,variant,"correct");
    assert.equal(figure.children[0].textContent,`${active.word} · ≈ ${active.percent} %`,label);
    assert.equal(steps().length,8,label);
  }
});

test("the clock shows the prompt time before Check and the span German counts after it",()=>{
  const {app,elements}=runtime();
  const figure=()=>elements.get("card-clock");
  const svg=()=>figure().children[0].innerHTML;
  const readings={"fünf nach zehn":"5 хв після 10","zehn vor sechs":"10 хв до 6","Viertel nach drei":"¼ години після 3","halb vier":"½ години до 4","Viertel vor sieben":"¼ години до 7"};
  const learn=stageVariants(app,"time-expressions","spoken-time-learn");
  assert.deepEqual(Object.fromEntries(learn.variants.map(card=>{
    app.renderCard("time-expressions",learn.stageIndex,card);
    assert.match(svg(),/class="clock-sector"/,card.word);
    return [card.word,figure().children[1].textContent];
  })),readings);

  const practice=stageVariants(app,"time-expressions","spoken-time-practice");
  const quarter=practice.variants.find(card=>card.word==="Viertel nach drei");
  app.renderCard("time-expressions",practice.stageIndex,quarter);
  assert.equal(figure().hidden,false);
  assert.equal(figure().children.length,1);
  assert.doesNotMatch(svg(),/clock-sector/);
  assert.match(svg(),/aria-label="Годинник показує 3:15"/);
  assert.match(svg(),/class="clock-hand clock-hand-minute" x1="60" y1="60" x2="104" y2="60"/);
  app.renderCard("time-expressions",practice.stageIndex,quarter,"correct");
  assert.match(svg(),/class="clock-sector" d="M60 60L60 7A53 53 0 0 1 113 60Z"/);
  assert.match(svg(),/aria-label="Годинник показує 3:15: ¼ години після 3"/);
  assert.equal(figure().children[1].textContent,"¼ години після 3");

  const before=practice.variants.find(card=>card.word==="zehn vor sechs");
  app.renderCard("time-expressions",practice.stageIndex,before,"revealed");
  assert.match(svg(),/class="clock-sector" d="M60 60L14.1 33.5A53 53 0 0 1 60 7Z"/);

  const generic=[[3,0,"рівно 3"],[3,25,"5 хв до пів на 4"],[3,35,"5 хв після пів на 4"],[12,45,"¼ години до 1"],[11,20,"20 хв після 11"]];
  for(const [hour,minute,text] of generic){
    app.renderCard("time-expressions",learn.stageIndex,{...learn.variants[0],clock:{hour,minute}});
    assert.equal(figure().children[1].textContent,text,`${hour}:${minute}`);
    assert.equal(/clock-sector/.test(svg()),minute>0,`${hour}:${minute}`);
  }
});

test("vocabulary pictures are explicit, vendored, safe and mean one word or noun across the course",()=>{
  const {app}=runtime();
  const {existsSync,readdirSync}=require("node:fs");
  const iconDir=join(__dirname,"../assets/icons");
  const cards=Object.entries(app.definitions).flatMap(([lessonId,definition])=>
    definition.stages.flatMap(stage=>app.variantsForStage(stage).map(card=>({lessonId,stage,card}))));
  const singularOf=new Map(cards.filter(({card})=>card.noun?.plural).map(({card})=>[card.noun.plural.word,card.noun.word]));
  const nounKey=card=>card.noun&&(singularOf.get(card.noun.word)??card.noun.word);
  const used=new Set(),meaningByPicture=new Map(),pictureByNoun=new Map();
  let count=0;
  for(const {lessonId,stage,card} of cards){
    const label=`${stage.id}: ${card.id}`;
    assert.ok(!(card.picture&&card.scene),`${label}: one illustration per card`);
    if(!card.picture)continue;
    count+=1;
    used.add(card.picture);
    assert.ok(pictureCoverage.lessons.includes(lessonId),label);
    assert.match(card.picture,/^[a-z0-9]+(?:-[a-z0-9]+)*$/,label);
    assert.ok(existsSync(join(iconDir,`${card.picture}.svg`)),label);
    const meaning=meaningByPicture.get(card.picture);
    assert.ok(!meaning||meaning.word===card.word||(meaning.noun&&meaning.noun===nounKey(card)),`${label}: ${card.picture} also shows ${meaning?.word}`);
    meaningByPicture.set(card.picture,{word:card.word,noun:nounKey(card)});
    if(card.noun){
      const picture=pictureByNoun.get(nounKey(card));
      assert.ok(!picture||picture===card.picture,`${label}: ${nounKey(card)} also shows ${picture}`);
      pictureByNoun.set(nounKey(card),card.picture);
    }
  }
  assert.equal(count,pictureCoverage.count);
  const files=readdirSync(iconDir).filter(name=>name.endsWith(".svg")).sort();
  assert.deepEqual(files,[...used].map(name=>`${name}.svg`).sort());
  for(const name of files){
    const svg=readFileSync(join(iconDir,name),"utf8");
    assert.match(svg,/^<svg [^>]*viewBox="0 0 32 32"/,name);
    assert.doesNotMatch(svg,/<script|<foreignObject|\son[a-z]+=|href="(?!#)/i,name);
  }
  const licence=readFileSync(join(iconDir,"LICENSE"),"utf8");
  assert.match(licence,/MIT License/);
  assert.match(licence,/Copyright \(c\) Microsoft Corporation/);
});

test("the vocabulary picture shows the meaning on learn cards and in practice before Check",()=>{
  const {app,elements}=runtime();
  const figure=()=>elements.get("card-picture");
  const learn=stageVariants(app,"travel-transport","travel-transport-words-learn");
  const bus=learn.variants.find(card=>card.word==="der Bus");
  app.renderCard("travel-transport",learn.stageIndex,bus);
  assert.equal(figure().hidden,false);
  assert.equal(figure().children.length,1);
  const image=figure().children[0];
  assert.equal(image.tagName,"IMG");
  assert.deepEqual({...image.attributes},{src:"assets/icons/bus.svg",alt:"",width:"96",height:"96",draggable:"false"});
  app.renderCard("travel-transport",learn.stageIndex,bus);
  assert.equal(figure().children[0],image,"the same picture is not rebuilt");

  const platform=learn.variants.find(card=>card.word==="der Bahnsteig");
  app.renderCard("travel-transport",learn.stageIndex,platform);
  assert.equal(figure().hidden,true);
  assert.equal(figure().children.length,0);

  const practice=stageVariants(app,"travel-transport","travel-actions-recall");
  const call=practice.variants.find(card=>card.word==="anrufen");
  for(const status of ["","correct","revealed"]){
    app.renderCard("travel-transport",practice.stageIndex,call,status);
    assert.equal(figure().hidden,false,status);
    assert.equal(figure().children[0].attributes.src,"assets/icons/telephone-receiver.svg",status);
  }
});

test("answer visuals stay hidden in practice until Check while meaning visuals stay available",()=>{
  const {app,elements}=runtime();
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const [stageIndex,stage] of definition.stages.entries()){
      if(stage.mode!=="input")continue;
      for(const card of app.variantsForStage(stage)){
        app.renderCard(lessonId,stageIndex,card);
        const label=`${stage.id}: ${card.id}`;
        assert.equal(elements.get("card-paradigm").hidden,true,label);
        assert.equal(elements.get("card-paradigm").children.length,0,label);
        assert.equal(elements.get("card-auxiliary").hidden,true,label);
        assert.equal(elements.get("card-auxiliary").children.length,0,label);
        assert.equal(elements.get("card-structure").hidden,true,label);
        assert.equal(elements.get("card-structure").children.length,0,label);
        const nounWords=card.noun?nounWordsOf(card.noun):[];
        const nounInAnswer=card.response.accepted.some(answer=>nounWords.some(word=>standaloneCount(answer,word)>0));
        assert.equal(elements.get("noun-gender").hidden,!card.noun||(nounInAnswer&&!card.noun.givenInPractice),label);
        assert.equal(elements.get("card-illustration").hidden,!card.scene,label);
        assert.equal(elements.get("card-frequency").hidden,!card.frequency,label);
        assert.equal(descendants(elements.get("card-frequency")).some(node=>node.tagName==="OL"),false,label);
        assert.equal(elements.get("card-clock").hidden,!card.clock,label);
        assert.equal(elements.get("card-clock").children.length,card.clock?1:0,label);
        const clockArt=card.clock?elements.get("card-clock").children[0].innerHTML:"";
        assert.doesNotMatch(clockArt,/clock-sector/,label);
        assert.equal(elements.get("card-picture").hidden,!card.picture,label);
        assert.equal(elements.get("card-picture").children.length,card.picture?1:0,label);
        if(card.picture){
          const meaningShown=elements.get("question-word").textContent.includes(card.translation)||Boolean(card.support&&elements.get("prompt-support").textContent===card.support);
          assert.ok(meaningShown,`${label}: the prompt gives the meaning`);
        }
        assert.equal(elements.get("w-badge").textContent,card.cue||"",label);
        const visible=`${elements.get("noun-gender").textContent} ${card.practiceSupport?elements.get("prompt-support").textContent:""} ${elements.get("card-frequency").textContent} ${clockArt}`;
        for(const answer of card.response.accepted){
          assert.equal(app.standaloneOccurrence(visible,answer.replace(/[?!.,]+$/,"")),null,`${label}: ${answer}`);
        }
        for(const status of ["correct","revealed"]){
          app.renderCard(lessonId,stageIndex,card,status);
          assert.equal(elements.get("card-paradigm").hidden,!card.paradigm,`${label}: ${status}`);
          assert.equal(elements.get("card-auxiliary").hidden,!card.auxiliary,`${label}: ${status}`);
          assert.equal(elements.get("card-structure").hidden,!card.structure,`${label}: ${status}`);
          assert.equal(descendants(elements.get("card-frequency")).some(node=>node.tagName==="OL"),Boolean(card.frequency),`${label}: ${status}`);
          assert.equal(elements.get("card-clock").children.length,card.clock?2:0,`${label}: ${status}`);
          assert.equal(elements.get("card-picture").hidden,!card.picture,`${label}: ${status}`);
          assert.equal(elements.get("noun-gender").hidden,!card.noun,`${label}: ${status}`);
          assert.equal(elements.get("example").textContent.length>0,true,`${label}: ${status}`);
        }
      }
    }
  }
});

test("lessons without visual metadata render no visuals",()=>{
  const {app,elements}=runtime();
  const card=app.variantsForStage(app.definitions.pronouns.stages[0])[0];
  app.renderCard("pronouns",0,card);
  for(const id of ["card-illustration","card-clock","card-picture","noun-gender","card-frequency","card-paradigm","card-auxiliary","card-structure","w-badge"])assert.equal(elements.get(id).hidden,true,id);
  assert.equal(elements.get("question-word").textContent,card.word);
  assert.equal(elements.get("example").children.length,0);
  assert.equal(elements.get("example").textContent,card.example||card.word);
});

test("guide tables show what changes and follow the concealment rule",()=>{
  const {app,elements}=runtime();
  const lesson=app.definitions["possessive-cases"];
  const card=lesson.cards.find(item=>item.id==="possessive-accusative-masculine-brother");
  const guideNodes=()=>descendants(elements.get("deck-guide-rules"));
  const tables=()=>guideNodes().filter(node=>node.tagName==="TABLE");
  const notes=()=>guideNodes().filter(node=>node.className==="guide-table-note");
  app.renderCard("possessive-cases",1,card);
  assert.equal(tables().length,1);
  const rows=descendants(tables()[0]).filter(node=>node.tagName==="TR");
  assert.deepEqual(rows.map(row=>row.textContent),["derdasdiePlural","Nom.——-e-e","Akk.-en—-e-e","Dat.-em-em-er-en"]);
  const changed=descendants(tables()[0]).filter(node=>node.className?.split(" ").includes("changed"));
  assert.equal(changed.length,1);
  assert.equal(changed[0].textContent,"-en");
  assert.equal(changed[0].children[0].tagName,"MARK");
  assert.equal(rows[2].children.indexOf(changed[0]),1);
  assert.equal(notes().length,1);
  assert.match(notes()[0].textContent,/лише der/);

  const leaks=[
    {title:"Leak",detail:"",table:{columns:[{label:"der",gender:"masculine"}],rows:[{label:"Akk.",cells:[card.word]}]}},
    {title:"Leak",detail:"",table:{columns:[{label:"der",gender:"masculine"}],rows:[{label:"Akk.",cells:["-en"]}],note:`Наприклад: ${card.word}.`}}
  ];
  for(const leak of leaks){
    lesson.guide.rules.push(leak);
    try{
      app.renderCard("possessive-cases",1,card);
      assert.equal(tables().length,1);
      assert.equal(notes().length,1);
      assert.equal(elements.get("guide-answer-note").hidden,false);
      app.renderCard("possessive-cases",1,card,"correct");
      assert.equal(tables().length,2);
    }finally{
      lesson.guide.rules.pop();
    }
  }

  // A cell can also leak when read together with its header, e.g. "auf" + "dem Tisch".
  const local=app.definitions["local-prepositions"];
  const localCard=local.cards.find(item=>item.id==="local-dative-auf-tisch");
  const localStage=local.stages.findIndex(stage=>stage.mode==="input");
  local.guide.rules.push({title:"Combined",detail:"",table:{columns:[{label:"auf"}],rows:[{label:"Wo?",cells:["dem Tisch"]}]}});
  try{
    app.renderCard("local-prepositions",localStage,localCard);
    assert.equal(tables().length,1);
    app.renderCard("local-prepositions",localStage,localCard,"correct");
    assert.equal(tables().length,2);
  }finally{
    local.guide.rules.pop();
  }
});

test("case tables and paradigms list Nom., Akk., Dat. in order",()=>{
  const {app}=runtime();
  const caseRank=entry=>{
    const text=`${entry.title||""} ${entry.label||""}`;
    if(/Nominativ|^Nom\./.test(text))return 0;
    if(/Akkusativ|\bAkk\./.test(text))return 1;
    if(/Dativ|\bDat\./.test(text))return 2;
    return null;
  };
  const assertOrder=(entries,where)=>{
    const ranks=Array.from(entries,caseRank).filter(rank=>rank!==null);
    assert.deepEqual(ranks,[...ranks].sort((a,b)=>a-b),where);
  };
  let checked=0;
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    const tables=definition.guide.rules.filter(rule=>typeof rule==="object"&&rule.table).map(rule=>rule.table);
    const paradigms=definition.stages.flatMap(stage=>stage.cards).map(card=>card.paradigm).filter(Boolean);
    for(const table of [...tables,...paradigms]){
      assertOrder(table.rows,`${lessonId}: rows`);
      assertOrder(table.columns,`${lessonId}: columns`);
      checked++;
    }
  }
  assert.ok(checked>0);
});

test("guide tables are well formed across lessons",()=>{
  const {app,elements}=runtime();
  const withTables=[];
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    const tables=definition.guide.rules.filter(rule=>typeof rule==="object"&&rule.table).map(rule=>rule.table);
    if(tables.length)withTables.push(lessonId);
    for(const table of tables){
      for(const row of table.rows)assert.equal(row.cells.length,table.columns.length,`${lessonId}: ${row.label}`);
      for(const {row,column} of table.highlights||[])assert.ok(table.rows[row]&&table.columns[column],`${lessonId}: highlight ${row}/${column}`);
    }
  }
  assert.deepEqual(withTables.sort(),["conjugation","dative-verbs","es-gibt-leisure","haben","indefinite-articles","koennen","local-prepositions","mit-ohne","personal-pronoun-cases","possessive-cases","possessives","sein","strong-verbs","temporal-prepositions","travel-transport","werden"]);
  const card=app.definitions["personal-pronoun-cases"].stages[0].cards[0];
  app.renderCard("personal-pronoun-cases",0,card);
  const table=descendants(elements.get("deck-guide-rules")).find(node=>node.tagName==="TABLE");
  const header=descendants(table).find(node=>node.tagName==="TR");
  assert.deepEqual(header.children.slice(1).map(cell=>cell.textContent),["Nom.","Akk.","Dat."]);
  assert.deepEqual(header.children.slice(1).map(cell=>cell.children[0].title),["Nominativ","Akkusativ","Dativ"]);
  const er=descendants(table).filter(node=>node.tagName==="TR").find(row=>row.textContent.startsWith("er"));
  assert.equal(er.children[0].children[0].className,"gender-dot gender-masculine");
  assert.equal(er.textContent,"ererihnihm");
});

// Rule illustrations: one approved card component per rule, showing that rule's own example.
const ruleVisualCoverage={
  "w-questions":["1:structure","2:structure"],
  "word-order":["2:structure","3:structure","4:structure","5:structure","6:structure"],
  "separable-verbs":["1:structure","2:structure","3:structure","4:structure","5:structure"],
  frequency:["1:frequency","2:structure","3:structure"],
  perfekt:["1:structure","2:auxiliary","3:auxiliary"],
  "past-verbs":["2:auxiliary"],
  "past-verbs-a2":["3:auxiliary"],
  "past-verbs-b1":["3:auxiliary"],
  koennen:["3:structure"],
  "strong-verbs":["4:structure"],
  "everyday-vocabulary":["2:structure","3:pictures"],
  "travel-transport":["1:pictures","4:structure"],
  "giving-directions":["1:structure","2:pictures","3:structure"],
  "temporal-prepositions":["7:clocks","8:structure"],
  "time-expressions":["1:clocks","6:clocks"],
  "local-prepositions":["1:scenes","2:scenes","4:scenes"],
  "time-worksheet-vocabulary":["1:pictures"],
  "es-gibt-leisure":["3:pictures"],
  werden:["4:structure"],
  "mit-ohne":["8:structure"]
};

function ruleText(rule){
  return typeof rule==="string"?rule:[rule.title,rule.detail,rule.formula].filter(Boolean).join(" ");
}

function guideFigures(elements){
  return descendants(elements.get("deck-guide-rules")).filter(node=>node.tagName==="FIGURE");
}

test("rule illustrations are explicit, valid and show their own rule's example",()=>{
  const {app}=runtime();
  const {existsSync}=require("node:fs");
  const cards=Object.values(app.definitions).flatMap(definition=>definition.stages.flatMap(stage=>app.variantsForStage(stage)));
  const coverage={};
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    definition.guide.rules.forEach((rule,ruleIndex)=>{
      if(typeof rule==="string"||!rule.visual)return;
      const label=`${lessonId} rule ${ruleIndex+1}`;
      const kinds=Object.keys(rule.visual);
      assert.equal(kinds.length,1,`${label}: one illustration per rule`);
      const [kind]=kinds,value=rule.visual[kind];
      assert.ok(app.ruleVisualKinds.includes(kind),`${label}: ${kind}`);
      (coverage[lessonId]||=[]).push(`${ruleIndex+1}:${kind}`);
      const text=ruleText(rule);
      const shown=part=>assert.ok(app.standaloneOccurrence(text,part.replace(/[.?!]$/,"")),`${label}: ${part}`);
      if(kind==="structure"){
        for(const clause of value){
          const roles=Array.from(clause,slot=>slot.role);
          const order=[["first","verb","middle","end"],["verb","middle","end"],["link","middle","end"]].find(candidate=>candidate[0]===roles[0]);
          assert.ok(order,`${label}: ${roles}`);
          assert.deepEqual(roles,order.filter(role=>roles.includes(role)),`${label}: order`);
          for(const slot of clause)assert.ok(slot.text&&slot.text===slot.text.trim(),label);
        }
        shown(structureText(value));
      }
      if(kind==="auxiliary"){
        assert.ok(value.verb===undefined||["haben","sein"].includes(value.verb),label);
        shown(value.verb||"haben");
        shown(value.verb||"sein");
      }
      if(kind==="frequency"){
        assert.equal(value.scale,app.frequencyScale,`${label}: the shared scale`);
        for(const step of value.scale)shown(step.word);
      }
      if(kind==="clocks")for(const clock of value){
        assert.ok(Number.isInteger(clock.hour)&&clock.hour>=1&&clock.hour<=12,label);
        assert.ok(Number.isInteger(clock.minute)&&clock.minute>=0&&clock.minute<60,label);
        shown(clock.text);
      }
      if(kind==="scenes")for(const scene of value){
        assert.ok(app.sceneArt(scene),`${label}: unknown scene ${scene.kind}`);
        if(scene.cue)assert.equal(scene.cue,scene.motion?"Wohin?":"Wo?",label);
        shown(scene.text);
      }
      if(kind==="pictures")for(const item of value){
        assert.notEqual(Boolean(item.noun),Boolean(item.word),`${label}: a noun or a word`);
        assert.ok(existsSync(join(__dirname,`../assets/icons/${item.picture}.svg`)),label);
        const word=item.noun?item.noun.word:item.word;
        const card=cards.find(candidate=>candidate.picture===item.picture&&(item.noun?candidate.noun?.word===word:candidate.word===word));
        assert.ok(card,`${label}: ${item.picture} means ${word} on no card`);
        if(item.noun){
          assert.equal(item.noun.gender,card.noun.gender,label);
          if(item.noun.plural)assert.equal(item.noun.plural.word,card.noun.plural?.word,label);
          shown(`${articles[item.noun.gender]} ${item.noun.word}`);
        }else shown(item.word);
      }
    });
  }
  assert.deepEqual(coverage,ruleVisualCoverage);
});

test("rule illustrations show in the guide and wait for Check when they would reveal the answer",()=>{
  const {app,elements}=runtime();
  const firstLearn=lessonId=>{
    const stageIndex=app.definitions[lessonId].stages.findIndex(stage=>stage.mode!=="input");
    return {stageIndex,card:app.variantsForStage(app.definitions[lessonId].stages[stageIndex])[0]};
  };
  const show=lessonId=>{const {stageIndex,card}=firstLearn(lessonId);app.renderCard(lessonId,stageIndex,card);return guideFigures(elements)};

  const perfekt=show("perfekt");
  assert.deepEqual(perfekt.map(figure=>figure.className),["guide-rule-visual guide-visual-structure","guide-rule-visual guide-visual-auxiliary","guide-rule-visual guide-visual-auxiliary"]);
  const activeChoice=figure=>descendants(figure).filter(node=>node.className?.includes?.("auxiliary-choice")&&node.className.includes("active")).map(node=>node.textContent);
  assert.deepEqual(perfekt.slice(1).map(figure=>activeChoice(figure).map(text=>text.split("рух")[0].split("дія")[0])),[["haben"],["sein"]]);
  const pastAuxiliary=show("past-verbs").find(figure=>figure.className.endsWith("auxiliary"));
  assert.equal(activeChoice(pastAuxiliary).length,0,"a rule about both auxiliaries marks neither");

  const tiles=figure=>descendants(figure).filter(node=>node.className==="guide-visual-item");
  const pictures=show("travel-transport").find(figure=>figure.className.endsWith("pictures"));
  assert.deepEqual(tiles(pictures).map(tile=>[tile.children[0].attributes.src,tile.children[0].attributes.width,tile.children[1].textContent]),[
    ["assets/icons/station.svg","48","der Bahnhof"],["assets/icons/bus-stop.svg","48","die Haltestelle"],["assets/icons/baggage-claim.svg","48","das Gepäck"]
  ]);
  assert.equal(tiles(pictures)[0].children[0].attributes.alt,"");
  assert.equal(descendants(tiles(pictures)[1]).find(node=>node.className?.startsWith?.("gender-dot")).className,"gender-dot gender-feminine");

  const clocks=show("time-expressions").filter(figure=>figure.className.endsWith("clocks"));
  assert.deepEqual(tiles(clocks[1]).map(tile=>tile.children.slice(1).map(node=>node.textContent)),[["fünf nach zehn","5 хв після 10"],["zehn vor sechs","10 хв до 6"],["halb vier","½ години до 4"]]);
  assert.match(tiles(clocks[1])[0].children[0].innerHTML,/clock-sector/);

  const scenes=show("local-prepositions").filter(figure=>figure.className.endsWith("scenes"));
  const scene=tiles(scenes[2])[1];
  assert.match(scene.children[0].innerHTML,/^<svg viewBox="0 0 240 128" aria-hidden="true"/);
  assert.deepEqual(scene.children.slice(1).map(node=>[node.className,node.lang]),[["guide-visual-cue","de"],["guide-visual-text","de"]]);
  assert.equal(scene.children[1].textContent,"Wohin?");

  let concealed=0;
  for(const lessonId of Object.keys(ruleVisualCoverage)){
    const total=ruleVisualCoverage[lessonId].length;
    for(const [stageIndex,stage] of app.definitions[lessonId].stages.entries()){
      if(stage.mode!=="input")continue;
      for(const card of app.variantsForStage(stage)){
        const label=`${stage.id}: ${card.id}`;
        app.renderCard(lessonId,stageIndex,card);
        const before=guideFigures(elements);
        const texts=before.flatMap(figure=>[
          ...descendants(figure).map(node=>node.textContent),
          ...descendants(figure).filter(node=>node.tagName==="OL").map(list=>list.children.map(item=>item.children[0]?.textContent??item.textContent).join(" "))
        ]);
        for(const answer of card.response.accepted){
          for(const text of texts)assert.equal(app.standaloneOccurrence(text,answer.replace(/[?!.,]+$/,"")),null,`${label}: ${answer} in ${text}`);
        }
        if(before.length<total){
          concealed++;
          assert.equal(elements.get("guide-answer-note").hidden,false,label);
        }
        app.renderCard(lessonId,stageIndex,card,"correct");
        assert.equal(guideFigures(elements).length,total,`${label}: after Check`);
      }
    }
  }
  assert.ok(concealed>0,"some illustrations wait for Check");
});

test("the shared visual renderer has no lesson-specific branches",()=>{
  const names=["answerVisualsShown","sceneArt","sceneMarkup","renderCardScene","formSegments","formNodes","nounEntries","nounEntryNodes","nounPhrase","nounLineShown","headwordNoun","genderDot",
    "renderNounGender","grammarTable","endingLabel","renderCardParadigm","auxiliaryList","renderCardAuxiliary","structureSentence","renderCardStructure","frequencyScaleNode","renderCardFrequency","clockReading","clockPoint","clockLine","clockFace","renderCardClock","pictureImage","renderCardPicture","renderCardVisuals",
    "ruleVisualTexts","ruleVisualItem","germanSpan","ruleVisual","renderDeckGuide","renderStudyHeadword","exampleFocus","textSpan","renderExample","practiceSupport"];
  for(const name of names){
    const start=source.indexOf(`function ${name}(`);
    assert.ok(start>=0,name);
    const end=source.indexOf("\nfunction ",start+1);
    const body=source.slice(start,end);
    assert.doesNotMatch(body,/activeDeckId|deckDefinitions|local-prepositions|possessive/,name);
  }
  assert.doesNotMatch(source,/locationScene|renderLocationIllustration/);
});

test("long headwords and prompts expose their longest unbreakable run",()=>{
  const {app,elements}=runtime();
  const single=findCard(app,"travel-transport",item=>item.word==="der Bahnhof");
  app.renderCard("travel-transport",single.stageIndex,single.card);
  const headword=elements.get("question-word");
  assert.equal(headword.style.properties["--fit-chars"],String("der Bahnhof".length+1));

  const pair=findCard(app,"es-gibt-leisure",item=>item.word==="das Kino / die Kinos");
  app.renderCard("es-gibt-leisure",pair.stageIndex,pair.card);
  const groups=headword.children.filter(child=>child.className==="headword-noun");
  assert.equal(groups[0].textContent,"das Kino /");
  assert.equal(groups[1].textContent,"die Kinos");
  assert.equal(headword.textContent,"das Kino / die Kinos");
  assert.equal(headword.style.properties["--fit-chars"],String("das Kino /".length+1));

  const phrase=findCard(app,"travel-transport",item=>item.word==="mit dem Zug fahren");
  app.renderCard("travel-transport",phrase.stageIndex,phrase.card);
  assert.equal(headword.style.properties["--fit-chars"],"6");

  const sentence=findCard(app,"word-order",item=>item.type==="sentence-build"&&item.promptText?.includes(" / "));
  app.renderCard("word-order",sentence.stageIndex,sentence.card,"");
  const runs=descendants(headword).filter(child=>child.className==="text-run");
  assert.ok(runs.length>1);
  assert.ok(runs.every(run=>!run.textContent.startsWith("/")));
  assert.ok(headword.textContent.endsWith(sentence.card.promptText.split(": ").at(-1)));
  assert.ok(Number(headword.style.properties["--fit-chars"])>=Math.max(...runs.map(run=>run.textContent.length)));
});

test("slash texts keep their words and never let a line start with the slash",()=>{
  const {app}=runtime();
  const text=runs=>[...runs.nodes].map(node=>node.textContent).join("");
  const marked=runs=>[...runs.nodes].filter(node=>node.className==="text-run").map(node=>node.textContent);

  const chunks=app.slashRuns("Ich lerne / heute / in der Bibliothek",true);
  assert.equal(text(chunks),"Ich lerne / heute / in der Bibliothek");
  assert.deepEqual(marked(chunks),["Ich lerne /","heute /","in der Bibliothek"]);
  assert.equal(chunks.chars,"in der Bibliothek".length);

  const alternatives=app.slashRuns("я зробив домашнє завдання / я виконав домашнє завдання",true);
  assert.equal(text(alternatives),"я зробив домашнє завдання / я виконав домашнє завдання");
  assert.deepEqual(marked(alternatives),["завдання /","завдання"]);
  assert.equal(alternatives.chars,"завдання /".length);

  const words=app.slashRuns("heute / morgen");
  assert.deepEqual(marked(words),["heute /","morgen"]);
  assert.equal(text(words),"heute / morgen");

  assert.deepEqual({...app.slashRuns("der Weihnachtsmann")},{nodes:null,chars:"Weihnachtsmann".length});
});

test("the library groups every lesson by class in course-path order",()=>{
  const {app,elements}=runtime();
  const classNames=[...app.lessonClasses].map(lessonClass=>lessonClass.name);
  assert.deepEqual(classNames,["Лексика","Морфологія","Граматика","Синтаксис"]);
  for(const lessonClass of app.lessonClasses){
    assert.ok(app.lessonClassGlyphs[lessonClass.glyph],lessonClass.name);
    assert.ok(lessonClass.summary,lessonClass.name);
  }
  for(const [lessonId,catalog] of Object.entries(app.lessonCatalog)){
    assert.ok(classNames.includes(catalog.className),lessonId);
    assert.equal(catalog.color,undefined,lessonId);
  }

  app.renderLibrary();
  const groups=[...elements.get("section-grid").children];
  assert.deepEqual(groups.map(group=>group.className),Array(4).fill("library-group"));
  const expected=classNames.map(name=>Object.keys(app.definitions).filter(lessonId=>app.definitions[lessonId].catalog.className===name));
  groups.forEach((group,groupIndex)=>{
    const [header,grid]=group.children;
    const [glyph,text,count]=header.children;
    const heading=text.children[0];
    assert.equal(heading.tagName,"H3");
    assert.equal(heading.textContent,classNames[groupIndex]);
    assert.equal(group.attributes["aria-labelledby"],heading.id);
    assert.equal(glyph.attributes["aria-hidden"],"true");
    assert.equal(glyph.dataset.glyph,app.lessonClasses[groupIndex].glyph);
    assert.match(glyph.innerHTML,/^<svg viewBox="0 0 24 24" focusable="false">/);
    assert.match(count.textContent,new RegExp(`^${expected[groupIndex].length} урок`));
    assert.deepEqual([...grid.children].map(article=>descendants(article).find(child=>child.tagName==="H4").textContent),
      expected[groupIndex].map(lessonId=>app.definitions[lessonId].title));
    for(const article of grid.children){
      const parts=descendants(article);
      assert.equal(parts.find(child=>child.className==="class-glyph").attributes["aria-hidden"],"true");
      assert.ok(parts.some(child=>child.className==="section-outcome"&&child.textContent));
      assert.ok(parts.some(child=>child.className.startsWith("status-badge ")&&child.textContent));
      assert.equal(article.children.at(-1).tagName,"BUTTON");
    }
  });
  assert.equal(expected.flat().length,Object.keys(app.definitions).length);
});
