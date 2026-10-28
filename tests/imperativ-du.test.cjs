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

const lessonId="imperativ-du";

const duAnswers=new Map([
  ["imperativ-du-stem","Komm"],
  ["imperativ-du-e-stem","Warte"],
  ["imperativ-du-entschuldige","Entschuldige"],
  ["imperativ-du-nimm","Nimm"],
  ["imperativ-du-lies","Lies"],
  ["imperativ-du-sieh","Sieh"],
  ["imperativ-du-fahr","Fahr"],
  ["imperativ-du-sein","Sei"],
  ["imperativ-du-haben","Hab"],
  ["imperativ-du-werden","Werd"],
]);

const ihrAnswers=new Map([
  ["imperativ-ihr-wartet","Wartet"],
  ["imperativ-ihr-nehmt","Nehmt"],
  ["imperativ-ihr-seid","Seid"],
  ["imperativ-ihr-habt","Habt"],
  ["imperativ-ihr-werdet","Werdet"],
]);

const anredeForms=new Map([
  ["imperativ-anrede-helfen",["Hilf","Helft","Helfen Sie"]],
  ["imperativ-anrede-kommen",["Komm","Kommt","Kommen Sie"]],
  ["imperativ-anrede-warten",["Warte","Wartet","Warten Sie"]],
  ["imperativ-anrede-sprechen",["Sprich","Sprecht","Sprechen Sie"]],
  ["imperativ-anrede-nehmen",["Nimm","Nehmt","Nehmen Sie"]],
]);

test("the du and ihr lesson has 78 unique cards in five learn and input passes",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  assert.equal(lesson.cards.length,78);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,lesson.cards.length);
  assert.equal(lesson.stages.length,10);
  assert.equal(app.lessonCatalog[lessonId].className,"Граматика");
  assert.equal(app.lessonCatalog[lessonId].level,"A2");
  assert.equal(app.lessonCoverage(lessonId).total,26);
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

test("du forms drop -st, take -e after -t, -d, -ig and -ern, and keep vowel changes",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  const cloze=lesson.cards.filter(card=>card.type==="cloze"&&duAnswers.has(card.targetId));
  assert.equal(cloze.length,30);
  for(const card of cloze){
    const answer=card.response.accepted[0];
    assert.equal(answer,duAnswers.get(card.targetId),card.id);
    assert.ok(!/st$/i.test(answer),card.id);
    assert.equal(card.promptText.split("___").length,2,card.id);
  }
  for(const target of ["imperativ-du-e-stem","imperativ-du-entschuldige"]){
    assert.ok(duAnswers.get(target).endsWith("e"),target);
  }
});

test("ihr forms are the ihr present without the pronoun",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  const cards=lesson.cards.filter(card=>ihrAnswers.has(card.targetId));
  assert.equal(cards.length,15);
  for(const card of cards){
    assert.equal(card.response.accepted[0],ihrAnswers.get(card.targetId),card.id);
    assert.equal(card.response.accepted[0].split(" ").length,1,card.id);
  }
});

test("the Anrede pass gives a du, ihr and Sie form for every target",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  for(const [target,forms] of anredeForms){
    const variants=lesson.cards.filter(card=>card.targetId===target);
    assert.equal(variants.length,3,target);
    assert.deepEqual(Array.from(variants,card=>card.response.accepted[0]).sort(),Array.from(forms).sort(),target);
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
    assert.ok(slots.some(slot=>slot.role==="verb"),card.id);
    assert.ok(!/\bSie\b/.test(card.response.accepted[0]),card.id);
  }
  const verbFirst=lesson.cards.filter(card=>card.targetId==="imperativ-du-order-verb-first");
  for(const card of verbFirst)assert.equal(card.structure[0][0].role,"verb",card.id);
});

test("separable prefixes go to the end of the sentence",()=>{
  const lesson=runtime().deckDefinitions[lessonId];
  const separable=lesson.cards.filter(card=>card.targetId==="imperativ-du-order-separable");
  assert.equal(separable.length,3);
  for(const card of separable)assert.match(card.response.accepted[0],/ (mit|zu|an)\.$/,card.id);
});

test("word-order answers reject the reversed sentence",()=>{
  const app=runtime(),lesson=app.deckDefinitions[lessonId];
  for(const card of lesson.cards.filter(card=>card.type==="sentence-build")){
    const reversed=card.response.accepted[0].replace(/[.?!]$/,"").split(" ").reverse().join(" ");
    assert.ok(!app.answerMatches(reversed,card),card.id);
    assert.ok(app.answerMatches(card.response.accepted[0],card),card.id);
  }
});

test("the guide states the du, Sonderfälle, ihr and Anrede rules",()=>{
  const {guide}=runtime().deckDefinitions[lessonId];
  assert.ok(guide.rules.length>=5);
  assert.equal(new Set(guide.rules.map(rule=>rule.title)).size,guide.rules.length);
  assert.ok(guide.rules.some(rule=>rule.title.includes("du-форма")));
  assert.ok(guide.rules.some(rule=>rule.title.includes("Sonderfälle")));
  assert.ok(guide.rules.some(rule=>rule.title.includes("ihr-форма")));
  assert.ok(guide.rules.some(rule=>rule.title.includes("Звернення")));
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
