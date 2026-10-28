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
      normalizeState,canResume,lessonStatus,lessonState,cardExplanations,mergeState,
      suspendActiveSession,takeSuspendedSession,suspendedEntry,lessonHasOpenAttempt,recommendedStageIndex,
      get state(){return learningState}
    };
  })();`,context);
  return context.runtime;
}

const ukrainian=/[а-яіїєґ]/iu;

test("every lesson, chapter, phase, outcome, and exercise label is Ukrainian",()=>{
  const app=runtime();
  assert.equal(Object.keys(app.definitions).length,39);
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
          if(correct)assert.equal(feedback.detail,"",card.id);
          else assert.equal(feedback.detail,app.feedbackExplanation(card),card.id);
        }
        const explanation=app.feedbackExplanation(card);
        assert.ok(ukrainian.test(explanation)||/^(?:Präteritum|Perfekt):/.test(explanation),card.id);
      }
    }
  }
  assert.equal(stages,199);
});

test("grammar practice explains the deciding rule instead of a generic fallback",()=>{
  const app=runtime();
  const vocabulary=new Set(["w-questions","frequency","time-worksheet-vocabulary","everyday-vocabulary",
    "travel-transport","giving-directions","vocab-license-travel","vocab-post-contracts","vocab-talk-feelings","vocab-life-daily","vocab-health","appointments","past-action-vocabulary"]);
  const vocabularyCategories=/^(FREIZEIT · (ORT|AKTION|WORTSCHATZ|BESCHREIBUNG|MENGE|ZEIT)|FOTOBESCHREIBUNG)/;
  const targets=new Set();
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      for(const card of stage.mode==="input"?app.variantsForStage(stage):stage.cards){
        targets.add(card.targetId);
        if(stage.mode!=="input"||vocabulary.has(lessonId)||vocabularyCategories.test(card.category))continue;
        assert.ok(card.explanation,`${lessonId}: ${card.id}`);
        assert.ok(card.explanation.length<=220,card.id);
      }
    }
  }
  for(const targetId of Object.keys(app.cardExplanations))assert.ok(targets.has(targetId),`orphaned explanation: ${targetId}`);
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
  const snapshot=Object.entries(app.definitions).filter(([lessonId])=>!["sollen","possessive-cases","temporal-prepositions","werden","mit-ohne","indefinite-articles","reflexive-pronouns","vocab-license-travel","vocab-post-contracts","vocab-talk-feelings","vocab-life-daily","vocab-health","appointments","past-action-vocabulary"].includes(lessonId)).map(([lessonId,definition])=>({
    lessonId,stages:definition.stages.filter(stage=>!stage.id.startsWith("wollen-")&&!stage.id.startsWith("word-order-dass-")).map(stage=>({
      id:stage.id,mode:stage.mode,progressId:stage.progressId,
      cards:app.variantsForStage(stage).filter(card=>!/^pronoun-(?:accusative|dative)-[^:]+-context-[a-z0-9-]+$/.test(card.id)).map(card=>({
        id:card.id,targetId:card.targetId,type:card.type,response:card.response,
        word:card.word,example:card.example,promptText:card.promptText,support:card.support,translation:card.translation
      }))
    }))
  }));
  // Keep this baseline explicit; generated context variants are covered by the pronoun-case tests.
  assert.equal(createHash("sha256").update(JSON.stringify(snapshot)).digest("hex"),
    "fded041c3fadf92e50270049f3fdbdc01bcae5061c4730c0e00bb1e889ee1100");
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const stage of definition.stages){
      const cards=app.variantsForStage(stage).slice(0,7);
      app.state.activeSession={
        lessonId,sequenceId:stage.id,mode:stage.mode==="input"?"practice":"learn",
        order:cards.map(card=>card.id),index:2,retryQueue:[cards[0].targetId]
      };
      const restored=app.normalizeState(JSON.parse(JSON.stringify(app.state)));
      assert.equal(restored.version,5);
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

test("switching stages parks an unfinished attempt and resumes it without resurrection",()=>{
  const app=runtime(),lessonId="possessives",[learn,practice]=app.definitions[lessonId].stages;
  const cards=app.variantsForStage(practice).slice(0,7);
  const attempt={lessonId,sequenceId:practice.id,mode:"practice",order:cards.map(card=>card.id),index:3,
    retryQueue:[],cardStatus:{0:"correct",1:"wrong"},cardInputs:{1:"meine"},updatedAt:"2026-01-01T00:00:00.000Z"};
  app.state.activeSession=attempt;
  app.suspendActiveSession(lessonId,learn);
  assert.equal(app.state.activeSession,null);
  assert.equal(app.suspendedEntry(lessonId,practice.id).session.index,3);
  assert.ok(app.lessonHasOpenAttempt(lessonId));
  assert.equal(app.lessonStatus(lessonId).key,"learning");
  assert.equal(app.recommendedStageIndex(lessonId),1);

  const restored=app.normalizeState(JSON.parse(JSON.stringify(app.state)));
  assert.deepEqual(JSON.parse(JSON.stringify(restored.suspendedSessions)),JSON.parse(JSON.stringify(app.state.suspendedSessions)));
  const staleDisk=JSON.parse(JSON.stringify(app.state));

  const resumed=app.takeSuspendedSession(lessonId,practice.id);
  assert.deepEqual(resumed.cardInputs,{1:"meine"});
  assert.equal(app.suspendedEntry(lessonId,practice.id),null);
  const merged=app.mergeState(app.state,app.normalizeState(staleDisk));
  assert.equal(merged.suspendedSessions[`${lessonId}::${practice.id}`].session,null,"an older disk copy must not revive a resumed attempt");
});

test("untouched attempts are not parked and version 4 state migrates in place",()=>{
  const app=runtime(),lessonId="sein",[learn,practice]=app.definitions[lessonId].stages;
  app.state.activeSession={lessonId,sequenceId:learn.id,mode:"learn",order:[],index:0,retryQueue:[],cardStatus:{},cardInputs:{}};
  app.suspendActiveSession(lessonId,practice);
  assert.equal(app.suspendedEntry(lessonId,learn.id),null);
  assert.equal(app.lessonHasOpenAttempt(lessonId),false);
  const migrated=app.normalizeState({version:4,lessons:{sein:{completedLearn:[learn.id]}},activeSession:null});
  assert.equal(migrated.version,5);
  assert.deepEqual(JSON.parse(JSON.stringify(migrated.suspendedSessions)),{});
  assert.deepEqual([...migrated.lessons.sein.completedLearn],[learn.id]);
  assert.deepEqual(JSON.parse(JSON.stringify(app.normalizeState(JSON.parse(JSON.stringify(migrated))))),JSON.parse(JSON.stringify(migrated)));
});

test("every lesson title has a German translation shown beside it",()=>{
  const app=runtime();
  const germanTitles=new Set();
  for(const [id,definition] of Object.entries(app.definitions)){
    const german=definition.catalog.germanTitle;
    assert.equal(typeof german,"string",id);
    assert.ok(german.trim().length>1,id);
    assert.doesNotMatch(german,/[а-яіїєґ]/i,id);
    assert.ok(!germanTitles.has(german),`${id}: duplicate German title`);
    germanTitles.add(german);
  }
  const html=readFileSync(join(__dirname,"..","index.html"),"utf8");
  assert.match(html,/id="deck-label-de" lang="de"/);
});
