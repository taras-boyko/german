const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="indefinite-articles";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,context));

// Target → accepted answer for each article, case and gender cell (ein has no plural).
const expectedAnswers={
  "ein-nominative-masculine":"ein","ein-nominative-neuter":"ein","ein-nominative-feminine":"eine",
  "ein-accusative-masculine":"einen","ein-accusative-neuter":"ein","ein-accusative-feminine":"eine",
  "ein-dative-masculine":"einem","ein-dative-neuter":"einem","ein-dative-feminine":"einer",
  "kein-nominative-masculine":"kein","kein-nominative-neuter":"kein","kein-nominative-feminine":"keine","kein-nominative-plural":"keine",
  "kein-accusative-masculine":"keinen","kein-accusative-neuter":"kein","kein-accusative-feminine":"keine","kein-accusative-plural":"keine",
  "kein-dative-masculine":"keinem","kein-dative-neuter":"keinem","kein-dative-feminine":"keiner","kein-dative-plural":"keinen"
};
const negativeTarget=targetId=>targetId.startsWith("kein-");
const variantCounts=stage=>{
  const counts=new Map();
  stage.cards.forEach(card=>counts.set(card.targetId,(counts.get(card.targetId)||0)+1));
  return counts;
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
      definitions:deckDefinitions,samplePass,variantsForStage,answerMatches,lessonState,lessonCoverage,coveragePercent,courseCoverage,
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

test("every target has three learn variants and nine practice variants, each with an explicit natural cue",()=>{
  const learnIds=new Set(lesson.stages.filter(stage=>stage.mode==="learn").flatMap(stage=>stage.cards.map(card=>card.id)));
  assert.equal(learnIds.size,63);
  assert.equal(lesson.cards.length,189);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,189);
  assert.equal(new Set(lesson.cards.map(card=>card.targetId)).size,21);
  for(const [targetId,answer] of Object.entries(expectedAnswers)){
    const variants=lesson.cards.filter(card=>card.targetId===targetId);
    assert.equal(variants.length,9,targetId);
    assert.equal(variants.filter(card=>learnIds.has(card.id)).length,3,targetId);
    for(const card of variants){
      assert.equal(card.type,"cloze",card.id);
      assert.deepEqual(card.response.accepted,[answer],card.id);
      assert.equal(card.word,answer,card.id);
      assert.equal(card.promptText.split("___").length,2,card.id);
      assert.equal(card.promptText.replace("___",card.word),card.example,card.id);
      assert.equal(card.example.split(new RegExp(`\\b${card.word}\\b`)).length-1,1,card.id);
      assert.equal(card.response.mode,"text");
      assert.equal(card.response.scope,"word");
      assert.equal(card.response.punctuationSensitive,false);
      assert.equal(typeof card.response.caseSensitive,"boolean");
      assert.equal(card.practiceVariants,false,card.id);
      assert.ok(card.translation&&card.studyTranslation&&card.explanation,card.id);
      assert.ok(card.explanation.length<=220,card.id);
      assert.doesNotMatch(card.support,/\b(?:ein|eine|einen|einem|einer|kein|keine|keinen|keinem|keiner)\b/i,card.id);
      assert.ok(card.support.startsWith("Ствердження: ")||card.support.startsWith("Заперечення: "),card.id);
      assert.equal(card.support.startsWith("Заперечення: "),negativeTarget(targetId),`${card.id}: cue polarity`);
      assert.notEqual(card.support,card.translation,card.id);
    }
  }
});

test("the guide reproduces the ein and kein paradigms in Nominativ, Akkusativ, Dativ order",()=>{
  const guide=lesson.guide.rules;
  const tables=guide.filter(rule=>rule.table).map(rule=>rule.table);
  assert.equal(tables.length,2);
  const [ein,kein]=tables;
  assert.deepEqual(ein.columns.map(column=>column.label),["der","das","die"]);
  assert.deepEqual(ein.rows.map(row=>[row.title,...row.cells]),[
    ["Nominativ","ein","ein","eine"],
    ["Akkusativ","einen","ein","eine"],
    ["Dativ","einem","einem","einer"]
  ]);
  assert.deepEqual(kein.columns.map(column=>column.label),["der","das","die","Plural"]);
  assert.deepEqual(kein.rows.map(row=>[row.title,...row.cells]),[
    ["Nominativ","kein","kein","keine","keine"],
    ["Akkusativ","keinen","kein","keine","keine"],
    ["Dativ","keinem","keinem","keiner","keinen"]
  ]);
  const text=JSON.stringify(guide);
  for(const expected of ["Das sind keine Bücher.","Ich habe keinen Hund.","Ich habe den Hund nicht.","Er ist Lehrer."]){
    assert.ok(text.includes(expected),expected);
  }
});

test("every card's visual metadata agrees with its answer and gender",()=>{
  for(const card of lesson.cards){
    const [stem,ending]=[card.answerParts.stem,card.answerParts.ending];
    assert.equal(`${stem}${ending}`,card.word,card.id);
    const {paradigm}=card;
    const cell=paradigm.rows[paradigm.active.row].cells[paradigm.active.column];
    assert.equal(`${cell.stem}${cell.ending}`,card.word,card.id);
    assert.equal(paradigm.columns[paradigm.active.column].gender,card.noun.gender,card.id);
    assert.ok(card.noun.word&&card.noun.article,card.id);
    assert.equal(card.noun.article,{masculine:"der",neuter:"das",feminine:"die",plural:"die"}[card.noun.gender],card.id);
    if(card.noun.exampleWord)assert.ok(card.example.includes(card.noun.exampleWord),card.id);
  }
});

test("practice copies hide the gender line, keep every learn variant and triple the learn pool",()=>{
  const stages=lesson.stages;
  assert.equal(stages.length,10);
  assert.equal(new Set(stages.map(stage=>stage.chapter)).size,5);
  for(let index=0;index<stages.length;index+=2){
    const learn=stages[index],practice=stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    const practiceIds=new Set(practice.cards.map(card=>card.id));
    assert.ok(learn.cards.every(card=>practiceIds.has(card.id)),learn.id);
    assert.equal(practice.cards.length,3*learn.cards.length,practice.id);
    assert.ok(learn.cards.every(card=>card.noun),learn.id);
    assert.ok(practice.cards.every(card=>!("noun" in card)),practice.id);
    assert.doesNotMatch(practice.categoryBeforeCheck,/MASKULINUM|NEUTRUM|FEMININUM|PLURAL/,practice.id);
  }
  assert.equal(stages[1].categoryBeforeCheck,"UNBESTIMMTER ARTIKEL · NOMINATIV");
  assert.equal(stages[3].categoryBeforeCheck,"UNBESTIMMTER ARTIKEL · AKKUSATIV");
  assert.equal(stages[5].categoryBeforeCheck,"UNBESTIMMTER ARTIKEL · DATIV");
  assert.equal(stages[7].categoryBeforeCheck,"NEGATIVARTIKEL");
  assert.equal(stages[9].categoryBeforeCheck,"UNBESTIMMTER ARTIKEL · NEGATIVARTIKEL");
  assert.equal(new Set(stages[8].cards.map(card=>card.targetId)).size,21);
  assert.equal(stages[7].cards.length,108);
  assert.equal(stages[9].cards.length,189);
});

test("shared sampling covers every target, rotates variants and keeps passes at seven or fewer",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
    const covered=new Set(),cycles=new Map(),allTargets=new Set(stage.cards.map(card=>card.targetId));
    const variantCount=variantCounts(stage);
    let previous=[];
    const passes=Math.ceil(allTargets.size/7)+2;
    for(let passIndex=0;passIndex<passes*2;passIndex++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,Math.min(7,allTargets.size),stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length,stage.id);
      if(previous.length)assert.notEqual(pass[0].id,previous[0],stage.id);
      for(const card of pass){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===variantCount.get(card.targetId))cycle.clear();
        assert.ok(!cycle.has(card.id),`${stage.id}: ${card.id} repeated before all variants appeared`);
        cycle.add(card.id);
        cycles.set(card.targetId,cycle);
        covered.add(card.targetId);
      }
      const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
      app.lessonState(lessonId)[collection][stage.id]=[...covered];
      previous=pass.map(card=>card.id);
    }
    assert.equal(covered.size,allTargets.size,stage.id);
  }
});

test("shuffle-bag variant coverage holds over long practice runs",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages.filter(item=>item.mode==="input")){
    const variantCount=variantCounts(stage),cycles=new Map(),allTargets=[...variantCount.keys()];
    app.lessonState(lessonId).masteredTargets[stage.id]=allTargets;
    for(let passIndex=0;passIndex<300;passIndex++){
      for(const card of app.samplePass(lessonId,stage)){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===variantCount.get(card.targetId))cycle.clear();
        assert.ok(!cycle.has(card.id),`${stage.id} pass ${passIndex}: ${card.id} repeated before all variants appeared`);
        cycle.add(card.id);
        cycles.set(card.targetId,cycle);
      }
    }
  }
});

test("evaluation accepts the declared article and rejects the neighbouring ein and kein forms",()=>{
  const {app}=runtime();
  const cards=app.definitions[lessonId].stages.flatMap(stage=>stage.cards);
  for(const card of cards){
    assert.ok(app.answerMatches(`  ${card.word}!  `,card),card.id);
    assert.ok(!app.answerMatches(`${card.word} extra`,card),card.id);
    assert.ok(!app.answerMatches("wrong",card),card.id);
  }
  for(const [id,wrongAnswers] of [
    ["ein-nominative-masculine-tisch",["einen","eine","kein","keinen"]],
    ["ein-accusative-masculine-hund",["ein","eine","einem"]],
    ["ein-dative-feminine-wohnung",["eine","einem","ein"]],
    ["kein-nominative-feminine-lampe",["kein","keinen","eine"]],
    ["kein-accusative-plural-autos",["kein","keinen","keiner"]],
    ["kein-dative-plural-kinder",["keine","keinem","Kindern"]]
  ]){
    const card=cards.find(item=>item.id===id);
    assert.ok(app.answerMatches(card.word,card),id);
    for(const answer of wrongAnswers)assert.ok(!app.answerMatches(answer,card),`${id}: ${answer}`);
  }
});

test("library, learn cards and practice reveal the gender only after the learner decides",()=>{
  const ui=runtime();
  ui.open(0);
  assert.equal(ui.elements.get("deck-label-de").textContent,"Unbestimmter Artikel: ein und kein");
  assert.equal(ui.elements.get("lesson-chapter-count").textContent,"Розділ 1 з 5");
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.word);
  assert.equal(ui.elements.get("noun-gender").hidden,false);
  assert.equal(ui.elements.get("card-paradigm").hidden,false);
  ui.open(1);
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.promptText);
  assert.equal(ui.elements.get("noun-gender").hidden,true);
  assert.equal(ui.elements.get("card-paradigm").hidden,true);
  assert.match(ui.elements.get("category-label").textContent,/Неозначений артикль · NOMINATIV/);
  assert.doesNotMatch(ui.elements.get("category-label").textContent,/Чоловічий|Середній|Жіночий|Множина/);
  ui.answer(ui.app.card.word);
  assert.equal(ui.elements.get("noun-gender").hidden,true);
  assert.equal(ui.elements.get("card-paradigm").hidden,false);
});

test("practice requires an answer, corrects a miss, retries it and completes after repair",()=>{
  const ui=runtime();
  ui.open(3);
  const first=ui.app.card;
  assert.equal(ui.elements.get("question-word").textContent,first.promptText);
  assert.ok(ui.elements.get("check-button").disabled);
  ui.key("Enter");
  assert.equal(ui.app.state.activeSession.firstAttemptTotal,0);
  ui.answer("wrong");
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  assert.equal(ui.elements.get("feedback-title").textContent,`Не зовсім — ${first.word}`);
  ui.key("Enter");
  let repaired=false;
  for(let steps=0;ui.app.state.activeSession&&steps<20;steps++){
    const card=ui.app.card;
    if(card.retry){
      repaired=true;
      assert.equal(card.targetId,first.targetId);
    }
    ui.answer(card.word);
    assert.equal(ui.elements.get("feedback-title").textContent,`Правильно — ${card.word}`);
    ui.key("Enter");
  }
  assert.ok(repaired);
  assert.equal(ui.app.state.activeSession,null);
  assert.ok(!ui.elements.get("celebration").hidden);
  const completion=ui.app.state.pendingCompletion;
  assert.equal(completion.session.firstAttemptTotal,3);
  assert.equal(completion.session.firstAttemptCorrect,2);
  assert.equal(completion.session.retryQueue.length,0);
  assert.ok(ui.app.lessonState(lessonId).masteredPractice.includes("indefinite-accusative-practice"));
  const restored=runtime(ui.saved);
  restored.app.resume();
  assert.ok(!restored.elements.get("celebration").hidden);
  assert.equal(restored.app.state.pendingCompletion.id,completion.id);
});

test("all ten stages complete through bounded passes and persist durably",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<10;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    ui.open(stageIndex);
    const collection=stage.mode==="input"?"masteredPractice":"completedLearn";
    for(let pass=0;pass<8&&!ui.app.lessonState(lessonId)[collection].includes(stage.id);pass++){
      for(let step=0;ui.app.state.activeSession&&step<100;step++){
        if(stage.mode==="input"){
          ui.answer(ui.app.card.word);
          ui.key("Enter");
        }else ui.key("ArrowRight",ui.elements.get("flashcard"));
      }
      assert.equal(ui.app.state.activeSession,null,stage.id);
      if(!ui.app.lessonState(lessonId)[collection].includes(stage.id))ui.elements.get("completion-primary").click();
    }
    assert.ok(ui.app.lessonState(lessonId)[collection].includes(stage.id),stage.id);
    ui.elements.get("completion-library").click();
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  const coverage=ui.app.lessonCoverage(lessonId);
  assert.ok(coverage.total>0);
  assert.equal(coverage.covered,coverage.total);
  assert.equal(coverage.newTargets,0);
  assert.equal(ui.app.coveragePercent(coverage),100);
  assert.equal(ui.elements.get("progress-coverage").textContent,`${ui.app.coveragePercent(ui.app.courseCoverage())}%`);
  await ui.app.persistState();
  const durable=JSON.parse(ui.requests.at(-1).body);
  assert.equal(durable.version,5);
  assert.equal(durable.lessons[lessonId].completedLearn.length,5);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,5);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
  assert.deepEqual(JSON.parse(JSON.stringify(restored.app.lessonState(lessonId))),durable.lessons[lessonId]);
});

test("switching stages parks an unfinished attempt and resumes it exactly where it stopped",()=>{
  const ui=runtime();
  ui.open(2);
  ui.key("ArrowRight",ui.elements.get("flashcard"));
  const index=ui.app.index,order=[...ui.app.state.activeSession.order];
  ui.open(3);
  assert.ok(ui.app.state.suspendedSessions[`${lessonId}::indefinite-accusative-learn`].session);
  ui.open(2);
  assert.equal(ui.app.state.activeSession.sequenceId,"indefinite-accusative-learn");
  assert.equal(ui.app.index,index);
  assert.deepEqual([...ui.app.state.activeSession.order],order);
  const restored=runtime(ui.saved);
  restored.app.resume();
  assert.equal(restored.app.index,index);
  assert.deepEqual([...restored.app.state.activeSession.order],order);
});
