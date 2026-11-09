const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="praeteritum-haben-sein";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const dataContext=vm.createContext({});
vm.runInContext(script,dataContext);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,dataContext));
const find=id=>lesson.cards.find(card=>card.id===id);
const descendants=element=>(element.children||[]).flatMap(child=>[child,...descendants(child)]);

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
    fetch:async(url,options)=>{requests.push({url,...options});return {ok:true}}
  });
  vm.runInContext(script,sandbox);
  vm.runInContext(`${source.slice(0,bootstrap)}
    globalThis.runtime={
      definitions:deckDefinitions,lessonCatalog,samplePass,variantsForStage,answerMatches,lessonState,
      lessonCoverage,coveragePercent,lessonStatus,persistState,
      resume(){resumeInitialSession();restorePendingCompletion()},
      get state(){return learningState},get card(){return deck[index]},get index(){return index}
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
    const article=descendants(document.getElementById("section-grid")).find(item=>item.tagName==="ARTICLE"&&
      descendants(item).some(child=>child.tagName==="H4"&&child.textContent===app.definitions[lessonId].title));
    assert.ok(article,"lesson must be discoverable in the library");
    article.children.at(-1).click();
    const row=document.getElementById("lesson-steps").children[Math.floor(stageIndex/2)];
    row.children[1].children[stageIndex%2].click();
  }
  return {app,elements,saved,requests,key,answer,open};
}

test("the lesson has four paired chapters and 75 explicit variants of 25 targets",()=>{
  const {app}=runtime();
  assert.equal(app.lessonCatalog[lessonId].className,"Морфологія");
  assert.equal(app.lessonCatalog[lessonId].level,"A1");
  assert.equal(lesson.cards.length,75);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,75);
  assert.equal(lesson.stages.length,8);
  assert.equal(app.lessonCoverage(lessonId).total,25);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards,practice.cards);
    const targets=new Set(practice.cards.map(card=>card.targetId));
    assert.equal(targets.size,[6,6,7,6][index/2]);
    for(const target of targets){
      const variants=practice.cards.filter(card=>card.targetId===target);
      assert.equal(variants.length,3,target);
      assert.equal(new Set(variants.map(card=>card.promptText)).size,3,target);
    }
    for(const card of practice.cards){
      assert.ok(card.id&&card.targetId&&card.explanation,card.id);
      assert.ok(["cloze","sentence-build"].includes(card.type),card.id);
      assert.equal(card.response.mode,"text",card.id);
      assert.equal(card.practiceVariants,false,card.id);
    }
  }
});

test("all persons of haben and sein use the correct Präteritum forms and person strips",()=>{
  const expected={
    sein:["war","warst","war","waren","wart","waren"],
    haben:["hatte","hattest","hatte","hatten","hattet","hatten"]
  };
  const persons=["ich","du","er","wir","ihr","sie"];
  for(const [verb,forms] of Object.entries(expected)){
    persons.forEach((person,index)=>{
      const cards=lesson.cards.filter(card=>card.targetId===`praeteritum-${verb}-${person}`);
      assert.equal(cards.length,3,`${verb} ${person}`);
      for(const card of cards){
        assert.equal(card.response.accepted[0],forms[index],card.id);
        assert.equal(card.paradigm.active.column,index,card.id);
        assert.equal(card.paradigm.rows[0].title,"Präteritum",card.id);
        assert.deepEqual(card.paradigm.rows[0].cells.map(cell=>cell.stem+cell.ending),forms,card.id);
        assert.equal(card.answerParts.stem+card.answerParts.ending,forms[index],card.id);
      }
    });
  }
});

test("each cloze has one unambiguous gap and never shows its answer in the prompt or support",()=>{
  const {app}=runtime();
  const cards=lesson.cards.filter(card=>card.type==="cloze");
  assert.equal(cards.length,57);
  for(const card of cards){
    const answer=card.response.accepted[0];
    assert.equal(card.response.scope,"word",card.id);
    assert.equal(card.promptText.split("___").length,2,card.id);
    assert.equal(card.example.toLowerCase(),card.promptText.replace("___",answer).toLowerCase(),card.id);
    assert.equal(card.support,card.translation,card.id);
    const escaped=answer.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    assert.doesNotMatch(`${card.promptText} ${card.support}`,new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,"iu"),card.id);
    assert.ok(app.answerMatches(answer.toUpperCase(),card),card.id);
    assert.ok(!app.answerMatches(`${answer} extra`,card),card.id);
  }
});

test("worksheet situations include location, state, possession and the winter story",()=>{
  for(const [id,example] of [
    ["praeteritum-sein-wir-italien","Letztes Jahr waren wir in Italien im Urlaub."],
    ["praeteritum-choice-film","Der Film war sehr spannend."],
    ["praeteritum-choice-fenster","Das alte Haus hatte viele schöne Fenster."],
    ["praeteritum-choice-kamin","Die Hütte hatte einen Kamin."],
    ["praeteritum-story-besitzer","In der Hütte waren die Besitzer sehr freundlich."],
    ["praeteritum-story-karten","Im Urlaub hatten meine Schwester und ich ein Kartenspiel."],
    ["praeteritum-translate-muede","Warst du gestern müde?"],
    ["praeteritum-translate-zeit","Gestern hatte ich keine Zeit."]
  ])assert.equal(find(id).example,example,id);
  const text=JSON.stringify(lesson.guide);
  for(const part of ["Ich bin zu Hause gewesen","Ich habe ein Auto gehabt","повідомленнях","репортажах","Perfekt"])assert.ok(text.includes(part),part);
  assert.ok(lesson.cards.every(card=>!card.auxiliary),"these are main verbs, not Perfekt auxiliaries");
});

test("sentence transformations, word order and constrained translations use full correct sentences",()=>{
  const {app}=runtime();
  const cards=lesson.cards.filter(card=>card.type==="sentence-build");
  assert.equal(cards.length,18);
  for(const card of cards){
    assert.equal(card.response.scope,"sentence",card.id);
    assert.equal(card.structure.length,1,card.id);
    assert.equal(card.structure[0].map(slot=>slot.text).join(" "),card.word.replace(/[.?!]$/,""),card.id);
    assert.equal(card.response.accepted[0],card.word,card.id);
    assert.ok(app.answerMatches(card.word,card),card.id);
    assert.ok(!app.answerMatches(card.word.split(" ").reverse().join(" "),card),card.id);
    if(card.id.startsWith("praeteritum-transform-")){
      assert.match(card.support,/інші слова не змінюй/i,card.id);
      assert.ok(!app.answerMatches(card.promptText,card),card.id);
    }
  }
  assert.ok(!app.answerMatches("Gestern ich hatte keine Zeit.",find("praeteritum-order-gestern-zeit")));
  assert.ok(!app.answerMatches("war",find("praeteritum-choice-fenster")));
  assert.ok(!app.answerMatches("hattest",find("praeteritum-choice-muede")));
});

test("sampling rotates all variants independently in every learn and practice stage",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    const targets=new Set(stage.cards.map(card=>card.targetId)),seen=new Map();
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
    for(let passIndex=0;passIndex<3;passIndex++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,targets.size,stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,targets.size,stage.id);
      for(const card of pass){
        const previous=seen.get(card.targetId)||new Set();
        assert.ok(!previous.has(card.id),`${stage.id}: repeated ${card.id}`);
        previous.add(card.id);
        seen.set(card.targetId,previous);
      }
      const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
      app.lessonState(lessonId)[collection][stage.id]=[...targets];
    }
    for(const variants of seen.values())assert.equal(variants.size,3,stage.id);
  }
});

test("learn, mixed practice, guide concealment, wrong answers and retry use the shared UI",()=>{
  const ui=runtime();
  ui.open(0);
  assert.equal(ui.elements.get("deck-label-de").textContent,"Präteritum: haben und sein");
  assert.equal(ui.elements.get("lesson-chapter-count").textContent,"Розділ 1 з 4");
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.word);
  assert.equal(ui.elements.get("card-paradigm").hidden,false);
  assert.ok(descendants(ui.elements.get("deck-guide-rules")).some(node=>node.tagName==="TABLE"));

  ui.open(5);
  const first=ui.app.card,answer=first.response.accepted[0];
  assert.equal(ui.elements.get("question-word").textContent,first.promptText);
  assert.equal(ui.elements.get("prompt-support").textContent,first.translation);
  assert.equal(ui.elements.get("category-label").textContent,"Минулий час · Пропуск у реченні · Пропуск");
  assert.equal(ui.elements.get("card-paradigm").hidden,true);
  assert.equal(ui.elements.get("card-auxiliary").hidden,true);
  assert.ok(!descendants(ui.elements.get("deck-guide-rules")).some(node=>node.tagName==="TABLE"));
  assert.ok(!ui.elements.get("guide-answer-note").hidden);
  assert.ok(ui.elements.get("check-button").disabled);
  ui.answer("wrong");
  assert.equal(ui.elements.get("feedback-title").textContent,`Не зовсім — ${answer}`);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  assert.equal(ui.elements.get("card-paradigm").hidden,false);
  assert.ok(descendants(ui.elements.get("deck-guide-rules")).some(node=>node.tagName==="TABLE"));
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
  assert.equal(ui.app.state.activeSession.order[3],first.id);
  ui.key("Enter");
  for(let step=0;step<2;step++){
    ui.answer(ui.app.card.response.accepted[0]);
    ui.key("Enter");
  }
  assert.equal(ui.app.card.targetId,first.targetId);
  assert.equal(ui.app.card.retry,true);
  ui.answer(answer);
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
  assert.equal(ui.app.state.activeSession.firstAttemptTotal,3);
  assert.equal(ui.app.state.activeSession.firstAttemptCorrect,2);
  assert.ok(!ui.app.state.activeSession.retryQueue.includes(first.targetId));
});

test("all stages complete and their coverage and persisted progress restore",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<lesson.stages.length;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    ui.open(stageIndex);
    for(let step=0;ui.app.state.activeSession&&step<9;step++){
      if(stage.mode==="input"){
        ui.answer(ui.app.card.response.accepted[0]);
        ui.key("Enter");
      }else ui.key("ArrowRight",ui.elements.get("flashcard"));
    }
    assert.equal(ui.app.state.activeSession,null,stage.id);
    assert.ok(!ui.elements.get("celebration").hidden,stage.id);
    const state=ui.app.lessonState(lessonId);
    assert.ok((stage.mode==="input"?state.masteredPractice:state.completedLearn).includes(stage.id),stage.id);
    ui.elements.get("completion-library").click();
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  assert.equal(ui.app.lessonCoverage(lessonId).covered,25);
  assert.equal(ui.app.coveragePercent(ui.app.lessonCoverage(lessonId)),100);
  await ui.app.persistState();
  const durable=JSON.parse(ui.requests.at(-1).body);
  assert.equal(durable.lessons[lessonId].completedLearn.length,4);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,4);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
});

test("switching stages and restarting the runtime resumes the same unfinished pass",()=>{
  const ui=runtime();
  ui.open(3);
  const order=[...ui.app.state.activeSession.order];
  ui.answer(ui.app.card.response.accepted[0]);
  ui.key("Enter");
  assert.equal(ui.app.index,1);
  const currentId=ui.app.card.id;
  ui.open(0);
  const key=`${lessonId}::praeteritum-haben-practice`;
  assert.equal(ui.app.state.suspendedSessions[key].session.index,1);
  ui.open(3);
  assert.deepEqual([...ui.app.state.activeSession.order],order);
  assert.equal(ui.app.card.id,currentId);
  const restored=runtime(ui.saved);
  restored.app.resume();
  assert.deepEqual([...restored.app.state.activeSession.order],order);
  assert.equal(restored.app.index,1);
  assert.equal(restored.app.card.id,currentId);
});
