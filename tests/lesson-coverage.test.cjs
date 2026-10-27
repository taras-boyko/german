const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="personal-pronoun-cases";
const accusativeStageId="pronoun-cases-accusative-practice";
const mixedStageId="pronoun-cases-mixed-practice";
const stateKey="german-learning-state-v5";

function runtime(saved=new Map()){
  const storage=values=>({getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)});
  const sandbox=vm.createContext({localStorage:storage(saved),sessionStorage:storage(new Map()),console});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),sandbox);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0,"shared runtime event bindings must be present");
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={
      deckDefinitions,samplePass,stageIsComplete,lessonState,lessonCoverage,courseCoverage,
      coveragePercent,coverageText,coverageMasteryNote,backfillLegacyTargets,
      get state(){return learningState}
    };
  })();`,sandbox);
  return {app:sandbox.runtime,saved};
}

const stageTargets=(app,stageId)=>[...new Set(app.deckDefinitions[lessonId].stages.find(stage=>stage.id===stageId).cards.map(card=>card.targetId))];
const plain=value=>JSON.parse(JSON.stringify(value));

test("practice coverage counts each learning target once across case and mixed stages",()=>{
  const {app}=runtime();
  assert.deepEqual(plain(app.lessonCoverage(lessonId)),{covered:0,total:18,newTargets:0});
  assert.equal(stageTargets(app,accusativeStageId).length,9);
  assert.equal(stageTargets(app,mixedStageId).length,18);
});

test("a target is covered by its first practice stage and later mixed review does not change coverage",()=>{
  const {app}=runtime();
  const lesson=app.lessonState(lessonId),[target]=stageTargets(app,accusativeStageId);
  lesson.masteredTargets[accusativeStageId]=[target];
  assert.equal(app.lessonCoverage(lessonId).covered,1);
  lesson.masteredTargets[accusativeStageId]=[];
  lesson.masteredTargets[mixedStageId]=[target];
  assert.equal(app.lessonCoverage(lessonId).covered,0);
});

test("finishing each small case stage advances lesson coverage before the mixed review",()=>{
  const {app}=runtime();
  const id="indefinite-articles",lesson=app.lessonState(id);
  const practice=app.deckDefinitions[id].stages.filter(stage=>stage.mode==="input");
  let expected=0;
  for(const stage of practice.slice(0,3)){
    const targets=[...new Set(stage.cards.map(card=>card.targetId))];
    lesson.masteredTargets[stage.id]=targets;
    lesson.masteredPractice.push(stage.id);
    expected+=targets.length;
    assert.equal(app.lessonCoverage(id).covered,expected,stage.id);
  }
  assert.deepEqual(plain(app.lessonCoverage(id)),{covered:9,total:21,newTargets:0});
});

test("a note explains that a fully covered lesson is mastered only after every practice stage",()=>{
  const {app}=runtime();
  const id="indefinite-articles",lesson=app.lessonState(id);
  const practice=app.deckDefinitions[id].stages.filter(stage=>stage.mode==="input");
  practice.slice(0,-1).forEach(stage=>{
    lesson.masteredTargets[stage.id]=[...new Set(stage.cards.map(card=>card.targetId))];
    lesson.masteredPractice.push(stage.id);
  });
  assert.deepEqual(plain(app.lessonCoverage(id)),{covered:21,total:21,newTargets:0});
  assert.notEqual(app.coverageMasteryNote(id),"");
  const mixed=practice.at(-1);
  lesson.masteredTargets[mixed.id]=[...new Set(mixed.cards.map(card=>card.targetId))];
  lesson.masteredPractice.push(mixed.id);
  assert.equal(app.coverageMasteryNote(id),"");
});

test("targets missing from a finished stage stay complete for the stage but count as new work",()=>{
  const {app}=runtime();
  const lesson=app.lessonState(lessonId),targets=stageTargets(app,accusativeStageId);
  lesson.masteredPractice.push(accusativeStageId);
  lesson.masteredTargets[accusativeStageId]=targets.slice(1);
  assert.equal(app.stageIsComplete(lessonId,app.deckDefinitions[lessonId].stages.find(stage=>stage.id===accusativeStageId)),true);
  assert.deepEqual(plain(app.lessonCoverage(lessonId)),{covered:8,total:18,newTargets:1});
});

test("grandfathering records all targets of older completions once and never refills later targets",()=>{
  const {app,saved}=runtime();
  const lesson=app.lessonState(lessonId);
  lesson.masteredPractice.push(accusativeStageId);
  app.backfillLegacyTargets();
  assert.deepEqual([...lesson.masteredTargets[accusativeStageId]].sort(),[...stageTargets(app,accusativeStageId)].sort());
  assert.equal(JSON.parse(saved.get(stateKey)).lessons[lessonId].masteredTargets[accusativeStageId].length,9);
  lesson.masteredTargets[accusativeStageId]=lesson.masteredTargets[accusativeStageId].slice(1);
  app.backfillLegacyTargets();
  assert.equal(lesson.masteredTargets[accusativeStageId].length,8);
  assert.equal(app.lessonCoverage(lessonId).newTargets,1);
});

test("percent rounds down and reaches one hundred only when every target is covered",()=>{
  const {app}=runtime();
  assert.equal(app.coveragePercent({covered:179,total:180,newTargets:0}),99);
  assert.equal(app.coveragePercent({covered:180,total:180,newTargets:0}),100);
  assert.equal(app.coveragePercent({covered:1,total:3,newTargets:0}),33);
  assert.equal(app.coveragePercent({covered:0,total:0,newTargets:0}),0);
  assert.equal(app.coverageText({covered:3,total:18,newTargets:0}),"3 з 18 цілей");
});

test("course coverage sums each lesson's own unique targets",()=>{
  const {app}=runtime();
  const course=app.courseCoverage();
  const perLesson=Object.keys(app.deckDefinitions).map(id=>app.lessonCoverage(id));
  assert.equal(course.total,perLesson.reduce((sum,item)=>sum+item.total,0));
  assert.equal(course.covered,perLesson.reduce((sum,item)=>sum+item.covered,0));
});

test("focused passes keep seven cards while every target converges to full coverage",()=>{
  const {app}=runtime();
  const lesson=app.lessonState(lessonId),stages=app.deckDefinitions[lessonId].stages.filter(stage=>stage.mode==="input");
  for(const stage of stages){
    const targets=stageTargets(app,stage.id);
    for(let pass=0;pass<12;pass+=1){
      const covered=new Set(lesson.masteredTargets[stage.id]||[]);
      if(covered.size===targets.length)break;
      const cards=app.samplePass(lessonId,stage);
      assert.ok(cards.length<=7,stage.id);
      assert.equal(new Set(cards.map(card=>card.targetId)).size,cards.length,stage.id);
      lesson.masteredTargets[stage.id]=[...new Set([...covered,...cards.map(card=>card.targetId)])];
    }
    assert.equal((lesson.masteredTargets[stage.id]||[]).length,targets.length,stage.id);
    lesson.masteredPractice.push(stage.id);
  }
  const coverage=app.lessonCoverage(lessonId);
  assert.deepEqual(plain(coverage),{covered:18,total:18,newTargets:0});
  assert.equal(app.coveragePercent(coverage),100);
});
