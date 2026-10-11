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
    assert.equal(card.promptText.replace("___",card.response.accepted[0]),card.word,card.id);
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
