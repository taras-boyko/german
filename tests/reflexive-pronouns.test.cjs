const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const context=vm.createContext({});
vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
const lesson=JSON.parse(vm.runInContext('JSON.stringify(deckDefinitions["reflexive-pronouns"])',context));
const forms={
  accusative:{ich:"mich",du:"dich",er:"sich",she:"sich",es:"sich",wir:"uns",ihr:"euch",they:"sich",formal:"sich"},
  dative:{ich:"mir",du:"dir",er:"sich",she:"sich",es:"sich",wir:"uns",ihr:"euch",they:"sich",formal:"sich"}
};
const personKeys=Object.keys(forms.accusative);

function sharedRuntime(){
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const runtime=vm.createContext({localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),runtime);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0,"shared runtime event bindings must be present");
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={
      lesson:deckDefinitions["reflexive-pronouns"],
      lessonCatalog,categoryLabels,
      samplePass,variantsForStage,answerMatches,lessonState,canResume,
      get state(){return learningState}
    };
  })();`,runtime);
  return runtime.runtime;
}

test("every person and case has three explicit clozes with the correct reflexive form",()=>{
  assert.equal(lesson.cards.length,54);
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,54);
  for(const [grammaticalCase,pronouns] of Object.entries(forms)){
    for(const [person,answer] of Object.entries(pronouns)){
      const targetId=`reflexive-${grammaticalCase}-${person}`;
      const variants=lesson.cards.filter(card=>card.targetId===targetId);
      assert.equal(variants.length,3,targetId);
      assert.equal(new Set(variants.map(card=>card.example)).size,3,targetId);
      for(const card of variants){
        assert.ok(card.id.startsWith(`${targetId}-`),card.id);
        assert.equal(card.type,"cloze",card.id);
        assert.deepEqual(card.response.accepted,[answer],card.id);
        assert.equal(card.response.mode,"text");
        assert.equal(card.response.scope,"word");
        assert.equal(card.response.punctuationSensitive,false);
        assert.equal(card.response.caseSensitive,false);
        assert.equal(card.practiceVariants,false);
        assert.ok(card.id&&card.promptText&&card.translation&&card.explanation&&card.support&&card.studyTranslation,card.id);
      }
    }
  }
});

test("the case table highlights only rows where Akkusativ and Dativ share a form",()=>{
  const table=lesson.guide.rules.find(rule=>rule.table).table;
  assert.deepEqual(table.columns.map(column=>column.label),["Nom.","Akk.","Dat."]);
  assert.equal(table.rows.length,personKeys.length);
  assert.equal(table.rows[7].label,"sie (мн.)");
  const expected=[];
  for(let row=2;row<personKeys.length;row+=1)expected.push({row,column:1},{row,column:2});
  assert.deepEqual(table.highlights,expected);
});

test("each card points the paradigm at its own person and case",()=>{
  for(const card of lesson.cards){
    const [,grammaticalCase,person]=card.targetId.split("-");
    assert.deepEqual(card.paradigm.active,{row:personKeys.indexOf(person),column:grammaticalCase==="accusative"?1:2},card.id);
  }
});

test("clozes have one gap, a subject support line, and a matching German sentence",()=>{
  for(const card of lesson.cards){
    assert.equal(card.promptText.split("___").length,2,card.id);
    assert.equal(card.word,card.response.accepted[0],card.id);
    assert.equal(card.promptText.replace("___",card.response.accepted[0]),card.example,card.id);
    assert.match(card.support,/^Підмет: /,card.id);
    assert.ok(card.studyTranslation.includes("→"),card.id);
    assert.ok(!card.support.includes("→"),card.id);
  }
});

test("each chapter has matching learn and practice target pools",()=>{
  assert.equal(lesson.stages.length,6);
  assert.equal(new Set(lesson.stages.map(stage=>stage.id)).size,6);
  assert.equal(new Set(lesson.stages.map(stage=>stage.chapter)).size,3);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards.map(card=>card.id),practice.cards.map(card=>card.id));
    assert.equal(new Set(learn.cards.map(card=>card.targetId)).size,index===4?18:9);
  }
});

test("mixed practice names no case, keeps saved answers, and hides the category until check",()=>{
  const learn=lesson.stages[4],practice=lesson.stages[5];
  assert.equal(practice.categoryBeforeCheck,"REFLEXIVPRONOMEN");
  assert.equal(lesson.stages.filter(stage=>stage.categoryBeforeCheck).length,1);
  for(const card of practice.cards){
    const original=learn.cards.find(candidate=>candidate.id===card.id);
    assert.ok(original,card.id);
    assert.equal(card.targetId,original.targetId,card.id);
    assert.deepEqual(card.response,original.response,card.id);
    assert.equal(card.type,"cloze",card.id);
    assert.equal(card.promptText.split("___").length,2,card.id);
    assert.equal(card.promptText.replace("___",card.response.accepted[0]),card.example,card.id);
    assert.doesNotMatch(`${card.promptText} ${card.support}`,/\b(?:Akkusativ|Dativ)\b/i,card.id);
  }
  for(const targetId of new Set(practice.cards.map(card=>card.targetId))){
    const variants=practice.cards.filter(card=>card.targetId===targetId);
    assert.equal(variants.length,3,targetId);
    assert.equal(new Set(variants.map(card=>`${card.promptText}\u0000${card.support}`)).size,3,targetId);
  }
});

test("catalog entry and category label are wired to the lesson",()=>{
  const runtime=sharedRuntime();
  const entry=runtime.lessonCatalog["reflexive-pronouns"];
  assert.ok(entry,"catalog entry");
  assert.equal(entry.className,"Морфологія");
  assert.equal(entry.level,"A1");
  assert.equal(runtime.categoryLabels.REFLEXIVPRONOMEN,"Зворотні займенники");
  assert.ok(runtime.categoryLabels[runtime.lesson.stages[5].categoryBeforeCheck]);
});

test("shared passes cover every target and rotate the three variants without repeats",()=>{
  const runtime=sharedRuntime();
  for(const stage of runtime.lesson.stages){
    const targets=new Set(stage.cards.map(card=>card.targetId));
    assert.equal(runtime.variantsForStage(stage).length,stage.cards.length,stage.id);
    const cycles=new Map(),covered=new Set();
    const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
    for(let passIndex=0;passIndex<12;passIndex+=1){
      const pass=runtime.samplePass("reflexive-pronouns",stage);
      assert.equal(pass.length,Math.min(7,targets.size),stage.id);
      assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length,stage.id);
      for(const card of pass){
        const cycle=cycles.get(card.targetId)||new Set();
        if(cycle.size===3)cycle.clear();
        assert.ok(!cycle.has(card.id),`${stage.id}: repeated ${card.id} before using all three variants`);
        cycle.add(card.id);
        cycles.set(card.targetId,cycle);
        covered.add(card.targetId);
      }
      runtime.lessonState("reflexive-pronouns")[collection][stage.id]=[...covered];
      if(passIndex===Math.ceil(targets.size/7)-1){
        assert.equal(covered.size,targets.size,stage.id);
      }
    }
    assert.ok([...cycles.values()].every(cycle=>cycle.size>0),stage.id);
  }
});

test("shared evaluation accepts the exact form in any letter case and rejects other text",()=>{
  const runtime=sharedRuntime();
  for(const stage of runtime.lesson.stages){
    for(const card of stage.cards){
      const answer=card.response.accepted[0];
      assert.ok(runtime.answerMatches(`  ${answer}!  `,card),card.id);
      assert.ok(runtime.answerMatches(answer.toUpperCase(),card),card.id);
      assert.ok(!runtime.answerMatches(`${answer} extra`,card),card.id);
      assert.ok(!runtime.answerMatches("wrong",card),card.id);
    }
  }
});

test("the other case's form is rejected for ich and du",()=>{
  const runtime=sharedRuntime();
  const pick=(grammaticalCase,person)=>runtime.lesson.cards.find(card=>card.targetId===`reflexive-${grammaticalCase}-${person}`);
  assert.ok(!runtime.answerMatches("mich",pick("dative","ich")));
  assert.ok(!runtime.answerMatches("mir",pick("accusative","ich")));
  assert.ok(!runtime.answerMatches("dich",pick("dative","du")));
  assert.ok(!runtime.answerMatches("dir",pick("accusative","du")));
  assert.ok(runtime.answerMatches("sich",pick("dative","er")));
});

test("saved card orders resume only while every saved card still exists",()=>{
  const runtime=sharedRuntime();
  for(const stage of runtime.lesson.stages){
    const order=runtime.samplePass("reflexive-pronouns",stage).map(card=>card.id);
    runtime.state.activeSession={
      lessonId:"reflexive-pronouns",sequenceId:stage.id,
      mode:stage.mode==="input"?"practice":"learn",order,index:2
    };
    assert.ok(runtime.canResume("reflexive-pronouns",stage),stage.id);
    runtime.state.activeSession.order=[...order,"unknown-card"];
    assert.ok(!runtime.canResume("reflexive-pronouns",stage),stage.id);
  }
});
