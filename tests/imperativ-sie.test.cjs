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

const lessonId="imperativ-sie";

const formAnswers=new Map([
  ["imperativ-sie-regular","Warten Sie"],
  ["imperativ-sie-no-vowel-change","Nehmen Sie"],
  ["imperativ-sie-sein","Seien Sie"],
  ["imperativ-sie-haben","Haben Sie"],
  ["imperativ-sie-werden","Werden Sie"],
]);

const situationAnswers=new Map([
  ["imperativ-sie-situation-directions","Gehen Sie"],
  ["imperativ-sie-situation-doctor","Machen Sie"],
  ["imperativ-sie-situation-shop","Probieren Sie"],
  ["imperativ-sie-situation-hotel","Zeigen Sie"],
  ["imperativ-sie-situation-office","Füllen Sie"],
]);

test("the Sie lesson has 48 unique cards in six learn and input passes",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  assert.equal(lesson.cards.length,48);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,lesson.cards.length);
  assert.equal(lesson.stages.length,6);
  assert.equal(app.lessonCatalog[lessonId].className,"Граматика");
  assert.equal(app.lessonCatalog[lessonId].level,"A1");
  assert.equal(app.lessonCoverage(lessonId).total,16);
});

test("every chapter pairs a learn pass with an input pass over the same cards",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  for(let i=0;i<lesson.stages.length;i+=2){
    const learn=lesson.stages[i],practice=lesson.stages[i+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(Array.from(learn.cards,card=>card.id),Array.from(practice.cards,card=>card.id));
  }
});

test("each pass has three variants per target and a closed or normal target count",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  for(const stage of lesson.stages){
    const targets=new Set(stage.cards.map(card=>card.targetId));
    assert.ok(targets.size>=3&&targets.size<=9,stage.id);
    for(const target of targets){
      const variants=stage.cards.filter(card=>card.targetId===target);
      assert.equal(variants.length,3,target);
      assert.equal(new Set(variants.map(card=>card.promptText)).size,3,target);
    }
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
  }
});

test("Sie forms take the infinitive stem and Sie, with sein, haben and werden in the Sie form",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  const cards=lesson.stages.filter(stage=>stage.mode==="input").slice(0,2).flatMap(stage=>stage.cards);
  for(const card of cards.filter(card=>card.type==="cloze")){
    const expected=formAnswers.get(card.targetId)||situationAnswers.get(card.targetId);
    assert.ok(expected,card.targetId);
    assert.equal(card.response.accepted[0],expected,card.id);
    assert.ok(/ Sie$/.test(card.response.accepted[0]),card.id);
    assert.equal(card.promptText.split("___").length,2,card.id);
  }
});

test("cloze examples fill the blank with the accepted answer and do not leak it before Check",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  for(const card of lesson.cards.filter(card=>card.type==="cloze")){
    const answer=card.response.accepted[0];
    assert.equal(card.example.toLowerCase(),card.promptText.replace("___",answer).toLowerCase(),card.id);
    const escaped=answer.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const standalone=new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,"iu");
    assert.doesNotMatch(`${card.promptText} ${card.support}`,standalone,card.id);
  }
});

test("word-order cards build the full sentence from its slots in the right order",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  for(const card of lesson.cards.filter(card=>card.type==="sentence-build")){
    const slots=card.structure[0];
    const sentence=slots.map(slot=>slot.text).join(" ");
    assert.equal(sentence,card.response.accepted[0].replace(/[.?!]$/,""),card.id);
    assert.deepEqual(Array.from(card.promptText.split(" / ")).sort(),Array.from(slots,slot=>slot.text).sort(),card.id);
    assert.ok(/\bSie\b/.test(card.response.accepted[0]),card.id);
    assert.ok(slots.some(slot=>slot.role==="verb"),card.id);
  }
  const verbFirst=lesson.cards.filter(card=>card.targetId==="imperativ-sie-order-verb-first");
  for(const card of verbFirst)assert.equal(card.structure[0][0].role,"verb",card.id);
});

test("word-order answers reject the reversed sentence",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  for(const card of lesson.cards.filter(card=>card.type==="sentence-build")){
    const reversed=card.response.accepted[0].replace(/[.?!]$/,"").split(" ").reverse().join(" ");
    assert.ok(!app.answerMatches(reversed,card),card.id);
    assert.ok(app.answerMatches(card.response.accepted[0],card),card.id);
  }
});

test("the guide states the Sie rule and the word-order rules",()=>{
  const {guide}=runtime().deckDefinitions[lessonId];
  assert.ok(guide.rules.length>=5);
  assert.equal(new Set(guide.rules.map(rule=>rule.title)).size,guide.rules.length);
  assert.ok(guide.rules.some(rule=>rule.title.includes("Sie-форма")&&rule.detail.includes("Sie")));
  assert.ok(guide.rules.some(rule=>rule.title.includes("Дієслово на першому місці")));
});

test("sampling covers each target, rotates variants and restores saved passes",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  for(const stage of lesson.stages){
    const targets=new Set(stage.cards.map(card=>card.targetId)),seen=new Map(),covered=new Set();
    const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
    for(let i=0;i<3;i++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,targets.size,stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length);
      for(const card of pass){
        const variants=seen.get(card.targetId)||new Set();
        assert.ok(!variants.has(card.id),card.id);
        variants.add(card.id);seen.set(card.targetId,variants);covered.add(card.targetId);
      }
      app.lessonState(lessonId)[collection][stage.id]=[...covered];
      app.state.activeSession={lessonId,sequenceId:stage.id,mode:stage.mode==="input"?"practice":"learn",order:pass.map(card=>card.id),index:1,retryQueue:[],answered:{}};
      const restored=app.normalizeState(JSON.parse(JSON.stringify(app.state)));
      assert.deepEqual(Array.from(restored.activeSession.order),Array.from(app.state.activeSession.order));
      assert.ok(app.canResume(lessonId,stage));
    }
    assert.equal(covered.size,targets.size);
  }
});
