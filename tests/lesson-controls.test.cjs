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
      addEventListener(name,listener){this[name]=listener},
      scrollIntoView(options){this.scrollOptions=options},
      focus(options){this.focusOptions=options}
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
  const planBinding=source.slice(source.indexOf('$("lesson-plan-link").addEventListener'),source.indexOf('$("lesson-library").addEventListener'));
  vm.runInContext(`${source.slice(0,bindings)}
    ${inputBinding}
    ${planBinding}
    selectStage=stageIndex=>{activeStageIndex=stageIndex;renderLessonPath()};
    globalThis.runtime={
      definitions:deckDefinitions,lessonChapters,lessonState,
      startStageAttempt,suspendActiveSession,suspendedEntry,sessionHasProgress,
      open(lessonId,stageIndex=0){activeDeckId=lessonId;activeStageIndex=stageIndex;renderLessonPath()},
      get activeStageIndex(){return activeStageIndex},
      get state(){return learningState}
    };
  })();`,context);
  return {elements,context};
}

test("every lesson shows all chapter switches in the bottom plan and compact current context",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    const chapters=app.lessonChapters(definition.stages);
    for(const [chapterIndex,chapter] of chapters.entries()){
      for(const [stepIndex,step] of chapter.steps.entries()){
        app.open(lessonId,step.stageIndex);
        assert.equal(elements.get("lesson-chapter-count").textContent,`Розділ ${chapterIndex+1} з ${chapters.length}`,step.stage.id);
        assert.equal(elements.get("lesson-phase-label").textContent,`${step.stage.phase} · етап ${stepIndex+1} з ${chapter.steps.length}`,step.stage.id);
        assert.ok(!elements.has("chapter-select"));
        assert.ok(!elements.has("phase-switch"));
        assert.match(elements.get("lesson-step-count").textContent,new RegExp(`^План уроку · завершено 0 з ${definition.stages.length} етап`));
        const rows=elements.get("lesson-steps").children;
        assert.equal(rows.length,chapters.length,step.stage.id);
        for(const [rowIndex,row] of rows.entries()){
          const buttons=row.children[1].children;
          assert.equal(buttons.length,chapters[rowIndex].steps.length,step.stage.id);
          for(const [buttonIndex,button] of buttons.entries()){
            assert.equal(button.textContent,chapters[rowIndex].steps[buttonIndex].stage.phase);
            assert.match(button.attributes["aria-label"],new RegExp(`^Етап ${buttonIndex+1} з ${buttons.length}:`));
            assert.equal(button.attributes["aria-current"],rowIndex===chapterIndex&&buttonIndex===stepIndex?"step":"false");
          }
        }
      }
    }
  }
});

test("bottom stage choices expose current, completed, and saved attempts",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  const lessonId="possessives",[learn,practice]=app.definitions[lessonId].stages;
  app.lessonState(lessonId).completedLearn=[learn.id];
  app.state.suspendedSessions[`${lessonId}::${practice.id}`]={
    session:{lessonId,sequenceId:practice.id,index:2},updatedAt:new Date().toISOString()
  };
  app.open(lessonId);
  const [learnButton,practiceButton]=elements.get("lesson-steps").children[0].children[1].children;
  assert.match(learnButton.className,/current done/);
  assert.match(learnButton.attributes["aria-label"],/поточний етап.*завершено/);
  assert.match(practiceButton.className,/paused/);
  assert.match(practiceButton.attributes["aria-label"],/незавершений підхід збережено/);
  assert.equal(elements.get("lesson-step-count").textContent,"План уроку · завершено 1 з 4 етапів · охоплено 0 з 12 цілей · залишилось 12 цілей");
});

test("bottom switches can open practice in either chapter directly",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  app.open("possessives",1);
  elements.get("lesson-steps").children[1].children[1].children[1].click();
  assert.equal(app.activeStageIndex,3);
  assert.equal(elements.get("lesson-phase-label").textContent,"Практика · етап 2 з 2");
  elements.get("lesson-steps").children[0].children[1].children[1].click();
  assert.equal(app.activeStageIndex,1);
  assert.equal(elements.get("lesson-chapter-label").textContent,"Основи");
});

test("lesson plan stays open below the card without duplicate top navigation",()=>{
  const html=readFileSync(join(__dirname,"../index.html"),"utf8");
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  assert.match(html,/<section class="lesson-outline" id="lesson-outline" aria-labelledby="lesson-outline-title">/);
  assert.match(html,/id="lesson-outline-title" tabindex="-1"/);
  assert.ok(html.indexOf('id="lesson-outline"')>html.indexOf('id="study-actions"'));
  assert.doesNotMatch(html,/chapter-navigation|journey-top|chapter-select|phase-switch|lesson-progress-toggle/);
  assert.doesNotMatch(source,/\$\("(?:chapter-select|phase-switch|lesson-stage-count|lesson-progress-toggle)"\)/);
  assert.doesNotMatch(source,/\$\("lesson-outline"\)\.open/);
  assert.match(css,/\.chapter-phases \{[^}]*flex-wrap:\s*wrap;[^}]*max-width:\s*100%;/);
  assert.match(css,/\.chapter-phases \{[^}]*width:\s*100%;[^}]*padding-left:\s*34px;/);
});

test("lesson completion link focuses the always-open plan without changing progress",()=>{
  const {elements,context}=navigationRuntime(),app=context.runtime;
  const before=JSON.stringify(app.state);
  elements.get("lesson-plan-link").click();
  elements.get("lesson-plan-link").click();
  assert.equal(elements.get("lesson-outline").scrollOptions.block,"nearest");
  assert.equal(elements.get("lesson-outline-title").focusOptions.preventScroll,true);
  assert.equal(elements.get("lesson-outline").open,undefined);
  assert.equal(JSON.stringify(app.state),before);
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
    [".journey-tally",14],[".card-stage .card-top",14],[".card-stage .answer-label",14],
    [".lesson-identity h1",16],[".chapter-phases .phase",14],
    ["#stage-objective",16],["#session-progress-label",16],
    [".card-stage .answer-content small",16],[".lesson-outline-heading",16]
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
