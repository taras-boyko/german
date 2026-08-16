const cards=[
  {word:"Warum?",translation:"Чому?",category:"QUESTION WORD",filter:"time",example:"Warum fährst du heute mit dem Bus?",exampleTranslation:"Чому ти сьогодні їдеш автобусом?"},
  {word:"Wer?",translation:"Хто?",category:"QUESTION WORD",filter:"basics",example:"Wer ist das?",exampleTranslation:"Хто це?"},
  {word:"Was?",translation:"Що?",category:"QUESTION WORD",filter:"basics",example:"Was machst du heute Abend?",exampleTranslation:"Що ти робиш сьогодні ввечері?"},
  {word:"Wohin?",translation:"Куди?",category:"PLACE & DIRECTION",filter:"place",example:"Wohin fährst du morgen?",exampleTranslation:"Куди ти їдеш завтра?"},
  {word:"Wann?",translation:"Коли?",category:"TIME & REASON",filter:"time",example:"Wann kommst du nach Hause?",exampleTranslation:"Коли ти приходиш додому?"},
  {word:"Wie?",translation:"Як?",category:"QUESTION WORD",filter:"basics",example:"Wie geht es dir?",exampleTranslation:"Як у тебе справи?"},
  {word:"Wo?",translation:"Де?",category:"PLACE & DIRECTION",filter:"place",example:"Wo liegt das Buch?",exampleTranslation:"Де лежить книга?"},
  {word:"Woher?",translation:"Звідки?",category:"PLACE & DIRECTION",filter:"place",example:"Woher kommst du?",exampleTranslation:"Звідки ти?"},
  {word:"Warum?",translation:"Чому?",category:"TIME & REASON",filter:"time",example:"Warum lernst du Deutsch?",exampleTranslation:"Чому ти вивчаєш німецьку?"},
  {word:"Welche?",translation:"Котрий / яка / яке?",category:"QUESTION WORD",filter:"basics",example:"Welche Sprache sprichst du?",exampleTranslation:"Якою мовою ти розмовляєш?"},
  {word:"Wie viele?",translation:"Скільки?",category:"QUESTION WORD",filter:"basics",example:"Wie viele Katzen habt ihr?",exampleTranslation:"Скільки у вас котів?"},
  {word:"Wie heißt du?",translation:"Як тебе звати?",category:"QUESTION WORD",filter:"basics",example:"Wie heißt du?",exampleTranslation:"Як тебе звати?"}
];
const pronounCards=[
  {word:"ich",translation:"я",category:"PERSONAL PRONOUN",example:"Ich lerne Deutsch.",exampleTranslation:"Я вивчаю німецьку."},
  {word:"du",translation:"ти",category:"PERSONAL PRONOUN",example:"Du bist mein Freund.",exampleTranslation:"Ти мій друг."},
  {word:"er",translation:"він",category:"PERSONAL PRONOUN",example:"Er kommt aus Berlin.",exampleTranslation:"Він з Берліна."},
  {word:"sie",translation:"вона",category:"PERSONAL PRONOUN",example:"Sie heißt Anna.",exampleTranslation:"Її звати Анна."},
  {word:"es",translation:"воно",category:"PERSONAL PRONOUN",example:"Es ist kalt.",exampleTranslation:"Холодно."},
  {word:"wir",translation:"ми",category:"PERSONAL PRONOUN",example:"Wir wohnen in Kyjiw.",exampleTranslation:"Ми живемо в Києві."},
  {word:"ihr",translation:"ви",category:"PERSONAL PRONOUN",example:"Ihr seid sehr nett.",exampleTranslation:"Ви дуже милі."},
  {word:"Sie",translation:"Ви (ввічливо)",category:"PERSONAL PRONOUN",example:"Wie heißen Sie?",exampleTranslation:"Як Вас звати?"}
];
const seinCards=[
  {word:"ich bin",translation:"я є / я знаходжусь",category:"VERB SEIN",example:"Ich bin müde.",exampleTranslation:"Я втомлений."},
  {word:"du bist",translation:"ти є / ти знаходишся",category:"VERB SEIN",example:"Du bist sehr nett.",exampleTranslation:"Ти дуже милий."},
  {word:"er / sie / es ist",translation:"він / вона / воно є",category:"VERB SEIN",example:"Sie ist meine Schwester.",exampleTranslation:"Вона моя сестра."},
  {word:"wir sind",translation:"ми є / ми знаходимося",category:"VERB SEIN",example:"Wir sind zu Hause.",exampleTranslation:"Ми вдома."},
  {word:"ihr seid",translation:"ви є / ви знаходитеся",category:"VERB SEIN",example:"Ihr seid heute spät.",exampleTranslation:"Ви сьогодні запізнилися."},
  {word:"sie / Sie sind",translation:"вони є / Ви є",category:"VERB SEIN",example:"Sie sind aus Deutschland.",exampleTranslation:"Вони з Німеччини."}
];
const deckDefinitions={
  "w-questions":{title:"W-Fragen",label:"All W-Fragen",cards},
  pronouns:{title:"Personal pronouns",label:"Personal pronouns",cards:pronounCards},
  sein:{title:"Verb sein",label:"Verb sein",cards:seinCards}
};
let activeDeckId="w-questions",deck=[...cards],index=0,flipped=false,completed=0,verificationMode=false,verified=false,answerRevealed=false,sequenceSuccessful=true,celebrating=false,direction="uk-de";
const $=id=>document.getElementById(id);
function updatePageTitle(view){
  $("page-title").textContent=view==="practice"?`Practice ${deckDefinitions[activeDeckId].title}`:view==="library"?"Card library":"Your progress";
}
const activityStorageKey="german-wfragen-activity-v1";
let activity={attempts:0,correct:0,days:{}};
const saved=JSON.parse(localStorage.getItem(activityStorageKey)||"null");
if(saved&&typeof saved==="object"&&saved.days&&typeof saved.days==="object")activity={attempts:Number(saved.attempts)||0,correct:Number(saved.correct)||0,days:saved.days};
function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function recordReview(wasCorrect){
  const today=dateKey(new Date());
  activity.attempts+=1;
  if(wasCorrect)activity.correct+=1;
  activity.days[today]=(Number(activity.days[today])||0)+1;
  localStorage.setItem(activityStorageKey,JSON.stringify(activity));
  updateStats();
}
function updateStats(){
  const today=new Date(),todayKey=dateKey(today),counts=[];
  for(let offset=6;offset>=0;offset-=1){const date=new Date(today);date.setDate(today.getDate()-offset);counts.push(Number(activity.days[dateKey(date)])||0)}
  const weeklyTotal=counts.reduce((sum,count)=>sum+count,0),maxCount=Math.max(...counts,1);
  let streak=0;
  for(let offset=0;offset<activity.attempts+1;offset+=1){const date=new Date(today);date.setDate(today.getDate()-offset);if((Number(activity.days[dateKey(date)])||0)===0)break;streak+=1}
  $("streak").textContent=streak;$("overview-streak").textContent=streak;$("recall-rate").textContent=`${activity.attempts?Math.round(activity.correct/activity.attempts*100):0}%`;$("weekly-reviewed").innerHTML=`${weeklyTotal} <small>this week</small>`;
  document.querySelectorAll(".bar[data-day]").forEach((bar,index)=>{bar.style.height=`${Math.max(8,counts[index]/maxCount*82)}%`;bar.classList.toggle("today",dateKey(new Date(today.getFullYear(),today.getMonth(),today.getDate()-6+index))===todayKey)});
}
function createUniqueSeed(){
  const values=new Uint32Array(4);
  if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(values);
  else values.set([Date.now()>>>0,Math.floor(Math.random()*0x100000000)>>>0,performance.now()>>>0,Math.floor(Math.random()*0x100000000)>>>0]);
  return Array.from(values).map(value=>value.toString(16).padStart(8,"0")).join("-");
}
function seededRandom(seed){
  let state=2166136261;
  for(const character of seed){state^=character.charCodeAt(0);state=Math.imul(state,16777619)}
  return ()=>{
    state=Math.imul(state^state>>>15,1|state);
    state^=state+Math.imul(state^state>>>7,61|state);
    return ((state^state>>>14)>>>0)/4294967296;
  };
}
function shuffleDeck(seed=createUniqueSeed()){
  const random=seededRandom(seed);
  for(let position=deck.length-1;position>0;position-=1){
    const randomPosition=Math.floor(random()*(position+1));
    [deck[position],deck[randomPosition]]=[deck[randomPosition],deck[position]];
  }
}
function selectDeck(deckId,filter){
  activeDeckId=deckId;
  const source=deckDefinitions[deckId].cards;
  deck=filter?source.filter(card=>card.filter===filter):[...source];
  shuffleDeck();
  index=0;
  completed=0;
  flipped=false;
  verified=false;
  answerRevealed=false;
  sequenceSuccessful=true;
  $("verification-feedback").textContent="";
  $("verification-feedback").className="verification-feedback";
  if(!$("practice-view").classList.contains("hidden"))updatePageTitle("practice");
  render(verificationMode?"verification-input":"flashcard");
}
function render(focusTarget=""){
  const card=deck[index%deck.length],revealed=verified||answerRevealed,verificationPrompt=direction==="uk-de"?"Enter the corresponding question in German":"Enter the Ukrainian translation",prompt=direction==="uk-de"?card.translation:card.word,expected=direction==="uk-de"?card.word:card.translation;
  $("question-word").textContent=verificationMode?(revealed?expected:prompt):card.word;$("translation").textContent=verificationMode?(revealed?"Правильна відповідь":verificationPrompt):card.translation;$("original-question-text").textContent=prompt;$("original-question").hidden=!answerRevealed;$("category-label").textContent=card.category;$("example").textContent=card.example;$("example-translation").textContent=card.exampleTranslation;$("card-number").innerHTML=`${String(index+1).padStart(2,"0")} <em>/ ${deck.length}</em>`;$("remaining").textContent=Math.max(deck.length-completed,0);$("completed-count").textContent=completed;$("deck-size").textContent=deck.length;$("session-progress").style.width=`${Math.min(completed/deck.length*100,100)}%`;$("deck-label").textContent=deckDefinitions[activeDeckId].label;
  $("verification-label").textContent=direction==="uk-de"?"Write the German question":"Write the Ukrainian translation";$("verification-input").placeholder=direction==="uk-de"?"Type the W-question...":"Type the Ukrainian translation...";$("flashcard").classList.toggle("flipped",!verificationMode&&flipped||verificationMode&&revealed);$("answer").style.display=verificationMode&&revealed?"block":verificationMode?"none":"";$("verification-panel").classList.toggle("visible",verificationMode);$("flip-hint").innerHTML=verificationMode?(revealed?"<span>→</span> Press Enter for next card":"<span>✓</span> Type the answer and press Enter"):"<span>↻</span> Click to reveal answer <kbd>Space</kbd>";$("bookmark").classList.remove("saved");if(!answerRevealed)$("verification-input").value=verified?expected:"";$("verification-input").readOnly=revealed;$("check-button").textContent=revealed?"Next card":"Check answer";$("correction-display").hidden=!answerRevealed;if(answerRevealed)renderCorrection($("verification-input").value,expected);else $("correction-text").replaceChildren();
  if(focusTarget)requestAnimationFrame(()=>{const element=$(focusTarget);if(!element||element.hidden)return;element.focus();if(element===$("verification-input")&&!revealed)element.select()});
}
function showCelebration(){
  const confetti=$("confetti"),colors=["#6c5ce7","#f39b63","#54bf9b","#6ba9ed","#f27d9b"];
  confetti.replaceChildren();
  for(let pieceIndex=0;pieceIndex<36;pieceIndex+=1){
    const piece=document.createElement("i");
    piece.className="confetti-piece";
    piece.style.setProperty("--left",`${Math.random()*100}%`);
    piece.style.setProperty("--delay",`${Math.random()*.45}s`);
    piece.style.setProperty("--duration",`${1.6+Math.random()*.8}s`);
    piece.style.setProperty("--color",colors[pieceIndex%colors.length]);
    piece.style.setProperty("--rotation",`${Math.random()*360}deg`);
    confetti.appendChild(piece);
  }
  $("celebration").hidden=false;
  celebrating=true;
  window.setTimeout(()=>{
    $("celebration").hidden=true;
    confetti.replaceChildren();
    celebrating=false;
    shuffleDeck();
    index=0;
    completed=0;
    flipped=false;
    verified=false;
    answerRevealed=false;
    sequenceSuccessful=true;
    $("verification-feedback").textContent="";
    $("verification-feedback").className="verification-feedback";
    render(verificationMode?"verification-input":"flashcard");
  },2800);
}
function next(rating="again"){
  if(celebrating||verificationMode&&!verified&&!answerRevealed)return;
  if(!verificationMode&&!flipped){flipped=true;render("rating");return}
  const wasSuccessful=verificationMode?verified:rating!=="again";
  recordReview(wasSuccessful);
  sequenceSuccessful=sequenceSuccessful&&wasSuccessful;
  if(index===deck.length-1){
    completed=deck.length;
    if(sequenceSuccessful){
      render(verificationMode?"verification-input":"flashcard");
      showCelebration();
    }else{
      shuffleDeck();
      index=0;
      completed=0;
      flipped=false;
      verified=false;
      answerRevealed=false;
      sequenceSuccessful=true;
      $("verification-feedback").textContent="";
      $("verification-feedback").className="verification-feedback";
      render(verificationMode?"verification-input":"flashcard");
    }
    return;
  }
  index+=1;
  completed=Math.min(completed+1,deck.length);
  flipped=false;
  verified=false;
  answerRevealed=false;
  $("verification-feedback").textContent="";
  $("verification-feedback").className="verification-feedback";
  render(verificationMode?"verification-input":"flashcard");
}
function previous(){if(celebrating)return;index=(index-1+deck.length)%deck.length;flipped=false;verified=false;answerRevealed=false;$("verification-feedback").textContent="";render(verificationMode?"verification-input":"flashcard")}
function normalizeAnswer(value){
  return value.normalize("NFKC").trim().toLocaleLowerCase().replace(/[⁄∕／]/g,"/").replace(/[?!.,]/g,"").replace(/\s+/g," ")
}
function tokenizeAnswer(value){
  return value.trim().split(/\s+/).filter(Boolean).map(text=>({text,key:normalizeAnswer(text)}))
}
function renderCorrection(value,expected){
  const actual=tokenizeAnswer(value),target=tokenizeAnswer(expected),distance=Array.from({length:actual.length+1},()=>Array(target.length+1).fill(0));
  for(let actualIndex=0;actualIndex<=actual.length;actualIndex+=1)distance[actualIndex][0]=actualIndex;
  for(let targetIndex=0;targetIndex<=target.length;targetIndex+=1)distance[0][targetIndex]=targetIndex;
  for(let actualIndex=1;actualIndex<=actual.length;actualIndex+=1){
    for(let targetIndex=1;targetIndex<=target.length;targetIndex+=1){
      const same=actual[actualIndex-1].key===target[targetIndex-1].key;
      distance[actualIndex][targetIndex]=same?distance[actualIndex-1][targetIndex-1]:Math.min(distance[actualIndex-1][targetIndex-1],distance[actualIndex-1][targetIndex],distance[actualIndex][targetIndex-1])+1;
    }
  }
  const operations=[];let actualIndex=actual.length,targetIndex=target.length;
  while(actualIndex||targetIndex){
    if(actualIndex&&targetIndex&&actual[actualIndex-1].key===target[targetIndex-1].key){operations.unshift({type:"same",actual:actual[actualIndex-1]});actualIndex-=1;targetIndex-=1;continue}
    const replaceCost=actualIndex&&targetIndex?distance[actualIndex-1][targetIndex-1]:Infinity,deleteCost=actualIndex?distance[actualIndex-1][targetIndex]:Infinity,insertCost=targetIndex?distance[actualIndex][targetIndex-1]:Infinity;
    if(replaceCost<=deleteCost&&replaceCost<=insertCost){operations.unshift({type:"replace",actual:actual[actualIndex-1],expected:target[targetIndex-1]});actualIndex-=1;targetIndex-=1}
    else if(deleteCost<=insertCost){operations.unshift({type:"delete",actual:actual[actualIndex-1]});actualIndex-=1}
    else{operations.unshift({type:"insert",expected:target[targetIndex-1]});targetIndex-=1}
  }
  const fragment=document.createDocumentFragment(),appendToken=(token,className)=>{const element=document.createElement("span");element.className=`correction-token ${className}`;element.textContent=token.text;fragment.appendChild(element)};
  operations.forEach((operation,operationIndex)=>{
    if(operationIndex)fragment.appendChild(document.createTextNode(" "));
    if(operation.type==="same")appendToken(operation.actual,"same");
    if(operation.type==="delete"){const element=document.createElement("del");element.className="correction-token wrong";element.textContent=operation.actual.text;fragment.appendChild(element)}
    if(operation.type==="insert"){const element=document.createElement("ins");element.className="correction-token right";element.textContent=operation.expected.text;fragment.appendChild(element)}
    if(operation.type==="replace"){
      const change=document.createElement("span");change.className="correction-change";
      const wrong=document.createElement("del");wrong.className="correction-token wrong";wrong.textContent=operation.actual.text;
      const arrow=document.createElement("span");arrow.className="correction-arrow";arrow.textContent="→";
      const right=document.createElement("ins");right.className="correction-token right";right.textContent=operation.expected.text;
      change.append(wrong,arrow,right);fragment.appendChild(change);
    }
  });
  $("correction-text").replaceChildren(fragment);
}
function splitAnswer(value){return normalizeAnswer(value).split(/\s*[,\/\\]\s*/).filter(Boolean)}
function answersMatch(value,expected){
  const normalizedValue=normalizeAnswer(value),normalizedExpected=normalizeAnswer(expected);
  if(normalizedValue===normalizedExpected)return true;
  const expectedOptions=splitAnswer(expected),inputOptions=splitAnswer(value);
  return expectedOptions.length>1&&inputOptions.length===expectedOptions.length&&inputOptions.every((option,index)=>option===expectedOptions[index]);
}
function handleTestEnter(){
  if(verified||answerRevealed){next();return}
  checkAnswer();
}
function checkAnswer(){
  if(verified||answerRevealed){next();return}
  const card=deck[index%deck.length],value=$("verification-input").value,expected=direction==="uk-de"?card.word:card.translation;
  if(!normalizeAnswer(value)){
    $("verification-feedback").textContent="Type an answer first.";
    $("verification-feedback").className="verification-feedback incorrect";
    requestAnimationFrame(()=>$("verification-input").focus());
    return;
  }
  if(answersMatch(value,expected)){
    verified=true;
    $("verification-feedback").textContent="Correct! Well done.";
    $("verification-feedback").className="verification-feedback correct";
    render("verification-input");
    return;
  }
  answerRevealed=true;
  $("verification-feedback").textContent="Not quite. Review the corrections below.";
  $("verification-feedback").className="verification-feedback incorrect";
  render("verification-input");
}
$("flashcard").addEventListener("click",e=>{if(!verificationMode&&!e.target.closest(".bookmark")){flipped=!flipped;render()}});
$("bookmark").addEventListener("click",e=>{e.stopPropagation();e.currentTarget.classList.toggle("saved");e.currentTarget.textContent=e.currentTarget.classList.contains("saved")?"♥":"♡"});
document.querySelectorAll("[data-rating]").forEach(button=>button.addEventListener("click",()=>next(button.dataset.rating)));
document.addEventListener("keydown",e=>{if(e.target.id==="verification-input"){if(e.key==="Enter"){e.preventDefault();handleTestEnter()}return}if(e.key==="Enter"&&verificationMode){e.preventDefault();handleTestEnter();return}if(e.key===" "&&!verificationMode){e.preventDefault();flipped=!flipped;render(flipped?"rating":"flashcard")}if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")previous()});
document.querySelector("#mode-toggle").addEventListener("click",()=>{verificationMode=!verificationMode;flipped=false;verified=false;answerRevealed=false;$("mode-toggle").classList.toggle("active",verificationMode);$("mode-toggle").textContent=verificationMode?"✓ Test on":"✓ Test";render(verificationMode?"verification-input":"flashcard")});
document.querySelector("#direction-select").addEventListener("change",e=>{direction=e.target.value;verified=false;answerRevealed=false;flipped=false;$("verification-feedback").textContent="";render(verificationMode?"verification-input":"flashcard")});
document.querySelector("#check-button").addEventListener("click",handleTestEnter);
document.querySelectorAll(".deck-item").forEach(item=>item.addEventListener("click",()=>{const filter=item.dataset.filter;selectDeck("w-questions",filter==="all"?"":filter);document.querySelectorAll(".deck-item").forEach(x=>x.classList.remove("active"));item.classList.add("active")}));
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{const view=item.dataset.view;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(`${view}-view`).classList.remove("hidden");updatePageTitle(view)}));
document.querySelector("#start-library").addEventListener("click",()=>{selectDeck("w-questions");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-pronouns").addEventListener("click",()=>{selectDeck("pronouns");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-sein").addEventListener("click",()=>{selectDeck("sein");document.querySelector('[data-view="practice"]').click()});
shuffleDeck();
render();updateStats();
