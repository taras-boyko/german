(function(){
"use strict";

const STATE_VERSION=4;
const PASS_SIZE=7;
const stateStorageKey="german-learning-state-v4";
const previousStateStorageKey="german-learning-state-v3";
const deviceStorageKey="german-learning-device-id";
const writerStorageKey="german-learning-writer-id";
const historyEndpoint="/api/lesson-history";
const $=id=>document.getElementById(id);
const lessonCatalog={
  "w-questions":{outcome:"Choose and produce the right German question word.",className:"Vocabulary recall",color:"purple"},
  conjugation:{outcome:"Apply regular present-tense endings and spelling rules.",className:"Morphology",color:"orange"},
  "strong-verbs":{outcome:"Produce strong-verb forms accurately in context.",className:"Morphology",color:"blue"},
  "past-verbs":{outcome:"Recall A1 Präteritum forms and their paired Perfekt forms from the qualification sheet.",className:"Morphology",color:"purple",level:"A1"},
  "past-verbs-a2":{outcome:"Recall the A2 Präteritum and Perfekt forms from the qualification sheet.",className:"Morphology",color:"orange",level:"A2"},
  "past-verbs-b1":{outcome:"Recall the B1 Präteritum and Perfekt forms from the qualification sheet.",className:"Morphology",color:"blue",level:"B1"},
  perfekt:{outcome:"Build Perfekt with the right auxiliary and Partizip II pattern.",className:"Morphology",color:"green"},
  "present-practice":{outcome:"Retrieve present-tense forms from context and meaning.",className:"Morphology",color:"green"},
  koennen:{outcome:"Use können, mögen, and möchten in useful sentences.",className:"Grammar choice",color:"blue"},
  haben:{outcome:"Distinguish having, receiving, and needing.",className:"Grammar choice",color:"green"},
  "word-order":{outcome:"Build statements and questions with reliable word order.",className:"Sentence structure",color:"blue"},
  "separable-verbs":{outcome:"Place separable prefixes correctly across sentence types.",className:"Sentence structure",color:"purple"},
  pronouns:{outcome:"Retrieve personal pronouns by person and register.",className:"Vocabulary recall",color:"green"},
  possessives:{outcome:"Choose the owner stem and the correct possessive ending.",className:"Morphology",color:"orange"},
  sein:{outcome:"Retrieve every present-tense form of sein.",className:"Morphology",color:"blue"},
  frequency:{outcome:"Express frequency precisely from immer to nie.",className:"Vocabulary recall",color:"orange"},
  "time-expressions":{outcome:"Choose time expressions and produce spoken clock times.",className:"Grammar choice",color:"purple"},
  "time-worksheet-vocabulary":{outcome:"Use seasonal and daily-routine vocabulary in context.",className:"Vocabulary recall",color:"green"},
  "everyday-vocabulary":{outcome:"Use common routine, food, and drink vocabulary.",className:"Vocabulary recall",color:"orange"},
  "travel-transport":{outcome:"Navigate transport, routes, and travel actions in German.",className:"Vocabulary recall",color:"orange"},
  "es-gibt-leisure":{outcome:"Describe places, activities, and what a town offers.",className:"Grammar choice",color:"purple"}
};
const legacySequenceAliases={
  "w-questions":{"w-questions:learn":["w-basics-learn","w-place-learn","w-time-learn"]},
  pronouns:{"pronouns:learn":["pronouns-singular-learn","pronouns-plural-learn"]},
  sein:{"sein:learn":["sein-singular-learn","sein-plural-learn"]}
};

function emptyState(){
  return {version:STATE_VERSION,lessons:{},activeSession:null,activeSessionUpdatedAt:null,pendingCompletion:null,pendingCompletionUpdatedAt:null,pendingCompletions:{},resolvedCompletions:{},recentVariants:{},lastPasses:{},activityByDate:{},baseline:{lessons:{},activityByDate:{}},deviceContributions:{}};
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
    const saved=JSON.parse(localStorage.getItem(stateStorageKey)||localStorage.getItem(previousStateStorageKey)||"null");
    if(Number(saved?.version)>STATE_VERSION){
      compatibilityError=`Your local progress uses version ${saved.version}, which this app cannot safely change. Update the app before studying.`;
      return emptyState();
    }
    return saved?.version===STATE_VERSION?normalizeState(saved):migrateLegacyState();
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
    if(syncFailureCount>=2)showPersistenceError("Progress is saved on this device; disk sync is temporarily unavailable.");
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
      compatibilityError=`Disk progress uses version ${payload.version}, which this app cannot safely change. Update the app before studying.`;
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
  if(card.allowIndividualOption===true)return expected.split(/\s*\/\s*/).filter(Boolean);
  return [expected];
}

function decorateDefinitions(){
  Object.entries(deckDefinitions).forEach(([lessonId,definition])=>{
    definition.id=lessonId;
    definition.catalog=lessonCatalog[lessonId]||{outcome:definition.tip,className:"Practice",color:"purple"};
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
  const expected=card.response.accepted[0].replace(/[?!.,]+$/,"");
  if(!sentence||!expected)return null;
  const occurrence=standaloneOccurrence(sentence,expected);
  if(!occurrence)return null;
  return {
    ...card,
    id:`${card.targetId}:context:${stableHash(`${sentence}\u0000${expected}`)}`,
    type:"cloze",
    promptText:`${sentence.slice(0,occurrence.start)}___${sentence.slice(occurrence.end)}`,
    exampleTranslation:"Complete the German sentence.",
    response:{...card.response,scope:expected.includes(" ")?"phrase":"word",accepted:[expected]}
  };
}

function contextualRecallVariant(card){
  if(card.practiceVariants===false||card.type!=="recall"||!card.exampleTranslation)return null;
  return {
    ...card,
    id:`${card.targetId}:context-recall:${stableHash(card.exampleTranslation)}`,
    promptText:card.translation,
    support:card.exampleTranslation
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
  return completed.includes(stage.id)||completed.includes(stage.progressId)||Boolean(legacy?.every(id=>completed.includes(id)));
}

function stageCoverage(stage){
  const covered=progressTargets(activeDeckId,stage).size,total=new Set(stageTargetIds(stage)).size;
  return {covered,total};
}

function recommendedStageIndex(lessonId){
  const definition=deckDefinitions[lessonId];
  const active=learningState.activeSession;
  if(active?.lessonId===lessonId){
    const resumed=definition.stages.findIndex(stage=>stage.id===active.sequenceId);
    if(resumed>=0)return resumed;
  }
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
  if(!forceNew&&canResume(activeDeckId,activeStage()))restoreSession();
  else createSession();
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
  if(!confirmSessionReplacement(activeDeckId,stage))return;
  activeStageIndex=stageIndex;
  startStageAttempt(forceNew);
  render(focusTarget);
}

function selectDeck(lessonId,stageId="",forceNew=false){
  const stages=deckDefinitions[lessonId].stages;
  const requested=stageId?stages.findIndex(stage=>stage.id===stageId):-1;
  const stageIndex=requested>=0?requested:recommendedStageIndex(lessonId);
  if(!confirmSessionReplacement(lessonId,stages[stageIndex]))return false;
  activeDeckId=lessonId;
  activeStageIndex=stageIndex;
  startStageAttempt(forceNew);
  $("deck-guide-disclosure").open=false;
  render("flashcard");
  return true;
}

function confirmSessionReplacement(lessonId,stage){
  const session=learningState.activeSession;
  if(!session||session.lessonId===lessonId&&session.sequenceId===stage.id)return true;
  const hasProgress=(Number(session.index)||0)>0||Object.keys(session.cardStatus||{}).length>0||Object.keys(session.cardInputs||{}).length>0||(session.retryQueue||[]).length>0;
  if(!hasProgress)return true;
  const currentLesson=deckDefinitions[session.lessonId]?.title||"current lesson";
  return window.confirm(`Start “${stage.title}”? Your in-progress ${currentLesson} pass and its retry queue will be discarded.`);
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
    if(!$("practice-view").classList.contains("hidden"))selectDeck(activeDeckId,"",true);
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
  let normalized=value.normalize("NFKC").trim().replace(/[⁄∕／]/g,"/").replace(/\s+/g," ");
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
  if(card.response.scope==="sentence")return ["Write the complete German sentence","Type the complete German sentence..."];
  if(card.response.scope==="phrase")return ["Write the German phrase","Type the German phrase..."];
  return ["Write the German answer","Type the German answer..."];
}

function feedbackExample(card){
  if(card.type==="recall")return {label:card.exampleLabel||"Example in context",text:card.example||card.word,translation:card.exampleTranslation||card.translation};
  if(/[.?!]$/.test(card.word.trim()))return {label:"Correct sentence",text:card.word,translation:card.translation};
  if(card.example&&!card.example.includes("___"))return {label:card.exampleLabel||"Example in context",text:card.example,translation:card.exampleTranslation||card.translation};
  return {label:"Correct answer",text:card.response.accepted[0],translation:card.translation};
}

function feedbackExplanation(card){
  if(card.explanation)return card.explanation;
  if(card.type==="cloze")return "Use the sentence context to identify the required German form.";
  if(card.type==="sentence-build")return "Rebuild the sentence with the required German word order.";
  return `Connect “${card.translation}” with “${card.response.accepted[0]}”.`;
}

function feedbackOutcome(card,wasCorrect){
  const answer=card.response.accepted[0];
  if(wasCorrect)return {tone:"correct",title:`Correct — ${answer}`,detail:"Your recall is on target."};
  return {tone:"incorrect",title:`Not quite — ${answer}`,detail:"Compare your answer with the correction below, then try this target again."};
}

function render(focusTarget=""){
  const card=deck[index],definition=activeDefinition(),stage=activeStage(),session=learningState.activeSession;
  if(!card)return;
  const revealed=verified||answerRevealed,expected=card.response.accepted[0],[inputLabel,inputPlaceholder]=inputCopy(card);
  const example=feedbackExample(card);
  const feedbackVisible=verificationMode&&revealed;
  const support=verificationMode?card.support||"":"";
  renderLessonPath();
  renderDeckGuide();
  $("question-word").textContent=verificationMode?card.promptText:card.word;
  $("translation").textContent=verificationMode?(revealed?"Your German recall":inputLabel):(card.studyTranslation||card.translation);
  $("prompt-support").textContent=support;
  $("prompt-support").hidden=!support;
  $("original-question-text").textContent=card.promptText;
  $("original-question").hidden=true;
  $("category-label").textContent=`${card.category} · ${card.type.replace("-"," ").toUpperCase()}`;
  $("w-badge").textContent=definition.badge;
  $("study-tip").textContent=definition.tip;
  $("feedback-outcome").hidden=!feedbackVisible;
  $("feedback-outcome").className=`feedback-outcome ${verified?"correct":"incorrect"}`;
  if(feedbackVisible){
    const outcome=feedbackOutcome(card,verified);
    $("feedback-title").textContent=outcome.title;
    $("feedback-detail").textContent=outcome.detail;
  }
  $("example-label").textContent=verificationMode&&revealed?example.label:(card.exampleLabel||"Example sentence");
  $("example").textContent=verificationMode&&revealed?example.text:(card.example||card.word);
  $("example-translation").textContent=verificationMode&&revealed?example.translation:(card.exampleTranslation||card.translation);
  $("feedback-context").open=!verificationMode;
  $("practice-portion").hidden=false;
  $("new-practice-portion").innerHTML='New pass <span aria-hidden="true">↻</span>';
  const coverage=stageCoverage(stage);
  $("practice-portion-note").textContent=`${deck.length}-card pass · ${coverage.covered}/${coverage.total} targets ${verificationMode?"mastered":"seen"}`;
  $("remaining").textContent=Math.max(deck.length-index-1,0);
  $("session-progress-label").textContent=`Card ${index+1} of ${deck.length}`;
  $("session-progress").style.width=`${Math.min((index+(revealed||!verificationMode?1:0))/deck.length*100,100)}%`;
  $("session-progress").parentElement.setAttribute("aria-valuemax",String(deck.length));
  $("session-progress").parentElement.setAttribute("aria-valuenow",String(index));
  $("deck-label").textContent=definition.label;
  document.querySelector(".nav-count").textContent=String(deck.length);
  $("verification-label").textContent=inputLabel;
  $("verification-label").hidden=answerRevealed;
  $("verification-input").placeholder=inputPlaceholder;
  $("verification-input").hidden=answerRevealed;
  $("verification-input").readOnly=revealed;
  $("flashcard").classList.toggle("flipped",!verificationMode||revealed);
  $("flashcard").classList.toggle("retry-card",Boolean(card.retry));
  $("flashcard").classList.toggle("long-prompt",verificationMode&&card.promptText.length>42);
  $("answer").style.display=verificationMode&&revealed?"block":verificationMode?"none":"";
  $("verification-panel").classList.toggle("visible",verificationMode);
  $("study-actions").classList.toggle("hidden",verificationMode);
  $("continue-button").innerHTML='Next card <span>→</span>';
  $("flip-hint").hidden=!verificationMode||revealed;
  $("flip-hint").innerHTML=verificationMode?(revealed?'<span>→</span> Press Enter for next card':'<span>✓</span> Type the answer and press Enter'):"";
  $("check-button").textContent=revealed?"Next card":"Check answer";
  $("correction-display").hidden=!answerRevealed;
  $("verification-input").value=revealed?(session?.cardInputs?.[String(index)]||expected):"";
  if(answerRevealed)renderCorrection($("verification-input").value,expected,card.response);else $("correction-text").replaceChildren();
  $("verification-feedback").hidden=feedbackVisible;
  $("feedback-explanation").hidden=!answerRevealed;
  $("feedback-explanation").textContent=answerRevealed?feedbackExplanation(card):"";
  const firstTotal=session?.firstAttemptTotal||0,firstCorrect=session?.firstAttemptCorrect||0;
  $("accuracy-rate").textContent=`${firstTotal?Math.round(firstCorrect/firstTotal*100):0}%`;
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

function renderLessonPath(){
  const stages=activeDefinition().stages,chapters=lessonChapters(stages),current=activeStage();
  const doneCount=stages.filter(stage=>stageIsComplete(activeDeckId,stage)).length;
  const activeChapterIndex=chapters.findIndex(chapter=>chapter.steps.some(step=>step.stageIndex===activeStageIndex));
  $("lesson-chapter-label").textContent=current.chapter||current.title;
  $("lesson-phase-label").textContent=current.phase||(current.mode==="input"?"Practice":"Learn");
  $("lesson-path-title").textContent=current.title;
  $("stage-objective").textContent=current.objective;
  $("lesson-step-count").textContent=`Chapter ${activeChapterIndex+1} of ${chapters.length} · ${doneCount}/${stages.length} sequences complete`;
  $("lesson-steps").replaceChildren(...chapters.map((chapter,chapterIndex)=>{
    const item=document.createElement("li"),isComplete=chapter.steps.every(step=>stageIsComplete(activeDeckId,step.stage));
    item.className=`journey-chapter${chapterIndex===activeChapterIndex?" active":""}${isComplete?" complete":""}`;
    item.style.setProperty("--steps",String(chapter.steps.length));
    const head=document.createElement("div");head.className="chapter-head";
    const marker=document.createElement("span");marker.className="chapter-marker";marker.textContent=isComplete?"✓":String(chapterIndex+1);
    const name=document.createElement("span");name.className="chapter-name";name.textContent=chapter.name;
    head.append(marker,name);
    const phases=document.createElement("div");phases.className="chapter-phases";
    phases.append(...chapter.steps.map(({stage,stageIndex})=>{
      const button=document.createElement("button"),done=stageIsComplete(activeDeckId,stage);
      button.type="button";
      button.className=`phase${stageIndex===activeStageIndex?" current":""}${done?" done":""}`;
      button.textContent=stage.phase||(stage.mode==="input"?"Practice":"Learn");
      button.setAttribute("aria-current",stageIndex===activeStageIndex?"step":"false");
      button.setAttribute("aria-label",`${chapter.name} · ${stage.title}${done?" (completed)":""}`);
      button.addEventListener("click",()=>selectStage(stageIndex));
      return button;
    }));
    item.append(head,phases);
    return item;
  }));
}

function renderDeckGuide(){
  const guide=activeDefinition().guide;
  $("deck-guide").hidden=!guide;
  if(!guide)return;
  $("deck-guide-title").textContent=guide.title;
  $("deck-guide-intro").textContent=guide.intro;
  $("deck-guide-count").textContent=`${guide.rules.length} rules`;
  $("deck-guide-toggle-label").textContent=$("deck-guide-disclosure").open?"Hide rules":"Show rules";
  $("deck-guide-rules").replaceChildren(...guide.rules.map((rule,index)=>{
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
    $("verification-feedback").textContent="Type an answer first.";
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
    $("verification-feedback").textContent=card.retry?"Correct — repaired and mastered.":"Correct.";
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
    $("verification-feedback").textContent="Not quite. Review the correction; this target will return shortly.";
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
  $("celebration-title").textContent=stageComplete?(stage.mode==="input"?"Sequence mastered!":"Learning sequence complete!"):"Pass complete";
  $("celebration-message").textContent=stageComplete?`${stage.title} is complete.`:`You covered ${session.passTargetIds.length} targets. Continue for the remaining ${coverage.total-coverage.covered}.`;
  $("completion-stats").textContent=stage.mode==="input"?`First-pass accuracy: ${session.firstAttemptTotal?Math.round(session.firstAttemptCorrect/session.firstAttemptTotal*100):0}% · ${coverage.covered}/${coverage.total} targets mastered`:`${coverage.covered}/${coverage.total} targets seen`;
  const nextIndex=activeStageIndex+1,nextStage=activeDefinition().stages[nextIndex];
  if(!stageComplete){
    $("completion-primary").textContent="Continue this chapter";
    completionPrimaryAction=()=>selectStage(activeStageIndex,true);
  }else if(nextStage){
    $("completion-primary").textContent=nextStage.mode==="input"?"Practice now":"Continue to next chapter";
    completionPrimaryAction=()=>selectStage(nextIndex,true);
  }else{
    $("completion-primary").textContent="Return to library";
    completionPrimaryAction=()=>showView("library");
  }
  $("completion-secondary").textContent="Repeat with new examples";
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
  const hasProgress=lesson.completedLearn.length||lesson.masteredPractice.length||lesson.attempts||hasTargetProgress||learningState.activeSession?.lessonId===lessonId||hasPendingCompletionForLesson(lessonId);
  if(!hasProgress)return {key:"new",label:"Not started"};
  if(allMastered&&Date.parse(lesson.dueAt||"")<=Date.now())return {key:"due",label:"Due"};
  if(allMastered)return {key:"mastered",label:"Mastered"};
  if(allLearned&&practiceStages.length)return {key:"ready",label:"Ready to practice"};
  return {key:"learning",label:"Learning"};
}

function actionLabel(lessonId){
  const status=lessonStatus(lessonId);
  if(learningState.activeSession?.lessonId===lessonId)return "Resume";
  if(status.key==="due")return "Review now";
  if(status.key==="mastered")return "Review lesson";
  if(status.key==="ready")return "Practice now";
  if(status.key==="learning")return "Continue";
  return deckDefinitions[lessonId].stages[0].mode==="input"?"Start practice":"Start learning";
}

function renderLibrary(){
  $("library-total").textContent=`${Object.keys(deckDefinitions).length} active lessons`;
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
    const sequences=document.createElement("span");sequences.textContent=`${definition.stages.length} sequence${definition.stages.length===1?"":"s"}`;
    const classification=document.createElement("span");classification.textContent=catalog.className;
    meta.append(sequences,classification);
    const button=document.createElement("button");button.type="button";button.className="primary-button";button.innerHTML=`<span>${actionLabel(lessonId)}</span><span aria-hidden="true">→</span>`;
    button.addEventListener("click",()=>{if(selectDeck(lessonId))showView("practice")});
    article.append(top,title,outcome,meta,button);
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
  if(!timestamp)return "Not practiced yet";
  const elapsed=Math.max(0,Date.now()-Date.parse(timestamp)),minutes=Math.floor(elapsed/60000);
  if(minutes<1)return "Just now";
  if(minutes<60)return `${minutes}m ago`;
  const hours=Math.floor(minutes/60);
  if(hours<24)return `${hours}h ago`;
  return `${Math.floor(hours/24)}d ago`;
}

function reviewStage(lessonId){
  const definition=deckDefinitions[lessonId];
  return definition.stages.find(stage=>stage.mode==="input"&&!stageIsComplete(lessonId,stage))||definition.stages.find(stage=>stage.mode==="input")||definition.stages[0];
}

function reviewLesson(lessonId){
  const stage=reviewStage(lessonId);
  if(selectDeck(lessonId,stage.id,true))showView("practice");
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
  $("progress-reviewed").textContent=String(summary.weekly);
  const recommended=recommendedLesson(),definition=deckDefinitions[recommended.id];
  $("lesson-history-note").textContent=summary.firstAttempts?"Based on first attempts":"Tracking begins with your first practice answer";
  $("review-focus-button").textContent=recommended.status.key==="new"?`Start ${definition.title} →`:`Review ${definition.title} →`;
  $("review-focus-message").textContent=recommended.status.key==="due"?`${definition.title} is due. A short varied retrieval pass will strengthen retention.`:recommended.status.key==="new"?`Start ${definition.title} to build your next skill through examples and retrieval.`:`${definition.title} is the most useful next practice based on first-attempt accuracy and recency.`;
  $("review-focus-button").onclick=()=>reviewLesson(recommended.id);
  const sorted=Object.keys(deckDefinitions).sort((a,b)=>{
    const priority={due:0,ready:1,learning:2,new:3,mastered:4};
    return priority[lessonStatus(a).key]-priority[lessonStatus(b).key];
  });
  $("lesson-progress-list").replaceChildren(...sorted.map(lessonId=>{
    const definition=deckDefinitions[lessonId],lesson=lessonState(lessonId),status=lessonStatus(lessonId),accuracyValue=lessonAccuracy(lesson);
    const item=document.createElement("article");item.className="lesson-progress-card";
    const heading=document.createElement("div"),title=document.createElement("h4"),last=document.createElement("span");
    title.textContent=definition.title;last.className="lesson-last-practice";last.textContent=`${status.label} · ${relativePracticeTime(lesson.lastPracticedAt)}`;heading.append(title,last);
    const details=document.createElement("div");details.className="lesson-progress-details";
    const accuracy=document.createElement("strong"),accuracyLabel=document.createElement("span"),attempts=document.createElement("span");
    accuracy.textContent=accuracyValue===null?"—":`${accuracyValue}%`;accuracyLabel.textContent="first-pass accuracy";attempts.textContent=lesson.firstAttempts?`${lesson.firstAttempts} first attempts`:"No practice answers yet";details.append(accuracy,accuracyLabel,attempts);
    const button=document.createElement("button");button.type="button";button.className="lesson-review-button";button.textContent=status.key==="new"?"Start →":"Practice →";button.addEventListener("click",()=>reviewLesson(lessonId));
    item.append(heading,details,button);
    return item;
  }));
}

function updateStats(){
  const summary=activitySummary(),accuracy=summary.firstAttempts?Math.round(summary.correct/summary.firstAttempts*100):0;
  $("streak").textContent=String(summary.streak);
  $("overview-streak").textContent=String(summary.streak);
  $("weekly-reviewed").innerHTML=`${summary.weekly} <small>this week</small>`;
  const max=Math.max(...summary.counts,1);
  document.querySelectorAll(".bar[data-day]").forEach((bar,index)=>{bar.style.height=`${Math.max(8,summary.counts[index]/max*82)}%`;bar.classList.toggle("today",index===6)});
  if(!learningState.activeSession)$("accuracy-rate").textContent=`${accuracy}%`;
  renderLibrary();
  renderProgress();
}

function updatePageTitle(view){
  $("page-title").textContent=view==="practice"?`${activeStage().mode==="input"?"Practice":"Learn"} ${activeDefinition().title}`:view==="library"?"Card library":"Your progress";
}

function showView(view){
  persistPosition();
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view===view));
  document.querySelectorAll(".view").forEach(element=>element.classList.add("hidden"));
  $(`${view}-view`).classList.remove("hidden");
  updatePageTitle(view);
  if(view==="practice"){
    if(!learningState.activeSession)selectDeck(activeDeckId,"",true);
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

$("bookmark").addEventListener("click",event=>{event.stopPropagation();event.currentTarget.classList.toggle("saved");event.currentTarget.textContent=event.currentTarget.classList.contains("saved")?"♥":"♡"});
$("verification-input").addEventListener("input",event=>{if(verificationMode&&!practiceInputStarted&&event.target.value.trim())practiceInputStarted=true});
$("check-button").addEventListener("click",checkAnswer);
$("continue-button").addEventListener("click",next);
$("new-practice-portion").addEventListener("click",()=>startNewPass());
$("deck-guide-disclosure").addEventListener("toggle",()=>{$("deck-guide-toggle-label").textContent=$("deck-guide-disclosure").open?"Hide rules":"Show rules"});
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
  if(event.target instanceof Element&&event.target.closest("button, a, input, summary, [role='button']"))return;
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
