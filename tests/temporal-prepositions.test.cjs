const assert=require("node:assert/strict");
const {randomUUID}=require("node:crypto");
const {readFileSync}=require("node:fs");
const {join}=require("node:path");
const {test}=require("node:test");
const vm=require("node:vm");

const lessonId="temporal-prepositions";
const script=readFileSync(join(__dirname,"../script.js"),"utf8");
const source=readFileSync(join(__dirname,"../app.js"),"utf8");
const context=vm.createContext({});
vm.runInContext(script,context);
const lesson=JSON.parse(vm.runInContext(`JSON.stringify(deckDefinitions["${lessonId}"])`,context));
const card=id=>lesson.cards.find(item=>item.id===id);
const chapterTargets=[6,6,8,5];

function runtime(saved=new Map()){
  const elements=new Map(),requests=[];
  class Element{
    constructor(tag="div"){
      this.tagName=tag.toUpperCase();
      this.children=[];
      this.attributes={};
      this.dataset={};
      this.listeners={};
      this.className="";
      this.hidden=false;
      this.value="";
      this.text="";
      this.style={setProperty:()=>{}};
      this.classList={
        contains:name=>this.className.split(/\s+/).includes(name),
        add:name=>{if(!this.classList.contains(name))this.className+=` ${name}`},
        remove:name=>{this.className=this.className.split(/\s+/).filter(item=>item!==name).join(" ")},
        toggle:(name,force)=>{
          const enabled=force===undefined?!this.classList.contains(name):force;
          this.classList[enabled?"add":"remove"](name);
          return enabled;
        }
      };
    }
    get textContent(){return this.text+this.children.map(child=>child.textContent).join("")}
    set textContent(value){this.text=value==null?"":String(value);this.children=[]}
    append(...children){this.children.push(...children.flatMap(child=>child.tagName==="#DOCUMENT-FRAGMENT"?child.children:[child]))}
    appendChild(child){this.append(child)}
    replaceChildren(...children){this.text="";this.children=[];this.append(...children)}
    setAttribute(name,value){this.attributes[name]=value}
    addEventListener(name,listener){this.listeners[name]=listener}
    focus(){document.activeElement=this}
    select(){}
    closest(){return ["BUTTON","A","INPUT"].includes(this.tagName)?this:null}
    click(){this.listeners.click?.({target:this,currentTarget:this,preventDefault(){},stopPropagation(){}})}
  }
  const document={
    activeElement:null,listeners:{},
    createElement:tag=>new Element(tag),
    createDocumentFragment:()=>new Element("#document-fragment"),
    createTextNode:text=>({textContent:text}),
    getElementById(id){
      if(!elements.has(id)){
        const element=new Element(id==="verification-input"?"input":"div");
        element.id=id;
        element.parentElement=new Element();
        elements.set(id,element);
      }
      return elements.get(id);
    },
    querySelector:selector=>document.getElementById(selector),
    querySelectorAll(selector){
      if(selector===".nav-item")return ["library","practice","progress"].map(view=>{
        const element=document.getElementById(`nav-${view}`);
        element.dataset.view=view;
        return element;
      });
      if(selector===".view")return ["library","practice","progress"].map(view=>document.getElementById(`${view}-view`));
      return [];
    },
    addEventListener(name,listener){this.listeners[name]=listener}
  };
  const storage=values=>({getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)});
  const bootstrap=source.lastIndexOf("\nresumeInitialSession();");
  assert.ok(bootstrap>0);
  const sandbox=vm.createContext({
    document,Element,crypto:{randomUUID},console,
    window:{scrollTo:()=>{},addEventListener:()=>{}},
    localStorage:storage(saved),sessionStorage:storage(new Map()),
    requestAnimationFrame:callback=>callback(),matchMedia:()=>({matches:true}),
    fetch:async(url,options)=>{
      requests.push({url,...options});
      return {ok:true};
    }
  });
  vm.runInContext(script,sandbox);
  vm.runInContext(`${source.slice(0,bootstrap)}
    globalThis.runtime={
      definitions:deckDefinitions,samplePass,variantsForStage,answerMatches,lessonState,lessonCoverage,coveragePercent,courseCoverage,
      canResume,normalizeState,lessonStatus,persistState,
      resume(){resumeInitialSession();restorePendingCompletion()},
      get state(){return learningState},
      get card(){return deck[index]},
      get index(){return index}
    };
  })();`,sandbox);
  const app=sandbox.runtime;
  function key(key,target=document.getElementById("verification-input")){
    document.listeners.keydown({key,target,preventDefault(){}});
  }
  function answer(value){
    const input=document.getElementById("verification-input");
    input.value=value;
    input.listeners.input({target:input});
    key("Enter");
  }
  function open(stageIndex){
    document.getElementById("nav-library").click();
    const descendants=element=>element.children.flatMap(child=>[child,...descendants(child)]);
    const article=descendants(document.getElementById("section-grid")).find(item=>item.tagName==="ARTICLE"&&
      descendants(item).some(child=>child.tagName==="H4"&&child.textContent===app.definitions[lessonId].title));
    assert.ok(article,"lesson must be discoverable in the library");
    article.children.at(-1).click();
    if(stageIndex!==undefined){
      const row=document.getElementById("lesson-steps").children[Math.floor(stageIndex/2)];
      row.children[1].children[stageIndex%2].click();
    }
  }
  return {app,elements,saved,requests,key,answer,open};
}

test("four chapters pair a learn stage with a practice stage over the same explicit pool",()=>{
  assert.equal(lesson.cards.length,75);
  assert.equal(new Set(lesson.cards.map(item=>item.id)).size,75);
  assert.equal(lesson.stages.length,8);
  assert.equal(new Set(lesson.stages.map(stage=>stage.chapter)).size,4);
  for(let index=0;index<lesson.stages.length;index+=2){
    const learn=lesson.stages[index],practice=lesson.stages[index+1];
    assert.equal(learn.mode,"learn");
    assert.equal(practice.mode,"input");
    assert.equal(learn.chapter,practice.chapter);
    assert.deepEqual(learn.cards,practice.cards);
    const targets=new Set(learn.cards.map(item=>item.targetId));
    assert.equal(targets.size,chapterTargets[index/2],learn.id);
    for(const targetId of targets)assert.equal(learn.cards.filter(item=>item.targetId===targetId).length,3,targetId);
  }
  assert.deepEqual(lesson.stages.flatMap(stage=>stage.cards).map(item=>item.id).filter((id,index,all)=>all.indexOf(id)===index).sort(),
    lesson.cards.map(item=>item.id).sort());
});

test("cloze cards have one gap, rebuild the example and name the governing case",()=>{
  for(const item of lesson.cards.filter(item=>item.type==="cloze")){
    assert.equal(item.word,item.response.accepted[0],item.id);
    assert.equal(item.promptText.split("___").length,2,item.id);
    assert.equal(item.promptText.replace("___",item.word),item.example,item.id);
    assert.equal(item.support,item.translation,item.id);
    assert.ok(item.translation&&item.studyTranslation&&item.explanation,item.id);
    assert.ok(item.explanation.length<=220,item.id);
    assert.equal(item.practiceVariants,false,item.id);
    assert.equal(item.response.mode,"text");
    assert.equal(item.response.caseSensitive,false);
    assert.equal(item.response.punctuationSensitive,false);
    assert.match(item.category,/^TEMPORALE PRÄPOSITION · /,item.id);
    const preposition=item.word.split(" ")[0].toLowerCase();
    if(["vor","nach","in"].includes(preposition)&&item.word.includes(" "))assert.match(item.category,/\+ DATIV$/,item.id);
    if(preposition==="für"&&item.word.includes(" "))assert.match(item.category,/\+ AKKUSATIV$/,item.id);
  }
  for(const item of lesson.cards.filter(item=>/^temporal-(event|span)-/.test(item.id))){
    assert.equal(item.response.scope,"phrase",item.id);
    assert.ok(item.noun,item.id);
  }
  for(const item of lesson.cards.filter(item=>item.id.startsWith("temporal-mixed-"))){
    assert.equal(item.response.scope,"word",item.id);
    assert.doesNotMatch(item.word,/\s/,item.id);
  }
});

test("the guide covers every meaning, both cases and the plural -n contrast",()=>{
  const rules=lesson.guide.rules;
  const table=rules.find(rule=>rule.table)?.table;
  assert.deepEqual(table.columns.map(column=>column.label),["der","das","die","Plural"]);
  assert.deepEqual(table.rows.map(row=>[row.title,...row.cells]),[
    ["Nominativ","der","das","die","die"],
    ["Akkusativ","den","das","die","die"],
    ["Dativ","dem","dem","der","den"]
  ]);
  const text=JSON.stringify(lesson.guide);
  for(const expected of ["vor dem Essen","nach der Arbeit","vor zwei Jahren","in zwei Minuten","für zwei Jahre",
    "in drei Tagen ↔ für drei Tage","einem · einem · einer","einen · ein · eine","um 9 Uhr","am Montag","von 9 bis 17 Uhr",
    "Wann?","wie lange?","Часові вирази"]){
    assert.ok(text.includes(expected),expected);
  }
});

test("Dativ plurals take -n after vor, in and nach but not after für",()=>{
  for(const [id,noun] of [
    ["temporal-event-vor-den-feiertagen","Feiertagen"],["temporal-event-nach-den-kursen","Kursen"],
    ["temporal-span-vor-plural-jahren","Jahren"],["temporal-span-vor-plural-tagen","Tagen"],
    ["temporal-span-in-plural-tagen","Tagen"],["temporal-span-in-plural-monaten","Monaten"]
  ]){
    assert.ok(card(id).example.includes(noun),id);
    assert.match(card(id).explanation,/-n/,id);
  }
  for(const [id,noun] of [["temporal-span-fuer-plural-tage","drei Tage"],["temporal-span-fuer-plural-jahre","zwei Jahre"],["temporal-span-fuer-plural-monate","sechs Monate"]]){
    assert.ok(card(id).word.endsWith(noun),id);
    assert.match(card(id).explanation,/Akkusativ/,id);
  }
});

test("sentence builds keep the verb second, accept the time-first order and expose their structure",()=>{
  const sentences=lesson.cards.filter(item=>item.type==="sentence-build");
  assert.equal(sentences.length,15);
  for(const item of sentences){
    assert.equal(item.response.scope,"sentence",item.id);
    assert.equal(item.response.accepted.length,2,item.id);
    assert.equal(item.word,item.response.accepted[0],item.id);
    assert.equal(item.example,item.response.accepted[1],item.id);
    assert.ok(item.promptText.includes(" / "),item.id);
    assert.match(item.support,/[а-яіїєґ]/i,item.id);
    assert.equal(item.structure.length,1,item.id);
    const rebuilt=item.structure[0].map(slot=>slot.text).join(" ");
    assert.equal(rebuilt.replace(/[.!?]$/,""),item.word.replace(/[.!?]$/,""),item.id);
    const [first,second]=item.response.accepted.map(sentence=>sentence.split(" "));
    assert.notEqual(first[0],second[0],item.id);
  }
  assert.match(card("temporal-sentence-perfekt-umziehen").support,/Perfekt/);
});

test("evaluation accepts digits for numbers and rejects the wrong preposition or case",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    for(const item of stage.cards){
      for(const answer of item.response.accepted)assert.ok(app.answerMatches(`  ${answer}  `,item),item.id);
      assert.ok(!app.answerMatches("wrong",item),item.id);
    }
  }
  const cards=app.definitions[lessonId].cards;
  const find=id=>cards.find(item=>item.id===id);
  assert.ok(app.answerMatches("vor 3 Jahren",find("temporal-span-vor-plural-jahren")));
  assert.ok(app.answerMatches("Vor drei Jahren",find("temporal-span-vor-plural-jahren")));
  assert.ok(app.answerMatches("Um 7 Uhr stehe ich auf.",find("temporal-sentence-separable-aufstehen")));
  for(const [id,wrongAnswers] of [
    ["temporal-event-vor-dem-essen",["vor das","nach dem","vor den"]],
    ["temporal-event-nach-der-arbeit",["nach die","nach dem","vor der"]],
    ["temporal-span-vor-plural-jahren",["vor drei Jahre","in drei Jahren"]],
    ["temporal-span-in-plural-tagen",["in zwei Tage","für zwei Tage"]],
    ["temporal-span-fuer-singular-monat",["für einem Monat","für ein Monat","in einem Monat"]],
    ["temporal-span-fuer-plural-tage",["für drei Tagen"]],
    ["temporal-mixed-am-montag",["um","im","an"]],
    ["temporal-sentence-separable-aufstehen",["Ich aufstehe um 7 Uhr.","Um 7 Uhr ich stehe auf."]]
  ]){
    for(const answer of wrongAnswers)assert.ok(!app.answerMatches(answer,find(id)),`${id}: ${answer}`);
  }
});

test("shared sampling covers each chapter and rotates all three variants per target",()=>{
  const {app}=runtime();
  for(const stage of app.definitions[lessonId].stages){
    assert.equal(app.variantsForStage(stage).length,stage.cards.length,stage.id);
    const covered=new Set(),cycles=new Map(),allTargets=new Set(stage.cards.map(item=>item.targetId));
    for(let passIndex=0;passIndex<9;passIndex++){
      const pass=app.samplePass(lessonId,stage);
      assert.equal(pass.length,Math.min(7,allTargets.size),stage.id);
      assert.equal(new Set(pass.map(item=>item.targetId)).size,pass.length,stage.id);
      for(const item of pass){
        const cycle=cycles.get(item.targetId)||new Set();
        if(cycle.size===3)cycle.clear();
        assert.ok(!cycle.has(item.id),`${stage.id}: ${item.id} repeated before all variants appeared`);
        cycle.add(item.id);
        cycles.set(item.targetId,cycle);
        covered.add(item.targetId);
      }
      const collection=stage.mode==="input"?"masteredTargets":"learnedTargets";
      app.lessonState(lessonId)[collection][stage.id]=[...covered];
      if(passIndex===Math.ceil(allTargets.size/7)-1)assert.equal(covered.size,allTargets.size,stage.id);
    }
  }
});

test("cloze practice hides the specific preposition category until Check",()=>{
  const ui=runtime();
  ui.open(1);
  const first=ui.app.card;
  assert.equal(ui.elements.get("category-label").textContent.split(" · ")[0],"Прийменник часу");
  assert.doesNotMatch(ui.elements.get("category-label").textContent,/Dativ|Akkusativ/);
  assert.equal(ui.elements.get("question-word").textContent,first.promptText);
  assert.ok(ui.elements.get("check-button").disabled);
  ui.answer(first.word);
  assert.match(ui.elements.get("category-label").textContent,/Dativ/);
  assert.equal(ui.elements.get("feedback-title").textContent,`Правильно — ${first.word}`);
});

test("library, learn cards and practice corrections use the shared UI",()=>{
  const ui=runtime();
  ui.open(0);
  assert.equal(ui.elements.get("deck-label-de").textContent,"Temporale Präpositionen: vor, in, nach, für");
  assert.equal(ui.elements.get("lesson-chapter-count").textContent,"Розділ 1 з 4");
  assert.equal(ui.elements.get("question-word").textContent,ui.app.card.word);
  assert.equal(ui.elements.get("example").textContent,ui.app.card.example);
  ui.open(3);
  const first=ui.app.card;
  ui.answer("wrong");
  assert.equal(ui.elements.get("feedback-title").textContent,`Не зовсім — ${first.word}`);
  assert.equal(ui.elements.get("feedback-detail").textContent,first.explanation);
  assert.ok(!ui.elements.get("correction-display").hidden);
  assert.equal(ui.app.state.activeSession.answered[first.targetId],false);
});

test("all eight stages complete through bounded passes and the lesson becomes mastered",async()=>{
  const ui=runtime();
  for(let stageIndex=0;stageIndex<8;stageIndex++){
    const stage=ui.app.definitions[lessonId].stages[stageIndex];
    const targets=new Set(stage.cards.map(item=>item.targetId)).size;
    ui.open(stageIndex);
    for(let pass=0;pass<2;pass++){
      for(let step=0;ui.app.state.activeSession&&step<10;step++){
        if(stage.mode==="input"){
          ui.answer(ui.app.card.word);
          ui.key("Enter");
        }else ui.key("ArrowRight",ui.elements.get("flashcard"));
      }
      assert.equal(ui.app.state.activeSession,null,stage.id);
      assert.ok(!ui.elements.get("celebration").hidden,stage.id);
      const state=ui.app.lessonState(lessonId);
      const completed=stage.mode==="input"?state.masteredPractice:state.completedLearn;
      if(completed.includes(stage.id)){
        ui.elements.get("completion-library").click();
        break;
      }
      assert.ok(targets>7,stage.id);
      ui.elements.get("completion-primary").click();
    }
    const state=ui.app.lessonState(lessonId);
    assert.ok((stage.mode==="input"?state.masteredPractice:state.completedLearn).includes(stage.id),stage.id);
  }
  assert.equal(ui.app.lessonStatus(lessonId).key,"mastered");
  const coverage=ui.app.lessonCoverage(lessonId);
  assert.ok(coverage.total>0);
  assert.equal(coverage.covered,coverage.total);
  assert.equal(coverage.newTargets,0);
  assert.equal(ui.app.coveragePercent(coverage),100);
  assert.equal(ui.elements.get("progress-coverage").textContent,`${ui.app.coveragePercent(ui.app.courseCoverage())}%`);
  await ui.app.persistState();
  const durable=JSON.parse(ui.requests.at(-1).body);
  assert.equal(durable.lessons[lessonId].completedLearn.length,4);
  assert.equal(durable.lessons[lessonId].masteredPractice.length,4);
  const restored=runtime(ui.saved);
  assert.equal(restored.app.lessonStatus(lessonId).key,"mastered");
});
