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
let deck=[...cards],index=0,flipped=false,completed=0;
const $=id=>document.getElementById(id);
function render(){
  const card=deck[index%deck.length]; $("question-word").textContent=card.word;$("translation").textContent=card.translation;$("category-label").textContent=card.category;$("example").textContent=card.example;$("example-translation").textContent=card.exampleTranslation;$("card-number").innerHTML=`${String(index+1).padStart(2,"0")} <em>/ ${deck.length}</em>`;$("remaining").textContent=Math.max(deck.length-completed,0);$("completed-count").textContent=completed;$("session-progress").style.width=`${Math.min(completed/deck.length*100,100)}%`;$("deck-label").textContent=deck===cards?"All W-Fragen":deck[0]?.filter==="basics"?"The basics":deck[0]?.filter==="place"?"Place & direction":"Time & reason";
  $("flashcard").classList.toggle("flipped",flipped); $("bookmark").classList.remove("saved");
}
function next(){if(!flipped){flipped=true;render();return}completed=Math.min(completed+1,deck.length);index=(index+1)%deck.length;flipped=false;render()}
function previous(){index=(index-1+deck.length)%deck.length;flipped=false;render()}
$("flashcard").addEventListener("click",e=>{if(!e.target.closest(".bookmark")){flipped=!flipped;render()}});
$("bookmark").addEventListener("click",e=>{e.stopPropagation();e.currentTarget.classList.toggle("saved");e.currentTarget.textContent=e.currentTarget.classList.contains("saved")?"♥":"♡"});
document.querySelectorAll("[data-rating]").forEach(button=>button.addEventListener("click",next));
document.addEventListener("keydown",e=>{if(e.target.tagName==="INPUT")return;if(e.key===" "){e.preventDefault();flipped=!flipped;render()}if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")previous()});
document.querySelectorAll(".deck-item").forEach(item=>item.addEventListener("click",()=>{const filter=item.dataset.filter;deck=filter==="all"?cards:cards.filter(card=>card.filter===filter);index=0;completed=0;flipped=false;document.querySelectorAll(".deck-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");render()}));
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{const view=item.dataset.view;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(`${view}-view`).classList.remove("hidden");$("page-title").textContent=view==="practice"?"Practice W-Fragen":view==="library"?"Card library":"Your progress"}));
document.querySelector("#start-library").addEventListener("click",()=>document.querySelector('[data-view="practice"]').click());
render();
