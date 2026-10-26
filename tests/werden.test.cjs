const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="werden";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,context));

const formTargets=["werden-ich","werden-du","werden-er","werden-wir","werden-ihr","werden-sie"];
const formAnswers={"werden-ich":"werde","werden-du":"wirst","werden-er":"wird","werden-wir":"werden","werden-ihr":"werdet","werden-sie":"werden"};
const usageTargets=["werden-change","werden-role","werden-infinitive"];

const variantCounts=stage=>{
  const counts=new Map();
  stage.cards.forEach(card=>counts.set(card.targetId,(counts.get(card.targetId)||0)+1));
  return counts;
};
const stageByMode=(id)=>lesson.stages.find(stage=>stage.id===id);

test("practice pools are three times their previous size and learn pools are unchanged",()=>{
  assert.equal(stageByMode("werden-forms-learn").cards.length,6);
  assert.equal(stageByMode("werden-forms-practice").cards.length,18);
  assert.equal(stageByMode("werden-usage-learn").cards.length,9);
  assert.equal(stageByMode("werden-usage-practice").cards.length,27);
});

test("card IDs are unique and every stage card belongs to the lesson card list",()=>{
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,lesson.cards.length);
  const lessonIds=new Set(lesson.cards.map(card=>card.id));
  for(const stage of lesson.stages)for(const card of stage.cards)assert.ok(lessonIds.has(card.id),card.id);
});

test("every form has three practice variants and every usage target has nine",()=>{
  const forms=variantCounts(stageByMode("werden-forms-practice"));
  assert.deepEqual([...forms.keys()].sort(),[...formTargets].sort());
  for(const targetId of formTargets)assert.equal(forms.get(targetId),3,targetId);
  const usage=variantCounts(stageByMode("werden-usage-practice"));
  assert.deepEqual([...usage.keys()].sort(),[...usageTargets].sort());
  for(const targetId of usageTargets)assert.equal(usage.get(targetId),9,targetId);
});

test("every form practice card accepts exactly its person's form and fills its gap with it",()=>{
  for(const card of stageByMode("werden-forms-practice").cards){
    assert.equal(card.type,"cloze",card.id);
    assert.deepEqual(card.response.accepted,[formAnswers[card.targetId]],card.id);
    assert.equal((card.prompt.match(/___/g)||[]).length,1,card.id);
    assert.equal(card.prompt.replace("___",card.response.accepted[0]),card.word,card.id);
    const occurrences=card.word.match(new RegExp(`(?<![\\p{L}])${card.response.accepted[0]}(?![\\p{L}])`,"giu"))||[];
    assert.equal(occurrences.length,1,card.id);
    assert.ok(card.explanation&&card.translation&&card.answerTranslation,card.id);
  }
});

test("form practice covers statements, questions and the polite Sie across all six persons",()=>{
  const cards=stageByMode("werden-forms-practice").cards;
  for(const targetId of formTargets){
    const variants=cards.filter(card=>card.targetId===targetId).map(card=>card.word);
    assert.ok(variants.some(word=>word.endsWith("?")),`${targetId}: question`);
    assert.ok(variants.some(word=>!word.endsWith("?")),`${targetId}: statement`);
  }
  assert.ok(cards.some(card=>card.word==="Warum werden Sie so müde?"),"polite Sie question");
});

test("every usage practice variant fills its gap with the accepted werden form",()=>{
  for(const card of stageByMode("werden-usage-practice").cards){
    const accepted=card.response.accepted;
    assert.equal(accepted.length,1,card.id);
    assert.equal(card.example,card.promptText.replace("___",accepted[0]),card.id);
    assert.equal((card.promptText.match(/___/g)||[]).length,1,card.id);
  }
});

test("infinitive practice covers every modal verb that takes werden",()=>{
  const infinitives=stageByMode("werden-usage-practice").cards
    .filter(card=>card.targetId==="werden-infinitive").map(card=>card.promptText).join("\n");
  for(const modal of ["wollen|will|wollte","möchten|möchte","können|kann|kannst","müssen|muss","sollen|soll","dürfen|darf|darfst"]){
    assert.match(infinitives,new RegExp(`\\b(${modal})\\b`,"iu"),modal);
  }
});
