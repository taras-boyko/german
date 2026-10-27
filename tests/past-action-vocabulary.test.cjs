const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="past-action-vocabulary";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const expected=["gearbeitet","gewohnt","geglaubt","gesucht","gesprochen","gekostet","gefunden",
  "gesagt","gebraucht","geschrieben","gewusst","eingeladen","gelacht","gesungen","gefrühstückt",
  "gelernt","geliebt","gesehen","getrunken","angerufen","eingekauft","genommen","aufgeräumt","geredet","gedacht"];

function runtime(saved=new Map()){
  const elements=new Map(),requests=[];
  class Element{
    constructor(tag="div"){
      this.tagName=tag.toUpperCase();this.children=[];this.attributes={};this.dataset={};this.listeners={};
      this.className="";this.hidden=false;this.value="";this.text="";this.style={setProperty:()=>{}};
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
        element.id=id;element.parentElement=new Element();elements.set(id,element);
      }
      return elements.get(id);
    },
    querySelector:selector=>document.getElementById(selector),
    querySelectorAll(selector){
      if(selector===".nav-item")return ["library","practice","progress"].map(view=>{
        const element=document.getElementById(`nav-${view}`);element.dataset.view=view;return element;
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
    document,Element,crypto:{randomUUID},console,window:{scrollTo:()=>{},addEventListener:()=>{}},
    localStorage:storage(saved),sessionStorage:storage(new Map()),
    requestAnimationFrame:callback=>callback(),matchMedia:()=>({matches:true}),
    fetch:async(url,options)=>{requests.push({url,...options});return {ok:true}}
  });
  vm.runInContext(script,sandbox);
  vm.runInContext(`${source.slice(0,bootstrap)}
    globalThis.runtime={definitions:deckDefinitions,lessonCatalog,samplePass,variantsForStage,answerMatches,
      lessonState,lessonCoverage,lessonStatus,persistState,
      resume(){resumeInitialSession();restorePendingCompletion()},
      show(card){deck=[card];index=0;verificationMode=true;verified=false;answerRevealed=false;render()},
      get state(){return learningState},get card(){return deck[index]},get index(){return index}};
  })();`,sandbox);
  const app=sandbox.runtime;
  function key(key,target=document.getElementById("verification-input")){
    document.listeners.keydown({key,target,preventDefault(){}});
  }
  function answer(value){
    const input=document.getElementById("verification-input");
    input.value=value;input.listeners.input({target:input});key("Enter");
  }
  function open(stageIndex){
    document.getElementById("nav-library").click();
    const descendants=element=>element.children.flatMap(child=>[child,...descendants(child)]);
    const article=descendants(document.getElementById("section-grid")).find(item=>item.tagName==="ARTICLE"&&
      descendants(item).some(child=>child.tagName==="H4"&&child.textContent===app.definitions[lessonId].title));
    assert.ok(article,"lesson is available in the library");
    article.children.at(-1).click();
    if(stageIndex!==undefined)document.getElementById("lesson-steps").children[Math.floor(stageIndex/2)].children[1].children[stageIndex%2].click();
  }
  return {app,elements,saved,requests,key,answer,open};
}

test("the lesson covers every pictured participle with contextual variants in both directions",()=>{
  const {app}=runtime(),lesson=app.definitions[lessonId];
  assert.equal(app.lessonCatalog[lessonId].className,"Лексика");
  assert.deepEqual([...new Set(lesson.cards.map(card=>card.word))].sort(),expected.sort());
  assert.equal(new Set(lesson.cards.map(card=>card.targetId)).size,25);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,150);
  assert.equal(lesson.stages.length,6);
  for(let i=0;i<lesson.stages.length;i+=2){
    const learn=lesson.stages[i],practice=lesson.stages[i+1];
    assert.equal(learn.mode,"learn");assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual([...new Set(learn.cards.map(card=>card.targetId))].sort(),[...new Set(practice.cards.map(card=>card.targetId))].sort());
    for(const target of new Set(practice.cards.map(card=>card.targetId))){
      const variants=practice.cards.filter(card=>card.targetId===target);
      assert.equal(variants.filter(card=>card.type==="recall").length,3,target);
      assert.equal(variants.filter(card=>card.type==="recall-reverse").length,3,target);
      assert.equal(learn.cards.filter(card=>card.targetId===target).length,3,target);
      for(const card of variants){
        assert.ok(card.id&&card.targetId&&card.example.includes(card.word),card.id);
        assert.equal(card.response.mode,"text",card.id);
        assert.ok(app.answerMatches(card.response.accepted[0],card),card.id);
        assert.ok(!app.answerMatches(`${card.response.accepted[0]} зайве`,card),card.id);
        if(card.type==="recall"){
          assert.ok(!card.promptText.includes(card.word),card.id);
          assert.deepEqual([...card.response.accepted],[card.word]);
        }else{
          assert.ok(card.promptText.includes(card.word),card.id);
          for(const answer of card.response.accepted)assert.ok(!card.promptText.toLowerCase().includes(answer.toLowerCase()),card.id);
        }
      }
    }
  }
});

test("both practice directions hide answers and use the correct input language",()=>{
  const ui=runtime();ui.open(1);
  for(const card of ui.app.definitions[lessonId].cards){
    ui.app.show(card);
    assert.equal(ui.elements.get("answer").style.display,"none",card.id);
    assert.equal(ui.elements.get("translation").hidden,true,card.id);
    assert.equal(ui.elements.get("verification-input").lang,card.type==="recall-reverse"?"uk":"de",card.id);
  }
});

test("bounded passes cover each target and rotate variants before repeating",()=>{
  const {app}=runtime(),lesson=app.lessonState(lessonId);
  for(const stage of app.definitions[lessonId].stages){
    const targets=new Set(stage.cards.map(card=>card.targetId)),seen=new Set(),cycles=new Map();
    for(let pass=0;pass<8;pass++){
      const cards=app.samplePass(lessonId,stage);
      assert.equal(cards.length,Math.min(7,targets.size));
      assert.equal(new Set(cards.map(card=>card.targetId)).size,cards.length);
      for(const card of cards){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===stage.cards.filter(item=>item.targetId===card.targetId).length)cycle.clear();
        assert.ok(!cycle.has(card.id),card.id);cycle.add(card.id);cycles.set(card.targetId,cycle);seen.add(card.targetId);
      }
      (stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets)[stage.id]=[...seen];
    }
    assert.equal(seen.size,targets.size,stage.id);
  }
});

test("practice hides answers, reports a miss, retries it and restores the completion",()=>{
  const ui=runtime();ui.open(1);
  const first=ui.app.card;
  assert.equal(ui.elements.get("answer").style.display,"none");
  assert.equal(ui.elements.get("translation").hidden,true);
  assert.equal(ui.elements.get("check-button").disabled,true);
  ui.key("Enter");assert.equal(ui.app.state.activeSession.firstAttemptTotal,0);
  ui.answer("неправильно");
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  ui.key("Enter");
  let repaired=false;
  for(let step=0;ui.app.state.activeSession&&step<20;step++){
    const card=ui.app.card;
    if(card.retry){assert.equal(card.targetId,first.targetId);repaired=true}
    ui.answer(card.response.accepted[0]);ui.key("Enter");
  }
  assert.ok(repaired);
  assert.equal(ui.app.state.activeSession,null);
  assert.equal(ui.elements.get("celebration").hidden,false);
  const completion=ui.app.state.pendingCompletion;
  assert.equal(completion.session.firstAttemptTotal,7);
  assert.equal(completion.session.firstAttemptCorrect,6);
  const restored=runtime(ui.saved);restored.app.resume();
  assert.equal(restored.app.state.pendingCompletion.id,completion.id);
  assert.equal(restored.elements.get("celebration").hidden,false);
});

test("all chapters complete through bounded passes and survive restoration",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<6;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    ui.open(stageIndex);
    const collection=stage.mode==="input"?"masteredPractice":"completedLearn";
    for(let pass=0;pass<8&&!ui.app.lessonState(lessonId)[collection].includes(stage.id);pass++){
      for(let step=0;ui.app.state.activeSession&&step<30;step++){
        if(stage.mode==="input"){ui.answer(ui.app.card.response.accepted[0]);ui.key("Enter")}
        else ui.key("ArrowRight",ui.elements.get("flashcard"));
      }
      assert.equal(ui.app.state.activeSession,null,stage.id);
      if(!ui.app.lessonState(lessonId)[collection].includes(stage.id))ui.elements.get("completion-primary").click();
    }
    assert.ok(ui.app.lessonState(lessonId)[collection].includes(stage.id),stage.id);
    ui.elements.get("completion-library").click();
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  assert.equal(ui.app.lessonCoverage(lessonId).covered,25);
  await ui.app.persistState();
  const durable=JSON.parse(ui.requests.at(-1).body);
  assert.equal(durable.lessons[lessonId].completedLearn.length,3);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,3);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
});

test("switching stages suspends and restores an unfinished pass",()=>{
  const ui=runtime();ui.open(0);
  ui.key("ArrowRight",ui.elements.get("flashcard"));
  const index=ui.app.index,order=[...ui.app.state.activeSession.order];
  ui.open(1);ui.open(0);
  assert.equal(ui.app.index,index);
  assert.deepEqual([...ui.app.state.activeSession.order],order);
  const restored=runtime(ui.saved);restored.app.resume();
  assert.equal(restored.app.index,index);
  assert.deepEqual([...restored.app.state.activeSession.order],order);
});
