const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const context=vm.createContext({});
vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
const lesson=JSON.parse(vm.runInContext('JSON.stringify(deckDefinitions["personal-pronoun-cases"])',context));
const forms={
  accusative:{ich:"mich",du:"dich",er:"ihn",she:"sie",es:"es",wir:"uns",ihr:"euch",they:"sie",formal:"Sie"},
  dative:{ich:"mir",du:"dir",er:"ihm",she:"ihr",es:"ihm",wir:"uns",ihr:"euch",they:"ihnen",formal:"Ihnen"}
};

function sharedRuntime(){
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const runtime=vm.createContext({localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),runtime);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0,"shared runtime event bindings must be present");
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={
      lesson:deckDefinitions["personal-pronoun-cases"],
      samplePass,variantsForStage,answerMatches,lessonState,canResume,
      get state(){return learningState}
    };
  })();`,runtime);
  return runtime.runtime;
}

test("every pronoun and case has three explicit variants and the correct form",()=>{
  assert.equal(lesson.cards.length,54);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,54);
  for(const [grammaticalCase,pronouns] of Object.entries(forms)){
    for(const [person,answer] of Object.entries(pronouns)){
      const targetId=`pronoun-${grammaticalCase}-${person}`;
      const variants=lesson.cards.filter(card=>card.targetId===targetId);
      assert.equal(variants.length,3,targetId);
      assert.deepEqual(variants.map(card=>card.type),["recall","cloze","cloze"]);
      for(const card of variants){
        assert.deepEqual(card.response.accepted,[answer],card.id);
        assert.equal(card.response.mode,"text");
        assert.equal(card.response.scope,"word");
        assert.equal(card.response.punctuationSensitive,false);
        assert.equal(typeof card.response.caseSensitive,"boolean");
        assert.equal(card.practiceVariants,false);
        assert.ok(card.id&&card.promptText&&card.translation&&card.explanation);
      }
    }
  }
});

test("clozes have one gap, a clear person cue, and a matching German sentence",()=>{
  for(const card of lesson.cards.filter(card=>card.type==="cloze")){
    assert.equal(card.promptText.split("___").length,2,card.id);
    assert.equal(card.word,card.response.accepted[0],card.id);
    assert.equal(card.promptText.replace("___",card.response.accepted[0]),card.example,card.id);
    assert.notEqual(card.word,card.example,card.id);
    assert.ok(card.support,card.id);
    assert.ok(card.studyTranslation.includes("→"),card.id);
    assert.ok(!card.support.includes("→"),card.id);
  }
});

test("formal, feminine, and plural sie remain separate capitalization objectives",()=>{
  const sensitiveTargets=new Set([
    "pronoun-accusative-she","pronoun-accusative-they","pronoun-accusative-formal",
    "pronoun-dative-they","pronoun-dative-formal"
  ]);
  for(const card of lesson.cards){
    assert.equal(card.response.caseSensitive,sensitiveTargets.has(card.targetId),card.id);
  }
  for(const grammaticalCase of Object.keys(forms)){
    const ids=["she","they","formal"].map(person=>`pronoun-${grammaticalCase}-${person}`);
    assert.equal(new Set(ids).size,3);
    assert.ok(ids.every(id=>lesson.cards.some(card=>card.targetId===id)));
  }
});

test("each chapter has matching learn and practice target pools",()=>{
  assert.equal(lesson.stages.length,6);
  assert.equal(new Set(lesson.stages.map(stage=>stage.chapter)).size,3);
  assert.equal(new Set(lesson.stages.map(stage=>stage.id)).size,6);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards.map(card=>card.id),practice.cards.map(card=>card.id));
    assert.equal(new Set(learn.cards.map(card=>card.targetId)).size,index===4?18:9);
  }
});

test("mixed practice uses three contextual gaps per target without changing saved identities or answers",()=>{
  const learn=lesson.stages[4],practice=lesson.stages[5];
  assert.equal(practice.categoryBeforeCheck,"PERSONALPRONOMEN");
  for(const card of practice.cards){
    const original=learn.cards.find(candidate=>candidate.id===card.id);
    assert.ok(original,card.id);
    assert.equal(card.targetId,original.targetId,card.id);
    assert.deepEqual(card.response,original.response,card.id);
    assert.equal(card.type,"cloze",card.id);
    assert.equal(card.promptText.split("___").length,2,card.id);
    assert.equal(card.promptText.replace("___",card.response.accepted[0]),card.example,card.id);
    assert.doesNotMatch(`${card.promptText} ${card.support}`,/\b(?:Akkusativ|Dativ)\b/i,card.id);
    assert.ok(card.support,card.id);
  }
  for(const targetId of new Set(practice.cards.map(card=>card.targetId))){
    const variants=practice.cards.filter(card=>card.targetId===targetId);
    assert.equal(new Set(variants.map(card=>`${card.promptText}\u0000${card.support}`)).size,3,targetId);
  }
});

test("shared passes cover every target and rotate explicit variants without generated duplicates",()=>{
  const runtime=sharedRuntime();
  for(const stage of runtime.lesson.stages){
    assert.equal(runtime.variantsForStage(stage).length,stage.cards.length,stage.id);
    const cycles=new Map(),covered=new Set();
    const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
    for(let passIndex=0;passIndex<12;passIndex+=1){
      const pass=runtime.samplePass("personal-pronoun-cases",stage);
      assert.equal(pass.length,7,stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,7,stage.id);
      for(const card of pass){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===3)cycle.clear();
        assert.ok(!cycle.has(card.id),`${stage.id}: repeated ${card.id} before using all three variants`);
        cycle.add(card.id);
        cycles.set(card.targetId,cycle);
        covered.add(card.targetId);
      }
      runtime.lessonState("personal-pronoun-cases")[collection][stage.id]=[...covered];
      if(passIndex===Math.ceil(new Set(stage.cards.map(card=>card.targetId)).size/7)-1){
        assert.equal(covered.size,new Set(stage.cards.map(card=>card.targetId)).size,stage.id);
      }
    }
    assert.ok([...cycles.values()].every(cycle=>cycle.size>0),stage.id);
  }
});

test("shared evaluation enforces exact forms and register and saved card orders can resume",()=>{
  const runtime=sharedRuntime();
  for(const stage of runtime.lesson.stages){
    for(const card of stage.cards){
      const answer=card.response.accepted[0];
      assert.ok(runtime.answerMatches(`  ${answer}!  `,card),card.id);
      assert.ok(!runtime.answerMatches(`${answer} extra`,card),card.id);
      assert.ok(!runtime.answerMatches("wrong",card),card.id);
      const swappedCase=answer===answer.toLowerCase()?answer.toUpperCase():answer.toLowerCase();
      assert.equal(runtime.answerMatches(swappedCase,card),!card.response.caseSensitive,card.id);
    }
    const order=runtime.samplePass("personal-pronoun-cases",stage).map(card=>card.id);
    runtime.state.activeSession={
      lessonId:"personal-pronoun-cases",sequenceId:stage.id,
      mode:stage.mode==="input"?"practice":"learn",order,index:2
    };
    assert.ok(runtime.canResume("personal-pronoun-cases",stage),stage.id);
    runtime.state.activeSession.order=[...order,"unknown-card"];
    assert.ok(!runtime.canResume("personal-pronoun-cases",stage),stage.id);
  }
});
