const assert=require("node:assert/strict");
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
    globalThis.app={deckDefinitions,lessonCatalog,variantsForStage,samplePass,answerMatches,
      lessonState,lessonCoverage,normalizeState,canResume,get state(){return learningState}};
  })();`,context);
  return context.app;
}

test("the six present-tense forms have three clear, correct examples each",()=>{
  const app=runtime(),cards=app.deckDefinitions.sollen.stages[0].cards;
  const forms=[["ich","soll"],["du","sollst"],["er","soll"],["wir","sollen"],["ihr","sollt"],["sie","sollen"]];
  for(const [person,answer] of forms){
    const variants=cards.filter(card=>card.targetId===`sollen-form-${person}`);
    assert.equal(variants.length,3,person);
    for(const card of variants){
      assert.equal(card.response.accepted[0],answer,card.id);
      assert.equal(card.promptText.split("___").length,2,card.id);
      assert.equal(card.example.toLowerCase(),card.promptText.replace("___",answer).toLowerCase(),card.id);
      const {paradigm,answerParts}=card;
      assert.equal(answerParts.stem+answerParts.ending,answer,card.id);
      assert.equal(paradigm.active.column,forms.findIndex(([key])=>key===person),card.id);
      assert.ok(paradigm.rows[0].cells.every(form=>!form.vowel),card.id);
    }
  }
});

test("every chapter has three variants per target and identical learn and practice pools",()=>{
  const app=runtime(),lesson=app.deckDefinitions.sollen;
  assert.equal(lesson.cards.length,57);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,lesson.cards.length);
  assert.equal(lesson.stages.length,8);
  for(let i=0;i<lesson.stages.length;i+=2){
    const learn=lesson.stages[i],practice=lesson.stages[i+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(Array.from(learn.cards,card=>card.id),Array.from(practice.cards,card=>card.id));
    const targets=new Set(practice.cards.map(card=>card.targetId));
    for(const target of targets)assert.equal(practice.cards.filter(card=>card.targetId===target).length,3,target);
    for(const card of practice.cards){
      assert.ok(card.id&&card.targetId&&card.explanation);
      assert.ok(["cloze","sentence-build"].includes(card.type));
      assert.equal(card.response.mode,"text");
      assert.equal(card.response.accepted.length,1);
      assert.ok(app.answerMatches(card.response.accepted[0],card),card.id);
      assert.ok(!app.answerMatches(`${card.response.accepted[0]} extra`,card),card.id);
      if(card.type==="cloze"){
        const answer=card.response.accepted[0];
        const escaped=answer.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
        const standalone=new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,"iu");
        assert.doesNotMatch(`${card.promptText} ${card.support}`,standalone,card.id);
      }else{
        const sentence=card.structure[0].map(slot=>slot.text).join(" ");
        assert.equal(sentence,card.response.accepted[0].replace(/[.?!]$/,""),card.id);
        assert.ok(!app.answerMatches(card.response.accepted[0].split(" ").reverse().join(" "),card),card.id);
      }
    }
  }
});

test("meaning contrasts and reported information are explicit and use the correct forms",()=>{
  const {cards,guide}=runtime().deckDefinitions.sollen;
  for(const [target,answer] of [["sollen-choice-sollen","soll"],["sollen-choice-koennen","kann"],["sollen-choice-moegen","mag"],["sollen-choice-wollen","will"],["sollen-use-bericht","soll"]]){
    const group=cards.filter(card=>card.targetId===target);
    assert.equal(group.length,3,target);
    assert.ok(group.every(card=>card.response.accepted[0]===answer),target);
  }
  assert.ok(guide.rules.some(rule=>rule.title==="Неперевірене повідомлення"&&rule.detail.includes("не наказ")));
  assert.ok(guide.rules.some(rule=>rule.title==="Sollte — не форма Präsens"));
});

test("sampling covers each target, rotates variants and restores saved passes",()=>{
  const app=runtime(),lesson=app.deckDefinitions.sollen;
  for(const stage of lesson.stages){
    const targets=new Set(stage.cards.map(card=>card.targetId)),seen=new Map(),covered=new Set();
    const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
    for(let i=0;i<3;i++){
      const pass=app.samplePass("sollen",stage);
      assert.equal(pass.length,targets.size,stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length);
      for(const card of pass){
        const variants=seen.get(card.targetId)||new Set();
        assert.ok(!variants.has(card.id),card.id);
        variants.add(card.id);seen.set(card.targetId,variants);covered.add(card.targetId);
      }
      app.lessonState("sollen")[collection][stage.id]=[...covered];
      app.state.activeSession={lessonId:"sollen",sequenceId:stage.id,mode:stage.mode==="input"?"practice":"learn",order:pass.map(card=>card.id),index:1,retryQueue:[],answered:{}};
      const restored=app.normalizeState(JSON.parse(JSON.stringify(app.state)));
      assert.deepEqual(Array.from(restored.activeSession.order),Array.from(app.state.activeSession.order));
      assert.ok(app.canResume("sollen",stage));
    }
    assert.equal(covered.size,targets.size);
  }
  assert.equal(app.lessonCatalog.sollen.className,"Граматика");
  assert.equal(app.lessonCoverage("sollen").total,19);
});
