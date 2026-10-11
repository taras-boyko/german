const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const css=readFileSync(join(__dirname,"../lesson-journey.css"),"utf8");

function luminance(hex){
  const channels=hex.slice(1).match(/../g).map(channel=>{
    const value=parseInt(channel,16)/255;
    return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;
  });
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}

test("filled lesson controls keep contrasting text on hover without styling disabled controls",()=>{
  const rules=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const rule=rules.find(([,selectors])=>selectors.includes("#practice-view .continue-button:hover"));
  assert.ok(rule,"filled hover rule must be scoped to the practice view to outrank its general button hover rule");
  assert.deepEqual(rule[1].trim().split(/,\s*/),[
    "#practice-view .continue-button:hover:not(:disabled)",
    "#practice-view .check-button:hover:not(:disabled)",
    "#practice-view .phase.current:hover:not(:disabled)"
  ]);
  assert.match(rule[2],/color:\s*#fff;/);
  const background=rule[2].match(/background:\s*(#[a-f\d]{6});/i)?.[1];
  assert.ok(background);
  const contrast=(luminance("#ffffff")+0.05)/(luminance(background)+0.05);
  assert.ok(contrast>=4.5,`hover text contrast is ${contrast.toFixed(2)}:1`);
});

function navigationRuntime(){
  const elements=new Map();
  function element(){
    return {
      children:[],attributes:{},hidden:false,textContent:"",value:"",
      style:{setProperty:()=>{}},classList:{toggle:()=>{}},
      append(...children){this.children.push(...children)},
      replaceChildren(...children){this.children=children},
      setAttribute(name,value){this.attributes[name]=value},
      addEventListener(name,listener){this[name]=listener}
    };
  }
  const document={
    createElement:element,
    getElementById(id){
      if(!elements.has(id))elements.set(id,element());
      return elements.get(id);
    }
  };
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const context=vm.createContext({document,localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0);
  const inputBinding=source.slice(source.indexOf('$("verification-input").addEventListener("input"'),source.indexOf('$("check-button").addEventListener'));
  vm.runInContext(`${source.slice(0,bindings)}
    ${inputBinding}
    selectStage=stageIndex=>{activeStageIndex=stageIndex;renderLessonPath()};
    globalThis.runtime={
      definitions:deckDefinitions,lessonChapters,lessonState,selectChapter,
      startStageAttempt,suspendActiveSession,suspendedEntry,sessionHasProgress,
      open(lessonId,stageIndex=0){activeDeckId=lessonId;activeStageIndex=stageIndex;renderLessonPath()},
      get activeStageIndex(){return activeStageIndex},
      get state(){return learningState}
    };
  })();`,context);
  return {elements,context};
}

test("every lesson identifies chapter-local stages separately from lesson-wide completion",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    const chapters=app.lessonChapters(definition.stages);
    for(const [chapterIndex,chapter] of chapters.entries()){
      for(const [stepIndex,step] of chapter.steps.entries()){
        app.open(lessonId,step.stageIndex);
        assert.equal(elements.get("lesson-chapter-count").textContent,`Розділ ${chapterIndex+1} з ${chapters.length}`,step.stage.id);
        assert.equal(elements.get("lesson-stage-count").textContent,`Етап ${stepIndex+1} з ${chapter.steps.length} у розділі`,step.stage.id);
        assert.equal(elements.get("chapter-select").hidden,chapters.length===1,step.stage.id);
        assert.equal(elements.get("phase-switch").hidden,chapter.steps.length===1,step.stage.id);
        assert.match(elements.get("lesson-step-count").textContent,new RegExp(`^План уроку · завершено 0 з ${definition.stages.length} етап`));
        const buttons=elements.get("phase-switch").children;
        if(chapter.steps.length>1){
          assert.equal(buttons.length,chapter.steps.length,step.stage.id);
          assert.equal(buttons[stepIndex].attributes["aria-current"],"step");
          assert.equal(buttons[stepIndex].children[0].textContent,String(stepIndex+1));
          assert.equal(buttons[stepIndex].children[1].children[1].textContent,"Поточний етап");
        }
      }
    }
  }
});

test("stage choices show completed and saved attempts in visible text",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  const lessonId="possessives",[learn,practice]=app.definitions[lessonId].stages;
  app.lessonState(lessonId).completedLearn=[learn.id];
  app.state.suspendedSessions[`${lessonId}::${practice.id}`]={
    session:{lessonId,sequenceId:practice.id,index:2},updatedAt:new Date().toISOString()
  };
  app.open(lessonId);
  const [learnButton,practiceButton]=elements.get("phase-switch").children;
  assert.equal(learnButton.children[1].children[1].textContent,"Поточний · завершено");
  assert.equal(practiceButton.children[1].children[1].textContent,"Підхід збережено");
  assert.match(practiceButton.attributes["aria-label"],/незавершений підхід збережено/);
  assert.equal(elements.get("lesson-step-count").textContent,"План уроку · завершено 1 з 4 етапів");
});

test("chapter switching retains the mode and prefers a saved attempt",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  app.open("possessives",1);
  app.selectChapter(1);
  assert.equal(app.activeStageIndex,3);
  assert.equal(elements.get("chapter-select").value,"1");
  assert.equal(elements.get("lesson-stage-count").textContent,"Етап 2 з 2 у розділі");

  const lessonId="present-practice",definition=app.definitions[lessonId],chapters=app.lessonChapters(definition.stages);
  const chapter=chapters.find(item=>item.steps.filter(step=>step.stage.mode==="input").length>1);
  assert.ok(chapter,"the fixture must have several practice steps within a chapter");
  const saved=chapter.steps.filter(step=>step.stage.mode==="input").at(-1);
  app.state.suspendedSessions[`${lessonId}::${saved.stage.id}`]={
    session:{lessonId,sequenceId:saved.stage.id,index:2},updatedAt:new Date().toISOString()
  };
  app.open(lessonId,definition.stages.findIndex(stage=>stage.mode==="input"));
  app.selectChapter(chapters.indexOf(chapter));
  assert.equal(app.activeStageIndex,saved.stageIndex);
});

test("chapter picker is visible, labelled, and excluded from card keyboard shortcuts",()=>{
  const html=readFileSync(join(__dirname,"../index.html"),"utf8");
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  assert.match(html,/id="lesson-chapter-count" for="chapter-select"/);
  assert.match(html,/id="phase-switch" aria-labelledby="lesson-stage-count"/);
  assert.match(html,/id="lesson-progress-toggle"[^>]+aria-controls="lesson-outline"/);
  const selectRule=css.match(/(?:^|\n)#chapter-select \{([^}]+)\}/)?.[1];
  assert.ok(selectRule);
  assert.doesNotMatch(selectRule,/opacity:\s*0|position:\s*absolute/);
  assert.match(selectRule,/min-height:\s*48px/);
  assert.match(source,/closest\("button, a, input, select, summary/);
});

test("unsubmitted practice drafts survive switching and clearing a draft does not create progress",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  const lessonId="possessives",[learn,practice]=app.definitions[lessonId].stages;
  app.open(lessonId,1);
  app.startStageAttempt();
  const order=[...app.state.activeSession.order],field=elements.get("verification-input");
  field.value="unsubmitted answer";
  field.input({target:field});
  assert.equal(app.state.activeSession.cardInputs["0"],"unsubmitted answer");
  assert.ok(app.sessionHasProgress(app.state.activeSession));
  app.suspendActiveSession(lessonId,learn);
  assert.equal(app.suspendedEntry(lessonId,practice.id).session.cardInputs["0"],"unsubmitted answer");
  app.startStageAttempt();
  assert.deepEqual([...app.state.activeSession.order],order);
  assert.equal(app.state.activeSession.cardInputs["0"],"unsubmitted answer");
  field.value="";
  field.input({target:field});
  assert.equal(app.state.activeSession.cardInputs["0"],undefined);
  assert.equal(app.sessionHasProgress(app.state.activeSession),false);
  assert.equal(elements.get("check-button").disabled,true);
});

test("lesson typography keeps supporting text at least 14px and instructions at least 16px",()=>{
  const rules=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  for(const [selector,minimum] of [
    [".journey-control-label",14],[".phase-status",14],[".lesson-navigation-hint",14],
    [".journey-tally",14],[".card-stage .card-top",14],[".card-stage .answer-label",14],
    [".lesson-identity h1",16],[".phase-switch .phase-option",16],
    ["#stage-objective",16],["#session-progress-label",16],
    [".card-stage .answer-content small",16],[".lesson-outline summary",16]
  ]){
    const matching=rules.filter(([,selectors])=>selectors.trim().split(/,\s*/).includes(selector));
    assert.ok(matching.length,selector);
    for(const [,selectors,declarations] of matching){
      const size=declarations.match(/font-size:\s*(\d+)px/)?.[1];
      if(size)assert.ok(Number(size)>=minimum,`${selectors.trim()} must remain at least ${minimum}px`);
    }
  }
  assert.doesNotMatch(css,/\.card-stage \.continue-button\s*\{[^}]*min-width:\s*145px/);
});
