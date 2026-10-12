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
      this.style={setProperty:()=>{}};
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
      definitions:deckDefinitions,variantsForStage,sceneArt,genderLabels,standaloneOccurrence,
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
    "everyday-vocabulary":8,"travel-transport":42,"giving-directions":6,"es-gibt-leisure":44
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
  assert.deepEqual(covered,{sein:22,conjugation:66,"strong-verbs":120,koennen:36,haben:54});
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
  koennen:stage=>stage.id.startsWith("koennen-order-"),
  perfekt:(stage,card)=>card.id.startsWith("perfekt-frame-")
};
const structureCounts={"separable-verbs":28,"word-order":37,koennen:25,perfekt:12};

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
        assert.equal(elements.get("w-badge").textContent,card.cue||"",label);
        const visible=`${elements.get("noun-gender").textContent} ${card.practiceSupport?elements.get("prompt-support").textContent:""}`;
        for(const answer of card.response.accepted){
          assert.equal(app.standaloneOccurrence(visible,answer.replace(/[?!.,]+$/,"")),null,`${label}: ${answer}`);
        }
        for(const status of ["correct","revealed"]){
          app.renderCard(lessonId,stageIndex,card,status);
          assert.equal(elements.get("card-paradigm").hidden,!card.paradigm,`${label}: ${status}`);
          assert.equal(elements.get("card-auxiliary").hidden,!card.auxiliary,`${label}: ${status}`);
          assert.equal(elements.get("card-structure").hidden,!card.structure,`${label}: ${status}`);
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
  for(const id of ["card-illustration","noun-gender","card-paradigm","card-auxiliary","card-structure","w-badge"])assert.equal(elements.get(id).hidden,true,id);
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
  assert.deepEqual(withTables.sort(),["conjugation","dative-verbs","es-gibt-leisure","haben","koennen","local-prepositions","personal-pronoun-cases","possessive-cases","possessives","sein","strong-verbs","travel-transport"]);
  const card=app.definitions["personal-pronoun-cases"].stages[0].cards[0];
  app.renderCard("personal-pronoun-cases",0,card);
  const table=descendants(elements.get("deck-guide-rules")).find(node=>node.tagName==="TABLE");
  const er=descendants(table).filter(node=>node.tagName==="TR").find(row=>row.textContent.startsWith("er"));
  assert.equal(er.children[0].children[0].className,"gender-dot gender-masculine");
  assert.equal(er.textContent,"erihnihm");
});

test("the shared visual renderer has no lesson-specific branches",()=>{
  const names=["answerVisualsShown","sceneArt","renderCardScene","formSegments","formNodes","nounEntries","nounPhrase","nounLineShown","headwordNoun","genderDot",
    "renderNounGender","grammarTable","endingLabel","renderCardParadigm","renderCardAuxiliary","renderCardStructure","renderCardVisuals","renderStudyHeadword","exampleFocus","textSpan","renderExample","practiceSupport"];
  for(const name of names){
    const start=source.indexOf(`function ${name}(`);
    assert.ok(start>=0,name);
    const end=source.indexOf("\nfunction ",start+1);
    const body=source.slice(start,end);
    assert.doesNotMatch(body,/activeDeckId|deckDefinitions|local-prepositions|possessive/,name);
  }
  assert.doesNotMatch(source,/locationScene|renderLocationIllustration/);
});
