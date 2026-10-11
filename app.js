(function(){
"use strict";

const STATE_VERSION=5;
const PASS_SIZE=7;
const stateStorageKey="german-learning-state-v5";
const previousStateStorageKeys=["german-learning-state-v4","german-learning-state-v3"];
const deviceStorageKey="german-learning-device-id";
const writerStorageKey="german-learning-writer-id";
const historyEndpoint="/api/lesson-history";
const $=id=>document.getElementById(id);
const lessonCatalog={
  "w-questions":{title:"Питальні слова",germanTitle:"W-Fragen",outcome:"Добирати потрібне питальне слово й ставити запитання німецькою.",className:"Лексика",color:"purple"},
  conjugation:{title:"Відмінювання дієслів",germanTitle:"Verbkonjugation",outcome:"Уживати правильні закінчення теперішнього часу й дотримуватися правил правопису.",className:"Морфологія",color:"orange"},
  "strong-verbs":{title:"Сильні дієслова",germanTitle:"Starke Verben",outcome:"Правильно утворювати форми сильних дієслів у контексті.",className:"Морфологія",color:"blue"},
  "past-verbs":{title:"Минулий час · A1",germanTitle:"Vergangenheit · A1",outcome:"Уживати Perfekt у повсякденному спілкуванні та впізнавати Präteritum дієслів sein і haben.",className:"Морфологія",color:"purple",level:"A1"},
  "past-verbs-a2":{title:"Минулий час · A2",germanTitle:"Vergangenheit · A2",outcome:"Уживати Präteritum модальних дієслів і поширені форми для розповіді про життя поряд із Perfekt.",className:"Морфологія",color:"orange",level:"A2"},
  "past-verbs-b1":{title:"Минулий час · B1",germanTitle:"Vergangenheit · B1",outcome:"Розрізняти Präteritum і Perfekt у розповідях рівня B1.",className:"Морфологія",color:"blue",level:"B1"},
  perfekt:{title:"Минулий час Perfekt: haben і sein",germanTitle:"Das Perfekt: haben und sein",outcome:"Утворювати Perfekt із правильним haben або sein та Partizip II.",className:"Морфологія",color:"green"},
  "present-practice":{title:"Теперішній час: практика",germanTitle:"Präsens üben",outcome:"Пригадувати форми теперішнього часу за контекстом і значенням.",className:"Морфологія",color:"green"},
  koennen:{title:"Модальні дієслова",germanTitle:"Modalverben",outcome:"Уживати können, mögen і möchten у корисних реченнях.",className:"Граматика",color:"blue"},
  haben:{title:"Мати, отримувати, потребувати",germanTitle:"Haben, bekommen, brauchen",outcome:"Розрізняти значення й форми haben, bekommen і brauchen.",className:"Граматика",color:"green"},
  "word-order":{title:"Порядок слів",germanTitle:"Wortstellung",outcome:"Будувати розповідні й питальні речення з правильним порядком слів.",className:"Синтаксис",color:"blue"},
  "separable-verbs":{title:"Дієслова з відокремлюваними префіксами",germanTitle:"Trennbare Verben",outcome:"Правильно розміщувати відокремлювані префікси в різних типах речень.",className:"Синтаксис",color:"purple"},
  pronouns:{title:"Особові займенники",germanTitle:"Personalpronomen",outcome:"Добирати особові займенники за особою, числом і формою звертання.",className:"Лексика",color:"green"},
  "personal-pronoun-cases":{title:"Особові займенники: Akkusativ і Dativ",germanTitle:"Personalpronomen: Akkusativ und Dativ",outcome:"Добирати особові займенники в Akkusativ і Dativ та розрізняти sie і Sie.",className:"Морфологія",color:"green",level:"A1"},
  possessives:{title:"Присвійні займенники",germanTitle:"Possessivartikel",outcome:"Добирати основу за власником і правильне закінчення присвійного займенника.",className:"Морфологія",color:"orange"},
  "possessive-cases":{title:"Присвійні артиклі: Akkusativ і Dativ",germanTitle:"Possessivartikel: Akkusativ und Dativ",outcome:"Уживати присвійні артиклі в обох відмінках за родом і числом іменника, включно з euer та ввічливим Ihr.",className:"Морфологія",color:"orange",level:"A1"},
  sein:{title:"Дієслово sein — бути",germanTitle:"Das Verb sein",outcome:"Пригадувати всі форми sein у теперішньому часі.",className:"Морфологія",color:"blue"},
  frequency:{title:"Прислівники частотності",germanTitle:"Häufigkeitsadverbien",outcome:"Точно виражати частотність: від immer до nie.",className:"Лексика",color:"orange"},
  "local-prepositions":{title:"Прийменники місця: Dativ і Akkusativ",germanTitle:"Wechselpräpositionen: Dativ und Akkusativ",outcome:"Добирати Dativ для місця та Akkusativ для напрямку руху.",className:"Граматика",color:"blue"},
  "time-expressions":{title:"Часові вирази",germanTitle:"Zeitangaben",outcome:"Добирати часові вирази й називати час у розмові.",className:"Граматика",color:"purple"},
  "time-worksheet-vocabulary":{title:"Пори року й розпорядок дня",germanTitle:"Jahreszeiten und Tagesablauf",outcome:"Уживати лексику про пори року та розпорядок дня в контексті.",className:"Лексика",color:"green"},
  "everyday-vocabulary":{title:"Повсякденна лексика",germanTitle:"Alltagswortschatz",outcome:"Уживати поширені слова про щоденні справи, їжу та напої.",className:"Лексика",color:"orange"},
  "travel-transport":{title:"Подорожі й транспорт",germanTitle:"Reisen und Verkehrsmittel",outcome:"Говорити німецькою про транспорт, маршрути й дії під час подорожі.",className:"Лексика",color:"orange"},
  "giving-directions":{title:"Як пояснити дорогу",germanTitle:"Den Weg beschreiben",outcome:"Пояснювати прості маршрути й розташування знайомих місць у місті.",className:"Лексика",color:"blue",level:"A1"},
  "dative-verbs":{title:"Дієслова з Dativ",germanTitle:"Verben mit Dativ",outcome:"Пригадувати 16 дієслів і вживати їхні форми теперішнього часу з додатками в Dativ.",className:"Лексика",color:"green",level:"A2"},
  "es-gibt-leisure":{title:"Місто й дозвілля: es gibt",germanTitle:"Stadt und Freizeit: es gibt",outcome:"Описувати місця, заняття й можливості для дозвілля в місті.",className:"Граматика",color:"purple"}
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
  "PERSONAL PRONOUN":"Особовий займенник","PERSONALPRONOMEN":"Особові займенники",
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
  "HAUPTSATZ":"Головне речення","NEBENSATZ":"Підрядне речення","NICHT TRENNBAR":"Невідокремлюваний префікс"
};
function categoryLabel(category){
  return category.split(" · ").map(part=>categoryLabels[part]||part).join(" · ");
}
const exerciseLabels={recall:"Пригадування",cloze:"Пропуск","sentence-build":"Побудова речення"};
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
  Object.entries(value.recentVariants||{}).forEach(([sequenceId,ids])=>{state.recentVariants[sequenceId]=uniqueStrings(ids).slice(-100)});
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
    merged.recentVariants[sequenceId]=[...new Set([...(ids||[]),...(merged.recentVariants[sequenceId]||[])])].slice(-100);
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
    definition.catalog=lessonCatalog[lessonId]||{title:definition.title,outcome:definition.tip,className:"Практика",color:"purple"};
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
  if(card.practiceVariants===false||card.type==="sentence-build")return null;
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
    exampleTranslation:"Доповніть речення німецькою.",
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
  learningState.recentVariants[stage.id]=[...recent,...shuffled.map(card=>card.id)].slice(-100);
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
  if(stage.requiresFullCoverage&&progressTargets(lessonId,stage).size<new Set(stageTargetIds(stage)).size)return false;
  return completed.includes(stage.id)||completed.includes(stage.progressId)||Boolean(legacy?.every(id=>completed.includes(id)));
}

function stageCoverage(stage){
  const targetIds=new Set(stageTargetIds(stage));
  const covered=[...progressTargets(activeDeckId,stage)].filter(targetId=>targetIds.has(targetId)).length,total=targetIds.size;
  return {covered,total};
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
  if(card.response.scope==="sentence")return ["Напишіть повне речення німецькою","Повне речення німецькою..."];
  if(card.response.scope==="phrase")return ["Напишіть вираз німецькою","Вираз німецькою..."];
  return ["Напишіть відповідь німецькою","Відповідь німецькою..."];
}

function practicePromptParts(prompt){
  const match=prompt.match(/^(.*(?:\bvon|:))\s+(.+?)([.?!])?$/u);
  return match?{instruction:match[1],target:match[2]}:null;
}

function renderPracticePrompt(card){
  const prompt=$("question-word"),parts=practicePromptParts(card.promptText);
  if(!parts){
    prompt.textContent=card.promptText;
    return;
  }
  const instruction=document.createElement("span"),target=document.createElement("span");
  instruction.className="practice-prompt-instruction";
  instruction.textContent=parts.instruction;
  target.className="practice-prompt-target";
  target.textContent=parts.target;
  prompt.replaceChildren(instruction,target);
}

function feedbackExample(card){
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
  return `Пов’яжіть значення «${card.translation}» з відповіддю «${card.response.accepted[0]}».`;
}

function feedbackOutcome(card,wasCorrect){
  const answer=card.response.accepted[0];
  if(wasCorrect)return {tone:"correct",title:`Правильно — ${answer}`,detail:""};
  return {tone:"incorrect",title:`Не зовсім — ${answer}`,detail:feedbackExplanation(card)};
}

function locationScene(card){
  if(activeDeckId!=="local-prepositions")return null;
  const id=card.targetId;
  const motion=id.includes("accusative")||["local-contrast-vase","local-contrast-picture","local-contrast-key","local-contrast-sofa"].includes(id);
  if(id.includes("schublade"))return {kind:"drawer",motion};
  if(id.includes("wand")||id.includes("picture"))return {kind:"wall",motion};
  if(id==="local-dative-auf-tisch")return {kind:"newspaper",motion};
  if(id.includes("tisch")||id.includes("vase"))return {kind:"table",motion};
  if(id.includes("bett"))return {kind:"bed",motion};
  if(id.includes("stuhl"))return {kind:"chair",motion};
  if(id.includes("vor-haus"))return {kind:"house-front",motion};
  if(id.includes("hinter-haus"))return {kind:"house-behind",motion};
  if(id.includes("studentin"))return {kind:"people",motion};
  if(id.includes("fenster"))return {kind:"windows",motion};
  if(id.includes("key"))return {kind:"bag",motion};
  if(id.includes("sofa"))return {kind:"sofa",motion};
  return null;
}

function renderLocationIllustration(card){
  const figure=$("location-illustration"),art=$("location-illustration-art"),scene=locationScene(card);
  if(!scene){
    figure.hidden=true;
    $("flashcard").classList.remove("illustrated-card");
    return;
  }
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
  art.innerHTML=`<title>Ілюстрація просторового розташування</title><rect width="240" height="128" rx="18" class="scene-background"/>${scenes[scene.kind]}`;
  figure.hidden=false;
  $("flashcard").classList.add("illustrated-card");
}

function practiceSupport(card){
  if(activeDeckId!=="local-prepositions")return {label:"Контекст",text:card.support||""};
  const scene=locationScene(card);
  if(!scene)return {label:"Підказка за значенням",text:card.translation||""};
  const baseNouns={
    drawer:"die Schublade",
    wall:"die Wand",
    newspaper:"der Tisch",
    table:"der Tisch",
    bed:"das Bett",
    chair:"der Stuhl",
    "house-front":"das Haus",
    "house-behind":"das Haus",
    people:"die Studentin",
    windows:"die Fenster (Plural)",
    bag:"die Tasche",
    sofa:"das Sofa"
  };
  return {
    label:`${scene.motion?"Wohin?":"Wo?"} · значення й іменник`,
    text:`${card.translation} · ${baseNouns[scene.kind]}`
  };
}

function render(focusTarget=""){
  const card=deck[index],definition=activeDefinition(),stage=activeStage(),session=learningState.activeSession;
  if(!card)return;
  const revealed=verified||answerRevealed,expected=card.response.accepted[0],[inputLabel,inputPlaceholder]=inputCopy(card);
  const example=feedbackExample(card);
  const feedbackVisible=verificationMode&&revealed;
  const exampleTranslation=feedbackVisible?example.translation:(card.exampleTranslation||card.translation);
  const meaningTranslation=verificationMode?card.translation:(card.studyTranslation||card.translation);
  const separateMeaning=Boolean(translationKey(meaningTranslation))&&translationKey(meaningTranslation)!==translationKey(exampleTranslation);
  const support=verificationMode?practiceSupport(card):{label:"",text:""};
  if(!feedbackVisible){
    $("verification-feedback").textContent="";
    $("verification-feedback").className="verification-feedback";
  }
  renderLessonPath();
  renderDeckGuide(card);
  renderLocationIllustration(card);
  if(verificationMode)renderPracticePrompt(card);
  else $("question-word").textContent=card.word;
  $("translation").textContent=verificationMode?(revealed?"Ваша відповідь німецькою":inputLabel):meaningTranslation;
  $("translation").hidden=verificationMode||!separateMeaning;
  $("prompt-support").dataset.label=support.label;
  $("prompt-support").textContent=support.text;
  $("prompt-support").hidden=!support.text;
  $("original-question-text").textContent=card.promptText;
  $("original-question").hidden=true;
  const category=verificationMode&&!revealed?(stage.categoryBeforeCheck||card.category):card.category;
  $("category-label").textContent=`${categoryLabel(category)} · ${exerciseLabels[card.type]}`;
  const location=locationScene(card);
  $("w-badge").textContent=location?(location.motion?"Wohin?":"Wo?"):"";
  $("w-badge").hidden=!location;
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
  $("example").textContent=verificationMode&&revealed?example.text:(card.example||card.word);
  $("example-translation").textContent=exampleTranslation;
  $("example-translation").hidden=!translationKey(exampleTranslation);
  $("feedback-context").open=!verificationMode||answerRevealed;
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
  $("lesson-step-count").textContent=`План уроку · завершено ${doneCount} з ${counted(stages.length,"етапу","етапів","етапів")}`;
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
  const rules=guide.rules.map(rule=>{
    if(typeof rule==="string")return safeGuideText(rule)||null;
    const title=safeGuideText(rule.title);
    if(!title)return null;
    return {...rule,title,detail:safeGuideText(rule.detail),formula:rule.formula?safeGuideText(rule.formula):""};
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
    else{
      const title=document.createElement("strong"),detail=document.createElement("span");
      title.className="guide-rule-title";title.textContent=rule.title;
      detail.className="guide-rule-detail";detail.textContent=rule.detail;
      text.append(title,detail);
      if(rule.formula){const formula=document.createElement("span");formula.className="guide-rule-formula";formula.textContent=rule.formula;text.append(formula)}
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
  $("completion-stats").textContent=stage.mode==="input"?`Точність перших відповідей: ${session.firstAttemptTotal?Math.round(session.firstAttemptCorrect/session.firstAttemptTotal*100):0}% · засвоєно ${coverage.covered} з ${coverage.total}`:`Переглянуто ${coverage.covered} з ${coverage.total}`;
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

function renderLibrary(){
  $("library-total").textContent=counted(Object.keys(deckDefinitions).length,"урок","уроки","уроків");
  $("section-grid").replaceChildren(...Object.entries(deckDefinitions).map(([lessonId,definition])=>{
    const status=lessonStatus(lessonId),catalog=definition.catalog;
    const article=document.createElement("article");article.className="library-section featured";
    const top=document.createElement("div");top.className="section-card-top";
    const icon=document.createElement("span");icon.className=`section-icon ${catalog.color}`;icon.textContent=definition.badge;
    const badge=document.createElement("span");badge.className=`status-badge ${status.key}`;badge.textContent=status.label;
    top.append(icon,badge);
    const title=document.createElement("h3");title.textContent=definition.title;
    const outcome=document.createElement("p");outcome.textContent=catalog.outcome;
    const meta=document.createElement("div");meta.className="section-meta";
    const sequences=document.createElement("span");sequences.textContent=counted(definition.stages.length,"етап","етапи","етапів");
    const classification=document.createElement("span");classification.textContent=catalog.className;
    const level=document.createElement("span");level.textContent=catalog.level||"A1";
    meta.append(sequences,level,classification);
    const button=document.createElement("button");button.type="button";button.className="primary-button";button.innerHTML=`<span>${actionLabel(lessonId)}</span><span aria-hidden="true">→</span>`;
    button.addEventListener("click",()=>{if(selectDeck(lessonId))showView("practice")});
    article.append(...[top,title,germanTitleElement(definition),outcome,meta,button].filter(Boolean));
    return article;
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
    accuracy.textContent=accuracyValue===null?"—":`${accuracyValue}%`;accuracyLabel.textContent="точність перших відповідей";attempts.textContent=lesson.firstAttempts?counted(lesson.firstAttempts,"перша відповідь","перші відповіді","перших відповідей"):"Відповідей у практиці ще немає";details.append(accuracy,accuracyLabel,attempts);
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

resumeInitialSession();
renderAll();
restorePendingCompletion();
if(compatibilityError)showPersistenceError(compatibilityError);
restoreState();
})();
