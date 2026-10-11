const assert=require("node:assert/strict");
const {createHash}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

function runtime(){
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const context=vm.createContext({localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0);
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={
      definitions:deckDefinitions,counted,pluralForm,categoryLabel,inputCopy,
      feedbackExample,feedbackExplanation,feedbackOutcome,variantsForStage,
      normalizeState,canResume,lessonStatus,lessonState,
      get state(){return learningState}
    };
  })();`,context);
  return context.runtime;
}

const ukrainian=/[а-яіїєґ]/iu;

test("every lesson, chapter, phase, outcome, and exercise label is Ukrainian",()=>{
  const app=runtime();
  assert.equal(Object.keys(app.definitions).length,25);
  let stages=0;
  for(const [id,definition] of Object.entries(app.definitions)){
    for(const text of [definition.title,definition.label,definition.catalog.outcome,definition.catalog.className]){
      assert.match(text,ukrainian,id);
    }
    for(const stage of definition.stages){
      stages++;
      for(const key of ["title","chapter","phase","objective"])assert.match(stage[key],ukrainian,`${stage.id}: ${key}`);
      for(const card of app.variantsForStage(stage)){
        assert.match(app.categoryLabel(card.category),ukrainian,card.id);
        for(const text of app.inputCopy(card))assert.match(text,ukrainian,card.id);
        assert.match(app.feedbackExample(card).label,ukrainian,card.id);
        for(const correct of [false,true]){
          const feedback=app.feedbackOutcome(card,correct);
          assert.match(feedback.title,ukrainian,card.id);
          assert.match(feedback.detail,ukrainian,card.id);
        }
        const explanation=app.feedbackExplanation(card);
        assert.ok(ukrainian.test(explanation)||/^(?:Präteritum|Perfekt):/.test(explanation),card.id);
      }
    }
  }
  assert.equal(stages,117);
});

test("Ukrainian counts handle zero, singular, plural, teens, and compound numbers",()=>{
  const app=runtime();
  for(const [number,word] of [[0,"уроків"],[1,"урок"],[2,"уроки"],[4,"уроки"],[5,"уроків"],
    [11,"уроків"],[12,"уроків"],[14,"уроків"],[21,"урок"],[22,"уроки"],[25,"уроків"],[111,"уроків"]]){
    assert.equal(app.counted(number,"урок","уроки","уроків"),`${number} ${word}`);
  }
  assert.equal(app.counted(1,"картка","картки","карток"),"1 картка");
  assert.equal(app.counted(2,"розділ","розділи","розділів"),"2 розділи");
  assert.equal(app.counted(12,"етап","етапи","етапів"),"12 етапів");
  assert.equal(app.pluralForm(1,"день","дні","днів"),"день");
  assert.equal(app.pluralForm(3,"день","дні","днів"),"дні");
  assert.equal(app.pluralForm(11,"день","дні","днів"),"днів");
});

test("localization preserves the pre-localization identities, German content, answers and progression",()=>{
  const app=runtime();
  const snapshot=Object.entries(app.definitions).map(([lessonId,definition])=>({
    lessonId,stages:definition.stages.map(stage=>({
      id:stage.id,mode:stage.mode,progressId:stage.progressId,requiresFullCoverage:!!stage.requiresFullCoverage,
      cards:app.variantsForStage(stage).map(card=>({
        id:card.id,targetId:card.targetId,type:card.type,response:card.response,
        word:card.word,example:card.example,promptText:card.promptText,support:card.support,translation:card.translation
      }))
    }))
  }));
  // Baseline from 4781214 includes generated variants and legacy adapter IDs.
  assert.equal(createHash("sha256").update(JSON.stringify(snapshot)).digest("hex"),
    "fefbfb4d776ae53811713b4f665ba3f46296254b812af7e1533b18a3c14b37a3");
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      const cards=app.variantsForStage(stage).slice(0,7);
      app.state.activeSession={
        lessonId,sequenceId:stage.id,mode:stage.mode==="input"?"practice":"learn",
        order:cards.map(card=>card.id),index:2,retryQueue:[cards[0].targetId]
      };
      const restored=app.normalizeState(JSON.parse(JSON.stringify(app.state)));
      assert.equal(restored.version,4);
      assert.deepEqual(JSON.parse(JSON.stringify(restored.activeSession)),JSON.parse(JSON.stringify(app.state.activeSession)));
      assert.ok(app.canResume(lessonId,stage),stage.id);
    }
  }
});

test("Ukrainian lesson statuses retain their persistence and styling keys",()=>{
  const app=runtime(),id="pronouns",definition=app.definitions[id],state=app.lessonState(id);
  assert.equal(app.lessonStatus(id).key,"new");
  assert.equal(app.lessonStatus(id).label,"Не розпочато");
  state.completedLearn=definition.stages.filter(stage=>stage.mode==="learn").map(stage=>stage.id);
  assert.equal(app.lessonStatus(id).key,"ready");
  assert.equal(app.lessonStatus(id).label,"Готово до практики");
  state.masteredPractice=definition.stages.filter(stage=>stage.mode==="input").map(stage=>stage.id);
  assert.equal(app.lessonStatus(id).key,"mastered");
  assert.equal(app.lessonStatus(id).label,"Засвоєно");
  state.dueAt="2000-01-01T00:00:00.000Z";
  assert.equal(app.lessonStatus(id).key,"due");
  assert.equal(app.lessonStatus(id).label,"Час повторити");
});

test("document language, accessible labels, and CSS-generated text are Ukrainian",()=>{
  const html=readFileSync(join(__dirname,"../index.html"),"utf8");
  assert.ok(html.includes('<html lang="uk">'));
  assert.ok(html.includes('id="verification-input" type="text" lang="de"'));
  const names=[...html.matchAll(/aria-label="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(names.length,10);
  for(const name of names)assert.match(name,ukrainian,name);
  assert.ok(readFileSync(join(__dirname,"../styles.css"),"utf8").includes('content:"Сховати"'));
});
