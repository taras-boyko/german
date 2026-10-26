const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["local-prepositions"])`,context));

const sequences={
  "local-prepositions-dative":{learn:9,practice:27},
  "local-prepositions-accusative":{learn:9,practice:27},
  "local-prepositions-contrast":{learn:8,practice:24}
};
const stageByID=id=>lesson.stages.find(stage=>stage.id===id);
const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const standaloneCount=(text,word)=>(text.match(new RegExp(`(?<![\\p{L}\\p{N}])${escape(word)}(?![\\p{L}\\p{N}])`,"giu"))||[]).length;
const answerOf=card=>card.response.accepted[0].replace(/[?!.,]+$/,"");
const words=text=>text.toLowerCase().replace(/[?!.,]+$/,"").split(/\s+/).filter(Boolean).sort().join(" ");

test("practice pools are three times their size and learn pools are unchanged",()=>{
  for(const [prefix,{learn,practice}] of Object.entries(sequences)){
    assert.equal(stageByID(`${prefix}-learn`).cards.length,learn,`${prefix} learn`);
    assert.equal(stageByID(`${prefix}-practice`).cards.length,practice,`${prefix} practice`);
  }
});

test("every practice target keeps its learn card and has exactly three practice cards",()=>{
  for(const prefix of Object.keys(sequences)){
    const learnIDs=stageByID(`${prefix}-learn`).cards.map(card=>card.id);
    const practice=stageByID(`${prefix}-practice`).cards;
    const practiceIDs=new Set(practice.map(card=>card.id));
    for(const id of learnIDs)assert.ok(practiceIDs.has(id),`${prefix}: ${id} missing from practice`);
    const counts=new Map();
    practice.forEach(card=>counts.set(card.targetId,(counts.get(card.targetId)||0)+1));
    for(const [targetId,count] of counts)assert.equal(count,3,`${prefix}: ${targetId}`);
  }
  assert.equal(new Set(lesson.cards.map(card=>card.id)).size,lesson.cards.length);
});

test("practice variants keep their target's noun, scene and cue",()=>{
  for(const prefix of Object.keys(sequences)){
    const learn=new Map(stageByID(`${prefix}-learn`).cards.map(card=>[card.targetId,card]));
    for(const card of stageByID(`${prefix}-practice`).cards){
      const base=learn.get(card.targetId);
      assert.deepEqual(card.noun,base.noun,card.id);
      assert.deepEqual(card.scene,base.scene,card.id);
      assert.equal(card.cue,base.cue,card.id);
      assert.equal(card.practiceSupport.text,card.translation,card.id);
      assert.equal(card.scene.motion,card.cue==="Wohin?",card.id);
    }
  }
});

test("every practice sentence holds its answer and noun exactly once",()=>{
  for(const prefix of Object.keys(sequences)){
    for(const card of stageByID(`${prefix}-practice`).cards){
      assert.equal(standaloneCount(card.example,answerOf(card)),1,`${card.id}: answer in example`);
      if(card.noun.exampleWord)assert.equal(standaloneCount(card.example,card.noun.exampleWord),1,`${card.id}: noun in example`);
    }
  }
});

test("cloze prompts have one gap and sentence-build chunks rebuild their answer",()=>{
  for(const prefix of Object.keys(sequences)){
    for(const card of stageByID(`${prefix}-practice`).cards){
      if(card.type==="cloze"){
        assert.equal(card.promptText.split("___").length-1,1,card.id);
      }else{
        assert.equal(card.type,"sentence-build",card.id);
        const chunks=card.promptText.split(" / ").join(" ");
        assert.equal(words(chunks),words(card.response.accepted[0]),card.id);
        assert.equal(card.response.accepted.length,1,card.id);
      }
    }
  }
});

test("practice variant pools include the gapped example of every cloze card",()=>{
  for(const [prefix,{practice}] of Object.entries(sequences)){
    const cards=stageByID(`${prefix}-practice`).cards;
    const gapped=cards.filter(card=>card.type==="cloze"&&standaloneCount(card.example,answerOf(card))>0).length;
    const variants=cards.length+gapped;
    assert.equal(variants,prefix.endsWith("contrast")?practice:practice*2,prefix);
  }
});
