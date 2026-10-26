const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="mit-ohne";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,context));
const card=id=>lesson.cards.find(item=>item.id===id);
const chapterTargets=[5,5,5,2];

function runtime(saved=new Map()){
  const elements=new Map(),requests=[];
  class Element{
    constructor(tag="div"){
      this.tagName=tag.toUpperCase();
      this.children=[];
      this.attributes={};
      this.dataset={};
      this.listeners={};
      this.className="";
      this.hidden=false;
      this.value="";
      this.text="";
      this.style={setProperty:()=>{}};
      this.classList={
        contains:name=>this.className.split(/\s+/).includes(name),
        add:name=>{if(!this.classList.contains(name))this.className+=` ${name}`},
        remove:name=>{this.className=this.className.split(/\s+/).filter(item=>item!==name).join(" ")},
        toggle:(name,force)=>{
          const enabled=force===undefined?!this.classList.contains(name):force;
          this.classList[enabled?"add":"remove"](name);
          return enabled;
        }
      };
    }
    get textContent(){return this.text+this.children.map(child=>child.textContent).join("")}
    set textContent(value){this.text=value==null?"":String(value);this.children=[]}
    append(...children){this.children.push(...children.flatMap(child=>child.tagName==="#DOCUMENT-FRAGMENT"?child.children:[child]))}
    appendChild(child){this.append(child)}
    replaceChildren(...children){this.text="";this.children=[];this.append(...children)}
    setAttribute(name,value){this.attributes[name]=value}
    addEventListener(name,listener){this.listeners[name]=listener}
    focus(){document.activeElement=this}
    select(){}
    closest(){return ["BUTTON","A","INPUT"].includes(this.tagName)?this:null}
    click(){this.listeners.click?.({target:this,currentTarget:this,preventDefault(){},stopPropagation(){}})}
  }
  const document={
    activeElement:null,listeners:{},
    createElement:tag=>new Element(tag),
    createDocumentFragment:()=>new Element("#document-fragment"),
    createTextNode:text=>({textContent:text}),
    getElementById(id){
      if(!elements.has(id)){
        const element=new Element(id==="verification-input"?"input":"div");
        element.id=id;
        element.parentElement=new Element();
        elements.set(id,element);
      }
      return elements.get(id);
    },
    querySelector:selector=>document.getElementById(selector),
    querySelectorAll(selector){
      if(selector===".nav-item")return ["library","practice","progress"].map(view=>{
        const element=document.getElementById(`nav-${view}`);
        element.dataset.view=view;
        return element;
      });
      if(selector===".view")return ["library","practice","progress"].map(view=>document.getElementById(`${view}-view`));
      return [];
    },
    addEventListener(name,listener){this.listeners[name]=listener}
  };
  const storage=values=>({getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)});
  const bootstrap=source.lastIndexOf("\nresumeInitialSession();");
  assert.ok(bootstrap>0);
  const sandbox=vm.createContext({
    document,Element,crypto:{randomUUID},console,
    window:{scrollTo:()=>{},addEventListener:()=>{}},
    localStorage:storage(saved),sessionStorage:storage(new Map()),
    requestAnimationFrame:callback=>callback(),matchMedia:()=>({matches:true}),
    fetch:async(url,options)=>{
      requests.push({url,...options});
      return {ok:true};
    }
  });
  vm.runInContext(script,sandbox);
  vm.runInContext(`${source.slice(0,bootstrap)}
    globalThis.runtime={
      definitions:deckDefinitions,samplePass,variantsForStage,answerMatches,lessonState,
      canResume,normalizeState,lessonStatus,persistState,
      resume(){resumeInitialSession();restorePendingCompletion()},
      get state(){return learningState},
      get card(){return deck[index]},
      get index(){return index}
    };
  })();`,sandbox);
  const app=sandbox.runtime;
  function key(key,target=document.getElementById("verification-input")){
    document.listeners.keydown({key,target,preventDefault(){}});
  }
  function answer(value){
    const input=document.getElementById("verification-input");
    input.value=value;
    input.listeners.input({target:input});
    key("Enter");
  }
  function open(stageIndex){
    document.getElementById("nav-library").click();
    const descendants=element=>element.children.flatMap(child=>[child,...descendants(child)]);
    const article=descendants(document.getElementById("section-grid")).find(item=>item.tagName==="ARTICLE"&&
      descendants(item).some(child=>child.tagName==="H4"&&child.textContent===app.definitions[lessonId].title));
    assert.ok(article,"lesson must be discoverable in the library");
    article.children.at(-1).click();
    if(stageIndex!==undefined){
      const row=document.getElementById("lesson-steps").children[Math.floor(stageIndex/2)];
      row.children[1].children[stageIndex%2].click();
    }
  }
  return {app,elements,saved,requests,key,answer,open};
}

test("four chapters pair a learn stage with a practice stage over the same pool, with at least three variants per target",()=>{
  assert.equal(lesson.cards.length,57);
  assert.equal(new Set(lesson.cards.map(item=>item.id)).size,57);
  assert.equal(lesson.stages.length,8);
  assert.equal(new Set(lesson.stages.map(stage=>stage.chapter)).size,4);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards,practice.cards);
    const targets=new Set(learn.cards.map(item=>item.targetId));
    assert.equal(targets.size,chapterTargets[index/2],learn.id);
    for(const targetId of targets)assert.ok(learn.cards.filter(item=>item.targetId===targetId).length>=3,targetId);
  }
  assert.deepEqual(lesson.stages.flatMap(stage=>stage.cards).map(item=>item.id).filter((id,index,all)=>all.indexOf(id)===index).sort(),
    lesson.cards.map(item=>item.id).sort());
});

test("cloze cards have one gap, rebuild the example and show phrase scope only for multi-word answers",()=>{
  const cloze=lesson.cards.filter(item=>item.type==="cloze");
  assert.equal(cloze.length,51);
  for(const item of cloze){
    assert.equal(item.word,item.response.accepted[0],item.id);
    assert.equal(item.promptText.split("___").length,2,item.id);
    assert.equal(item.promptText.replace("___",item.word),item.example,item.id);
    assert.equal(item.support,item.translation,item.id);
    assert.ok(item.translation&&item.explanation,item.id);
    assert.ok(item.explanation.length<=220,item.id);
    assert.equal(item.practiceVariants,false,item.id);
    assert.equal(item.response.mode,"text");
    assert.equal(item.response.caseSensitive,false);
    assert.equal(item.response.punctuationSensitive,false);
    assert.equal(item.response.scope,item.word.includes(" ")?"phrase":"word",item.id);
  }
});

test("each cloze card names the preposition and case its category promises",()=>{
  for(const item of lesson.cards.filter(item=>item.type==="cloze")){
    const preposition=item.word.split(" ")[0];
    if(item.targetId.startsWith("mit-ohne-wahl")){
      assert.equal(item.category,"MIT ODER OHNE · BEDEUTUNG",item.id);
      assert.ok(["mit","ohne"].includes(item.word),item.id);
    }else if(item.targetId.startsWith("mit-")){
      assert.match(item.category,/^MIT \+ DATIV · /,item.id);
      assert.equal(preposition,"mit",item.id);
    }else{
      assert.match(item.category,/^OHNE \+ AKKUSATIV · /,item.id);
      assert.equal(preposition,"ohne",item.id);
    }
  }
});

test("the guide has Dativ after mit, Akkusativ after ohne, and one visual for the sentence opener",()=>{
  const tables=lesson.guide.rules.filter(rule=>rule.table).map(rule=>rule.table);
  assert.equal(tables.length,2);
  for(const table of tables)assert.deepEqual(table.columns.map(column=>column.label),["der","das","die","Plural"]);
  assert.deepEqual(tables[0].rows[1],{label:"Dat.",title:"mit + Dativ",cells:["dem","dem","der","den"]});
  assert.deepEqual(tables[1].rows[1],{label:"Akk.",title:"ohne + Akkusativ",cells:["den","das","die","die"]});
  assert.equal(lesson.guide.rules.filter(rule=>rule.visual).length,1);
  const text=JSON.stringify(lesson.guide);
  for(const expected of ["mit dem Bus","ohne den","ohne Milch","ohne seinen"]) assert.ok(text.includes(expected),expected);
});

test("sentence builds keep the verb second in both orders and expose the same words",()=>{
  const fronted={
    "satzbau-mit-bus":"Heute","satzbau-mit-freunde":"Am Abend","satzbau-mit-bahn":"In die Stadt",
    "satzbau-ohne-urlaub":"Im Sommer","satzbau-ohne-bruder":"Heute","satzbau-ohne-stress":"Für die Prüfung"
  };
  const sentences=lesson.cards.filter(item=>item.type==="sentence-build");
  assert.deepEqual(sentences.map(item=>item.id).sort(),Object.keys(fronted).sort());
  const normalized=sentence=>sentence.replace(/[.!?]$/,"").toLowerCase().split(" ").sort().join(" ");
  for(const item of sentences){
    assert.equal(item.response.scope,"sentence",item.id);
    assert.equal(item.response.accepted.length,2,item.id);
    assert.equal(item.word,item.response.accepted[0],item.id);
    assert.equal(item.example,item.response.accepted[1],item.id);
    assert.ok(item.promptText.includes(" / "),item.id);
    assert.match(item.support,/[а-яіїєґ]/i,item.id);
    assert.equal(item.structure.length,1,item.id);
    assert.equal(item.structure[0].map(slot=>slot.text).join(" ").replace(/[.!?]$/,""),item.word.replace(/[.!?]$/,""),item.id);
    const [canonical,alternative]=item.response.accepted;
    const verb=item.structure[0].find(slot=>slot.role==="verb").text;
    assert.ok(alternative.startsWith(`${fronted[item.id]} ${verb} `),item.id);
    assert.equal(normalized(alternative),normalized(canonical),item.id);
    assert.match(canonical,/\b(mit|ohne)\b/,item.id);
  }
});

test("evaluation accepts every listed answer and rejects the wrong preposition, article or word order",()=>{
  const {app}=runtime();
  const find=id=>app.definitions[lessonId].cards.find(item=>item.id===id);
  for(const stage of app.definitions[lessonId].stages){
    for(const item of stage.cards){
      for(const answer of item.response.accepted)assert.ok(app.answerMatches(`  ${answer}  `,item),item.id);
      assert.ok(!app.answerMatches("wrong",item),item.id);
    }
  }
  assert.ok(app.answerMatches("MIT SEINEM",find("mit-begleitung-seinem-hund")));
  assert.ok(app.answerMatches("Mit seinem.",find("mit-begleitung-seinem-hund")));
  assert.ok(app.answerMatches("Ich heute fahre mit dem Bus zur Arbeit.",find("satzbau-mit-bus"))===false);
  for(const [id,wrongAnswers] of [
    ["mit-begleitung-seinem-hund",["mit","mit dem","ohne seinem"]],
    ["mit-mittel-bahn",["mit dem","mit die","ohne der"]],
    ["mit-mittel-rad",["mit das","ohne dem"]],
    ["mit-art-und-weise-liebe",["ohne","mit den"]],
    ["mit-zutat-pilze",["ohne","mit den"]],
    ["mit-pronomen-dir",["mit dich","ohne dir","mit du"]],
    ["mit-pronomen-ihm",["mit ihn","mit ihnen"]],
    ["ohne-artikel-mantel",["ohne","mit den","ohne dem"]],
    ["ohne-artikel-auto",["ohne die","mit das"]],
    ["ohne-possessiv-schirm",["ohne den","ohne sein","mit seinen"]],
    ["ohne-possessiv-tasche",["ohne deinen","mit deiner"]],
    ["ohne-indefinit-hut",["ohne den","ohne einer","ohne eine"]],
    ["ohne-indefinit-jacke",["ohne einen","ohne eines"]],
    ["ohne-ohne-artikel-zucker",["ohne den","mit"]],
    ["ohne-ohne-artikel-dressing",["ohne das","mit"]],
    ["ohne-pronomen-mich",["ohne mir","mit mich","ohne ich"]],
    ["ohne-pronomen-ihn",["ohne ihm","ohne den"]],
    ["mit-ohne-wahl-zutat-brot",["ohne"]],
    ["mit-ohne-wahl-zutat-kuchen",["mit"]],
    ["mit-ohne-wahl-zahlung-geld",["mit","mit Geld"]],
    ["satzbau-mit-bus",["Ich heute fahre mit dem Bus zur Arbeit."]],
    ["satzbau-ohne-bruder",["Heute er kommt ohne seinen Bruder zur Party."]]
  ]){
    for(const answer of wrongAnswers)assert.ok(!app.answerMatches(answer,find(id)),`${id}: ${answer}`);
  }
});

test("shared sampling covers each chapter and rotates every variant of each target before repeating",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
    const covered=new Set(),cycles=new Map(),allTargets=new Set(stage.cards.map(item=>item.targetId));
    const variantCount=targetId=>stage.cards.filter(item=>item.targetId===targetId).length;
    for(let passIndex=0;passIndex<9;passIndex++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,Math.min(7,allTargets.size),stage.id);
      assert.equal(new Set(pass.map(item=>item.targetId)).size,pass.length,stage.id);
      for(const item of pass){
        const cycle=cycles.get(item.targetId)||new Set();
        if(cycle.size===variantCount(item.targetId))cycle.clear();
        assert.ok(!cycle.has(item.id),`${stage.id}: ${item.id} repeated before all variants appeared`);
        cycle.add(item.id);
        cycles.set(item.targetId,cycle);
        covered.add(item.targetId);
      }
      const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
      app.lessonState(lessonId)[collection][stage.id]=[...covered];
      if(passIndex===Math.ceil(allTargets.size/7)-1)assert.equal(covered.size,allTargets.size,stage.id);
    }
  }
});

test("cloze practice hides the preposition until Check and then names its case",()=>{
  const ui=runtime();
  ui.open(1);
  const first=ui.app.card;
  assert.equal(ui.elements.get("category-label").textContent,"Mit чи ohne · Пропуск");
  assert.equal(ui.elements.get("question-word").textContent,first.promptText);
  assert.ok(ui.elements.get("check-button").disabled);
  ui.answer(first.word);
  const expected=first.category.startsWith("MIT + DATIV")?"mit + Dativ":"ohne + Akkusativ";
  assert.ok(ui.elements.get("category-label").textContent.startsWith(expected),ui.elements.get("category-label").textContent);
  assert.equal(ui.elements.get("feedback-title").textContent,`Правильно — ${first.word}`);
});

test("library, learn cards and practice corrections use the shared UI",()=>{
  const ui=runtime();
  ui.open(0);
  assert.equal(ui.elements.get("deck-label-de").textContent,"Präpositionen mit und ohne");
  assert.equal(ui.elements.get("lesson-chapter-count").textContent,"Розділ 1 з 4");
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.word);
  assert.equal(ui.elements.get("example").textContent,ui.app.card.example);
  ui.open(3);
  const first=ui.app.card;
  ui.answer("wrong");
  assert.equal(ui.elements.get("feedback-title").textContent,`Не зовсім — ${first.word}`);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  assert.ok(!ui.elements.get("correction-display").hidden);
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
});

test("all eight stages complete through bounded passes and the lesson becomes mastered",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<8;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    const isComplete=()=>{
      const state=ui.app.lessonState(lessonId);
      return (stage.mode==="input"?state.masteredPractice:state.completedLearn).includes(stage.id);
    };
    ui.open(stageIndex);
    for(let pass=0;pass<4&&!isComplete();pass++){
      for(let step=0;ui.app.state.activeSession&&step<10;step++){
        if(stage.mode==="input"){
          ui.answer(ui.app.card.word);
          ui.key("Enter");
        }else ui.key("ArrowRight",ui.elements.get("flashcard"));
      }
      assert.equal(ui.app.state.activeSession,null,stage.id);
      assert.ok(!ui.elements.get("celebration").hidden,stage.id);
      if(isComplete()){
        ui.elements.get("completion-library").click();
        break;
      }
      ui.elements.get("completion-primary").click();
    }
    assert.ok(isComplete(),stage.id);
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  await ui.app.persistState();
  const durable=JSON.parse(ui.requests.at(-1).body);
  assert.equal(durable.lessons[lessonId].completedLearn.length,4);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,4);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
});
