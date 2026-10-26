const assert=require("node:assert/strict");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

function runtime(){
  const elements=new Map();
  function element(){
    let text="";
    return {
      hidden:false,value:"",children:[],dataset:{},style:{setProperty:()=>{}},
      get textContent(){return this.children.length?this.children.map(child=>child.textContent).join(""):text},
      set textContent(value){text=value;this.children=[]},
      classList:{toggle:()=>{},remove:()=>{}},
      parentElement:{setAttribute:()=>{}},
      append(...children){this.children.push(...children)},
      replaceChildren(...children){this.children=children},
      setAttribute:()=>{}
    };
  }
  const document={
    createElement:element,
    getElementById(id){
      if(!elements.has(id))elements.set(id,element());
      return elements.get(id);
    },
    querySelector:()=>element()
  };
  const storage=()=>({getItem:()=>null,setItem:()=>{}});
  const context=vm.createContext({document,localStorage:storage(),sessionStorage:storage()});
  vm.runInContext(readFileSync(join(__dirname,"../script.js"),"utf8"),context);
  const source=readFileSync(join(__dirname,"../app.js"),"utf8");
  const bindings=source.indexOf('$("bookmark").addEventListener');
  assert.ok(bindings>0);
  vm.runInContext(`${source.slice(0,bindings)}
    renderLessonPath=()=>{};
    renderDeckGuide=()=>{};
    renderCardVisuals=()=>{};
    renderCorrection=()=>{};
    updatePageTitle=()=>{};
    globalThis.runtime={
      definitions:deckDefinitions,variantsForStage,feedbackExample,translationKey,
      renderCard(lessonId,stageIndex,card,status=""){
        activeDeckId=lessonId;
        activeStageIndex=stageIndex;
        deck=[card];
        index=0;
        verificationMode=activeStage().mode==="input";
        verified=status==="correct";
        answerRevealed=status==="revealed";
        render();
      }
    };
  })();`,context);
  return {app:context.runtime,elements};
}

test("every lesson shows duplicate translations once in learn and practice feedback",()=>{
  const {app,elements}=runtime();
  let duplicates=0,distinct=0;
  for(const [lessonId,definition] of Object.entries(app.definitions)){
    for(const [stageIndex,stage] of definition.stages.entries()){
      for(const card of app.variantsForStage(stage)){
        for(const status of stage.mode==="input"?["correct","revealed"]:[""]){
          app.renderCard(lessonId,stageIndex,card,status);
          const practice=stage.mode==="input";
          const meaning=practice?card.translation:(card.studyTranslation||card.translation);
          const example=practice?app.feedbackExample(card).translation:(card.exampleTranslation||card.translation);
          const separate=Boolean(app.translationKey(meaning))&&app.translationKey(meaning)!==app.translationKey(example);
          const label=`${stage.id}: ${card.id}: ${status}`;
          assert.equal(elements.get("translation").hidden,practice||!separate,label);
          assert.equal(elements.get("answer-translation").hidden,!practice||!separate,label);
          assert.equal(elements.get("answer-translation").textContent,practice&&separate?`Значення українською: ${meaning}`:"",label);
          assert.equal(elements.get("example-translation").textContent,example,label);
          assert.equal(elements.get("example-translation").hidden,!app.translationKey(example),label);
          assert.equal(elements.get("example").textContent,practice?app.feedbackExample(card).text:(card.example||card.word),label);
          if(separate)distinct++;else duplicates++;
        }
      }
    }
  }
  assert.ok(duplicates>0);
  assert.ok(distinct>0);
});

test("duplicate comparison ignores Unicode and spacing differences but preserves distinct meanings",()=>{
  const {app,elements}=runtime();
  const card={
    id:"translation-test",targetId:"translation-test",type:"recall",category:"RECALL",
    word:"der Bahnhof",promptText:"Вокзал",translation:"Ми бачимо вас на вокзалі.",
    example:"Wir sehen euch am Bahnhof.",exampleTranslation:"  Ми бачимо\u00a0вас  на вокзалі.\n",
    response:{scope:"word",accepted:["der Bahnhof"]}
  };
  app.renderCard("w-questions",1,card,"correct");
  assert.equal(elements.get("answer-translation").hidden,true);
  assert.equal(elements.get("answer-translation").textContent,"");
  assert.equal(elements.get("example-translation").textContent,card.exampleTranslation);

  app.renderCard("w-questions",0,card);
  assert.equal(elements.get("translation").hidden,true);
  assert.equal(elements.get("example-translation").hidden,false);
  assert.equal(app.translationKey("і\u0308"),app.translationKey("ї"));
  assert.notEqual(app.translationKey("Ви"),app.translationKey("ви"));

  card.translation="вокзал";
  app.renderCard("w-questions",1,card,"revealed");
  assert.equal(elements.get("answer-translation").hidden,false);
  assert.equal(elements.get("answer-translation").textContent,"Значення українською: вокзал");
  app.renderCard("w-questions",0,card);
  assert.equal(elements.get("translation").hidden,false);
  assert.equal(elements.get("translation").textContent,"вокзал");
  assert.equal(elements.get("answer-translation").hidden,true);
});

test("switching cards clears hidden meanings without revealing answers before an attempt",()=>{
  const {app,elements}=runtime();
  const cards=app.definitions["personal-pronoun-cases"].stages[1].cards;
  const distinct=cards.find(card=>app.translationKey(card.translation)!==app.translationKey(app.feedbackExample(card).translation));
  const duplicate=cards.find(card=>app.translationKey(card.translation)===app.translationKey(app.feedbackExample(card).translation));
  assert.ok(distinct);
  assert.ok(duplicate);
  app.renderCard("personal-pronoun-cases",1,distinct,"correct");
  assert.equal(elements.get("answer-translation").hidden,false);
  app.renderCard("personal-pronoun-cases",1,duplicate,"revealed");
  assert.equal(elements.get("answer-translation").hidden,true);
  assert.equal(elements.get("answer-translation").textContent,"");
  assert.equal(elements.get("feedback-context").open,true);
  app.renderCard("personal-pronoun-cases",1,distinct);
  assert.equal(elements.get("answer").style.display,"none");
  assert.equal(elements.get("answer-translation").hidden,true);
  assert.equal(elements.get("answer-translation").textContent,"");
  assert.equal(elements.get("translation").hidden,true);
  assert.equal(elements.get("feedback-outcome").hidden,true);
});

test("keeps an expanded answer context open through subsequent practice cards",()=>{
  const {app,elements}=runtime();
  const lessonId="personal-pronoun-cases",stageIndex=1;
  const [first,second]=app.variantsForStage(app.definitions[lessonId].stages[stageIndex]);
  app.renderCard(lessonId,stageIndex,first,"correct");
  const context=elements.get("feedback-context");
  context.open=true;

  app.renderCard(lessonId,stageIndex,second);
  assert.equal(elements.get("answer").style.display,"none");
  assert.equal(context.open,true);

  app.renderCard(lessonId,stageIndex,second,"correct");
  assert.equal(context.open,true);
});

test("mixed pronoun practice conceals the case until correct or wrong feedback",()=>{
  const {app,elements}=runtime();
  const lessonId="personal-pronoun-cases",stage=app.definitions[lessonId].stages[5];
  for(const card of app.variantsForStage(stage)){
    app.renderCard(lessonId,5,card);
    assert.equal(elements.get("category-label").textContent,"Особові займенники · Пропуск",card.id);
    assert.doesNotMatch(elements.get("question-word").textContent,/\b(?:Akkusativ|Dativ)\b/i,card.id);
    assert.doesNotMatch(elements.get("prompt-support").textContent,/\b(?:Akkusativ|Dativ)\b/i,card.id);
    assert.equal(elements.get("prompt-support").textContent,card.support,card.id);
    assert.equal(elements.get("answer").style.display,"none",card.id);
    for(const status of ["correct","revealed"]){
      app.renderCard(lessonId,5,card,status);
      assert.equal(elements.get("category-label").textContent,`Особові займенники · ${card.category.split(" · ")[1]} · Пропуск`,card.id);
      assert.equal(elements.get("answer").style.display,"block",card.id);
    }
    app.renderCard(lessonId,5,card);
    assert.doesNotMatch(elements.get("category-label").textContent,/\b(?:Akkusativ|Dativ)\b/i,card.id);
  }
});

test("focused practice and all learn stages retain their original case labels and prompts",()=>{
  const {app,elements}=runtime();
  const lessonId="personal-pronoun-cases";
  for(const stageIndex of [0,1,2,3,4]){
    const stage=app.definitions[lessonId].stages[stageIndex];
    for(const card of stage.cards){
      app.renderCard(lessonId,stageIndex,card);
      assert.match(elements.get("category-label").textContent,/\b(?:AKKUSATIV|DATIV)\b/,card.id);
      const prompt=elements.get("question-word");
      const text=prompt.children.length?prompt.children.map(child=>child.textContent).join(" "):prompt.textContent;
      assert.equal(text,stage.mode==="input"?card.promptText:card.word,card.id);
    }
  }
});
