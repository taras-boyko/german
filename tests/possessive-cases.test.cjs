const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="possessive-cases";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,context));
const endings={
  accusative:{masculine:"en",neuter:"",feminine:"e",plural:"e"},
  dative:{masculine:"em",neuter:"em",feminine:"er",plural:"en"}
};

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
      this.textContent="";
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
    append(...children){this.children.push(...children.flatMap(child=>child.tagName==="#DOCUMENT-FRAGMENT"?child.children:[child]))}
    appendChild(child){this.append(child)}
    replaceChildren(...children){this.children=[];this.append(...children)}
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
    const article=document.getElementById("section-grid").children.find(item=>
      item.children.some(child=>child.textContent===app.definitions[lessonId].title));
    assert.ok(article,"lesson must be discoverable in the library");
    article.children.at(-1).click();
    if(stageIndex!==undefined){
      const row=document.getElementById("lesson-steps").children[Math.floor(stageIndex/2)];
      row.children[1].children[stageIndex%2].click();
    }
  }
  return {app,elements,saved,requests,key,answer,open};
}

test("the complete case/gender paradigm has five explicit natural variants per target",()=>{
  assert.equal(lesson.cards.length,40);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,40);
  for(const [grammaticalCase,genders] of Object.entries(endings)){
    for(const [gender,ending] of Object.entries(genders)){
      const targetId=`possessive-${grammaticalCase}-${gender}`;
      const variants=lesson.cards.filter(card=>card.targetId===targetId);
      assert.equal(variants.length,5,targetId);
      const answers=variants.map(card=>card.response.accepted[0]);
      assert.ok(answers.includes(`${ending?"eur":"euer"}${ending}`),targetId);
      assert.ok(answers.includes(`Ihr${ending}`),targetId);
      for(const card of variants){
        assert.equal(card.type,"cloze",card.id);
        assert.equal(card.word,card.response.accepted[0],card.id);
        assert.equal(card.promptText.split("___").length,2,card.id);
        assert.equal(card.promptText.replace("___",card.word),card.example,card.id);
        assert.match(card.support,/Іменник: (?:der|das|die) /,card.id);
        assert.match(card.support,/власни[кц]/,card.id);
        assert.ok(card.translation&&card.studyTranslation&&card.explanation,card.id);
        assert.ok(card.explanation.length<=220,card.id);
        assert.match(card.explanation,new RegExp(grammaticalCase==="dative"?"Dativ":"Akkusativ"),card.id);
        assert.equal(card.practiceVariants,false,card.id);
        assert.equal(card.response.mode,"text");
        assert.equal(card.response.scope,"word");
        assert.equal(card.response.punctuationSensitive,false);
        assert.equal(typeof card.response.caseSensitive,"boolean");
      }
    }
  }
});

test("the guide reproduces all three reference rows and explains special forms and plural nouns",()=>{
  const guide=lesson.guide.rules;
  assert.ok(guide.some(rule=>rule.formula==="Nominativ: — · — · -e · -e"));
  assert.ok(guide.some(rule=>rule.formula==="Dativ: -em · -em · -er · -en"));
  assert.ok(guide.some(rule=>rule.formula==="Akkusativ: -en · — · -e · -e"));
  const text=JSON.stringify(guide);
  for(const expected of ["er/es → sein","sie (вона) → ihr","sie (вони) → ihr","Sie (ввічливо) → Ihr",
    "eure, euren, eurem, eurer","на -n або -s","Kindern","Freunden","Eltern","Autos"]){
    assert.ok(text.includes(expected),expected);
  }
  for(const [id,noun] of [
    ["possessive-dative-plural-your-friends","Freunden"],
    ["possessive-dative-plural-our-children","Kindern"],
    ["possessive-dative-plural-their-cars","Autos"],
    ["possessive-dative-plural-your-parents","Eltern"]
  ]){
    const card=lesson.cards.find(card=>card.id===id);
    assert.ok(card.example.includes(noun),id);
    assert.ok(card.explanation.includes("-n"),id);
  }
});

test("all chapters share explicit pools and mixed prompts do not disclose the case",()=>{
  assert.equal(lesson.stages.length,6);
  assert.equal(new Set(lesson.stages.map(stage=>stage.chapter)).size,3);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards,practice.cards);
    assert.equal(new Set(learn.cards.map(card=>card.targetId)).size,index===4?8:4);
  }
  for(const card of lesson.stages[5].cards){
    assert.doesNotMatch(`${card.promptText} ${card.support} ${card.category}`,/Akkusativ|Dativ|AKKUSATIV|DATIV/,card.id);
  }
  const direction=lesson.cards.find(card=>card.id==="possessive-accusative-neuter-your-house");
  const location=lesson.cards.find(card=>card.id==="possessive-dative-neuter-your-house");
  assert.match(direction.promptText,/in ___ Haus/);
  assert.match(location.promptText,/in ___ Haus/);
  assert.equal(direction.word,"euer");
  assert.equal(location.word,"eurem");
});

test("shared sampling covers the closed paradigms and rotates variants independently per sequence",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
    const covered=new Set(),cycles=new Map(),allTargets=new Set(stage.cards.map(card=>card.targetId));
    let previous=[];
    for(let passIndex=0;passIndex<12;passIndex++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,Math.min(7,allTargets.size),stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length,stage.id);
      assert.notEqual(pass[0].id,previous[0],stage.id);
      for(const card of pass){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===5)cycle.clear();
        assert.ok(!cycle.has(card.id),`${stage.id}: ${card.id} repeated before all variants appeared`);
        cycle.add(card.id);
        cycles.set(card.targetId,cycle);
        covered.add(card.targetId);
      }
      const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
      app.lessonState(lessonId)[collection][stage.id]=[...covered];
      if(passIndex===Math.ceil(allTargets.size/7)-1)assert.equal(covered.size,allTargets.size,stage.id);
      previous=pass.map(card=>card.id);
    }
  }
});

test("evaluation accepts declared contractions but rejects wrong stems, endings and register",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    for(const card of stage.cards){
      for(const answer of card.response.accepted)assert.ok(app.answerMatches(`  ${answer}!  `,card),card.id);
      assert.ok(!app.answerMatches(`${card.word} extra`,card),card.id);
      assert.ok(!app.answerMatches("wrong",card),card.id);
      if(card.response.caseSensitive){
        const wrongCase=card.word[0]===card.word[0].toUpperCase()?card.word.toLowerCase():`I${card.word.slice(1)}`;
        assert.ok(!app.answerMatches(wrongCase,card),card.id);
      }
    }
  }
  const cards=app.definitions[lessonId].stages.flatMap(stage=>stage.cards);
  for(const [id,wrongAnswers] of [
    ["possessive-accusative-masculine-brother",["mein","meinem","meine","deinen"]],
    ["possessive-dative-feminine-my-sister",["meine","meinem","meinen"]],
    ["possessive-accusative-neuter-your-house",["eur","eure","euren","eurem"]],
    ["possessive-dative-plural-our-children",["unsere","unserem","unser"]],
    ["possessive-accusative-masculine-formal-passport",["ihren","Ihr","Ihrem"]]
  ]){
    for(const answer of wrongAnswers)assert.ok(!app.answerMatches(answer,cards.find(card=>card.id===id)),`${id}: ${answer}`);
  }
});

test("library, learn cards, free chapter navigation and persistence use the shared UI",()=>{
  const ui=runtime();
  ui.open(0);
  assert.equal(ui.elements.get("deck-label-de").textContent,"Possessivartikel: Akkusativ und Dativ");
  assert.equal(ui.elements.get("lesson-chapter-count").textContent,"Розділ 1 з 3");
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.word);
  assert.equal(ui.elements.get("example").textContent,ui.app.card.example);
  assert.ok(!ui.elements.get("deck-guide-disclosure").open);
  ui.key("ArrowRight",ui.elements.get("flashcard"));
  const {updatedAt,...before}=ui.app.state.activeSession;
  ui.elements.get("lesson-library").click();
  const {updatedAt:afterUpdatedAt,...after}=ui.app.state.activeSession;
  assert.deepEqual(after,before);
  const restored=runtime(ui.saved);
  restored.app.resume();
  assert.equal(restored.app.index,1);
  assert.equal(JSON.stringify(restored.app.state.activeSession.order),JSON.stringify(ui.app.state.activeSession.order));
  restored.open(5);
  restored.answer("unsubmitted wrong answer");
  const order=[...restored.app.state.activeSession.order];
  restored.open(3);
  assert.ok(restored.app.state.suspendedSessions[`${lessonId}::possessive-cases-mixed-practice`].session);
  restored.open(5);
  assert.deepEqual([...restored.app.state.activeSession.order],order);
  assert.equal(restored.elements.get("verification-input").value,"unsubmitted wrong answer");
  assert.equal(restored.app.state.activeSession.cardStatus["0"],"wrong");
  assert.ok(restored.app.canResume(lessonId,restored.app.definitions[lessonId].stages[5]));
});

test("practice conceals answers, requires input, gives corrections, retries misses and completes after repair",()=>{
  const ui=runtime();
  ui.open(1);
  const originalOrder=[...ui.app.state.activeSession.order],first=ui.app.card;
  assert.equal(ui.elements.get("question-word").textContent,first.promptText);
  assert.ok(ui.elements.get("check-button").disabled);
  assert.equal(ui.elements.get("answer").style.display,"none");
  assert.equal(ui.app.index,0);
  ui.key("Enter");
  assert.equal(ui.app.state.activeSession.firstAttemptTotal,0);
  ui.key("ArrowRight",ui.elements.get("flashcard"));
  assert.equal(ui.app.index,0);
  ui.answer("wrong");
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  assert.equal(ui.elements.get("feedback-title").textContent,`Не зовсім — ${first.word}`);
  assert.ok(!ui.elements.get("correction-display").hidden);
  assert.equal(ui.elements.get("correction-text").children[0].children[2].textContent,first.word);
  assert.deepEqual([...ui.app.state.activeSession.retryPositions],[3]);
  assert.equal(ui.app.state.activeSession.order[3],first.id);
  assert.equal(ui.app.state.activeSession.order.length,originalOrder.length+1);
  ui.key("Enter");
  assert.equal(ui.app.index,1);
  let repaired=false;
  for(let steps=0;ui.app.state.activeSession&&steps<10;steps++){
    const card=ui.app.card;
    if(card.retry){
      repaired=true;
      assert.ok(ui.app.index>=3);
      assert.equal(card.targetId,first.targetId);
    }
    ui.answer(card.word);
    assert.equal(ui.elements.get("feedback-title").textContent,`Правильно — ${card.word}`);
    assert.equal(ui.elements.get("feedback-detail").textContent,"");
    ui.key("Enter");
  }
  assert.ok(repaired);
  assert.equal(ui.app.state.activeSession,null);
  assert.ok(!ui.elements.get("celebration").hidden);
  const completion=ui.app.state.pendingCompletion;
  assert.equal(completion.session.firstAttemptTotal,4);
  assert.equal(completion.session.firstAttemptCorrect,3);
  assert.equal(completion.session.passMastered.length,4);
  assert.equal(completion.session.retryQueue.length,0);
  assert.ok(ui.app.lessonState(lessonId).masteredPractice.includes("possessive-cases-accusative-practice"));
  const restored=runtime(ui.saved);
  restored.app.resume();
  assert.ok(!restored.elements.get("celebration").hidden);
  assert.equal(restored.app.state.pendingCompletion.id,completion.id);
  restored.elements.get("completion-primary").click();
  assert.equal(restored.app.state.activeSession.sequenceId,"possessive-cases-dative-learn");
  assert.ok(restored.elements.get("celebration").hidden);
});

test("all six stages complete through bounded passes and durable state includes the new lesson",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<6;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    ui.open(stageIndex);
    for(let pass=0;pass<2;pass++){
      const order=[...ui.app.state.activeSession.order];
      for(let step=0;ui.app.state.activeSession&&step<10;step++){
        if(stage.mode==="input"){
          ui.answer(ui.app.card.word);
          ui.key("Enter");
        }else ui.key("ArrowRight",ui.elements.get("flashcard"));
      }
      assert.equal(ui.app.state.activeSession,null,stage.id);
      assert.ok(!ui.elements.get("celebration").hidden,stage.id);
      const state=ui.app.lessonState(lessonId);
      const completed=stage.mode==="input"?state.masteredPractice:state.completedLearn;
      if(completed.includes(stage.id)){
        ui.elements.get("completion-library").click();
        break;
      }
      assert.equal(stageIndex>=4,true,stage.id);
      ui.elements.get("completion-primary").click();
      assert.notDeepEqual([...ui.app.state.activeSession.order],order,stage.id);
    }
    const state=ui.app.lessonState(lessonId);
    assert.ok((stage.mode==="input"?state.masteredPractice:state.completedLearn).includes(stage.id),stage.id);
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  await ui.app.persistState();
  assert.equal(ui.requests.length,1);
  assert.equal(ui.requests[0].url,"/api/lesson-history");
  assert.equal(ui.requests[0].method,"PUT");
  const durable=JSON.parse(ui.requests[0].body);
  assert.equal(durable.version,5);
  assert.equal(durable.lessons[lessonId].completedLearn.length,3);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,3);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
  assert.deepEqual(JSON.parse(JSON.stringify(restored.app.lessonState(lessonId))),durable.lessons[lessonId]);
});
