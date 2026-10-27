const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="vocab-hamburg-city";

function runtime(){
  const values=new Map();
  const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  const context=vm.createContext({localStorage:storage,sessionStorage:storage,console});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0,"shared runtime event bindings must be present");
  vm.runInContext(`${source.slice(0,bindings)}
    globalThis.runtime={definitions:deckDefinitions,variantsForStage,samplePass};
  })();`,context);
  return context.runtime;
}

test("Hamburg vocabulary is a lexicon lesson with four topical chapters",()=>{
  const app=runtime(),lesson=app.definitions[lessonId];
  assert.ok(lesson);
  assert.equal(lesson.catalog.title,"Гамбург і міські місця");
  assert.equal(lesson.catalog.germanTitle,"Hamburg und Orte in der Stadt");
  assert.equal(lesson.catalog.className,"Лексика");
  assert.equal(lesson.catalog.level,"A1");
  assert.equal(lesson.stages.length,8);
  assert.deepEqual(Array.from(new Set(Array.from(lesson.stages,stage=>stage.chapter))),[
    "Місто й порт","Місто згори","Вечір у Гамбурзі","Місця в місті"
  ]);
});

test("each chapter teaches forward cards and practices both directions per target",()=>{
  const app=runtime(),lesson=app.definitions[lessonId];
  const allTargets=new Set();
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    const learnedTargets=new Set(Array.from(learn.cards,card=>card.targetId));
    const practicedTargets=new Set(Array.from(practice.cards,card=>card.targetId));
    assert.deepEqual([...learnedTargets].sort(),[...practicedTargets].sort());
    assert.ok(Array.from(learn.cards).every(card=>card.type!=="recall-reverse"));
    assert.equal(practicedTargets.size,7);
    for(const targetId of practicedTargets)allTargets.add(targetId);
    const variants=Array.from(app.variantsForStage(practice));
    for(const targetId of practicedTargets){
      const targetCards=Array.from(practice.cards).filter(card=>card.targetId===targetId);
      const forward=targetCards.filter(card=>card.type==="recall");
      const reverse=targetCards.filter(card=>card.type==="recall-reverse");
      assert.equal(forward.length,1,targetId);
      assert.equal(reverse.length,1,targetId);
      assert.equal(forward[0].response.mode,"text",targetId);
      assert.equal(reverse[0].response.mode,"text",targetId);
      assert.equal(reverse[0].promptText,reverse[0].word,targetId);
      assert.ok(reverse[0].response.accepted.length>0,targetId);
      assert.ok(variants.filter(card=>card.targetId===targetId).length>=3,targetId);
    }
    const pass=Array.from(app.samplePass(lessonId,practice));
    assert.equal(pass.length,7,practice.id);
    assert.equal(new Set(pass.map(card=>card.targetId)).size,pass.length,practice.id);
  }
  assert.equal(allTargets.size,28);
});
