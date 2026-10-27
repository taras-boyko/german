const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

function runtime(){
  const saved=new Map();
  const storage=values=>({getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)});
  const context=vm.createContext({localStorage:storage(saved),sessionStorage:storage(new Map()),console});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0);
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={deckDefinitions,lessonCatalog,lessonState,lessonCoverage,coverageRemainingNote,
      completedStageWithNewTargets,recommendedStageIndex,reviewStage,actionLabel,stageIsComplete,
      samplePass,variantsForStage,answerMatches,backfillLegacyTargets,canResume,
      get state(){return learningState}};
  })();`,context);
  return {app:context.runtime,saved};
}

test("appointment chapters cover the annotated expressions with explicit, varied cards",()=>{
  const {app}=runtime(),lesson=app.deckDefinitions.appointments;
  assert.equal(app.lessonCatalog.appointments.className,"Лексика");
  assert.deepEqual(Array.from(lesson.stages,stage=>stage.mode),["learn","input","learn","input"]);
  const expected=["einen Termin vereinbaren","einen Termin absagen","einen Termin verschieben",
    "schieben","geschoben","feststecken","wahrscheinlich","Bescheid sagen","noch gar nicht","gearbeitet","Sehr geehrte Frau"];
  assert.deepEqual([...new Set(lesson.cards.map(card=>card.word))],expected);
  for(const practice of lesson.stages.filter(stage=>stage.mode==="input")){
    const learn=lesson.stages[lesson.stages.indexOf(practice)-1];
    for(const target of new Set(practice.cards.map(card=>card.targetId))){
      const variants=practice.cards.filter(card=>card.targetId===target);
      assert.equal(variants.length,4,target);
      assert.equal(new Set(variants.map(card=>card.id)).size,4,target);
      assert.equal(variants.filter(card=>card.type==="recall").length,3,target);
      assert.equal(variants.filter(card=>card.type==="recall-reverse").length,1,target);
      assert.equal(learn.cards.filter(card=>card.targetId===target).length,3,target);
      for(const card of variants){
        assert.equal(card.response.mode,"text",card.id);
        assert.ok(app.answerMatches(card.response.accepted[0],card),card.id);
        assert.ok(!app.answerMatches(`${card.response.accepted[0]} xyz`,card),card.id);
      }
    }
    assert.ok(learn.cards.every(card=>card.type!=="recall-reverse"));
  }
  assert.match(JSON.stringify(lesson.guide),/gearbeitet/);
});

test("separate existing lessons retain targets and offer the annotated extra material",()=>{
  const {app}=runtime();
  const license=app.deckDefinitions["vocab-license-travel"];
  const schaffen=license.stages.find(stage=>stage.mode==="input").cards.filter(card=>card.targetId==="vocab-schaffen");
  assert.ok(schaffen.some(card=>card.id==="vocab-schaffen-appointment"));
  assert.ok(schaffen.some(card=>card.id==="vocab-schaffen-recall"));
  const talk=app.deckDefinitions["vocab-talk-feelings"];
  assert.equal(talk.stages.filter(stage=>stage.id.startsWith("vocab-ehren-")).length,2);
  assert.ok(talk.stages.find(stage=>stage.id==="vocab-ehren-practice").cards.every(card=>card.targetId==="vocab-ehren"));
  const order=app.deckDefinitions["word-order"];
  const dass=order.stages.find(stage=>stage.id==="word-order-dass-recall");
  assert.equal(new Set(dass.cards.map(card=>card.targetId)).size,3);
  for(const card of dass.cards){
    assert.equal(card.type,"sentence-build");
    assert.match(card.word,/, dass /);
    assert.equal(card.structure.map(clause=>clause.map(slot=>slot.text).join(" ")).join(", "),card.word.replace(/[.?!]$/,""));
    assert.ok(app.answerMatches(card.word,card));
    assert.ok(!app.answerMatches(card.word.replace(", dass", ", das"),card));
  }
});

test("appointment passes cover each target and rotate variants without repeats",()=>{
  const {app}=runtime(),id="appointments",lesson=app.lessonState(id);
  for(const stage of app.deckDefinitions[id].stages){
    const seen=new Set(),variants=new Map();
    const targets=new Set(stage.cards.map(card=>card.targetId));
    const collection=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
    for(let pass=0;pass<8;pass++){
      const cards=app.samplePass(id,stage);
      assert.equal(cards.length,Math.min(7,targets.size));
      assert.equal(new Set(cards.map(card=>card.targetId)).size,cards.length);
      for(const card of cards){
        const cycle=variants.get(card.targetId)||new Set();
        const pool=stage.cards.filter(item=>item.targetId===card.targetId).length;
        if(cycle.size===pool)cycle.clear();
        assert.ok(!cycle.has(card.id),card.id);
        cycle.add(card.id);
        variants.set(card.targetId,cycle);
        seen.add(card.targetId);
      }
      collection[stage.id]=[...seen];
    }
    assert.equal(seen.size,targets.size,stage.id);
  }
});

test("completed old stages stay complete while added chapters remain uncovered",()=>{
  const {app}=runtime(),id="vocab-talk-feelings",lesson=app.lessonState(id);
  const stages=app.deckDefinitions[id].stages;
  for(const stage of stages.slice(0,2)){
    const completed=stage.mode==="input"?lesson.masteredPractice:lesson.completedLearn;
    const targets=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
    completed.push(stage.id);
    targets[stage.id]=[...new Set(stage.cards.map(card=>card.targetId))];
  }
  const before=lesson.masteredTargets[stages[1].id].slice();
  assert.equal(app.stageIsComplete(id,stages[1]),true);
  assert.equal(app.stageIsComplete(id,stages[2]),false);
  const coverage=app.lessonCoverage(id);
  assert.equal(coverage.total-coverage.covered,1);
  assert.match(app.coverageRemainingNote(coverage),/1 ціль/);
  assert.equal(app.recommendedStageIndex(id),2);
  assert.deepEqual([...lesson.masteredTargets[stages[1].id]],[...before]);
  assert.equal(app.reviewStage(id).id,"vocab-ehren-practice");
});

test("new targets in a completed stage are recommended without reopening it",()=>{
  const {app}=runtime(),id="vocab-talk-feelings",lesson=app.lessonState(id);
  const stages=app.deckDefinitions[id].stages;
  for(const stage of stages){
    (stage.mode==="input"?lesson.masteredPractice:lesson.completedLearn).push(stage.id);
    const targets=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
    targets[stage.id]=[...new Set(stage.cards.map(card=>card.targetId))];
  }
  const stage=stages[1],newCard={...stage.cards[0],id:"new-variant",targetId:"new-target"};
  stage.cards.push(newCard);
  assert.equal(app.stageIsComplete(id,stage),true);
  assert.equal(app.lessonCoverage(id).newTargets,1);
  assert.equal(app.completedStageWithNewTargets(id).id,stage.id);
  assert.equal(app.recommendedStageIndex(id),1);
  assert.equal(app.reviewStage(id).id,stage.id);
  assert.equal(app.actionLabel(id),"Практикувати нові цілі");
  assert.ok(app.samplePass(id,stage).some(card=>card.targetId==="new-target"));
});

test("legacy completed stages backfill old targets without crediting a new chapter",()=>{
  const {app}=runtime(),id="vocab-talk-feelings",lesson=app.lessonState(id);
  const [learn,practice,newLearn,newPractice]=app.deckDefinitions[id].stages;
  lesson.completedLearn.push(learn.id);
  lesson.masteredPractice.push(practice.id);
  app.backfillLegacyTargets();
  assert.ok(lesson.masteredTargets[practice.id].length>0);
  assert.equal(lesson.masteredTargets[newPractice.id],undefined);
  assert.equal(app.stageIsComplete(id,newLearn),false);
  assert.equal(app.lessonCoverage(id).total-app.lessonCoverage(id).covered,1);
});
