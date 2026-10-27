(function(){
"use strict";

const STATE_VERSION=5;
const PASS_SIZE=7;
// Shuffle-bag history must keep every variant of a target's unfinished cycle, so it has to exceed the largest stage pool.
const RECENT_VARIANT_LIMIT=1000;
const stateStorageKey="german-learning-state-v5";
const previousStateStorageKeys=["german-learning-state-v4","german-learning-state-v3"];
const deviceStorageKey="german-learning-device-id";
const writerStorageKey="german-learning-writer-id";
const historyEndpoint="/api/lesson-history";
const $=id=>document.getElementById(id);
const lessonCatalog={
  "w-questions":{title:"Питальні слова",germanTitle:"W-Fragen",outcome:"Добирати потрібне питальне слово й ставити запитання німецькою.",className:"Лексика"},
  conjugation:{title:"Відмінювання дієслів",germanTitle:"Verbkonjugation",outcome:"Уживати правильні закінчення теперішнього часу й дотримуватися правил правопису.",className:"Морфологія"},
  "strong-verbs":{title:"Сильні дієслова",germanTitle:"Starke Verben",outcome:"Правильно утворювати форми сильних дієслів у контексті.",className:"Морфологія"},
  "past-verbs":{title:"Минулий час · A1",germanTitle:"Vergangenheit · A1",outcome:"Уживати Perfekt у повсякденному спілкуванні та впізнавати Präteritum дієслів sein і haben.",className:"Морфологія",level:"A1"},
  "past-verbs-a2":{title:"Минулий час · A2",germanTitle:"Vergangenheit · A2",outcome:"Уживати Präteritum модальних дієслів і поширені форми для розповіді про життя поряд із Perfekt.",className:"Морфологія",level:"A2"},
  "past-verbs-b1":{title:"Минулий час · B1",germanTitle:"Vergangenheit · B1",outcome:"Розрізняти Präteritum і Perfekt у розповідях рівня B1.",className:"Морфологія",level:"B1"},
  perfekt:{title:"Минулий час Perfekt: haben і sein",germanTitle:"Das Perfekt: haben und sein",outcome:"Утворювати Perfekt із правильним haben або sein та Partizip II.",className:"Морфологія"},
  "present-practice":{title:"Теперішній час: практика",germanTitle:"Präsens üben",outcome:"Пригадувати форми теперішнього часу за контекстом і значенням.",className:"Морфологія"},
  koennen:{title:"Модальні дієслова",germanTitle:"Modalverben",outcome:"Уживати können, mögen, möchten і wollen у корисних реченнях.",className:"Граматика"},
  haben:{title:"Мати, отримувати, потребувати",germanTitle:"Haben, bekommen, brauchen",outcome:"Розрізняти значення й форми haben, bekommen і brauchen.",className:"Граматика"},
  "word-order":{title:"Порядок слів",germanTitle:"Wortstellung",outcome:"Будувати розповідні й питальні речення з правильним порядком слів.",className:"Синтаксис"},
  "separable-verbs":{title:"Дієслова з відокремлюваними префіксами",germanTitle:"Trennbare Verben",outcome:"Правильно розміщувати відокремлювані префікси в різних типах речень.",className:"Синтаксис"},
  pronouns:{title:"Особові займенники",germanTitle:"Personalpronomen",outcome:"Добирати особові займенники за особою, числом і формою звертання.",className:"Лексика"},
  "personal-pronoun-cases":{title:"Особові займенники: Akkusativ і Dativ",germanTitle:"Personalpronomen: Akkusativ und Dativ",outcome:"Добирати особові займенники в Akkusativ і Dativ та розрізняти sie і Sie.",className:"Морфологія",level:"A1"},
  "reflexive-pronouns":{title:"Зворотні займенники: sich і схожі форми",germanTitle:"Reflexivpronomen: Akkusativ und Dativ",outcome:"Добирати mich, dich, sich, uns, euch і mir, dir за відмінком і пояснювати, коли дієслово вимагає зворотного займенника.",className:"Морфологія",level:"A1"},
  "indefinite-articles":{title:"Неозначений артикль: ein і kein",germanTitle:"Unbestimmter Artikel: ein und kein",outcome:"Добирати ein, eine, einen, einem, einer та заперечний kein за родом, множиною і відмінком іменника.",className:"Морфологія",level:"A1"},
  possessives:{title:"Присвійні займенники",germanTitle:"Possessivartikel",outcome:"Добирати основу за власником і правильне закінчення присвійного займенника.",className:"Морфологія"},
  "possessive-cases":{title:"Присвійні артиклі: Akkusativ і Dativ",germanTitle:"Possessivartikel: Akkusativ und Dativ",outcome:"Уживати присвійні артиклі в обох відмінках за родом і числом іменника, включно з euer та ввічливим Ihr.",className:"Морфологія",level:"A1"},
  sein:{title:"Дієслово sein — бути",germanTitle:"Das Verb sein",outcome:"Пригадувати всі форми sein у теперішньому часі.",className:"Морфологія"},
  werden:{title:"Дієслово werden — ставати",germanTitle:"Das Verb werden",outcome:"Пригадувати форми werden і вживати його для зміни стану, професії та з модальними дієсловами.",className:"Морфологія"},
  frequency:{title:"Прислівники частотності",germanTitle:"Häufigkeitsadverbien",outcome:"Точно виражати частотність: від immer до nie.",className:"Лексика"},
  "local-prepositions":{title:"Прийменники місця: Dativ і Akkusativ",germanTitle:"Wechselpräpositionen: Dativ und Akkusativ",outcome:"Добирати Dativ для місця та Akkusativ для напрямку руху.",className:"Граматика"},
  "time-expressions":{title:"Часові вирази",germanTitle:"Zeitangaben",outcome:"Добирати часові вирази й називати час у розмові.",className:"Граматика"},
  "temporal-prepositions":{title:"Прийменники часу: vor, in, nach, für",germanTitle:"Temporale Präpositionen: vor, in, nach, für",outcome:"Казати, коли щось сталося чи станеться і скільки триватиме: vor, in, nach + Dativ, für + Akkusativ, а також um, am, von … bis.",className:"Граматика",level:"A1"},
  "mit-ohne":{title:"Прийменники mit і ohne",germanTitle:"Präpositionen mit und ohne",outcome:"Казати, з ким, чим або як щось відбувається і чого немає: mit + Dativ, ohne + Akkusativ.",className:"Граматика",level:"A1"},
  "time-worksheet-vocabulary":{title:"Пори року й розпорядок дня",germanTitle:"Jahreszeiten und Tagesablauf",outcome:"Уживати лексику про пори року та розпорядок дня в контексті.",className:"Лексика"},
  "everyday-vocabulary":{title:"Повсякденна лексика",germanTitle:"Alltagswortschatz",outcome:"Уживати поширені слова про щоденні справи, їжу та напої.",className:"Лексика"},
  "travel-transport":{title:"Подорожі й транспорт",germanTitle:"Reisen und Verkehrsmittel",outcome:"Говорити німецькою про транспорт, маршрути й дії під час подорожі.",className:"Лексика"},
  "giving-directions":{title:"Як пояснити дорогу",germanTitle:"Den Weg beschreiben",outcome:"Пояснювати прості маршрути й розташування знайомих місць у місті.",className:"Лексика",level:"A1"},
  "dative-verbs":{title:"Дієслова з Dativ",germanTitle:"Verben mit Dativ",outcome:"Пригадувати 16 дієслів і вживати їхні форми теперішнього часу з додатками в Dativ.",className:"Лексика",level:"A2"},
  "vocab-license-travel":{title:"Водійське посвідчення і подорожі",germanTitle:"Führerschein und Reisen",outcome:"Пригадувати німецькі слова про водійське посвідчення, мотоцикл і подорожі та їхні українські значення.",className:"Лексика"},
  "vocab-post-contracts":{title:"Пошта і договори",germanTitle:"Post und Verträge",outcome:"Пригадувати німецькі слова про листи, документи й договори та їхні українські значення.",className:"Лексика"},
  "vocab-talk-feelings":{title:"Розмови і почуття",germanTitle:"Gespräche und Gefühle",outcome:"Пригадувати німецькі слова для розмов, думок і дій та їхні українські значення.",className:"Лексика"},
  "vocab-life-daily":{title:"Життя і щодня",germanTitle:"Leben und Alltag",outcome:"Пригадувати німецькі слова про життя, сім’ю і щоденні справи та їхні українські значення.",className:"Лексика"},
  "es-gibt-leisure":{title:"Місто й дозвілля: es gibt",germanTitle:"Stadt und Freizeit: es gibt",outcome:"Описувати місця, заняття й можливості для дозвілля в місті.",className:"Граматика"}
};
// Library groups follow the course path: words → forms → rule-based choice → sentence order.
const lessonClasses=[
  {name:"Лексика",glyph:"lexicon",summary:"Слова та їхнє значення"},
  {name:"Морфологія",glyph:"morphology",summary:"Форми слів: закінчення й відмінювання"},
  {name:"Граматика",glyph:"grammar",summary:"Вибір форми за правилом"},
  {name:"Синтаксис",glyph:"syntax",summary:"Порядок слів у реченні"}
];
// Each glyph is a miniature of the visual that class uses inside its lessons.
const lessonClassGlyphs={
  lexicon:'<rect x="3" y="4.5" width="18" height="15" rx="3"/><circle cx="8" cy="10" r="1.9" fill="currentColor" stroke="none"/><path d="M12.5 10h4.5M7 15h10"/>',
  morphology:'<rect x="2.5" y="7" width="12" height="10" rx="2.2"/><rect x="15.5" y="7" width="6" height="10" rx="2.2" fill="currentColor"/>',
  grammar:'<path d="M12 21v-6.5M12 14.5 6.5 8.5M12 14.5l5.5-6"/><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4" fill="currentColor"/>',
  syntax:'<rect x="1.8" y="7.5" width="5.6" height="9" rx="1.6"/><rect x="9.2" y="7.5" width="5.6" height="9" rx="1.6" fill="currentColor"/><rect x="16.6" y="7.5" width="5.6" height="9" rx="1.6"/>'
};
const ukrainianPluralRules=new Intl.PluralRules("uk");
function pluralForm(number,one,few,many){
  const form=ukrainianPluralRules.select(number);
  return form==="one"?one:form==="few"?few:many;
}
function counted(number,one,few,many){
  return `${number} ${pluralForm(number,one,few,many)}`;
}
const categoryLabels={
  "QUESTION WORD":"Питальне слово","PLACE & DIRECTION":"Місце й напрямок","TIME & REASON":"Час і причина",
  "PERSONAL PRONOUN":"Особовий займенник","PERSONALPRONOMEN":"Особові займенники","REFLEXIVPRONOMEN":"Зворотні займенники",
  "POSSESSIVE PRONOUN":"Присвійний займенник","POSSESSIVE ENDING":"Присвійне закінчення",
  "VERB SEIN":"Дієслово sein","WEAK VERB":"Слабке дієслово","EXTRA -E":"Додаткове -e",
  "SIBILANT STEM":"Основа на свистячий звук","STRONG VERB":"Сильне дієслово",
  "VERB FORMS":"Форми дієслова","PAST VERB FORMS":"Минулий час","RECALL":"Пригадування",
  "SATZRAHMEN":"Рамка речення","HABEN ODER SEIN":"Haben чи sein","TRENNBAR":"Відокремлювані",
  "GE-…-T":"Схема ge-…-t","-IEREN":"Дієслова на -ieren",
  "OHNE GE-":"Без ge-","UNREGELMÄSSIG":"Неправильні форми","TRENNBAR + STARK":"Відокремлювані сильні",
  "UNTRENNBAR":"Невідокремлювані","BESONDERE FORM":"Особлива форма",
  "CLOZE PRACTICE":"Пропуск у реченні","TRANSLATION PRACTICE":"Переклад",
  "MODALVERB":"Модальне дієслово","MODALVERBEN":"Модальні дієслова",
  "LÜCKENTEXT":"Пропуск у реченні","MÖGEN ODER MÖCHTEN":"Mögen чи möchten",
  "AUSSAGESATZ":"Розповідне речення","JA/NEIN-FRAGE":"Загальне запитання","W-FRAGE":"Спеціальне запитання",
  "SATZBILDUNG":"Побудова речення","VERB":"Дієслово","FREQUENCY ADVERB":"Прислівник частотності",
  "LOKALE PRÄPOSITIONEN":"Прийменники місця","SATZBAU":"Будова речення","PRÄPOSITION":"Прийменник",
  "ZEIT":"Час","TAG & DATUM":"День і дата","TAGESZEIT":"Частина доби","MONAT & JAHRESZEIT":"Місяць і пора року",
  "ZEITRAUM":"Проміжок часу","ZEITADVERB":"Прислівник часу","NACHT":"Ніч","ZEITAUSDRUCK":"Часовий вираз",
  "UHRZEIT":"Час на годиннику","GESPROCHEN":"Розмовна форма","ZEIT-ARBEITSBLATT":"Час і розпорядок дня",
  "WORTSCHATZ":"Лексика","ALLTAG":"Повсякденне життя","ABLAUF":"Послідовність","ESSEN & TRINKEN":"Їжа й напої",
  "TRAVEL":"Подорожі","PLACE":"Місце","TRANSPORT":"Транспорт","STATION":"Станція","LUGGAGE":"Багаж",
  "PHRASE":"Вираз","DIRECTION":"Напрямок","QUESTION":"Запитання","ACTION":"Дія","EVERYDAY":"Повсякденне життя",
  "DIRECTIONS":"Пояснення дороги","ORDER":"Послідовність","LANDMARK":"Орієнтир","LOCATION":"Розташування","ROUTE":"Маршрут",
  "VERBEN MIT DATIV":"Дієслова з Dativ","GRAMMAR":"Граматика","MASKULINUM":"Чоловічий рід",
  "FEMININUM":"Жіночий рід","NEUTRUM":"Середній рід","PLURAL":"Множина",
  "FREIZEIT":"Дозвілля","ORT":"Місце","AKTION":"Дія","BESCHREIBUNG":"Опис","KONJUNKTION":"Сполучник","MENGE":"Кількість",
  "FOTOBESCHREIBUNG":"Опис фото","PERSON":"Особа","PRONOMEN":"Займенник","WORTFOLGE":"Порядок слів",
  "JA/NEIN":"Загальне запитання","INVERSION":"Інверсія","FRAGEBILDUNG":"Побудова запитання",
  "TRENNBARES VERB":"Дієслово з відокремлюваним префіксом","TRENNBARE VERBEN":"Відокремлювані дієслова",
  "TEMPORALE PRÄPOSITION":"Прийменник часу","VOR + DATIV":"vor + Dativ","NACH + DATIV":"nach + Dativ","IN + DATIV":"in + Dativ",
  "FÜR + AKKUSATIV":"für + Akkusativ","UM + UHRZEIT":"um + час на годиннику","AM + TAG":"am + день або частина доби","VON … BIS":"von … bis",
  "HAUPTSATZ":"Головне речення","NEBENSATZ":"Підрядне речення","NICHT TRENNBAR":"Невідокремлюваний префікс",
  "WOLLEN":"Wollen","WERDEN":"Werden","KÖNNEN":"Können","VERÄNDERUNG":"Зміна стану","BERUF":"Професія","INFINITIV":"Інфінитив",
  "MIT + DATIV":"mit + Dativ","OHNE + AKKUSATIV":"ohne + Akkusativ","MIT ODER OHNE":"Mit чи ohne","BEGLEITUNG":"Супровід",
  "MITTEL":"Засіб","ART UND WEISE":"Спосіб дії","ZUTAT":"Інгредієнт","ARTIKEL":"Артикль","POSSESSIV":"Присвійний займенник","OHNE ARTIKEL":"Без артикля","BEDEUTUNG":"Значення",
  "UNBESTIMMTER ARTIKEL":"Неозначений артикль","NEGATIVARTIKEL":"Заперечний артикль",
  "FÜHRERSCHEIN":"Водійське посвідчення","REISEN":"Подорожі","POST":"Пошта","VERTRÄGE":"Договори",
  "GESPRÄCHE":"Розмови","GEFÜHLE":"Почуття","LEBEN":"Життя"
};
function categoryLabel(category){
  return category.split(" · ").map(part=>categoryLabels[part]||part).join(" · ");
}
const exerciseLabels={recall:"Пригадування","recall-reverse":"Зворотне пригадування",cloze:"Пропуск","sentence-build":"Побудова речення"};
const legacySequenceAliases={
  "w-questions":{"w-questions:learn":["w-basics-learn","w-place-learn","w-time-learn"]},
  pronouns:{"pronouns:learn":["pronouns-singular-learn","pronouns-plural-learn"]},
  sein:{"sein:learn":["sein-singular-learn","sein-plural-learn"]}
};

function emptyState(){
  return {version:STATE_VERSION,lessons:{},activeSession:null,activeSessionUpdatedAt:null,suspendedSessions:{},pendingCompletion:null,pendingCompletionUpdatedAt:null,pendingCompletions:{},resolvedCompletions:{},recentVariants:{},lastPasses:{},activityByDate:{},baseline:{lessons:{},activityByDate:{}},deviceContributions:{}};
}

function stableHash(value){
  let hash=2166136261;
  for(let index=0;index<value.length;index+=1)hash=Math.imul(hash^value.charCodeAt(index),16777619);
  return (hash>>>0).toString(36);
}

function uniqueStrings(value){
  return Array.isArray(value)?[...new Set(value.filter(item=>typeof item==="string"))]:[];
}

function normalizeLessonState(value={}){
  return {
    completedLearn:uniqueStrings(value.completedLearn),
    masteredPractice:uniqueStrings(value.masteredPractice),
    learnedTargets:Object.fromEntries(Object.entries(value.learnedTargets||{}).map(([id,targets])=>[id,uniqueStrings(targets)])),
    masteredTargets:Object.fromEntries(Object.entries(value.masteredTargets||{}).map(([id,targets])=>[id,uniqueStrings(targets)])),
    attempts:Number(value.attempts)||0,
    firstAttempts:Number(value.firstAttempts)||Number(value.attempts)||0,
    firstAttemptCorrect:Number(value.firstAttemptCorrect)||0,
    lastPracticedAt:typeof value.lastPracticedAt==="string"?value.lastPracticedAt:null,
    dueAt:typeof value.dueAt==="string"?value.dueAt:null
  };
}

function normalizeState(value){
  if(!value||typeof value!=="object")return emptyState();
  if(Number(value.version)>STATE_VERSION)throw new Error(`Learning state version ${value.version} is newer than this app supports.`);
  if(value.version===2)return migrateVersionTwoState(value);
  const state=emptyState();
  Object.entries(value.lessons||{}).forEach(([lessonId,lesson])=>{state.lessons[lessonId]=normalizeLessonState(lesson)});
  state.activeSession=value.activeSession&&typeof value.activeSession==="object"?value.activeSession:null;
  Object.entries(value.suspendedSessions||{}).forEach(([key,entry])=>{
    if(entry&&typeof entry==="object"&&typeof entry.updatedAt==="string"){
      state.suspendedSessions[key]={session:entry.session&&typeof entry.session==="object"?entry.session:null,updatedAt:entry.updatedAt};
    }
  });
  Object.entries(value.recentVariants||{}).forEach(([sequenceId,ids])=>{state.recentVariants[sequenceId]=uniqueStrings(ids).slice(-RECENT_VARIANT_LIMIT)});
  Object.entries(value.lastPasses||{}).forEach(([sequenceId,lastPass])=>{
    if(lastPass&&typeof lastPass==="object"&&typeof lastPass.updatedAt==="string"){
      state.lastPasses[sequenceId]={ids:uniqueStrings(lastPass.ids),updatedAt:lastPass.updatedAt};
    }
  });
  Object.entries(value.activityByDate||{}).forEach(([date,day])=>{
    if(day&&typeof day==="object")state.activityByDate[date]={attempts:Number(day.attempts)||0,mastered:Number(day.mastered)||0};
  });
  Object.entries(value.pendingCompletions||{}).forEach(([id,completion])=>{
    if(completion?.lessonId)state.pendingCompletions[id]={...completion,id};
  });
  Object.entries(value.resolvedCompletions||{}).forEach(([id,resolvedAt])=>{
    if(typeof resolvedAt==="string")state.resolvedCompletions[id]=resolvedAt;
  });
  const legacyPending=value.pendingCompletion;
  if(legacyPending?.lessonId){
    const id=legacyPending.id||`${legacyPending.lessonId}:${legacyPending.sequenceId}:${legacyPending.completedAt}`;
    state.pendingCompletions[id]={...legacyPending,id};
  }else if(legacyPending?.resolvedId&&typeof legacyPending.resolvedAt==="string"){
    state.resolvedCompletions[legacyPending.resolvedId]=legacyPending.resolvedAt;
  }
  state.activeSessionUpdatedAt=typeof value.activeSessionUpdatedAt==="string"?value.activeSessionUpdatedAt:value.activeSession?.updatedAt||null;
  reconcilePendingCompletions(state);
  if(value.baseline&&typeof value.baseline==="object"){
    Object.entries(value.baseline.lessons||{}).forEach(([lessonId,stats])=>{
      state.baseline.lessons[lessonId]=normalizeContribution(stats);
    });
    Object.entries(value.baseline.activityByDate||{}).forEach(([date,stats])=>{
      state.baseline.activityByDate[date]={attempts:Number(stats.attempts)||0,mastered:Number(stats.mastered)||0};
    });
  }else{
    Object.entries(state.lessons).forEach(([lessonId,lesson])=>{
      state.baseline.lessons[lessonId]={attempts:lesson.attempts,firstAttempts:lesson.firstAttempts,firstAttemptCorrect:lesson.firstAttemptCorrect};
    });
    Object.entries(state.activityByDate).forEach(([date,stats])=>{state.baseline.activityByDate[date]={...stats}});
  }
  Object.entries(value.deviceContributions||{}).forEach(([id,contribution])=>{
    if(!contribution||typeof contribution!=="object")return;
    state.deviceContributions[id]={lessons:{},activityByDate:{}};
    Object.entries(contribution.lessons||{}).forEach(([lessonId,stats])=>{
      state.deviceContributions[id].lessons[lessonId]=normalizeContribution(stats);
    });
    Object.entries(contribution.activityByDate||{}).forEach(([date,stats])=>{
      state.deviceContributions[id].activityByDate[date]={attempts:Number(stats.attempts)||0,mastered:Number(stats.mastered)||0};
    });
  });
  recalculateCounters(state);
  return state;
}

function normalizeContribution(value={}){
  return {
    attempts:Number(value.attempts)||0,
    firstAttempts:Number(value.firstAttempts)||0,
    firstAttemptCorrect:Number(value.firstAttemptCorrect)||0
  };
}

function populateBaseline(state){
  Object.entries(state.lessons).forEach(([lessonId,lesson])=>{
    state.baseline.lessons[lessonId]={attempts:lesson.attempts,firstAttempts:lesson.firstAttempts,firstAttemptCorrect:lesson.firstAttemptCorrect};
  });
  Object.entries(state.activityByDate).forEach(([date,stats])=>{state.baseline.activityByDate[date]={...stats}});
  return state;
}

function migrateVersionTwoState(value){
  const state=emptyState();
  Object.entries(value.lessons||{}).forEach(([lessonId,lesson])=>{
    state.lessons[lessonId]=normalizeLessonState({
      attempts:lesson.attempts,
      firstAttempts:lesson.attempts,
      firstAttemptCorrect:lesson.correct,
      lastPracticedAt:lesson.lastPracticed,
      completedLearn:value.completedStages?.[lessonId]||[]
    });
  });
  Object.entries(value.activity?.days||{}).forEach(([date,attempts])=>{
    state.activityByDate[date]={attempts:Number(attempts)||0,mastered:0};
  });
  return populateBaseline(state);
}

function migrateLegacyState(){
  const state=emptyState();
  const activity=JSON.parse(localStorage.getItem("german-wfragen-activity-v1")||"null");
  const lessonActivity=JSON.parse(localStorage.getItem("german-lesson-activity-v1")||"null");
  const progress=JSON.parse(localStorage.getItem("german-progressive-lesson-path-v1")||"null");
  Object.entries(lessonActivity?.lessons||{}).forEach(([lessonId,lesson])=>{
    state.lessons[lessonId]=normalizeLessonState({
      attempts:lesson.attempts,
      firstAttempts:lesson.attempts,
      firstAttemptCorrect:lesson.correct,
      lastPracticedAt:lesson.lastPracticed
    });
  });
  Object.entries(progress?.completedStages||{}).forEach(([lessonId,stages])=>{
    const lesson=state.lessons[lessonId]||normalizeLessonState();
    lesson.completedLearn=uniqueStrings(stages);
    state.lessons[lessonId]=lesson;
  });
  Object.entries(activity?.days||{}).forEach(([date,attempts])=>{
    state.activityByDate[date]={attempts:Number(attempts)||0,mastered:0};
  });
  return populateBaseline(state);
}

function loadState(){
  try{
    const raw=[stateStorageKey,...previousStateStorageKeys].map(key=>localStorage.getItem(key)).find(Boolean);
    const saved=JSON.parse(raw||"null");
    if(Number(saved?.version)>STATE_VERSION){
      compatibilityError=`Збережений на пристрої прогрес має версію ${saved.version}, яку цей застосунок не може безпечно змінити. Оновіть застосунок перед навчанням.`;
      return emptyState();
    }
    return Number(saved?.version)>=2?normalizeState(saved):migrateLegacyState();
  }catch(error){
    console.error("Could not restore local learning state.",error);
    return emptyState();
  }
}

let compatibilityError="";
let learningState=loadState();
let syncTimer=0;
let syncFailureCount=0;
let syncReady=false;
const deviceId=(()=>{
  const saved=localStorage.getItem(deviceStorageKey);
  if(saved)return saved;
  const id=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(deviceStorageKey,id);
  return id;
})();
const writerId=(()=>{
  const saved=sessionStorage.getItem(writerStorageKey);
  if(saved)return saved;
  const id=`${deviceId}:${globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(writerStorageKey,id);
  return id;
})();

function lessonState(lessonId){
  if(!learningState.lessons[lessonId])learningState.lessons[lessonId]=normalizeLessonState();
  return learningState.lessons[lessonId];
}

function saveState(sync=true){
  if(compatibilityError){
    showPersistenceError(compatibilityError);
    return;
  }
  learningState.version=STATE_VERSION;
  localStorage.setItem(stateStorageKey,JSON.stringify(learningState));
  if(sync)scheduleSync();
}

function scheduleSync(){
  if(!syncReady)return;
  window.clearTimeout(syncTimer);
  syncTimer=window.setTimeout(persistState,350);
}

async function persistState(){
  try{
    const response=await fetch(historyEndpoint,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(learningState)});
    if(!response.ok)throw new Error(`History save failed with ${response.status}.`);
    syncFailureCount=0;
    $("sync-status").hidden=true;
    $("sync-status").textContent="";
  }catch(error){
    syncFailureCount+=1;
    console.error("Could not save learning state to disk.",error);
    if(syncFailureCount>=2)showPersistenceError("Прогрес збережено на цьому пристрої. Синхронізація з диском тимчасово недоступна; застосунок повторить спробу автоматично.");
    if(!compatibilityError){
      window.clearTimeout(syncTimer);
      syncTimer=window.setTimeout(persistState,Math.min(1000*2**syncFailureCount,30000));
    }
  }
}

function showPersistenceError(message){
  $("sync-status").textContent=message;
  $("sync-status").hidden=false;
}

function mergeState(local,disk){
  const merged=normalizeState(local);
  Object.entries(disk.lessons||{}).forEach(([lessonId,diskLessonValue])=>{
    const localLesson=lessonStateFrom(merged,lessonId),diskLesson=normalizeLessonState(diskLessonValue);
    localLesson.completedLearn=[...new Set([...localLesson.completedLearn,...diskLesson.completedLearn])];
    localLesson.masteredPractice=[...new Set([...localLesson.masteredPractice,...diskLesson.masteredPractice])];
    for(const field of ["learnedTargets","masteredTargets"]){
      Object.entries(diskLesson[field]).forEach(([sequenceId,targets])=>{
        localLesson[field][sequenceId]=[...new Set([...(localLesson[field][sequenceId]||[]),...targets])];
      });
    }
    if(diskLesson.lastPracticedAt&&(!localLesson.lastPracticedAt||Date.parse(diskLesson.lastPracticedAt)>Date.parse(localLesson.lastPracticedAt))){
      localLesson.lastPracticedAt=diskLesson.lastPracticedAt;
      localLesson.dueAt=diskLesson.dueAt;
    }
  });
  Object.entries(disk.baseline?.lessons||{}).forEach(([lessonId,stats])=>{
    const current=merged.baseline.lessons[lessonId]||normalizeContribution();
    const incoming=normalizeContribution(stats);
    merged.baseline.lessons[lessonId]={
      attempts:Math.max(current.attempts,incoming.attempts),
      firstAttempts:Math.max(current.firstAttempts,incoming.firstAttempts),
      firstAttemptCorrect:Math.max(current.firstAttemptCorrect,incoming.firstAttemptCorrect)
    };
  });
  Object.entries(disk.baseline?.activityByDate||{}).forEach(([date,stats])=>{
    const current=merged.baseline.activityByDate[date]||{attempts:0,mastered:0};
    merged.baseline.activityByDate[date]={attempts:Math.max(current.attempts,Number(stats.attempts)||0),mastered:Math.max(current.mastered,Number(stats.mastered)||0)};
  });
  Object.entries(disk.deviceContributions||{}).forEach(([id,contribution])=>{
    if(!merged.deviceContributions[id])merged.deviceContributions[id]={lessons:{},activityByDate:{}};
    Object.entries(contribution.lessons||{}).forEach(([lessonId,stats])=>{
      const current=merged.deviceContributions[id].lessons[lessonId]||normalizeContribution(),incoming=normalizeContribution(stats);
      merged.deviceContributions[id].lessons[lessonId]={
        attempts:Math.max(current.attempts,incoming.attempts),
        firstAttempts:Math.max(current.firstAttempts,incoming.firstAttempts),
        firstAttemptCorrect:Math.max(current.firstAttemptCorrect,incoming.firstAttemptCorrect)
      };
    });
    Object.entries(contribution.activityByDate||{}).forEach(([date,stats])=>{
      const current=merged.deviceContributions[id].activityByDate[date]||{attempts:0,mastered:0};
      merged.deviceContributions[id].activityByDate[date]={attempts:Math.max(current.attempts,Number(stats.attempts)||0),mastered:Math.max(current.mastered,Number(stats.mastered)||0)};
    });
  });
  Object.entries(disk.recentVariants||{}).forEach(([sequenceId,ids])=>{
    merged.recentVariants[sequenceId]=[...new Set([...(ids||[]),...(merged.recentVariants[sequenceId]||[])])].slice(-RECENT_VARIANT_LIMIT);
  });
  Object.entries(disk.lastPasses||{}).forEach(([sequenceId,lastPass])=>{
    const current=merged.lastPasses[sequenceId];
    if(!current||Date.parse(lastPass.updatedAt)>Date.parse(current.updatedAt))merged.lastPasses[sequenceId]=lastPass;
  });
  const localUpdated=Date.parse(merged.activeSessionUpdatedAt||"")||0,diskUpdated=Date.parse(disk.activeSessionUpdatedAt||"")||0;
  if(diskUpdated>localUpdated){merged.activeSession=disk.activeSession;merged.activeSessionUpdatedAt=disk.activeSessionUpdatedAt}
  Object.entries(disk.suspendedSessions||{}).forEach(([key,entry])=>{
    const current=merged.suspendedSessions[key];
    if(!current||Date.parse(entry.updatedAt)>Date.parse(current.updatedAt))merged.suspendedSessions[key]=entry;
  });
  const activeKey=merged.activeSession&&sessionKey(merged.activeSession.lessonId,merged.activeSession.sequenceId);
  if(activeKey&&merged.suspendedSessions[activeKey]?.session){
    merged.suspendedSessions[activeKey]={session:null,updatedAt:merged.activeSessionUpdatedAt||new Date().toISOString()};
  }
  Object.entries(disk.pendingCompletions||{}).forEach(([id,completion])=>{
    const current=merged.pendingCompletions[id];
    if(!current||Date.parse(completion.completedAt||"")>Date.parse(current.completedAt||""))merged.pendingCompletions[id]=completion;
  });
  Object.entries(disk.resolvedCompletions||{}).forEach(([id,resolvedAt])=>{
    const current=merged.resolvedCompletions[id];
    if(!current||Date.parse(resolvedAt)>Date.parse(current))merged.resolvedCompletions[id]=resolvedAt;
  });
  reconcilePendingCompletions(merged);
  recalculateCounters(merged);
  return merged;
}

function reconcilePendingCompletions(state){
  Object.entries(state.pendingCompletions).forEach(([id,completion])=>{
    if(Date.parse(state.resolvedCompletions[id]||"")>=Date.parse(completion.completedAt||""))delete state.pendingCompletions[id];
  });
  const pending=Object.values(state.pendingCompletions).sort((a,b)=>Date.parse(b.completedAt||"")-Date.parse(a.completedAt||""))[0]||null;
  state.pendingCompletion=pending;
  const timestamps=[
    ...Object.values(state.pendingCompletions).map(completion=>completion.completedAt),
    ...Object.values(state.resolvedCompletions)
  ].filter(Boolean).sort();
  state.pendingCompletionUpdatedAt=timestamps.at(-1)||null;
}

function recordPendingCompletion(completion){
  learningState.pendingCompletions[completion.id]=completion;
  reconcilePendingCompletions(learningState);
}

function resolvePendingCompletion(id,resolvedAt){
  if(!id)return;
  learningState.resolvedCompletions[id]=resolvedAt;
  delete learningState.pendingCompletions[id];
  reconcilePendingCompletions(learningState);
}

function hasPendingCompletionForLesson(lessonId){
  return Object.values(learningState.pendingCompletions).some(completion=>completion.lessonId===lessonId);
}

function pendingCompletionForDisplay(){
  const completion=learningState.pendingCompletion;
  if(completion?.lessonId)return completion;
  reconcilePendingCompletions(learningState);
  return learningState.pendingCompletion;
}

function recalculateCounters(state){
  const lessonIds=new Set([...Object.keys(state.lessons),...Object.keys(state.baseline.lessons)]);
  Object.values(state.deviceContributions).forEach(contribution=>Object.keys(contribution.lessons).forEach(id=>lessonIds.add(id)));
  lessonIds.forEach(lessonId=>{
    const lesson=lessonStateFrom(state,lessonId),baseline=state.baseline.lessons[lessonId]||normalizeContribution();
    const totals={...baseline};
    Object.values(state.deviceContributions).forEach(contribution=>{
      const stats=contribution.lessons[lessonId];
      if(!stats)return;
      totals.attempts+=stats.attempts;
      totals.firstAttempts+=stats.firstAttempts;
      totals.firstAttemptCorrect+=stats.firstAttemptCorrect;
    });
    Object.assign(lesson,totals);
  });
  const dates=new Set(Object.keys(state.baseline.activityByDate));
  Object.values(state.deviceContributions).forEach(contribution=>Object.keys(contribution.activityByDate).forEach(date=>dates.add(date)));
  state.activityByDate={};
  dates.forEach(date=>{
    const totals={...(state.baseline.activityByDate[date]||{attempts:0,mastered:0})};
    Object.values(state.deviceContributions).forEach(contribution=>{
      const stats=contribution.activityByDate[date];
      if(stats){totals.attempts+=stats.attempts;totals.mastered+=stats.mastered}
    });
    state.activityByDate[date]=totals;
  });
}

function localContribution(){
  if(!learningState.deviceContributions[writerId])learningState.deviceContributions[writerId]={lessons:{},activityByDate:{}};
  return learningState.deviceContributions[writerId];
}

function lessonStateFrom(state,lessonId){
  if(!state.lessons[lessonId])state.lessons[lessonId]=normalizeLessonState();
  return state.lessons[lessonId];
}

async function restoreState(){
  try{
    const response=await fetch(historyEndpoint);
    if(!response.ok)throw new Error(`History request failed with ${response.status}.`);
    const payload=await response.json();
    if(Number(payload.version)>STATE_VERSION){
      compatibilityError=`Прогрес на диску має версію ${payload.version}, яку цей застосунок не може безпечно змінити. Оновіть застосунок перед навчанням.`;
      showPersistenceError(compatibilityError);
      return;
    }
    const diskState=normalizeState(payload);
    learningState=mergeState(learningState,diskState);
    backfillLegacyTargets();
    saveState(false);
    reconcileRuntimeState();
    renderAll();
  }catch(error){
    console.error("Could not restore learning state from disk.",error);
  }finally{
    syncReady=true;
    if(!compatibilityError)scheduleSync();
  }
}

function slugPart(value){
  return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item";
}

function explicitAnswers(card){
  const expected=card.answer||card.word;
  if(card.acceptedAnswers)return uniqueStrings(card.acceptedAnswers);
  return [expected];
}

function decorateDefinitions(){
  Object.entries(deckDefinitions).forEach(([lessonId,definition])=>{
    definition.id=lessonId;
    definition.catalog=lessonCatalog[lessonId]||{title:definition.title,outcome:definition.tip,className:"Практика"};
    definition.title=definition.catalog.title;
    definition.label=definition.catalog.title;
    definition.stages.forEach(stage=>{
      stage.cards=stage.cards.map(card=>{
        const canonicalTarget=card.answer||card.word;
        const legacyTargetKey=`${canonicalTarget}\u0000${card.translation||""}\u0000${card.prompt||card.example||""}`;
        const targetId=card.targetId||`${stage.id}:${slugPart(canonicalTarget)}:${stableHash(legacyTargetKey)}`;
        // Legacy data adapter only. New cards must declare type and response explicitly.
        const type=card.type||(card.practiceType==="sentence"?"sentence-build":card.answer?"cloze":"recall");
        const variantKey=`${card.prompt||""}\u0000${card.word}\u0000${card.example||""}`;
        return {
          ...card,
          id:card.id||`${targetId}:${type}:${stableHash(variantKey)}`,
          targetId,
          type,
          explanation:card.explanation||cardExplanations[targetId],
          promptText:card.promptText||(card.answer?(card.prompt||card.word):card.translation),
          response:card.response||{mode:"text",scope:type==="sentence-build"?"sentence":type==="cloze"?"word":card.word.includes(" ")?"phrase":"word",accepted:explicitAnswers(card),caseSensitive:Boolean(card.caseSensitive),punctuationSensitive:Boolean(card.punctuationSensitive)}
        };
      });
    });
  });
}

decorateDefinitions();

function standaloneOccurrence(sentence,expected){
  const escaped=expected.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const expression=new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?=$|[^\\p{L}\\p{N}])`,"giu");
  const matches=[...sentence.matchAll(expression)];
  if(!matches.length)return null;
  const match=matches[matches.length-1];
  const start=match.index+match[1].length;
  return {start,end:start+match[2].length};
}

function contextVariant(card){
  if(card.practiceVariants===false||card.type==="sentence-build"||card.type==="recall-reverse")return null;
  const sentence=card.answer?card.word:card.example;
  if(!sentence)return null;
  // Gap whichever accepted form the sentence uses, e.g. "ihre" in "Ihre Tasche ist hier."
  const match=card.response.accepted.map(form=>form.replace(/[?!.,]+$/,"")).filter(Boolean)
    .map(form=>({form,occurrence:standaloneOccurrence(sentence,form)})).find(item=>item.occurrence);
  if(!match)return null;
  const {form:expected,occurrence}=match;
  return {
    ...card,
    id:`${card.targetId}:context:${stableHash(`${sentence}\u0000${expected}`)}`,
    type:"cloze",
    promptText:`${sentence.slice(0,occurrence.start)}___${sentence.slice(occurrence.end)}`,
    // The meaning keeps the gap to one valid answer (e.g. "___ Auto" fits any possessive).
    support:card.support||(card.answer?"":card.exampleTranslation||""),
    response:{...card.response,scope:expected.includes(" ")?"phrase":"word",accepted:[expected]}
  };
}

function contextualRecallVariant(card){
  if(card.practiceVariants===false||card.type!=="recall"||!card.exampleTranslation)return null;
  // The example sentence fixes the form, so accept only the alternatives it actually uses.
  const used=card.example?card.response.accepted.filter(form=>standaloneOccurrence(card.example,form.replace(/[?!.,]+$/,""))):[];
  return {
    ...card,
    id:`${card.targetId}:context-recall:${stableHash(card.exampleTranslation)}`,
    promptText:card.translation,
    support:card.exampleTranslation,
    response:used.length?{...card.response,accepted:used}:card.response
  };
}

function variantsForStage(stage){
  if(stage.mode!=="input")return stage.cards;
  return stage.cards.flatMap(card=>[card,contextualRecallVariant(card),contextVariant(card)].filter(Boolean));
}

function fisherYates(items){
  const shuffled=[...items];
  for(let index=shuffled.length-1;index>0;index-=1){
    const swapIndex=Math.floor(Math.random()*(index+1));
    [shuffled[index],shuffled[swapIndex]]=[shuffled[swapIndex],shuffled[index]];
  }
  return shuffled;
}

function progressTargets(lessonId,stage){
  const lesson=lessonState(lessonId);
  const collection=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
  return new Set(collection[stage.id]||[]);
}

function chooseVariant(stage,targetVariants){
  const history=learningState.recentVariants[stage.id]||[];
  let eligible=targetVariants.filter(card=>!history.includes(card.id));
  if(!eligible.length){
    const targetIds=new Set(targetVariants.map(card=>card.id));
    learningState.recentVariants[stage.id]=history.filter(id=>!targetIds.has(id));
    eligible=targetVariants;
  }
  return eligible[Math.floor(Math.random()*eligible.length)];
}

function samplePass(lessonId,stage){
  const groups=new Map();
  variantsForStage(stage).forEach(card=>{
    if(!groups.has(card.targetId))groups.set(card.targetId,[]);
    groups.get(card.targetId).push(card);
  });
  const completed=progressTargets(lessonId,stage);
  const uncompleted=fisherYates([...groups.keys()].filter(targetId=>!completed.has(targetId)));
  const completedTargets=fisherYates([...groups.keys()].filter(targetId=>completed.has(targetId)));
  const selected=[...uncompleted,...completedTargets].slice(0,Math.min(PASS_SIZE,groups.size));
  const cards=selected.map(targetId=>chooseVariant(stage,groups.get(targetId)));
  const previousFirst=learningState.lastPasses[stage.id]?.ids[0];
  let shuffled=fisherYates(cards);
  if(shuffled.length>1&&shuffled[0].id===previousFirst)[shuffled[0],shuffled[1]]=[shuffled[1],shuffled[0]];
  const recent=learningState.recentVariants[stage.id]||[];
  learningState.recentVariants[stage.id]=[...recent,...shuffled.map(card=>card.id)].slice(-RECENT_VARIANT_LIMIT);
  learningState.lastPasses[stage.id]={ids:shuffled.map(card=>card.id),updatedAt:new Date().toISOString()};
  return shuffled;
}

let activeDeckId="w-questions";
let activeStageIndex=0;
let deck=[];
let index=0;
let completed=0;
let verificationMode=false;
let verified=false;
let answerRevealed=false;
let practiceInputStarted=false;
let celebrating=false;
let completionPrimaryAction=()=>{};
let completionSecondaryAction=()=>{};

function activeDefinition(){return deckDefinitions[activeDeckId]}
function activeStage(){return activeDefinition().stages[activeStageIndex]}
function stageTargetIds(stage){return stage.cards.map(card=>card.targetId)}
function stageProgress(stage){return progressTargets(activeDeckId,stage)}
function stageIsComplete(lessonId,stage){
  const lesson=lessonState(lessonId);
  const completed=stage.mode==="input"?lesson.masteredPractice:lesson.completedLearn;
  const legacy=legacySequenceAliases[lessonId]?.[stage.progressId];
  return completed.includes(stage.id)||completed.includes(stage.progressId)||Boolean(legacy?.every(id=>completed.includes(id)));
}

function stageCoverage(stage){
  const targetIds=new Set(stageTargetIds(stage));
  const covered=[...progressTargets(activeDeckId,stage)].filter(targetId=>targetIds.has(targetId)).length,total=targetIds.size;
  return {covered,total};
}

// A practice target is counted in the first practice stage that contains it; later stages that repeat it (such as a mixed review) do not affect coverage.
function lessonCoverage(lessonId){
  const lesson=lessonState(lessonId),firstStageByTarget=new Map();
  deckDefinitions[lessonId].stages.filter(stage=>stage.mode==="input").forEach(stage=>{
    new Set(stageTargetIds(stage)).forEach(targetId=>{
      if(!firstStageByTarget.has(targetId))firstStageByTarget.set(targetId,stage);
    });
  });
  let covered=0,newTargets=0;
  firstStageByTarget.forEach((stage,targetId)=>{
    if((lesson.masteredTargets[stage.id]||[]).includes(targetId))covered+=1;
    // Targets added to a stage the learner already finished stay visible as new work.
    else if(stageIsComplete(lessonId,stage))newTargets+=1;
  });
  return {covered,total:firstStageByTarget.size,newTargets};
}

function sumCoverage(coverages){
  return coverages.reduce((sum,item)=>({covered:sum.covered+item.covered,total:sum.total+item.total,newTargets:sum.newTargets+item.newTargets}),{covered:0,total:0,newTargets:0});
}

function courseCoverage(){
  return sumCoverage(Object.keys(deckDefinitions).map(lessonId=>lessonCoverage(lessonId)));
}

function coveragePercent(coverage){
  if(!coverage.total)return 0;
  return coverage.covered===coverage.total?100:Math.floor(coverage.covered/coverage.total*100);
}

function coverageText(coverage){
  return `${coverage.covered} з ${counted(coverage.total,"ціль","цілі","цілей")}`;
}

function coverageMasteryNote(lessonId){
  const coverage=lessonCoverage(lessonId),practiceStages=deckDefinitions[lessonId].stages.filter(stage=>stage.mode==="input");
  if(coverage.covered<coverage.total||practiceStages.every(stage=>stageIsComplete(lessonId,stage)))return "";
  return " · урок буде засвоєно після всіх етапів практики";
}

function recommendedStageIndex(lessonId){
  const definition=deckDefinitions[lessonId];
  const active=learningState.activeSession;
  if(active?.lessonId===lessonId){
    const resumed=definition.stages.findIndex(stage=>stage.id===active.sequenceId);
    if(resumed>=0)return resumed;
  }
  const suspended=definition.stages.map((stage,stageIndex)=>({stageIndex,entry:suspendedEntry(lessonId,stage.id)}))
    .filter(item=>item.entry).sort((a,b)=>Date.parse(b.entry.updatedAt)-Date.parse(a.entry.updatedAt))[0];
  if(suspended)return suspended.stageIndex;
  const incomplete=definition.stages.findIndex(stage=>!stageIsComplete(lessonId,stage));
  if(incomplete>=0)return incomplete;
  const due=Date.parse(lessonState(lessonId).dueAt||"")<=Date.now();
  if(due){
    const practice=definition.stages.findIndex(stage=>stage.mode==="input");
    if(practice>=0)return practice;
  }
  return 0;
}

function allCardsById(stage){
  return new Map(variantsForStage(stage).map(card=>[card.id,card]));
}

function canResume(lessonId,stage){
  const session=learningState.activeSession;
  if(session?.lessonId!==lessonId||session.sequenceId!==stage.id||session.mode!==(stage.mode==="input"?"practice":"learn"))return false;
  const cards=allCardsById(stage);
  return Array.isArray(session.order)&&session.order.length>0&&session.order.every(id=>cards.has(id));
}

function restoreSession(){
  const session=learningState.activeSession,cards=allCardsById(activeStage());
  deck=session.order.map((id,position)=>({...cards.get(id),retry:session.retryPositions?.includes(position)}));
  index=Math.min(Number(session.index)||0,deck.length-1);
  completed=Math.min(index,deck.length);
  verificationMode=session.mode==="practice";
  const currentStatus=session.cardStatus?.[String(index)];
  verified=currentStatus==="correct";
  answerRevealed=currentStatus==="wrong";
  practiceInputStarted=false;
}

function createSession(){
  const stage=activeStage();
  discardSuspendedSession(activeDeckId,stage.id);
  deck=samplePass(activeDeckId,stage);
  index=0;
  completed=0;
  verificationMode=stage.mode==="input";
  verified=false;
  answerRevealed=false;
  practiceInputStarted=false;
  learningState.activeSession={
    lessonId:activeDeckId,
    sequenceId:stage.id,
    mode:verificationMode?"practice":"learn",
    order:deck.map(card=>card.id),
    index:0,
    retryQueue:[],
    retryPositions:[],
    answered:{},
    cardStatus:{},
    cardInputs:{},
    passTargetIds:[...new Set(deck.map(card=>card.targetId))],
    passMastered:[],
    firstAttemptCorrect:0,
    firstAttemptTotal:0,
    startedAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
  learningState.activeSessionUpdatedAt=learningState.activeSession.updatedAt;
  saveState();
}

function startStageAttempt(forceNew=false){
  const stage=activeStage();
  if(!forceNew&&!canResume(activeDeckId,stage)){
    const suspended=takeSuspendedSession(activeDeckId,stage.id);
    if(suspended){
      const now=new Date().toISOString();
      learningState.activeSession={...suspended,updatedAt:now};
      learningState.activeSessionUpdatedAt=now;
    }
  }
  if(!forceNew&&canResume(activeDeckId,stage)){
    restoreSession();
    saveState();
  }else createSession();
}

function sessionKey(lessonId,sequenceId){return `${lessonId}::${sequenceId}`}

function suspendedEntry(lessonId,sequenceId){
  const entry=learningState.suspendedSessions[sessionKey(lessonId,sequenceId)];
  return entry?.session?entry:null;
}

function sessionHasProgress(session){
  return (Number(session.index)||0)>0||Object.keys(session.cardStatus||{}).length>0||Object.keys(session.cardInputs||{}).length>0||(session.retryQueue||[]).length>0;
}

function discardSuspendedSession(lessonId,sequenceId){
  if(!suspendedEntry(lessonId,sequenceId))return;
  learningState.suspendedSessions[sessionKey(lessonId,sequenceId)]={session:null,updatedAt:new Date().toISOString()};
}

function takeSuspendedSession(lessonId,sequenceId){
  const session=suspendedEntry(lessonId,sequenceId)?.session;
  if(session)discardSuspendedSession(lessonId,sequenceId);
  return session||null;
}

// Park the current attempt so switching stages or lessons never discards answers.
function suspendActiveSession(nextLessonId,nextStage){
  const session=learningState.activeSession;
  if(!session||session.lessonId===nextLessonId&&session.sequenceId===nextStage.id)return;
  if(session.lessonId===activeDeckId&&session.sequenceId===activeDefinition()?.stages[activeStageIndex]?.id&&deck.length)persistPosition();
  const now=new Date().toISOString();
  if(sessionHasProgress(session))learningState.suspendedSessions[sessionKey(session.lessonId,session.sequenceId)]={session:{...session,updatedAt:now},updatedAt:now};
  learningState.activeSession=null;
  learningState.activeSessionUpdatedAt=now;
}

function lessonHasOpenAttempt(lessonId){
  return learningState.activeSession?.lessonId===lessonId||deckDefinitions[lessonId].stages.some(stage=>suspendedEntry(lessonId,stage.id));
}

function persistPosition(){
  const session=learningState.activeSession;
  if(!session)return;
  session.order=deck.map(card=>card.id);
  session.index=index;
  session.updatedAt=new Date().toISOString();
  learningState.activeSessionUpdatedAt=session.updatedAt;
  saveState();
}

function selectStage(stageIndex,forceNew=false,focusTarget="flashcard"){
  const stage=activeDefinition().stages[stageIndex];
  suspendActiveSession(activeDeckId,stage);
  activeStageIndex=stageIndex;
  startStageAttempt(forceNew);
  render(focusTarget);
}

function selectDeck(lessonId,stageId="",forceNew=false){
  const stages=deckDefinitions[lessonId].stages;
  const requested=stageId?stages.findIndex(stage=>stage.id===stageId):-1;
  const stageIndex=requested>=0?requested:recommendedStageIndex(lessonId);
  suspendActiveSession(lessonId,stages[stageIndex]);
  activeDeckId=lessonId;
  activeStageIndex=stageIndex;
  startStageAttempt(forceNew);
  $("deck-guide-disclosure").open=false;
  render("flashcard");
  return true;
}

function resumeInitialSession(){
  const session=learningState.activeSession;
  if(!session||!deckDefinitions[session.lessonId])return;
  const stageIndex=deckDefinitions[session.lessonId].stages.findIndex(stage=>stage.id===session.sequenceId);
  if(stageIndex<0)return;
  activeDeckId=session.lessonId;
  activeStageIndex=stageIndex;
  startStageAttempt();
}

function reconcileRuntimeState(){
  if(learningState.activeSession)resumeInitialSession();
  else{
    deck=[];
    index=0;
    completed=0;
    verificationMode=false;
    verified=false;
    answerRevealed=false;
  }
  if(learningState.pendingCompletion)restorePendingCompletion();
  else{
    $("celebration").hidden=true;
    $("confetti").replaceChildren();
    celebrating=false;
    if(!$("practice-view").classList.contains("hidden"))selectDeck(activeDeckId);
  }
}

function dateKey(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function recordAttempt(wasCorrect,isFirstAttempt,newlyMastered){
  const lesson=lessonState(activeDeckId),now=new Date(),today=dateKey(now);
  const contribution=localContribution();
  const lessonContribution=contribution.lessons[activeDeckId]||normalizeContribution();
  lessonContribution.attempts+=1;
  if(isFirstAttempt){
    lessonContribution.firstAttempts+=1;
    if(wasCorrect)lessonContribution.firstAttemptCorrect+=1;
  }
  contribution.lessons[activeDeckId]=lessonContribution;
  const dayContribution=contribution.activityByDate[today]||{attempts:0,mastered:0};
  dayContribution.attempts+=1;
  if(newlyMastered)dayContribution.mastered+=1;
  contribution.activityByDate[today]=dayContribution;
  recalculateCounters(learningState);
  lesson.lastPracticedAt=now.toISOString();
}

function markTarget(stage,targetId){
  const lesson=lessonState(activeDeckId);
  const collection=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
  collection[stage.id]=[...new Set([...(collection[stage.id]||[]),targetId])];
}

// Records every target of a stage that is already complete but has no target record (older saves).
// Runs only when no record exists, so targets added later stay uncovered.
function backfillLegacyTargets(){
  let changed=false;
  Object.entries(learningState.lessons).forEach(([lessonId,lesson])=>{
    if(!deckDefinitions[lessonId])return;
    deckDefinitions[lessonId].stages.forEach(stage=>{
      if(!stageIsComplete(lessonId,stage))return;
      const collection=stage.mode==="input"?lesson.masteredTargets:lesson.learnedTargets;
      if(collection[stage.id])return;
      collection[stage.id]=[...new Set(stageTargetIds(stage))];
      changed=true;
    });
  });
  if(changed)saveState(false);
}

function normalizeAnswer(value,response={}){
  let normalized=value.normalize("NFKC").trim()
    .replace(/[⁄∕／]/g,"/")
    .replace(/[\u2018\u2019\u02BC\uFF07]/g,"'")
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g,"-")
    .replace(/\s+/g," ")
    .replace(/\s*\/\s*/g," / ");
  if(!response.punctuationSensitive)normalized=normalized.replace(/[?!.,]+$/g,"");
  if(!response.caseSensitive)normalized=normalized.toLocaleLowerCase();
  return normalized;
}

function answerMatches(value,card){
  const actual=normalizeAnswer(value,card.response);
  return card.response.accepted.some(answer=>normalizeAnswer(answer,card.response)===actual);
}

function tokenizeAnswer(value,response){
  return value.trim().split(/\s+/).filter(Boolean).map(text=>({text,key:normalizeAnswer(text,response)}));
}

function renderCorrection(value,expected,response){
  const actual=tokenizeAnswer(value,response),target=tokenizeAnswer(expected,response),distance=Array.from({length:actual.length+1},()=>Array(target.length+1).fill(0));
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

function inputCopy(card){
  if(card.type==="recall-reverse")return ["Напишіть відповідь українською","Відповідь українською..."];
  if(card.response.scope==="sentence")return ["Напишіть повне речення німецькою","Повне речення німецькою..."];
  if(card.response.scope==="phrase")return ["Напишіть вираз німецькою","Вираз німецькою..."];
  return ["Напишіть відповідь німецькою","Відповідь німецькою..."];
}

function practicePromptParts(prompt){
  const match=prompt.match(/^(.*(?:\bvon|:))\s+(.+?)([.?!])?$/u);
  return match?{instruction:match[1],target:match[2]}:null;
}

function renderPracticePrompt(card){
  const prompt=$("question-word"),parts=card.type==="recall-reverse"?null:practicePromptParts(card.promptText);
  // The instruction line has its own small size, so only the target words decide the fit.
  const target=slashRuns(parts?parts.target:card.promptText,card.type==="sentence-build");
  setFitChars(prompt,target.chars);
  if(!parts){
    if(target.nodes)prompt.replaceChildren(...target.nodes);
    else prompt.textContent=card.promptText;
    return;
  }
  const instruction=document.createElement("span"),targetElement=document.createElement("span");
  instruction.className="practice-prompt-instruction";
  instruction.textContent=parts.instruction;
  targetElement.className="practice-prompt-target";
  if(target.nodes)targetElement.replaceChildren(...target.nodes);
  else targetElement.textContent=parts.target;
  prompt.replaceChildren(instruction,targetElement);
}

function feedbackExample(card){
  if(card.type==="recall-reverse")return card.example?{label:"Приклад у контексті",text:card.example,translation:card.exampleTranslation||""}:{label:"Німецьке слово",text:card.word,translation:""};
  if(card.type==="recall")return {label:"Приклад у контексті",text:card.example||card.word,translation:card.exampleTranslation||card.translation};
  if(/[.?!]$/.test(card.word.trim()))return {label:"Правильне речення",text:card.word,translation:card.translation};
  if(card.example&&!card.example.includes("___"))return {label:"Приклад у контексті",text:card.example,translation:card.exampleTranslation||card.translation};
  return {label:"Правильна відповідь",text:card.response.accepted[0],translation:card.translation};
}

function translationKey(text){
  return text.normalize("NFKC").trim().replace(/\s+/g," ");
}

function feedbackExplanation(card){
  if(card.explanation)return card.explanation;
  if(card.type==="cloze")return "Визначте потрібну німецьку форму за контекстом речення.";
  if(card.type==="sentence-build")return "Побудуйте речення з правильним німецьким порядком слів.";
  if(card.type==="recall-reverse")return `Німецьке слово «${card.word}» означає «${card.translation}».`;
  return `Пов’яжіть значення «${card.translation}» з відповіддю «${card.response.accepted[0]}».`;
}

function feedbackOutcome(card,wasCorrect){
  const answer=card.response.accepted[0];
  if(wasCorrect)return {tone:"correct",title:`Правильно — ${answer}`,detail:""};
  return {tone:"incorrect",title:`Не зовсім — ${answer}`,detail:feedbackExplanation(card)};
}

const genderLabels={masculine:"чоловічий рід",neuter:"середній рід",feminine:"жіночий рід",plural:"множина"};

// Visuals that contain the answer stay hidden in practice until Check.
function answerVisualsShown(){
  return !verificationMode||verified||answerRevealed;
}

function sceneArt(scene){
  const arrow=(path,head)=>scene.motion?`<path d="${path}" class="scene-arrow"/><path d="${head}" class="scene-arrow-head"/>`:"";
  const scenes={
    drawer:`<ellipse cx="120" cy="111" rx="75" ry="7" class="scene-shadow"/><rect x="55" y="24" width="130" height="78" rx="12" class="scene-cabinet"/><rect x="68" y="61" width="104" height="33" rx="7" class="scene-drawer"/><path d="M108 72h24" class="scene-line"/><g transform="rotate(-7 120 71)"><rect x="91" y="57" width="51" height="25" rx="4" class="scene-book"/><path d="M99 57v25" class="scene-detail"/></g>${arrow("M34 41c22-8 39-1 56 18","M80 52l12 8-14 3")}`,
    wall:`<path d="M37 102V25c0-6 5-11 11-11h144c6 0 11 5 11 11v77" class="scene-room"/><path d="M31 103h178" class="scene-floor"/><rect x="89" y="30" width="62" height="49" rx="6" class="scene-frame"/><rect x="97" y="38" width="46" height="33" rx="3" class="scene-picture"/><circle cx="108" cy="48" r="5" class="scene-sun"/><path d="M99 68l13-13 9 8 8-12 12 17" class="scene-mountain"/><path d="M178 103V75m-11 28V83m22 20V88" class="scene-plant"/>${arrow("M47 72c12-22 28-31 43-28","M80 38l13 5-9 10")}`,
    newspaper:`<ellipse cx="121" cy="109" rx="78" ry="7" class="scene-shadow"/><path d="M43 72h154l-10 18H53z" class="scene-table"/><path d="M64 89l-7 25m118-25 8 25" class="scene-line"/><g transform="rotate(-5 119 65)"><rect x="85" y="49" width="68" height="31" rx="3" class="scene-paper"/><path d="M94 58h23m-23 7h48m-48 7h37" class="scene-detail"/><rect x="124" y="56" width="19" height="8" rx="2" class="scene-photo"/></g>`,
    table:`<ellipse cx="121" cy="109" rx="78" ry="7" class="scene-shadow"/><path d="M43 72h154l-10 18H53z" class="scene-table"/><path d="M64 89l-7 25m118-25 8 25" class="scene-line"/><path d="M105 44h31l8 28H97z" class="scene-vase"/><path d="M112 44c-5-12-2-21 4-27m11 27c7-10 8-20 4-28m-15 14c-8-7-15-8-20-6m35 6c8-7 15-8 20-6" class="scene-stem"/><circle cx="94" cy="23" r="6" class="scene-flower"/><circle cx="154" cy="23" r="6" class="scene-flower"/><circle cx="116" cy="15" r="6" class="scene-flower"/><circle cx="132" cy="14" r="6" class="scene-flower"/>${arrow("M39 38c21-13 43-9 61 7","M89 38l13 8-14 5")}`,
    bed:`<path d="M34 108h174" class="scene-floor"/><path d="M48 76h145v28H48z" class="scene-bed"/><path d="M55 57h127c6 0 11 5 11 11v8H48V64c0-4 3-7 7-7z" class="scene-sheet"/><rect x="58" y="61" width="43" height="12" rx="6" class="scene-pillow"/><path d="M58 76v32m122-32v32" class="scene-line"/><path d="M120 13v25" class="scene-cord"/><path d="M103 39h34l-7 17h-20z" class="scene-lamp"/><path d="M108 58l-10 13m24-13v13m10-13 10 13" class="scene-glow"/>${arrow("M62 27c17-9 29-7 42 6","M94 27l12 7-13 5")}`,
    chair:`<ellipse cx="122" cy="111" rx="73" ry="7" class="scene-shadow"/><rect x="92" y="28" width="57" height="49" rx="8" class="scene-chair"/><path d="M99 77l-8 34m50-34 9 34" class="scene-line"/><path d="M75 96c7-15 32-19 47-6l-3 14H79z" class="scene-dog"/><circle cx="86" cy="87" r="10" class="scene-dog"/><path d="M77 80l-8-8m23 8 5-9m18 19c9-8 18-6 21 1" class="scene-line"/><circle cx="83" cy="85" r="1.8" class="scene-eye"/>${arrow("M40 87c15-14 27-15 39-8","M68 73l13 6-11 8")}`,
    "house-front":`<ellipse cx="122" cy="112" rx="96" ry="8" class="scene-shadow"/><path d="M64 55l57-40 57 40v53H64z" class="scene-house"/><path d="M54 57l67-48 67 48" class="scene-roof"/><rect x="108" y="75" width="27" height="33" rx="3" class="scene-door"/><rect x="76" y="67" width="21" height="20" rx="3" class="scene-window"/><rect x="146" y="67" width="21" height="20" rx="3" class="scene-window"/><path d="M32 92h59v9H32zM38 101v12m47-12v12" class="scene-bench"/><path d="M30 84h63" class="scene-bench"/>${arrow("M20 67c10 4 18 10 23 20","M36 78l8 11-13-1")}`,
    "house-behind":`<path d="M22 99c39-18 75-18 109-4 31 13 59 12 88-3" class="scene-road"/><g class="scene-car-behind"><path d="M151 67h55l13 18v15h-76V82z" class="scene-car"/><path d="M164 67l10-14h23l9 14" class="scene-car-window"/><circle cx="160" cy="100" r="8" class="scene-wheel"/><circle cx="204" cy="100" r="8" class="scene-wheel"/></g><path d="M51 58l62-43 62 43v53H51z" class="scene-house"/><path d="M41 60l72-51 72 51" class="scene-roof"/><rect x="99" y="77" width="28" height="34" rx="3" class="scene-door"/><rect x="63" y="68" width="22" height="20" rx="3" class="scene-window"/><path d="M35 111h159" class="scene-floor"/>${arrow("M204 30c-17-9-34-5-45 12","M166 34l-9 10 13 2")}`,
    people:`<ellipse cx="122" cy="112" rx="79" ry="7" class="scene-shadow"/><path d="M57 94h129v9H57zM67 103v10m108-10v10" class="scene-bench"/><circle cx="96" cy="43" r="14" class="scene-person-one"/><path d="M75 91c2-25 10-39 21-39s19 14 21 39" class="scene-person-one"/><circle cx="146" cy="43" r="14" class="scene-person-two"/><path d="M125 91c2-25 10-39 21-39s19 14 21 39" class="scene-person-two"/><path d="M79 60l-11 20m95-20 12 20" class="scene-line"/>${arrow("M34 50c16-11 30-10 43 1","M68 44l11 7-12 6")}`,
    windows:`<path d="M32 108V24c0-6 5-11 11-11h154c6 0 11 5 11 11v84" class="scene-room"/><rect x="47" y="31" width="48" height="56" rx="6" class="scene-window"/><rect x="145" y="31" width="48" height="56" rx="6" class="scene-window"/><path d="M71 31v56M47 59h48m74-28v56m-24-28h48" class="scene-window-line"/><rect x="106" y="43" width="29" height="39" rx="5" class="scene-frame"/><path d="M112 75l7-11 6 6 5-9" class="scene-mountain"/>${arrow("M117 106c0-10 1-17 3-24","M115 91l5-11 6 11")}`,
    bag:`<ellipse cx="121" cy="111" rx="62" ry="7" class="scene-shadow"/><path d="M71 56h99l-9 52H80z" class="scene-bag"/><path d="M99 56c0-28 43-28 43 0" class="scene-handle"/><g transform="rotate(-18 122 77)"><circle cx="116" cy="76" r="9" class="scene-key-ring"/><path d="M124 76h27m-9 0v7m7-7v5" class="scene-key"/></g>${arrow("M47 46c17-8 35-4 49 10","M86 49l12 8-13 4")}`,
    sofa:`<ellipse cx="121" cy="111" rx="83" ry="7" class="scene-shadow"/><path d="M47 63h148v44H47z" class="scene-sofa"/><path d="M60 50h122c10 0 18 8 18 18H42c0-10 8-18 18-18z" class="scene-cushion"/><path d="M65 67v40m110-40v40" class="scene-line"/><circle cx="120" cy="31" r="13" class="scene-person-one"/><path d="M99 68c2-22 10-34 21-34s19 12 21 34" class="scene-person-one"/><path d="M102 58L88 78m50-20 14 20" class="scene-line"/>${arrow("M33 35c19-10 39-7 61 5","M83 33l13 8-14 5")}`
  };
  return scenes[scene.kind]||"";
}

function sceneMarkup(art){
  return `<rect width="240" height="128" rx="18" class="scene-background"/>${art}`;
}

function renderCardScene(card){
  // A cueAfterCheck card keeps its motion arrow hidden until Check, so the scene shows only the place.
  const scene=card.scene&&{...card.scene,motion:card.scene.motion&&(!card.cueAfterCheck||answerVisualsShown())};
  const art=scene?sceneArt(scene):"";
  $("card-illustration").hidden=!art;
  $("flashcard").classList.toggle("illustrated-card",Boolean(art));
  if(art)$("card-illustration-art").innerHTML=`<title>Ілюстрація просторового розташування</title>${sceneMarkup(art)}`;
}

// Splits a form into stem, changed vowel and ending pieces, skipping empty pieces.
function formSegments(parts){
  const {stem,ending="",vowel}=parts;
  const pieces=vowel?[[stem.slice(0,vowel.start),"stem"],[stem.slice(vowel.start,vowel.end),"vowel"],[stem.slice(vowel.end),"stem"]]:[[stem,"stem"]];
  return [...pieces,[ending,"ending"]].filter(([text])=>text).map(([text,part])=>({text,part}));
}

function formNodes(parts,gender=""){
  if(!parts.ending&&!parts.vowel)return [textSpan(parts.stem)];
  const classes={stem:"form-stem",vowel:"form-vowel",ending:`form-ending${gender?` gender-${gender}`:""}`};
  return formSegments(parts).map(segment=>textSpan(segment.text,classes[segment.part]));
}

function nounEntries(noun){
  const entries=[{article:noun.article,word:noun.word,gender:noun.gender}];
  if(noun.plural)entries.push({article:noun.plural.article||"die",word:noun.plural.word,gender:"plural"});
  return entries;
}

function nounPhrase(entry){
  return `${entry.article} ${entry.word}`;
}

// Before Check the noun line appears only when the prompt already gives the noun or no answer contains it.
function nounLineShown(card){
  const noun=card.noun;
  if(!noun)return false;
  if(answerVisualsShown()||noun.givenInPractice)return true;
  const words=[...nounEntries(noun).map(entry=>entry.word),noun.exampleWord,noun.plural?.exampleWord].filter(Boolean);
  return !card.response.accepted.some(answer=>words.some(word=>standaloneOccurrence(answer,word)));
}

// A learn card whose headword is exactly the noun (e.g. "der Baum / die Bäume") carries the dots itself.
// A reverse card's heading is the German word itself, so it counts as a headword even in verification mode.
function headwordNoun(card){
  const headingIsWord=card.type==="recall-reverse"||!verificationMode;
  return headingIsWord&&Boolean(card.noun)&&card.word===nounEntries(card.noun).map(nounPhrase).join(" / ");
}

function genderDot(gender){
  const dot=document.createElement("span");
  dot.className=`gender-dot gender-${gender}`;
  dot.setAttribute("aria-hidden","true");
  return dot;
}

// Each noun entry (singular, then plural) as its nodes, joined by a "/" that screen readers skip.
function nounEntryNodes(noun,entryNodes){
  return nounEntries(noun).flatMap((entry,entryIndex)=>{
    const nodes=entryNodes(entry);
    if(!entryIndex)return nodes;
    const separator=textSpan("/","noun-gender-separator");
    separator.setAttribute("aria-hidden","true");
    return [separator,...nodes];
  });
}

function renderNounGender(card){
  const line=$("noun-gender"),shown=nounLineShown(card);
  line.hidden=!shown;
  if(!shown){line.replaceChildren();return}
  const labelsOnly=headwordNoun(card);
  line.classList.toggle("labels-only",labelsOnly);
  line.replaceChildren(...nounEntryNodes(card.noun,entry=>{
    const label=textSpan(genderLabels[entry.gender],`noun-gender-label gender-${entry.gender}`);
    return labelsOnly?[label]:[genderDot(entry.gender),Object.assign(textSpan(nounPhrase(entry),"noun-gender-word"),{lang:"de"}),label];
  }));
}

function grammarTable(table,variant){
  const element=document.createElement("table"),head=document.createElement("tr");
  const highlighted=(row,column)=>(table.highlights||[]).some(cell=>cell.row===row&&cell.column===column);
  element.className=`grammar-table ${variant}`;
  head.append(document.createElement("td"),...table.columns.map(column=>{
    const cell=document.createElement("th");
    cell.setAttribute("scope","col");
    cell.className=column.gender?`gender-${column.gender}`:"";
    if(column.title){
      const abbreviation=document.createElement("abbr");
      abbreviation.title=column.title;
      abbreviation.textContent=column.label;
      cell.append(abbreviation);
    }else cell.textContent=column.label;
    return cell;
  }));
  element.append(head,...table.rows.map((row,rowIndex)=>{
    const line=document.createElement("tr"),label=document.createElement("th");
    label.setAttribute("scope","row");
    // A row may carry its own gender, e.g. er / sie / es in a pronoun table.
    if(row.gender)label.append(genderDot(row.gender));
    if(row.title){
      const abbreviation=document.createElement("abbr");
      abbreviation.title=row.title;
      abbreviation.textContent=row.label;
      label.append(abbreviation);
    }else label.append(textSpan(row.label));
    line.append(label,...row.cells.map((value,columnIndex)=>{
      const cell=document.createElement("td"),gender=row.gender||table.columns[columnIndex].gender,changed=highlighted(rowIndex,columnIndex);
      cell.className=[gender?`gender-${gender}`:"",changed?"changed":"",value==="—"?"empty":""].filter(Boolean).join(" ");
      const content=changed?document.createElement("mark"):cell;
      if(typeof value==="string")content.textContent=value;
      else content.append(...formNodes(value,gender));
      if(changed)cell.append(content);
      return cell;
    }));
    return line;
  }));
  return element;
}

function endingLabel(cell){
  return cell.ending?`-${cell.ending}`:"—";
}

// Shows only the active row as a strip: endings for case paradigms, full forms for person paradigms.
function renderCardParadigm(card){
  const figure=$("card-paradigm"),paradigm=card.paradigm,shown=Boolean(paradigm)&&answerVisualsShown();
  figure.hidden=!shown;
  if(!shown){figure.replaceChildren();return}
  const row=paradigm.rows[paradigm.active.row],caption=document.createElement("figcaption"),strip=document.createElement("ol");
  caption.textContent=[row.title||row.label,paradigm.title].filter(Boolean).join(" · ");
  strip.className=paradigm.forms?"case-strip forms":"case-strip";
  if(paradigm.forms)setFitChars(strip,Math.max(...row.cells.map(cell=>`${cell.stem}${cell.ending||""}`.length)));
  strip.append(...row.cells.map((cell,columnIndex)=>{
    const column=paradigm.columns[columnIndex],tile=document.createElement("li"),ending=document.createElement("span"),label=document.createElement("span");
    const active=columnIndex===paradigm.active.column;
    tile.className=["case-tile",column.gender?`gender-${column.gender}`:"",active?"active":""].filter(Boolean).join(" ");
    ending.className="case-tile-ending";
    ending.lang="de";
    if(paradigm.forms)ending.append(...formNodes(cell,column.gender));
    else ending.textContent=endingLabel(cell);
    label.className="case-tile-label";
    label.lang="de";
    label.textContent=column.label;
    tile.append(ending,label);
    if(active)tile.setAttribute("aria-current","true");
    return tile;
  }));
  figure.replaceChildren(caption,strip);
}

const auxiliaryChoices=[
  {verb:"sein",text:"рух A → B або зміна стану",icon:'<svg viewBox="0 0 44 30" focusable="false"><circle cx="6" cy="22" r="4" fill="currentColor"/><path d="M10 22C18 6 28 6 34 14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M36 4l4 10h-8z" fill="currentColor"/></svg>'},
  {verb:"haben",text:"дія з об’єктом / без руху",icon:'<svg viewBox="0 0 44 30" focusable="false"><rect x="14" y="6" width="16" height="16" rx="3" fill="currentColor"/><path d="M6 26h32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'}
];

// Both rows stay readable; the active verb, if any, is marked.
function auxiliaryList(activeVerb){
  const list=document.createElement("ul");
  list.className="auxiliary-choices";
  list.append(...auxiliaryChoices.map(choice=>{
    const item=document.createElement("li"),icon=document.createElement("span"),text=document.createElement("span"),verb=textSpan(choice.verb,"auxiliary-verb");
    const active=choice.verb===activeVerb;
    item.className=`auxiliary-choice aux-${choice.verb}${active?" active":""}`;
    if(active)item.setAttribute("aria-current","true");
    icon.className="auxiliary-icon";
    icon.setAttribute("aria-hidden","true");
    icon.innerHTML=choice.icon;
    verb.lang="de";
    text.className="auxiliary-text";
    text.append(verb,textSpan(choice.text,"auxiliary-rule"));
    item.append(icon,text);
    return item;
  }));
  return list;
}

// The haben / sein decision as a picture: both rows stay readable, the card's choice is marked.
function renderCardAuxiliary(card){
  const figure=$("card-auxiliary"),auxiliary=card.auxiliary,shown=Boolean(auxiliary)&&answerVisualsShown();
  figure.hidden=!shown;
  if(!shown){figure.replaceChildren();return}
  const caption=document.createElement("figcaption");
  caption.textContent="Perfekt · haben чи sein";
  figure.replaceChildren(caption,auxiliaryList(auxiliary.verb));
}

const structureLabels={
  first:["Поз. 1","Позиція 1"],
  verb:["Дієсл. 2","Відмінюване дієслово на 2-му місці"],
  middle:["Середина","Середина речення"],
  end:["Кінець","Кінець речення"],
  link:["Сполучник","Сполучник підрядного речення"]
};
const verbFirstLabel=["Дієсл. 1","Відмінюване дієслово на 1-му місці"];
const verbPartRoles=new Set(["verb","end"]);

// Word order as position boxes, one row per clause; both verb parts share the accent, the middle is dashed.
function structureSentence(structure){
  const sentence=document.createElement("div");
  sentence.className="structure-sentence";
  sentence.append(...structure.flatMap((clause,clauseIndex)=>{
    const list=document.createElement("ol");
    list.className="structure-clause";
    list.append(...clause.map((slot,slotIndex)=>{
      const item=document.createElement("li"),text=textSpan(slot.text,"structure-text"),label=document.createElement("abbr");
      const [short,title]=slot.role==="verb"&&slotIndex===0?verbFirstLabel:structureLabels[slot.role];
      item.className=`structure-slot slot-${slot.role}${verbPartRoles.has(slot.role)?" verb-part":""}`;
      text.lang="de";
      label.className="structure-label";
      label.title=title;
      label.textContent=short;
      item.append(text,label);
      return item;
    }));
    if(!clauseIndex)return [list];
    const comma=textSpan(",","structure-comma");
    comma.setAttribute("aria-hidden","true");
    return [comma,list];
  }));
  return sentence;
}

function renderCardStructure(card){
  const figure=$("card-structure"),structure=card.structure,shown=Boolean(structure)&&answerVisualsShown();
  figure.hidden=!shown;
  if(!shown){figure.replaceChildren();return}
  const caption=document.createElement("figcaption");
  caption.textContent="Порядок слів";
  figure.replaceChildren(caption,structureSentence(structure));
}

// The 0–100 % bar. Without an active step (the guide's whole scale) the fill spans the bar and there is no marker.
function frequencyScaleNode(frequency,labelled){
  const active=frequency.scale[frequency.active],scale=document.createElement("div"),track=document.createElement("div"),fill=document.createElement("span");
  scale.className=`frequency-scale${labelled?" labelled":""}`;
  scale.style.setProperty("--frequency",`${active?active.percent:100}%`);
  track.className="frequency-track";
  track.setAttribute("aria-hidden","true");
  fill.className="frequency-fill";
  track.append(fill,...frequency.scale.filter(step=>step.percent>0&&step.percent<100).map(step=>{
    const tick=document.createElement("span");
    tick.className="frequency-tick";
    tick.style.setProperty("--at",`${step.percent}%`);
    return tick;
  }));
  if(active){
    const marker=document.createElement("span");
    marker.className="frequency-marker";
    track.append(marker);
  }
  scale.append(track);
  if(labelled){
    const steps=document.createElement("ol");
    steps.className="frequency-steps";
    steps.lang="de";
    steps.append(...frequency.scale.map((step,stepIndex)=>{
      const item=document.createElement("li");
      item.className=`frequency-step${stepIndex===frequency.active?" active":""}`;
      item.style.setProperty("--at",`${step.percent}%`);
      item.textContent=step.word;
      if(stepIndex===frequency.active)item.setAttribute("aria-current","true");
      return item;
    }));
    scale.append(steps);
  }else{
    const ends=document.createElement("div");
    ends.className="frequency-ends";
    ends.setAttribute("aria-hidden","true");
    ends.append(textSpan("0 %"),textSpan("100 %"));
    scale.append(ends);
  }
  return scale;
}

// How often as a point on a 0–100 % bar. The bar shows meaning, so it stays in practice; the German words wait for Check.
function renderCardFrequency(card){
  const figure=$("card-frequency"),frequency=card.frequency;
  figure.hidden=!frequency;
  if(!frequency){figure.replaceChildren();return}
  const labelled=answerVisualsShown(),active=frequency.scale[frequency.active],percent=`≈ ${active.percent} %`;
  const caption=document.createElement("figcaption");
  if(labelled){
    const word=textSpan(active.word,"frequency-word");
    word.lang="de";
    caption.append(word,document.createTextNode(` · ${percent}`));
  }else caption.textContent=`${percent} часу`;
  figure.replaceChildren(caption,frequencyScaleNode(frequency,labelled));
}

// German counts minutes from the full hour or from halb; the counted span becomes the shaded sector.
function clockReading({hour,minute}){
  const current=hour%12||12,next=current%12+1;
  const span=(from,to,count,text)=>({from,to,text:`${count===15?"¼ години":count===30?"½ години":`${count} хв`} ${text}`});
  if(!minute)return {from:0,to:0,text:`рівно ${current}`};
  if(minute<=20)return span(0,minute,minute,`після ${current}`);
  if(minute<30)return span(minute,30,30-minute,`до пів на ${next}`);
  if(minute===30)return span(0,30,30,`до ${next}`);
  if(minute<40)return span(30,minute,minute-30,`після пів на ${next}`);
  return span(minute,60,60-minute,`до ${next}`);
}

// A point on the 120 × 120 clock face, measured in minutes clockwise from 12.
function clockPoint(minutes,radius){
  const angle=minutes/30*Math.PI;
  return [60+radius*Math.sin(angle),60-radius*Math.cos(angle)].map(value=>+value.toFixed(2));
}

function clockLine(className,minutes,inner,outer){
  const [x1,y1]=clockPoint(minutes,inner),[x2,y2]=clockPoint(minutes,outer);
  return `<line class="${className}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
}

// An analog clock face; when explained, the counted sector is shaded and its reading joins the label.
function clockFace(clock,explained){
  const reading=clockReading(clock),time=`${clock.hour}:${String(clock.minute).padStart(2,"0")}`;
  const face=document.createElement("div"),radius=53,[fromX,fromY]=clockPoint(reading.from,radius),[toX,toY]=clockPoint(reading.to,radius);
  const sector=explained&&reading.to>reading.from?`<path class="clock-sector" d="M60 60L${fromX} ${fromY}A${radius} ${radius} 0 ${reading.to-reading.from>30?1:0} 1 ${toX} ${toY}Z"/>`:"";
  const ticks=Array.from({length:12},(_,hour)=>clockLine(`clock-tick${hour%3?"":" major"}`,hour*5,hour%3?48:45,53)).join("");
  const numbers=[12,3,6,9].map(number=>{
    const [x,y]=clockPoint(number%12*5,37);
    return `<text class="clock-number" x="${x}" y="${y}">${number}</text>`;
  }).join("");
  const hands=clockLine("clock-hand clock-hand-hour",clock.hour%12*5+clock.minute/12,0,28)+clockLine("clock-hand clock-hand-minute",clock.minute,0,44);
  face.className="clock-face";
  face.innerHTML=`<svg viewBox="0 0 120 120" role="img" aria-label="Годинник показує ${time}${explained?`: ${reading.text}`:""}" focusable="false"><circle class="clock-ring" cx="60" cy="60" r="56"/>${sector}${ticks}${hands}${numbers}<circle class="clock-center" cx="60" cy="60" r="3.5"/></svg>`;
  return face;
}

// The prompt time as an analog clock. The hands show meaning; the counted sector and its reading wait for Check.
function renderCardClock(card){
  const figure=$("card-clock"),clock=card.clock;
  figure.hidden=!clock;
  if(!clock){figure.replaceChildren();return}
  const explained=answerVisualsShown(),face=clockFace(clock,explained);
  if(!explained){figure.replaceChildren(face);return}
  const caption=document.createElement("figcaption");
  caption.textContent=clockReading(clock).text;
  figure.replaceChildren(face,caption);
}

// The words beside a picture say the same, so the image is decorative for screen readers.
function pictureImage(picture,size){
  const image=document.createElement("img");
  image.setAttribute("src",`assets/icons/${picture}.svg`);
  image.setAttribute("alt","");
  image.setAttribute("width",String(size));
  image.setAttribute("height",String(size));
  image.setAttribute("draggable","false");
  return image;
}

// A picture shows what a concrete word means, not its German form, so it stays visible before Check.
// The translation already says the same, so the image is decorative for screen readers.
function renderCardPicture(card){
  const figure=$("card-picture");
  figure.hidden=!card.picture;
  if(!card.picture){figure.dataset.picture="";figure.replaceChildren();return}
  if(figure.dataset.picture===card.picture&&figure.children.length)return;
  figure.dataset.picture=card.picture;
  figure.replaceChildren(pictureImage(card.picture,96));
}

function renderCardVisuals(card){
  renderCardScene(card);
  renderCardClock(card);
  renderCardPicture(card);
  renderNounGender(card);
  renderCardFrequency(card);
  renderCardParadigm(card);
  renderCardAuxiliary(card);
  renderCardStructure(card);
}

const ruleVisualKinds=["structure","auxiliary","frequency","clocks","scenes","pictures"];

// Every string a rule illustration displays, so the guide can hide it while it would reveal the answer.
function ruleVisualTexts(visual){
  if(visual.structure){
    const clauses=visual.structure.map(clause=>clause.map(slot=>slot.text).filter(Boolean).join(" "));
    return [...visual.structure.flat().map(slot=>slot.text),...clauses,clauses.join(", ")];
  }
  if(visual.auxiliary)return auxiliaryChoices.flatMap(choice=>[choice.verb,choice.text]);
  if(visual.frequency)return visual.frequency.scale.map(step=>step.word);
  if(visual.clocks)return visual.clocks.flatMap(clock=>[clock.text,clockReading(clock).text]);
  if(visual.scenes)return visual.scenes.flatMap(scene=>[scene.text,scene.cue||""]);
  if(visual.pictures)return visual.pictures.flatMap(item=>item.noun?[...nounEntries(item.noun).map(nounPhrase),nounEntries(item.noun).map(nounPhrase).join(" / ")]:[item.word]);
  return [];
}

function ruleVisualItem(...nodes){
  const item=document.createElement("li");
  item.className="guide-visual-item";
  item.append(...nodes);
  return item;
}

function germanSpan(text,className){
  return Object.assign(textSpan(text,className),{lang:"de"});
}

// A rule's illustration reuses the card components; tiles hold one clock, scene or picture each.
function ruleVisual(visual){
  const kind=ruleVisualKinds.find(key=>visual[key]),figure=document.createElement("figure");
  figure.className=`guide-rule-visual guide-visual-${kind}`;
  if(kind==="structure"){figure.append(structureSentence(visual.structure));return figure}
  if(kind==="auxiliary"){figure.append(auxiliaryList(visual.auxiliary.verb));return figure}
  if(kind==="frequency"){figure.append(frequencyScaleNode(visual.frequency,true));return figure}
  const list=document.createElement("ul");
  list.className="guide-visual-items";
  if(kind==="clocks")list.append(...visual.clocks.map(clock=>ruleVisualItem(clockFace(clock,true),germanSpan(clock.text,"guide-visual-text"),textSpan(clockReading(clock).text,"guide-visual-reading"))));
  if(kind==="scenes")list.append(...visual.scenes.map(scene=>{
    const art=document.createElement("span"),nodes=[art];
    art.className="guide-visual-scene";
    art.innerHTML=`<svg viewBox="0 0 240 128" aria-hidden="true" focusable="false">${sceneMarkup(sceneArt(scene))}</svg>`;
    if(scene.cue)nodes.push(germanSpan(scene.cue,"guide-visual-cue"));
    return ruleVisualItem(...nodes,germanSpan(scene.text,"guide-visual-text"));
  }));
  if(kind==="pictures")list.append(...visual.pictures.map(item=>{
    const label=document.createElement("span");
    label.className="guide-visual-label";
    if(item.noun)label.append(...nounEntryNodes(item.noun,entry=>[genderDot(entry.gender),germanSpan(nounPhrase(entry),"guide-visual-text")]));
    else label.append(germanSpan(item.word,"guide-visual-text"));
    return ruleVisualItem(pictureImage(item.picture,48),label);
  }));
  figure.append(list);
  return figure;
}

// The answer form is split inside the headword; any surrounding words (pronoun, separable prefix) stay muted.
function renderStudyHeadword(card){
  const headword=$("question-word"),parts=card.answerParts,runs=slashRuns(card.word);
  const occurrence=parts&&standaloneOccurrence(card.word,`${parts.stem}${parts.ending}`);
  if(occurrence){
    const before=card.word.slice(0,occurrence.start),after=card.word.slice(occurrence.end);
    const beforeRuns=slashRuns(before),context=before&&textSpan(beforeRuns.nodes?"":before,"form-context");
    if(beforeRuns.nodes)context.append(...beforeRuns.nodes);
    headword.replaceChildren(...[context,...formNodes(parts,card.noun?.gender),after&&textSpan(after,"form-context")].filter(Boolean));
  }
  else if(headwordNoun(card)){
    const entries=nounEntries(card.noun);
    // The "/" stays inside the first group, so a wrapped pair never starts a line with it or leaves it alone.
    const units=entries.map((entry,entryIndex)=>`${nounPhrase(entry)}${entryIndex<entries.length-1?" /":""}`);
    headword.replaceChildren(...entries.flatMap((entry,entryIndex)=>{
      const group=textSpan("","headword-noun");
      group.lang="de";
      group.append(genderDot(entry.gender),textSpan(units[entryIndex]));
      return entryIndex?[textSpan(" "),group]:[group];
    }));
    setFitChars(headword,Math.max(...units.map(unit=>unit.length+1)));
    return;
  }
  else if(runs.nodes)headword.replaceChildren(...runs.nodes);
  else headword.textContent=card.word;
  setFitChars(headword,runs.chars);
}

// The longest run of characters that cannot wrap; CSS shrinks the text until that run fits the card.
function fitChars(text){
  return Math.max(1,...String(text).split(/\s+/).map(word=>word.length));
}

// A chunk plus its trailing " /" longer than this is a translation fragment, not a sentence-building chunk.
const maxChunkLength=20;

// " / " separates sentence chunks or alternatives. A sentence-building chunk stays whole; otherwise the "/" stays
// with the word before it, so a wrapped line never starts with "/" and a chunk is never split.
function slashRuns(text,chunks=false){
  const segments=text.split(" / ");
  if(segments.length<2)return {nodes:null,chars:fitChars(text)};
  const suffix=segmentIndex=>segmentIndex<segments.length-1?" /":"";
  const whole=chunks&&segments.every((segment,segmentIndex)=>`${segment}${suffix(segmentIndex)}`.length<=maxChunkLength);
  const nodes=[],runs=[];
  segments.forEach((segment,segmentIndex)=>{
    const cut=whole?0:segment.lastIndexOf(" ")+1,run=`${segment.slice(cut)}${suffix(segmentIndex)}`;
    if(segmentIndex)nodes.push(textSpan(" "));
    if(cut)nodes.push(textSpan(segment.slice(0,cut)));
    if(run){nodes.push(textSpan(run,"text-run"));runs.push(run)}
  });
  return {nodes,chars:Math.max(fitChars(text),...runs.map(run=>run.length))};
}

function setFitChars(element,chars){
  element.style.setProperty("--fit-chars",String(chars));
}

// Each focus mark carries its own tone, so a plural form is marked in the plural colour and an auxiliary in its own.
function exampleFocus(text,card){
  const marks=[],noun=card.noun,parts=card.answerParts,auxiliary=card.auxiliary;
  const add=(word,tone,form={})=>{
    const occurrence=word&&standaloneOccurrence(text,word);
    if(!occurrence||marks.some(mark=>occurrence.start<mark.end&&mark.start<occurrence.end))return false;
    marks.push({...occurrence,...form,tone});
    return true;
  };
  if(parts)add(`${parts.stem}${parts.ending}`,noun?`gender-${noun.gender}`:"",{ending:parts.ending,vowel:parts.vowel});
  if(noun){
    add(noun.exampleWord,`gender-${noun.gender}`);
    add(noun.plural?.exampleWord,"gender-plural");
  }
  // The practice sentence holds the conjugated form; the learn formula ("haben + gemacht") holds the infinitive.
  if(auxiliary&&!add(auxiliary.form,`aux-${auxiliary.verb}`))add(auxiliary.verb,`aux-${auxiliary.verb}`);
  return marks.sort((left,right)=>left.start-right.start);
}

function textSpan(text,className=""){
  const span=document.createElement("span");
  if(className)span.className=className;
  span.textContent=text;
  return span;
}

function renderExample(text,card){
  const example=$("example"),marks=exampleFocus(text,card);
  if(!marks.length){example.textContent=text;return}
  const nodes=[];
  let cursor=0;
  for(const mark of marks){
    if(mark.start>cursor)nodes.push(textSpan(text.slice(cursor,mark.start)));
    const word=text.slice(mark.start,mark.end),focus=textSpan("",`example-focus${mark.tone?` ${mark.tone}`:""}`);
    const classes={stem:"",vowel:"example-vowel",ending:"example-ending"};
    if(mark.ending||mark.vowel)focus.append(...formSegments({stem:word.slice(0,word.length-(mark.ending||"").length),ending:mark.ending,vowel:mark.vowel}).map(segment=>textSpan(segment.text,classes[segment.part])));
    else focus.textContent=word;
    nodes.push(focus);
    cursor=mark.end;
  }
  if(cursor<text.length)nodes.push(textSpan(text.slice(cursor)));
  example.replaceChildren(...nodes);
}

function practiceSupport(card){
  return card.practiceSupport||{label:"Контекст",text:card.support||""};
}

function render(focusTarget=""){
  const card=deck[index],definition=activeDefinition(),stage=activeStage(),session=learningState.activeSession;
  if(!card)return;
  const revealed=verified||answerRevealed,expected=card.response.accepted[0],[inputLabel,inputPlaceholder]=inputCopy(card);
  const example=feedbackExample(card);
  const feedbackVisible=verificationMode&&revealed;
  // A reverse card's Ukrainian meaning is the answer, so it stays out of the example line until the attempt is checked.
  const exampleTranslation=feedbackVisible?example.translation:(card.type==="recall-reverse"?"":(card.exampleTranslation||card.translation));
  const meaningTranslation=verificationMode?card.translation:(card.studyTranslation||card.translation);
  // The feedback title already names the answer, so the meaning line appears only when it adds to it.
  const repeatsAnswer=card.type==="recall-reverse"&&translationKey(meaningTranslation)===translationKey(expected);
  const separateMeaning=Boolean(translationKey(meaningTranslation))&&translationKey(meaningTranslation)!==translationKey(exampleTranslation)&&!repeatsAnswer;
  const support=verificationMode?practiceSupport(card):{label:"",text:""};
  if(!feedbackVisible){
    $("verification-feedback").textContent="";
    $("verification-feedback").className="verification-feedback";
  }
  renderLessonPath();
  renderDeckGuide(card);
  renderCardVisuals(card);
  if(verificationMode)renderPracticePrompt(card);
  else renderStudyHeadword(card);
  $("translation").textContent=verificationMode?(revealed?"Ваша відповідь німецькою":inputLabel):meaningTranslation;
  $("translation").hidden=verificationMode||!separateMeaning;
  $("prompt-support").dataset.label=support.label;
  $("prompt-support").textContent=support.text;
  $("prompt-support").hidden=!support.text;
  $("original-question-text").textContent=card.promptText;
  $("original-question").hidden=true;
  const category=verificationMode&&!revealed?(stage.categoryBeforeCheck||card.category):card.category;
  $("category-label").textContent=`${categoryLabel(category)} · ${exerciseLabels[card.type]}`;
  $("w-badge").textContent=card.cue||"";
  $("w-badge").hidden=!card.cue||(card.cueAfterCheck&&!answerVisualsShown());
  $("feedback-outcome").hidden=!feedbackVisible;
  $("feedback-outcome").className=`feedback-outcome ${verified?"correct":"incorrect"}`;
  if(feedbackVisible){
    const outcome=feedbackOutcome(card,verified);
    $("feedback-title").textContent=outcome.title;
    $("feedback-detail").textContent=outcome.detail;
    $("feedback-detail").hidden=!outcome.detail;
  }
  $("example-label").textContent=verificationMode&&revealed?example.label:"Приклад речення";
  $("answer-translation").textContent=feedbackVisible&&separateMeaning?`Значення українською: ${meaningTranslation}`:"";
  $("answer-translation").hidden=!feedbackVisible||!separateMeaning;
  renderExample(verificationMode&&revealed?example.text:(card.example||card.word),card);
  $("example-translation").textContent=exampleTranslation;
  $("example-translation").hidden=!translationKey(exampleTranslation);
  $("feedback-context").open=!verificationMode||answerRevealed||$("feedback-context").open;
  $("practice-portion").hidden=false;
  $("new-practice-portion").innerHTML='Новий підхід <span aria-hidden="true">↻</span>';
  const coverage=stageCoverage(stage);
  $("practice-portion-note").textContent=`${counted(deck.length,"картка","картки","карток")} у підході · ${verificationMode?"засвоєно":"переглянуто"} ${coverage.covered} з ${coverage.total}`;
  $("session-progress-label").textContent=`Картка ${index+1} з ${deck.length}`;
  const passProgress=Math.min(index+(revealed||!verificationMode?1:0),deck.length);
  $("session-progress").style.width=`${passProgress/deck.length*100}%`;
  $("session-progress").parentElement.setAttribute("aria-valuemax",String(deck.length));
  $("session-progress").parentElement.setAttribute("aria-valuenow",String(passProgress));
  $("deck-label").textContent=definition.label;
  $("deck-label-de").textContent=definition.catalog.germanTitle||"";
  $("deck-label-de").title=definition.catalog.germanTitle||"";
  $("deck-label-de").hidden=!definition.catalog.germanTitle;
  document.querySelector(".nav-count").textContent=String(deck.length);
  $("verification-label").textContent=inputLabel;
  $("verification-label").hidden=answerRevealed;
  $("verification-input").placeholder=inputPlaceholder;
  $("verification-input").hidden=answerRevealed;
  $("verification-input").readOnly=revealed;
  $("flashcard").classList.toggle("flipped",!verificationMode||revealed);
  $("flashcard").classList.toggle("retry-card",Boolean(card.retry));
  $("flashcard").classList.toggle("long-prompt",verificationMode&&card.promptText.length>42);
  $("flashcard").classList.toggle("practice-card",verificationMode);
  $("answer").style.display=verificationMode&&revealed?"block":verificationMode?"none":"";
  $("verification-panel").classList.toggle("visible",verificationMode);
  $("study-actions").classList.toggle("hidden",verificationMode);
  $("previous-button").disabled=index===0;
  $("continue-button").innerHTML='Наступна картка <span>→</span>';
  $("flip-hint").hidden=true;
  $("lesson-keyboard-hint").textContent=verificationMode?"Enter — перевірити · ще раз Enter — далі":"← Попередня · → або пробіл — далі";
  $("check-button").textContent=revealed?"Наступна картка":"Перевірити";
  $("correction-display").hidden=!answerRevealed;
  $("verification-input").value=session?.cardInputs?.[String(index)]||(revealed?expected:"");
  $("check-button").disabled=!revealed&&!normalizeAnswer($("verification-input").value);
  if(answerRevealed)renderCorrection($("verification-input").value,expected,card.response);else $("correction-text").replaceChildren();
  $("verification-feedback").hidden=feedbackVisible;
  updatePageTitle("practice");
  if(focusTarget)requestAnimationFrame(()=>{
    const element=$(focusTarget);
    const target=element&&!element.hidden?element:verificationMode?$("verification-input"):$("flashcard");
    target.focus();
    if(target===$("verification-input")&&!revealed)target.select();
  });
}

function lessonChapters(stages){
  return stages.reduce((chapters,stage,stageIndex)=>{
    const name=stage.chapter||stage.title,last=chapters[chapters.length-1];
    if(last&&last.name===name)last.steps.push({stage,stageIndex});
    else chapters.push({name,steps:[{stage,stageIndex}]});
    return chapters;
  },[]);
}

function stepButton(chapter,{stage,stageIndex}){
  const button=document.createElement("button"),done=stageIsComplete(activeDeckId,stage),current=stageIndex===activeStageIndex;
  const paused=!current&&Boolean(suspendedEntry(activeDeckId,stage.id));
  const stepIndex=chapter.steps.findIndex(step=>step.stageIndex===stageIndex);
  const phase=stage.phase||(stage.mode==="input"?"Практика":"Вивчення");
  button.type="button";
  button.className=`phase${current?" current":""}${done?" done":""}${paused?" paused":""}`;
  button.textContent=phase;
  button.setAttribute("aria-current",current?"step":"false");
  button.setAttribute("aria-label",`Етап ${stepIndex+1} з ${chapter.steps.length}: ${phase} · ${chapter.name} · ${stage.title}${current?" (поточний етап)":""}${done?" (завершено)":""}${paused?" (незавершений підхід збережено)":""}`);
  if(paused)button.title="Незавершений підхід збережено";
  button.addEventListener("click",()=>{if(!current)selectStage(stageIndex)});
  return button;
}

function renderLessonPath(){
  const stages=activeDefinition().stages,chapters=lessonChapters(stages),current=activeStage();
  const doneCount=stages.filter(stage=>stageIsComplete(activeDeckId,stage)).length;
  const activeChapterIndex=chapters.findIndex(chapter=>chapter.steps.some(step=>step.stageIndex===activeStageIndex));
  $("lesson-chapter-label").textContent=current.chapter||current.title;
  const chapter=chapters[activeChapterIndex],currentStepIndex=chapter.steps.findIndex(step=>step.stageIndex===activeStageIndex);
  const phase=current.phase||(current.mode==="input"?"Практика":"Вивчення");
  $("lesson-phase-label").textContent=`${phase} · етап ${currentStepIndex+1} з ${chapter.steps.length}`;
  $("lesson-chapter-count").textContent=`Розділ ${activeChapterIndex+1} з ${chapters.length}`;
  $("stage-objective").textContent=current.objective;
  $("lesson-step-count").textContent=`План уроку · завершено ${doneCount} з ${counted(stages.length,"етапу","етапів","етапів")} · охоплено ${coverageText(lessonCoverage(activeDeckId))}${coverageMasteryNote(activeDeckId)}`;
  $("lesson-outline-count").textContent=counted(chapters.length,"розділ","розділи","розділів");
  $("lesson-steps").replaceChildren(...chapters.map((chapter,chapterIndex)=>{
    const item=document.createElement("li"),isComplete=chapter.steps.every(step=>stageIsComplete(activeDeckId,step.stage));
    item.className=`journey-chapter${chapterIndex===activeChapterIndex?" active":""}${isComplete?" complete":""}`;
    item.style.setProperty("--steps",String(chapter.steps.length));
    const head=document.createElement("div");head.className="chapter-head";
    const marker=document.createElement("span");marker.className="chapter-marker";marker.textContent=isComplete?"✓":String(chapterIndex+1);
    const name=document.createElement("span");name.className="chapter-name";name.textContent=chapter.name;
    head.append(marker,name);
    const phases=document.createElement("div");phases.className="chapter-phases";
    phases.append(...chapter.steps.map(step=>stepButton(chapter,step)));
    item.append(head,phases);
    return item;
  }));
}

function renderDeckGuide(card){
  const guide=activeDefinition().guide;
  $("deck-guide").hidden=!guide;
  $("guide-toggle").hidden=!guide;
  if(!guide)return;
  $("deck-guide-title").textContent=guide.title;
  const concealsAnswer=verificationMode&&!verified&&!answerRevealed;
  let examplesHidden=false;
  const safeGuideText=text=>{
    if(concealsAnswer&&card.response.accepted.some(answer=>standaloneOccurrence(text,answer.replace(/[?!.,]+$/,"")))){
      examplesHidden=true;
      return "";
    }
    return text;
  };
  // A table leaks when a cell alone, or read together with its column or row header, forms an answer.
  const safeGuideTable=table=>{
    const cellText=cell=>typeof cell==="string"?cell:`${cell.stem}${cell.ending}`;
    const texts=[...table.columns.map(column=>column.label),table.note||"",...table.rows.flatMap(row=>[row.label,row.title||"",...row.cells.flatMap((cell,columnIndex)=>{
      const text=cellText(cell);
      return [text,`${table.columns[columnIndex].label} ${text}`,`${row.label} ${text}`];
    })])];
    return texts.every(text=>safeGuideText(text)===text)?table:null;
  };
  // An illustration is all-or-nothing: if any of its words would reveal the answer, the whole figure waits for Check.
  const safeGuideVisual=visual=>visual&&ruleVisualTexts(visual).every(text=>safeGuideText(text)===text)?visual:null;
  const rules=guide.rules.map(rule=>{
    if(typeof rule==="string")return safeGuideText(rule)||null;
    // A rule without a title reads like a plain rule but may carry an illustration.
    if(!rule.title){
      const detail=safeGuideText(rule.detail);
      return detail?{detail,visual:safeGuideVisual(rule.visual)}:null;
    }
    const title=safeGuideText(rule.title);
    if(!title)return null;
    return {...rule,title,detail:safeGuideText(rule.detail),formula:rule.formula?safeGuideText(rule.formula):"",visual:safeGuideVisual(rule.visual),table:rule.table&&safeGuideTable(rule.table)};
  }).filter(Boolean);
  const intro=safeGuideText(guide.intro);
  $("deck-guide-intro").textContent=intro;
  $("deck-guide-intro").hidden=!intro;
  $("guide-answer-note").hidden=!examplesHidden;
  $("deck-guide-count").textContent=counted(rules.length,"правило","правила","правил");
  $("deck-guide-toggle-label").textContent="Правила";
  $("deck-guide-rules").replaceChildren(...rules.map((rule,index)=>{
    const item=document.createElement("li"),number=document.createElement("span"),text=document.createElement("span");
    number.className="guide-rule-number";number.textContent=String(index+1).padStart(2,"0");
    text.className="guide-rule-text";
    if(typeof rule==="string")text.textContent=rule;
    else if(!rule.title){
      text.textContent=rule.detail;
      if(rule.visual)text.append(ruleVisual(rule.visual));
    }else{
      const title=document.createElement("strong"),detail=document.createElement("span");
      title.className="guide-rule-title";title.textContent=rule.title;
      detail.className="guide-rule-detail";detail.textContent=rule.detail;
      text.append(title,detail);
      if(rule.formula){const formula=document.createElement("span");formula.className="guide-rule-formula";formula.textContent=rule.formula;text.append(formula)}
      if(rule.visual)text.append(ruleVisual(rule.visual));
      if(rule.table){
        text.append(grammarTable(rule.table,"guide-table"));
        if(rule.table.note){const note=document.createElement("span");note.className="guide-table-note";note.textContent=rule.table.note;text.append(note)}
      }
    }
    item.append(number,text);
    return item;
  }));
}

function checkAnswer(){
  if(verified||answerRevealed){next();return}
  const value=$("verification-input").value;
  if(!normalizeAnswer(value)){
    $("verification-feedback").textContent="Спочатку напишіть відповідь.";
    $("verification-feedback").className="verification-feedback incorrect";
    $("verification-input").focus();
    return;
  }
  const card=deck[index],session=learningState.activeSession,wasCorrect=answerMatches(value,card);
  if(!session.cardInputs)session.cardInputs={};
  session.cardInputs[String(index)]=value;
  const isFirstAttempt=session.answered[card.targetId]===undefined;
  if(isFirstAttempt){
    session.answered[card.targetId]=wasCorrect;
    session.firstAttemptTotal+=1;
    if(wasCorrect)session.firstAttemptCorrect+=1;
  }
  const newlyMastered=wasCorrect&&!session.passMastered.includes(card.targetId);
  recordAttempt(wasCorrect,isFirstAttempt,newlyMastered);
  session.cardStatus[String(index)]=wasCorrect?"correct":"wrong";
  if(wasCorrect){
    verified=true;
    if(!session.passMastered.includes(card.targetId)){
      session.passMastered.push(card.targetId);
      markTarget(activeStage(),card.targetId);
    }
    session.retryQueue=session.retryQueue.filter(targetId=>targetId!==card.targetId);
    $("verification-feedback").textContent=card.retry?"Правильно — помилку виправлено, відповідь засвоєно.":"Правильно.";
    $("verification-feedback").className="verification-feedback correct";
  }else{
    answerRevealed=true;
    if(!session.retryQueue.includes(card.targetId))session.retryQueue.push(card.targetId);
    if(!deck.slice(index+1).some(candidate=>candidate.targetId===card.targetId)){
      const insertAt=Math.min(index+3,deck.length);
      deck.splice(insertAt,0,{...card,retry:true});
      session.retryPositions=session.retryPositions.map(position=>position>=insertAt?position+1:position);
      session.retryPositions.push(insertAt);
      for(const field of ["cardStatus","cardInputs"]){
        Object.keys(session[field]).map(Number).filter(position=>position>=insertAt).sort((a,b)=>b-a).forEach(position=>{
          session[field][String(position+1)]=session[field][String(position)];
          delete session[field][String(position)];
        });
      }
    }
    $("verification-feedback").textContent="Не зовсім. Перегляньте виправлення; завдання незабаром повернеться.";
    $("verification-feedback").className="verification-feedback incorrect";
  }
  persistPosition();
  render("verification-input");
  updateStats();
}

function next(){
  if(celebrating||verificationMode&&!verified&&!answerRevealed)return;
  const stage=activeStage(),card=deck[index];
  if(!verificationMode)markTarget(stage,card.targetId);
  if(index===deck.length-1){completePass();return}
  index+=1;
  completed=index;
  const destinationStatus=learningState.activeSession?.cardStatus?.[String(index)];
  verified=destinationStatus==="correct";
  answerRevealed=destinationStatus==="wrong";
  practiceInputStarted=false;
  $("verification-feedback").textContent="";
  $("verification-feedback").className="verification-feedback";
  persistPosition();
  render(verificationMode?"verification-input":"continue-button");
}

function previous(){
  if(celebrating||index===0)return;
  index-=1;
  const status=learningState.activeSession?.cardStatus?.[String(index)];
  verified=status==="correct";
  answerRevealed=status==="wrong";
  persistPosition();
  render(verificationMode?"verification-input":"flashcard");
}

function completePass(){
  const stage=activeStage(),session=learningState.activeSession;
  if(!session)return startStageAttempt(true);
  if(verificationMode&&session.retryQueue.length){
    const cards=allCardsById(stage);
    session.retryQueue.forEach(targetId=>{
      const repair=variantsForStage(stage).find(card=>card.targetId===targetId);
      if(repair){
        session.retryPositions.push(deck.length);
        deck.push({...cards.get(repair.id),retry:true});
      }
    });
    index+=1;
    completed=index;
    verified=false;
    answerRevealed=false;
    $("verification-feedback").textContent="";
    $("verification-feedback").className="verification-feedback";
    persistPosition();
    render("verification-input");
    return;
  }
  if(!verificationMode)session.passTargetIds.forEach(targetId=>markTarget(stage,targetId));
  const lesson=lessonState(activeDeckId),coverage=stageCoverage(stage);
  const wasComplete=stageIsComplete(activeDeckId,stage);
  if(coverage.covered===coverage.total){
    const collection=stage.mode==="input"?lesson.masteredPractice:lesson.completedLearn;
    if(!collection.includes(stage.id))collection.push(stage.id);
    if(stage.mode==="input"){
      const delayDays=session.firstAttemptTotal&&session.firstAttemptCorrect/session.firstAttemptTotal>=.85?3:1;
      lesson.dueAt=new Date(Date.now()+delayDays*86400000).toISOString();
    }
  }
  const completedAt=new Date().toISOString();
  const pendingCompletion={id:globalThis.crypto?.randomUUID?.()||`${activeDeckId}:${stage.id}:${completedAt}`,lessonId:activeDeckId,sequenceId:stage.id,session,newMastery:!wasComplete&&stageIsComplete(activeDeckId,stage),completedAt};
  recordPendingCompletion(pendingCompletion);
  learningState.activeSession=null;
  learningState.activeSessionUpdatedAt=completedAt;
  saveState();
  updateStats();
  showCompletion(stage,session,learningState.pendingCompletion.newMastery);
}

function showCompletion(stage,session,newMastery){
  celebrating=true;
  const coverage=stageCoverage(stage),stageComplete=stageIsComplete(activeDeckId,stage);
  $("celebration-title").textContent=stageComplete?(stage.mode==="input"?"Етап засвоєно!":"Вивчення етапу завершено!"):"Підхід завершено";
  $("celebration-message").textContent=stageComplete?`Етап «${stage.title}» завершено.`:`Ви опрацювали ${counted(session.passTargetIds.length,"навчальну ціль","навчальні цілі","навчальних цілей")}. Залишилося ${counted(coverage.total-coverage.covered,"ціль","цілі","цілей")}.`;
  $("completion-stats").textContent=stage.mode==="input"?`Точність перших відповідей: ${session.firstAttemptTotal?Math.round(session.firstAttemptCorrect/session.firstAttemptTotal*100):0}% · засвоєно ${coverage.covered} з ${coverage.total} · урок: охоплено ${coverageText(lessonCoverage(activeDeckId))}${coverageMasteryNote(activeDeckId)}`:`Переглянуто ${coverage.covered} з ${coverage.total}`;
  const nextIndex=activeStageIndex+1,nextStage=activeDefinition().stages[nextIndex];
  if(!stageComplete){
    $("completion-primary").textContent="Продовжити розділ";
    completionPrimaryAction=()=>selectStage(activeStageIndex,true);
  }else if(nextStage){
    $("completion-primary").textContent=nextStage.mode==="input"?"Перейти до практики":"Наступний розділ";
    completionPrimaryAction=()=>selectStage(nextIndex);
  }else{
    $("completion-primary").textContent="До бібліотеки уроків";
    completionPrimaryAction=()=>showView("library");
  }
  $("completion-secondary").textContent="Повторити з новими прикладами";
  completionSecondaryAction=()=>selectStage(activeStageIndex,true);
  $("celebration").hidden=false;
  renderConfetti(newMastery);
  requestAnimationFrame(()=>$("completion-primary").focus());
}

function renderConfetti(enabled){
  const confetti=$("confetti");
  confetti.replaceChildren();
  if(!enabled||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const colors=["#6c5ce7","#f39b63","#54bf9b","#6ba9ed","#f27d9b"];
  for(let pieceIndex=0;pieceIndex<24;pieceIndex+=1){
    const piece=document.createElement("i");
    piece.className="confetti-piece";
    piece.style.setProperty("--left",`${Math.random()*100}%`);
    piece.style.setProperty("--delay",`${Math.random()*.35}s`);
    piece.style.setProperty("--duration",`${1.6+Math.random()*.8}s`);
    piece.style.setProperty("--color",colors[pieceIndex%colors.length]);
    piece.style.setProperty("--rotation",`${Math.random()*360}deg`);
    confetti.appendChild(piece);
  }
}

function closeCompletion(){
  $("celebration").hidden=true;
  $("confetti").replaceChildren();
  celebrating=false;
  const resolvedId=pendingCompletionForDisplay()?.id;
  const resolvedAt=new Date().toISOString();
  resolvePendingCompletion(resolvedId,resolvedAt);
  saveState();
}

function startNewPass(){
  closeCompletion();
  selectStage(activeStageIndex,true,verificationMode?"verification-input":"flashcard");
}

function lessonStatus(lessonId){
  const definition=deckDefinitions[lessonId],lesson=lessonState(lessonId);
  const learnStages=definition.stages.filter(stage=>stage.mode!=="input"),practiceStages=definition.stages.filter(stage=>stage.mode==="input");
  const allLearned=learnStages.every(stage=>stageIsComplete(lessonId,stage));
  const allMastered=practiceStages.length>0&&practiceStages.every(stage=>stageIsComplete(lessonId,stage));
  const hasTargetProgress=[...Object.values(lesson.learnedTargets),...Object.values(lesson.masteredTargets)].some(targets=>targets.length);
  const hasProgress=lesson.completedLearn.length||lesson.masteredPractice.length||lesson.attempts||hasTargetProgress||lessonHasOpenAttempt(lessonId)||hasPendingCompletionForLesson(lessonId);
  if(!hasProgress)return {key:"new",label:"Не розпочато"};
  if(allMastered&&Date.parse(lesson.dueAt||"")<=Date.now())return {key:"due",label:"Час повторити"};
  if(allMastered)return {key:"mastered",label:"Засвоєно"};
  if(allLearned&&practiceStages.length)return {key:"ready",label:"Готово до практики"};
  return {key:"learning",label:"У процесі"};
}

function actionLabel(lessonId){
  const status=lessonStatus(lessonId);
  if(lessonHasOpenAttempt(lessonId))return "Продовжити";
  if(status.key==="due")return "Повторити зараз";
  if(status.key==="mastered")return "Повторити урок";
  if(status.key==="ready")return "Перейти до практики";
  if(status.key==="learning")return "Продовжити";
  return deckDefinitions[lessonId].stages[0].mode==="input"?"Почати практику":"Почати вивчення";
}

function germanTitleElement(definition,tag="p"){
  if(!definition.catalog.germanTitle)return null;
  const element=document.createElement(tag);
  element.className="lesson-title-de";element.lang="de";element.textContent=definition.catalog.germanTitle;
  return element;
}

function classGlyph(lessonClass){
  const glyph=document.createElement("span");
  glyph.className="class-glyph";glyph.setAttribute("aria-hidden","true");
  if(lessonClassGlyphs[lessonClass.glyph]){
    glyph.dataset.glyph=lessonClass.glyph;
    glyph.innerHTML=`<svg viewBox="0 0 24 24" focusable="false">${lessonClassGlyphs[lessonClass.glyph]}</svg>`;
  }
  return glyph;
}

function libraryGroups(){
  const groups=new Map(lessonClasses.map(lessonClass=>[lessonClass.name,{lessonClass,lessonIds:[]}]));
  for(const [lessonId,definition] of Object.entries(deckDefinitions)){
    const name=definition.catalog.className;
    if(!groups.has(name))groups.set(name,{lessonClass:{name,glyph:null,summary:""},lessonIds:[]});
    groups.get(name).lessonIds.push(lessonId);
  }
  return [...groups.values()].filter(group=>group.lessonIds.length);
}

function libraryCard(lessonId,lessonClass){
  const definition=deckDefinitions[lessonId],status=lessonStatus(lessonId),catalog=definition.catalog;
  const article=document.createElement("article");article.className="library-section featured";
  const top=document.createElement("div");top.className="section-card-top";
  const heading=document.createElement("div");heading.className="section-heading";
  const title=document.createElement("h4");title.textContent=definition.title;
  heading.append(...[title,germanTitleElement(definition)].filter(Boolean));
  top.append(classGlyph(lessonClass),heading);
  const outcome=document.createElement("p");outcome.className="section-outcome";outcome.textContent=catalog.outcome;
  const footer=document.createElement("div");footer.className="section-footer";
  const meta=document.createElement("div");meta.className="section-meta";
  const sequences=document.createElement("span");sequences.textContent=counted(definition.stages.length,"етап","етапи","етапів");
  const level=document.createElement("span");level.textContent=catalog.level||"A1";
  const coverage=document.createElement("span");coverage.textContent=`охоплено ${coveragePercent(lessonCoverage(lessonId))}%`;
  meta.append(sequences,level,coverage);
  const badge=document.createElement("span");badge.className=`status-badge ${status.key}`;badge.textContent=status.label;
  footer.append(meta,badge);
  const button=document.createElement("button");button.type="button";button.className="primary-button";button.innerHTML=`<span>${actionLabel(lessonId)}</span><span aria-hidden="true">→</span>`;
  button.addEventListener("click",()=>{if(selectDeck(lessonId))showView("practice")});
  article.append(top,outcome,footer,button);
  return article;
}

function renderLibrary(){
  $("library-total").textContent=counted(Object.keys(deckDefinitions).length,"урок","уроки","уроків");
  $("section-grid").replaceChildren(...libraryGroups().map(({lessonClass,lessonIds},index)=>{
    const group=document.createElement("section");group.className="library-group";
    const headingId=`library-group-${index+1}`;group.setAttribute("aria-labelledby",headingId);
    const header=document.createElement("div");header.className="library-group-header";
    const text=document.createElement("div");
    const heading=document.createElement("h3");heading.id=headingId;heading.textContent=lessonClass.name;
    text.append(heading);
    if(lessonClass.summary){const summary=document.createElement("p");summary.textContent=lessonClass.summary;text.append(summary)}
    const count=document.createElement("span");count.className="library-group-count";count.textContent=counted(lessonIds.length,"урок","уроки","уроків");
    header.append(classGlyph(lessonClass),text,count);
    const grid=document.createElement("div");grid.className="section-grid";
    grid.append(...lessonIds.map(lessonId=>libraryCard(lessonId,lessonClass)));
    group.append(header,grid);
    return group;
  }));
}

function activitySummary(){
  const today=new Date(),counts=[];
  for(let offset=6;offset>=0;offset-=1){const date=new Date(today);date.setDate(today.getDate()-offset);counts.push(learningState.activityByDate[dateKey(date)]?.attempts||0)}
  const totals=Object.values(learningState.lessons).reduce((summary,lesson)=>{
    summary.attempts+=lesson.attempts||0;
    summary.firstAttempts+=lesson.firstAttempts||0;
    summary.correct+=lesson.firstAttemptCorrect||0;
    return summary;
  },{attempts:0,firstAttempts:0,correct:0});
  let streak=0;
  for(let offset=0;offset<366;offset+=1){
    const date=new Date(today);date.setDate(today.getDate()-offset);
    if(!(learningState.activityByDate[dateKey(date)]?.attempts))break;
    streak+=1;
  }
  return {counts,weekly:counts.reduce((sum,count)=>sum+count,0),streak,...totals};
}

function lessonAccuracy(lesson){
  return lesson?.firstAttempts?Math.round(lesson.firstAttemptCorrect/lesson.firstAttempts*100):null;
}

function relativePracticeTime(timestamp){
  if(!timestamp)return "Практики ще не було";
  const elapsed=Math.max(0,Date.now()-Date.parse(timestamp)),minutes=Math.floor(elapsed/60000);
  if(minutes<1)return "Щойно";
  if(minutes<60)return `${minutes} хв тому`;
  const hours=Math.floor(minutes/60);
  if(hours<24)return `${hours} год тому`;
  return `${counted(Math.floor(hours/24),"день","дні","днів")} тому`;
}

function reviewStage(lessonId){
  const definition=deckDefinitions[lessonId];
  return definition.stages.find(stage=>stage.mode==="input"&&!stageIsComplete(lessonId,stage))||definition.stages.find(stage=>stage.mode==="input")||definition.stages[0];
}

function reviewLesson(lessonId){
  const stage=reviewStage(lessonId);
  if(selectDeck(lessonId,stage.id))showView("practice");
}

function recommendedLesson(){
  const lessons=Object.keys(deckDefinitions).map(id=>({id,status:lessonStatus(id),lesson:lessonState(id),accuracy:lessonAccuracy(lessonState(id))}));
  return lessons.find(item=>item.status.key==="due")
    ||lessons.filter(item=>item.accuracy!==null&&!["mastered","due"].includes(item.status.key)).sort((a,b)=>a.accuracy-b.accuracy)[0]
    ||lessons.find(item=>item.status.key==="new")
    ||lessons.sort((a,b)=>(Date.parse(a.lesson.lastPracticedAt||"")||0)-(Date.parse(b.lesson.lastPracticedAt||"")||0))[0];
}

function renderProgress(){
  const summary=activitySummary(),accuracy=summary.firstAttempts?Math.round(summary.correct/summary.firstAttempts*100):0;
  $("progress-accuracy").textContent=`${accuracy}%`;
  $("progress-streak").textContent=String(summary.streak);
  $("progress-streak-label").textContent=`${pluralForm(summary.streak,"день","дні","днів")} поспіль`;
  $("progress-reviewed").textContent=String(summary.weekly);
  const course=courseCoverage();
  $("progress-coverage").textContent=`${coveragePercent(course)}%`;
  $("progress-coverage-label").textContent=`охоплено ${coverageText(course)} курсу`;
  const recommended=recommendedLesson(),definition=deckDefinitions[recommended.id];
  $("lesson-history-note").textContent=summary.firstAttempts?"За першими відповідями":"Облік почнеться з першої відповіді у практиці";
  $("review-focus-button").textContent=recommended.status.key==="new"?`Почати: ${definition.title} →`:`Повторити: ${definition.title} →`;
  $("review-focus-message").textContent=recommended.status.key==="due"?`Час повторити урок «${definition.title}». Короткий підхід із різними завданнями допоможе краще запам’ятати матеріал.`:recommended.status.key==="new"?`Почніть урок «${definition.title}», щоб опанувати нову навичку через приклади й пригадування.`:`Рекомендуємо урок «${definition.title}» з огляду на точність перших відповідей і час останньої практики.`;
  $("review-focus-button").onclick=()=>reviewLesson(recommended.id);
  const sorted=Object.keys(deckDefinitions).sort((a,b)=>{
    const priority={due:0,ready:1,learning:2,new:3,mastered:4};
    return priority[lessonStatus(a).key]-priority[lessonStatus(b).key];
  });
  $("lesson-progress-list").replaceChildren(...sorted.map(lessonId=>{
    const definition=deckDefinitions[lessonId],lesson=lessonState(lessonId),status=lessonStatus(lessonId),accuracyValue=lessonAccuracy(lesson);
    const item=document.createElement("article");item.className="lesson-progress-card";
    const heading=document.createElement("div"),title=document.createElement("h4"),last=document.createElement("span");
    title.textContent=definition.title;last.className="lesson-last-practice";last.textContent=`${status.label} · ${relativePracticeTime(lesson.lastPracticedAt)}`;heading.append(...[title,germanTitleElement(definition),last].filter(Boolean));
    const details=document.createElement("div");details.className="lesson-progress-details";
    const accuracy=document.createElement("strong"),accuracyLabel=document.createElement("span"),attempts=document.createElement("span");
    accuracy.textContent=accuracyValue===null?"—":`${accuracyValue}%`;accuracyLabel.textContent="точність перших відповідей";attempts.textContent=lesson.firstAttempts?counted(lesson.firstAttempts,"перша відповідь","перші відповіді","перших відповідей"):"Відповідей у практиці ще немає";
    const coverage=lessonCoverage(lessonId),coverageNote=document.createElement("span");
    coverageNote.className="lesson-coverage";
    coverageNote.textContent=`охоплено ${coverageText(coverage)}${coverage.newTargets?` · ${counted(coverage.newTargets,"нова ціль","нові цілі","нових цілей")}`:""}${coverageMasteryNote(lessonId)}`;
    details.append(accuracy,accuracyLabel,attempts,coverageNote);
    const button=document.createElement("button");button.type="button";button.className="lesson-review-button";button.textContent=status.key==="new"?"Почати →":"Практика →";button.addEventListener("click",()=>reviewLesson(lessonId));
    item.append(heading,details,button);
    return item;
  }));
}

function updateStats(){
  const summary=activitySummary();
  $("streak").textContent=String(summary.streak);
  $("streak-label").textContent=`${pluralForm(summary.streak,"день","дні","днів")} поспіль`;
  renderLibrary();
  renderProgress();
}

function updatePageTitle(view){
  $("page-title").textContent=view==="practice"?`${activeStage().mode==="input"?"Практика":"Вивчення"}: ${activeDefinition().title}`:view==="library"?"Бібліотека уроків":"Ваш прогрес";
  document.title=`DeutschDrill · ${$("page-title").textContent}`;
}

function showView(view){
  persistPosition();
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view===view));
  document.querySelectorAll(".view").forEach(element=>element.classList.add("hidden"));
  $(`${view}-view`).classList.remove("hidden");
  window.scrollTo(0,0);
  updatePageTitle(view);
  if(view==="practice"){
    if(!learningState.activeSession)selectDeck(activeDeckId);
    else render(verificationMode?"verification-input":"flashcard");
  }
  if(view==="library")renderLibrary();
  if(view==="progress")renderProgress();
}

function renderAll(){
  if(deck.length)render();
  updateStats();
}

function restorePendingCompletion(){
  const pending=pendingCompletionForDisplay();
  if(!pending?.lessonId||!deckDefinitions[pending.lessonId])return;
  const stageIndex=deckDefinitions[pending.lessonId].stages.findIndex(stage=>stage.id===pending.sequenceId);
  if(stageIndex<0)return;
  activeDeckId=pending.lessonId;
  activeStageIndex=stageIndex;
  showCompletion(activeStage(),pending.session,pending.newMastery);
}

$("bookmark").addEventListener("click",event=>{event.stopPropagation();const saved=event.currentTarget.classList.toggle("saved");event.currentTarget.textContent=saved?"♥":"♡";event.currentTarget.setAttribute("aria-pressed",String(saved))});
$("verification-input").addEventListener("input",event=>{
  if(verificationMode&&!practiceInputStarted&&event.target.value.trim())practiceInputStarted=true;
  $("check-button").disabled=verificationMode&&!verified&&!answerRevealed&&!normalizeAnswer(event.target.value);
  if(verificationMode&&!verified&&!answerRevealed&&learningState.activeSession){
    const session=learningState.activeSession;
    if(!session.cardInputs)session.cardInputs={};
    if(event.target.value)session.cardInputs[String(index)]=event.target.value;
    else delete session.cardInputs[String(index)];
    persistPosition();
  }
});
$("check-button").addEventListener("click",checkAnswer);
$("continue-button").addEventListener("click",next);
$("previous-button").addEventListener("click",previous);
$("lesson-plan-link").addEventListener("click",()=>{
  $("lesson-outline").scrollIntoView({block:"nearest",behavior:"instant"});
  $("lesson-outline-title").focus({preventScroll:true});
});
$("lesson-library").addEventListener("click",()=>{showView("library");$("page-title").focus()});
$("lesson-home").addEventListener("click",event=>{event.preventDefault();$("lesson-library").click()});
$("new-practice-portion").addEventListener("click",()=>startNewPass());
$("deck-guide-disclosure").addEventListener("toggle",()=>{
  const open=$("deck-guide-disclosure").open;
  $("guide-toggle").setAttribute("aria-expanded",String(open));
});
$("guide-toggle").addEventListener("click",()=>{$("deck-guide-disclosure").open=!$("deck-guide-disclosure").open});
$("completion-primary").addEventListener("click",()=>{closeCompletion();completionPrimaryAction()});
$("completion-secondary").addEventListener("click",()=>{closeCompletion();completionSecondaryAction()});
$("completion-library").addEventListener("click",()=>{closeCompletion();showView("library")});
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>showView(item.dataset.view)));
document.addEventListener("keydown",event=>{
  if(celebrating){
    if(event.key==="Escape"){
      event.preventDefault();
      $("completion-library").click();
      return;
    }
    if(event.key==="Tab"){
      const focusable=[$("completion-primary"),$("completion-secondary"),$("completion-library")];
      const currentIndex=focusable.indexOf(document.activeElement);
      const nextIndex=event.shiftKey?(currentIndex<=0?focusable.length-1:currentIndex-1):(currentIndex===focusable.length-1?0:currentIndex+1);
      event.preventDefault();
      focusable[nextIndex].focus();
    }
    return;
  }
  if($("practice-view").classList.contains("hidden"))return;
  if(event.target.id==="verification-input"){
    if(event.key==="Enter"){event.preventDefault();checkAnswer()}
    return;
  }
  if(event.target instanceof Element&&event.target.closest("button, a, input, select, summary, [role='button']"))return;
  if(event.key==="Enter"&&verificationMode){event.preventDefault();checkAnswer();return}
  if(event.key===" "&&!verificationMode){event.preventDefault();next();return}
  if(event.key==="ArrowRight")next();
  if(event.key==="ArrowLeft")previous();
});
window.addEventListener("beforeunload",()=>{if(learningState.activeSession){learningState.activeSession.updatedAt=new Date().toISOString();localStorage.setItem(stateStorageKey,JSON.stringify(learningState))}});

backfillLegacyTargets();
resumeInitialSession();
renderAll();
restorePendingCompletion();
if(compatibilityError)showPersistenceError(compatibilityError);
restoreState();
})();
