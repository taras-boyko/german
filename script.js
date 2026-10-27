const cards=[
  {word:"Warum?",translation:"Чому?",category:"QUESTION WORD",filter:"time",example:"Warum fährst du heute mit dem Bus?",exampleTranslation:"Чому ти сьогодні їдеш автобусом?"},
  {word:"Wer?",translation:"Хто?",category:"QUESTION WORD",filter:"basics",example:"Wer ist das?",exampleTranslation:"Хто це?"},
  {word:"Was?",translation:"Що?",category:"QUESTION WORD",filter:"basics",example:"Was machst du heute Abend?",exampleTranslation:"Що ти робиш сьогодні ввечері?"},
  {word:"Wohin?",translation:"Куди?",category:"PLACE & DIRECTION",filter:"place",example:"Wohin fährst du morgen?",exampleTranslation:"Куди ти їдеш завтра?"},
  {word:"Wann?",translation:"Коли?",category:"TIME & REASON",filter:"time",example:"Wann kommst du nach Hause?",exampleTranslation:"Коли ти приходиш додому?"},
  {word:"Wie?",translation:"Як?",category:"QUESTION WORD",filter:"basics",example:"Wie geht es dir?",exampleTranslation:"Як у тебе справи?"},
  {word:"Wo?",translation:"Де?",category:"PLACE & DIRECTION",filter:"place",example:"Wo liegt das Buch?",exampleTranslation:"Де лежить книга?"},
  {word:"Woher?",translation:"Звідки?",category:"PLACE & DIRECTION",filter:"place",example:"Woher kommst du?",exampleTranslation:"Звідки ти?"},
  {word:"Welche?",translation:"Котрий / яка / яке?",category:"QUESTION WORD",filter:"basics",example:"Welche Sprache sprichst du?",exampleTranslation:"Якою мовою ти розмовляєш?"},
  {word:"Wie viele?",translation:"Скільки?",category:"QUESTION WORD",filter:"basics",example:"Wie viele Katzen habt ihr?",exampleTranslation:"Скільки у вас котів?"},
];
const pronounCards=[
  {word:"ich",translation:"я",category:"PERSONAL PRONOUN",example:"Ich lerne Deutsch.",exampleTranslation:"Я вивчаю німецьку."},
  {word:"du",translation:"ти",category:"PERSONAL PRONOUN",example:"Du bist mein Freund.",exampleTranslation:"Ти мій друг."},
  {word:"er",translation:"він",category:"PERSONAL PRONOUN",example:"Er kommt aus Berlin.",exampleTranslation:"Він з Берліна."},
  {word:"sie",translation:"вона",category:"PERSONAL PRONOUN",targetId:"pronoun-feminine-sie",example:"Sie heißt Anna.",exampleTranslation:"Її звати Анна."},
  {word:"es",translation:"воно",category:"PERSONAL PRONOUN",example:"Es ist kalt.",exampleTranslation:"Холодно."},
  {word:"wir",translation:"ми",category:"PERSONAL PRONOUN",example:"Wir wohnen in Kyjiw.",exampleTranslation:"Ми живемо в Києві."},
  {word:"ihr",translation:"ви",category:"PERSONAL PRONOUN",example:"Ihr seid sehr nett.",exampleTranslation:"Ви дуже милі."},
  {word:"Sie",translation:"Ви (ввічливо)",category:"PERSONAL PRONOUN",targetId:"pronoun-formal-sie",example:"Wie heißen Sie?",exampleTranslation:"Як Вас звати?",caseSensitive:true}
];
// Nine persons × Nom. / Akk. / Dat.; the strip shows the card's person and marks its case.
const personalPronounPersons=[
  ["ich","ich (я)","ich mich mir"],
  ["du","du (ти)","du dich dir"],
  ["er","er (він)","er ihn ihm"],
  ["she","sie (вона)","sie sie ihr"],
  ["es","es (воно)","es es ihm"],
  ["wir","wir (ми)","wir uns uns"],
  ["ihr","ihr (ви)","ihr euch euch"],
  ["they","sie (вони)","sie sie ihnen"],
  ["formal","Sie (Ви)","Sie Sie Ihnen"]
];
const personalPronounParadigm={
  title:"Personalpronomen",forms:true,columns:[{label:"Nom.",title:"Nominativ"},{label:"Akk.",title:"Akkusativ"},{label:"Dat.",title:"Dativ"}],
  rows:personalPronounPersons.map(([,title,forms])=>({label:title.split(" ")[0],title,cells:forms.split(" ").map(stem=>({stem,ending:""}))}))
};
const personalPronounCaseTable={
  columns:personalPronounParadigm.columns,
  rows:personalPronounParadigm.rows.map((row,index)=>{
    const person=personalPronounPersons[index][0];
    const gender={er:"masculine",she:"feminine",es:"neuter",they:"plural"}[person];
    return {label:person==="they"?"sie (мн.)":row.label,title:row.title,gender,cells:row.cells.map(({stem})=>stem)};
  }),
  highlights:[{row:2,column:2},{row:4,column:2},{row:5,column:1},{row:5,column:2},{row:6,column:1},{row:6,column:2}],
  note:"Виділено збіги форм між Akkusativ і Dativ: у er та es однаковий Dativ, а у wir та ihr однакові форми обох відмінків."
};
// Each card names its person; the call names the case column.
function withPronounCase(caseLabel,cards){
  const column=personalPronounParadigm.columns.findIndex(({label})=>label===caseLabel);
  return cards.map(card=>{
    const row=personalPronounPersons.findIndex(([key])=>key===card.person);
    if(row<0||column<1)throw new Error(`Unknown pronoun person or case: ${card.id}`);
    return {...card,answerParts:personalPronounParadigm.rows[row].cells[column],paradigm:{...personalPronounParadigm,active:{row,column}}};
  });
}
const personalPronounAccusativeBaseCards=withPronounCase("Akk.",[
  {
    id:"pronoun-accusative-ich-recall",targetId:"pronoun-accusative-ich",person:"ich",type:"recall",word:"mich",translation:"мене · Akkusativ від ich",promptText:"Akkusativ: ich (я)",
    example:"Meine Schwester besucht mich.",exampleTranslation:"Моя сестра відвідує мене.",explanation:"Besuchen вимагає Akkusativ: ich → mich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-ich-see",targetId:"pronoun-accusative-ich",person:"ich",type:"cloze",word:"mich",example:"Paul sieht mich heute.",translation:"Пауль бачить мене сьогодні.",studyTranslation:"ich → mich · мене",promptText:"Paul sieht ___ heute.",support:"Заміни ich (я).",
    explanation:"Sehen вимагає Akkusativ: ich → mich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-ich-call",targetId:"pronoun-accusative-ich",person:"ich",type:"cloze",word:"mich",example:"Rufst du mich morgen an?",translation:"Ти зателефонуєш мені завтра?",studyTranslation:"ich → mich · мене",promptText:"Rufst du ___ morgen an?",support:"Заміни ich (я).",
    explanation:"Anrufen вимагає Akkusativ, хоча українською кажемо «телефонувати кому»: ich → mich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-du-recall",targetId:"pronoun-accusative-du",person:"du",type:"recall",word:"dich",translation:"тебе · Akkusativ від du",promptText:"Akkusativ: du (ти)",
    example:"Ich besuche dich am Abend.",exampleTranslation:"Я відвідаю тебе ввечері.",explanation:"Besuchen вимагає Akkusativ: du → dich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-du-hear",targetId:"pronoun-accusative-du",person:"du",type:"cloze",word:"dich",example:"Ich höre dich nicht.",translation:"Я тебе не чую.",studyTranslation:"du → dich · тебе",promptText:"Ich höre ___ nicht.",support:"Заміни du (ти).",
    explanation:"Hören вимагає Akkusativ: du → dich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-du-for",targetId:"pronoun-accusative-du",person:"du",type:"cloze",word:"dich",example:"Ist das Geschenk für dich?",translation:"Цей подарунок для тебе?",studyTranslation:"du → dich · тебе",promptText:"Ist das Geschenk für ___?",support:"Заміни du (ти).",
    explanation:"Für завжди вимагає Akkusativ: du → dich.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dich"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-er-recall",targetId:"pronoun-accusative-er",person:"er",type:"recall",word:"ihn",translation:"його · Akkusativ від er",promptText:"Akkusativ: er (він)",
    example:"Ich kenne ihn gut.",exampleTranslation:"Я добре його знаю.",explanation:"Kennen вимагає Akkusativ: er → ihn.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihn"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-er-see",targetId:"pronoun-accusative-er",person:"er",type:"cloze",word:"ihn",example:"Wir sehen ihn im Park.",translation:"Ми бачимо його в парку.",studyTranslation:"er → ihn · його",promptText:"Wir sehen ___ im Park.",support:"Заміни er (він).",
    explanation:"Sehen вимагає Akkusativ: er → ihn, а не ihm.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihn"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-er-call",targetId:"pronoun-accusative-er",person:"er",type:"cloze",word:"ihn",example:"Rufst du ihn heute an?",translation:"Ти зателефонуєш йому сьогодні?",studyTranslation:"er → ihn · його",promptText:"Rufst du ___ heute an?",support:"Заміни er (він).",
    explanation:"Anrufen вимагає Akkusativ: er → ihn. Український відмінок не завжди збігається з німецьким.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihn"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-she-recall",targetId:"pronoun-accusative-she",person:"she",type:"recall",word:"sie",translation:"її · Akkusativ від sie (вона)",promptText:"Akkusativ: sie (вона)",
    example:"Wir besuchen sie heute.",exampleTranslation:"Ми відвідаємо її сьогодні.",explanation:"Sie (вона) в Akkusativ залишається sie. Усередині речення це мала літера, на відміну від ввічливого Sie.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-she-know",targetId:"pronoun-accusative-she",person:"she",type:"cloze",word:"sie",example:"Ich kenne sie gut.",translation:"Я добре її знаю.",studyTranslation:"sie (вона) → sie · її",promptText:"Ich kenne ___ gut.",support:"Заміни sie (вона). Зверни увагу на регістр.",
    explanation:"Kennen вимагає Akkusativ: sie (вона) → sie, а не ihr.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-she-for",targetId:"pronoun-accusative-she",person:"she",type:"cloze",word:"sie",example:"Ist der Tee für sie?",translation:"Цей чай для неї?",studyTranslation:"sie (вона) → sie · її",promptText:"Ist der Tee für ___?",support:"Заміни sie (вона). Зверни увагу на регістр.",
    explanation:"Für вимагає Akkusativ: sie (вона) → sie. Ввічливе «Ви» писали б Sie.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-es-recall",targetId:"pronoun-accusative-es",person:"es",type:"recall",word:"es",translation:"його · Akkusativ від es (воно, середній рід)",promptText:"Akkusativ: es (воно)",
    example:"Das Baby schläft. Ich sehe es.",exampleTranslation:"Немовля спить. Я його бачу.",explanation:"Es в Akkusativ не змінюється. Займенник узгоджується з німецьким родом: das Baby → es.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["es"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-es-see",targetId:"pronoun-accusative-es",person:"es",type:"cloze",word:"es",example:"Die Mutter sieht es.",translation:"Мама бачить його (немовля).",studyTranslation:"es → es · його (середній рід)",promptText:"Die Mutter sieht ___.",support:"Заміни es: das Baby (немовля, середній рід).",
    explanation:"Sehen вимагає Akkusativ: es → es, а не ihm.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["es"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-es-photo",targetId:"pronoun-accusative-es",person:"es",type:"cloze",word:"es",example:"Fotografierst du es?",translation:"Ти фотографуєш його (немовля)?",studyTranslation:"es → es · його (середній рід)",promptText:"Fotografierst du ___?",support:"Заміни es: das Baby (немовля, середній рід).",
    explanation:"Fotografieren вимагає Akkusativ: es → es.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["es"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-wir-recall",targetId:"pronoun-accusative-wir",person:"wir",type:"recall",word:"uns",translation:"нас · Akkusativ від wir",promptText:"Akkusativ: wir (ми)",
    example:"Unsere Freunde besuchen uns.",exampleTranslation:"Наші друзі відвідують нас.",explanation:"Besuchen вимагає Akkusativ: wir → uns.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-wir-hear",targetId:"pronoun-accusative-wir",person:"wir",type:"cloze",word:"uns",example:"Der Lehrer hört uns.",translation:"Учитель чує нас.",studyTranslation:"wir → uns · нас",promptText:"Der Lehrer hört ___.",support:"Заміни wir (ми).",
    explanation:"Hören вимагає Akkusativ: wir → uns. Uns має однакову форму в Akkusativ і Dativ.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-wir-for",targetId:"pronoun-accusative-wir",person:"wir",type:"cloze",word:"uns",example:"Ist der Kuchen für uns?",translation:"Цей пиріг для нас?",studyTranslation:"wir → uns · нас",promptText:"Ist der Kuchen für ___?",support:"Заміни wir (ми).",
    explanation:"Für вимагає Akkusativ: wir → uns.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-ihr-recall",targetId:"pronoun-accusative-ihr",person:"ihr",type:"recall",word:"euch",translation:"вас · Akkusativ від ihr (ви, неформально, множина)",promptText:"Akkusativ: ihr (ви, неформально, кілька людей)",
    example:"Ich besuche euch morgen.",exampleTranslation:"Я відвідаю вас завтра.",explanation:"Besuchen вимагає Akkusativ: ihr → euch. Це неформальне звертання до кількох людей.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-ihr-see",targetId:"pronoun-accusative-ihr",person:"ihr",type:"cloze",word:"euch",example:"Wir sehen euch am Bahnhof.",translation:"Ми бачимо вас на вокзалі.",studyTranslation:"ihr → euch · вас (неформально, множина)",promptText:"Wir sehen ___ am Bahnhof.",support:"Заміни ihr (ви, неформально, кілька людей).",
    explanation:"Sehen вимагає Akkusativ: ihr → euch.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-ihr-call",targetId:"pronoun-accusative-ihr",person:"ihr",type:"cloze",word:"euch",example:"Ruft Anna euch heute an?",translation:"Анна зателефонує вам сьогодні?",studyTranslation:"ihr → euch · вас (неформально, множина)",promptText:"Ruft Anna ___ heute an?",support:"Заміни ihr (ви, неформально, кілька людей).",
    explanation:"Anrufen вимагає Akkusativ: ihr → euch.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-they-recall",targetId:"pronoun-accusative-they",person:"they",type:"recall",word:"sie",translation:"їх · Akkusativ від sie (вони)",promptText:"Akkusativ: sie (вони)",
    example:"Ich kenne sie schon.",exampleTranslation:"Я їх уже знаю.",explanation:"Sie (вони) в Akkusativ залишається sie. Усередині речення пишемо малу літеру.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-they-visit",targetId:"pronoun-accusative-they",person:"they",type:"cloze",word:"sie",example:"Wir besuchen sie am Sonntag.",translation:"Ми відвідаємо їх у неділю.",studyTranslation:"sie (вони) → sie · їх",promptText:"Wir besuchen ___ am Sonntag.",support:"Заміни sie (вони). Зверни увагу на регістр.",
    explanation:"Besuchen вимагає Akkusativ: sie (вони) → sie, а не ihnen.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-they-for",targetId:"pronoun-accusative-they",person:"they",type:"cloze",word:"sie",example:"Sind die Bücher für sie?",translation:"Ці книжки для них?",studyTranslation:"sie (вони) → sie · їх",promptText:"Sind die Bücher für ___?",support:"Заміни sie (вони). Зверни увагу на регістр.",
    explanation:"Für вимагає Akkusativ: sie (вони) → sie. Ввічливе «Ви» писали б Sie.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-formal-recall",targetId:"pronoun-accusative-formal",person:"formal",type:"recall",word:"Sie",translation:"Вас · Akkusativ від Sie (Ви, ввічливо)",promptText:"Akkusativ: Sie (Ви, ввічливо)",
    example:"Ich besuche Sie morgen.",exampleTranslation:"Я відвідаю Вас завтра.",explanation:"Ввічливе Sie в Akkusativ залишається Sie й завжди пишеться з великої літери.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-formal-hear",targetId:"pronoun-accusative-formal",person:"formal",type:"cloze",word:"Sie",example:"Ich höre Sie nicht.",translation:"Я Вас не чую.",studyTranslation:"Sie → Sie · Вас (ввічливо)",promptText:"Ich höre ___ nicht.",support:"Заміни Sie (Ви, ввічливо). Зверни увагу на регістр.",
    explanation:"Hören вимагає Akkusativ: Sie → Sie. Мала літера sie означала б «її» або «їх».",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Sie"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-accusative-formal-for",targetId:"pronoun-accusative-formal",person:"formal",type:"cloze",word:"Sie",example:"Ist der Brief für Sie?",translation:"Цей лист для Вас?",studyTranslation:"Sie → Sie · Вас (ввічливо)",promptText:"Ist der Brief für ___?",support:"Заміни Sie (Ви, ввічливо). Зверни увагу на регістр.",
    explanation:"Für вимагає Akkusativ: ввічливе Sie пишемо з великої літери.",category:"PERSONALPRONOMEN · AKKUSATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Sie"],caseSensitive:true,punctuationSensitive:false}
  }
]);
const personalPronounDativeBaseCards=withPronounCase("Dat.",[
  {
    id:"pronoun-dative-ich-recall",targetId:"pronoun-dative-ich",person:"ich",type:"recall",word:"mir",translation:"мені · Dativ від ich",promptText:"Dativ: ich (я)",
    example:"Meine Schwester hilft mir.",exampleTranslation:"Моя сестра допомагає мені.",explanation:"Helfen вимагає Dativ: ich → mir.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-ich-give",targetId:"pronoun-dative-ich",person:"ich",type:"cloze",word:"mir",example:"Paul gibt mir das Buch.",translation:"Пауль дає мені книжку.",studyTranslation:"ich → mir · мені",promptText:"Paul gibt ___ das Buch.",support:"Заміни ich (я): одержувач книжки.",
    explanation:"Одержувач із geben стоїть у Dativ: ich → mir. Das Buch — предмет, який передають, в Akkusativ.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-ich-with",targetId:"pronoun-dative-ich",person:"ich",type:"cloze",word:"mir",example:"Kommst du mit mir?",translation:"Ти підеш зі мною?",studyTranslation:"ich → mir · мені",promptText:"Kommst du mit ___?",support:"Заміни ich (я).",
    explanation:"Mit завжди вимагає Dativ: ich → mir. Українською тут уживаємо орудний відмінок «зі мною».",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["mir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-du-recall",targetId:"pronoun-dative-du",person:"du",type:"recall",word:"dir",translation:"тобі · Dativ від du",promptText:"Dativ: du (ти)",
    example:"Ich helfe dir gern.",exampleTranslation:"Я охоче допомагаю тобі.",explanation:"Helfen вимагає Dativ: du → dir.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-du-thank",targetId:"pronoun-dative-du",person:"du",type:"cloze",word:"dir",example:"Wir danken dir.",translation:"Ми дякуємо тобі.",studyTranslation:"du → dir · тобі",promptText:"Wir danken ___.",support:"Заміни du (ти).",
    explanation:"Danken вимагає Dativ: du → dir.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-du-with",targetId:"pronoun-dative-du",person:"du",type:"cloze",word:"dir",example:"Darf ich mit dir lernen?",translation:"Можна мені вчитися з тобою?",studyTranslation:"du → dir · тобі",promptText:"Darf ich mit ___ lernen?",support:"Заміни du (ти).",
    explanation:"Mit вимагає Dativ: du → dir, а не dich.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["dir"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-er-recall",targetId:"pronoun-dative-er",person:"er",type:"recall",word:"ihm",translation:"йому · Dativ від er",promptText:"Dativ: er (він)",
    example:"Ich helfe ihm heute.",exampleTranslation:"Я допомагаю йому сьогодні.",explanation:"Helfen вимагає Dativ: er → ihm.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-er-give",targetId:"pronoun-dative-er",person:"er",type:"cloze",word:"ihm",example:"Anna gibt ihm den Schlüssel.",translation:"Анна дає йому ключ.",studyTranslation:"er → ihm · йому",promptText:"Anna gibt ___ den Schlüssel.",support:"Заміни er (він): одержувач ключа.",
    explanation:"Одержувач із geben стоїть у Dativ: er → ihm, а не ihn.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-er-with",targetId:"pronoun-dative-er",person:"er",type:"cloze",word:"ihm",example:"Sprichst du mit ihm?",translation:"Ти розмовляєш з ним?",studyTranslation:"er → ihm · йому",promptText:"Sprichst du mit ___?",support:"Заміни er (він).",
    explanation:"Mit вимагає Dativ: er → ihm.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-she-recall",targetId:"pronoun-dative-she",person:"she",type:"recall",word:"ihr",translation:"їй · Dativ від sie (вона)",promptText:"Dativ: sie (вона)",
    example:"Ich helfe ihr gern.",exampleTranslation:"Я охоче допомагаю їй.",explanation:"Helfen вимагає Dativ: sie (вона) → ihr. Не плутай з ihr у Nominativ («ви», неформально).",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihr"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-she-thank",targetId:"pronoun-dative-she",person:"she",type:"cloze",word:"ihr",example:"Wir danken ihr.",translation:"Ми дякуємо їй.",studyTranslation:"sie (вона) → ihr · їй",promptText:"Wir danken ___.",support:"Заміни sie (вона).",
    explanation:"Danken вимагає Dativ: sie (вона) → ihr, а не sie.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihr"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-she-with",targetId:"pronoun-dative-she",person:"she",type:"cloze",word:"ihr",example:"Gehst du mit ihr ins Kino?",translation:"Ти йдеш з нею в кіно?",studyTranslation:"sie (вона) → ihr · їй",promptText:"Gehst du mit ___ ins Kino?",support:"Заміни sie (вона).",
    explanation:"Mit вимагає Dativ: sie (вона) → ihr.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihr"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-es-recall",targetId:"pronoun-dative-es",person:"es",type:"recall",word:"ihm",translation:"йому · Dativ від es (воно, середній рід)",promptText:"Dativ: es (воно)",
    example:"Das Baby weint. Die Mutter gibt ihm Milch.",exampleTranslation:"Немовля плаче. Мама дає йому молоко.",explanation:"Одержувач із geben стоїть у Dativ: es → ihm. Er і es мають однакову форму Dativ.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-es-help",targetId:"pronoun-dative-es",person:"es",type:"cloze",word:"ihm",example:"Der Vater hilft ihm.",translation:"Тато допомагає йому (дитині).",studyTranslation:"es → ihm · йому (середній рід)",promptText:"Der Vater hilft ___.",support:"Заміни es: das Kind (дитина, середній рід).",
    explanation:"Helfen вимагає Dativ: es → ihm. Рід визначає німецький іменник das Kind.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-es-with",targetId:"pronoun-dative-es",person:"es",type:"cloze",word:"ihm",example:"Spielst du mit ihm?",translation:"Ти граєшся з ним (немовлям)?",studyTranslation:"es → ihm · йому (середній рід)",promptText:"Spielst du mit ___?",support:"Заміни es: das Baby (немовля, середній рід).",
    explanation:"Mit вимагає Dativ: es → ihm, а не es.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihm"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-wir-recall",targetId:"pronoun-dative-wir",person:"wir",type:"recall",word:"uns",translation:"нам · Dativ від wir",promptText:"Dativ: wir (ми)",
    example:"Unsere Freunde helfen uns.",exampleTranslation:"Наші друзі допомагають нам.",explanation:"Helfen вимагає Dativ: wir → uns. Форма збігається з Akkusativ.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-wir-give",targetId:"pronoun-dative-wir",person:"wir",type:"cloze",word:"uns",example:"Der Lehrer gibt uns die Bücher.",translation:"Учитель дає нам книжки.",studyTranslation:"wir → uns · нам",promptText:"Der Lehrer gibt ___ die Bücher.",support:"Заміни wir (ми): одержувачі книжок.",
    explanation:"Одержувачі з geben стоять у Dativ: wir → uns.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-wir-with",targetId:"pronoun-dative-wir",person:"wir",type:"cloze",word:"uns",example:"Lernst du mit uns?",translation:"Ти вчишся з нами?",studyTranslation:"wir → uns · нам",promptText:"Lernst du mit ___?",support:"Заміни wir (ми).",
    explanation:"Mit вимагає Dativ: wir → uns.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["uns"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-ihr-recall",targetId:"pronoun-dative-ihr",person:"ihr",type:"recall",word:"euch",translation:"вам · Dativ від ihr (ви, неформально, множина)",promptText:"Dativ: ihr (ви, неформально, кілька людей)",
    example:"Ich helfe euch morgen.",exampleTranslation:"Я допоможу вам завтра.",explanation:"Helfen вимагає Dativ: ihr → euch. Форма збігається з Akkusativ.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-ihr-thank",targetId:"pronoun-dative-ihr",person:"ihr",type:"cloze",word:"euch",example:"Wir danken euch.",translation:"Ми дякуємо вам.",studyTranslation:"ihr → euch · вам (неформально, множина)",promptText:"Wir danken ___.",support:"Заміни ihr (ви, неформально, кілька людей).",
    explanation:"Danken вимагає Dativ: ihr → euch.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-ihr-with",targetId:"pronoun-dative-ihr",person:"ihr",type:"cloze",word:"euch",example:"Darf ich mit euch kommen?",translation:"Можна мені піти з вами?",studyTranslation:"ihr → euch · вам (неформально, множина)",promptText:"Darf ich mit ___ kommen?",support:"Заміни ihr (ви, неформально, кілька людей).",
    explanation:"Mit вимагає Dativ: ihr → euch.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euch"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-they-recall",targetId:"pronoun-dative-they",person:"they",type:"recall",word:"ihnen",translation:"їм · Dativ від sie (вони)",promptText:"Dativ: sie (вони)",
    example:"Ich helfe ihnen heute.",exampleTranslation:"Я допомагаю їм сьогодні.",explanation:"Helfen вимагає Dativ: sie (вони) → ihnen. Мала літера відрізняє їх від ввічливого «Ви».",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihnen"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-they-give",targetId:"pronoun-dative-they",person:"they",type:"cloze",word:"ihnen",example:"Anna gibt ihnen die Karten.",translation:"Анна дає їм квитки.",studyTranslation:"sie (вони) → ihnen · їм",promptText:"Anna gibt ___ die Karten.",support:"Заміни sie (вони): одержувачі квитків. Зверни увагу на регістр.",
    explanation:"Одержувачі з geben стоять у Dativ: sie (вони) → ihnen, з малої літери.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihnen"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-they-with",targetId:"pronoun-dative-they",person:"they",type:"cloze",word:"ihnen",example:"Fährst du mit ihnen nach Berlin?",translation:"Ти їдеш з ними до Берліна?",studyTranslation:"sie (вони) → ihnen · їм",promptText:"Fährst du mit ___ nach Berlin?",support:"Заміни sie (вони). Зверни увагу на регістр.",
    explanation:"Mit вимагає Dativ: sie (вони) → ihnen. Ihnen з великої літери означало б ввічливе «Вам».",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihnen"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-formal-recall",targetId:"pronoun-dative-formal",person:"formal",type:"recall",word:"Ihnen",translation:"Вам · Dativ від Sie (Ви, ввічливо)",promptText:"Dativ: Sie (Ви, ввічливо)",
    example:"Ich helfe Ihnen gern.",exampleTranslation:"Я охоче допомагаю Вам.",explanation:"Ввічливе Sie у Dativ стає Ihnen. Велика літера обов'язкова навіть усередині речення.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihnen"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-formal-thank",targetId:"pronoun-dative-formal",person:"formal",type:"cloze",word:"Ihnen",example:"Wir danken Ihnen.",translation:"Ми дякуємо Вам.",studyTranslation:"Sie → Ihnen · Вам (ввічливо)",promptText:"Wir danken ___.",support:"Заміни Sie (Ви, ввічливо). Зверни увагу на регістр.",
    explanation:"Danken вимагає Dativ: Sie → Ihnen. Ihnen з великої літери — ввічливе звертання.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihnen"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"pronoun-dative-formal-with",targetId:"pronoun-dative-formal",person:"formal",type:"cloze",word:"Ihnen",example:"Darf ich mit Ihnen sprechen?",translation:"Можна мені поговорити з Вами?",studyTranslation:"Sie → Ihnen · Вам (ввічливо)",promptText:"Darf ich mit ___ sprechen?",support:"Заміни Sie (Ви, ввічливо). Зверни увагу на регістр.",
    explanation:"Mit вимагає Dativ: Sie → Ihnen, а не Sie. Зберігай велику літеру у ввічливому звертанні.",category:"PERSONALPRONOMEN · DATIV",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihnen"],caseSensitive:true,punctuationSensitive:false}
  }
]);
const personalPronounAdditionalAccusativeExamples=[
  ["ich","treffen","Meine Schwester trifft mich nach dem Kurs.","Моя сестра зустрічає мене після курсу.","Meine Schwester trifft ___ nach dem Kurs."],
  ["ich","anrufen","Kannst du mich heute Abend anrufen?","Чи можеш ти зателефонувати мені сьогодні ввечері?","Kannst du ___ heute Abend anrufen?"],
  ["ich","fragen","Der Arzt fragt mich nach meinem Namen.","Лікар запитує мене про ім'я.","Der Arzt fragt ___ nach meinem Namen."],
  ["ich","fotografieren","Anna fotografiert mich im Garten.","Анна фотографує мене в саду.","Anna fotografiert ___ im Garten."],
  ["ich","suchen","Die Kinder suchen mich im ganzen Haus.","Діти шукають мене по всьому будинку.","Die Kinder suchen ___ im ganzen Haus."],
  ["ich","für","Diese Karte ist für mich.","Ця листівка для мене.","Diese Karte ist für ___."],
  ["du","suchen","Ich suche dich am Bahnhof.","Я шукаю тебе на вокзалі.","Ich suche ___ am Bahnhof."],
  ["du","einladen","Wir laden dich zur Feier ein.","Ми запрошуємо тебе на свято.","Wir laden ___ zur Feier ein."],
  ["du","verstehen","Niemand versteht dich am Telefon.","Ніхто не розуміє тебе телефоном.","Niemand versteht ___ am Telefon."],
  ["du","erwarten","Meine Eltern erwarten dich zu Hause.","Мої батьки чекають на тебе вдома.","Meine Eltern erwarten ___ zu Hause."],
  ["du","für","Ist das Paket für dich?","Ця посилка для тебе?","Ist das Paket für ___?"],
  ["du","treffen","Wir treffen dich um acht am Eingang.","Ми зустрічаємо тебе о восьмій біля входу.","Wir treffen ___ um acht am Eingang."],
  ["er","kennen","Kennst du ihn aus dem Kurs?","Ти знаєш його з курсу?","Kennst du ___ aus dem Kurs?"],
  ["er","sehen","Niemand sieht ihn im Dunkeln.","У темряві його ніхто не бачить.","Niemand sieht ___ im Dunkeln."],
  ["er","für","Das Geschenk ist für ihn.","Цей подарунок для нього.","Das Geschenk ist für ___."],
  ["er","anrufen","Ich rufe ihn später zurück.","Я передзвоню йому пізніше.","Ich rufe ___ später zurück."],
  ["er","suchen","Die Polizei sucht ihn seit Montag.","Поліція шукає його з понеділка.","Die Polizei sucht ___ seit Montag."],
  ["er","treffen","Wir treffen ihn vor dem Kino.","Ми зустрічаємо його перед кінотеатром.","Wir treffen ___ vor dem Kino."],
  ["she","anrufen","Morgen rufe ich sie zurück.","Завтра я їй передзвоню.","Morgen rufe ich ___ zurück."],
  ["she","sehen","Die Kinder sehen sie am Fenster.","Діти бачать її біля вікна.","Die Kinder sehen ___ am Fenster."],
  ["she","suchen","Wir suchen sie seit einer Stunde.","Ми шукаємо її вже годину.","Wir suchen ___ seit einer Stunde."],
  ["she","für","Ist diese Nachricht für sie?","Це повідомлення для неї?","Ist diese Nachricht für ___?"],
  ["she","kennen","Niemand kennt sie persönlich.","Особисто її ніхто не знає.","Niemand kennt ___ persönlich."],
  ["she","besuchen","Kannst du sie morgen besuchen?","Ти можеш відвідати її завтра?","Kannst du ___ morgen besuchen?"],
  ["es","fotografieren","Das Baby lacht. Der Vater fotografiert es.","Немовля сміється. Тато фотографує його.","Das Baby lacht. Der Vater fotografiert ___."],
  ["es","hearing-awake","Das Baby ist wach. Hörst du es?","Немовля не спить. Ти чуєш його?","Das Baby ist wach. Hörst du ___?"],
  ["es","mitnehmen","Die Eltern nehmen das Baby mit. Sie nehmen es mit.","Батьки беруть немовля із собою. Вони беруть його із собою.","Die Eltern nehmen das Baby mit. Sie nehmen ___ mit."],
  ["es","hearing-cry","Das Baby weint. Die Mutter hört es im Kinderzimmer.","Немовля плаче. Мама чує його в дитячій кімнаті.","Das Baby weint. Die Mutter hört ___ im Kinderzimmer."],
  ["es","bringen","Das Baby ist müde. Wir bringen es ins Bett.","Немовля втомилося. Ми вкладаємо його в ліжко.","Das Baby ist müde. Wir bringen ___ ins Bett."],
  ["es","sehen","Die Großeltern besuchen das Baby. Sie sehen es am Sonntag.","Дідусь і бабуся відвідують немовля. Вони бачать його в неділю.","Die Großeltern besuchen das Baby. Sie sehen ___ am Sonntag."],
  ["wir","besuchen","Kannst du uns morgen besuchen?","Ти можеш відвідати нас завтра?","Kannst du ___ morgen besuchen?"],
  ["wir","untersuchen","Der Arzt untersucht uns heute.","Лікар оглядає нас сьогодні.","Der Arzt untersucht ___ heute."],
  ["wir","erwarten","Die Gastgeber erwarten uns um acht.","Господарі чекають на нас о восьмій.","Die Gastgeber erwarten ___ um acht."],
  ["wir","rufen","Die Lehrerin ruft uns nach vorn.","Учителька кличе нас уперед.","Die Lehrerin ruft ___ nach vorn."],
  ["wir","für","Dieser Tisch ist für uns reserviert.","Цей стіл зарезервовано для нас.","Dieser Tisch ist für ___ reserviert."],
  ["wir","sehen","Die Kinder sehen uns auf der Bühne.","Діти бачать нас на сцені.","Die Kinder sehen ___ auf der Bühne."],
  ["ihr","einladen","Ich lade euch zum Essen ein.","Я запрошую вас на обід.","Ich lade ___ zum Essen ein."],
  ["ihr","besuchen","Morgen besucht Anna euch zu Hause.","Завтра Анна відвідає вас удома.","Morgen besucht Anna ___ zu Hause."],
  ["ihr","treffen","Wir treffen euch vor dem Museum.","Ми зустрічаємо вас перед музеєм.","Wir treffen ___ vor dem Museum."],
  ["ihr","fragen","Der Trainer fragt euch nach eurem Ziel.","Тренер запитує вас про вашу мету.","Der Trainer fragt ___ nach eurem Ziel."],
  ["ihr","für","Für euch gibt es noch Kuchen.","Для вас іще є пиріг.","Für ___ gibt es noch Kuchen."],
  ["ihr","hören","Niemand hört euch im Nebenraum.","У сусідній кімнаті вас ніхто не чує.","Niemand hört ___ im Nebenraum."],
  ["they","treffen","Morgen treffe ich sie im Café.","Завтра я зустрічаю їх у кафе.","Morgen treffe ich ___ im Café."],
  ["they","loben","Der Lehrer lobt sie für ihre Arbeit.","Учитель хвалить їх за їхню роботу.","Der Lehrer lobt ___ für ihre Arbeit."],
  ["they","erwarten","Wir erwarten sie vor dem Hotel.","Ми чекаємо на них перед готелем.","Wir erwarten ___ vor dem Hotel."],
  ["they","anrufen","Ich rufe sie später an.","Я зателефоную їм пізніше.","Ich rufe ___ später an."],
  ["they","verstehen","Niemand versteht sie ohne Untertitel.","Без субтитрів їх ніхто не розуміє.","Niemand versteht ___ ohne Untertitel."],
  ["they","für","Für sie reservieren wir einen Tisch.","Для них ми резервуємо стіл.","Für ___ reservieren wir einen Tisch."],
  ["formal","zurückrufen","Kann ich Sie morgen zurückrufen?","Чи можу я передзвонити Вам завтра?","Kann ich ___ morgen zurückrufen?"],
  ["formal","erwarten","Wir erwarten Sie am Empfang.","Ми чекаємо на Вас біля стійки реєстрації.","Wir erwarten ___ am Empfang."],
  ["formal","bringen","Der Fahrer bringt Sie zum Hotel.","Водій відвезе Вас до готелю.","Der Fahrer bringt ___ zum Hotel."],
  ["formal","für","Für Sie habe ich einen Platz reserviert.","Для Вас зарезервовано місце.","Für ___ habe ich einen Platz reserviert."],
  ["formal","hören","Am Telefon höre ich Sie kaum.","Телефоном я ледве чую Вас.","Am Telefon höre ich ___ kaum."],
  ["formal","besuchen","Frau Klein, wir besuchen Sie am Freitag.","Пані Кляйн, ми відвідаємо Вас у п'ятницю.","Frau Klein, wir besuchen ___ am Freitag."]
];
const personalPronounAdditionalDativeExamples=[
  ["ich","geben","Gibst du mir bitte den Stift?","Ти можеш дати мені ручку?","Gibst du ___ bitte den Stift?"],
  ["ich","danken","Meine Freunde danken mir für die Hilfe.","Мої друзі дякують мені за допомогу.","Meine Freunde danken ___ für die Hilfe."],
  ["ich","helfen","Die Nachbarin hilft mir beim Umzug.","Сусідка допомагає мені з переїздом.","Die Nachbarin hilft ___ beim Umzug."],
  ["ich","mit","Kommst du mit mir zum Markt?","Ти підеш зі мною на ринок?","Kommst du mit ___ zum Markt?"],
  ["ich","bringen","Der Kellner bringt mir die Speisekarte.","Офіціант приносить мені меню.","Der Kellner bringt ___ die Speisekarte."],
  ["ich","zeigen","Meine Kollegin zeigt mir den Weg zum Büro.","Моя колега показує мені дорогу до офісу.","Meine Kollegin zeigt ___ den Weg zum Büro."],
  ["du","geben","Der Arzt gibt dir einen Termin.","Лікар призначає тобі прийом.","Der Arzt gibt ___ einen Termin."],
  ["du","danken","Ich danke dir für die Nachricht.","Я дякую тобі за повідомлення.","Ich danke ___ für die Nachricht."],
  ["du","helfen","Mein Bruder hilft dir bei den Hausaufgaben.","Мій брат допомагає тобі з домашнім завданням.","Mein Bruder hilft ___ bei den Hausaufgaben."],
  ["du","mit","Darf ich mit dir zum Bahnhof gehen?","Можна мені піти з тобою до вокзалу?","Darf ich mit ___ zum Bahnhof gehen?"],
  ["du","erklären","Die Lehrerin erklärt dir die Regel.","Учителька пояснює тобі правило.","Die Lehrerin erklärt ___ die Regel."],
  ["du","bringen","Wir bringen dir den Kaffee.","Ми принесемо тобі каву.","Wir bringen ___ den Kaffee."],
  ["er","danken","Wir danken ihm für seine Unterstützung.","Ми дякуємо йому за підтримку.","Wir danken ___ für seine Unterstützung."],
  ["er","zeigen","Kannst du ihm den Weg zeigen?","Ти можеш показати йому дорогу?","Kannst du ___ den Weg zeigen?"],
  ["er","bringen","Maria bringt ihm nach dem Essen einen Kaffee.","Марія приносить йому каву після їжі.","Maria bringt ___ nach dem Essen einen Kaffee."],
  ["er","helfen","Die Ärztin hilft ihm sofort.","Лікарка одразу допомагає йому.","Die Ärztin hilft ___ sofort."],
  ["er","mit","Ich spreche mit ihm über den Film.","Я розмовляю з ним про фільм.","Ich spreche mit ___ über den Film."],
  ["er","erklären","Der Chef erklärt ihm den Plan.","Керівник пояснює йому план.","Der Chef erklärt ___ den Plan."],
  ["she","geben","Gibst du ihr den Schlüssel?","Ти даси їй ключ?","Gibst du ___ den Schlüssel?"],
  ["she","danken","Wir danken ihr für die Einladung.","Ми дякуємо їй за запрошення.","Wir danken ___ für die Einladung."],
  ["she","erklären","Der Chef erklärt ihr den Plan.","Керівник пояснює їй план.","Der Chef erklärt ___ den Plan."],
  ["she","bringen","Die Kinder bringen ihr eine Zeichnung.","Діти приносять їй малюнок.","Die Kinder bringen ___ eine Zeichnung."],
  ["she","helfen","Kannst du ihr bitte helfen?","Ти можеш їй допомогти?","Kannst du ___ bitte helfen?"],
  ["she","mit","Ich spreche mit ihr nach dem Kurs.","Я розмовляю з нею після курсу.","Ich spreche mit ___ nach dem Kurs."],
  ["es","geben","Das Baby ist durstig. Der Vater gibt ihm eine Flasche.","Немовля хоче пити. Тато дає йому пляшечку.","Das Baby ist durstig. Der Vater gibt ___ eine Flasche."],
  ["es","mit","Das Baby spielt. Die Eltern sind mit ihm im Garten.","Немовля грається. Батьки з ним у саду.","Das Baby spielt. Die Eltern sind mit ___ im Garten."],
  ["es","vorlesen","Das Baby liegt im Bett. Die Mutter liest ihm ein Buch vor.","Немовля лежить у ліжку. Мама читає йому книжку.","Das Baby liegt im Bett. Die Mutter liest ___ ein Buch vor."],
  ["es","helfen","Das Baby ist müde. Der Vater hilft ihm beim Anziehen.","Немовля втомилося. Тато допомагає йому одягнутися.","Das Baby ist müde. Der Vater hilft ___ beim Anziehen."],
  ["es","schenken","Das Baby hat Geburtstag. Wir schenken ihm ein Spielzeug.","У немовляти день народження. Ми даруємо йому іграшку.","Das Baby hat Geburtstag. Wir schenken ___ ein Spielzeug."],
  ["es","gefallen","Das Baby lacht. Gefällt ihm das Lied?","Немовля сміється. Йому подобається ця пісня?","Das Baby lacht. Gefällt ___ das Lied?"],
  ["wir","geben","Der Chef gibt uns eine neue Aufgabe.","Керівник дає нам нове завдання.","Der Chef gibt ___ eine neue Aufgabe."],
  ["wir","danken","Unsere Nachbarn danken uns für die Hilfe.","Наші сусіди дякують нам за допомогу.","Unsere Nachbarn danken ___ für die Hilfe."],
  ["wir","zeigen","Die Trainerin zeigt uns die Übung.","Тренерка показує нам вправу.","Die Trainerin zeigt ___ die Übung."],
  ["wir","mit","Möchtest du mit uns zum Konzert kommen?","Ти хочеш піти з нами на концерт?","Möchtest du mit ___ zum Konzert kommen?"],
  ["wir","helfen","Die Kinder helfen uns im Garten.","Діти допомагають нам у саду.","Die Kinder helfen ___ im Garten."],
  ["wir","bringen","Der Kellner bringt uns die Rechnung.","Офіціант приносить нам рахунок.","Der Kellner bringt ___ die Rechnung."],
  ["ihr","geben","Wir geben euch die Adresse.","Ми даємо вам адресу.","Wir geben ___ die Adresse."],
  ["ihr","danken","Ich danke euch für die Einladung.","Я дякую вам за запрошення.","Ich danke ___ für die Einladung."],
  ["ihr","zeigen","Die Lehrerin zeigt euch den Raum.","Учителька показує вам кімнату.","Die Lehrerin zeigt ___ den Raum."],
  ["ihr","mit","Darf ich mit euch nach Hause fahren?","Можна мені поїхати з вами додому?","Darf ich mit ___ nach Hause fahren?"],
  ["ihr","helfen","Jonas hilft euch beim Umzug.","Йонас допомагає вам із переїздом.","Jonas hilft ___ beim Umzug."],
  ["ihr","bringen","Der Gastgeber bringt euch Tee.","Господар приносить вам чай.","Der Gastgeber bringt ___ Tee."],
  ["they","helfen","Die Nachbarin hilft ihnen beim Tragen.","Сусідка допомагає їм нести речі.","Die Nachbarin hilft ___ beim Tragen."],
  ["they","danken","Ich danke ihnen für die schnelle Antwort.","Я дякую їм за швидку відповідь.","Ich danke ___ für die schnelle Antwort."],
  ["they","erklären","Der Arzt erklärt ihnen den Befund.","Лікар пояснює їм висновок обстеження.","Der Arzt erklärt ___ den Befund."],
  ["they","mit","Möchten Sie mit ihnen am Tisch sitzen?","Ви хотіли б сидіти з ними за столом?","Möchten Sie mit ___ am Tisch sitzen?"],
  ["they","zeigen","Der Verkäufer zeigt ihnen den Eingang.","Продавець показує їм вхід.","Der Verkäufer zeigt ___ den Eingang."],
  ["they","schicken","Wir schicken ihnen die Unterlagen morgen.","Ми надішлемо їм документи завтра.","Wir schicken ___ die Unterlagen morgen."],
  ["formal","öffnen","Darf ich Ihnen die Tür öffnen?","Можна мені відчинити Вам двері?","Darf ich ___ die Tür öffnen?"],
  ["formal","schicken","Wir schicken Ihnen den Vertrag morgen.","Ми надішлемо Вам договір завтра.","Wir schicken ___ den Vertrag morgen."],
  ["formal","helfen","Die Kollegin hilft Ihnen gern.","Колега охоче допомагає Вам.","Die Kollegin hilft ___ gern."],
  ["formal","danken","Ich danke Ihnen für Ihre Geduld.","Я дякую Вам за терпіння.","Ich danke ___ für Ihre Geduld."],
  ["formal","anbieten","Darf ich Ihnen einen Kaffee anbieten?","Можна запропонувати Вам каву?","Darf ich ___ einen Kaffee anbieten?"],
  ["formal","zeigen","Der Fahrer zeigt Ihnen den Weg zum Hotel.","Водій показує Вам дорогу до готелю.","Der Fahrer zeigt ___ den Weg zum Hotel."]
];
const personalPronounCaseRules={
  treffen:"Treffen вимагає Akkusativ",
  anrufen:"Anrufen вимагає Akkusativ",
  fragen:"Fragen вимагає Akkusativ",
  fotografieren:"Fotografieren вимагає Akkusativ",
  suchen:"Suchen вимагає Akkusativ",
  für:"Für завжди вимагає Akkusativ",
  einladen:"Einladen вимагає Akkusativ",
  verstehen:"Verstehen вимагає Akkusativ",
  erwarten:"Erwarten вимагає Akkusativ",
  kennen:"Kennen вимагає Akkusativ",
  sehen:"Sehen вимагає Akkusativ",
  besuchen:"Besuchen вимагає Akkusativ",
  loben:"Loben вимагає Akkusativ",
  zurückrufen:"Zurückrufen вимагає Akkusativ",
  bringen:"Bringen вимагає Akkusativ",
  hören:"Hören вимагає Akkusativ",
  "hearing-awake":"Hören вимагає Akkusativ",
  "hearing-cry":"Hören вимагає Akkusativ",
  mitnehmen:"Mitnehmen вимагає Akkusativ",
  untersuchen:"Untersuchen вимагає Akkusativ",
  rufen:"Rufen вимагає Akkusativ",
  geben:"Одержувач із geben стоїть у Dativ",
  danken:"Danken вимагає Dativ",
  helfen:"Helfen вимагає Dativ",
  mit:"Mit завжди вимагає Dativ",
  zeigen:"Одержувач із zeigen стоїть у Dativ",
  erklären:"Одержувач із erklären стоїть у Dativ",
  vorlesen:"Одержувач із vorlesen стоїть у Dativ",
  schenken:"Одержувач із schenken стоїть у Dativ",
  gefallen:"Gefallen вимагає Dativ",
  schicken:"Одержувач із schicken стоїть у Dativ",
  öffnen:"Одержувач із öffnen стоїть у Dativ",
  anbieten:"Одержувач із anbieten стоїть у Dativ"
};
const personalPronounContextCues={
  ich:"Заміни ich (я).",
  du:"Заміни du (ти).",
  er:"Заміни er (він).",
  she:"Заміни sie (вона). Зверни увагу на регістр.",
  es:"Заміни es (воно, середній рід).",
  wir:"Заміни wir (ми).",
  ihr:"Заміни ihr (ви, неформально, кілька людей).",
  they:"Заміни sie (вони). Зверни увагу на регістр.",
  formal:"Заміни Sie (Ви, ввічливо). Зверни увагу на регістр."
};
function addPronounContextExamples(baseCards,caseLabel,examples){
  const grammaticalCase=caseLabel==="Akk."?"accusative":"dative";
  return examples.map(([person,rule,example,translation,promptText])=>{
    const targetId=`pronoun-${grammaticalCase}-${person}`;
    const base=baseCards.find(card=>card.targetId===targetId&&card.type==="cloze");
    if(!base)throw new Error(`Missing base pronoun card: ${targetId}`);
    const ruleText=personalPronounCaseRules[rule];
    if(!ruleText)throw new Error(`Unknown pronoun case rule: ${rule}`);
    const support=personalPronounContextCues[person];
    if(!support)throw new Error(`Missing pronoun context cue: ${person}`);
    const answer=base.response.accepted[0];
    return {
      id:`${base.targetId}-context-${rule.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}`,
      targetId:base.targetId,person,type:"cloze",word:answer,example,translation,studyTranslation:base.studyTranslation,promptText,support,
      explanation:`${ruleText}: ${base.studyTranslation.split(" · ")[0]}.`,category:base.category,practiceVariants:false,response:base.response
    };
  });
}
const personalPronounAccusativeCards=withPronounCase("Akk.",[
  ...personalPronounAccusativeBaseCards,
  ...addPronounContextExamples(personalPronounAccusativeBaseCards,"Akk.",personalPronounAdditionalAccusativeExamples)
]);
const personalPronounDativeCards=withPronounCase("Dat.",[
  ...personalPronounDativeBaseCards,
  ...addPronounContextExamples(personalPronounDativeBaseCards,"Dat.",personalPronounAdditionalDativeExamples)
]);
const personalPronounCaseCards=[...personalPronounAccusativeCards,...personalPronounDativeCards];
const personalPronounMixedPrompts={
  "pronoun-accusative-ich-recall":{promptText:"Meine Schwester besucht ___.",support:"Заміни ich (я)."},
  "pronoun-accusative-du-recall":{promptText:"Ich besuche ___ am Abend.",support:"Заміни du (ти)."},
  "pronoun-accusative-er-recall":{promptText:"Ich kenne ___ gut.",support:"Заміни er (він)."},
  "pronoun-accusative-she-recall":{promptText:"Wir besuchen ___ heute.",support:personalPronounContextCues.she},
  "pronoun-accusative-es-recall":{promptText:"Das Baby schläft. Ich sehe ___.",support:"Заміни es (воно): das Baby."},
  "pronoun-accusative-wir-recall":{promptText:"Unsere Freunde besuchen ___.",support:"Заміни wir (ми)."},
  "pronoun-accusative-ihr-recall":{promptText:"Ich besuche ___ morgen.",support:"Заміни ihr (ви, неформально, кілька людей)."},
  "pronoun-accusative-they-recall":{promptText:"Ich kenne ___ schon.",support:personalPronounContextCues.they},
  "pronoun-accusative-formal-recall":{promptText:"Ich besuche ___ morgen.",support:personalPronounContextCues.formal},
  "pronoun-dative-ich-recall":{promptText:"Meine Schwester hilft ___.",support:"Заміни ich (я)."},
  "pronoun-dative-du-recall":{promptText:"Ich helfe ___ gern.",support:"Заміни du (ти)."},
  "pronoun-dative-er-recall":{promptText:"Ich helfe ___ heute.",support:"Заміни er (він)."},
  "pronoun-dative-she-recall":{promptText:"Ich helfe ___ gern.",support:personalPronounContextCues.she},
  "pronoun-dative-es-recall":{promptText:"Das Baby weint. Die Mutter gibt ___ Milch.",support:"Заміни es (воно): das Baby."},
  "pronoun-dative-wir-recall":{promptText:"Unsere Freunde helfen ___.",support:"Заміни wir (ми)."},
  "pronoun-dative-ihr-recall":{promptText:"Ich helfe ___ morgen.",support:"Заміни ihr (ви, неформально, кілька людей)."},
  "pronoun-dative-they-recall":{promptText:"Ich helfe ___ heute.",support:personalPronounContextCues.they},
  "pronoun-dative-formal-recall":{promptText:"Ich helfe ___ gern.",support:personalPronounContextCues.formal}
};
const personalPronounMixedPracticeCards=personalPronounCaseCards.map(card=>{
  const context=personalPronounMixedPrompts[card.id];
  return context?{...card,...context,type:"cloze"}:card;
});
const possessivePronounCards=[
  {word:"mein",translation:"мій / моє",category:"POSSESSIVE PRONOUN",example:"Mein Bruder lernt Deutsch.",exampleTranslation:"Мій брат вивчає німецьку."},
  {word:"dein",translation:"твій / твоє",category:"POSSESSIVE PRONOUN",example:"Ist das dein Buch?",exampleTranslation:"Це твоя книга?"},
  {word:"sein",translation:"його",category:"POSSESSIVE PRONOUN",example:"Sein Auto ist neu.",exampleTranslation:"Його автомобіль новий."},
  {word:"ihr / ihre",translation:"її",category:"POSSESSIVE PRONOUN",targetId:"possessive-her",acceptedAnswers:["ihr","ihre"],example:"Ihre Tasche ist hier.",exampleTranslation:"Її сумка тут."},
  {word:"unser",translation:"наш / наше",category:"POSSESSIVE PRONOUN",example:"Unser Kurs beginnt heute.",exampleTranslation:"Наш курс починається сьогодні."},
  {word:"euer",translation:"ваш / ваше (неофіційно, множина)",category:"POSSESSIVE PRONOUN",example:"Euer Haus ist groß.",exampleTranslation:"Ваш будинок великий."},
  {word:"Ihr",translation:"Ваш / Ваше (ввічливо)",category:"POSSESSIVE PRONOUN",example:"Wie ist Ihr Name?",exampleTranslation:"Як Ваше ім'я?",caseSensitive:true},
  {word:"ihr / ihre",translation:"їхній / їхня",category:"POSSESSIVE PRONOUN",targetId:"possessive-their",acceptedAnswers:["ihr","ihre"],example:"Ihre Kinder spielen draußen.",exampleTranslation:"Їхні діти граються надворі."},
  {word:"meine",translation:"моя / моє / мої",category:"POSSESSIVE ENDING",promptText:"Присвійний займенник: Моя мама працює в офісі.",example:"Meine Mutter arbeitet im Büro.",exampleTranslation:"Моя мама працює в офісі."},
  {word:"deine",translation:"твоя / твоє / твої",category:"POSSESSIVE ENDING",promptText:"Присвійний займенник: Твої друзі чекають надворі.",example:"Deine Freunde warten draußen.",exampleTranslation:"Твої друзі чекають надворі."},
  {word:"unsere",translation:"наша / наше / наші",category:"POSSESSIVE ENDING",promptText:"Присвійний займенник: Наша квартира світла.",example:"Unsere Wohnung ist hell.",exampleTranslation:"Наша квартира світла."},
  {word:"Ihre",translation:"Ваша / Ваше / Ваші (ввічливо)",category:"POSSESSIVE ENDING",promptText:"Присвійний займенник: Ваші діти вдома?",example:"Sind Ihre Kinder zu Hause?",exampleTranslation:"Ваші діти вдома?",caseSensitive:true}
];
const possessiveAccusativeCards=[
  {
    id:"possessive-accusative-masculine-brother",targetId:"possessive-accusative-masculine",type:"cloze",word:"meinen",
    promptText:"Ich besuche ___ Bruder.",support:"Я відвідую свого брата. Іменник: der Bruder; власник: ich (я).",
    translation:"Я відвідую свого брата.",studyTranslation:"Akkusativ · der Bruder · мій",
    example:"Ich besuche meinen Bruder.",explanation:"Besuchen вимагає Akkusativ. Der Bruder — чоловічий рід: mein + -en → meinen.",
    category:"POSSESSIVE ENDING · AKKUSATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["meinen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-masculine-key",targetId:"possessive-accusative-masculine",type:"cloze",word:"deinen",
    promptText:"Suchst du ___ Schlüssel?",support:"Ти шукаєш свій ключ? Іменник: der Schlüssel; власник: du (ти).",
    translation:"Ти шукаєш свій ключ?",studyTranslation:"Akkusativ · der Schlüssel · твій",
    example:"Suchst du deinen Schlüssel?",explanation:"Suchen вимагає Akkusativ. Der Schlüssel — чоловічий рід: dein + -en → deinen.",
    category:"POSSESSIVE ENDING · AKKUSATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["deinen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-masculine-her-father",targetId:"possessive-accusative-masculine",type:"cloze",word:"ihren",
    promptText:"Wir sehen ___ Vater im Park.",support:"Ми бачимо її тата в парку. Іменник: der Vater; власниця: sie (вона).",
    translation:"Ми бачимо її тата в парку.",studyTranslation:"Akkusativ · der Vater · її",
    example:"Wir sehen ihren Vater im Park.",explanation:"Sehen вимагає Akkusativ. Der Vater — чоловічий рід: ihr + -en → ihren. «Її» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihren"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-masculine-your-dog",targetId:"possessive-accusative-masculine",type:"cloze",word:"euren",
    promptText:"Ich höre ___ Hund.",support:"Я чую вашого собаку. Іменник: der Hund; власники: ihr (ви, неформально, кілька людей).",
    translation:"Я чую вашого собаку.",studyTranslation:"Akkusativ · der Hund · ваш (неформально)",
    example:"Ich höre euren Hund.",explanation:"Hören вимагає Akkusativ. Der Hund — чоловічий рід: euer + -en → euren (також eueren). Зазвичай внутрішнє e випадає.",
    category:"POSSESSIVE ENDING · AKKUSATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euren","eueren"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-masculine-formal-passport",targetId:"possessive-accusative-masculine",type:"cloze",word:"Ihren",
    promptText:"Haben Sie ___ Pass dabei?",support:"У Вас із собою Ваш паспорт? Іменник: der Pass; власник: Sie (Ви, ввічливо).",
    translation:"У Вас із собою Ваш паспорт?",studyTranslation:"Akkusativ · der Pass · Ваш (ввічливо)",
    example:"Haben Sie Ihren Pass dabei?",explanation:"Haben вимагає Akkusativ. Der Pass — чоловічий рід: Ihr + -en → Ihren. Ввічливе «Ваш» завжди пишемо з великої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihren"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-neuter-our-car",targetId:"possessive-accusative-neuter",type:"cloze",word:"unser",
    promptText:"Wir verkaufen ___ Auto.",support:"Ми продаємо свій автомобіль. Іменник: das Auto; власники: wir (ми).",
    translation:"Ми продаємо свій автомобіль.",studyTranslation:"Akkusativ · das Auto · наш",
    example:"Wir verkaufen unser Auto.",explanation:"Verkaufen вимагає Akkusativ. Das Auto — середній рід, тому без закінчення: unser Auto, а не unseren Auto.",
    category:"POSSESSIVE ENDING · AKKUSATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["unser"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-neuter-his-book",targetId:"possessive-accusative-neuter",type:"cloze",word:"sein",
    promptText:"Anna liest ___ Buch.",support:"Анна читає його книжку. Іменник: das Buch; власник: er (він).",
    translation:"Анна читає його книжку.",studyTranslation:"Akkusativ · das Buch · його",
    example:"Anna liest sein Buch.",explanation:"Lesen вимагає Akkusativ. Das Buch — середній рід: sein без закінчення. Власник er визначає основу, а не рід книжки.",
    category:"POSSESSIVE ENDING · AKKUSATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["sein"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-neuter-their-child",targetId:"possessive-accusative-neuter",type:"cloze",word:"ihr",
    promptText:"Ich kenne ___ Kind.",support:"Я знаю їхню дитину. Іменник: das Kind; власники: sie (вони).",
    translation:"Я знаю їхню дитину.",studyTranslation:"Akkusativ · das Kind · їхній",
    example:"Ich kenne ihr Kind.",explanation:"Kennen вимагає Akkusativ. Das Kind — середній рід у німецькій, тому ihr без закінчення. «Їхній» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihr"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-neuter-your-house",targetId:"possessive-accusative-neuter",type:"cloze",word:"euer",
    promptText:"Wir gehen in ___ Haus.",support:"Ми йдемо у ваш будинок. Іменник: das Haus; власники: ihr (ви, неформально, кілька людей).",
    translation:"Ми йдемо у ваш будинок.",studyTranslation:"Akkusativ · das Haus · ваш (неформально)",
    example:"Wir gehen in euer Haus.",explanation:"In описує напрямок (Wohin?), тому Akkusativ. Das Haus — середній рід: euer без закінчення; внутрішнє e зберігається.",
    category:"POSSESSIVE ENDING · AKKUSATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euer"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-neuter-formal-ticket",targetId:"possessive-accusative-neuter",type:"cloze",word:"Ihr",
    promptText:"Zeigen Sie bitte ___ Ticket.",support:"Покажіть, будь ласка, Ваш квиток. Іменник: das Ticket; власник: Sie (Ви, ввічливо).",
    translation:"Покажіть, будь ласка, Ваш квиток.",studyTranslation:"Akkusativ · das Ticket · Ваш (ввічливо)",
    example:"Zeigen Sie bitte Ihr Ticket.",explanation:"Предмет, який показують, стоїть в Akkusativ. Das Ticket — середній рід: Ihr без закінчення, з великої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihr"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-feminine-my-bag",targetId:"possessive-accusative-feminine",type:"cloze",word:"meine",
    promptText:"Ich suche ___ Tasche.",support:"Я шукаю свою сумку. Іменник: die Tasche; власник: ich (я).",
    translation:"Я шукаю свою сумку.",studyTranslation:"Akkusativ · die Tasche · моя",
    example:"Ich suche meine Tasche.",explanation:"Suchen вимагає Akkusativ. Die Tasche — жіночий рід: mein + -e → meine, як у Nominativ.",
    category:"POSSESSIVE ENDING · AKKUSATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["meine"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-feminine-his-sister",targetId:"possessive-accusative-feminine",type:"cloze",word:"seine",
    promptText:"Wir besuchen ___ Schwester.",support:"Ми відвідуємо його сестру. Іменник: die Schwester; власник: er (він).",
    translation:"Ми відвідуємо його сестру.",studyTranslation:"Akkusativ · die Schwester · його",
    example:"Wir besuchen seine Schwester.",explanation:"Besuchen вимагає Akkusativ. Die Schwester — жіночий рід: sein + -e → seine. Er визначає основу sein, Schwester — закінчення -e.",
    category:"POSSESSIVE ENDING · AKKUSATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["seine"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-feminine-her-mother",targetId:"possessive-accusative-feminine",type:"cloze",word:"ihre",
    promptText:"Das Geschenk ist für ___ Mutter.",support:"Подарунок для її мами. Іменник: die Mutter; власниця: sie (вона).",
    translation:"Подарунок для її мами.",studyTranslation:"Akkusativ · die Mutter · її",
    example:"Das Geschenk ist für ihre Mutter.",explanation:"Für завжди вимагає Akkusativ. Die Mutter — жіночий рід: ihr + -e → ihre. «Її» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihre"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-feminine-your-apartment",targetId:"possessive-accusative-feminine",type:"cloze",word:"eure",
    promptText:"Mögt ihr ___ Wohnung?",support:"Вам подобається ваша квартира? Іменник: die Wohnung; власники: ihr (ви, неформально, кілька людей).",
    translation:"Вам подобається ваша квартира?",studyTranslation:"Akkusativ · die Wohnung · ваша (неформально)",
    example:"Mögt ihr eure Wohnung?",explanation:"Mögen вимагає Akkusativ. Die Wohnung — жіночий рід: euer + -e → eure (також euere). Зазвичай внутрішнє e випадає.",
    category:"POSSESSIVE ENDING · AKKUSATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["eure","euere"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-feminine-formal-address",targetId:"possessive-accusative-feminine",type:"cloze",word:"Ihre",
    promptText:"Ich brauche ___ Adresse.",support:"Мені потрібна Ваша адреса. Іменник: die Adresse; власник: Sie (Ви, ввічливо).",
    translation:"Мені потрібна Ваша адреса.",studyTranslation:"Akkusativ · die Adresse · Ваша (ввічливо)",
    example:"Ich brauche Ihre Adresse.",explanation:"Brauchen вимагає Akkusativ. Die Adresse — жіночий рід: Ihr + -e → Ihre. Ввічливе «Ваша» пишемо з великої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihre"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-plural-your-shoes",targetId:"possessive-accusative-plural",type:"cloze",word:"deine",
    promptText:"Wo kaufst du ___ Schuhe?",support:"Де ти купуєш своє взуття? Іменник: die Schuhe (множина); власник: du (ти).",
    translation:"Де ти купуєш своє взуття?",studyTranslation:"Akkusativ · die Schuhe · твої",
    example:"Wo kaufst du deine Schuhe?",explanation:"Kaufen вимагає Akkusativ. Schuhe — множина: dein + -e → deine. Wo питає про місце покупки, але відмінок взуття визначає kaufen.",
    category:"POSSESSIVE ENDING · AKKUSATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["deine"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-plural-our-friends",targetId:"possessive-accusative-plural",type:"cloze",word:"unsere",
    promptText:"Wir treffen ___ Freunde heute.",support:"Ми зустрічаємо своїх друзів сьогодні. Іменник: die Freunde (множина); власники: wir (ми).",
    translation:"Ми зустрічаємо своїх друзів сьогодні.",studyTranslation:"Akkusativ · die Freunde · наші",
    example:"Wir treffen unsere Freunde heute.",explanation:"Treffen вимагає Akkusativ. Freunde — множина: unser + -e → unsere. -er у слові unser є частиною основи.",
    category:"POSSESSIVE ENDING · AKKUSATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["unsere","unsre"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-plural-their-children",targetId:"possessive-accusative-plural",type:"cloze",word:"ihre",
    promptText:"Ich sehe ___ Kinder.",support:"Я бачу їхніх дітей. Іменник: die Kinder (множина); власники: sie (вони).",
    translation:"Я бачу їхніх дітей.",studyTranslation:"Akkusativ · die Kinder · їхні",
    example:"Ich sehe ihre Kinder.",explanation:"Sehen вимагає Akkusativ. Kinder — множина: ihr + -e → ihre. «Їхні» пишемо з малої літери, не як ввічливе Ihre.",
    category:"POSSESSIVE ENDING · AKKUSATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihre"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-plural-your-parents",targetId:"possessive-accusative-plural",type:"cloze",word:"eure",
    promptText:"Ruft ihr ___ Eltern an?",support:"Ви телефонуєте своїм батькам? Іменник: die Eltern (множина); власники: ihr (ви, неформально, кілька людей).",
    translation:"Ви телефонуєте своїм батькам?",studyTranslation:"Akkusativ · die Eltern · ваші (неформально)",
    example:"Ruft ihr eure Eltern an?",explanation:"Anrufen вимагає Akkusativ, хоча українською «телефонувати кому». Eltern — множина: euer + -e → eure (також euere).",
    category:"POSSESSIVE ENDING · AKKUSATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["eure","euere"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-accusative-plural-formal-bags",targetId:"possessive-accusative-plural",type:"cloze",word:"Ihre",
    promptText:"Haben Sie ___ Taschen dabei?",support:"У Вас із собою Ваші сумки? Іменник: die Taschen (множина); власник: Sie (Ви, ввічливо).",
    translation:"У Вас із собою Ваші сумки?",studyTranslation:"Akkusativ · die Taschen · Ваші (ввічливо)",
    example:"Haben Sie Ihre Taschen dabei?",explanation:"Haben вимагає Akkusativ. Taschen — множина: Ihr + -e → Ihre. Ввічливе «Ваші» завжди пишемо з великої літери.",
    category:"POSSESSIVE ENDING · AKKUSATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihre"],caseSensitive:true,punctuationSensitive:false}
  }
];
const possessiveDativeCards=[
  {
    id:"possessive-dative-masculine-brother",targetId:"possessive-dative-masculine",type:"cloze",word:"meinem",
    promptText:"Ich helfe ___ Bruder.",support:"Я допомагаю своєму братові. Іменник: der Bruder; власник: ich (я).",
    translation:"Я допомагаю своєму братові.",studyTranslation:"Dativ · der Bruder · мій",
    example:"Ich helfe meinem Bruder.",explanation:"Helfen вимагає Dativ. Der Bruder — чоловічий рід: mein + -em → meinem, а не meinen.",
    category:"POSSESSIVE ENDING · DATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["meinem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-masculine-your-father",targetId:"possessive-dative-masculine",type:"cloze",word:"deinem",
    promptText:"Sprichst du mit ___ Vater?",support:"Ти розмовляєш зі своїм татом? Іменник: der Vater; власник: du (ти).",
    translation:"Ти розмовляєш зі своїм татом?",studyTranslation:"Dativ · der Vater · твій",
    example:"Sprichst du mit deinem Vater?",explanation:"Mit завжди вимагає Dativ. Der Vater — чоловічий рід: dein + -em → deinem.",
    category:"POSSESSIVE ENDING · DATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["deinem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-masculine-her-father",targetId:"possessive-dative-masculine",type:"cloze",word:"ihrem",
    promptText:"Wir danken ___ Vater.",support:"Ми дякуємо її татові. Іменник: der Vater; власниця: sie (вона).",
    translation:"Ми дякуємо її татові.",studyTranslation:"Dativ · der Vater · її",
    example:"Wir danken ihrem Vater.",explanation:"Danken вимагає Dativ. Der Vater — чоловічий рід: ihr + -em → ihrem. «Її» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · DATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihrem"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-masculine-your-dog",targetId:"possessive-dative-masculine",type:"cloze",word:"eurem",
    promptText:"Ich gehe mit ___ Hund spazieren.",support:"Я гуляю з вашим собакою. Іменник: der Hund; власники: ihr (ви, неформально, кілька людей).",
    translation:"Я гуляю з вашим собакою.",studyTranslation:"Dativ · der Hund · ваш (неформально)",
    example:"Ich gehe mit eurem Hund spazieren.",explanation:"Mit вимагає Dativ. Der Hund — чоловічий рід: euer + -em → eurem (також euerem). Не плутай з euren в Akkusativ.",
    category:"POSSESSIVE ENDING · DATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["eurem","euerem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-masculine-formal-husband",targetId:"possessive-dative-masculine",type:"cloze",word:"Ihrem",
    promptText:"Kommen Sie mit ___ Mann?",support:"Ви прийдете зі своїм чоловіком? Іменник: der Mann; власник: Sie (Ви, ввічливо).",
    translation:"Ви прийдете зі своїм чоловіком?",studyTranslation:"Dativ · der Mann · Ваш (ввічливо)",
    example:"Kommen Sie mit Ihrem Mann?",explanation:"Mit вимагає Dativ. Der Mann — чоловічий рід: Ihr + -em → Ihrem. Ввічливе «Ваш» пишемо з великої літери.",
    category:"POSSESSIVE ENDING · DATIV · MASKULINUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihrem"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-neuter-our-car",targetId:"possessive-dative-neuter",type:"cloze",word:"unserem",
    promptText:"Wir fahren mit ___ Auto.",support:"Ми їдемо своїм автомобілем. Іменник: das Auto; власники: wir (ми).",
    translation:"Ми їдемо своїм автомобілем.",studyTranslation:"Dativ · das Auto · наш",
    example:"Wir fahren mit unserem Auto.",explanation:"Mit вимагає Dativ. Das Auto — середній рід: unser + -em → unserem. У Dativ чоловічий і середній рід мають -em.",
    category:"POSSESSIVE ENDING · DATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["unserem","unsrem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-neuter-his-child",targetId:"possessive-dative-neuter",type:"cloze",word:"seinem",
    promptText:"Anna gibt ___ Kind ein Buch.",support:"Анна дає його дитині книжку. Іменник: das Kind; власник: er (він).",
    translation:"Анна дає його дитині книжку.",studyTranslation:"Dativ · das Kind · його",
    example:"Anna gibt seinem Kind ein Buch.",explanation:"З geben одержувач стоїть у Dativ. Das Kind — середній рід у німецькій: sein + -em → seinem. Ein Buch — предмет в Akkusativ.",
    category:"POSSESSIVE ENDING · DATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["seinem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-neuter-their-child",targetId:"possessive-dative-neuter",type:"cloze",word:"ihrem",
    promptText:"Ich spiele mit ___ Kind.",support:"Я граюся з їхньою дитиною. Іменник: das Kind; власники: sie (вони).",
    translation:"Я граюся з їхньою дитиною.",studyTranslation:"Dativ · das Kind · їхній",
    example:"Ich spiele mit ihrem Kind.",explanation:"Mit вимагає Dativ. Das Kind — середній рід: ihr + -em → ihrem. «Їхній» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · DATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihrem"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-neuter-your-house",targetId:"possessive-dative-neuter",type:"cloze",word:"eurem",
    promptText:"Wir wohnen in ___ Haus.",support:"Ми живемо у вашому будинку. Іменник: das Haus; власники: ihr (ви, неформально, кілька людей).",
    translation:"Ми живемо у вашому будинку.",studyTranslation:"Dativ · das Haus · ваш (неформально)",
    example:"Wir wohnen in eurem Haus.",explanation:"In описує розташування (Wo?), тому Dativ. Das Haus — середній рід: euer + -em → eurem (також euerem).",
    category:"POSSESSIVE ENDING · DATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["eurem","euerem"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-neuter-formal-car",targetId:"possessive-dative-neuter",type:"cloze",word:"Ihrem",
    promptText:"Fahren Sie mit ___ Auto?",support:"Ви їдете своїм автомобілем? Іменник: das Auto; власник: Sie (Ви, ввічливо).",
    translation:"Ви їдете своїм автомобілем?",studyTranslation:"Dativ · das Auto · Ваш (ввічливо)",
    example:"Fahren Sie mit Ihrem Auto?",explanation:"Mit завжди вимагає Dativ, навіть під час руху. Das Auto — середній рід: Ihr + -em → Ihrem, з великої літери.",
    category:"POSSESSIVE ENDING · DATIV · NEUTRUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihrem"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-feminine-my-sister",targetId:"possessive-dative-feminine",type:"cloze",word:"meiner",
    promptText:"Ich helfe ___ Schwester.",support:"Я допомагаю своїй сестрі. Іменник: die Schwester; власник: ich (я).",
    translation:"Я допомагаю своїй сестрі.",studyTranslation:"Dativ · die Schwester · моя",
    example:"Ich helfe meiner Schwester.",explanation:"Helfen вимагає Dativ. Die Schwester — жіночий рід: mein + -er → meiner, а не meine.",
    category:"POSSESSIVE ENDING · DATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["meiner"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-feminine-his-mother",targetId:"possessive-dative-feminine",type:"cloze",word:"seiner",
    promptText:"Wir sprechen mit ___ Mutter.",support:"Ми розмовляємо з його мамою. Іменник: die Mutter; власник: er (він).",
    translation:"Ми розмовляємо з його мамою.",studyTranslation:"Dativ · die Mutter · його",
    example:"Wir sprechen mit seiner Mutter.",explanation:"Mit вимагає Dativ. Die Mutter — жіночий рід: sein + -er → seiner. Власник er визначає основу, Mutter — закінчення.",
    category:"POSSESSIVE ENDING · DATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["seiner"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-feminine-her-bag",targetId:"possessive-dative-feminine",type:"cloze",word:"ihrer",
    promptText:"Der Schlüssel liegt in ___ Tasche.",support:"Ключ лежить у її сумці. Іменник: die Tasche; власниця: sie (вона).",
    translation:"Ключ лежить у її сумці.",studyTranslation:"Dativ · die Tasche · її",
    example:"Der Schlüssel liegt in ihrer Tasche.",explanation:"In описує місце (Wo?), тому Dativ. Die Tasche — жіночий рід: ihr + -er → ihrer. «Її» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · DATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihrer"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-feminine-your-apartment",targetId:"possessive-dative-feminine",type:"cloze",word:"eurer",
    promptText:"Seid ihr in ___ Wohnung?",support:"Ви у своїй квартирі? Іменник: die Wohnung; власники: ihr (ви, неформально, кілька людей).",
    translation:"Ви у своїй квартирі?",studyTranslation:"Dativ · die Wohnung · ваша (неформально)",
    example:"Seid ihr in eurer Wohnung?",explanation:"In описує місце (Wo?), тому Dativ. Die Wohnung — жіночий рід: euer + -er → eurer (також euerer). Не плутай з eure в Akkusativ.",
    category:"POSSESSIVE ENDING · DATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["eurer","euerer"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-feminine-formal-daughter",targetId:"possessive-dative-feminine",type:"cloze",word:"Ihrer",
    promptText:"Ich antworte ___ Tochter.",support:"Я відповідаю Вашій доньці. Іменник: die Tochter; власник: Sie (Ви, ввічливо).",
    translation:"Я відповідаю Вашій доньці.",studyTranslation:"Dativ · die Tochter · Ваша (ввічливо)",
    example:"Ich antworte Ihrer Tochter.",explanation:"Antworten вимагає Dativ. Die Tochter — жіночий рід: Ihr + -er → Ihrer. Ввічливе «Ваша» пишемо з великої літери.",
    category:"POSSESSIVE ENDING · DATIV · FEMININUM",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihrer"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-plural-your-friends",targetId:"possessive-dative-plural",type:"cloze",word:"deinen",
    promptText:"Lernst du mit ___ Freunden?",support:"Ти вчишся зі своїми друзями? Іменник: die Freunde (множина); власник: du (ти).",
    translation:"Ти вчишся зі своїми друзями?",studyTranslation:"Dativ · die Freunde → Freunden · твої",
    example:"Lernst du mit deinen Freunden?",explanation:"Mit вимагає Dativ. Множина: dein + -en → deinen; іменник також отримує -n: Freunde → Freunden.",
    category:"POSSESSIVE ENDING · DATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["deinen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-plural-our-children",targetId:"possessive-dative-plural",type:"cloze",word:"unseren",
    promptText:"Wir helfen ___ Kindern.",support:"Ми допомагаємо своїм дітям. Іменник: die Kinder (множина); власники: wir (ми).",
    translation:"Ми допомагаємо своїм дітям.",studyTranslation:"Dativ · die Kinder → Kindern · наші",
    example:"Wir helfen unseren Kindern.",explanation:"Helfen вимагає Dativ. Множина: unser + -en → unseren (також unsren); Kinder отримує -n: Kindern.",
    category:"POSSESSIVE ENDING · DATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["unseren","unsren"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-plural-their-cars",targetId:"possessive-dative-plural",type:"cloze",word:"ihren",
    promptText:"Sie fahren mit ___ Autos.",support:"Вони їдуть своїми автомобілями. Іменник: die Autos (множина); власники: sie (вони).",
    translation:"Вони їдуть своїми автомобілями.",studyTranslation:"Dativ · die Autos · їхні",
    example:"Sie fahren mit ihren Autos.",explanation:"Mit вимагає Dativ. Множина: ihr + -en → ihren. До множини на -s не додаємо -n: Autos. «Їхні» пишемо з малої літери.",
    category:"POSSESSIVE ENDING · DATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["ihren"],caseSensitive:true,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-plural-your-parents",targetId:"possessive-dative-plural",type:"cloze",word:"euren",
    promptText:"Wohnt ihr bei ___ Eltern?",support:"Ви живете у своїх батьків? Іменник: die Eltern (множина); власники: ihr (ви, неформально, кілька людей).",
    translation:"Ви живете у своїх батьків?",studyTranslation:"Dativ · die Eltern · ваші (неформально)",
    example:"Wohnt ihr bei euren Eltern?",explanation:"Bei вимагає Dativ. Множина: euer + -en → euren (також eueren). Eltern уже закінчується на -n, тому ще одне -n не додаємо.",
    category:"POSSESSIVE ENDING · DATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["euren","eueren"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"possessive-dative-plural-formal-children",targetId:"possessive-dative-plural",type:"cloze",word:"Ihren",
    promptText:"Ich gebe ___ Kindern die Bücher.",support:"Я даю Вашим дітям книжки. Іменник: die Kinder (множина); власник: Sie (Ви, ввічливо).",
    translation:"Я даю Вашим дітям книжки.",studyTranslation:"Dativ · die Kinder → Kindern · Ваші (ввічливо)",
    example:"Ich gebe Ihren Kindern die Bücher.",explanation:"З geben одержувачі стоять у Dativ. Множина: Ihr + -en → Ihren, з великої літери; Kinder → Kindern. Die Bücher — предмет в Akkusativ.",
    category:"POSSESSIVE ENDING · DATIV · PLURAL",practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:["Ihren"],caseSensitive:true,punctuationSensitive:false}
  }
];
// Explicit grammar metadata for the shared card visuals (Constitution §2, "Visual language").
const genderColumns=[
  {label:"der",gender:"masculine"},{label:"das",gender:"neuter"},
  {label:"die",gender:"feminine"},{label:"Plural",gender:"plural"}
];
const genderArticles={masculine:"der",neuter:"das",feminine:"die",plural:"die"};
// Definite articles in genderColumns order, shared by the guide tables.
const definiteArticles={nominative:["der","das","die","die"],accusative:["den","das","die","die"],dative:["dem","dem","der","den"]};
const nominativeArticleRow={label:"Nom.",title:"Nominativ",cells:definiteArticles.nominative};
// Gender is always authored here, never parsed from the headword. exampleWord defaults to the word;
// pass exampleWord:"" when the example uses a different form.
function nounMeta(gender,word,{exampleWord=word,plural="",pluralExampleWord="",givenInPractice=false}={}){
  return {
    article:genderArticles[gender],word,gender,
    ...(exampleWord?{exampleWord}:{}),
    ...(plural?{plural:{article:"die",word:plural,...(pluralExampleWord?{exampleWord:pluralExampleWord}:{})}}:{}),
    ...(givenInPractice?{givenInPractice:true}:{})
  };
}
function attachNouns(cards,nouns,key=card=>card.word){
  for(const card of cards){
    const noun=nouns[key(card)];
    if(noun)card.noun=noun;
  }
}
const possessiveEndings={
  nominative:{masculine:"",neuter:"",feminine:"e",plural:"e"},
  accusative:{masculine:"en",neuter:"",feminine:"e",plural:"e"},
  dative:{masculine:"em",neuter:"em",feminine:"er",plural:"en"}
};
const possessiveCaseRows=[
  {grammarCase:"nominative",label:"Nom.",title:"Nominativ"},
  {grammarCase:"accusative",label:"Akk.",title:"Akkusativ"},
  {grammarCase:"dative",label:"Dat.",title:"Dativ"}
];
const possessiveTargets={
  "possessive-accusative-masculine":{grammarCase:"accusative",gender:"masculine"},
  "possessive-accusative-neuter":{grammarCase:"accusative",gender:"neuter"},
  "possessive-accusative-feminine":{grammarCase:"accusative",gender:"feminine"},
  "possessive-accusative-plural":{grammarCase:"accusative",gender:"plural"},
  "possessive-dative-masculine":{grammarCase:"dative",gender:"masculine"},
  "possessive-dative-neuter":{grammarCase:"dative",gender:"neuter"},
  "possessive-dative-feminine":{grammarCase:"dative",gender:"feminine"},
  "possessive-dative-plural":{grammarCase:"dative",gender:"plural"}
};
// [owner stem, noun, noun as written in the example when it differs]
const possessiveCardNouns={
  "possessive-accusative-masculine-brother":["mein","Bruder"],
  "possessive-accusative-masculine-key":["dein","Schlüssel"],
  "possessive-accusative-masculine-her-father":["ihr","Vater"],
  "possessive-accusative-masculine-your-dog":["euer","Hund"],
  "possessive-accusative-masculine-formal-passport":["Ihr","Pass"],
  "possessive-accusative-neuter-our-car":["unser","Auto"],
  "possessive-accusative-neuter-his-book":["sein","Buch"],
  "possessive-accusative-neuter-their-child":["ihr","Kind"],
  "possessive-accusative-neuter-your-house":["euer","Haus"],
  "possessive-accusative-neuter-formal-ticket":["Ihr","Ticket"],
  "possessive-accusative-feminine-my-bag":["mein","Tasche"],
  "possessive-accusative-feminine-his-sister":["sein","Schwester"],
  "possessive-accusative-feminine-her-mother":["ihr","Mutter"],
  "possessive-accusative-feminine-your-apartment":["euer","Wohnung"],
  "possessive-accusative-feminine-formal-address":["Ihr","Adresse"],
  "possessive-accusative-plural-your-shoes":["dein","Schuhe"],
  "possessive-accusative-plural-our-friends":["unser","Freunde"],
  "possessive-accusative-plural-their-children":["ihr","Kinder"],
  "possessive-accusative-plural-your-parents":["euer","Eltern"],
  "possessive-accusative-plural-formal-bags":["Ihr","Taschen"],
  "possessive-dative-masculine-brother":["mein","Bruder"],
  "possessive-dative-masculine-your-father":["dein","Vater"],
  "possessive-dative-masculine-her-father":["ihr","Vater"],
  "possessive-dative-masculine-your-dog":["euer","Hund"],
  "possessive-dative-masculine-formal-husband":["Ihr","Mann"],
  "possessive-dative-neuter-our-car":["unser","Auto"],
  "possessive-dative-neuter-his-child":["sein","Kind"],
  "possessive-dative-neuter-their-child":["ihr","Kind"],
  "possessive-dative-neuter-your-house":["euer","Haus"],
  "possessive-dative-neuter-formal-car":["Ihr","Auto"],
  "possessive-dative-feminine-my-sister":["mein","Schwester"],
  "possessive-dative-feminine-his-mother":["sein","Mutter"],
  "possessive-dative-feminine-her-bag":["ihr","Tasche"],
  "possessive-dative-feminine-your-apartment":["euer","Wohnung"],
  "possessive-dative-feminine-formal-daughter":["Ihr","Tochter"],
  "possessive-dative-plural-your-friends":["dein","Freunde","Freunden"],
  "possessive-dative-plural-our-children":["unser","Kinder","Kindern"],
  "possessive-dative-plural-their-cars":["ihr","Autos"],
  "possessive-dative-plural-your-parents":["euer","Eltern"],
  "possessive-dative-plural-formal-children":["Ihr","Kinder","Kindern"]
};
function possessiveParts(owner,ending){
  // euer drops its inner e before an ending: eure, euren, eurem.
  return {stem:ending&&owner==="euer"?"eur":owner,ending};
}
function possessiveVisuals(owner,grammarCase,gender,noun,exampleWord=noun){
  return {
    noun:nounMeta(gender,noun,{exampleWord}),
    answerParts:possessiveParts(owner,possessiveEndings[grammarCase][gender]),
    paradigm:{
      title:`${owner} + закінчення`,
      columns:genderColumns,
      rows:possessiveCaseRows.map(row=>({label:row.label,title:row.title,cells:genderColumns.map(column=>possessiveParts(owner,possessiveEndings[row.grammarCase][column.gender]))})),
      active:{row:possessiveCaseRows.findIndex(row=>row.grammarCase===grammarCase),column:genderColumns.findIndex(column=>column.gender===gender)}
    }
  };
}
for(const card of [...possessiveAccusativeCards,...possessiveDativeCards]){
  const {grammarCase,gender}=possessiveTargets[card.targetId];
  const [owner,noun,exampleWord=noun]=possessiveCardNouns[card.id];
  Object.assign(card,possessiveVisuals(owner,grammarCase,gender,noun,exampleWord));
}
// Nominativ possessives: [owner stem, noun, gender] keyed by the headword.
const possessiveNominativeNouns={
  mein:["mein","Bruder","masculine"],dein:["dein","Buch","neuter"],sein:["sein","Auto","neuter"],
  unser:["unser","Kurs","masculine"],euer:["euer","Haus","neuter"],Ihr:["Ihr","Name","masculine"],
  meine:["mein","Mutter","feminine"],deine:["dein","Freunde","plural"],
  unsere:["unser","Wohnung","feminine"],Ihre:["Ihr","Kinder","plural"]
};
for(const card of possessivePronounCards){
  const nominative=possessiveNominativeNouns[card.word];
  if(nominative){
    const [owner,noun,gender]=nominative;
    Object.assign(card,possessiveVisuals(owner,"nominative",gender,noun));
  }
}
// "ihr / ihre" accepts both forms, so it shows only the noun, not one answer split.
attachNouns(possessivePronounCards,{
  "possessive-her":nounMeta("feminine","Tasche"),
  "possessive-their":nounMeta("plural","Kinder")
},card=>card.targetId);
const possessiveCaseCards=[...possessiveAccusativeCards,...possessiveDativeCards];
const possessiveMixedCards=possessiveCaseCards.map(card=>({...card,category:"POSSESSIVE ENDING"}));
// Indefinite article: ein has no plural. kein takes the same endings and adds keine (Nom., Akk.) and keinen (Dat.) in the plural.
const indefiniteArticleEndings={
  ein:{
    nominative:{masculine:"",neuter:"",feminine:"e"},
    accusative:{masculine:"en",neuter:"",feminine:"e"},
    dative:{masculine:"em",neuter:"em",feminine:"er"}
  },
  kein:{
    nominative:{masculine:"",neuter:"",feminine:"e",plural:"e"},
    accusative:{masculine:"en",neuter:"",feminine:"e",plural:"e"},
    dative:{masculine:"em",neuter:"em",feminine:"er",plural:"en"}
  }
};
const indefiniteCaseRows=[
  {grammarCase:"nominative",label:"Nom.",title:"Nominativ"},
  {grammarCase:"accusative",label:"Akk.",title:"Akkusativ"},
  {grammarCase:"dative",label:"Dat.",title:"Dativ"}
];
const indefiniteTargets={
  "ein-nominative-masculine":{article:"ein",grammarCase:"nominative",gender:"masculine"},
  "ein-nominative-neuter":{article:"ein",grammarCase:"nominative",gender:"neuter"},
  "ein-nominative-feminine":{article:"ein",grammarCase:"nominative",gender:"feminine"},
  "ein-accusative-masculine":{article:"ein",grammarCase:"accusative",gender:"masculine"},
  "ein-accusative-neuter":{article:"ein",grammarCase:"accusative",gender:"neuter"},
  "ein-accusative-feminine":{article:"ein",grammarCase:"accusative",gender:"feminine"},
  "ein-dative-masculine":{article:"ein",grammarCase:"dative",gender:"masculine"},
  "ein-dative-neuter":{article:"ein",grammarCase:"dative",gender:"neuter"},
  "ein-dative-feminine":{article:"ein",grammarCase:"dative",gender:"feminine"},
  "kein-nominative-masculine":{article:"kein",grammarCase:"nominative",gender:"masculine"},
  "kein-nominative-neuter":{article:"kein",grammarCase:"nominative",gender:"neuter"},
  "kein-nominative-feminine":{article:"kein",grammarCase:"nominative",gender:"feminine"},
  "kein-nominative-plural":{article:"kein",grammarCase:"nominative",gender:"plural"},
  "kein-accusative-masculine":{article:"kein",grammarCase:"accusative",gender:"masculine"},
  "kein-accusative-neuter":{article:"kein",grammarCase:"accusative",gender:"neuter"},
  "kein-accusative-feminine":{article:"kein",grammarCase:"accusative",gender:"feminine"},
  "kein-accusative-plural":{article:"kein",grammarCase:"accusative",gender:"plural"},
  "kein-dative-masculine":{article:"kein",grammarCase:"dative",gender:"masculine"},
  "kein-dative-neuter":{article:"kein",grammarCase:"dative",gender:"neuter"},
  "kein-dative-feminine":{article:"kein",grammarCase:"dative",gender:"feminine"},
  "kein-dative-plural":{article:"kein",grammarCase:"dative",gender:"plural"}
};
const indefiniteArticleCategory={ein:"UNBESTIMMTER ARTIKEL",kein:"NEGATIVARTIKEL"};
const indefiniteCaseCategory={nominative:"NOMINATIV",accusative:"AKKUSATIV",dative:"DATIV"};
const indefiniteCaseTitle={nominative:"Nominativ",accusative:"Akkusativ",dative:"Dativ"};
const indefiniteGenderCategory={masculine:"MASKULINUM",neuter:"NEUTRUM",feminine:"FEMININUM",plural:"PLURAL"};
// ein shows only the three singular columns; kein also shows the plural column.
function indefiniteVisuals(article,grammarCase,gender,noun,exampleWord){
  const columns=article==="ein"?genderColumns.slice(0,3):genderColumns;
  const endings=indefiniteArticleEndings[article];
  return {
    noun:nounMeta(gender,noun,{exampleWord}),
    answerParts:{stem:article,ending:endings[grammarCase][gender]},
    paradigm:{
      title:`${article} + закінчення`,
      columns,
      rows:indefiniteCaseRows.map(row=>({label:row.label,title:row.title,cells:columns.map(column=>({stem:article,ending:endings[row.grammarCase][column.gender]}))})),
      active:{row:indefiniteCaseRows.findIndex(row=>row.grammarCase===grammarCase),column:columns.findIndex(column=>column.gender===gender)}
    }
  };
}
function indefiniteCard(id,targetId,{word,noun,promptText,support,translation,example,explanation,exampleWord=noun}){
  const target=indefiniteTargets[targetId];
  if(!target)throw new Error(`Unknown indefinite article target: ${targetId}`);
  const {article,grammarCase,gender}=target;
  return {
    id,targetId,type:"cloze",word,promptText,support,translation,
    studyTranslation:`${indefiniteCaseTitle[grammarCase]} · ${genderArticles[gender]} ${noun}`,
    example,explanation,
    category:`${indefiniteArticleCategory[article]} · ${indefiniteCaseCategory[grammarCase]} · ${indefiniteGenderCategory[gender]}`,
    practiceVariants:false,
    response:{mode:"text",scope:"word",accepted:[word],caseSensitive:false,punctuationSensitive:false},
    ...indefiniteVisuals(article,grammarCase,gender,noun,exampleWord)
  };
}
const indefiniteNominativeCards=[
  indefiniteCard("ein-nominative-masculine-tisch","ein-nominative-masculine",{word:"ein",noun:"Tisch",promptText:"Das ist ___ Tisch.",support:"Ствердження: стіл.",translation:"Це стіл.",example:"Das ist ein Tisch.",explanation:"Tisch — чоловічий рід. У Nominativ після ist стоїть ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-stuhl","ein-nominative-masculine",{word:"ein",noun:"Stuhl",promptText:"Hier steht ___ Stuhl.",support:"Ствердження: стілець.",translation:"Тут стоїть стілець.",example:"Hier steht ein Stuhl.",explanation:"Stuhl — чоловічий рід, тому ein без закінчення як підмет речення."}),
  indefiniteCard("ein-nominative-masculine-schluessel","ein-nominative-masculine",{word:"ein",noun:"Schlüssel",promptText:"Auf dem Tisch liegt ___ Schlüssel.",support:"Ствердження: ключ.",translation:"На столі лежить ключ.",example:"Auf dem Tisch liegt ein Schlüssel.",explanation:"Liegen має підмет у Nominativ. Schlüssel — чоловічий рід: ein без закінчення."}),
  indefiniteCard("ein-nominative-neuter-buch","ein-nominative-neuter",{word:"ein",noun:"Buch",promptText:"Das ist ___ Buch.",support:"Ствердження: книжка.",translation:"Це книжка.",example:"Das ist ein Buch.",explanation:"Buch — середній рід. У Nominativ ein без закінчення, як і для чоловічого роду."}),
  indefiniteCard("ein-nominative-neuter-auto","ein-nominative-neuter",{word:"ein",noun:"Auto",promptText:"Das ist ___ Auto.",support:"Ствердження: автомобіль.",translation:"Це автомобіль.",example:"Das ist ein Auto.",explanation:"Auto — середній рід, тому ein без закінчення."}),
  indefiniteCard("ein-nominative-neuter-cafe","ein-nominative-neuter",{word:"ein",noun:"Café",promptText:"Neben dem Park ist ___ Café.",support:"Ствердження: кафе.",translation:"Поруч із парком є кафе.",example:"Neben dem Park ist ein Café.",explanation:"Café — середній рід. Після ist у Nominativ стоїть ein без закінчення."}),
  indefiniteCard("ein-nominative-feminine-lampe","ein-nominative-feminine",{word:"eine",noun:"Lampe",promptText:"Das ist ___ Lampe.",support:"Ствердження: лампа.",translation:"Це лампа.",example:"Das ist eine Lampe.",explanation:"Lampe — жіночий рід. У Nominativ ein отримує закінчення -e: eine."}),
  indefiniteCard("ein-nominative-feminine-uhr","ein-nominative-feminine",{word:"eine",noun:"Uhr",promptText:"Hier ist ___ Uhr.",support:"Ствердження: годинник.",translation:"Тут є годинник.",example:"Hier ist eine Uhr.",explanation:"Uhr — жіночий рід, тому eine."}),
  indefiniteCard("ein-nominative-feminine-katze","ein-nominative-feminine",{word:"eine",noun:"Katze",promptText:"Auf dem Sofa liegt ___ Katze.",support:"Ствердження: кішка.",translation:"На дивані лежить кішка.",example:"Auf dem Sofa liegt eine Katze.",explanation:"Katze — жіночий рід, тому eine як підмет у Nominativ."})
];
const indefiniteAccusativeCards=[
  indefiniteCard("ein-accusative-masculine-hund","ein-accusative-masculine",{word:"einen",noun:"Hund",promptText:"Ich habe ___ Hund.",support:"Ствердження: собака.",translation:"У мене є собака.",example:"Ich habe einen Hund.",explanation:"Haben вимагає Akkusativ. Hund — чоловічий рід: ein + -en → einen."}),
  indefiniteCard("ein-accusative-masculine-stift","ein-accusative-masculine",{word:"einen",noun:"Stift",promptText:"Ich brauche ___ Stift.",support:"Ствердження: ручка.",translation:"Мені потрібна ручка.",example:"Ich brauche einen Stift.",explanation:"Brauchen вимагає Akkusativ. Stift — чоловічий рід, тому einen."}),
  indefiniteCard("ein-accusative-masculine-kuchen","ein-accusative-masculine",{word:"einen",noun:"Kuchen",promptText:"Kaufst du ___ Kuchen?",support:"Ствердження: торт.",translation:"Ти купуєш торт?",example:"Kaufst du einen Kuchen?",explanation:"Kaufen має прямий додаток в Akkusativ. Kuchen — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-neuter-buch","ein-accusative-neuter",{word:"ein",noun:"Buch",promptText:"Ich lese ___ Buch.",support:"Ствердження: книжка.",translation:"Я читаю книжку.",example:"Ich lese ein Buch.",explanation:"Lesen вимагає Akkusativ. Buch — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-auto","ein-accusative-neuter",{word:"ein",noun:"Auto",promptText:"Wir kaufen ___ Auto.",support:"Ствердження: автомобіль.",translation:"Ми купуємо автомобіль.",example:"Wir kaufen ein Auto.",explanation:"Kaufen вимагає Akkusativ. Auto — середній рід, тому ein не змінюється."}),
  indefiniteCard("ein-accusative-neuter-handy","ein-accusative-neuter",{word:"ein",noun:"Handy",promptText:"Ich brauche ___ Handy.",support:"Ствердження: телефон.",translation:"Мені потрібен телефон.",example:"Ich brauche ein Handy.",explanation:"Brauchen вимагає Akkusativ. Handy — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-feminine-tasche","ein-accusative-feminine",{word:"eine",noun:"Tasche",promptText:"Ich habe ___ Tasche.",support:"Ствердження: сумка.",translation:"У мене є сумка.",example:"Ich habe eine Tasche.",explanation:"Haben вимагає Akkusativ. Tasche — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-brille","ein-accusative-feminine",{word:"eine",noun:"Brille",promptText:"Ich brauche ___ Brille.",support:"Ствердження: окуляри.",translation:"Мені потрібні окуляри.",example:"Ich brauche eine Brille.",explanation:"Brauchen вимагає Akkusativ. Brille — жіночий рід, тому eine."}),
  indefiniteCard("ein-accusative-feminine-katze","ein-accusative-feminine",{word:"eine",noun:"Katze",promptText:"Sie sieht ___ Katze im Garten.",support:"Ствердження: кішка.",translation:"Вона бачить кішку в саду.",example:"Sie sieht eine Katze im Garten.",explanation:"Sehen вимагає Akkusativ. Katze — жіночий рід: eine без змін."})
];
const indefiniteDativeCards=[
  indefiniteCard("ein-dative-masculine-stift","ein-dative-masculine",{word:"einem",noun:"Stift",promptText:"Ich schreibe mit ___ Stift.",support:"Ствердження: ручка.",translation:"Я пишу ручкою.",example:"Ich schreibe mit einem Stift.",explanation:"Mit вимагає Dativ. Stift — чоловічий рід: ein + -em → einem."}),
  indefiniteCard("ein-dative-masculine-freund","ein-dative-masculine",{word:"einem",noun:"Freund",promptText:"Ich helfe ___ Freund.",support:"Ствердження: друг.",translation:"Я допомагаю другові.",example:"Ich helfe einem Freund.",explanation:"Helfen вимагає Dativ: кому? Freund — чоловічий рід, тому einem."}),
  indefiniteCard("ein-dative-masculine-bus","ein-dative-masculine",{word:"einem",noun:"Bus",promptText:"Ich fahre mit ___ Bus.",support:"Ствердження: автобус.",translation:"Я їду автобусом.",example:"Ich fahre mit einem Bus.",explanation:"Mit завжди вимагає Dativ. Bus — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-neuter-haus","ein-dative-neuter",{word:"einem",noun:"Haus",promptText:"Ich wohne in ___ Haus.",support:"Ствердження: будинок.",translation:"Я живу в будинку.",example:"Ich wohne in einem Haus.",explanation:"In з місцем (Wo?) вимагає Dativ. Haus — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-kind","ein-dative-neuter",{word:"einem",noun:"Kind",promptText:"Ich zeige ___ Kind den Weg.",support:"Ствердження: дитина.",translation:"Я показую дитині дорогу.",example:"Ich zeige einem Kind den Weg.",explanation:"Zeigen: кому? Одержувач стоїть у Dativ. Kind — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-bett","ein-dative-neuter",{word:"einem",noun:"Bett",promptText:"Das Buch liegt auf ___ Bett.",support:"Ствердження: ліжко.",translation:"Книжка лежить на ліжку.",example:"Das Buch liegt auf einem Bett.",explanation:"Auf з місцем (Wo?) вимагає Dativ. Bett — середній рід: einem."}),
  indefiniteCard("ein-dative-feminine-wohnung","ein-dative-feminine",{word:"einer",noun:"Wohnung",promptText:"Ich wohne in ___ Wohnung.",support:"Ствердження: квартира.",translation:"Я живу в квартирі.",example:"Ich wohne in einer Wohnung.",explanation:"In з місцем (Wo?) вимагає Dativ. Wohnung — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-kollegin","ein-dative-feminine",{word:"einer",noun:"Kollegin",promptText:"Ich antworte ___ Kollegin.",support:"Ствердження: колега.",translation:"Я відповідаю колезі.",example:"Ich antworte einer Kollegin.",explanation:"Antworten вимагає Dativ. Kollegin — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-freundin","ein-dative-feminine",{word:"einer",noun:"Freundin",promptText:"Ich schreibe ___ Freundin eine Nachricht.",support:"Ствердження: подруга.",translation:"Я пишу подрузі повідомлення.",example:"Ich schreibe einer Freundin eine Nachricht.",explanation:"Schreiben: кому? Одержувач у Dativ. Freundin — жіночий рід: einer."})
];
const negativeNominativeCards=[
  indefiniteCard("kein-nominative-masculine-schluessel","kein-nominative-masculine",{word:"kein",noun:"Schlüssel",promptText:"Das ist ___ Schlüssel.",support:"Заперечення: ключ.",translation:"Це не ключ.",example:"Das ist kein Schlüssel.",explanation:"Kein заперечує ein. Schlüssel — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-masculine-krimi","kein-nominative-masculine",{word:"kein",noun:"Krimi",promptText:"Der Film ist ___ Krimi.",support:"Заперечення: детектив.",translation:"Це не детектив.",example:"Der Film ist kein Krimi.",explanation:"Після ist стоїть Nominativ. Krimi — чоловічий рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-masculine-stift","kein-nominative-masculine",{word:"kein",noun:"Stift",promptText:"Auf dem Tisch liegt ___ Stift.",support:"Заперечення: ручка.",translation:"На столі немає ручки.",example:"Auf dem Tisch liegt kein Stift.",explanation:"Заперечення «немає» має kein замість ein. Stift — чоловічий рід, тому kein."}),
  indefiniteCard("kein-nominative-neuter-handy","kein-nominative-neuter",{word:"kein",noun:"Handy",promptText:"Das ist ___ Handy.",support:"Заперечення: телефон.",translation:"Це не телефон.",example:"Das ist kein Handy.",explanation:"Kein заперечує ein. Handy — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-problem","kein-nominative-neuter",{word:"kein",noun:"Problem",promptText:"Das ist ___ Problem.",support:"Заперечення: проблема.",translation:"Це не проблема.",example:"Das ist kein Problem.",explanation:"Problem — середній рід: kein без закінчення. Так говорять «Kein Problem!»."}),
  indefiniteCard("kein-nominative-neuter-brot","kein-nominative-neuter",{word:"kein",noun:"Brot",promptText:"Im Kühlschrank liegt ___ Brot.",support:"Заперечення: хліб.",translation:"У холодильнику немає хліба.",example:"Im Kühlschrank liegt kein Brot.",explanation:"Brot — підмет у Nominativ і середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-feminine-lampe","kein-nominative-feminine",{word:"keine",noun:"Lampe",promptText:"Das ist ___ Lampe.",support:"Заперечення: лампа.",translation:"Це не лампа.",example:"Das ist keine Lampe.",explanation:"Lampe — жіночий рід: kein + -e → keine в Nominativ."}),
  indefiniteCard("kein-nominative-feminine-uhr","kein-nominative-feminine",{word:"keine",noun:"Uhr",promptText:"Das ist ___ Uhr.",support:"Заперечення: годинник.",translation:"Це не годинник.",example:"Das ist keine Uhr.",explanation:"Uhr — жіночий рід, тому keine у Nominativ."}),
  indefiniteCard("kein-nominative-feminine-decke","kein-nominative-feminine",{word:"keine",noun:"Decke",promptText:"Auf dem Sofa liegt ___ Decke.",support:"Заперечення: ковдра.",translation:"На дивані немає ковдри.",example:"Auf dem Sofa liegt keine Decke.",explanation:"Decke — жіночий рід: keine як підмет у Nominativ."}),
  indefiniteCard("kein-nominative-plural-buecher","kein-nominative-plural",{word:"keine",noun:"Bücher",promptText:"Das sind ___ Bücher.",support:"Заперечення: книжки.",translation:"Це не книжки.",example:"Das sind keine Bücher.",explanation:"У множині kein має форму keine для Nominativ, а іменник стоїть без артикля."}),
  indefiniteCard("kein-nominative-plural-kinder","kein-nominative-plural",{word:"keine",noun:"Kinder",promptText:"Hier sind ___ Kinder.",support:"Заперечення: діти.",translation:"Тут немає дітей.",example:"Hier sind keine Kinder.",explanation:"Множина: kein → keine в Nominativ для всіх родів."}),
  indefiniteCard("kein-nominative-plural-stifte","kein-nominative-plural",{word:"keine",noun:"Stifte",promptText:"Auf dem Tisch liegen ___ Stifte.",support:"Заперечення: ручки.",translation:"На столі немає ручок.",example:"Auf dem Tisch liegen keine Stifte.",explanation:"Stifte — множина, тому keine в Nominativ."})
];
const negativeAccusativeCards=[
  indefiniteCard("kein-accusative-masculine-schluessel","kein-accusative-masculine",{word:"keinen",noun:"Schlüssel",promptText:"Ich brauche ___ Schlüssel.",support:"Заперечення: ключ.",translation:"Мені не потрібен ключ.",example:"Ich brauche keinen Schlüssel.",explanation:"Brauchen вимагає Akkusativ. Schlüssel — чоловічий рід: kein + -en → keinen."}),
  indefiniteCard("kein-accusative-masculine-kuchen","kein-accusative-masculine",{word:"keinen",noun:"Kuchen",promptText:"Ich kaufe ___ Kuchen.",support:"Заперечення: торт.",translation:"Я не купую торт.",example:"Ich kaufe keinen Kuchen.",explanation:"Kaufen вимагає Akkusativ. Kuchen — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-masculine-stift","kein-accusative-masculine",{word:"keinen",noun:"Stift",promptText:"Hast du ___ Stift?",support:"Заперечення: ручка.",translation:"У тебе немає ручки?",example:"Hast du keinen Stift?",explanation:"Haben вимагає Akkusativ. Stift — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-neuter-auto","kein-accusative-neuter",{word:"kein",noun:"Auto",promptText:"Ich habe ___ Auto.",support:"Заперечення: автомобіль.",translation:"У мене немає машини.",example:"Ich habe kein Auto.",explanation:"Haben вимагає Akkusativ. Auto — середній рід: kein без закінчення."}),
  indefiniteCard("kein-accusative-neuter-handy","kein-accusative-neuter",{word:"kein",noun:"Handy",promptText:"Er kauft ___ Handy.",support:"Заперечення: телефон.",translation:"Він не купує телефону.",example:"Er kauft kein Handy.",explanation:"Kaufen вимагає Akkusativ. Handy — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-bett","kein-accusative-neuter",{word:"kein",noun:"Bett",promptText:"Ich brauche ___ Bett.",support:"Заперечення: ліжко.",translation:"Мені не потрібне ліжко.",example:"Ich brauche kein Bett.",explanation:"Brauchen вимагає Akkusativ. Bett — середній рід: kein без закінчення."}),
  indefiniteCard("kein-accusative-feminine-zeit","kein-accusative-feminine",{word:"keine",noun:"Zeit",promptText:"Sie hat ___ Zeit.",support:"Заперечення: час.",translation:"У неї немає часу.",example:"Sie hat keine Zeit.",explanation:"Haben вимагає Akkusativ. Zeit — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-lampe","kein-accusative-feminine",{word:"keine",noun:"Lampe",promptText:"Wir kaufen ___ Lampe.",support:"Заперечення: лампа.",translation:"Ми не купуємо лампу.",example:"Wir kaufen keine Lampe.",explanation:"Kaufen вимагає Akkusativ. Lampe — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-katze","kein-accusative-feminine",{word:"keine",noun:"Katze",promptText:"Ich sehe ___ Katze.",support:"Заперечення: кішка.",translation:"Я не бачу жодної кішки.",example:"Ich sehe keine Katze.",explanation:"Sehen вимагає Akkusativ. Katze — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-plural-buecher","kein-accusative-plural",{word:"keine",noun:"Bücher",promptText:"Ich habe ___ Bücher.",support:"Заперечення: книжки.",translation:"У мене немає книжок.",example:"Ich habe keine Bücher.",explanation:"Haben вимагає Akkusativ. У множині kein має форму keine."}),
  indefiniteCard("kein-accusative-plural-autos","kein-accusative-plural",{word:"keine",noun:"Autos",promptText:"Wir kaufen ___ Autos.",support:"Заперечення: автомобілі.",translation:"Ми не купуємо жодних машин.",example:"Wir kaufen keine Autos.",explanation:"Kaufen вимагає Akkusativ. Autos — множина: keine."}),
  indefiniteCard("kein-accusative-plural-katzen","kein-accusative-plural",{word:"keine",noun:"Katzen",promptText:"Hast du ___ Katzen?",support:"Заперечення: кішки.",translation:"У тебе немає кішок?",example:"Hast du keine Katzen?",explanation:"Haben вимагає Akkusativ. Katzen — множина: keine."})
];
const negativeDativeCards=[
  indefiniteCard("kein-dative-masculine-zug","kein-dative-masculine",{word:"keinem",noun:"Zug",promptText:"Heute fahre ich mit ___ Zug.",support:"Заперечення: потяг.",translation:"Сьогодні я не їду жодним потягом.",example:"Heute fahre ich mit keinem Zug.",explanation:"Mit вимагає Dativ. Zug — чоловічий рід: kein + -em → keinem."}),
  indefiniteCard("kein-dative-masculine-bleistift","kein-dative-masculine",{word:"keinem",noun:"Bleistift",promptText:"Ich schreibe mit ___ Bleistift.",support:"Заперечення: олівець.",translation:"Я не пишу жодним олівцем.",example:"Ich schreibe mit keinem Bleistift.",explanation:"Mit вимагає Dativ. Bleistift — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-computer","kein-dative-masculine",{word:"keinem",noun:"Computer",promptText:"Ich arbeite an ___ Computer.",support:"Заперечення: комп’ютер.",translation:"Я не працюю за жодним комп’ютером.",example:"Ich arbeite an keinem Computer.",explanation:"An з місцем (Wo?) вимагає Dativ. Computer — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-neuter-auto","kein-dative-neuter",{word:"keinem",noun:"Auto",promptText:"Ich fahre mit ___ Auto.",support:"Заперечення: автомобіль.",translation:"Я не їду жодним автомобілем.",example:"Ich fahre mit keinem Auto.",explanation:"Mit вимагає Dativ. Auto — середній рід: kein + -em → keinem."}),
  indefiniteCard("kein-dative-neuter-dorf","kein-dative-neuter",{word:"keinem",noun:"Dorf",promptText:"Ich wohne in ___ Dorf.",support:"Заперечення: село.",translation:"Я не живу в жодному селі.",example:"Ich wohne in keinem Dorf.",explanation:"In з місцем (Wo?) вимагає Dativ. Dorf — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-maedchen","kein-dative-neuter",{word:"keinem",noun:"Mädchen",promptText:"Er hilft ___ Mädchen.",support:"Заперечення: дівчинка.",translation:"Він не допомагає жодній дівчинці.",example:"Er hilft keinem Mädchen.",explanation:"Helfen вимагає Dativ: кому? Mädchen — середній рід: keinem."}),
  indefiniteCard("kein-dative-feminine-freundin","kein-dative-feminine",{word:"keiner",noun:"Freundin",promptText:"Ich gehe mit ___ Freundin ins Kino.",support:"Заперечення: подруга.",translation:"Я не ходжу в кіно з жодною подругою.",example:"Ich gehe mit keiner Freundin ins Kino.",explanation:"Mit вимагає Dativ. Freundin — жіночий рід: kein + -er → keiner."}),
  indefiniteCard("kein-dative-feminine-lehrerin","kein-dative-feminine",{word:"keiner",noun:"Lehrerin",promptText:"Ich schreibe ___ Lehrerin.",support:"Заперечення: вчителька.",translation:"Я не пишу жодній вчительці.",example:"Ich schreibe keiner Lehrerin.",explanation:"Schreiben вимагає Dativ: кому? Lehrerin — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-mutter","kein-dative-feminine",{word:"keiner",noun:"Mutter",promptText:"Er schenkt ___ Mutter Blumen.",support:"Заперечення: мама.",translation:"Він не дарує квітів жодній матері.",example:"Er schenkt keiner Mutter Blumen.",explanation:"Schenken: кому? Одержувач у Dativ. Mutter — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-plural-kinder","kein-dative-plural",{word:"keinen",noun:"Kinder",exampleWord:"Kindern",promptText:"Ich helfe ___ Kindern.",support:"Заперечення: діти.",translation:"Я не допомагаю жодним дітям.",example:"Ich helfe keinen Kindern.",explanation:"Helfen вимагає Dativ. У Dativ множини kein → keinen, а іменник отримує -n: Kindern."}),
  indefiniteCard("kein-dative-plural-freunde","kein-dative-plural",{word:"keinen",noun:"Freunde",exampleWord:"Freunden",promptText:"Ich fahre mit ___ Freunden nach Berlin.",support:"Заперечення: друзі.",translation:"Я не їду до Берліна з жодними друзями.",example:"Ich fahre mit keinen Freunden nach Berlin.",explanation:"Mit вимагає Dativ. Freunde в Dativ множини отримують -n: Freunden, а kein → keinen."}),
  indefiniteCard("kein-dative-plural-katzen","kein-dative-plural",{word:"keinen",noun:"Katzen",promptText:"Sie spielt mit ___ Katzen.",support:"Заперечення: кішки.",translation:"Вона не грається з жодними кішками.",example:"Sie spielt mit keinen Katzen.",explanation:"Mit вимагає Dativ. Katzen уже закінчується на -n, тому додаткового -n немає."})
];
const indefiniteArticleCards=[...indefiniteNominativeCards,...indefiniteAccusativeCards,...indefiniteDativeCards,...negativeNominativeCards,...negativeAccusativeCards,...negativeDativeCards];
// Practice-only variants: six more per target (nine in total), so each practice pool is three times its learn cards.
const indefinitePracticeExtraCards=[
  indefiniteCard("ein-nominative-masculine-rucksack","ein-nominative-masculine",{word:"ein",noun:"Rucksack",promptText:"Hier liegt ___ Rucksack.",support:"Ствердження: рюкзак.",translation:"Тут лежить рюкзак.",example:"Hier liegt ein Rucksack.",explanation:"Rucksack — чоловічий рід. Після liegt у Nominativ стоїть ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-computer","ein-nominative-masculine",{word:"ein",noun:"Computer",promptText:"Auf dem Schreibtisch steht ___ Computer.",support:"Ствердження: комп’ютер.",translation:"На письмовому столі стоїть комп’ютер.",example:"Auf dem Schreibtisch steht ein Computer.",explanation:"Computer — чоловічий рід. Підмет речення стоїть у Nominativ: ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-apfel","ein-nominative-masculine",{word:"ein",noun:"Apfel",promptText:"Ist das ___ Apfel?",support:"Ствердження: яблуко.",translation:"Це яблуко?",example:"Ist das ein Apfel?",explanation:"Apfel — чоловічий рід. Після ist у питанні стоїть Nominativ: ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-mantel","ein-nominative-masculine",{word:"ein",noun:"Mantel",promptText:"Im Schrank hängt ___ Mantel.",support:"Ствердження: пальто.",translation:"У шафі висить пальто.",example:"Im Schrank hängt ein Mantel.",explanation:"Mantel — чоловічий рід. Підмет hängt стоїть у Nominativ: ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-film","ein-nominative-masculine",{word:"ein",noun:"Film",promptText:"Heute kommt ___ Film im Fernsehen.",support:"Ствердження: фільм.",translation:"Сьогодні по телевізору йде фільм.",example:"Heute kommt ein Film im Fernsehen.",explanation:"Film — чоловічий рід. Підмет kommt стоїть у Nominativ: ein без закінчення."}),
  indefiniteCard("ein-nominative-masculine-baum","ein-nominative-masculine",{word:"ein",noun:"Baum",promptText:"Vor dem Haus steht ___ Baum.",support:"Ствердження: дерево.",translation:"Перед будинком стоїть дерево.",example:"Vor dem Haus steht ein Baum.",explanation:"Baum — чоловічий рід. Підмет steht у Nominativ: ein без закінчення."}),
  indefiniteCard("ein-nominative-neuter-sofa","ein-nominative-neuter",{word:"ein",noun:"Sofa",promptText:"Im Wohnzimmer steht ___ Sofa.",support:"Ствердження: диван.",translation:"У вітальні стоїть диван.",example:"Im Wohnzimmer steht ein Sofa.",explanation:"Sofa — середній рід. Підмет у Nominativ: ein без змін."}),
  indefiniteCard("ein-nominative-neuter-zimmer","ein-nominative-neuter",{word:"ein",noun:"Zimmer",promptText:"Oben ist ___ Zimmer frei.",support:"Ствердження: кімната.",translation:"Нагорі є вільна кімната.",example:"Oben ist ein Zimmer frei.",explanation:"Zimmer — середній рід. Після ist у Nominativ стоїть ein без закінчення."}),
  indefiniteCard("ein-nominative-neuter-radio","ein-nominative-neuter",{word:"ein",noun:"Radio",promptText:"Neben dem Bett steht ___ Radio.",support:"Ствердження: радіо.",translation:"Біля ліжка стоїть радіо.",example:"Neben dem Bett steht ein Radio.",explanation:"Radio — середній рід. Підмет steht у Nominativ: ein без змін."}),
  indefiniteCard("ein-nominative-neuter-museum","ein-nominative-neuter",{word:"ein",noun:"Museum",promptText:"In der Stadt ist ___ Museum.",support:"Ствердження: музей.",translation:"У місті є музей.",example:"In der Stadt ist ein Museum.",explanation:"Museum — середній рід. Після ist у Nominativ стоїть ein без змін."}),
  indefiniteCard("ein-nominative-neuter-geschenk","ein-nominative-neuter",{word:"ein",noun:"Geschenk",promptText:"Das ist ___ Geschenk für dich.",support:"Ствердження: подарунок.",translation:"Це подарунок для тебе.",example:"Das ist ein Geschenk für dich.",explanation:"Geschenk — середній рід. Після ist у Nominativ стоїть ein без змін."}),
  indefiniteCard("ein-nominative-neuter-heft","ein-nominative-neuter",{word:"ein",noun:"Heft",promptText:"In meiner Tasche liegt ___ Heft.",support:"Ствердження: зошит.",translation:"У моїй сумці лежить зошит.",example:"In meiner Tasche liegt ein Heft.",explanation:"Heft — середній рід. Підмет liegt у Nominativ: ein без змін."}),
  indefiniteCard("ein-nominative-feminine-blume","ein-nominative-feminine",{word:"eine",noun:"Blume",promptText:"Auf dem Fensterbrett steht ___ Blume.",support:"Ствердження: квітка.",translation:"На підвіконні стоїть квітка.",example:"Auf dem Fensterbrett steht eine Blume.",explanation:"Blume — жіночий рід: ein + -e → eine в Nominativ."}),
  indefiniteCard("ein-nominative-feminine-jacke","ein-nominative-feminine",{word:"eine",noun:"Jacke",promptText:"Hier ist ___ Jacke für dich.",support:"Ствердження: куртка.",translation:"Ось куртка для тебе.",example:"Hier ist eine Jacke für dich.",explanation:"Jacke — жіночий рід. Після ist у Nominativ стоїть eine."}),
  indefiniteCard("ein-nominative-feminine-tuer","ein-nominative-feminine",{word:"eine",noun:"Tür",promptText:"Im Flur ist ___ Tür kaputt.",support:"Ствердження: двері.",translation:"У коридорі зламані двері.",example:"Im Flur ist eine Tür kaputt.",explanation:"Tür — жіночий рід. Підмет речення стоїть у Nominativ: eine."}),
  indefiniteCard("ein-nominative-feminine-zeitung","ein-nominative-feminine",{word:"eine",noun:"Zeitung",promptText:"Im Briefkasten liegt ___ Zeitung.",support:"Ствердження: газета.",translation:"У поштовій скриньці лежить газета.",example:"Im Briefkasten liegt eine Zeitung.",explanation:"Zeitung — жіночий рід. Підмет liegt у Nominativ: eine."}),
  indefiniteCard("ein-nominative-feminine-kueche","ein-nominative-feminine",{word:"eine",noun:"Küche",promptText:"Neben dem Bad ist ___ Küche.",support:"Ствердження: кухня.",translation:"Поруч із ванною є кухня.",example:"Neben dem Bad ist eine Küche.",explanation:"Küche — жіночий рід. Після ist у Nominativ стоїть eine."}),
  indefiniteCard("ein-nominative-feminine-flasche","ein-nominative-feminine",{word:"eine",noun:"Flasche",promptText:"Im Kühlschrank steht ___ Flasche Wasser.",support:"Ствердження: пляшка.",translation:"У холодильнику стоїть пляшка води.",example:"Im Kühlschrank steht eine Flasche Wasser.",explanation:"Flasche — жіночий рід. Підмет steht у Nominativ: eine."}),
  indefiniteCard("ein-accusative-masculine-rucksack","ein-accusative-masculine",{word:"einen",noun:"Rucksack",promptText:"Ich trage ___ Rucksack.",support:"Ствердження: рюкзак.",translation:"Я ношу рюкзак.",example:"Ich trage einen Rucksack.",explanation:"Tragen має прямий додаток в Akkusativ. Rucksack — чоловічий рід: ein + -en → einen."}),
  indefiniteCard("ein-accusative-masculine-computer","ein-accusative-masculine",{word:"einen",noun:"Computer",promptText:"Mein Bruder kauft ___ Computer.",support:"Ствердження: комп’ютер.",translation:"Мій брат купує комп’ютер.",example:"Mein Bruder kauft einen Computer.",explanation:"Kaufen вимагає Akkusativ. Computer — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-masculine-tee","ein-accusative-masculine",{word:"einen",noun:"Tee",promptText:"Möchtest du ___ Tee?",support:"Ствердження: чай.",translation:"Хочеш чаю?",example:"Möchtest du einen Tee?",explanation:"Möchten вимагає Akkusativ. Tee — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-masculine-teller","ein-accusative-masculine",{word:"einen",noun:"Teller",promptText:"Sie holt ___ Teller aus dem Schrank.",support:"Ствердження: тарілка.",translation:"Вона дістає тарілку з шафи.",example:"Sie holt einen Teller aus dem Schrank.",explanation:"Holen вимагає Akkusativ. Teller — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-masculine-schirm","ein-accusative-masculine",{word:"einen",noun:"Schirm",promptText:"Bei Regen brauche ich ___ Schirm.",support:"Ствердження: парасолька.",translation:"Коли йде дощ, мені потрібна парасолька.",example:"Bei Regen brauche ich einen Schirm.",explanation:"Brauchen вимагає Akkusativ. Schirm — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-masculine-fernseher","ein-accusative-masculine",{word:"einen",noun:"Fernseher",promptText:"Wir haben ___ Fernseher im Wohnzimmer.",support:"Ствердження: телевізор.",translation:"У нас є телевізор у вітальні.",example:"Wir haben einen Fernseher im Wohnzimmer.",explanation:"Haben вимагає Akkusativ. Fernseher — чоловічий рід: einen."}),
  indefiniteCard("ein-accusative-neuter-heft","ein-accusative-neuter",{word:"ein",noun:"Heft",promptText:"Ich suche ___ Heft.",support:"Ствердження: зошит.",translation:"Я шукаю зошит.",example:"Ich suche ein Heft.",explanation:"Suchen вимагає Akkusativ. Heft — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-geschenk","ein-accusative-neuter",{word:"ein",noun:"Geschenk",promptText:"Er findet ___ Geschenk für Anna.",support:"Ствердження: подарунок.",translation:"Він знаходить подарунок для Анни.",example:"Er findet ein Geschenk für Anna.",explanation:"Finden вимагає Akkusativ. Geschenk — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-foto","ein-accusative-neuter",{word:"ein",noun:"Foto",promptText:"Sie macht ___ Foto vom Park.",support:"Ствердження: фото.",translation:"Вона робить фото парку.",example:"Sie macht ein Foto vom Park.",explanation:"Machen вимагає Akkusativ. Foto — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-ticket","ein-accusative-neuter",{word:"ein",noun:"Ticket",promptText:"Hast du ___ Ticket?",support:"Ствердження: квиток.",translation:"У тебе є квиток?",example:"Hast du ein Ticket?",explanation:"Haben вимагає Akkusativ. Ticket — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-glas","ein-accusative-neuter",{word:"ein",noun:"Glas",promptText:"Ich nehme ___ Glas Wasser.",support:"Ствердження: склянка.",translation:"Я беру склянку води.",example:"Ich nehme ein Glas Wasser.",explanation:"Nehmen вимагає Akkusativ. Glas — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-neuter-hemd","ein-accusative-neuter",{word:"ein",noun:"Hemd",promptText:"Er bügelt ___ Hemd.",support:"Ствердження: сорочка.",translation:"Він прасує сорочку.",example:"Er bügelt ein Hemd.",explanation:"Bügeln вимагає Akkusativ. Hemd — середній рід: ein без змін."}),
  indefiniteCard("ein-accusative-feminine-blume","ein-accusative-feminine",{word:"eine",noun:"Blume",promptText:"Ich kaufe ___ Blume für Mama.",support:"Ствердження: квітка.",translation:"Я купую квітку для мами.",example:"Ich kaufe eine Blume für Mama.",explanation:"Kaufen вимагає Akkusativ. Blume — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-jacke","ein-accusative-feminine",{word:"eine",noun:"Jacke",promptText:"Du brauchst ___ Jacke.",support:"Ствердження: куртка.",translation:"Тобі потрібна куртка.",example:"Du brauchst eine Jacke.",explanation:"Brauchen вимагає Akkusativ. Jacke — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-zeitung","ein-accusative-feminine",{word:"eine",noun:"Zeitung",promptText:"Er liest ___ Zeitung.",support:"Ствердження: газета.",translation:"Він читає газету.",example:"Er liest eine Zeitung.",explanation:"Lesen вимагає Akkusativ. Zeitung — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-flasche","ein-accusative-feminine",{word:"eine",noun:"Flasche",promptText:"Wir trinken ___ Flasche Wein.",support:"Ствердження: пляшка.",translation:"Ми п’ємо пляшку вина.",example:"Wir trinken eine Flasche Wein.",explanation:"Trinken вимагає Akkusativ. Flasche — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-tasse","ein-accusative-feminine",{word:"eine",noun:"Tasse",promptText:"Er macht ___ Tasse Kaffee.",support:"Ствердження: чашка.",translation:"Він робить чашку кави.",example:"Er macht eine Tasse Kaffee.",explanation:"Machen вимагає Akkusativ. Tasse — жіночий рід: eine без змін."}),
  indefiniteCard("ein-accusative-feminine-uhr","ein-accusative-feminine",{word:"eine",noun:"Uhr",promptText:"Mein Vater kauft ___ Uhr.",support:"Ствердження: годинник.",translation:"Мій тато купує годинник.",example:"Mein Vater kauft eine Uhr.",explanation:"Kaufen вимагає Akkusativ. Uhr — жіночий рід: eine без змін."}),
  indefiniteCard("ein-dative-masculine-tisch","ein-dative-masculine",{word:"einem",noun:"Tisch",promptText:"Ich sitze an ___ Tisch.",support:"Ствердження: стіл.",translation:"Я сиджу за столом.",example:"Ich sitze an einem Tisch.",explanation:"An з місцем (Wo?) вимагає Dativ. Tisch — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-masculine-park","ein-dative-masculine",{word:"einem",noun:"Park",promptText:"Wir spielen in ___ Park.",support:"Ствердження: парк.",translation:"Ми граємо в парку.",example:"Wir spielen in einem Park.",explanation:"In з місцем (Wo?) вимагає Dativ. Park — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-masculine-chef","ein-dative-masculine",{word:"einem",noun:"Chef",promptText:"Er antwortet ___ Chef.",support:"Ствердження: начальник.",translation:"Він відповідає начальникові.",example:"Er antwortet einem Chef.",explanation:"Antworten вимагає Dativ: кому? Chef — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-masculine-zug","ein-dative-masculine",{word:"einem",noun:"Zug",promptText:"Sie reist mit ___ Zug nach Berlin.",support:"Ствердження: потяг.",translation:"Вона їде до Берліна потягом.",example:"Sie reist mit einem Zug nach Berlin.",explanation:"Mit вимагає Dativ. Zug — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-masculine-computer","ein-dative-masculine",{word:"einem",noun:"Computer",promptText:"Er arbeitet an ___ Computer.",support:"Ствердження: комп’ютер.",translation:"Він працює за комп’ютером.",example:"Er arbeitet an einem Computer.",explanation:"An з місцем (Wo?) вимагає Dativ. Computer — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-masculine-mann","ein-dative-masculine",{word:"einem",noun:"Mann",promptText:"Das Buch gehört ___ Mann.",support:"Ствердження: чоловік.",translation:"Ця книжка належить чоловікові.",example:"Das Buch gehört einem Mann.",explanation:"Gehören вимагає Dativ: кому? Mann — чоловічий рід: einem."}),
  indefiniteCard("ein-dative-neuter-zimmer","ein-dative-neuter",{word:"einem",noun:"Zimmer",promptText:"Ich schlafe in ___ Zimmer.",support:"Ствердження: кімната.",translation:"Я сплю в кімнаті.",example:"Ich schlafe in einem Zimmer.",explanation:"In з місцем (Wo?) вимагає Dativ. Zimmer — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-hotel","ein-dative-neuter",{word:"einem",noun:"Hotel",promptText:"Wohnst du in ___ Hotel?",support:"Ствердження: готель.",translation:"Ти живеш у готелі?",example:"Wohnst du in einem Hotel?",explanation:"In з місцем (Wo?) вимагає Dativ. Hotel — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-kino","ein-dative-neuter",{word:"einem",noun:"Kino",promptText:"Wir treffen uns in ___ Kino.",support:"Ствердження: кінотеатр.",translation:"Ми зустрічаємося в кінотеатрі.",example:"Wir treffen uns in einem Kino.",explanation:"In з місцем (Wo?) вимагає Dativ. Kino — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-museum","ein-dative-neuter",{word:"einem",noun:"Museum",promptText:"Ich arbeite in ___ Museum.",support:"Ствердження: музей.",translation:"Я працюю в музеї.",example:"Ich arbeite in einem Museum.",explanation:"In з місцем (Wo?) вимагає Dativ. Museum — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-taxi","ein-dative-neuter",{word:"einem",noun:"Taxi",promptText:"Sie fährt mit ___ Taxi nach Hause.",support:"Ствердження: таксі.",translation:"Вона їде додому таксі.",example:"Sie fährt mit einem Taxi nach Hause.",explanation:"Mit вимагає Dativ. Taxi — середній рід: einem."}),
  indefiniteCard("ein-dative-neuter-geschenk","ein-dative-neuter",{word:"einem",noun:"Geschenk",promptText:"Ich komme mit ___ Geschenk.",support:"Ствердження: подарунок.",translation:"Я прийду з подарунком.",example:"Ich komme mit einem Geschenk.",explanation:"Mit вимагає Dativ. Geschenk — середній рід: einem."}),
  indefiniteCard("ein-dative-feminine-kueche","ein-dative-feminine",{word:"einer",noun:"Küche",promptText:"Wir sitzen in ___ Küche.",support:"Ствердження: кухня.",translation:"Ми сидимо на кухні.",example:"Wir sitzen in einer Küche.",explanation:"In з місцем (Wo?) вимагає Dativ. Küche — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-schule","ein-dative-feminine",{word:"einer",noun:"Schule",promptText:"Mein Sohn lernt in ___ Schule Englisch.",support:"Ствердження: школа.",translation:"Мій син вивчає англійську в школі.",example:"Mein Sohn lernt in einer Schule Englisch.",explanation:"In з місцем (Wo?) вимагає Dativ. Schule — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-stadt","ein-dative-feminine",{word:"einer",noun:"Stadt",promptText:"Sie wohnt in ___ Stadt.",support:"Ствердження: місто.",translation:"Вона живе в місті.",example:"Sie wohnt in einer Stadt.",explanation:"In з місцем (Wo?) вимагає Dativ. Stadt — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-tasche","ein-dative-feminine",{word:"einer",noun:"Tasche",promptText:"Das Brot liegt in ___ Tasche.",support:"Ствердження: сумка.",translation:"Хліб лежить у сумці.",example:"Das Brot liegt in einer Tasche.",explanation:"In з місцем (Wo?) вимагає Dativ. Tasche — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-firma","ein-dative-feminine",{word:"einer",noun:"Firma",promptText:"Sie arbeitet bei ___ Firma.",support:"Ствердження: фірма.",translation:"Вона працює у фірмі.",example:"Sie arbeitet bei einer Firma.",explanation:"Bei з місцем (Wo?) вимагає Dativ. Firma — жіночий рід: einer."}),
  indefiniteCard("ein-dative-feminine-frau","ein-dative-feminine",{word:"einer",noun:"Frau",promptText:"Er dankt ___ Frau.",support:"Ствердження: жінка.",translation:"Він дякує жінці.",example:"Er dankt einer Frau.",explanation:"Danken вимагає Dativ: кому? Frau — жіночий рід: einer."}),
  indefiniteCard("kein-nominative-masculine-apfel","kein-nominative-masculine",{word:"kein",noun:"Apfel",promptText:"Das ist ___ Apfel.",support:"Заперечення: яблуко.",translation:"Це не яблуко.",example:"Das ist kein Apfel.",explanation:"Kein заперечує ein. Apfel — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-masculine-computer","kein-nominative-masculine",{word:"kein",noun:"Computer",promptText:"Auf dem Schreibtisch steht ___ Computer.",support:"Заперечення: комп’ютер.",translation:"На письмовому столі немає комп’ютера.",example:"Auf dem Schreibtisch steht kein Computer.",explanation:"Заперечення «немає» має kein замість ein. Computer — чоловічий рід, тому kein без закінчення."}),
  indefiniteCard("kein-nominative-masculine-mantel","kein-nominative-masculine",{word:"kein",noun:"Mantel",promptText:"Im Schrank hängt ___ Mantel.",support:"Заперечення: пальто.",translation:"У шафі не висить жодне пальто.",example:"Im Schrank hängt kein Mantel.",explanation:"Kein заперечує ein. Mantel — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-masculine-film","kein-nominative-masculine",{word:"kein",noun:"Film",promptText:"Heute kommt ___ Film im Fernsehen.",support:"Заперечення: фільм.",translation:"Сьогодні по телевізору не йде жодного фільму.",example:"Heute kommt kein Film im Fernsehen.",explanation:"Kein заперечує ein. Film — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-masculine-baum","kein-nominative-masculine",{word:"kein",noun:"Baum",promptText:"Vor dem Haus steht ___ Baum.",support:"Заперечення: дерево.",translation:"Перед будинком немає дерева.",example:"Vor dem Haus steht kein Baum.",explanation:"Kein заперечує ein. Baum — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-masculine-rucksack","kein-nominative-masculine",{word:"kein",noun:"Rucksack",promptText:"Ist das ___ Rucksack?",support:"Заперечення: рюкзак.",translation:"Це не рюкзак?",example:"Ist das kein Rucksack?",explanation:"Kein заперечує ein. Rucksack — чоловічий рід: kein без закінчення в Nominativ."}),
  indefiniteCard("kein-nominative-neuter-sofa","kein-nominative-neuter",{word:"kein",noun:"Sofa",promptText:"Hier steht ___ Sofa.",support:"Заперечення: диван.",translation:"Тут немає дивана.",example:"Hier steht kein Sofa.",explanation:"Kein заперечує ein. Sofa — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-zimmer","kein-nominative-neuter",{word:"kein",noun:"Zimmer",promptText:"Oben ist ___ Zimmer frei.",support:"Заперечення: кімната.",translation:"Нагорі немає вільної кімнати.",example:"Oben ist kein Zimmer frei.",explanation:"Після ist у Nominativ стоїть kein. Zimmer — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-radio","kein-nominative-neuter",{word:"kein",noun:"Radio",promptText:"Neben dem Bett steht ___ Radio.",support:"Заперечення: радіо.",translation:"Біля ліжка немає радіо.",example:"Neben dem Bett steht kein Radio.",explanation:"Kein заперечує ein. Radio — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-heft","kein-nominative-neuter",{word:"kein",noun:"Heft",promptText:"In meiner Tasche liegt ___ Heft.",support:"Заперечення: зошит.",translation:"У моїй сумці немає зошита.",example:"In meiner Tasche liegt kein Heft.",explanation:"Kein заперечує ein. Heft — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-foto","kein-nominative-neuter",{word:"kein",noun:"Foto",promptText:"Das ist ___ Foto von mir.",support:"Заперечення: фото.",translation:"Це не моє фото.",example:"Das ist kein Foto von mir.",explanation:"Foto — середній рід: після ist у Nominativ стоїть kein без закінчення."}),
  indefiniteCard("kein-nominative-neuter-kissen","kein-nominative-neuter",{word:"kein",noun:"Kissen",promptText:"Auf dem Sofa liegt ___ Kissen.",support:"Заперечення: подушка.",translation:"На дивані немає подушки.",example:"Auf dem Sofa liegt kein Kissen.",explanation:"Kein заперечує ein. Kissen — середній рід: kein без закінчення."}),
  indefiniteCard("kein-nominative-feminine-tuer","kein-nominative-feminine",{word:"keine",noun:"Tür",promptText:"Das ist ___ Tür.",support:"Заперечення: двері.",translation:"Це не двері.",example:"Das ist keine Tür.",explanation:"Tür — жіночий рід: kein + -e → keine в Nominativ."}),
  indefiniteCard("kein-nominative-feminine-blume","kein-nominative-feminine",{word:"keine",noun:"Blume",promptText:"Hier wächst ___ Blume.",support:"Заперечення: квітка.",translation:"Тут не росте жодна квітка.",example:"Hier wächst keine Blume.",explanation:"Blume — жіночий рід: kein + -e → keine як підмет у Nominativ."}),
  indefiniteCard("kein-nominative-feminine-zeitung","kein-nominative-feminine",{word:"keine",noun:"Zeitung",promptText:"Im Briefkasten liegt ___ Zeitung.",support:"Заперечення: газета.",translation:"У поштовій скриньці немає газети.",example:"Im Briefkasten liegt keine Zeitung.",explanation:"Zeitung — жіночий рід: keine як підмет у Nominativ."}),
  indefiniteCard("kein-nominative-feminine-jacke","kein-nominative-feminine",{word:"keine",noun:"Jacke",promptText:"Ist das ___ Jacke?",support:"Заперечення: куртка.",translation:"Це не куртка?",example:"Ist das keine Jacke?",explanation:"Jacke — жіночий рід: kein + -e → keine в Nominativ."}),
  indefiniteCard("kein-nominative-feminine-kueche","kein-nominative-feminine",{word:"keine",noun:"Küche",promptText:"Neben dem Bad ist ___ Küche.",support:"Заперечення: кухня.",translation:"Поруч із ванною немає кухні.",example:"Neben dem Bad ist keine Küche.",explanation:"Küche — жіночий рід: keine після ist у Nominativ."}),
  indefiniteCard("kein-nominative-feminine-flasche","kein-nominative-feminine",{word:"keine",noun:"Flasche",promptText:"Im Kühlschrank steht ___ Flasche Milch.",support:"Заперечення: пляшка.",translation:"У холодильнику немає пляшки молока.",example:"Im Kühlschrank steht keine Flasche Milch.",explanation:"Flasche — жіночий рід: keine як підмет у Nominativ."}),
  indefiniteCard("kein-nominative-plural-aepfel","kein-nominative-plural",{word:"keine",noun:"Äpfel",promptText:"In der Küche liegen ___ Äpfel.",support:"Заперечення: яблука.",translation:"На кухні немає яблук.",example:"In der Küche liegen keine Äpfel.",explanation:"У множині kein має форму keine для Nominativ, а іменник стоїть без артикля."}),
  indefiniteCard("kein-nominative-plural-stuehle","kein-nominative-plural",{word:"keine",noun:"Stühle",promptText:"Im Zimmer stehen ___ Stühle.",support:"Заперечення: стільці.",translation:"У кімнаті немає стільців.",example:"Im Zimmer stehen keine Stühle.",explanation:"У множині kein має форму keine для Nominativ, а іменник стоїть без артикля."}),
  indefiniteCard("kein-nominative-plural-hunde","kein-nominative-plural",{word:"keine",noun:"Hunde",promptText:"Hier sind ___ Hunde.",support:"Заперечення: собаки.",translation:"Тут немає собак.",example:"Hier sind keine Hunde.",explanation:"Множина: kein → keine в Nominativ для всіх родів."}),
  indefiniteCard("kein-nominative-plural-blumen","kein-nominative-plural",{word:"keine",noun:"Blumen",promptText:"Auf dem Balkon wachsen ___ Blumen.",support:"Заперечення: квіти.",translation:"На балконі не ростуть квіти.",example:"Auf dem Balkon wachsen keine Blumen.",explanation:"Blumen — множина, тому keine в Nominativ без артикля."}),
  indefiniteCard("kein-nominative-plural-tassen","kein-nominative-plural",{word:"keine",noun:"Tassen",promptText:"Auf dem Regal stehen ___ Tassen.",support:"Заперечення: чашки.",translation:"На полиці немає чашок.",example:"Auf dem Regal stehen keine Tassen.",explanation:"Tassen — множина: keine в Nominativ для всіх родів."}),
  indefiniteCard("kein-nominative-plural-fenster","kein-nominative-plural",{word:"keine",noun:"Fenster",promptText:"In der Garage sind ___ Fenster.",support:"Заперечення: вікна.",translation:"У гаражі немає вікон.",example:"In der Garage sind keine Fenster.",explanation:"Fenster — множина: keine в Nominativ, без артикля."}),
  indefiniteCard("kein-accusative-masculine-computer","kein-accusative-masculine",{word:"keinen",noun:"Computer",promptText:"Er braucht ___ Computer.",support:"Заперечення: комп’ютер.",translation:"Йому не потрібен комп’ютер.",example:"Er braucht keinen Computer.",explanation:"Brauchen вимагає Akkusativ. Computer — чоловічий рід: kein + -en → keinen."}),
  indefiniteCard("kein-accusative-masculine-tee","kein-accusative-masculine",{word:"keinen",noun:"Tee",promptText:"Möchtest du ___ Tee?",support:"Заперечення: чай.",translation:"Ти не хочеш чаю?",example:"Möchtest du keinen Tee?",explanation:"Möchten вимагає Akkusativ. Tee — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-masculine-teller","kein-accusative-masculine",{word:"keinen",noun:"Teller",promptText:"Wir haben ___ Teller mehr.",support:"Заперечення: тарілка.",translation:"У нас більше немає тарілки.",example:"Wir haben keinen Teller mehr.",explanation:"Haben вимагає Akkusativ. Teller — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-masculine-schirm","kein-accusative-masculine",{word:"keinen",noun:"Schirm",promptText:"Ich nehme ___ Schirm mit.",support:"Заперечення: парасолька.",translation:"Я не беру з собою парасольки.",example:"Ich nehme keinen Schirm mit.",explanation:"Nehmen вимагає Akkusativ. Schirm — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-masculine-fernseher","kein-accusative-masculine",{word:"keinen",noun:"Fernseher",promptText:"Sie kauft ___ Fernseher.",support:"Заперечення: телевізор.",translation:"Вона не купує телевізора.",example:"Sie kauft keinen Fernseher.",explanation:"Kaufen вимагає Akkusativ. Fernseher — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-masculine-apfel","kein-accusative-masculine",{word:"keinen",noun:"Apfel",promptText:"Ich esse ___ Apfel.",support:"Заперечення: яблуко.",translation:"Я не їм яблука.",example:"Ich esse keinen Apfel.",explanation:"Essen вимагає Akkusativ. Apfel — чоловічий рід: keinen."}),
  indefiniteCard("kein-accusative-neuter-heft","kein-accusative-neuter",{word:"kein",noun:"Heft",promptText:"Ich habe ___ Heft dabei.",support:"Заперечення: зошит.",translation:"У мене немає зошита з собою.",example:"Ich habe kein Heft dabei.",explanation:"Haben вимагає Akkusativ. Heft — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-geschenk","kein-accusative-neuter",{word:"kein",noun:"Geschenk",promptText:"Er findet ___ Geschenk für Anna.",support:"Заперечення: подарунок.",translation:"Він не знаходить подарунка для Анни.",example:"Er findet kein Geschenk für Anna.",explanation:"Finden вимагає Akkusativ. Geschenk — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-foto","kein-accusative-neuter",{word:"kein",noun:"Foto",promptText:"Wir machen ___ Foto.",support:"Заперечення: фото.",translation:"Ми не робимо фото.",example:"Wir machen kein Foto.",explanation:"Machen вимагає Akkusativ. Foto — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-ticket","kein-accusative-neuter",{word:"kein",noun:"Ticket",promptText:"Hast du ___ Ticket?",support:"Заперечення: квиток.",translation:"У тебе немає квитка?",example:"Hast du kein Ticket?",explanation:"Haben вимагає Akkusativ. Ticket — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-glas","kein-accusative-neuter",{word:"kein",noun:"Glas",promptText:"Ich nehme ___ Glas Wasser.",support:"Заперечення: склянка.",translation:"Я не беру склянку води.",example:"Ich nehme kein Glas Wasser.",explanation:"Nehmen вимагає Akkusativ. Glas — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-neuter-hemd","kein-accusative-neuter",{word:"kein",noun:"Hemd",promptText:"Er bügelt ___ Hemd.",support:"Заперечення: сорочка.",translation:"Він не прасує сорочку.",example:"Er bügelt kein Hemd.",explanation:"Bügeln вимагає Akkusativ. Hemd — середній рід: kein без змін."}),
  indefiniteCard("kein-accusative-feminine-jacke","kein-accusative-feminine",{word:"keine",noun:"Jacke",promptText:"Wir brauchen ___ Jacke.",support:"Заперечення: куртка.",translation:"Нам не потрібна куртка.",example:"Wir brauchen keine Jacke.",explanation:"Brauchen вимагає Akkusativ. Jacke — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-blume","kein-accusative-feminine",{word:"keine",noun:"Blume",promptText:"Er schenkt mir ___ Blume.",support:"Заперечення: квітка.",translation:"Він не дарує мені квітки.",example:"Er schenkt mir keine Blume.",explanation:"Schenken: кому? mir — Dativ; що? keine Blume — прямий додаток в Akkusativ."}),
  indefiniteCard("kein-accusative-feminine-zeitung","kein-accusative-feminine",{word:"keine",noun:"Zeitung",promptText:"Ich lese ___ Zeitung.",support:"Заперечення: газета.",translation:"Я не читаю газету.",example:"Ich lese keine Zeitung.",explanation:"Lesen вимагає Akkusativ. Zeitung — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-flasche","kein-accusative-feminine",{word:"keine",noun:"Flasche",promptText:"Hast du ___ Flasche Wasser?",support:"Заперечення: пляшка.",translation:"У тебе немає пляшки води?",example:"Hast du keine Flasche Wasser?",explanation:"Haben вимагає Akkusativ. Flasche — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-tasse","kein-accusative-feminine",{word:"keine",noun:"Tasse",promptText:"Ich trinke ___ Tasse Tee am Abend.",support:"Заперечення: чашка.",translation:"Я ввечері не п’ю чашку чаю.",example:"Ich trinke keine Tasse Tee am Abend.",explanation:"Trinken вимагає Akkusativ. Tasse — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-feminine-uhr","kein-accusative-feminine",{word:"keine",noun:"Uhr",promptText:"Mein Bruder kauft ___ Uhr.",support:"Заперечення: годинник.",translation:"Мій брат не купує годинника.",example:"Mein Bruder kauft keine Uhr.",explanation:"Kaufen вимагає Akkusativ. Uhr — жіночий рід: keine."}),
  indefiniteCard("kein-accusative-plural-tische","kein-accusative-plural",{word:"keine",noun:"Tische",promptText:"Wir brauchen ___ Tische.",support:"Заперечення: столи.",translation:"Нам не потрібні столи.",example:"Wir brauchen keine Tische.",explanation:"Brauchen вимагає Akkusativ. Tische — множина: keine."}),
  indefiniteCard("kein-accusative-plural-lampen","kein-accusative-plural",{word:"keine",noun:"Lampen",promptText:"Ich kaufe ___ Lampen.",support:"Заперечення: лампи.",translation:"Я не купую жодних ламп.",example:"Ich kaufe keine Lampen.",explanation:"Kaufen вимагає Akkusativ. У множині kein має форму keine для всіх родів."}),
  indefiniteCard("kein-accusative-plural-schuhe","kein-accusative-plural",{word:"keine",noun:"Schuhe",promptText:"Hast du ___ Schuhe?",support:"Заперечення: взуття.",translation:"У тебе немає взуття?",example:"Hast du keine Schuhe?",explanation:"Haben вимагає Akkusativ. Schuhe — множина: keine."}),
  indefiniteCard("kein-accusative-plural-bilder","kein-accusative-plural",{word:"keine",noun:"Bilder",promptText:"Er malt ___ Bilder.",support:"Заперечення: картини.",translation:"Він не малює картин.",example:"Er malt keine Bilder.",explanation:"Malen вимагає Akkusativ. Bilder — множина: keine."}),
  indefiniteCard("kein-accusative-plural-hosen","kein-accusative-plural",{word:"keine",noun:"Hosen",promptText:"Ich habe ___ Hosen mehr.",support:"Заперечення: штани.",translation:"У мене більше немає штанів.",example:"Ich habe keine Hosen mehr.",explanation:"Haben вимагає Akkusativ. Hosen — множина: keine."}),
  indefiniteCard("kein-accusative-plural-zeitungen","kein-accusative-plural",{word:"keine",noun:"Zeitungen",promptText:"Wir kaufen ___ Zeitungen.",support:"Заперечення: газети.",translation:"Ми не купуємо жодних газет.",example:"Wir kaufen keine Zeitungen.",explanation:"Kaufen вимагає Akkusativ. Zeitungen — множина: keine."}),
  indefiniteCard("kein-dative-masculine-tisch","kein-dative-masculine",{word:"keinem",noun:"Tisch",promptText:"Ich sitze an ___ Tisch.",support:"Заперечення: стіл.",translation:"Я не сиджу за жодним столом.",example:"Ich sitze an keinem Tisch.",explanation:"An з місцем (Wo?) вимагає Dativ. Tisch — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-park","kein-dative-masculine",{word:"keinem",noun:"Park",promptText:"Wir spielen in ___ Park.",support:"Заперечення: парк.",translation:"Ми не граємо в жодному парку.",example:"Wir spielen in keinem Park.",explanation:"In з місцем (Wo?) вимагає Dativ. Park — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-chef","kein-dative-masculine",{word:"keinem",noun:"Chef",promptText:"Ich antworte ___ Chef.",support:"Заперечення: начальник.",translation:"Я не відповідаю жодному начальникові.",example:"Ich antworte keinem Chef.",explanation:"Antworten вимагає Dativ: кому? Chef — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-mann","kein-dative-masculine",{word:"keinem",noun:"Mann",promptText:"Das Buch gehört ___ Mann.",support:"Заперечення: чоловік.",translation:"Ця книжка не належить жодному чоловікові.",example:"Das Buch gehört keinem Mann.",explanation:"Gehören вимагає Dativ: кому? Mann — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-bus","kein-dative-masculine",{word:"keinem",noun:"Bus",promptText:"Ich fahre mit ___ Bus.",support:"Заперечення: автобус.",translation:"Я не їжджу жодним автобусом.",example:"Ich fahre mit keinem Bus.",explanation:"Mit вимагає Dativ. Bus — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-masculine-kugelschreiber","kein-dative-masculine",{word:"keinem",noun:"Kugelschreiber",promptText:"Ich schreibe mit ___ Kugelschreiber.",support:"Заперечення: ручка.",translation:"Я не пишу жодною ручкою.",example:"Ich schreibe mit keinem Kugelschreiber.",explanation:"Mit вимагає Dativ. Kugelschreiber — чоловічий рід: keinem."}),
  indefiniteCard("kein-dative-neuter-hotel","kein-dative-neuter",{word:"keinem",noun:"Hotel",promptText:"Ich wohne in ___ Hotel.",support:"Заперечення: готель.",translation:"Я не живу в жодному готелі.",example:"Ich wohne in keinem Hotel.",explanation:"In з місцем (Wo?) вимагає Dativ. Hotel — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-kino","kein-dative-neuter",{word:"keinem",noun:"Kino",promptText:"In ___ Kino läuft der Film.",support:"Заперечення: кінотеатр.",translation:"У жодному кінотеатрі не йде цей фільм.",example:"In keinem Kino läuft der Film.",explanation:"In з місцем (Wo?) вимагає Dativ. Kino — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-museum","kein-dative-neuter",{word:"keinem",noun:"Museum",promptText:"Ich arbeite in ___ Museum.",support:"Заперечення: музей.",translation:"Я не працюю в жодному музеї.",example:"Ich arbeite in keinem Museum.",explanation:"In з місцем (Wo?) вимагає Dativ. Museum — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-restaurant","kein-dative-neuter",{word:"keinem",noun:"Restaurant",promptText:"Wir essen in ___ Restaurant.",support:"Заперечення: ресторан.",translation:"Ми не їмо в жодному ресторані.",example:"Wir essen in keinem Restaurant.",explanation:"In з місцем (Wo?) вимагає Dativ. Restaurant — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-taxi","kein-dative-neuter",{word:"keinem",noun:"Taxi",promptText:"Ich fahre mit ___ Taxi.",support:"Заперечення: таксі.",translation:"Я не їжджу жодним таксі.",example:"Ich fahre mit keinem Taxi.",explanation:"Mit вимагає Dativ. Taxi — середній рід: keinem."}),
  indefiniteCard("kein-dative-neuter-geschenk","kein-dative-neuter",{word:"keinem",noun:"Geschenk",promptText:"Ich komme mit ___ Geschenk.",support:"Заперечення: подарунок.",translation:"Я прийду без подарунка.",example:"Ich komme mit keinem Geschenk.",explanation:"Mit вимагає Dativ. Geschenk — середній рід: keinem."}),
  indefiniteCard("kein-dative-feminine-kueche","kein-dative-feminine",{word:"keiner",noun:"Küche",promptText:"In ___ Küche riecht es nach Kaffee.",support:"Заперечення: кухня.",translation:"У жодній кухні не пахне кавою.",example:"In keiner Küche riecht es nach Kaffee.",explanation:"In з місцем (Wo?) вимагає Dativ. Küche — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-schule","kein-dative-feminine",{word:"keiner",noun:"Schule",promptText:"Ich bin mit ___ Schule zufrieden.",support:"Заперечення: школа.",translation:"Мене не влаштовує жодна школа.",example:"Ich bin mit keiner Schule zufrieden.",explanation:"Zufrieden mit вимагає Dativ. Schule — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-strassenbahn","kein-dative-feminine",{word:"keiner",noun:"Straßenbahn",promptText:"Er fährt mit ___ Straßenbahn.",support:"Заперечення: трамвай.",translation:"Він не їздить жодним трамваєм.",example:"Er fährt mit keiner Straßenbahn.",explanation:"Mit вимагає Dativ. Straßenbahn — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-tasche","kein-dative-feminine",{word:"keiner",noun:"Tasche",promptText:"Das Brot liegt in ___ Tasche.",support:"Заперечення: сумка.",translation:"Хліб не лежить в жодній сумці.",example:"Das Brot liegt in keiner Tasche.",explanation:"In з місцем (Wo?) вимагає Dativ. Tasche — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-firma","kein-dative-feminine",{word:"keiner",noun:"Firma",promptText:"Er arbeitet bei ___ Firma.",support:"Заперечення: фірма.",translation:"Він не працює в жодній фірмі.",example:"Er arbeitet bei keiner Firma.",explanation:"Bei з місцем (Wo?) вимагає Dativ. Firma — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-feminine-frau","kein-dative-feminine",{word:"keiner",noun:"Frau",promptText:"Er dankt ___ Frau.",support:"Заперечення: жінка.",translation:"Він не дякує жодній жінці.",example:"Er dankt keiner Frau.",explanation:"Danken вимагає Dativ: кому? Frau — жіночий рід: keiner."}),
  indefiniteCard("kein-dative-plural-computer","kein-dative-plural",{word:"keinen",noun:"Computer",exampleWord:"Computern",promptText:"Ich arbeite an ___ Computern.",support:"Заперечення: комп’ютери.",translation:"Я не працюю за жодними комп’ютерами.",example:"Ich arbeite an keinen Computern.",explanation:"An з місцем (Wo?) вимагає Dativ. У Dativ множини kein → keinen, а іменник отримує -n: Computern."}),
  indefiniteCard("kein-dative-plural-hunde","kein-dative-plural",{word:"keinen",noun:"Hunde",exampleWord:"Hunden",promptText:"Ich gehe mit ___ Hunden spazieren.",support:"Заперечення: собаки.",translation:"Я не гуляю з жодними собаками.",example:"Ich gehe mit keinen Hunden spazieren.",explanation:"Mit вимагає Dativ. Hunde в Dativ множини отримують -n: Hunden, а kein → keinen."}),
  indefiniteCard("kein-dative-plural-stuehle","kein-dative-plural",{word:"keinen",noun:"Stühle",exampleWord:"Stühlen",promptText:"Er sitzt auf ___ Stühlen.",support:"Заперечення: стільці.",translation:"Він не сидить на жодних стільцях.",example:"Er sitzt auf keinen Stühlen.",explanation:"Auf з місцем (Wo?) вимагає Dativ. Stühle → Stühlen, а kein → keinen."}),
  indefiniteCard("kein-dative-plural-vereine","kein-dative-plural",{word:"keinen",noun:"Vereine",exampleWord:"Vereinen",promptText:"Er gehört zu ___ Vereinen.",support:"Заперечення: клуби.",translation:"Він не належить до жодних клубів.",example:"Er gehört zu keinen Vereinen.",explanation:"Zu вимагає Dativ. Vereine в Dativ множини отримують -n: Vereinen, а kein → keinen."}),
  indefiniteCard("kein-dative-plural-autos","kein-dative-plural",{word:"keinen",noun:"Autos",promptText:"Die Kinder spielen mit ___ Autos.",support:"Заперечення: машини.",translation:"Діти не граються з жодними машинами.",example:"Die Kinder spielen mit keinen Autos.",explanation:"Mit вимагає Dativ. Autos у Dativ множини не змінюється, тому kein → keinen."}),
  indefiniteCard("kein-dative-plural-firmen","kein-dative-plural",{word:"keinen",noun:"Firmen",promptText:"Sie hat bei ___ Firmen gearbeitet.",support:"Заперечення: фірми.",translation:"Вона не працювала в жодних фірмах.",example:"Sie hat bei keinen Firmen gearbeitet.",explanation:"Bei з місцем (Wo?) вимагає Dativ. Firmen у Dativ множини не змінюється, kein → keinen."})
];
// Marker notation: "f[ä]hr|st" marks the changed vowel in brackets and the ending after |.
function verbForm(notation){
  const [marked,ending=""]=notation.split("|");
  const stem=marked.replace(/[[\]]/g,""),start=marked.indexOf("[");
  return start<0?{stem,ending}:{stem,ending,vowel:{start,end:marked.indexOf("]")-1}};
}
const verbPersons=["ich","du","er/sie/es","wir","ihr","sie/Sie"];
// Six present-tense forms from ich to sie/Sie; change names what to notice, e.g. "a → ä".
function verbParadigm(verb,notation,change=""){
  return {verb,change,forms:notation.split(" ").map(verbForm)};
}
function withVerbParadigm(card,{verb,change,forms},person){
  return {
    ...card,
    answerParts:forms[person],
    paradigm:{title:[verb,change].filter(Boolean).join(" · "),forms:true,columns:verbPersons.map(label=>({label})),rows:[{label:"Präs.",title:"Präsens",cells:forms}],active:{row:0,column:person}}
  };
}
// Cards run ich → sie/Sie, six per paradigm, unless persons gives each card's person index.
function withVerbParadigms(cards,paradigms,persons=cards.map((card,index)=>index%verbPersons.length)){
  return cards.map((card,index)=>withVerbParadigm(card,paradigms[Math.floor(index/verbPersons.length)],persons[index]));
}
const seinCards=withVerbParadigms([
  {word:"ich bin",translation:"я є / я знаходжусь",category:"VERB SEIN",example:"Ich bin müde.",exampleTranslation:"Я втомлений."},
  {word:"du bist",translation:"ти є / ти знаходишся",category:"VERB SEIN",example:"Du bist sehr nett.",exampleTranslation:"Ти дуже милий."},
  {word:"er / sie / es ist",translation:"він / вона / воно є",category:"VERB SEIN",example:"Sie ist meine Schwester.",exampleTranslation:"Вона моя сестра."},
  {word:"wir sind",translation:"ми є / ми знаходимося",category:"VERB SEIN",example:"Wir sind zu Hause.",exampleTranslation:"Ми вдома."},
  {word:"ihr seid",translation:"ви є / ви знаходитеся",category:"VERB SEIN",example:"Ihr seid heute spät.",exampleTranslation:"Ви сьогодні запізнилися."},
  {word:"sie / Sie sind",translation:"вони є / Ви є",category:"VERB SEIN",example:"Sie sind aus Deutschland.",exampleTranslation:"Вони з Німеччини."}
],[verbParadigm("sein","bin| bist| ist| sind| seid| sind|")]);
const weakVerbParadigms={
  machen:verbParadigm("machen","mach|e mach|st mach|t mach|en mach|t mach|en"),
  arbeiten:verbParadigm("arbeiten","arbeit|e arbeit|est arbeit|et arbeit|en arbeit|et arbeit|en","додаткове e"),
  atmen:verbParadigm("atmen","atm|e atm|est atm|et atm|en atm|et atm|en","додаткове e"),
  landen:verbParadigm("landen","land|e land|est land|et land|en land|et land|en","додаткове e"),
  rechnen:verbParadigm("rechnen","rechn|e rechn|est rechn|et rechn|en rechn|et rechn|en","додаткове e"),
  heissen:verbParadigm("heißen","heiß|e heiß|t heiß|t heiß|en heiß|t heiß|en","du -t замість -st"),
  tanzen:verbParadigm("tanzen","tanz|e tanz|t tanz|t tanz|en tanz|t tanz|en","du -t замість -st"),
  uebersetzen:verbParadigm("übersetzen","übersetz|e übersetz|t übersetz|t übersetz|en übersetz|t übersetz|en","du -t замість -st")
};
// machen and arbeiten run through all six persons; each later card shows its own verb with the active person.
const conjugationCards=[
  ...withVerbParadigms([
    {word:"ich mache",translation:"я роблю",category:"WEAK VERB · MACHEN",example:"Ich mache heute die Hausaufgaben.",exampleTranslation:"Я сьогодні роблю домашнє завдання."},
    {word:"du machst",translation:"ти робиш",category:"WEAK VERB · MACHEN",example:"Du machst das sehr gut.",exampleTranslation:"Ти робиш це дуже добре."},
    {word:"er / sie / es macht",translation:"він / вона / воно робить",category:"WEAK VERB · MACHEN",example:"Sie macht jeden Morgen Sport.",exampleTranslation:"Вона щоранку займається спортом."},
    {word:"wir machen",translation:"ми робимо",category:"WEAK VERB · MACHEN",example:"Wir machen eine Pause.",exampleTranslation:"Ми робимо перерву."},
    {word:"ihr macht",translation:"ви робите",category:"WEAK VERB · MACHEN",example:"Ihr macht eine gute Arbeit.",exampleTranslation:"Ви робите гарну роботу."},
    {word:"sie / Sie machen",translation:"вони / Ви робите",category:"WEAK VERB · MACHEN",example:"Sie machen die Übung zusammen.",exampleTranslation:"Вони роблять вправу разом."},
    {word:"ich arbeite",translation:"я працюю",category:"WEAK VERB · ARBEITEN",example:"Ich arbeite in einem Hotel.",exampleTranslation:"Я працюю в готелі."},
    {word:"du arbeitest",translation:"ти працюєш",category:"WEAK VERB · ARBEITEN",example:"Du arbeitest heute lange.",exampleTranslation:"Ти сьогодні працюєш довго."},
    {word:"er / sie / es arbeitet",translation:"він / вона / воно працює",category:"WEAK VERB · ARBEITEN",example:"Er arbeitet im Büro.",exampleTranslation:"Він працює в офісі."},
    {word:"wir arbeiten",translation:"ми працюємо",category:"WEAK VERB · ARBEITEN",example:"Wir arbeiten jeden Tag.",exampleTranslation:"Ми працюємо щодня."},
    {word:"ihr arbeitet",translation:"ви працюєте",category:"WEAK VERB · ARBEITEN",example:"Ihr arbeitet sehr schnell.",exampleTranslation:"Ви працюєте дуже швидко."},
    {word:"sie / Sie arbeiten",translation:"вони / Ви працюють / працюєте",category:"WEAK VERB · ARBEITEN",example:"Sie arbeiten in Berlin.",exampleTranslation:"Вони працюють у Берліні."}
  ],[weakVerbParadigms.machen,weakVerbParadigms.arbeiten]),
  withVerbParadigm({word:"du atmest",translation:"ти дихаєш",category:"EXTRA -E · ATMEN",example:"Du atmest tief ein.",exampleTranslation:"Ти глибоко вдихаєш."},weakVerbParadigms.atmen,1),
  withVerbParadigm({word:"er / sie / es landet",translation:"він / вона / воно приземляється",category:"EXTRA -E · LANDEN",example:"Das Flugzeug landet um acht Uhr.",exampleTranslation:"Літак приземляється о восьмій."},weakVerbParadigms.landen,2),
  withVerbParadigm({word:"ihr rechnet",translation:"ви рахуєте",category:"EXTRA -E · RECHNEN",example:"Ihr rechnet die Aufgabe.",exampleTranslation:"Ви рахуєте завдання."},weakVerbParadigms.rechnen,4),
  withVerbParadigm({word:"du heißt",translation:"тебе звати",category:"SIBILANT STEM · HEISSEN",example:"Wie heißt du?",exampleTranslation:"Як тебе звати?"},weakVerbParadigms.heissen,1),
  withVerbParadigm({word:"du tanzt",translation:"ти танцюєш",category:"SIBILANT STEM · TANZEN",example:"Du tanzt sehr gut.",exampleTranslation:"Ти дуже добре танцюєш."},weakVerbParadigms.tanzen,1),
  withVerbParadigm({word:"du übersetzt",translation:"ти перекладаєш",category:"SIBILANT STEM · ÜBERSETZEN",example:"Du übersetzt den Text.",exampleTranslation:"Ти перекладаєш текст."},weakVerbParadigms.uebersetzen,1)
];
// Same verb order as the learn and practice cards: six persons per verb.
const strongVerbParadigms=[
  ["sprechen","sprech|e spr[i]ch|st spr[i]ch|t sprech|en sprech|t sprech|en","e → i"],
  ["fahren","fahr|e f[ä]hr|st f[ä]hr|t fahr|en fahr|t fahr|en","a → ä"],
  ["treffen","treff|e tr[i]ff|st tr[i]ff|t treff|en treff|t treff|en","e → i"],
  ["lesen","les|e l[ie]s|t l[ie]s|t les|en les|t les|en","e → ie"],
  ["essen","ess|e [i]ss|t [i]ss|t ess|en ess|t ess|en","e → i"],
  ["wissen","w[ei]ß| w[ei]ß|t w[ei]ß| wiss|en wiss|t wiss|en","i → ei"],
  ["anfangen","fang|e f[ä]ng|st f[ä]ng|t fang|en fang|t fang|en","a → ä"]
].map(entry=>verbParadigm(...entry));
const strongVerbFormCards=withVerbParadigms([
  {word:"ich spreche",translation:"я говорю / розмовляю",category:"STRONG VERB · SPRECHEN",example:"Ich spreche jeden Tag Deutsch.",exampleTranslation:"Я щодня говорю німецькою."},
  {word:"du sprichst",translation:"ти говориш / розмовляєш",category:"STRONG VERB · SPRECHEN",example:"Du sprichst sehr gut Deutsch.",exampleTranslation:"Ти дуже добре говориш німецькою."},
  {word:"er / sie / es spricht",translation:"він говорить / вона говорить / воно говорить",category:"STRONG VERB · SPRECHEN",example:"Sie spricht mit ihrer Lehrerin.",exampleTranslation:"Вона розмовляє зі своєю вчителькою."},
  {word:"wir sprechen",translation:"ми говоримо / розмовляємо",category:"STRONG VERB · SPRECHEN",example:"Wir sprechen im Kurs nur Deutsch.",exampleTranslation:"Ми говоримо на курсі лише німецькою."},
  {word:"ihr sprecht",translation:"ви говорите / розмовляєте",category:"STRONG VERB · SPRECHEN",example:"Ihr sprecht zu schnell.",exampleTranslation:"Ви говорите надто швидко."},
  {word:"sie / Sie sprechen",translation:"вони говорять / Ви говорите",category:"STRONG VERB · SPRECHEN",example:"Sie sprechen Englisch und Deutsch.",exampleTranslation:"Вони говорять англійською та німецькою."},
  {word:"ich fahre",translation:"я їду / керую",category:"STRONG VERB · FAHREN",example:"Ich fahre mit dem Bus zur Arbeit.",exampleTranslation:"Я їду автобусом на роботу."},
  {word:"du fährst",translation:"ти їдеш / керуєш",category:"STRONG VERB · FAHREN",example:"Du fährst heute nach Berlin.",exampleTranslation:"Ти сьогодні їдеш до Берліна."},
  {word:"er / sie / es fährt",translation:"він їде / вона їде / воно їде",category:"STRONG VERB · FAHREN",example:"Er fährt jeden Morgen mit dem Fahrrad.",exampleTranslation:"Він щодня їздить велосипедом."},
  {word:"wir fahren",translation:"ми їдемо",category:"STRONG VERB · FAHREN",example:"Wir fahren am Wochenende ans Meer.",exampleTranslation:"Ми їдемо на вихідних до моря."},
  {word:"ihr fahrt",translation:"ви їдете",category:"STRONG VERB · FAHREN",example:"Ihr fahrt mit dem Zug nach Hamburg.",exampleTranslation:"Ви їдете потягом до Гамбурга."},
  {word:"sie / Sie fahren",translation:"вони їдуть / Ви їдете",category:"STRONG VERB · FAHREN",example:"Sie fahren morgen in den Urlaub.",exampleTranslation:"Вони завтра їдуть у відпустку."},
  {word:"ich treffe",translation:"я зустрічаю",category:"STRONG VERB · TREFFEN",example:"Ich treffe meine Freunde im Café.",exampleTranslation:"Я зустрічаюся з друзями в кафе."},
  {word:"du triffst",translation:"ти зустрічаєш",category:"STRONG VERB · TREFFEN",example:"Du triffst heute deine Schwester.",exampleTranslation:"Ти сьогодні зустрічаєш свою сестру."},
  {word:"er / sie / es trifft",translation:"він зустрічає / вона зустрічає / воно зустрічає",category:"STRONG VERB · TREFFEN",example:"Er trifft seinen Kollegen nach der Arbeit.",exampleTranslation:"Він зустрічає свого колегу після роботи."},
  {word:"wir treffen",translation:"ми зустрічаємо",category:"STRONG VERB · TREFFEN",example:"Wir treffen uns um sechs Uhr.",exampleTranslation:"Ми зустрічаємося о шостій годині."},
  {word:"ihr trefft",translation:"ви зустрічаєте",category:"STRONG VERB · TREFFEN",example:"Ihr trefft eure Freunde im Park.",exampleTranslation:"Ви зустрічаєте друзів у парку."},
  {word:"sie / Sie treffen",translation:"вони зустрічають / Ви зустрічаєте",category:"STRONG VERB · TREFFEN",example:"Sie treffen ihre Familie am Sonntag.",exampleTranslation:"Вони зустрічають свою родину в неділю."},
  {word:"ich lese",translation:"я читаю",category:"STRONG VERB · LESEN",example:"Ich lese jeden Abend ein Buch.",exampleTranslation:"Я щовечора читаю книжку."},
  {word:"du liest",translation:"ти читаєш",category:"STRONG VERB · LESEN",example:"Du liest die Aufgabe laut.",exampleTranslation:"Ти читаєш завдання вголос."},
  {word:"er / sie / es liest",translation:"він читає / вона читає / воно читає",category:"STRONG VERB · LESEN",example:"Sie liest die Zeitung am Morgen.",exampleTranslation:"Вона читає газету вранці."},
  {word:"wir lesen",translation:"ми читаємо",category:"STRONG VERB · LESEN",example:"Wir lesen einen interessanten Text.",exampleTranslation:"Ми читаємо цікавий текст."},
  {word:"ihr lest",translation:"ви читаєте",category:"STRONG VERB · LESEN",example:"Ihr lest das Buch zusammen.",exampleTranslation:"Ви читаєте книжку разом."},
  {word:"sie / Sie lesen",translation:"вони читають / Ви читаєте",category:"STRONG VERB · LESEN",example:"Sie lesen deutsche Romane.",exampleTranslation:"Вони читають німецькі романи."},
  {word:"ich esse",translation:"я їм",category:"STRONG VERB · ESSEN",example:"Ich esse gern Brot zum Frühstück.",exampleTranslation:"Я охоче їм хліб на сніданок."},
  {word:"du isst",translation:"ти їси",category:"STRONG VERB · ESSEN",example:"Du isst heute einen Apfel.",exampleTranslation:"Ти сьогодні їси яблуко."},
  {word:"er / sie / es isst",translation:"він їсть / вона їсть / воно їсть",category:"STRONG VERB · ESSEN",example:"Sie isst kein Fleisch.",exampleTranslation:"Вона не їсть м'яса."},
  {word:"wir essen",translation:"ми їмо",category:"STRONG VERB · ESSEN",example:"Wir essen um sieben Uhr zu Abend.",exampleTranslation:"Ми вечеряємо о сьомій годині."},
  {word:"ihr esst",translation:"ви їсте",category:"STRONG VERB · ESSEN",example:"Ihr esst zusammen in der Kantine.",exampleTranslation:"Ви їсте разом у їдальні."},
  {word:"sie / Sie essen",translation:"вони їдять / Ви їсте",category:"STRONG VERB · ESSEN",example:"Sie essen in einem Restaurant.",exampleTranslation:"Вони їдять у ресторані."},
  {word:"ich weiß",translation:"я знаю",category:"STRONG VERB · WISSEN",example:"Ich weiß die Antwort.",exampleTranslation:"Я знаю відповідь."},
  {word:"du weißt",translation:"ти знаєш",category:"STRONG VERB · WISSEN",example:"Du weißt das schon.",exampleTranslation:"Ти це вже знаєш."},
  {word:"er / sie / es weiß",translation:"він знає / вона знає / воно знає",category:"STRONG VERB · WISSEN",example:"Er weiß meinen Namen.",exampleTranslation:"Він знає моє ім'я."},
  {word:"wir wissen",translation:"ми знаємо",category:"STRONG VERB · WISSEN",example:"Wir wissen den Weg.",exampleTranslation:"Ми знаємо дорогу."},
  {word:"ihr wisst",translation:"ви знаєте",category:"STRONG VERB · WISSEN",example:"Ihr wisst viel über Deutschland.",exampleTranslation:"Ви багато знаєте про Німеччину."},
  {word:"sie / Sie wissen",translation:"вони знають / Ви знаєте",category:"STRONG VERB · WISSEN",example:"Sie wissen, wann der Kurs beginnt.",exampleTranslation:"Вони знають, коли починається курс."},
  {word:"ich fange an",translation:"я починаю",category:"STRONG VERB · ANFANGEN",example:"Ich fange heute mit den Hausaufgaben an.",exampleTranslation:"Я сьогодні починаю з домашнього завдання."},
  {word:"du fängst an",translation:"ти починаєш",category:"STRONG VERB · ANFANGEN",example:"Du fängst um acht Uhr mit der Arbeit an.",exampleTranslation:"Ти починаєш працювати о восьмій годині."},
  {word:"er / sie / es fängt an",translation:"він / вона / воно починає",category:"STRONG VERB · ANFANGEN",example:"Der Kurs fängt um neun Uhr an.",exampleTranslation:"Курс починається о дев'ятій годині."},
  {word:"wir fangen an",translation:"ми починаємо",category:"STRONG VERB · ANFANGEN",example:"Wir fangen jetzt mit der Übung an.",exampleTranslation:"Ми зараз починаємо вправу."},
  {word:"ihr fangt an",translation:"ви починаєте",category:"STRONG VERB · ANFANGEN",example:"Ihr fangt den Deutschkurs morgen an.",exampleTranslation:"Ви починаєте курс німецької завтра."},
  {word:"sie / Sie fangen an",translation:"вони починають / Ви починаєте",category:"STRONG VERB · ANFANGEN",example:"Sie fangen am Montag mit dem neuen Projekt an.",exampleTranslation:"Вони починають новий проєкт у понеділок."}
],strongVerbParadigms);
const strongVerbClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"STRONG VERB · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова.",answer,answerTranslation,practiceType:"cloze"});
const strongVerbPracticeCards=withVerbParadigms([
  strongVerbClozeCard("Ich spreche oft mit meiner Schwester.","Я часто розмовляю зі своєю сестрою.","Ich ___ oft mit meiner Schwester. (sprechen)","spreche","розмовляю"),
  strongVerbClozeCard("Du sprichst mit dem Lehrer.","Ти розмовляєш з учителем.","Du ___ mit dem Lehrer. (sprechen)","sprichst","розмовляєш"),
  strongVerbClozeCard("Meine Freundin spricht sehr gut Deutsch.","Моя подруга дуже добре говорить німецькою.","Meine Freundin ___ sehr gut Deutsch. (sprechen)","spricht","говорить"),
  strongVerbClozeCard("Wir sprechen am Abend miteinander.","Ми розмовляємо один з одним увечері.","Wir ___ am Abend miteinander. (sprechen)","sprechen","розмовляємо"),
  strongVerbClozeCard("Ihr sprecht heute über den Film.","Ви сьогодні говорите про фільм.","Ihr ___ heute über den Film. (sprechen)","sprecht","говорите"),
  strongVerbClozeCard("Sie sprechen zu Hause Deutsch.","Вони розмовляють удома німецькою.","Sie ___ zu Hause Deutsch. (sprechen)","sprechen","розмовляють"),
  strongVerbClozeCard("Ich fahre morgen nach Köln.","Я завтра їду до Кельна.","Ich ___ morgen nach Köln. (fahren)","fahre","їду"),
  strongVerbClozeCard("Du fährst mit dem Auto zur Arbeit.","Ти їдеш машиною на роботу.","Du ___ mit dem Auto zur Arbeit. (fahren)","fährst","їдеш"),
  strongVerbClozeCard("Der Zug fährt um acht Uhr ab.","Потяг відправляється о восьмій годині.","Der Zug ___ um acht Uhr ab. (fahren)","fährt","їде"),
  strongVerbClozeCard("Wir fahren mit dem Zug nach Berlin.","Ми їдемо потягом до Берліна.","Wir ___ mit dem Zug nach Berlin. (fahren)","fahren","їдемо"),
  strongVerbClozeCard("Ihr fahrt morgen nach München.","Ви завтра їдете до Мюнхена.","Ihr ___ morgen nach München. (fahren)","fahrt","їдете"),
  strongVerbClozeCard("Sie fahren jeden Tag mit dem Bus.","Вони щодня їздять автобусом.","Sie ___ jeden Tag mit dem Bus. (fahren)","fahren","їздять"),
  strongVerbClozeCard("Ich treffe meinen Lehrer nach dem Unterricht.","Я зустрічаю свого вчителя після уроку.","Ich ___ meinen Lehrer nach dem Unterricht. (treffen)","treffe","зустрічаю"),
  strongVerbClozeCard("Du triffst deine Freunde im Park.","Ти зустрічаєш друзів у парку.","Du ___ deine Freunde im Park. (treffen)","triffst","зустрічаєш"),
  strongVerbClozeCard("Er trifft seine Oma am Bahnhof.","Він зустрічає свою бабусю на вокзалі.","Er ___ seine Oma am Bahnhof. (treffen)","trifft","зустрічає"),
  strongVerbClozeCard("Wir treffen uns nach dem Kurs.","Ми зустрічаємося після курсу.","Wir ___ uns nach dem Kurs. (treffen)","treffen","зустрічаємося"),
  strongVerbClozeCard("Ihr trefft euch vor dem Kino.","Ви зустрічаєтеся перед кінотеатром.","Ihr ___ euch vor dem Kino. (treffen)","trefft","зустрічаєтеся"),
  strongVerbClozeCard("Sie treffen sich am Samstag.","Вони зустрічаються в суботу.","Sie ___ sich am Samstag. (treffen)","treffen","зустрічаються"),
  strongVerbClozeCard("Ich lese gern kurze Geschichten.","Я охоче читаю короткі оповідання.","Ich ___ gern kurze Geschichten. (lesen)","lese","читаю"),
  strongVerbClozeCard("Du liest gern Krimis.","Ти охоче читаєш детективи.","Du ___ gern Krimis. (lesen)","liest","читаєш"),
  strongVerbClozeCard("Meine Mutter liest eine E-Mail.","Моя мама читає електронний лист.","Meine Mutter ___ eine E-Mail. (lesen)","liest","читає"),
  strongVerbClozeCard("Wir lesen die Zeitung beim Frühstück.","Ми читаємо газету під час сніданку.","Wir ___ die Zeitung beim Frühstück. (lesen)","lesen","читаємо"),
  strongVerbClozeCard("Ihr lest den Text im Unterricht.","Ви читаєте текст на уроці.","Ihr ___ den Text im Unterricht. (lesen)","lest","читаєте"),
  strongVerbClozeCard("Sie lesen die Aufgabe noch einmal.","Вони ще раз читають завдання.","Sie ___ die Aufgabe noch einmal. (lesen)","lesen","читають"),
  strongVerbClozeCard("Ich esse gern Obst.","Я охоче їм фрукти.","Ich ___ gern Obst. (essen)","esse","їм"),
  strongVerbClozeCard("Du isst heute Suppe.","Ти сьогодні їси суп.","Du ___ heute Suppe. (essen)","isst","їси"),
  strongVerbClozeCard("Er isst ein Sandwich.","Він їсть сендвіч.","Er ___ ein Sandwich. (essen)","isst","їсть"),
  strongVerbClozeCard("Wir essen zusammen.","Ми їмо разом.","Wir ___ zusammen. (essen)","essen","їмо"),
  strongVerbClozeCard("Ihr esst zu Hause.","Ви їсте вдома.","Ihr ___ zu Hause. (essen)","esst","їсте"),
  strongVerbClozeCard("Sie essen im Café.","Вони їдять у кафе.","Sie ___ im Café. (essen)","essen","їдять"),
  strongVerbClozeCard("Ich weiß die Antwort.","Я знаю відповідь.","Ich ___ die Antwort. (wissen)","weiß","знаю"),
  strongVerbClozeCard("Du weißt meinen Namen.","Ти знаєш моє ім'я.","Du ___ meinen Namen. (wissen)","weißt","знаєш"),
  strongVerbClozeCard("Sie weiß den Weg.","Вона знає дорогу.","Sie ___ den Weg. (wissen)","weiß","знає"),
  strongVerbClozeCard("Wir wissen das nicht.","Ми цього не знаємо.","Wir ___ das nicht. (wissen)","wissen","знаємо"),
  strongVerbClozeCard("Ihr wisst, was passiert.","Ви знаєте, що відбувається.","Ihr ___, was passiert. (wissen)","wisst","знаєте"),
  strongVerbClozeCard("Sie wissen Bescheid.","Вони знають про це.","Sie ___ Bescheid. (wissen)","wissen","знають"),
  strongVerbClozeCard("Ich fange heute mit den Hausaufgaben an.","Я сьогодні починаю з домашнього завдання.","Ich ___ heute mit den Hausaufgaben ___. (anfangen)","fange / an","починаю"),
  strongVerbClozeCard("Du fängst um acht Uhr mit der Arbeit an.","Ти починаєш працювати о восьмій годині.","Du ___ um acht Uhr mit der Arbeit ___. (anfangen)","fängst / an","починаєш"),
  strongVerbClozeCard("Der Kurs fängt um neun Uhr an.","Курс починається о дев'ятій годині.","Der Kurs ___ um neun Uhr ___. (anfangen)","fängt / an","починається"),
  strongVerbClozeCard("Wir fangen jetzt mit der Übung an.","Ми зараз починаємо вправу.","Wir ___ jetzt mit der Übung ___. (anfangen)","fangen / an","починаємо"),
  strongVerbClozeCard("Ihr fangt den Deutschkurs morgen an.","Ви починаєте курс німецької завтра.","Ihr ___ den Deutschkurs morgen ___. (anfangen)","fangt / an","починаєте"),
  strongVerbClozeCard("Sie fangen am Montag mit dem neuen Projekt an.","Вони починають новий проєкт у понеділок.","Sie ___ am Montag mit dem neuen Projekt ___. (anfangen)","fangen / an","починають")
],strongVerbParadigms);
const strongVerbCards=[...strongVerbFormCards,...strongVerbPracticeCards];
const perfectAuxiliaries={hat:"haben",ist:"sein"};
const auxiliaryPresentForms={haben:["habe","hast","hat","haben","habt"],sein:["bin","bist","ist","sind","seid"]};
// "hat gemacht" → haben. The form is the one the example uses when the example is in Perfekt.
// "hat/ist geschwommen" allows both auxiliaries, so the card gets no haben/sein panel.
function withPerfectAuxiliary(card,perfect){
  const [first,...rest]=perfect.split(" "),verb=perfectAuxiliaries[first];
  if(!verb)return card;
  const words=(card.example||"").toLowerCase().split(/[^\p{L}]+/u);
  const form=words.includes(rest[rest.length-1].toLowerCase())&&auxiliaryPresentForms[verb].find(item=>words.includes(item));
  return {...card,auxiliary:{verb,form:form||first}};
}
const pastVerbLegacyA1SourceCards=[
  {word:"beginnen (beginnt) · begann · hat begonnen",translation:"починати",category:"VERB FORMS · BEGINNEN",example:"Der Kurs hat um neun Uhr begonnen.",exampleTranslation:"Курс почався о дев'ятій годині."},
  {word:"bleiben (bleibt) · blieb · ist geblieben",translation:"залишатися",category:"VERB FORMS · BLEIBEN",example:"Ich bin zu Hause geblieben.",exampleTranslation:"Я залишився вдома."},
  {word:"bringen (bringt) · brachte · hat gebracht",translation:"приносити",category:"VERB FORMS · BRINGEN",example:"Sie hat Blumen gebracht.",exampleTranslation:"Вона принесла квіти."},
  {word:"denken (denkt) · dachte · hat gedacht",translation:"думати",category:"VERB FORMS · DENKEN",example:"Ich habe an dich gedacht.",exampleTranslation:"Я думав про тебе."},
  {word:"dürfen (darf) · durfte · hat gedurft",translation:"мати дозвіл",category:"VERB FORMS · DÜRFEN",example:"Wir haben das früher nicht gedurft.",exampleTranslation:"Раніше нам не дозволяли цього."},
  {word:"essen (isst) · aß · hat gegessen",translation:"їсти",category:"VERB FORMS · ESSEN",example:"Er hat ein Brot gegessen.",exampleTranslation:"Він з'їв хліб."},
  {word:"fahren (fährt) · fuhr · ist gefahren",translation:"їхати / керувати",category:"VERB FORMS · FAHREN",example:"Sie ist mit dem Zug gefahren.",exampleTranslation:"Вона їхала потягом."},
  {word:"fangen (fängt) · fing · hat gefangen",translation:"ловити",category:"VERB FORMS · FANGEN",example:"Das Kind hat den Ball gefangen.",exampleTranslation:"Дитина зловила м'яч."},
  {word:"finden (findet) · fand · hat gefunden",translation:"знаходити",category:"VERB FORMS · FINDEN",example:"Ich habe meinen Schlüssel gefunden.",exampleTranslation:"Я знайшов свій ключ."},
  {word:"fliegen (fliegt) · flog · ist geflogen",translation:"літати",category:"VERB FORMS · FLIEGEN",example:"Wir sind nach Berlin geflogen.",exampleTranslation:"Ми полетіли до Берліна."},
  {word:"geben (gibt) · gab · hat gegeben",translation:"давати",category:"VERB FORMS · GEBEN",example:"Er hat mir ein Buch gegeben.",exampleTranslation:"Він дав мені книжку."},
  {word:"gehen (geht) · ging · ist gegangen",translation:"йти",category:"VERB FORMS · GEHEN",example:"Sie ist nach Hause gegangen.",exampleTranslation:"Вона пішла додому."},
  {word:"haben (hat) · hatte · hat gehabt",translation:"мати",category:"VERB FORMS · HABEN",example:"Wir haben viel Zeit gehabt.",exampleTranslation:"У нас було багато часу."},
  {word:"heißen (heißt) · hieß · hat geheißen",translation:"називатися",category:"VERB FORMS · HEISSEN",example:"Die Straße hat früher anders geheißen.",exampleTranslation:"Раніше вулиця називалася інакше."},
  {word:"helfen (hilft) · half · hat geholfen",translation:"допомагати",category:"VERB FORMS · HELFEN",example:"Meine Freundin hat mir geholfen.",exampleTranslation:"Моя подруга допомогла мені."},
  {word:"kennen (kennt) · kannte · hat gekannt",translation:"знати / бути знайомим",category:"VERB FORMS · KENNEN",example:"Ich habe ihn lange gekannt.",exampleTranslation:"Я давно його знав."},
  {word:"kommen (kommt) · kam · ist gekommen",translation:"приходити / прибувати",category:"VERB FORMS · KOMMEN",example:"Der Bus ist spät gekommen.",exampleTranslation:"Автобус прибув пізно."},
  {word:"können (kann) · konnte · hat gekonnt",translation:"могти / вміти",category:"VERB FORMS · KÖNNEN",example:"Als Kind habe ich das noch nicht gekonnt.",exampleTranslation:"У дитинстві я ще не вмів / не вміла цього."}
];
const a1PreteriteVerbs=new Set(["haben","sein"]);
const pastVerbLegacyA1FormCards=pastVerbLegacyA1SourceCards.map(card=>{
  const [infinitiveAndPresent,,perfect]=card.word.split(" · ");
  const infinitive=infinitiveAndPresent.split(" ")[0];
  return withPerfectAuxiliary(a1PreteriteVerbs.has(infinitive)?card:{...card,word:`${infinitiveAndPresent} · ${perfect}`},perfect);
});
const pastVerbLegacyA1PracticeCards=pastVerbLegacyA1FormCards.map(card=>{
  const [infinitiveAndPresent,...forms]=card.word.split(" · ");
  const infinitive=infinitiveAndPresent.split(" ")[0];
  const includesPreterite=a1PreteriteVerbs.has(infinitive);
  const [preterite,perfect]=includesPreterite?forms:[null,forms[0]];
  const answer=includesPreterite?`${preterite} / ${perfect}`:perfect;
  return withPerfectAuxiliary({word:infinitiveAndPresent,translation:card.translation,category:"PAST VERB FORMS · RECALL",prompt:includesPreterite?`Schreibe Präteritum und Perfekt von ${infinitive}.`:`Schreibe Perfekt von ${infinitive}.`,example:card.example,exampleTranslation:card.exampleTranslation,answer,answerTranslation:answer,practiceType:"cloze"},perfect);
});
function createPastVerbLevelCards(level,entries,{includePreterite=()=>true}={}){
  const formCards=entries.map(([id,infinitive,present,preterite,perfect,translation,example,exampleTranslation])=>{
    const perfectForms=Array.isArray(perfect)?perfect:[perfect];
    const showsPreterite=includePreterite({id,infinitive,present,preterite,perfect:perfectForms,translation});
    const word=showsPreterite?`${infinitive} (${present}) · ${preterite} · ${perfectForms[0]}`:`${infinitive} (${present}) · ${perfectForms[0]}`;
    return withPerfectAuxiliary({
      id:`past-verbs-${level}-${id}-learn`,
      targetId:`past-verb-${level}-${id}`,
      type:"recall",
      word,
      translation,
      category:`VERB FORMS · ${level.toUpperCase()}`,
      promptText:translation,
      example,
      exampleTranslation,
      explanation:showsPreterite?`Präteritum: ${preterite}. Perfekt: ${perfectForms[0]}.`:`Perfekt: ${perfectForms[0]}.`,
      response:{mode:"text",scope:"phrase",accepted:[word],caseSensitive:false,punctuationSensitive:false},
      practiceVariants:false
    },perfectForms[0]);
  });
  const practiceCards=entries.map(([id,infinitive,present,preterite,perfect,translation,example,exampleTranslation])=>{
    const perfectForms=Array.isArray(perfect)?perfect:[perfect];
    const showsPreterite=includePreterite({id,infinitive,present,preterite,perfect:perfectForms,translation});
    const answer=showsPreterite?`${preterite} / ${perfectForms[0]}`:perfectForms[0];
    return withPerfectAuxiliary({
      id:`past-verbs-${level}-${id}-practice`,
      targetId:`past-verb-${level}-${id}`,
      type:"cloze",
      word:`${infinitive} (${present})`,
      translation,
      category:`PAST VERB FORMS · ${level.toUpperCase()}`,
      promptText:showsPreterite?`Schreibe Präteritum und Perfekt von ${infinitive}.`:`Schreibe Perfekt von ${infinitive}.`,
      example,
      exampleTranslation,
      explanation:showsPreterite?`Präteritum: ${preterite}. Perfekt: ${perfectForms[0]}.`:`Perfekt: ${perfectForms[0]}.`,
      response:{mode:"text",scope:"phrase",accepted:showsPreterite?perfectForms.map(form=>`${preterite} / ${form}`):perfectForms,caseSensitive:false,punctuationSensitive:false},
      answer,
      answerTranslation:answer,
      practiceVariants:false
    },perfectForms[0]);
  });
  return {formCards,practiceCards,cards:[...formCards,...practiceCards]};
}
const pastVerbA1AdditionalEntries=[
  ["lesen","lesen","liest","las","hat gelesen","читати","Ich habe den Brief gelesen.","Я прочитав / прочитала листа."],
  ["moegen","mögen","mag","mochte","hat gemocht","любити / подобатися","Als Kind habe ich keinen Spinat gemocht.","У дитинстві я не любив / не любила шпинат."],
  ["muessen","müssen","muss","musste","hat gemusst","мусити","Wir haben das nicht gemusst.","Нам не довелося цього робити."],
  ["nehmen","nehmen","nimmt","nahm","hat genommen","брати","Sie hat den Bus genommen.","Вона поїхала автобусом."],
  ["rufen","rufen","ruft","rief","hat gerufen","кликати","Er hat mich gerufen.","Він мене покликав."],
  ["schlafen","schlafen","schläft","schlief","hat geschlafen","спати","Das Kind hat gut geschlafen.","Дитина добре спала."],
  ["schreiben","schreiben","schreibt","schrieb","hat geschrieben","писати","Ich habe eine E-Mail geschrieben.","Я написав / написала електронного листа."],
  ["schwimmen","schwimmen","schwimmt","schwamm",["hat/ist geschwommen","hat geschwommen","ist geschwommen"],"плавати","Wir sind ans andere Ufer geschwommen.","Ми перепливли на інший берег."],
  ["sehen","sehen","sieht","sah","hat gesehen","бачити","Ich habe den Film schon gesehen.","Я вже бачив / бачила цей фільм."],
  ["sein","sein","ist","war","ist gewesen","бути","Ich bin gestern zu Hause gewesen.","Учора я був / була вдома."],
  ["singen","singen","singt","sang","hat gesungen","співати","Sie haben zusammen gesungen.","Вони співали разом."],
  ["sollen","sollen","soll","sollte","hat gesollt","мати обов'язок / слід","Ich habe das nicht gesollt.","Мені не слід було цього робити."],
  ["sprechen","sprechen","spricht","sprach","hat gesprochen","говорити","Wir haben über das Problem gesprochen.","Ми поговорили про проблему."],
  ["stehen","stehen","steht","stand","hat gestanden","стояти","Das Glas hat auf dem Tisch gestanden.","Склянка стояла на столі."],
  ["treffen","treffen","trifft","traf","hat getroffen","зустрічати","Ich habe meine Freunde getroffen.","Я зустрів / зустріла друзів."],
  ["trinken","trinken","trinkt","trank","hat getrunken","пити","Er hat einen Kaffee getrunken.","Він випив кави."],
  ["tun","tun","tut","tat","hat getan","робити","Was hast du getan?","Що ти зробив / зробила?"],
  ["wissen","wissen","weiß","wusste","hat gewusst","знати","Ich habe die Antwort nicht gewusst.","Я не знав / не знала відповіді."],
  ["wollen","wollen","will","wollte","hat gewollt","хотіти","Sie hat das nicht gewollt.","Вона цього не хотіла."]
];
const pastVerbA2Entries=[
  ["duerfen","dürfen","darf","durfte","hat gedurft","мати дозвіл","Als Kind durfte ich lange aufbleiben.","У дитинстві мені дозволяли довго не спати."],
  ["koennen","können","kann","konnte","hat gekonnt","могти / вміти","Als Kind konnte ich schon schwimmen.","У дитинстві я вже вмів / вміла плавати."],
  ["moegen","mögen","mag","mochte","hat gemocht","любити / подобатися","Früher mochte ich keinen Kaffee.","Раніше я не любив / не любила каву."],
  ["muessen","müssen","muss","musste","hat gemusst","мусити","Letzte Woche musste ich lange arbeiten.","Минулого тижня мені довелося довго працювати."],
  ["sollen","sollen","soll","sollte","hat gesollt","мати обов'язок / слід","Der Arzt sagte, ich sollte zu Hause bleiben.","Лікар сказав, що мені слід залишитися вдома."],
  ["wollen","wollen","will","wollte","hat gewollt","хотіти","Als Kind wollte ich Ärztin werden.","У дитинстві я хотіла стати лікаркою."],
  ["werden","werden","wird","wurde","ist geworden","ставати","Er wurde 1985 in Wien geboren.","Він народився у Відні 1985 року."],
  ["schreiben","schreiben","schreibt","schrieb","hat geschrieben","писати","Sie schrieb mir eine lange E-Mail.","Вона написала мені довгий електронний лист."],
];
const pastVerbB1Entries=[
  ["befehlen","befehlen","befiehlt","befahl","hat befohlen","наказувати","Der Offizier hat den Rückzug befohlen.","Офіцер наказав відступати."],
  ["beissen","beißen","beißt","biss","hat gebissen","кусати","Der Hund hat mich gebissen.","Собака мене вкусив."],
  ["binden","binden","bindet","band","hat gebunden","зв'язувати","Sie hat das Paket mit einer Schnur gebunden.","Вона перев'язала пакунок мотузкою."],
  ["brechen","brechen","bricht","brach",["hat/ist gebrochen","hat gebrochen","ist gebrochen"],"ламати / ламатися","Er hat den Ast gebrochen.","Він зламав гілку."],
  ["brennen","brennen","brennt","brannte","hat gebrannt","горіти","Das Feuer hat die ganze Nacht gebrannt.","Вогонь горів усю ніч."],
  ["empfehlen","empfehlen","empfiehlt","empfahl","hat empfohlen","рекомендувати","Die Ärztin hat mir Ruhe empfohlen.","Лікарка порадила мені відпочинок."],
  ["erschrecken","erschrecken","erschrickt","erschrak","ist erschrocken","лякатися","Ich bin über den Lärm erschrocken.","Я злякався / злякалася шуму."],
  ["fliehen","fliehen","flieht","floh","ist geflohen","тікати","Die Familie ist vor dem Feuer geflohen.","Родина втекла від пожежі."],
  ["fliessen","fließen","fließt","floss","ist geflossen","текти","Das Wasser ist durch das Rohr geflossen.","Вода протекла трубою."],
  ["fressen","fressen","frisst","fraß","hat gefressen","їсти (про тварин)","Die Katze hat den Fisch gefressen.","Кішка з'їла рибу."],
  ["frieren","frieren","friert","fror",["hat/ist gefroren","hat gefroren","ist gefroren"],"мерзнути / замерзати","Der See ist im Winter gefroren.","Озеро замерзло взимку."],
  ["gelingen","gelingen","gelingt","gelang","ist gelungen","вдаватися","Der Plan ist uns gelungen.","Наш план удався."],
  ["gelten","gelten","gilt","galt","hat gegolten","бути чинним","Der alte Pass hat noch gegolten.","Старий паспорт ще був чинним."],
  ["geniessen","genießen","genießt","genoss","hat genossen","насолоджуватися","Wir haben den Urlaub genossen.","Ми насолодилися відпусткою."],
  ["geschehen","geschehen","geschieht","geschah","ist geschehen","траплятися","Was ist gestern geschehen?","Що сталося вчора?"],
  ["giessen","gießen","gießt","goss","hat gegossen","лити / поливати","Sie hat die Blumen gegossen.","Вона полила квіти."],
  ["gleichen","gleichen","gleicht","glich","hat geglichen","бути схожим","Das Kind hat seinem Vater sehr geglichen.","Дитина була дуже схожа на батька."],
  ["graben","graben","gräbt","grub","hat gegraben","копати","Der Hund hat ein Loch gegraben.","Собака викопав яму."],
  ["greifen","greifen","greift","griff","hat gegriffen","хапати","Er hat nach meiner Hand gegriffen.","Він схопив мене за руку."],
  ["halten","halten","hält","hielt","hat gehalten","тримати / зупинятися","Der Bus hat an der Haltestelle gehalten.","Автобус зупинився на зупинці."],
  ["haengen","hängen","hängt","hing","hat gehangen","висіти","Das Bild hat an der Wand gehangen.","Картина висіла на стіні."],
  ["heben","heben","hebt","hob","hat gehoben","піднімати","Sie hat die schwere Kiste gehoben.","Вона підняла важку коробку."],
  ["klingen","klingen","klingt","klang","hat geklungen","звучати","Seine Stimme hat müde geklungen.","Його голос звучав утомлено."],
  ["lassen","lassen","lässt","ließ","hat gelassen","залишати / дозволяти","Ich habe die Tasche zu Hause gelassen.","Я залишив / залишила сумку вдома."],
  ["leiden","leiden","leidet","litt","hat gelitten","страждати","Er hat lange unter Schmerzen gelitten.","Він довго страждав від болю."],
  ["leihen","leihen","leiht","lieh","hat geliehen","позичати","Sie hat mir ihr Fahrrad geliehen.","Вона позичила мені свій велосипед."],
  ["luegen","lügen","lügt","log","hat gelogen","брехати","Er hat über sein Alter gelogen.","Він збрехав про свій вік."],
  ["meiden","meiden","meidet","mied","hat gemieden","уникати","Wir haben die Hauptstraße gemieden.","Ми уникнули головної вулиці."],
  ["messen","messen","misst","maß","hat gemessen","вимірювати","Die Ärztin hat meinen Blutdruck gemessen.","Лікарка виміряла мій тиск."],
  ["raten","raten","rät","riet","hat geraten","радити","Mein Freund hat mir zu einer Pause geraten.","Мій друг порадив мені зробити перерву."],
  ["reiben","reiben","reibt","rieb","hat gerieben","терти","Sie hat den Käse fein gerieben.","Вона дрібно натерла сир."],
  ["reiten","reiten","reitet","ritt",["hat/ist geritten","hat geritten","ist geritten"],"їздити верхи","Wir sind durch den Wald geritten.","Ми проїхали верхи через ліс."],
  ["schaffen","schaffen","schafft","schuf","hat geschaffen","створювати","Die Künstlerin hat ein Meisterwerk geschaffen.","Художниця створила шедевр."],
  ["scheiden","scheiden","scheidet","schied",["hat/ist geschieden","hat geschieden","ist geschieden"],"розділяти / розлучатися","Der Richter hat die Ehe geschieden.","Суддя розірвав шлюб."],
  ["scheinen","scheinen","scheint","schien","hat geschienen","світити / здаватися","Die Sonne hat den ganzen Tag geschienen.","Сонце світило весь день."],
  ["scheissen","scheißen","scheißt","schiss","hat geschissen","випорожнюватися","Der Hund hat auf den Gehweg geschissen.","Собака випорожнився на тротуарі."],
  ["schieben","schieben","schiebt","schob","hat geschoben","штовхати","Er hat den Wagen in die Garage geschoben.","Він заштовхнув автомобіль у гараж."],
  ["schiessen","schießen","schießt","schoss",["hat/ist geschossen","hat geschossen","ist geschossen"],"стріляти","Der Spieler hat ein Tor geschossen.","Гравець забив гол."],
  ["schlagen","schlagen","schlägt","schlug","hat geschlagen","бити","Der Blitz hat in den Baum geschlagen.","Блискавка вдарила в дерево."],
  ["schmeissen","schmeißen","schmeißt","schmiss","hat geschmissen","кидати","Sie hat den Brief in den Müll geschmissen.","Вона викинула лист у сміття."],
  ["schneiden","schneiden","schneidet","schnitt","hat geschnitten","різати","Ich habe das Gemüse klein geschnitten.","Я дрібно нарізав / нарізала овочі."],
  ["schreien","schreien","schreit","schrie","hat geschrien","кричати","Das Kind hat laut geschrien.","Дитина голосно кричала."],
  ["senden","senden","sendet","sandte",["hat gesandt","hat gesendet"],"надсилати","Der Sender hat die Nachricht gesandt.","Радіостанція передала повідомлення."],
  ["sinken","sinken","sinkt","sank","ist gesunken","тонути / знижуватися","Die Temperatur ist stark gesunken.","Температура сильно знизилася."],
  ["springen","springen","springt","sprang","ist gesprungen","стрибати","Das Kind ist ins Wasser gesprungen.","Дитина стрибнула у воду."],
  ["stehlen","stehlen","stiehlt","stahl","hat gestohlen","красти","Jemand hat mein Fahrrad gestohlen.","Хтось украв мій велосипед."],
  ["stinken","stinken","stinkt","stank","hat gestunken","смердіти","Der Abfall hat schrecklich gestunken.","Сміття жахливо смерділо."],
  ["streiten","streiten","streitet","stritt","hat gestritten","сперечатися","Die beiden haben über Geld gestritten.","Вони обоє сперечалися через гроші."],
  ["tragen","tragen","trägt","trug","hat getragen","нести / носити","Er hat den Koffer nach oben getragen.","Він заніс валізу нагору."],
  ["treten","treten","tritt","trat",["hat/ist getreten","hat getreten","ist getreten"],"ступати / бити ногою","Sie ist ins Zimmer getreten.","Вона увійшла до кімнати."],
  ["truegen","trügen","trügt","trog","hat getrogen","обманювати","Der erste Eindruck hat getrogen.","Перше враження було оманливим."],
  ["verzeihen","verzeihen","verzeiht","verzieh","hat verziehen","пробачати","Sie hat ihm den Fehler verziehen.","Вона пробачила йому помилку."],
  ["weisen","weisen","weist","wies","hat gewiesen","вказувати","Der Polizist hat uns den Weg gewiesen.","Поліцейський показав нам дорогу."],
  ["werben","werben","wirbt","warb","hat geworben","рекламувати / вербувати","Die Firma hat für das neue Produkt geworben.","Компанія рекламувала новий продукт."],
  ["wiegen","wiegen","wiegt","wog","hat gewogen","важити / зважувати","Der Koffer hat zwanzig Kilo gewogen.","Валіза важила двадцять кілограмів."],
  ["zwingen","zwingen","zwingt","zwang","hat gezwungen","змушувати","Der Sturm hat uns zur Umkehr gezwungen.","Буря змусила нас повернутися."]
];
const pastVerbA1Additional=createPastVerbLevelCards("a1",pastVerbA1AdditionalEntries,{includePreterite:({id})=>a1PreteriteVerbs.has(id)});
const pastVerbA2=createPastVerbLevelCards("a2",pastVerbA2Entries);
const pastVerbB1=createPastVerbLevelCards("b1",pastVerbB1Entries);
const pastVerbA1FormCards=[...pastVerbLegacyA1FormCards,...pastVerbA1Additional.formCards];
const pastVerbA1PracticeCards=[...pastVerbLegacyA1PracticeCards,...pastVerbA1Additional.practiceCards];
const pastVerbA1Cards=[...pastVerbA1FormCards,...pastVerbA1PracticeCards];
// Position boxes (card.structure): one list of fields per clause, in sentence order; empty fields are left out.
const sentenceClause=fields=>fields.filter(([,text])=>text).map(([role,text])=>({role,text}));
const mainClause=(first,verb,middle="",end="")=>sentenceClause([["first",first],["verb",verb],["middle",middle],["end",end]]);
const subordinateClause=(link,middle,end)=>sentenceClause([["link",link],["middle",middle],["end",end]]);
const verbFirstClause=(verb,middle="",end="")=>sentenceClause([["verb",verb],["middle",middle],["end",end]]);
const perfektFrameCards=[
  {
    id:"perfekt-frame-hausaufgaben",targetId:"perfekt-frame-haben",type:"sentence-build",
    auxiliary:{verb:"haben",form:"habe"},
    structure:[mainClause("Ich","habe","gestern die Hausaufgaben","gemacht")],
    word:"Ich habe gestern die Hausaufgaben gemacht.",translation:"Я вчора зробив / зробила домашнє завдання.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Я вчора зробив / зробила домашнє завдання.",
    example:"haben + gemacht",exampleTranslation:"Відмінюване haben стоїть на другому місці, Partizip II — у кінці.",
    explanation:"Perfekt утворюється з відмінюваної форми haben та Partizip II у кінці речення.",
    response:{mode:"text",scope:"sentence",accepted:["Ich habe gestern die Hausaufgaben gemacht."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-abholen",targetId:"perfekt-frame-haben",type:"sentence-build",
    auxiliary:{verb:"haben",form:"habe"},
    structure:[mainClause("Ich","habe","meine Tochter von der Schule","abgeholt")],
    word:"Ich habe meine Tochter von der Schule abgeholt.",translation:"Я забрав / забрала доньку зі школи.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Я забрав / забрала доньку зі школи.",
    example:"habe + abgeholt",exampleTranslation:"У відокремлюваному дієслові ge стоїть між префіксом і основою.",
    explanation:"Abholen утворює Partizip II abgeholt і вживається з haben.",
    response:{mode:"text",scope:"sentence",accepted:["Ich habe meine Tochter von der Schule abgeholt."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-schreiben",targetId:"perfekt-frame-haben",type:"sentence-build",
    auxiliary:{verb:"haben",form:"hat"},
    structure:[mainClause("Sie","hat","eine E-Mail","geschrieben")],
    word:"Sie hat eine E-Mail geschrieben.",translation:"Вона написала електронного листа.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Вона написала електронного листа.",
    example:"hat + geschrieben",exampleTranslation:"Неправильний Partizip II потрібно запам’ятати разом з інфінітивом.",
    explanation:"Schreiben утворює Partizip II geschrieben і вживається з haben.",
    response:{mode:"text",scope:"sentence",accepted:["Sie hat eine E-Mail geschrieben."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-fahren",targetId:"perfekt-frame-sein",type:"sentence-build",
    auxiliary:{verb:"sein",form:"sind"},
    structure:[mainClause("Wir","sind","nach Berlin","gefahren")],
    word:"Wir sind nach Berlin gefahren.",translation:"Ми поїхали до Берліна.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Ми поїхали до Берліна.",
    example:"sein + gefahren",exampleTranslation:"Рух до іншого місця зазвичай утворює Perfekt із sein.",
    explanation:"Fahren у значенні руху до іншого місця вживається з sein.",
    response:{mode:"text",scope:"sentence",accepted:["Wir sind nach Berlin gefahren."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-ankommen",targetId:"perfekt-frame-sein",type:"sentence-build",
    auxiliary:{verb:"sein",form:"ist"},
    structure:[mainClause("Der Bus","ist","spät","angekommen")],
    word:"Der Bus ist spät angekommen.",translation:"Автобус прибув пізно.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Автобус прибув пізно.",
    example:"ist + angekommen",exampleTranslation:"Ankommen описує прибуття й утворює Perfekt із sein.",
    explanation:"Ankommen вживається з sein; Partizip II має форму angekommen.",
    response:{mode:"text",scope:"sentence",accepted:["Der Bus ist spät angekommen."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-bleiben",targetId:"perfekt-frame-sein",type:"sentence-build",
    auxiliary:{verb:"sein",form:"ist"},
    structure:[mainClause("Er","ist","zu Hause","geblieben")],
    word:"Er ist zu Hause geblieben.",translation:"Він залишився вдома.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Він залишився вдома.",
    example:"ist + geblieben",exampleTranslation:"Bleiben належить до поширених дієслів, що утворюють Perfekt із sein.",
    explanation:"Bleiben вживається з sein і має Partizip II geblieben.",
    response:{mode:"text",scope:"sentence",accepted:["Er ist zu Hause geblieben."],caseSensitive:false,punctuationSensitive:false}
  }
];
const perfektAuxiliaryCards=[
  {
    id:"perfekt-auxiliary-object-brief",targetId:"perfekt-auxiliary-haben-object",type:"cloze",
    auxiliary:{verb:"haben",form:"habe"},
    word:"Ich habe einen Brief geschrieben.",translation:"Я написав / написала листа.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ich ___ einen Brief geschrieben.",support:"У реченні є прямий додаток: einen Brief.",
    example:"Ich habe einen Brief geschrieben.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток einen Brief.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habe"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-object-door",targetId:"perfekt-auxiliary-haben-object",type:"cloze",
    auxiliary:{verb:"haben",form:"hat"},
    word:"Sie hat die Tür geöffnet.",translation:"Вона відчинила двері.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Sie ___ die Tür geöffnet.",support:"У реченні є прямий додаток: die Tür.",
    example:"Sie hat die Tür geöffnet.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток die Tür.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["hat"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-object-film",targetId:"perfekt-auxiliary-haben-object",type:"cloze",
    auxiliary:{verb:"haben",form:"habt"},
    word:"Ihr habt den Film gesehen.",translation:"Ви подивилися фільм.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ihr ___ den Film gesehen.",support:"У реченні є прямий додаток: den Film.",
    example:"Ihr habt den Film gesehen.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток den Film.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-work",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    auxiliary:{verb:"haben",form:"habe"},
    word:"Ich habe gestern gearbeitet.",translation:"Я вчора працював / працювала.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ich ___ gestern gearbeitet.",support:"Це просто дія, без переміщення до іншого місця.",
    example:"Ich habe gestern gearbeitet.",exampleTranslation:"Звичайна діяльність утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо arbeiten описує діяльність, а не переміщення.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habe"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-speak",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    auxiliary:{verb:"haben",form:"haben"},
    word:"Wir haben lange gesprochen.",translation:"Ми довго розмовляли.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Wir ___ lange gesprochen.",support:"Це діяльність, а не зміна місця.",
    example:"Wir haben lange gesprochen.",exampleTranslation:"Звичайна діяльність утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо sprechen описує діяльність.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["haben"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-sleep",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    auxiliary:{verb:"haben",form:"hast"},
    word:"Du hast gut geschlafen.",translation:"Ти добре спав / спала.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Du ___ gut geschlafen.",support:"Це стан або діяльність без переміщення.",
    example:"Du hast gut geschlafen.",exampleTranslation:"Сон утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо schlafen не означає переміщення або зміну стану.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["hast"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-berlin",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    auxiliary:{verb:"sein",form:"ist"},
    word:"Er ist nach Berlin gefahren.",translation:"Він поїхав до Берліна.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Er ___ nach Berlin gefahren.",support:"Підмет перемістився до іншого місця: nach Berlin.",
    example:"Er ist nach Berlin gefahren.",exampleTranslation:"Переміщення до іншого місця зазвичай вимагає sein.",
    explanation:"Використовуємо sein, бо fahren описує переміщення до іншого місця.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-arrive",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    auxiliary:{verb:"sein",form:"sind"},
    word:"Wir sind spät angekommen.",translation:"Ми прибули пізно.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Wir ___ spät angekommen.",support:"Дієслово означає прибуття.",
    example:"Wir sind spät angekommen.",exampleTranslation:"Прибуття утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо ankommen означає прибуття в інше місце.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["sind"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-home",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    auxiliary:{verb:"sein",form:"seid"},
    word:"Ihr seid nach Hause gegangen.",translation:"Ви пішли додому.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ihr ___ nach Hause gegangen.",support:"Підмет перемістився додому.",
    example:"Ihr seid nach Hause gegangen.",exampleTranslation:"Переміщення до іншого місця зазвичай вимагає sein.",
    explanation:"Використовуємо sein, бо gehen описує переміщення.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["seid"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-asleep",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
    auxiliary:{verb:"sein",form:"ist"},
    word:"Das Kind ist eingeschlafen.",translation:"Дитина заснула.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Das Kind ___ eingeschlafen.",support:"Відбулася зміна стану: дитина не спала, а потім заснула.",
    example:"Das Kind ist eingeschlafen.",exampleTranslation:"Зміна стану утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо einschlafen означає перехід у новий стан.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-awake",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
    auxiliary:{verb:"sein",form:"ist"},
    word:"Meine Schwester ist aufgewacht.",translation:"Моя сестра прокинулася.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Meine Schwester ___ aufgewacht.",support:"Відбулася зміна стану: від сну до пробудження.",
    example:"Meine Schwester ist aufgewacht.",exampleTranslation:"Зміна стану утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо aufwachen означає зміну стану.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-become",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
    auxiliary:{verb:"sein",form:"ist"},
    word:"Der Mann ist krank geworden.",translation:"Чоловік захворів.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Der Mann ___ krank geworden.",support:"Стан змінився: здоровий → хворий.",
    example:"Der Mann ist krank geworden.",exampleTranslation:"Зміна стану утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо werden означає перехід у новий стан.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  }
];
const perfektRegularCards=[
  {
    id:"perfekt-regular-machen",targetId:"perfekt-participle-machen",type:"recall",
    word:"gemacht",translation:"Partizip II від machen · робити",category:"PERFEKT · GE-…-T",promptText:"Утвори Partizip II: machen",
    example:"Ich habe meine Hausaufgaben gemacht.",exampleTranslation:"Я зробив / зробила домашнє завдання.",
    explanation:"Регулярне дієслово: ge- + mach + -t.",
    response:{mode:"text",scope:"word",accepted:["gemacht"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-regular-spielen",targetId:"perfekt-participle-spielen",type:"recall",
    word:"gespielt",translation:"Partizip II від spielen · грати",category:"PERFEKT · GE-…-T",promptText:"Утвори Partizip II: spielen",
    example:"Die Kinder haben im Park gespielt.",exampleTranslation:"Діти гралися в парку.",
    explanation:"Регулярне дієслово: ge- + spiel + -t.",
    response:{mode:"text",scope:"word",accepted:["gespielt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-regular-malen",targetId:"perfekt-participle-malen",type:"recall",
    word:"gemalt",translation:"Partizip II від malen · малювати",category:"PERFEKT · GE-…-T",promptText:"Утвори Partizip II: malen",
    example:"Du hast ein schönes Bild gemalt.",exampleTranslation:"Ти намалював / намалювала гарну картину.",
    explanation:"Регулярне дієслово: ge- + mal + -t.",
    response:{mode:"text",scope:"word",accepted:["gemalt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-separable-abholen",targetId:"perfekt-participle-abholen",type:"recall",
    word:"abgeholt",translation:"Partizip II від abholen · забирати",category:"PERFEKT · TRENNBAR",promptText:"Утвори Partizip II: abholen",
    example:"Ich habe meine Tochter von der Schule abgeholt.",exampleTranslation:"Я забрав / забрала доньку зі школи.",
    explanation:"У відокремлюваному дієслові ge стоїть після префікса: ab + ge + holt.",
    response:{mode:"text",scope:"word",accepted:["abgeholt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-separable-aufraeumen",targetId:"perfekt-participle-aufraeumen",type:"recall",
    word:"aufgeräumt",translation:"Partizip II від aufräumen · прибирати",category:"PERFEKT · TRENNBAR",promptText:"Утвори Partizip II: aufräumen",
    example:"Wir haben die Küche aufgeräumt.",exampleTranslation:"Ми прибрали кухню.",
    explanation:"У відокремлюваному дієслові ge стоїть після префікса: auf + ge + räumt.",
    response:{mode:"text",scope:"word",accepted:["aufgeräumt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-separable-zumachen",targetId:"perfekt-participle-zumachen",type:"recall",
    word:"zugemacht",translation:"Partizip II від zumachen · зачиняти",category:"PERFEKT · TRENNBAR",promptText:"Утвори Partizip II: zumachen",
    example:"Sie hat das Fenster zugemacht.",exampleTranslation:"Вона зачинила вікно.",
    explanation:"У відокремлюваному дієслові ge стоїть після префікса: zu + ge + macht.",
    response:{mode:"text",scope:"word",accepted:["zugemacht"],caseSensitive:false,punctuationSensitive:false}
  }
];
const perfektNoGeCards=[
  {
    id:"perfekt-no-ge-erzaehlen",targetId:"perfekt-participle-erzaehlen",type:"recall",
    word:"erzählt",translation:"Partizip II від erzählen · розповідати",category:"PERFEKT · OHNE GE-",promptText:"Утвори Partizip II: erzählen",
    example:"Er hat eine interessante Geschichte erzählt.",exampleTranslation:"Він розповів цікаву історію.",
    explanation:"Невідокремлюваний префікс er- блокує ge-: erzähl + -t.",
    response:{mode:"text",scope:"word",accepted:["erzählt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-no-ge-beantworten",targetId:"perfekt-participle-beantworten",type:"recall",
    word:"beantwortet",translation:"Partizip II від beantworten · відповідати",category:"PERFEKT · OHNE GE-",promptText:"Утвори Partizip II: beantworten",
    example:"Ihr habt alle Fragen beantwortet.",exampleTranslation:"Ви відповіли на всі запитання.",
    explanation:"Невідокремлюваний префікс be- блокує ge-; основа на -t потребує -et.",
    response:{mode:"text",scope:"word",accepted:["beantwortet"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-no-ge-bearbeiten",targetId:"perfekt-participle-bearbeiten",type:"recall",
    word:"bearbeitet",translation:"Partizip II від bearbeiten · опрацьовувати",category:"PERFEKT · OHNE GE-",promptText:"Утвори Partizip II: bearbeiten",
    example:"Wir haben die Aufgabe zusammen bearbeitet.",exampleTranslation:"Ми разом опрацювали завдання.",
    explanation:"Невідокремлюваний префікс be- блокує ge-; основа на -t потребує -et.",
    response:{mode:"text",scope:"word",accepted:["bearbeitet"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-no-ge-studieren",targetId:"perfekt-participle-studieren",type:"recall",
    word:"studiert",translation:"Partizip II від studieren · навчатися",category:"PERFEKT · -IEREN",promptText:"Утвори Partizip II: studieren",
    example:"Ich habe in Kyjiw studiert.",exampleTranslation:"Я навчався / навчалася в Києві.",
    explanation:"Дієслова на -ieren не мають ge- й утворюють Partizip II із закінченням -iert.",
    response:{mode:"text",scope:"word",accepted:["studiert"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-no-ge-reparieren",targetId:"perfekt-participle-reparieren",type:"recall",
    word:"repariert",translation:"Partizip II від reparieren · ремонтувати",category:"PERFEKT · -IEREN",promptText:"Утвори Partizip II: reparieren",
    example:"Der Mechaniker hat das Auto repariert.",exampleTranslation:"Механік відремонтував автомобіль.",
    explanation:"Дієслова на -ieren не мають ge- й утворюють Partizip II із закінченням -iert.",
    response:{mode:"text",scope:"word",accepted:["repariert"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-no-ge-telefonieren",targetId:"perfekt-participle-telefonieren",type:"recall",
    word:"telefoniert",translation:"Partizip II від telefonieren · телефонувати",category:"PERFEKT · -IEREN",promptText:"Утвори Partizip II: telefonieren",
    example:"Sie hat lange mit ihrer Mutter telefoniert.",exampleTranslation:"Вона довго розмовляла телефоном зі своєю мамою.",
    explanation:"Дієслова на -ieren не мають ge- й утворюють Partizip II із закінченням -iert.",
    response:{mode:"text",scope:"word",accepted:["telefoniert"],caseSensitive:false,punctuationSensitive:false}
  }
];
const perfektIrregularCards=[
  {
    id:"perfekt-irregular-schreiben",targetId:"perfekt-participle-schreiben",type:"recall",
    word:"geschrieben",translation:"Partizip II від schreiben · писати",category:"PERFEKT · UNREGELMÄSSIG",promptText:"Утвори Partizip II: schreiben",
    example:"Ich habe eine E-Mail geschrieben.",exampleTranslation:"Я написав / написала електронного листа.",
    explanation:"Сильне дієслово змінює основу й має закінчення -en: geschrieben.",
    response:{mode:"text",scope:"word",accepted:["geschrieben"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-sprechen",targetId:"perfekt-participle-sprechen",type:"recall",
    word:"gesprochen",translation:"Partizip II від sprechen · говорити",category:"PERFEKT · UNREGELMÄSSIG",promptText:"Утвори Partizip II: sprechen",
    example:"Wir haben über den Kurs gesprochen.",exampleTranslation:"Ми говорили про курс.",
    explanation:"Сильне дієслово змінює основу й має закінчення -en: gesprochen.",
    response:{mode:"text",scope:"word",accepted:["gesprochen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-abfahren",targetId:"perfekt-participle-abfahren",type:"recall",
    word:"abgefahren",translation:"Partizip II від abfahren · від'їжджати",category:"PERFEKT · TRENNBAR + STARK",promptText:"Утвори Partizip II: abfahren",
    example:"Der Zug ist pünktlich abgefahren.",exampleTranslation:"Потяг відправився вчасно.",
    explanation:"Відокремлюваний префікс зберігається перед ge: ab + ge + fahren.",
    response:{mode:"text",scope:"word",accepted:["abgefahren"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-ankommen",targetId:"perfekt-participle-ankommen",type:"recall",
    word:"angekommen",translation:"Partizip II від ankommen · прибувати",category:"PERFEKT · TRENNBAR + STARK",promptText:"Утвори Partizip II: ankommen",
    example:"Meine Freunde sind gestern angekommen.",exampleTranslation:"Мої друзі прибули вчора.",
    explanation:"Відокремлюваний префікс зберігається перед ge: an + ge + kommen.",
    response:{mode:"text",scope:"word",accepted:["angekommen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-versprechen",targetId:"perfekt-participle-versprechen",type:"recall",
    word:"versprochen",translation:"Partizip II від versprechen · обіцяти",category:"PERFEKT · UNTRENNBAR",promptText:"Утвори Partizip II: versprechen",
    example:"Du hast mir deine Hilfe versprochen.",exampleTranslation:"Ти пообіцяв / пообіцяла мені допомогу.",
    explanation:"Невідокремлюваний префікс ver- блокує ge-; сильна форма — versprochen.",
    response:{mode:"text",scope:"word",accepted:["versprochen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-verbringen",targetId:"perfekt-participle-verbringen",type:"recall",
    word:"verbracht",translation:"Partizip II від verbringen · проводити (час)",category:"PERFEKT · UNTRENNBAR",promptText:"Утвори Partizip II: verbringen",
    example:"Wir haben den Sommer am Meer verbracht.",exampleTranslation:"Ми провели літо біля моря.",
    explanation:"Невідокремлюваний префікс ver- блокує ge-; неправильна форма — verbracht.",
    response:{mode:"text",scope:"word",accepted:["verbracht"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-gefallen",targetId:"perfekt-participle-gefallen",type:"recall",
    word:"gefallen",translation:"Partizip II від gefallen · подобатися",category:"PERFEKT · BESONDERE FORM",promptText:"Утвори Partizip II: gefallen",
    example:"Der Film hat mir gut gefallen.",exampleTranslation:"Мені дуже сподобався фільм.",
    explanation:"Ge- належить до основи дієслова; Partizip II має форму gefallen.",
    response:{mode:"text",scope:"word",accepted:["gefallen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-irregular-gehoeren",targetId:"perfekt-participle-gehoeren",type:"recall",
    word:"gehört",translation:"Partizip II від gehören · належати",category:"PERFEKT · BESONDERE FORM",promptText:"Утвори Partizip II: gehören",
    example:"Das Buch hat meiner Schwester gehört.",exampleTranslation:"Книжка належала моїй сестрі.",
    explanation:"Ge- належить до основи дієслова; регулярне закінчення дає форму gehört.",
    response:{mode:"text",scope:"word",accepted:["gehört"],caseSensitive:false,punctuationSensitive:false}
  }
];
const perfektCards=[...perfektFrameCards,...perfektAuxiliaryCards,...perfektRegularCards,...perfektNoGeCards,...perfektIrregularCards];
const clozeCard=(word,translation,prompt)=>({word,translation,category:"CLOZE PRACTICE",prompt,exampleTranslation:"Доповни речення правильною формою дієслова.",practiceVariants:false});
const translationCard=(word,translation)=>({word,translation,category:"TRANSLATION PRACTICE",prompt:translation,example:word,exampleTranslation:"Введіть лише відмінювану форму дієслова.",practiceVariants:false});
const presentPracticeCards=[
  clozeCard("Wohin gehst du?","Куди ти йдеш?","Wohin ___ du? (gehen)"),
  clozeCard("Was machst du?","Що ти робиш?","Was ___ du? (machen)"),
  clozeCard("Wie geht es dir?","Як ти поживаєш?","Wie ___ es dir? (gehen)"),
  clozeCard("Wo liegt das Buch?","Де лежить книга?","Wo ___ das Buch? (liegen)"),
  clozeCard("Wie heißen Sie?","Як Вас звати?","Wie ___ Sie? (heißen)"),
  clozeCard("Wo arbeitest du?","Де ти працюєш?","Wo ___ du? (arbeiten)"),
  clozeCard("Woher kommst du?","Звідки ти?","Woher ___ du? (kommen)"),
  clozeCard("Wohin fahren sie?","Куди вони їдуть?","Wohin ___ sie? (fahren)"),
  clozeCard("Was machst du heute Abend?","Що ти робиш сьогодні ввечері?","Was ___ du heute Abend? (machen)"),
  clozeCard("Mein Vater arbeitet bis spät in der Nacht.","Мій батько працює до пізньої ночі.","Mein Vater ___ bis spät in der Nacht. (arbeiten)"),
  clozeCard("Die Kinder schlafen sehr gut in der Nacht.","Діти дуже добре сплять уночі.","Die Kinder ___ sehr gut in der Nacht. (schlafen)"),
  clozeCard("Wir helfen euch sehr gerne.","Ми дуже раді вам допомогти.","Wir ___ euch sehr gerne. (helfen)"),
  clozeCard("Er kauft ein neues Auto.","Він купує нову машину.","Er ___ ein neues Auto. (kaufen)"),
  clozeCard("Er heißt Paul und arbeitet als Seemann.","Його звати Пауль, і він працює моряком.","Er ___ Paul und ___ als Seemann. (heißen, arbeiten)"),
  clozeCard("Wir fahren morgen nach Frankreich.","Ми завтра їдемо до Франції.","Wir ___ morgen nach Frankreich. (fahren)"),
  clozeCard("Er geht immer noch in die Schule.","Він все ще ходить до школи.","Er ___ immer noch in die Schule. (gehen)"),
  clozeCard("Ich heiße Tanja.","Мене звати Таня.","Ich ___ Tanja. (heißen)"),
  clozeCard("Eva ist drei Jahre alt.","Єві три роки.","Eva ___ drei Jahre alt. (sein)"),
  clozeCard("Meine Mutter ist Köchin.","Моя мама кухарка.","Meine Mutter ___ Köchin. (sein)"),
  clozeCard("Wir wohnen zusammen.","Ми живемо разом.","Wir ___ zusammen. (wohnen)"),
  clozeCard("Mein Mann arbeitet im Büro.","Мій чоловік працює в офісі.","Mein Mann ___ im Büro. (arbeiten)"),
  clozeCard("Meine Familie besteht aus drei Personen.","Моя сім'я складається з трьох осіб.","Meine Familie ___ aus drei Personen. (bestehen)"),
  clozeCard("Meine Mutter arbeitet in einer Bank.","Моя мама працює в банку.","Meine Mutter ___ in einer Bank. (arbeiten)"),
  clozeCard("Am Samstag gehen wir oft ins Kino.","У суботу ми часто ходимо в кіно.","Am Samstag ___ wir oft ins Kino. (gehen)"),
  clozeCard("Ich arbeite als Rezeptionist in einem Hotel.","Я працюю адміністратором у готелі.","Ich ___ als Rezeptionist in einem Hotel. (arbeiten)"),
  clozeCard("Er wartet schon lange.","Він уже довго чекає.","Er ___ schon lange. (warten)"),
  clozeCard("Ich finde meine Brille nicht.","Я не можу знайти свої окуляри.","Ich ___ meine Brille nicht. (finden)"),
  clozeCard("Sie bittet dich um Hilfe.","Вона просить тебе про допомогу.","Sie ___ dich um Hilfe. (bitten)"),
  clozeCard("Er grüßt mich nie.","Він ніколи зі мною не вітається.","Er ___ mich nie. (grüßen)"),
  clozeCard("Wann heiratet ihr?","Коли ви одружуєтеся?","Wann ___ ihr? (heiraten)"),
  clozeCard("Mein Bruder tanzt auf der Bühne.","Мій брат танцює на сцені.","Mein Bruder ___ auf der Bühne. (tanzen)"),
  clozeCard("Die Kinder schlafen in ihren Zimmern.","Діти сплять у своїх кімнатах.","Die Kinder ___ in ihren Zimmern. (schlafen)"),
  clozeCard("Ich verspreche es.","Я обіцяю це.","Ich ___ es. (versprechen)"),
  translationCard("Er wartet.","Він чекає."),
  translationCard("Wo arbeitest du?","Де ти працюєш?"),
  translationCard("Wohin gehst du?","Куди ти йдеш?"),
  translationCard("Der Vater repariert das Auto.","Батько ремонтує машину."),
  translationCard("Die Mutter kocht das Abendessen.","Мати готує вечерю."),
  translationCard("Er raucht.","Він курить."),
  translationCard("Wir machen die Hausaufgaben.","Ми робимо домашнє завдання."),
  translationCard("Sie sprechen.","Вони розмовляють."),
  translationCard("Wohin fahren wir in den Urlaub?","Куди ми їдемо у відпустку?"),
  translationCard("Sie kauft Essen.","Вона купує їжу."),
  translationCard("Wann kommst du?","Коли ти прийдеш?"),
  translationCard("Woher kommst du?","Звідки ти?"),
  translationCard("Die Kinder schlafen.","Діти сплять."),
  translationCard("Wir bleiben zu Hause.","Ми залишаємось вдома."),
  translationCard("Er macht Sport.","Він займається спортом."),
  translationCard("Ich trinke Wasser.","Я п'ю воду."),
  translationCard("Ich sehe gut.","Я добре бачу."),
  translationCard("Ich möchte eine Pizza.","Я б хотів піцу."),
  translationCard("Was machst du heute Abend?","Що ти робиш сьогодні ввечері?"),
  translationCard("Ich suche meine Brille.","Я шукаю свої окуляри."),
  translationCard("Sie tanzt, und er singt.","Вона танцює, а він співає."),
  translationCard("Ich schreibe auf Deutsch.","Я пишу німецькою."),
  translationCard("Kaufen Sie Tickets?","Ви купуєте квитки?"),
  translationCard("Warum machst du das?","Чому ти це робиш?")
];
const presentPracticeTargets={
  "Wohin gehst du?":["gehst","йдеш"],
  "Was machst du?":["machst","робиш"],
  "Wie geht es dir?":["geht","йде"],
  "Wo liegt das Buch?":["liegt","лежить"],
  "Wie heißen Sie?":["heißen","звати"],
  "Wo arbeitest du?":["arbeitest","працюєш"],
  "Woher kommst du?":["kommst","приходиш"],
  "Wohin fahren sie?":["fahren","їдуть"],
  "Was machst du heute Abend?":["machst","робиш"],
  "Mein Vater arbeitet bis spät in der Nacht.":["arbeitet","працює"],
  "Die Kinder schlafen sehr gut in der Nacht.":["schlafen","сплять"],
  "Wir helfen euch sehr gerne.":["helfen","допомагаємо"],
  "Er kauft ein neues Auto.":["kauft","купує"],
  "Er heißt Paul und arbeitet als Seemann.":["heißt / arbeitet","звати / працює"],
  "Wir fahren morgen nach Frankreich.":["fahren","їдемо"],
  "Er geht immer noch in die Schule.":["geht","ходить"],
  "Ich heiße Tanja.":["heiße","звати"],
  "Eva ist drei Jahre alt.":["ist","є"],
  "Meine Mutter ist Köchin.":["ist","є"],
  "Wir wohnen zusammen.":["wohnen","живемо"],
  "Mein Mann arbeitet im Büro.":["arbeitet","працює"],
  "Meine Familie besteht aus drei Personen.":["besteht","складається"],
  "Meine Mutter arbeitet in einer Bank.":["arbeitet","працює"],
  "Am Samstag gehen wir oft ins Kino.":["gehen","ходимо"],
  "Ich arbeite als Rezeptionist in einem Hotel.":["arbeite","працюю"],
  "Er wartet schon lange.":["wartet","чекає"],
  "Ich finde meine Brille nicht.":["finde","знаходжу"],
  "Sie bittet dich um Hilfe.":["bittet","просить"],
  "Er grüßt mich nie.":["grüßt","вітається"],
  "Wann heiratet ihr?":["heiratet","одружуєтеся"],
  "Mein Bruder tanzt auf der Bühne.":["tanzt","танцює"],
  "Die Kinder schlafen in ihren Zimmern.":["schlafen","сплять"],
  "Ich verspreche es.":["verspreche","обіцяю"],
  "Er wartet.":["wartet","чекає"],
  "Wo arbeitest du?":["arbeitest","працюєш"],
  "Wohin gehst du?":["gehst","йдеш"],
  "Der Vater repariert das Auto.":["repariert","ремонтує"],
  "Die Mutter kocht das Abendessen.":["kocht","готує"],
  "Er raucht.":["raucht","курить"],
  "Wir machen die Hausaufgaben.":["machen","робимо"],
  "Sie sprechen.":["sprechen","розмовляють"],
  "Wohin fahren wir in den Urlaub?":["fahren","їдемо"],
  "Sie kauft Essen.":["kauft","купує"],
  "Wann kommst du?":["kommst","приходиш"],
  "Woher kommst du?":["kommst","приходиш"],
  "Die Kinder schlafen.":["schlafen","сплять"],
  "Wir bleiben zu Hause.":["bleiben","залишаємося"],
  "Er macht Sport.":["macht","займається"],
  "Ich trinke Wasser.":["trinke","п'ю"],
  "Ich sehe gut.":["sehe","бачу"],
  "Ich möchte eine Pizza.":["möchte","хочу"],
  "Ich suche meine Brille.":["suche","шукаю"],
  "Sie tanzt, und er singt.":["tanzt / singt","танцює / співає"],
  "Ich schreibe auf Deutsch.":["schreibe","пишу"],
  "Kaufen Sie Tickets?":["kaufen","купуєте"],
  "Warum machst du das?":["machst","робиш"]
};
presentPracticeCards.forEach(card=>{
  const target=presentPracticeTargets[card.word];
  if(!target)throw new Error(`Missing present-tense target for "${card.word}"`);
  card.answer=target[0];
  card.answerTranslation=target[1];
});
const modalClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"KÖNNEN · LÜCKENTEXT",prompt,example:prompt,exampleTranslation:"Доповни речення правильною формою können.",answer,answerTranslation,practiceVariants:false});
const modalSentenceCard=(word,translation,prompt,category="KÖNNEN · SATZBILDUNG")=>({word,translation,category,prompt,exampleTranslation:"Напиши повну відповідь німецькою.",answer:word,answerTranslation:translation,practiceType:"sentence"});
const modalOrderSentenceCard=(word,translation,prompt,structure,category)=>({...modalSentenceCard(word,translation,prompt,category),structure});
const modalVerbClozeCard=(verb,word,translation,prompt,answer,answerTranslation)=>({word,translation,category:`MODALVERB · ${verb.toUpperCase()} · LÜCKENTEXT`,prompt,example:prompt,exampleTranslation:`Доповни речення правильною формою ${verb}.`,answer,answerTranslation,practiceVariants:false});
const modalResponse=(accepted,scope="word")=>({mode:"text",scope,accepted,caseSensitive:false,punctuationSensitive:false});
const wollenFormCard=({id,targetId,word,accepted,translation,example,exampleTranslation})=>({id,targetId,type:"recall",word,translation,category:"MODALVERB · WOLLEN",example,exampleTranslation,explanation:`${word} — форма wollen: ${translation}.`,response:modalResponse(accepted,"phrase")});
const wollenClozeCard=({id,targetId,word,translation,prompt,answer,answerTranslation,explanation})=>({...modalVerbClozeCard("wollen",word,translation,prompt,answer,answerTranslation),id,targetId,type:"cloze",explanation,response:modalResponse([answer])});
const wollenOrderCard=({id,targetId,word,translation,category,example,exampleTranslation,structure})=>({id,targetId,type:"sentence-build",word,translation,category,example,exampleTranslation,explanation:exampleTranslation,structure,response:modalResponse([word],"sentence")});
const wollenOrderPracticeCard=({id,targetId,word,translation,prompt,structure,explanation})=>({...modalOrderSentenceCard(word,translation,prompt,structure,"WOLLEN · SATZBILDUNG"),id,targetId,type:"sentence-build",explanation,response:modalResponse([word],"sentence")});
const koennenParadigm=verbParadigm("können","k[a]nn| k[a]nn|st k[a]nn| könn|en könn|t könn|en","ö → a");
const koennenFormCards=withVerbParadigms([
  {word:"ich kann",translation:"я можу / вмію",category:"MODALVERB · KÖNNEN",example:"Ich kann sehr gut malen.",exampleTranslation:"Я можу дуже добре малювати."},
  {word:"du kannst",translation:"ти можеш / вмієш",category:"MODALVERB · KÖNNEN",example:"Du kannst im Sommer schwimmen.",exampleTranslation:"Ти можеш плавати влітку."},
  {word:"er / sie / es kann",translation:"він / вона / воно може",category:"MODALVERB · KÖNNEN",example:"Sie kann gut Schach spielen.",exampleTranslation:"Вона може добре грати в шахи."},
  {word:"wir können",translation:"ми можемо / вміємо",category:"MODALVERB · KÖNNEN",example:"Wir können im Winter Ski fahren.",exampleTranslation:"Ми можемо кататися на лижах узимку."},
  {word:"ihr könnt",translation:"ви можете / вмієте",category:"MODALVERB · KÖNNEN",example:"Ihr könnt zusammen Rad fahren.",exampleTranslation:"Ви можете разом кататися на велосипеді."},
  {word:"sie / Sie können",translation:"вони можуть / Ви можете",category:"MODALVERB · KÖNNEN",example:"Sie können gut Gitarre spielen.",exampleTranslation:"Вони можуть добре грати на гітарі."}
],[koennenParadigm]);
const moegenParadigm=verbParadigm("mögen","m[a]g| m[a]g|st m[a]g| mög|en mög|t mög|en","ö → a");
const moegenFormCards=withVerbParadigms([
  {word:"ich mag",translation:"я люблю / мені подобається",category:"MODALVERB · MÖGEN",example:"Ich mag Kaffee.",exampleTranslation:"Я люблю каву."},
  {word:"du magst",translation:"ти любиш / тобі подобається",category:"MODALVERB · MÖGEN",example:"Du magst deutsche Musik.",exampleTranslation:"Тобі подобається німецька музика."},
  {word:"er / sie / es mag",translation:"він / вона / воно любить",category:"MODALVERB · MÖGEN",example:"Sie mag Schokolade.",exampleTranslation:"Вона любить шоколад."},
  {word:"wir mögen",translation:"ми любимо / нам подобається",category:"MODALVERB · MÖGEN",example:"Wir mögen Pizza.",exampleTranslation:"Ми любимо піцу."},
  {word:"ihr mögt",translation:"ви любите / вам подобається",category:"MODALVERB · MÖGEN",example:"Ihr mögt Bücher.",exampleTranslation:"Вам подобаються книжки."},
  {word:"sie / Sie mögen",translation:"вони люблять / Ви любите",category:"MODALVERB · MÖGEN",example:"Sie mögen den Film.",exampleTranslation:"Їм подобається фільм."}
],[moegenParadigm]);
const moechtenParadigm=verbParadigm("möchten","möcht|e möcht|est möcht|e möcht|en möcht|et möcht|en","ich = er/sie/es");
const moechtenFormCards=withVerbParadigms([
  {word:"ich möchte",translation:"я хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Ich möchte einen Tee.",exampleTranslation:"Я хотів би / хотіла б чай."},
  {word:"du möchtest",translation:"ти хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Du möchtest nach Hause gehen.",exampleTranslation:"Ти хотів би / хотіла б піти додому."},
  {word:"er / sie / es möchte",translation:"він / вона / воно хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Sie möchte Deutsch lernen.",exampleTranslation:"Вона хотіла б вивчати німецьку."},
  {word:"wir möchten",translation:"ми хотіли б",category:"MODALVERB · MÖCHTEN",example:"Wir möchten etwas essen.",exampleTranslation:"Ми хотіли б щось поїсти."},
  {word:"ihr möchtet",translation:"ви хотіли б",category:"MODALVERB · MÖCHTEN",example:"Ihr möchtet ins Kino gehen.",exampleTranslation:"Ви хотіли б піти в кіно."},
  {word:"sie / Sie möchten",translation:"вони хотіли б / Ви хотіли б",category:"MODALVERB · MÖCHTEN",example:"Sie möchten bezahlen.",exampleTranslation:"Вони хотіли б заплатити."}
],[moechtenParadigm]);
const wollenParadigm=verbParadigm("wollen","w[i]ll| w[i]ll|st w[i]ll| woll|en woll|t woll|en","o → i");
const wollenFormCards=withVerbParadigms([
  wollenFormCard({id:"wollen-ich-recall",targetId:"wollen-ich",word:"ich will",accepted:["ich will"],translation:"я хочу / маю намір",example:"Ich will Italienisch lernen.",exampleTranslation:"Я хочу вивчати італійську."}),
  wollenFormCard({id:"wollen-du-recall",targetId:"wollen-du",word:"du willst",accepted:["du willst"],translation:"ти хочеш / маєш намір",example:"Du willst heute Abend ins Kino gehen.",exampleTranslation:"Ти хочеш сьогодні ввечері піти в кіно."}),
  wollenFormCard({id:"wollen-er-recall",targetId:"wollen-er",word:"er / sie / es will",accepted:["er will","sie will","es will"],translation:"він / вона / воно хоче",example:"Sie will im Urlaub Ski fahren.",exampleTranslation:"Вона хоче кататися на лижах у відпустці."}),
  wollenFormCard({id:"wollen-wir-recall",targetId:"wollen-wir",word:"wir wollen",accepted:["wir wollen"],translation:"ми хочемо",example:"Wir wollen zusammen kochen.",exampleTranslation:"Ми хочемо готувати разом."}),
  wollenFormCard({id:"wollen-ihr-recall",targetId:"wollen-ihr",word:"ihr wollt",accepted:["ihr wollt"],translation:"ви хочете",example:"Ihr wollt nach Berlin fahren.",exampleTranslation:"Ви хочете поїхати до Берліна."}),
  wollenFormCard({id:"wollen-sie-recall",targetId:"wollen-sie",word:"sie / Sie wollen",accepted:["sie wollen"],translation:"вони хочуть / Ви хочете",example:"Sie wollen unbedingt noch Deutsch lernen.",exampleTranslation:"Вони неодмінно хочуть ще вивчати німецьку."})
],[wollenParadigm]);
const moegenMoechtenComparisonCards=[
  {word:"Ich mag Kaffee.",translation:"Мені подобається кава.",category:"MODALVERBEN · MÖGEN ODER MÖCHTEN",example:"mögen = мати вподобання",exampleTranslation:"Mögen описує те, що вам загалом подобається."},
  {word:"Ich möchte einen Kaffee.",translation:"Я хотів би / хотіла б каву.",category:"MODALVERBEN · MÖGEN ODER MÖCHTEN",example:"möchten = ввічливе бажання",exampleTranslation:"Möchten висловлює ввічливе бажання або замовлення."},
  {word:"mögen → möchten",translation:"möchten — форма Konjunktiv II від mögen",category:"MODALVERBEN · ЗВ'ЯЗОК",example:"Ich mag Kaffee. / Ich möchte einen Kaffee.",exampleTranslation:"Möchten походить від mögen, але в сучасній мові зазвичай означає «хотів би / хотіла б»."}
];
const koennenWordOrderCards=[
  {word:"Ich kann heute mit dem Auto zur Arbeit fahren.",translation:"Я можу сьогодні їхати на роботу машиною.",category:"KÖNNEN · AUSSAGESATZ",example:"Subjekt + können + heute + ... + Infinitiv am Ende",exampleTranslation:"Після können основне дієслово стоїть в інфінітиві в кінці речення.",structure:[mainClause("Ich","kann","heute mit dem Auto zur Arbeit","fahren")]},
  {word:"Heute kann ich mit dem Auto zur Arbeit fahren.",translation:"Сьогодні я можу їхати на роботу машиною.",category:"KÖNNEN · AUSSAGESATZ",example:"Temporal + können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Якщо час стоїть першим, відмінюване können залишається на другому місці.",structure:[mainClause("Heute","kann","ich mit dem Auto zur Arbeit","fahren")]},
  {word:"Kann ich heute mit dem Auto zur Arbeit fahren?",translation:"Чи можу я сьогодні їхати на роботу машиною?",category:"KÖNNEN · JA/NEIN-FRAGE",example:"Können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"У питанні без питального слова können стоїть першим.",structure:[verbFirstClause("Kann","ich heute mit dem Auto zur Arbeit","fahren")]},
  {word:"Wohin kannst du mit dem Auto fahren?",translation:"Куди ти можеш поїхати машиною?",category:"KÖNNEN · W-FRAGE",example:"W-Frage + können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Питальне слово стоїть першим, а können - другим.",structure:[mainClause("Wohin","kannst","du mit dem Auto","fahren")]}
];
const wollenWordOrderCards=[
  wollenOrderCard({id:"wollen-order-unbedingt-learn",targetId:"wollen-order-unbedingt",word:"Ich will unbedingt noch Italienisch lernen.",translation:"Я неодмінно хочу ще вивчити італійську.",category:"WOLLEN · AUSSAGESATZ",example:"Subjekt + wollen + Angaben + ... + Infinitiv am Ende",exampleTranslation:"Обставини стоять між wollen і інфінітивом, а інфінітив — у кінці речення.",structure:[mainClause("Ich","will","unbedingt noch Italienisch","lernen")]}),
  wollenOrderCard({id:"wollen-order-keinen-learn",targetId:"wollen-order-keinen",word:"Ich will auf keinen Fall im Urlaub arbeiten.",translation:"Я ні в якому разі не хочу працювати у відпустці.",category:"WOLLEN · AUSSAGESATZ",example:"Subjekt + wollen + Angaben + ... + Infinitiv am Ende",exampleTranslation:"Auf keinen Fall (ні в якому разі) стоїть після wollen, а інфінітив — у кінці.",structure:[mainClause("Ich","will","auf keinen Fall im Urlaub","arbeiten")]}),
  wollenOrderCard({id:"wollen-order-was-learn",targetId:"wollen-order-was",word:"Was willst du beruflich machen?",translation:"Чим ти хочеш займатися за професією?",category:"WOLLEN · W-FRAGE",example:"W-Frage + wollen + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Питальне слово стоїть першим, а wollen — другим.",structure:[mainClause("Was","willst","du beruflich","machen")]}),
  wollenOrderCard({id:"wollen-order-ja-nein-learn",targetId:"wollen-order-ja-nein",word:"Willst du heute Abend ins Kino gehen?",translation:"Ти хочеш сьогодні ввечері піти в кіно?",category:"WOLLEN · JA/NEIN-FRAGE",example:"Wollen + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"У питанні без питального слова wollen стоїть першим.",structure:[verbFirstClause("Willst","du heute Abend ins Kino","gehen")]}),
  wollenOrderCard({id:"wollen-order-temporal-learn",targetId:"wollen-order-temporal",word:"Heute Abend will ich ins Kino gehen.",translation:"Сьогодні ввечері я хочу піти в кіно.",category:"WOLLEN · AUSSAGESATZ",example:"Temporal + wollen + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Якщо час стоїть першим, відмінюване wollen залишається на другому місці.",structure:[mainClause("Heute Abend","will","ich ins Kino","gehen")]})
];
const wollenWordOrderPracticeCards=[
  wollenOrderPracticeCard({id:"wollen-order-unbedingt-practice",targetId:"wollen-order-unbedingt",word:"Ich will unbedingt noch Italienisch lernen.",translation:"Я неодмінно хочу ще вивчити італійську.",prompt:"unbedingt noch / Italienisch / ich / lernen / wollen.",structure:[mainClause("Ich","will","unbedingt noch Italienisch","lernen")],explanation:"Wollen стоїть на другому місці, обставини — між ним і інфінітивом, інфінітив — у кінці."}),
  wollenOrderPracticeCard({id:"wollen-order-keinen-practice",targetId:"wollen-order-keinen",word:"Ich will auf keinen Fall im Urlaub arbeiten.",translation:"Я ні в якому разі не хочу працювати у відпустці.",prompt:"im Urlaub / arbeiten / ich / auf keinen Fall / wollen.",structure:[mainClause("Ich","will","auf keinen Fall im Urlaub","arbeiten")],explanation:"Wollen стоїть на другому місці, auf keinen Fall — після нього, інфінітив — у кінці."}),
  wollenOrderPracticeCard({id:"wollen-order-was-practice",targetId:"wollen-order-was",word:"Was willst du beruflich machen?",translation:"Чим ти хочеш займатися за професією?",prompt:"machen / du / beruflich / was / wollen?",structure:[mainClause("Was","willst","du beruflich","machen")],explanation:"Питальне слово стоїть першим, wollen — другим, інфінітив — у кінці."}),
  wollenOrderPracticeCard({id:"wollen-order-ja-nein-practice",targetId:"wollen-order-ja-nein",word:"Willst du heute Abend ins Kino gehen?",translation:"Ти хочеш сьогодні ввечері піти в кіно?",prompt:"ins Kino / gehen / heute Abend / du / wollen?",structure:[verbFirstClause("Willst","du heute Abend ins Kino","gehen")],explanation:"У питанні без питального слова wollen стоїть першим, інфінітив — у кінці."}),
  wollenOrderPracticeCard({id:"wollen-order-temporal-practice",targetId:"wollen-order-temporal",word:"Heute Abend will ich ins Kino gehen.",translation:"Сьогодні ввечері я хочу піти в кіно.",prompt:"gehen / ich / ins Kino / heute Abend / wollen.",structure:[mainClause("Heute Abend","will","ich ins Kino","gehen")],explanation:"Час стоїть першим, wollen — другим, інфінітив — у кінці."})
];
const koennenPracticeCards=[
  modalClozeCard("Ich kann sehr gut malen.","Я можу дуже добре малювати.","Ich ___ sehr gut malen.","kann","можу"),
  modalClozeCard("Du kannst im Sommer gerne schwimmen.","Ти можеш охоче плавати влітку.","Du ___ im Sommer gerne schwimmen.","kannst","можеш"),
  modalClozeCard("Wir können im Winter Ski fahren.","Ми можемо кататися на лижах узимку.","Wir ___ im Winter Ski fahren.","können","можемо"),
  modalClozeCard("Er kann mit seinem Hund spazieren gehen.","Він може гуляти зі своїм собакою.","Er ___ mit seinem Hund spazieren gehen.","kann","може"),
  modalClozeCard("Ihr könnt alle zusammen Rad fahren.","Ви всі разом можете кататися на велосипедах.","Ihr ___ alle zusammen Rad fahren.","könnt","можете"),
  modalClozeCard("Sie können gut Gitarre spielen.","Вони можуть добре грати на гітарі.","Sie (Pl.) ___ gut Gitarre spielen.","können","можуть"),
  modalClozeCard("Kannst du gut tanzen? Nein, ich kann nicht gut tanzen.","Ти вмієш добре танцювати? Ні, я не вмію добре танцювати.","___ du gut tanzen? Nein, ich ___ nicht gut tanzen.","kannst / kann","можеш / можу"),
  modalClozeCard("Sie kann sehr gut Schach spielen.","Вона може дуже добре грати в шахи.","Sie (Sg.) ___ sehr gut Schach spielen.","kann","може"),
  modalClozeCard("Wir können einen leckeren Kuchen backen.","Ми можемо спекти смачний пиріг.","Wir ___ einen leckeren Kuchen backen.","können","можемо"),
  modalClozeCard("Ich kann gerne interessante Bücher lesen.","Я можу охоче читати цікаві книжки.","Ich ___ gerne interessante Bücher lesen.","kann","можу"),
  modalClozeCard("Mein Bruder kann sehr gut Spanisch sprechen.","Мій брат може дуже добре говорити іспанською.","Mein Bruder ___ sehr gut Spanisch sprechen.","kann","може"),
  modalClozeCard("Meine Schwester kann stundenlang im Internet surfen.","Моя сестра може годинами сидіти в інтернеті.","Meine Schwester ___ stundenlang im Internet surfen.","kann","може"),
  modalClozeCard("Ihr könnt manchmal Musik hören.","Ви можете іноді слухати музику.","Ihr ___ manchmal Musik hören.","könnt","можете"),
  modalClozeCard("Am Wochenende kann ich immer im Internet surfen.","На вихідних я завжди можу сидіти в інтернеті.","Am Wochenende ___ ich immer im Internet surfen.","kann","можу"),
  modalClozeCard("Du kannst sehr gut fotografieren, oder?","Ти можеш дуже добре фотографувати, чи не так?","Du ___ sehr gut fotografieren, oder?","kannst","можеш"),
  modalClozeCard("Sie kann nicht so gut tanzen.","Вона не може так добре танцювати.","Sie (Sg.) ___ nicht so gut tanzen.","kann","може"),
  modalClozeCard("Er kann morgen in den Urlaub fahren.","Він може завтра поїхати у відпустку.","Er ___ morgen in den Urlaub fahren.","kann","може"),
  modalClozeCard("Kann er gut Schach spielen? Nein, er kann das leider nicht.","Чи може він добре грати в шахи? Ні, він, на жаль, не може.","___ er gut Schach spielen? Nein, er ___ das leider nicht.","kann / kann","може / може"),
  modalClozeCard("Ihr könnt aber super Gitarre spielen.","Але ви можете чудово грати на гітарі.","Ihr ___ aber super Gitarre spielen.","könnt","можете"),
  modalClozeCard("Ich kann meine Freunde nicht treffen, denn ich arbeite viel.","Я не можу зустрітися з друзями, бо багато працюю.","Ich ___ meine Freunde nicht treffen, denn ich arbeite viel.","kann","можу"),
  modalClozeCard("Die Oma kann gut backen.","Бабуся може добре пекти.","Die Oma ___ gut backen.","kann","може"),
  modalClozeCard("Kannst du Rad fahren? Ja, ich kann es sehr gut.","Ти вмієш їздити на велосипеді? Так, я вмію дуже добре.","___ du Rad fahren? Ja, ich ___ es sehr gut.","kannst / kann","можеш / можу"),
  modalClozeCard("Kann dein Kind schon lesen?","Твоя дитина вже вміє читати?","___ dein Kind schon lesen?","kann","може"),
  modalClozeCard("Meine Tante kann vier Fremdsprachen sprechen.","Моя тітка може говорити чотирма іноземними мовами.","Meine Tante ___ vier Fremdsprachen sprechen.","kann","може"),
  modalClozeCard("Ich kann noch nicht so gut Deutsch sprechen.","Я ще не можу так добре говорити німецькою.","Ich ___ noch nicht so gut Deutsch sprechen.","kann","можу"),
  modalOrderSentenceCard("Ich kann immer gut malen.","Я завжди можу добре малювати.","gut / malen / ich / können / immer.",[mainClause("Ich","kann","immer gut","malen")]),
  modalOrderSentenceCard("Du kannst im Sommer immer gerne schwimmen.","Ти завжди можеш охоче плавати влітку.","gerne / können / du / im Sommer / schwimmen / immer.",[mainClause("Du","kannst","im Sommer immer gerne","schwimmen")]),
  modalOrderSentenceCard("Ich kann selten spazieren gehen.","Я рідко можу гуляти.","ich / gehen / spazieren / selten / können.",[mainClause("Ich","kann","selten","spazieren gehen")]),
  modalOrderSentenceCard("Wir können im Winter oft Ski fahren.","Ми часто можемо кататися на лижах узимку.","wir / im Winter / fahren / Ski / oft / können.",[mainClause("Wir","können","im Winter oft Ski","fahren")]),
  modalOrderSentenceCard("Ihr könnt manchmal zusammen Rad fahren.","Ви можете іноді разом кататися на велосипедах.","zusammen / können / ihr / Rad fahren / manchmal.",[mainClause("Ihr","könnt","manchmal zusammen Rad","fahren")]),
  modalOrderSentenceCard("Sie können gut Gitarre spielen.","Вони можуть добре грати на гітарі.","Gitarre spielen / gut / können / sie (Pl.).",[mainClause("Sie","können","gut Gitarre","spielen")]),
  modalOrderSentenceCard("Meine Oma kann oft Kuchen backen.","Моя бабуся може часто пекти пироги.","backen / oft / meine Oma / Kuchen / können.",[mainClause("Meine Oma","kann","oft Kuchen","backen")]),
  modalOrderSentenceCard("Am Abend kann ich immer meine Freunde treffen.","Увечері я завжди можу зустрічатися з друзями.","am Abend / ich / treffen / immer / meine Freunde / können.",[mainClause("Am Abend","kann","ich immer meine Freunde","treffen")]),
  modalOrderSentenceCard("Meine Brüder können manchmal Romane lesen.","Мої брати можуть іноді читати романи.","lesen / meine Brüder / manchmal / können / Romane.",[mainClause("Meine Brüder","können","manchmal Romane","lesen")]),
  modalOrderSentenceCard("Mein Opa kann oft im Internet surfen.","Мій дідусь може часто сидіти в інтернеті.","surfen / mein Opa / können / oft / im Internet.",[mainClause("Mein Opa","kann","oft im Internet","surfen")]),
  modalOrderSentenceCard("Mein Mann kann nie gut fotografieren.","Мій чоловік ніколи не може добре фотографувати.","nie / mein Mann / können / gut / fotografieren.",[mainClause("Mein Mann","kann","nie gut","fotografieren")]),
  modalClozeCard("Kannst du mit uns spazieren gehen?","Чи можеш ти піти з нами гуляти?","Lisa: ___ du mit uns spazieren gehen?","kannst","можеш"),
  modalClozeCard("Ich kann leider nicht.","Я, на жаль, не можу.","Paul: Ich ___ leider nicht.","kann","можу"),
  modalClozeCard("Kannst du heute Abend mit uns Schach spielen?","Чи можеш ти сьогодні ввечері пограти з нами в шахи?","Lisa: ___ du heute Abend mit uns Schach spielen?","kannst","можеш"),
  modalClozeCard("Du kannst ja gut Schach spielen, oder?","Ти ж можеш добре грати в шахи, чи не так?","Lisa: Du ___ ja gut Schach spielen, oder?","kannst","можеш"),
  modalClozeCard("Ja, ich kann Schach spielen, aber nicht so gut.","Так, я можу грати в шахи, але не так добре.","Paul: Ja, ich ___ Schach spielen, aber nicht so gut.","kann","можу"),
  modalClozeCard("Kannst du Gitarre spielen?","Чи можеш ти грати на гітарі?","Lisa: ___ du Gitarre spielen?","kannst","можеш"),
  modalClozeCard("Nein, das kann ich gar nicht.","Ні, я зовсім не можу цього робити.","Paul: Nein, das ___ ich gar nicht.","kann","можу"),
  modalClozeCard("Kannst du Gitarre spielen?","Чи можеш ти грати на гітарі?","Paul: Aber Musik höre ich gern. ___ du Gitarre spielen?","kannst","можеш"),
  modalClozeCard("Ja, ich kann sehr gut Gitarre spielen.","Так, я можу дуже добре грати на гітарі.","Lisa: Ja, ich ___ sehr gut Gitarre spielen.","kann","можу"),
  modalClozeCard("Ich kann am Samstag eine Pause vom Lernen machen.","Я можу зробити перерву в навчанні в суботу.","Paul: Ich ___ am Samstag eine Pause vom Lernen machen.","kann","можу"),
  modalClozeCard("Dann können wir spazieren gehen.","Тоді ми можемо піти гуляти.","Paul: Dann ___ wir spazieren gehen.","können","можемо"),
  modalClozeCard("Das können wir machen!","Ми можемо це зробити!","Lisa: Das ___ wir machen!","können","можемо"),
  modalOrderSentenceCard("Mein Bruder kann super Gitarre spielen.","Мій брат чудово грає на гітарі.","Мій брат круто грає на гітарі.",[mainClause("Mein Bruder","kann","super Gitarre","spielen")]),
  modalOrderSentenceCard("Meine Schwester kann wunderbar singen.","Моя сестра може чудово співати.","Моя сестра може чудово співати.",[mainClause("Meine Schwester","kann","wunderbar","singen")]),
  modalOrderSentenceCard("Deine Oma kann einen Kuchen backen.","Твоя бабуся може спекти пиріг.","Твоя бабуся може спекти пиріг.",[mainClause("Deine Oma","kann","einen Kuchen","backen")]),
  modalOrderSentenceCard("Kannst du schwimmen?","Ти вмієш плавати?","Ти вмієш плавати?",[verbFirstClause("Kannst","du","schwimmen")]),
  modalOrderSentenceCard("Seine Tochter kann schön malen.","Його донька вміє гарно малювати.","Його донька вміє гарно малювати.",[mainClause("Seine Tochter","kann","schön","malen")]),
  modalOrderSentenceCard("Manchmal kann ich ein Buch lesen.","Іноді я можу читати книжку.","Іноді я можу читати книжку.",[mainClause("Manchmal","kann","ich ein Buch","lesen")]),
  modalOrderSentenceCard("Ich kann nicht so gut kochen.","Я не дуже добре вмію готувати.","Я не дуже добре готую.",[mainClause("Ich","kann","nicht so gut","kochen")]),
  modalOrderSentenceCard("Meine Oma kann manchmal im Internet surfen.","Моя бабуся іноді може сидіти в інтернеті.","Моя бабуся іноді сидить в інтернеті.",[mainClause("Meine Oma","kann","manchmal im Internet","surfen")]),
  modalOrderSentenceCard("Kannst du mir bitte helfen?","Ти можеш мені, будь ласка, допомогти?","Ти можеш будь ласка допомогти?",[verbFirstClause("Kannst","du mir bitte","helfen")]),
  modalOrderSentenceCard("Meine Mutter kann nicht so gut Schach spielen.","Моя мама не дуже добре може грати в шахи.","Моя мама не дуже може грати в шахи.",[mainClause("Meine Mutter","kann","nicht so gut Schach","spielen")]),
  modalSentenceCard("Ich kann manchmal am Abend ein Buch lesen.","Я можу іноді ввечері читати книжку.","Ich lese manchmal am Abend ein Buch.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Du kannst oft deine Freunde im Café treffen.","Ти можеш часто зустрічати друзів у кафе.","Du triffst oft deine Freunde im Café.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Wir können auch im Kurs Deutsch sprechen.","Ми також можемо говорити німецькою на курсі.","Wir sprechen auch Deutsch im Kurs.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Er kann selten mit dem Bus zur Arbeit fahren.","Він може рідко їздити автобусом на роботу.","Er fährt selten mit dem Bus zur Arbeit.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Ihr könnt viele interessante Bücher lesen.","Ви можете читати багато цікавих книжок.","Ihr lest viele interessante Bücher.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Sie kann manchmal ihre Kollegin nach der Arbeit treffen.","Вона може іноді зустрічати колегу після роботи.","Sie trifft manchmal ihre Kollegin nach der Arbeit.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Ich kann oft am Wochenende Rad fahren.","Я можу часто кататися на велосипеді на вихідних.","Ich fahre oft am Wochenende Rad.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Du kannst manchmal mit deinem Freund Deutsch sprechen.","Ти можеш іноді говорити німецькою зі своїм другом.","Du sprichst manchmal mit deinem Freund Deutsch.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Wir können selten deutsche Zeitungen lesen.","Ми можемо рідко читати німецькі газети.","Wir lesen selten deutsche Zeitungen.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Er kann oft seine Freunde im Park treffen.","Він може часто зустрічати друзів у парку.","Er trifft oft seine Freunde im Park.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Ihr könnt immer zusammen nach Berlin fahren.","Ви можете завжди разом їздити до Берліна.","Ihr fahrt immer zusammen nach Berlin.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Sie können manchmal Englisch im Büro sprechen.","Вони можуть іноді говорити англійською в офісі.","Sie sprechen manchmal Englisch im Büro.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Ich kann meine Familie am Sonntag treffen.","Я можу зустрітися зі своєю сім'єю в неділю.","Ich treffe meine Familie am Sonntag.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Du kannst manchmal lange Bücher lesen.","Ти можеш іноді читати довгі книжки.","Du liest manchmal lange Bücher.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Wir können nie mit dem Zug nach Hamburg fahren.","Ми ніколи не можемо їхати потягом до Гамбурга.","Wir fahren nie mit dem Zug nach Hamburg.","KÖNNEN · UMSCHREIBEN"),
  modalSentenceCard("Ich lese oft morgens Zeitung.","Я часто читаю газету вранці.","Ich kann oft morgens Zeitung lesen.","OHNE MODALVERB"),
  modalSentenceCard("Er spricht manchmal mit seiner Schwester Deutsch.","Він іноді розмовляє німецькою зі своєю сестрою.","Er kann manchmal mit der Schwester Deutsch sprechen.","OHNE MODALVERB"),
  modalSentenceCard("Wir fahren oft am Wochenende in die Stadt.","Ми часто їздимо до міста на вихідних.","Wir können oft am Wochenende in die Stadt fahren.","OHNE MODALVERB"),
  modalSentenceCard("Er liest selten lange Bücher.","Він рідко читає довгі книжки.","Er kann selten lange Bücher lesen.","OHNE MODALVERB"),
  modalSentenceCard("Ich treffe manchmal eure Freunde im Park.","Я іноді зустрічаю ваших друзів у парку.","Ich kann manchmal eure Freunde im Park treffen.","OHNE MODALVERB"),
  modalSentenceCard("Sie fährt oft mit dem Zug nach Berlin.","Вона часто їздить потягом до Берліна.","Sie kann oft mit dem Zug nach Berlin fahren.","OHNE MODALVERB"),
  modalSentenceCard("Du sprichst oft mit deinen Kollegen Englisch.","Ти часто розмовляєш англійською зі своїми колегами.","Du kannst oft mit deinen Kollegen Englisch sprechen.","OHNE MODALVERB"),
  modalSentenceCard("Wir fahren manchmal zusammen ins Kino.","Ми іноді разом їздимо в кіно.","Wir können manchmal zusammen ins Kino fahren.","OHNE MODALVERB"),
  modalSentenceCard("Er trifft oft neue Leute im Café.","Він часто знайомиться з новими людьми в кафе.","Er kann oft neue Leute im Café treffen.","OHNE MODALVERB"),
  modalSentenceCard("Ihr lest selten deutsche Texte.","Ви рідко читаєте німецькі тексти.","Ihr könnt selten deutsche Texte lesen.","OHNE MODALVERB"),
  modalSentenceCard("Sie fahren manchmal mit dem Taxi.","Вони іноді їздять на таксі.","Sie können manchmal mit dem Taxi fahren.","OHNE MODALVERB"),
  modalSentenceCard("Ich treffe oft meine Freunde am Wochenende.","Я часто зустрічаюся з друзями на вихідних.","Ich kann oft meine Freunde am Wochenende treffen.","OHNE MODALVERB"),
  modalSentenceCard("Wir sprechen oft am Abend lange zusammen.","Ми часто довго розмовляємо разом увечері.","Wir können oft am Abend zusammen lange sprechen.","OHNE MODALVERB")
];
const habenParadigm=verbParadigm("haben","hab|e ha|st ha|t hab|en hab|t hab|en","du, er/sie/es без b");
const habenFormCards=withVerbParadigms([
  {word:"ich habe",translation:"я маю / у мене є",category:"VERB · HABEN",example:"Ich habe heute Zeit.",exampleTranslation:"Я сьогодні маю час."},
  {word:"du hast",translation:"ти маєш / у тебе є",category:"VERB · HABEN",example:"Du hast einen Bruder.",exampleTranslation:"У тебе є брат."},
  {word:"er / sie / es hat",translation:"він / вона / воно має",category:"VERB · HABEN",example:"Sie hat eine neue Tasche.",exampleTranslation:"У неї є нова сумка."},
  {word:"wir haben",translation:"ми маємо / у нас є",category:"VERB · HABEN",example:"Wir haben ein großes Haus.",exampleTranslation:"У нас є великий будинок."},
  {word:"ihr habt",translation:"ви маєте / у вас є",category:"VERB · HABEN",example:"Ihr habt viele Fragen.",exampleTranslation:"У вас багато запитань."},
  {word:"sie / Sie haben",translation:"вони мають / Ви маєте",category:"VERB · HABEN",example:"Sie haben heute Unterricht.",exampleTranslation:"У них / Вас сьогодні урок."}
],[habenParadigm]);
const habenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"HABEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова haben.",answer,answerTranslation,practiceType:"cloze"});
const habenPracticeCards=withVerbParadigms([
  habenClozeCard("Ich habe einen Hund.","У мене є собака.","Ich ___ einen Hund. (haben)","habe","маю"),
  habenClozeCard("Du hast heute Zeit.","Ти маєш час сьогодні.","Du ___ heute Zeit. (haben)","hast","маєш"),
  habenClozeCard("Meine Schwester hat eine neue Tasche.","У моєї сестри є нова сумка.","Meine Schwester ___ eine neue Tasche. (haben)","hat","має"),
  habenClozeCard("Wir haben morgen eine Prüfung.","У нас завтра іспит.","Wir ___ morgen eine Prüfung. (haben)","haben","маємо"),
  habenClozeCard("Ihr habt viele Fragen.","У вас багато запитань.","Ihr ___ viele Fragen. (haben)","habt","маєте"),
  habenClozeCard("Sie haben ein großes Haus.","У них є великий будинок.","Sie ___ ein großes Haus. (haben)","haben","мають")
],[habenParadigm]);
const bekommenParadigm=verbParadigm("bekommen","bekomm|e bekomm|st bekomm|t bekomm|en bekomm|t bekomm|en");
const bekommenFormCards=withVerbParadigms([
  {word:"ich bekomme",translation:"я отримую",category:"VERB · BEKOMMEN",example:"Ich bekomme eine E-Mail.",exampleTranslation:"Я отримую електронний лист."},
  {word:"du bekommst",translation:"ти отримуєш",category:"VERB · BEKOMMEN",example:"Du bekommst heute Besuch.",exampleTranslation:"Ти сьогодні приймаєш гостей."},
  {word:"er / sie / es bekommt",translation:"він / вона / воно отримує",category:"VERB · BEKOMMEN",example:"Sie bekommt ein Geschenk.",exampleTranslation:"Вона отримує подарунок."},
  {word:"wir bekommen",translation:"ми отримуємо",category:"VERB · BEKOMMEN",example:"Wir bekommen morgen Geld.",exampleTranslation:"Ми отримаємо гроші завтра."},
  {word:"ihr bekommt",translation:"ви отримуєте",category:"VERB · BEKOMMEN",example:"Ihr bekommt die Tickets.",exampleTranslation:"Ви отримуєте квитки."},
  {word:"sie / Sie bekommen",translation:"вони / Ви отримують / отримуєте",category:"VERB · BEKOMMEN",example:"Sie bekommen eine Antwort.",exampleTranslation:"Вони отримують відповідь."}
],[bekommenParadigm]);
const bekommenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"BEKOMMEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова bekommen.",answer,answerTranslation,practiceType:"cloze"});
const bekommenPracticeCards=withVerbParadigms([
  bekommenClozeCard("Ich bekomme eine E-Mail.","Я отримую електронний лист.","Ich ___ eine E-Mail. (bekommen)","bekomme","отримую"),
  bekommenClozeCard("Du bekommst heute Besuch.","Ти сьогодні приймаєш гостей.","Du ___ heute Besuch. (bekommen)","bekommst","отримуєш"),
  bekommenClozeCard("Meine Schwester bekommt ein Geschenk.","Моя сестра отримує подарунок.","Meine Schwester ___ ein Geschenk. (bekommen)","bekommt","отримує"),
  bekommenClozeCard("Wir bekommen morgen Geld.","Ми отримаємо гроші завтра.","Wir ___ morgen Geld. (bekommen)","bekommen","отримуємо"),
  bekommenClozeCard("Ihr bekommt die Tickets.","Ви отримуєте квитки.","Ihr ___ die Tickets. (bekommen)","bekommt","отримуєте"),
  bekommenClozeCard("Sie bekommen eine Antwort.","Вони отримують відповідь.","Sie ___ eine Antwort. (bekommen)","bekommen","отримують")
],[bekommenParadigm]);
const brauchenParadigm=verbParadigm("brauchen","brauch|e brauch|st brauch|t brauch|en brauch|t brauch|en");
const brauchenFormCards=withVerbParadigms([
  {word:"ich brauche",translation:"я потребую",category:"VERB · BRAUCHEN",example:"Ich brauche Hilfe.",exampleTranslation:"Мені потрібна допомога."},
  {word:"du brauchst",translation:"ти потребуєш",category:"VERB · BRAUCHEN",example:"Du brauchst eine Pause.",exampleTranslation:"Тобі потрібна перерва."},
  {word:"er / sie / es braucht",translation:"він / вона / воно потребує",category:"VERB · BRAUCHEN",example:"Er braucht eine neue Brille.",exampleTranslation:"Йому потрібні нові окуляри."},
  {word:"wir brauchen",translation:"ми потребуємо",category:"VERB · BRAUCHEN",example:"Wir brauchen mehr Zeit.",exampleTranslation:"Нам потрібно більше часу."},
  {word:"ihr braucht",translation:"ви потребуєте",category:"VERB · BRAUCHEN",example:"Ihr braucht eure Bücher.",exampleTranslation:"Вам потрібні ваші книжки."},
  {word:"sie / Sie brauchen",translation:"вони / Ви потребують / потребуєте",category:"VERB · BRAUCHEN",example:"Sie brauchen einen Termin.",exampleTranslation:"Їм потрібна зустріч."}
],[brauchenParadigm]);
const brauchenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"BRAUCHEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова brauchen.",answer,answerTranslation,practiceType:"cloze"});
const brauchenPracticeCards=withVerbParadigms([
  brauchenClozeCard("Ich brauche Hilfe.","Мені потрібна допомога.","Ich ___ Hilfe. (brauchen)","brauche","потребую"),
  brauchenClozeCard("Du brauchst eine Pause.","Тобі потрібна перерва.","Du ___ eine Pause. (brauchen)","brauchst","потребуєш"),
  brauchenClozeCard("Er braucht eine neue Brille.","Йому потрібні нові окуляри.","Er ___ eine neue Brille. (brauchen)","braucht","потребує"),
  brauchenClozeCard("Wir brauchen mehr Zeit.","Нам потрібно більше часу.","Wir ___ mehr Zeit. (brauchen)","brauchen","потребуємо"),
  brauchenClozeCard("Ihr braucht eure Bücher.","Вам потрібні ваші книжки.","Ihr ___ eure Bücher. (brauchen)","braucht","потребуєте"),
  brauchenClozeCard("Sie brauchen einen Termin.","Їм потрібна зустріч.","Sie ___ einen Termin. (brauchen)","brauchen","потребують")
],[brauchenParadigm]);
// Frequency adverbs on a 0–100 % scale from nie to immer; each card marks its own step.
const frequencyScale=[
  {word:"nie",percent:0},
  {word:"fast nie",percent:10},
  {word:"selten",percent:25},
  {word:"manchmal",percent:40},
  {word:"oft",percent:60},
  {word:"meistens",percent:75},
  {word:"fast immer",percent:90},
  {word:"immer",percent:100}
];
const frequencyMark=word=>({scale:frequencyScale,active:frequencyScale.findIndex(step=>step.word===word)});
const frequencyCards=[
  {word:"immer",translation:"завжди",category:"FREQUENCY ADVERB",example:"Ich trinke immer Kaffee.",exampleTranslation:"Я завжди п'ю каву."},
  {word:"fast immer",translation:"майже завжди",category:"FREQUENCY ADVERB",example:"Sie kommt fast immer pünktlich.",exampleTranslation:"Вона майже завжди приходить вчасно."},
  {word:"meistens",translation:"здебільшого / зазвичай",category:"FREQUENCY ADVERB",example:"Wir essen meistens zu Hause.",exampleTranslation:"Ми зазвичай їмо вдома."},
  {word:"oft",translation:"часто",category:"FREQUENCY ADVERB",example:"Er geht oft ins Kino.",exampleTranslation:"Він часто ходить у кіно."},
  {word:"manchmal",translation:"іноді",category:"FREQUENCY ADVERB",example:"Ich höre manchmal Musik.",exampleTranslation:"Я іноді слухаю музику."},
  {word:"selten",translation:"рідко",category:"FREQUENCY ADVERB",example:"Sie fährt selten mit dem Taxi.",exampleTranslation:"Вона рідко їздить таксі."},
  {word:"fast nie",translation:"майже ніколи",category:"FREQUENCY ADVERB",example:"Du kommst fast nie zu spät.",exampleTranslation:"Ти майже ніколи не запізнюєшся."},
  {word:"nie",translation:"ніколи",category:"FREQUENCY ADVERB",example:"Wir essen nie Fleisch.",exampleTranslation:"Ми ніколи не їмо м'яса."}
].map(card=>({...card,frequency:frequencyMark(card.word)}));
const frequencyPracticeCards=frequencyCards.map(card=>({...card}));
const timeExpressionCards=[
  {word:"um",translation:"о (годині)",category:"PRÄPOSITION · ZEIT",example:"Der Deutschkurs beginnt um acht Uhr.",exampleTranslation:"Курс німецької починається о восьмій годині."},
  {word:"am (= an dem)",translation:"у / в (день, дата)",category:"PRÄPOSITION · TAG & DATUM",example:"Am Dienstag habe ich frei.",exampleTranslation:"У вівторок я вільний / вільна."},
  {word:"am (= an dem)",translation:"у / в (частина дня, крім Nacht)",category:"PRÄPOSITION · TAGESZEIT",example:"Am Abend lese ich ein Buch.",exampleTranslation:"Увечері я читаю книжку."},
  {word:"im (= in dem)",translation:"у / в (місяць, пора року)",category:"PRÄPOSITION · MONAT & JAHRESZEIT",example:"Im Mai fahren wir nach Österreich.",exampleTranslation:"У травні ми їдемо до Австрії."},
  {word:"in",translation:"через (проміжок часу в майбутньому)",category:"PRÄPOSITION · ZEITRAUM",example:"In zwei Wochen beginnen die Ferien.",exampleTranslation:"Через два тижні починаються канікули."},
  {word:"nachts",translation:"уночі / ночами (загалом, регулярно)",category:"ZEITADVERB · NACHT",example:"Das Baby wacht nachts oft auf.",exampleTranslation:"Немовля часто прокидається вночі."},
  {word:"in der Nacht",translation:"уночі (конкретна ніч)",category:"PRÄPOSITION · NACHT",example:"In der Nacht hat es geschneit.",exampleTranslation:"Уночі випав сніг."},
  {word:"heute Nacht / letzte Nacht",translation:"цієї ночі / минулої ночі (без прийменника)",category:"ZEITAUSDRUCK · NACHT",example:"Letzte Nacht habe ich schlecht geschlafen.",exampleTranslation:"Минулої ночі я погано спав / спала."}
];
// The analog clock reads its hands from the digital time, e.g. "3:15".
const clockTime=digitalTime=>{
  const [hour,minute]=digitalTime.split(":").map(Number);
  return {hour,minute};
};
const spokenTimeCards=[
  {word:"fünf nach zehn",translation:"10:05",category:"UHRZEIT · GESPROCHEN",example:"Es ist fünf nach zehn.",exampleTranslation:"Зараз 10:05."},
  {word:"zehn vor sechs",translation:"5:50",category:"UHRZEIT · GESPROCHEN",example:"Es ist zehn vor sechs.",exampleTranslation:"Зараз 5:50."},
  {word:"Viertel nach drei",translation:"3:15",category:"UHRZEIT · GESPROCHEN",example:"Es ist Viertel nach drei.",exampleTranslation:"Зараз 3:15."},
  {word:"halb vier",translation:"3:30",category:"UHRZEIT · GESPROCHEN",example:"Es ist halb vier.",exampleTranslation:"Зараз 3:30 — половина до четвертої."},
  {word:"Viertel vor sieben",translation:"6:45",category:"UHRZEIT · GESPROCHEN",example:"Es ist Viertel vor sieben.",exampleTranslation:"Зараз 6:45."}
].map(card=>({...card,clock:clockTime(card.translation)}));
const timeExpressionClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"ZEIT · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою часу.",answer,answerTranslation,practiceType:"cloze"});
const timeExpressionPracticeCards=[
  timeExpressionClozeCard("Der Kurs beginnt um neun Uhr.","Курс починається о дев'ятій годині.","Der Kurs beginnt ___ neun Uhr.","um","о (годині)"),
  timeExpressionClozeCard("Am Freitag arbeite ich nicht.","У п'ятницю я не працюю.","___ Freitag arbeite ich nicht.","am","у / в (день)"),
  timeExpressionClozeCard("Am Morgen trinke ich Kaffee.","Уранці я п'ю каву.","___ Morgen trinke ich Kaffee.","am","у / в (частина дня)"),
  timeExpressionClozeCard("Wir haben im September Ferien.","У вересні в нас канікули.","Wir haben ___ September Ferien.","im","у / в (місяць)"),
  timeExpressionClozeCard("Im Sommer schwimmen wir oft.","Улітку ми часто плаваємо.","___ Sommer schwimmen wir oft.","im","у / в (пора року)"),
  timeExpressionClozeCard("In zwei Stunden kommt der Bus.","Автобус приїде через дві години.","___ zwei Stunden kommt der Bus.","in","через (проміжок часу)"),
  timeExpressionClozeCard("Ich wache nachts oft auf.","Я часто прокидаюся вночі.","Ich wache ___ oft auf.","nachts","уночі / ночами (регулярно)"),
  timeExpressionClozeCard("In der Nacht hat es geschneit.","Уночі випав сніг.","___ Nacht hat es geschneit.","in der","уночі (конкретна ніч)"),
  timeExpressionClozeCard("Letzte Nacht habe ich schlecht geschlafen.","Минулої ночі я погано спав / спала.","___ Nacht habe ich schlecht geschlafen.","letzte","минулої (без прийменника)")
];
const spokenTimePracticeCard=(spokenTime,digitalTime)=>({word:spokenTime,translation:digitalTime,category:"UHRZEIT · GESPROCHEN",prompt:`Es ist ${digitalTime} Uhr.`,exampleTranslation:"Напиши час розмовною німецькою.",answer:spokenTime,answerTranslation:digitalTime,practiceType:"cloze",clock:clockTime(digitalTime)});
const spokenTimePracticeCards=[
  spokenTimePracticeCard("fünf nach zehn","10:05"),
  spokenTimePracticeCard("zehn vor sechs","5:50"),
  spokenTimePracticeCard("Viertel nach drei","3:15"),
  spokenTimePracticeCard("halb vier","3:30"),
  spokenTimePracticeCard("Viertel vor sieben","6:45")
];
const timeWorksheetVocabularyCards=[
  {word:"der Baum / die Bäume",translation:"дерево / дерева",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Herbst fallen die Blätter von den Bäumen.",exampleTranslation:"Восени листя опадає з дерев."},
  {word:"das Blatt / die Blätter",translation:"листок / листя",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Herbst fallen die Blätter von den Bäumen.",exampleTranslation:"Восени листя опадає з дерев."},
  {word:"fallen",translation:"падати / опадати",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Herbst fallen die Blätter von den Bäumen.",exampleTranslation:"Восени листя опадає з дерев."},
  {word:"die Kirche",translation:"церква",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Am Sonntag gehen wir in die Kirche.",exampleTranslation:"У неділю ми йдемо до церкви."},
  {word:"das Restaurant",translation:"ресторан",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Wir treffen uns vor dem Restaurant.",exampleTranslation:"Ми зустрічаємося перед рестораном."},
  {word:"der Weihnachtsmann",translation:"Санта-Клаус",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Der Weihnachtsmann kommt zu den Kindern.",exampleTranslation:"Санта-Клаус приходить до дітей."},
  {word:"die Sekunde",translation:"секунда",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Eine Minute hat sechzig Sekunden.",exampleTranslation:"Одна хвилина має шістдесят секунд."},
  {word:"die Minute",translation:"хвилина",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Eine Minute hat sechzig Sekunden.",exampleTranslation:"Одна хвилина має шістдесят секунд."},
  {word:"blühen",translation:"цвісти",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Frühling blühen die Blumen.",exampleTranslation:"Навесні квітнуть квіти."},
  {word:"der Pilz / die Pilze",translation:"гриб / гриби",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Herbst sammeln wir viele Pilze.",exampleTranslation:"Восени ми збираємо багато грибів."},
  {word:"das Fitnessstudio",translation:"фітнес-центр / спортзал",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Am Abend gehe ich ins Fitnessstudio.",exampleTranslation:"Увечері я йду до фітнес-центру."},
  {word:"die Wärme",translation:"тепло",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Winter fliegen die Vögel in die Wärme.",exampleTranslation:"Узимку птахи відлітають у теплі краї."},
  {word:"der Vogel / die Vögel",translation:"птах / птахи",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Winter fliegen die Vögel in die Wärme.",exampleTranslation:"Узимку птахи відлітають у теплі краї."},
  {word:"verbringen",translation:"проводити (час)",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Sommer verbringen wir zusammen Urlaub.",exampleTranslation:"Улітку ми разом проводимо відпустку."},
  {word:"genießen",translation:"насолоджуватися",category:"ZEIT-ARBEITSBLATT · WORTSCHATZ",example:"Im Frühling genieße ich jeden Morgen Kaffee.",exampleTranslation:"Навесні я щоранку насолоджуюся кавою."}
];
const wordOrderSentenceCard=(word,translation,prompt,structure,category="WORTFOLGE · SATZBILDUNG")=>({word,translation,category,prompt,example:prompt,exampleTranslation:"Розстав слова в правильному порядку та напиши повне німецьке речення.",answer:word,answerTranslation:translation,practiceType:"sentence",structure});
const wordOrderStatementCards=[
  {word:"Der Mann ist da.",translation:"Чоловік тут.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + weitere Informationen",exampleTranslation:"У прямому розповідному реченні підмет стоїть першим, а відмінюване дієслово - другим.",structure:[mainClause("Der Mann","ist","da")]},
  {word:"Das Arbeitszimmer ist groß.",translation:"Кабінет великий.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + Ergänzung",exampleTranslation:"Навіть із прикметником відмінюване дієслово залишається на другому місці.",structure:[mainClause("Das Arbeitszimmer","ist","groß")]},
  {word:"Ich fahre heute mit dem Bus nach Hause.",translation:"Я сьогодні їду автобусом додому.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + Temporal + Modal + Lokal",exampleTranslation:"Після дієслова інформація часто йде в порядку час - спосіб - місце.",structure:[mainClause("Ich","fahre","heute mit dem Bus nach Hause")]}
];
const wordOrderTeKaMoLoCards=[
  {word:"Ich fahre heute wegen des Regens mit dem Bus zur Arbeit.",translation:"Я сьогодні їду автобусом на роботу через дощ.",category:"WORTFOLGE · TE-KA-MO-LO",example:"Subjekt + Verb + Temporal + Kausal + Modal + Lokal",exampleTranslation:"У середині речення обставини зазвичай стоять у порядку TE-KA-MO-LO: час - причина - спосіб - місце.",structure:[mainClause("Ich","fahre","heute wegen des Regens mit dem Bus zur Arbeit")]},
  {word:"Wir lernen heute wegen der Prüfung zusammen in der Bibliothek.",translation:"Ми сьогодні вчимося разом у бібліотеці через іспит.",category:"WORTFOLGE · TE-KA-MO-LO",example:"Subjekt + Verb + Temporal + Kausal + Modal + Lokal",exampleTranslation:"TE = wann?, KA = warum?, MO = wie?, LO = wo?/wohin?.",structure:[mainClause("Wir","lernen","heute wegen der Prüfung zusammen in der Bibliothek")]}
];
const wordOrderInversionCards=[
  {word:"Heute fahre ich mit dem Bus nach Hause.",translation:"Сьогодні я їду автобусом додому.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Modal + Lokal",exampleTranslation:"Якщо час стоїть першим, дієслово все одно посідає другу позицію, а підмет іде після нього.",structure:[mainClause("Heute","fahre","ich mit dem Bus nach Hause")]},
  {word:"Am Abend ist mein Bruder frei.",translation:"Увечері мій брат вільний.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Ergänzung",exampleTranslation:"Початкове слово або фраза змінює місце підмета, але не місце дієслова.",structure:[mainClause("Am Abend","ist","mein Bruder frei")]},
  {word:"Jetzt haben wir ein neues Auto.",translation:"Тепер у нас є нова машина.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Objekt",exampleTranslation:"У стверджувальному реченні відмінюване дієслово завжди на другому місці.",structure:[mainClause("Jetzt","haben","wir ein neues Auto")]}
];
const wordOrderQuestionCards=[
  {word:"Fährst du heute mit dem Bus nach Hause?",translation:"Ти сьогодні їдеш автобусом додому?",category:"WORTFOLGE · JA/NEIN-FRAGE",example:"Verb + Subjekt + weitere Informationen",exampleTranslation:"У питанні без питального слова відмінюване дієслово стоїть на першому місці.",structure:[verbFirstClause("Fährst","du heute mit dem Bus nach Hause")]},
  {word:"Warum fährst du heute mit dem Bus nach Hause?",translation:"Чому ти сьогодні їдеш автобусом додому?",category:"WORTFOLGE · W-FRAGE",example:"Fragewort + Verb + Subjekt + weitere Informationen",exampleTranslation:"У W-Frage питальне слово стоїть першим, а відмінюване дієслово - другим.",structure:[mainClause("Warum","fährst","du heute mit dem Bus nach Hause")]},
  {word:"Wo ist dein Handy?",translation:"Де твій телефон?",category:"WORTFOLGE · W-FRAGE",example:"Fragewort + Verb + Subjekt",exampleTranslation:"Після питального слова одразу ставте відмінюване дієслово.",structure:[mainClause("Wo","ist","dein Handy")]}
];
const wordOrderModalCards=[
  {word:"Ich mag am Morgen Kaffee trinken.",translation:"Я люблю вранці пити каву.",category:"WORTFOLGE · MODALVERB",example:"Subjekt (P1) + Modalverb (P2) + Temporal + Objekt + Verb am Ende",exampleTranslation:"У розповідному реченні підмет стоїть першим, відмінюване модальне дієслово - другим, а інфінітив - у кінці.",structure:[mainClause("Ich","mag","am Morgen Kaffee","trinken")]},
  {word:"Am Morgen mag ich Kaffee trinken.",translation:"Вранці я люблю пити каву.",category:"WORTFOLGE · MODALVERB",example:"Temporal + Modalverb (P2) + Subjekt (P3) + Objekt + Verb am Ende",exampleTranslation:"Якщо обставина часу стоїть першою, модальне дієслово все одно залишається на другому місці.",structure:[mainClause("Am Morgen","mag","ich Kaffee","trinken")]},
  {word:"Magst du am Morgen Kaffee trinken?",translation:"Ти любиш вранці пити каву?",category:"WORTFOLGE · MODALVERB · JA/NEIN",example:"Modalverb (P1) + Subjekt (P2) + Temporal + Objekt + Verb am Ende",exampleTranslation:"У питанні без питального слова модальне дієслово відкриває речення, а інфінітив залишається в кінці.",structure:[verbFirstClause("Magst","du am Morgen Kaffee","trinken")]},
  {word:"Was magst du am Morgen trinken?",translation:"Що ти любиш пити вранці?",category:"WORTFOLGE · MODALVERB · W-FRAGE",example:"Fragewort + Modalverb (P2) + Subjekt (P3) + Temporal + Verb am Ende",exampleTranslation:"У W-Frage питальне слово стоїть першим, модальне дієслово - другим, а інфінітив - у кінці.",structure:[mainClause("Was","magst","du am Morgen","trinken")]}
];
const wordOrderStatementPracticeCards=[
  wordOrderSentenceCard("Der Mann ist da.","Чоловік тут.","da / der Mann / sein.",[mainClause("Der Mann","ist","da")]),
  wordOrderSentenceCard("Das Arbeitszimmer ist groß.","Кабінет великий.","sein / groß / das Arbeitszimmer.",[mainClause("Das Arbeitszimmer","ist","groß")]),
  wordOrderSentenceCard("Ich fahre heute mit dem Bus nach Hause.","Я сьогодні їду автобусом додому.","heute / ich / mit dem Bus / nach Hause / fahren.",[mainClause("Ich","fahre","heute mit dem Bus nach Hause")]),
  wordOrderSentenceCard("Meine Schwester ist schon Studentin.","Моя сестра вже студентка.","schon / meine Schwester / Studentin / sein.",[mainClause("Meine Schwester","ist","schon Studentin")])
];
const wordOrderTeKaMoLoPracticeCards=[
  wordOrderSentenceCard("Ich fahre heute wegen des Regens mit dem Bus zur Arbeit.","Я сьогодні їду автобусом на роботу через дощ.","heute / zur Arbeit / ich / wegen des Regens / mit dem Bus / fahren.",[mainClause("Ich","fahre","heute wegen des Regens mit dem Bus zur Arbeit")],"WORTFOLGE · TE-KA-MO-LO"),
  wordOrderSentenceCard("Wir lernen heute wegen der Prüfung zusammen in der Bibliothek.","Ми сьогодні вчимося разом у бібліотеці через іспит.","in der Bibliothek / zusammen / heute / wir / wegen der Prüfung / lernen.",[mainClause("Wir","lernen","heute wegen der Prüfung zusammen in der Bibliothek")],"WORTFOLGE · TE-KA-MO-LO")
];
const wordOrderInversionPracticeCards=[
  wordOrderSentenceCard("Heute fahre ich mit dem Bus nach Hause.","Сьогодні я їду автобусом додому.","ich / heute / mit dem Bus / nach Hause / fahren.",[mainClause("Heute","fahre","ich mit dem Bus nach Hause")]),
  wordOrderSentenceCard("Am Abend ist mein Bruder frei.","Увечері мій брат вільний.","frei / mein Bruder / sein / am Abend.",[mainClause("Am Abend","ist","mein Bruder frei")]),
  wordOrderSentenceCard("Morgen ist die Mutter zu Hause.","Завтра мама вдома.","die Mutter / morgen / zu Hause / sein.",[mainClause("Morgen","ist","die Mutter zu Hause")]),
  wordOrderSentenceCard("Jetzt haben wir ein neues Auto.","Тепер у нас є нова машина.","ein neues Auto / jetzt / wir / haben.",[mainClause("Jetzt","haben","wir ein neues Auto")])
];
const wordOrderQuestionPracticeCards=[
  wordOrderSentenceCard("Fährst du heute mit dem Bus nach Hause?","Ти сьогодні їдеш автобусом додому?","du / heute / mit dem Bus / nach Hause / fahren?",[verbFirstClause("Fährst","du heute mit dem Bus nach Hause")],"WORTFOLGE · FRAGEBILDUNG"),
  wordOrderSentenceCard("Ist der Mann da?","Чоловік тут?","da / der Mann / sein?",[verbFirstClause("Ist","der Mann da")],"WORTFOLGE · FRAGEBILDUNG"),
  wordOrderSentenceCard("Warum fährst du heute mit dem Bus nach Hause?","Чому ти сьогодні їдеш автобусом додому?","warum / du / heute / mit dem Bus / nach Hause / fahren?",[mainClause("Warum","fährst","du heute mit dem Bus nach Hause")],"WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wo ist dein Handy?","Де твій телефон?","dein Handy / wo / sein?",[mainClause("Wo","ist","dein Handy")],"WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wann ist er zu Hause?","Коли він удома?","er / zu Hause / wann / sein?",[mainClause("Wann","ist","er zu Hause")],"WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wie geht es dir?","Як у тебе справи?","es / dir / wie / gehen?",[mainClause("Wie","geht","es dir")],"WORTFOLGE · W-FRAGE")
];
const wordOrderModalPracticeCards=[
  wordOrderSentenceCard("Ich mag am Morgen Kaffee trinken.","Я люблю вранці пити каву.","am Morgen / ich / Kaffee / trinken / mag.",[mainClause("Ich","mag","am Morgen Kaffee","trinken")],"WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Am Morgen mag ich Kaffee trinken.","Вранці я люблю пити каву.","Kaffee / am Morgen / trinken / ich / mag.",[mainClause("Am Morgen","mag","ich Kaffee","trinken")],"WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Magst du am Morgen Kaffee trinken?","Ти любиш вранці пити каву?","am Morgen / trinken / du / Kaffee / magst?",[verbFirstClause("Magst","du am Morgen Kaffee","trinken")],"WORTFOLGE · MODALVERB · JA/NEIN"),
  wordOrderSentenceCard("Was magst du am Morgen trinken?","Що ти любиш пити вранці?","am Morgen / trinken / du / was / magst?",[mainClause("Was","magst","du am Morgen","trinken")],"WORTFOLGE · MODALVERB · W-FRAGE"),
  wordOrderSentenceCard("Ich möchte am Abend einen Tee trinken.","Я хотів би / хотіла б увечері випити чаю.","am Abend / einen Tee / ich / trinken / möchte.",[mainClause("Ich","möchte","am Abend einen Tee","trinken")],"WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Wann kannst du Deutsch lernen?","Коли ти можеш вивчати німецьку?","Deutsch / du / wann / lernen / kannst?",[mainClause("Wann","kannst","du Deutsch","lernen")],"WORTFOLGE · MODALVERB · W-FRAGE")
];
const separableVerbCards=[
  {word:"aufstehen",translation:"вставати",category:"TRENNBARES VERB · AUF",example:"Ich stehe um sieben Uhr auf.",exampleTranslation:"Я встаю о сьомій годині.",structure:[mainClause("Ich","stehe","um sieben Uhr","auf")]},
  {word:"anrufen",translation:"телефонувати",category:"TRENNBARES VERB · AN",example:"Ich rufe dich später an.",exampleTranslation:"Я подзвоню тобі пізніше.",structure:[mainClause("Ich","rufe","dich später","an")]},
  {word:"einkaufen",translation:"робити покупки",category:"TRENNBARES VERB · EIN",example:"Wir kaufen heute im Supermarkt ein.",exampleTranslation:"Ми сьогодні робимо покупки в супермаркеті.",structure:[mainClause("Wir","kaufen","heute im Supermarkt","ein")]},
  {word:"abfahren",translation:"відправлятися",category:"TRENNBARES VERB · AB",example:"Der Zug fährt um neun Uhr ab.",exampleTranslation:"Потяг відправляється о дев'ятій годині.",structure:[mainClause("Der Zug","fährt","um neun Uhr","ab")]},
  {word:"ankommen",translation:"прибувати",category:"TRENNBARES VERB · AN",example:"Der Bus kommt in fünf Minuten an.",exampleTranslation:"Автобус прибуде через п'ять хвилин.",structure:[mainClause("Der Bus","kommt","in fünf Minuten","an")]},
  {word:"abholen",translation:"забирати / зустрічати",category:"TRENNBARES VERB · AB",example:"Ich hole meine Freundin vom Bahnhof ab.",exampleTranslation:"Я зустрічаю подругу на вокзалі.",structure:[mainClause("Ich","hole","meine Freundin vom Bahnhof","ab")]},
  {word:"aussteigen",translation:"виходити (з транспорту)",category:"TRENNBARES VERB · AUS",example:"Wir steigen am Alexanderplatz aus.",exampleTranslation:"Ми виходимо на Александерплац.",structure:[mainClause("Wir","steigen","am Alexanderplatz","aus")]},
  {word:"umsteigen",translation:"пересідати",category:"TRENNBARES VERB · UM",example:"Sie steigen in München um.",exampleTranslation:"Вони пересаджуються в Мюнхені.",structure:[mainClause("Sie","steigen","in München","um")]},
  {word:"mitbringen",translation:"приносити із собою",category:"TRENNBARES VERB · MIT",example:"Ich bringe meine Tasche mit.",exampleTranslation:"Я беру із собою сумку.",structure:[mainClause("Ich","bringe","meine Tasche","mit")]},
  {word:"fernsehen",translation:"дивитися телевізор",category:"TRENNBARES VERB · FERN",example:"Er sieht am Abend fern.",exampleTranslation:"Він дивиться телевізор увечері.",structure:[mainClause("Er","sieht","am Abend","fern")]}
];
const everydayVocabularyRoutineCards=[
  {word:"zuerst",translation:"спочатку",category:"ALLTAG · ABLAUF",example:"Zuerst lese ich den Text.",exampleTranslation:"Спочатку я читаю текст."},
  {word:"danach",translation:"після цього",category:"ALLTAG · ABLAUF",example:"Danach mache ich die Aufgabe.",exampleTranslation:"Після цього я роблю завдання."},
  {word:"anfangen",translation:"починати",category:"ALLTAG · VERB",example:"Der Kurs fängt um neun Uhr an.",exampleTranslation:"Курс починається о дев'ятій годині.",explanation:"Anfangen — відокремлюване дієслово: fängt стоїть на другому місці, а an — у кінці головного речення."},
  {word:"besprechen",translation:"обговорювати",category:"ALLTAG · VERB",example:"Wir besprechen die Aufgabe zusammen.",exampleTranslation:"Ми обговорюємо завдання разом."},
  {word:"bearbeiten",translation:"опрацьовувати",category:"ALLTAG · VERB",example:"Ich bearbeite heute den Text.",exampleTranslation:"Я сьогодні опрацьовую текст."}
];
const everydayVocabularyFoodCards=[
  {word:"der Kräutertee",translation:"трав'яний чай",category:"ALLTAG · ESSEN & TRINKEN",example:"Am Abend trinke ich Kräutertee.",exampleTranslation:"Увечері я п'ю трав'яний чай."},
  {word:"die Süßigkeiten",translation:"солодощі",category:"ALLTAG · ESSEN & TRINKEN",example:"Die Süßigkeiten sind für die Kinder.",exampleTranslation:"Солодощі для дітей."},
  {word:"der Kaugummi",translation:"жувальна гумка",category:"ALLTAG · ESSEN & TRINKEN",example:"Ich kaufe einen Kaugummi.",exampleTranslation:"Я купую жувальну гумку."},
  {word:"der Brei",translation:"каша",category:"ALLTAG · ESSEN & TRINKEN",example:"Das Baby isst Brei.",exampleTranslation:"Дитина їсть кашу."}
];
const travelTransportCards=[
  {word:"der Bahnhof",translation:"вокзал",category:"TRAVEL · PLACE",example:"Der Bahnhof ist im Zentrum.",exampleTranslation:"Вокзал у центрі."},
  {word:"der Flughafen",translation:"аеропорт",category:"TRAVEL · PLACE",example:"Der Flughafen ist weit von hier.",exampleTranslation:"Аеропорт далеко звідси."},
  {word:"die S-Bahn",translation:"міська електричка",category:"TRAVEL · TRANSPORT",example:"Ich fahre mit der S-Bahn.",exampleTranslation:"Я їду міською електричкою."},
  {word:"das Taxi",translation:"таксі",category:"TRAVEL · TRANSPORT",example:"Wir nehmen ein Taxi.",exampleTranslation:"Ми беремо таксі."},
  {word:"der Bus",translation:"автобус",category:"TRAVEL · TRANSPORT",example:"Der Bus kommt gleich.",exampleTranslation:"Автобус зараз прибуде."},
  {word:"der Zug",translation:"потяг",category:"TRAVEL · TRANSPORT",example:"Der Zug fährt um neun Uhr ab.",exampleTranslation:"Потяг відправляється о дев'ятій годині."},
  {word:"die Straßenbahn",translation:"трамвай",category:"TRAVEL · TRANSPORT",example:"Die Straßenbahn hält hier.",exampleTranslation:"Трамвай зупиняється тут."},
  {word:"die U-Bahn",translation:"метро",category:"TRAVEL · TRANSPORT",example:"Die U-Bahn fährt alle fünf Minuten.",exampleTranslation:"Метро ходить кожні п'ять хвилин."},
  {word:"das Flugzeug",translation:"літак",category:"TRAVEL · TRANSPORT",example:"Das Flugzeug landet um acht Uhr.",exampleTranslation:"Літак приземляється о восьмій."},
  {word:"das Gleis",translation:"колія",category:"TRAVEL · STATION",example:"Der Zug fährt von Gleis drei ab.",exampleTranslation:"Потяг відправляється з третьої колії."},
  {word:"der Bahnsteig",translation:"перон",category:"TRAVEL · STATION",example:"Der Bahnsteig ist dort.",exampleTranslation:"Перон там."},
  {word:"der Koffer",translation:"валіза",category:"TRAVEL · LUGGAGE",example:"Mein Koffer ist schwer.",exampleTranslation:"Моя валіза важка."},
  {word:"die Tasche",translation:"сумка",category:"TRAVEL · LUGGAGE",example:"Die Tasche steht neben dem Koffer.",exampleTranslation:"Сумка стоїть поруч із валізою."},
  {word:"das Gepäck",translation:"багаж",category:"TRAVEL · LUGGAGE",example:"Wo ist mein Gepäck?",exampleTranslation:"Де мій багаж?"},
  {word:"die Haltestelle",translation:"зупинка",category:"TRAVEL · STATION",example:"Die Haltestelle ist an der Ecke.",exampleTranslation:"Зупинка на розі."}
];
const travelPhraseCards=[
  {word:"der nächste Bahnhof",translation:"найближчий вокзал",category:"TRAVEL · PHRASE",example:"Wo ist der nächste Bahnhof?",exampleTranslation:"Де найближчий вокзал?"},
  {word:"mit dem Zug fahren",translation:"їхати потягом",category:"TRAVEL · PHRASE",example:"Wir fahren mit dem Zug nach Paris.",exampleTranslation:"Ми їдемо потягом до Парижа."},
  {word:"mit dem Flugzeug fliegen",translation:"летіти літаком",category:"TRAVEL · PHRASE",example:"Sie fliegt mit dem Flugzeug nach Berlin.",exampleTranslation:"Вона летить літаком до Берліна."},
  {word:"nach Paris",translation:"до Парижа",category:"TRAVEL · DIRECTION",example:"Ich fahre nach Paris.",exampleTranslation:"Я їду до Парижа."},
  {word:"zu meiner Freundin",translation:"до моєї подруги",category:"TRAVEL · DIRECTION",example:"Ich gehe zu meiner Freundin.",exampleTranslation:"Я йду до моєї подруги."},
  {word:"die Fahrt",translation:"поїздка",category:"TRAVEL · PHRASE",example:"Die Fahrt dauert zwei Stunden.",exampleTranslation:"Поїздка триває дві години."},
  {word:"ca.",translation:"приблизно",category:"TRAVEL · PHRASE",example:"Die Fahrt dauert ca. eine Stunde.",exampleTranslation:"Поїздка триває приблизно годину."},
  {word:"Es gibt ...",translation:"є ...",category:"TRAVEL · PHRASE",example:"Es gibt hier einen Bahnhof.",exampleTranslation:"Тут є вокзал."},
  {word:"dort",translation:"там",category:"TRAVEL · PLACE",example:"Die Haltestelle ist dort.",exampleTranslation:"Зупинка там."},
  {word:"Wie heißt ...?",translation:"Як називається ...?",category:"TRAVEL · QUESTION",example:"Wie heißt die nächste Haltestelle?",exampleTranslation:"Як називається наступна зупинка?"},
  {word:"an der Haltestelle",translation:"на зупинці",category:"TRAVEL · PLACE",example:"Wir warten an der Haltestelle.",exampleTranslation:"Ми чекаємо на зупинці."},
  {word:"neben",translation:"поруч із",category:"TRAVEL · PLACE",example:"Das Taxi steht neben dem Bahnhof.",exampleTranslation:"Таксі стоїть поруч із вокзалом."}
];
const travelActionCards=[
  {word:"umsteigen",translation:"робити пересадку",category:"TRAVEL · ACTION",example:"Ich steige am Hauptbahnhof um.",exampleTranslation:"Я роблю пересадку на головному вокзалі."},
  {word:"einsteigen",translation:"заходити в транспорт",category:"TRAVEL · ACTION",example:"Wir steigen in den Bus ein.",exampleTranslation:"Ми заходимо в автобус."},
  {word:"aussteigen",translation:"виходити з транспорту",category:"TRAVEL · ACTION",example:"Steigen Sie bitte hier aus.",exampleTranslation:"Будь ласка, вийдіть тут."},
  {word:"abfahren",translation:"відправлятися",category:"TRAVEL · ACTION",example:"Der Zug fährt gleich ab.",exampleTranslation:"Потяг скоро відправляється."},
  {word:"ankommen",translation:"прибувати",category:"TRAVEL · ACTION",example:"Der Bus kommt um zehn Uhr an.",exampleTranslation:"Автобус прибуває о десятій годині."},
  {word:"abholen",translation:"зустрічати",category:"TRAVEL · ACTION",example:"Ich hole dich vom Bahnhof ab.",exampleTranslation:"Я зустріну тебе на вокзалі."},
  {word:"mitbringen",translation:"приносити із собою",category:"TRAVEL · ACTION",example:"Bring bitte deinen Koffer mit.",exampleTranslation:"Будь ласка, візьми із собою валізу."},
  {word:"anrufen",translation:"телефонувати",category:"TRAVEL · ACTION",example:"Ruf mich an, wenn du ankommst.",exampleTranslation:"Подзвони мені, коли прибудеш."},
  {word:"einkaufen",translation:"робити покупки",category:"EVERYDAY · ACTION",example:"Wir kaufen am Bahnhof ein.",exampleTranslation:"Ми робимо покупки на вокзалі."},
  {word:"fernsehen",translation:"дивитися телевізор",category:"EVERYDAY · ACTION",example:"Am Abend sehe ich fern.",exampleTranslation:"Увечері я дивлюся телевізор."}
];
const directionInstructionCards=[
  {
    id:"directions-zuerst-1",targetId:"directions-zuerst",type:"recall",word:"zuerst",translation:"спочатку",category:"DIRECTIONS · ORDER",
    example:"Zuerst gehen Sie bis zur Kreuzung.",exampleTranslation:"Спочатку йдіть до перехрестя.",
    response:{mode:"text",scope:"word",accepted:["zuerst"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-zuerst-2",targetId:"directions-zuerst",type:"recall",word:"zuerst",translation:"спочатку",category:"DIRECTIONS · ORDER",
    example:"Zuerst fährst du geradeaus.",exampleTranslation:"Спочатку їдь прямо.",
    response:{mode:"text",scope:"word",accepted:["zuerst"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-zuerst-3",targetId:"directions-zuerst",type:"recall",word:"zuerst",translation:"спочатку",category:"DIRECTIONS · ORDER",
    example:"Zuerst gehen wir zum Bahnhof.",exampleTranslation:"Спочатку ми йдемо до вокзалу.",
    response:{mode:"text",scope:"word",accepted:["zuerst"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-geradeaus-1",targetId:"directions-geradeaus",type:"recall",word:"geradeaus",translation:"прямо",category:"DIRECTIONS · DIRECTION",
    example:"Gehen Sie hier geradeaus.",exampleTranslation:"Ідіть тут прямо.",
    response:{mode:"text",scope:"word",accepted:["geradeaus"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-geradeaus-2",targetId:"directions-geradeaus",type:"recall",word:"geradeaus",translation:"прямо",category:"DIRECTIONS · DIRECTION",
    example:"Der Bus fährt geradeaus.",exampleTranslation:"Автобус їде прямо.",
    response:{mode:"text",scope:"word",accepted:["geradeaus"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-geradeaus-3",targetId:"directions-geradeaus",type:"recall",word:"geradeaus",translation:"прямо",category:"DIRECTIONS · DIRECTION",
    example:"Fahren Sie an der Ampel geradeaus.",exampleTranslation:"Їдьте прямо на світлофорі.",
    response:{mode:"text",scope:"word",accepted:["geradeaus"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-rechts-1",targetId:"directions-nach-rechts",type:"recall",word:"nach rechts",translation:"праворуч",category:"DIRECTIONS · DIRECTION",
    example:"Biegen Sie an der Kreuzung nach rechts ab.",exampleTranslation:"Поверніть на перехресті праворуч.",
    response:{mode:"text",scope:"phrase",accepted:["nach rechts"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-rechts-2",targetId:"directions-nach-rechts",type:"recall",word:"nach rechts",translation:"праворуч",category:"DIRECTIONS · DIRECTION",
    example:"Der Weg führt nach rechts.",exampleTranslation:"Дорога веде праворуч.",
    response:{mode:"text",scope:"phrase",accepted:["nach rechts"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-rechts-3",targetId:"directions-nach-rechts",type:"recall",word:"nach rechts",translation:"праворуч",category:"DIRECTIONS · DIRECTION",
    example:"Gehen Sie an der nächsten Straße nach rechts.",exampleTranslation:"На наступній вулиці йдіть праворуч.",
    response:{mode:"text",scope:"phrase",accepted:["nach rechts"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-links-1",targetId:"directions-nach-links",type:"recall",word:"nach links",translation:"ліворуч",category:"DIRECTIONS · DIRECTION",
    example:"Biegen Sie an der Ampel nach links ab.",exampleTranslation:"Поверніть ліворуч на світлофорі.",
    response:{mode:"text",scope:"phrase",accepted:["nach links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-links-2",targetId:"directions-nach-links",type:"recall",word:"nach links",translation:"ліворуч",category:"DIRECTIONS · DIRECTION",
    example:"Gehen Sie nach links.",exampleTranslation:"Ідіть ліворуч.",
    response:{mode:"text",scope:"phrase",accepted:["nach links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-nach-links-3",targetId:"directions-nach-links",type:"recall",word:"nach links",translation:"ліворуч",category:"DIRECTIONS · DIRECTION",
    example:"Die nächste Straße führt nach links.",exampleTranslation:"Наступна вулиця веде ліворуч.",
    response:{mode:"text",scope:"phrase",accepted:["nach links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-abbiegen-1",targetId:"directions-abbiegen",type:"recall",word:"abbiegen",translation:"повертати",category:"DIRECTIONS · ACTION",
    example:"Sie müssen hier rechts abbiegen.",exampleTranslation:"Тут потрібно повернути праворуч.",
    response:{mode:"text",scope:"word",accepted:["abbiegen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-abbiegen-2",targetId:"directions-abbiegen",type:"recall",word:"abbiegen",translation:"повертати",category:"DIRECTIONS · ACTION",
    example:"Wir können an der nächsten Straße links abbiegen.",exampleTranslation:"Ми можемо повернути ліворуч на наступній вулиці.",
    response:{mode:"text",scope:"word",accepted:["abbiegen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-abbiegen-3",targetId:"directions-abbiegen",type:"recall",word:"abbiegen",translation:"повертати",category:"DIRECTIONS · ACTION",
    example:"An dieser Kreuzung dürfen Sie nicht abbiegen.",exampleTranslation:"На цьому перехресті не можна повертати.",
    response:{mode:"text",scope:"word",accepted:["abbiegen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-wenden-1",targetId:"directions-wenden",type:"recall",word:"wenden",translation:"розвертатися",category:"DIRECTIONS · ACTION",
    example:"Wenden Sie bitte an der Kreuzung.",exampleTranslation:"Будь ласка, розверніться на перехресті.",
    response:{mode:"text",scope:"word",accepted:["wenden"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-wenden-2",targetId:"directions-wenden",type:"recall",word:"wenden",translation:"розвертатися",category:"DIRECTIONS · ACTION",
    example:"Hier können Sie wenden.",exampleTranslation:"Тут ви можете розвернутися.",
    response:{mode:"text",scope:"word",accepted:["wenden"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-wenden-3",targetId:"directions-wenden",type:"recall",word:"wenden",translation:"розвертатися",category:"DIRECTIONS · ACTION",
    example:"Das Auto wendet auf der Straße.",exampleTranslation:"Автомобіль розвертається на дорозі.",
    response:{mode:"text",scope:"word",accepted:["wenden"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-zurueck-1",targetId:"directions-zurueck",type:"recall",word:"zurück",translation:"назад",category:"DIRECTIONS · DIRECTION",
    example:"Gehen Sie bitte ein Stück zurück.",exampleTranslation:"Пройдіть, будь ласка, трохи назад.",
    response:{mode:"text",scope:"word",accepted:["zurück"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-zurueck-2",targetId:"directions-zurueck",type:"recall",word:"zurück",translation:"назад",category:"DIRECTIONS · DIRECTION",
    example:"Fahren Sie bis zur Ampel und dann wieder zurück.",exampleTranslation:"Їдьте до світлофора, а потім назад.",
    response:{mode:"text",scope:"word",accepted:["zurück"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-zurueck-3",targetId:"directions-zurueck",type:"recall",word:"zurück",translation:"назад",category:"DIRECTIONS · DIRECTION",
    example:"Wir gehen zusammen zurück zum Bahnhof.",exampleTranslation:"Ми разом повертаємося назад до вокзалу.",
    response:{mode:"text",scope:"word",accepted:["zurück"],caseSensitive:false,punctuationSensitive:false}
  }
];
const directionLandmarkCards=[
  {
    id:"directions-kreuzung-1",targetId:"directions-an-der-kreuzung",type:"recall",word:"an der Kreuzung",translation:"на перехресті",category:"DIRECTIONS · LANDMARK",
    example:"Biegen Sie an der Kreuzung links ab.",exampleTranslation:"Поверніть ліворуч на перехресті.",
    response:{mode:"text",scope:"phrase",accepted:["an der Kreuzung"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-kreuzung-2",targetId:"directions-an-der-kreuzung",type:"recall",word:"an der Kreuzung",translation:"на перехресті",category:"DIRECTIONS · LANDMARK",
    example:"An der Kreuzung gehen Sie geradeaus.",exampleTranslation:"На перехресті йдіть прямо.",
    response:{mode:"text",scope:"phrase",accepted:["an der Kreuzung"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-kreuzung-3",targetId:"directions-an-der-kreuzung",type:"recall",word:"an der Kreuzung",translation:"на перехресті",category:"DIRECTIONS · LANDMARK",
    example:"Wir treffen uns an der Kreuzung.",exampleTranslation:"Ми зустрінемося на перехресті.",
    response:{mode:"text",scope:"phrase",accepted:["an der Kreuzung"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-naehe-1",targetId:"directions-in-der-naehe-von",type:"recall",word:"in der Nähe von",translation:"неподалік від",category:"DIRECTIONS · LOCATION",
    example:"Das Hotel liegt in der Nähe von einem Park.",exampleTranslation:"Готель розташований неподалік від парку.",
    response:{mode:"text",scope:"phrase",accepted:["in der Nähe von"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-naehe-2",targetId:"directions-in-der-naehe-von",type:"recall",word:"in der Nähe von",translation:"неподалік від",category:"DIRECTIONS · LOCATION",
    example:"Die Haltestelle ist in der Nähe von unserem Hotel.",exampleTranslation:"Зупинка неподалік від нашого готелю.",
    response:{mode:"text",scope:"phrase",accepted:["in der Nähe von"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-naehe-3",targetId:"directions-in-der-naehe-von",type:"recall",word:"in der Nähe von",translation:"неподалік від",category:"DIRECTIONS · LOCATION",
    example:"Gibt es hier ein Café in der Nähe von der Schule?",exampleTranslation:"Тут є кафе неподалік від школи?",
    response:{mode:"text",scope:"phrase",accepted:["in der Nähe von"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-bis-ampel-1",targetId:"directions-bis-zur-ampel",type:"recall",word:"bis zur Ampel",translation:"до світлофора",category:"DIRECTIONS · LANDMARK",
    example:"Gehen Sie bis zur Ampel.",exampleTranslation:"Ідіть до світлофора.",
    response:{mode:"text",scope:"phrase",accepted:["bis zur Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-bis-ampel-2",targetId:"directions-bis-zur-ampel",type:"recall",word:"bis zur Ampel",translation:"до світлофора",category:"DIRECTIONS · LANDMARK",
    example:"Fahren Sie bis zur Ampel und dann nach links.",exampleTranslation:"Їдьте до світлофора, а потім поверніть ліворуч.",
    response:{mode:"text",scope:"phrase",accepted:["bis zur Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-bis-ampel-3",targetId:"directions-bis-zur-ampel",type:"recall",word:"bis zur Ampel",translation:"до світлофора",category:"DIRECTIONS · LANDMARK",
    example:"Bis zur Ampel ist es nicht weit.",exampleTranslation:"До світлофора недалеко.",
    response:{mode:"text",scope:"phrase",accepted:["bis zur Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-an-ampel-1",targetId:"directions-an-der-ampel",type:"recall",word:"an der Ampel",translation:"на світлофорі",category:"DIRECTIONS · LANDMARK",
    example:"Biegen Sie an der Ampel rechts ab.",exampleTranslation:"Поверніть праворуч на світлофорі.",
    response:{mode:"text",scope:"phrase",accepted:["an der Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-an-ampel-2",targetId:"directions-an-der-ampel",type:"recall",word:"an der Ampel",translation:"на світлофорі",category:"DIRECTIONS · LANDMARK",
    example:"Wir warten an der Ampel.",exampleTranslation:"Ми чекаємо на світлофорі.",
    response:{mode:"text",scope:"phrase",accepted:["an der Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-an-ampel-3",targetId:"directions-an-der-ampel",type:"recall",word:"an der Ampel",translation:"на світлофорі",category:"DIRECTIONS · LANDMARK",
    example:"An der Ampel gehen Sie über die Straße.",exampleTranslation:"На світлофорі перейдіть через дорогу.",
    response:{mode:"text",scope:"phrase",accepted:["an der Ampel"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-erste-strasse-1",targetId:"directions-die-erste-strasse-links",type:"recall",word:"die erste Straße links",translation:"перша вулиця ліворуч",category:"DIRECTIONS · ROUTE",
    example:"Nehmen Sie die erste Straße links.",exampleTranslation:"Поверніть на першу вулицю ліворуч.",
    response:{mode:"text",scope:"phrase",accepted:["die erste Straße links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-erste-strasse-2",targetId:"directions-die-erste-strasse-links",type:"recall",word:"die erste Straße links",translation:"перша вулиця ліворуч",category:"DIRECTIONS · ROUTE",
    example:"Die erste Straße links führt zum Bahnhof.",exampleTranslation:"Перша вулиця ліворуч веде до вокзалу.",
    response:{mode:"text",scope:"phrase",accepted:["die erste Straße links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-erste-strasse-3",targetId:"directions-die-erste-strasse-links",type:"recall",word:"die erste Straße links",translation:"перша вулиця ліворуч",category:"DIRECTIONS · ROUTE",
    example:"Gehen Sie bis zur ersten Straße links.",exampleTranslation:"Ідіть до першої вулиці ліворуч.",
    response:{mode:"text",scope:"phrase",accepted:["die erste Straße links"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-ueber-die-strasse-1",targetId:"directions-ueber-die-strasse-gehen",type:"recall",word:"über die Straße gehen",translation:"переходити вулицю",category:"DIRECTIONS · ACTION",
    example:"Gehen Sie an der Ampel über die Straße.",exampleTranslation:"Перейдіть вулицю на світлофорі.",
    response:{mode:"text",scope:"phrase",accepted:["über die Straße gehen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-ueber-die-strasse-2",targetId:"directions-ueber-die-strasse-gehen",type:"recall",word:"über die Straße gehen",translation:"переходити вулицю",category:"DIRECTIONS · ACTION",
    example:"Wir gehen zusammen über die Straße.",exampleTranslation:"Ми разом переходимо вулицю.",
    response:{mode:"text",scope:"phrase",accepted:["über die Straße gehen"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"directions-ueber-die-strasse-3",targetId:"directions-ueber-die-strasse-gehen",type:"recall",word:"über die Straße gehen",translation:"переходити вулицю",category:"DIRECTIONS · ACTION",
    example:"Gehen Sie vorsichtig über die Straße.",exampleTranslation:"Обережно переходьте вулицю.",
    response:{mode:"text",scope:"phrase",accepted:["über die Straße gehen"],caseSensitive:false,punctuationSensitive:false}
  }
];
const esGibtPatternCards=[
  {word:"Es gibt + Akkusativ",translation:"є / існує + знахідний відмінок",category:"GRAMMAR · ES GIBT",example:"In meiner Stadt gibt es ein Kino.",exampleTranslation:"У моєму місті є кінотеатр."},
  {word:"Es gibt einen Park.",translation:"Є парк.",category:"GRAMMAR · MASKULINUM",example:"Im Zentrum gibt es einen Park.",exampleTranslation:"У центрі є парк."},
  {word:"Es gibt eine Ausstellung.",translation:"Є виставка.",category:"GRAMMAR · FEMININUM",example:"Heute gibt es eine Ausstellung im Museum.",exampleTranslation:"Сьогодні в музеї є виставка."},
  {word:"Es gibt ein Café.",translation:"Є кафе.",category:"GRAMMAR · NEUTRUM",example:"Neben dem Museum gibt es ein Café.",exampleTranslation:"Поруч із музеєм є кафе."},
  {word:"Es gibt viele Cafés.",translation:"Є багато кафе.",category:"GRAMMAR · PLURAL",example:"In Berlin gibt es viele Cafés.",exampleTranslation:"У Берліні є багато кафе."}
];
const esGibtClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"ES GIBT · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою.",answer,answerTranslation,practiceType:"cloze"});
const esGibtPracticeCards=[
  esGibtClozeCard("In meiner Stadt gibt es ein Kino.","У моєму місті є кінотеатр.","In meiner Stadt ___ es ein Kino.","gibt","є"),
  esGibtClozeCard("Im Zentrum gibt es einen Park.","У центрі є парк.","Im Zentrum gibt es ___ Park.","einen","парк (Akkusativ)"),
  esGibtClozeCard("Heute gibt es eine Ausstellung.","Сьогодні є виставка.","Heute gibt es ___ Ausstellung.","eine","виставка (Akkusativ)"),
  esGibtClozeCard("Neben dem Museum gibt es ein Café.","Поруч із музеєм є кафе.","Neben dem Museum gibt es ___ Café.","ein","кафе (Akkusativ)"),
  esGibtClozeCard("In der Stadt gibt es viele Restaurants.","У місті є багато ресторанів.","In der Stadt gibt es ___ Restaurants.","viele","багато")
];
const leisurePlaceCards=[
  {word:"das Kino / die Kinos",translation:"кінотеатр / кінотеатри",category:"FREIZEIT · ORT",example:"Am Samstag gehen wir ins Kino.",exampleTranslation:"У суботу ми йдемо в кіно."},
  {word:"das Theater / die Theater",translation:"театр / театри",category:"FREIZEIT · ORT",example:"Das Theater ist neben dem Museum.",exampleTranslation:"Театр поруч із музеєм."},
  {word:"das Museum / die Museen",translation:"музей / музеї",category:"FREIZEIT · ORT",example:"Das Museum ist sehr interessant.",exampleTranslation:"Музей дуже цікавий."},
  {word:"das Café / die Cafés",translation:"кафе / кафе",category:"FREIZEIT · ORT",example:"Wir treffen uns im Café.",exampleTranslation:"Ми зустрічаємося в кафе."},
  {word:"die Ausstellung / die Ausstellungen",translation:"виставка / виставки",category:"FREIZEIT · ORT",example:"Die Ausstellung im Museum ist interessant.",exampleTranslation:"Виставка в музеї цікава."},
  {word:"die Disco / die Discos",translation:"дискотека / дискотеки",category:"FREIZEIT · ORT",example:"In der Disco tanzt man.",exampleTranslation:"На дискотеці танцюють."},
  {word:"das Schwimmbad / die Schwimmbäder",translation:"басейн / басейни",category:"FREIZEIT · ORT",example:"Im Schwimmbad kann man schwimmen.",exampleTranslation:"У басейні можна плавати."},
  {word:"das Konzert / die Konzerte",translation:"концерт / концерти",category:"FREIZEIT · ORT",example:"Das Konzert beginnt um acht Uhr.",exampleTranslation:"Концерт починається о восьмій годині."},
  {word:"die Kneipe / die Kneipen",translation:"паб / паби",category:"FREIZEIT · ORT",example:"Die Kneipe ist am Abend voll.",exampleTranslation:"Паб увечері повний."},
  {word:"das Restaurant / die Restaurants",translation:"ресторан / ресторани",category:"FREIZEIT · ORT",example:"Im Restaurant möchten wir essen.",exampleTranslation:"У ресторані ми хотіли б поїсти."},
  {word:"die Bar / die Bars",translation:"бар / бари",category:"FREIZEIT · ORT",example:"Die Bar ist bis Mitternacht geöffnet.",exampleTranslation:"Бар відкритий до опівночі."}
];
const leisureActivityCards=[
  {word:"besuchen",translation:"відвідувати",category:"FREIZEIT · AKTION",example:"Wir besuchen am Sonntag das Museum.",exampleTranslation:"У неділю ми відвідуємо музей."},
  {word:"ins Kino gehen",translation:"ходити в кіно",category:"FREIZEIT · AKTION",example:"Ich gehe gern ins Kino.",exampleTranslation:"Я охоче ходжу в кіно."},
  {word:"ein Konzert besuchen",translation:"відвідувати концерт",category:"FREIZEIT · AKTION",example:"Sie besuchen heute ein Konzert.",exampleTranslation:"Вони сьогодні відвідують концерт."},
  {word:"im Café Kaffee trinken",translation:"пити каву в кафе",category:"FREIZEIT · AKTION",example:"Im Café kann man Kaffee trinken.",exampleTranslation:"У кафе можна пити каву."},
  {word:"das Gebäck",translation:"випічка",category:"FREIZEIT · WORTSCHATZ",example:"Das Gebäck im Café ist lecker.",exampleTranslation:"Випічка в кафе смачна."},
  {word:"tanzen",translation:"танцювати",category:"FREIZEIT · AKTION",example:"In der Disco tanzt man und hört Musik.",exampleTranslation:"На дискотеці танцюють і слухають музику."},
  {word:"interessant",translation:"цікавий",category:"FREIZEIT · BESCHREIBUNG",example:"Das Museum ist interessant.",exampleTranslation:"Музей цікавий."},
  {word:"langweilig",translation:"нудний",category:"FREIZEIT · BESCHREIBUNG",example:"Der Film ist langweilig.",exampleTranslation:"Фільм нудний."},
  {word:"denn",translation:"тому що",category:"FREIZEIT · KONJUNKTION",example:"Ich gehe ins Kino, denn der Film ist interessant.",exampleTranslation:"Я йду в кіно, тому що фільм цікавий."},
  {word:"ein paar",translation:"кілька",category:"FREIZEIT · MENGE",example:"Es gibt ein paar Cafés in der Straße.",exampleTranslation:"На вулиці є кілька кафе."},
  {word:"das ganze Jahr",translation:"увесь рік",category:"FREIZEIT · ZEIT",example:"Das Schwimmbad ist das ganze Jahr geöffnet.",exampleTranslation:"Басейн відкритий увесь рік."}
];
const photoDescriptionCards=[
  {word:"auf dem Foto",translation:"на фотографії",category:"FOTOBESCHREIBUNG · ORT",example:"Auf dem Foto sind zwei Menschen.",exampleTranslation:"На фотографії двоє людей."},
  {word:"denken",translation:"думати",category:"FOTOBESCHREIBUNG · VERB",example:"Der Mann denkt an seine Familie.",exampleTranslation:"Чоловік думає про свою сім'ю."},
  {word:"der Mensch / die Menschen",translation:"людина / люди",category:"FOTOBESCHREIBUNG · PERSON",example:"Die Menschen stehen vor dem Museum.",exampleTranslation:"Люди стоять перед музеєм."},
  {word:"etwas",translation:"щось",category:"FOTOBESCHREIBUNG · PRONOMEN",example:"Die Frau sucht etwas in ihrer Tasche.",exampleTranslation:"Жінка шукає щось у своїй сумці."}
];
// Explicit noun metadata for the shared gender visuals (Constitution §2, "Visual language").
attachNouns(timeWorksheetVocabularyCards,{
  "der Baum / die Bäume":nounMeta("masculine","Baum",{exampleWord:"",plural:"Bäume",pluralExampleWord:"Bäumen"}),
  "das Blatt / die Blätter":nounMeta("neuter","Blatt",{exampleWord:"",plural:"Blätter",pluralExampleWord:"Blätter"}),
  "die Kirche":nounMeta("feminine","Kirche"),
  "das Restaurant":nounMeta("neuter","Restaurant"),
  "der Weihnachtsmann":nounMeta("masculine","Weihnachtsmann"),
  "die Sekunde":nounMeta("feminine","Sekunde",{exampleWord:""}),
  "die Minute":nounMeta("feminine","Minute"),
  "der Pilz / die Pilze":nounMeta("masculine","Pilz",{exampleWord:"",plural:"Pilze",pluralExampleWord:"Pilze"}),
  "das Fitnessstudio":nounMeta("neuter","Fitnessstudio"),
  "die Wärme":nounMeta("feminine","Wärme"),
  "der Vogel / die Vögel":nounMeta("masculine","Vogel",{exampleWord:"",plural:"Vögel",pluralExampleWord:"Vögel"})
});
attachNouns(everydayVocabularyFoodCards,{
  "der Kräutertee":nounMeta("masculine","Kräutertee"),
  "die Süßigkeiten":nounMeta("plural","Süßigkeiten"),
  "der Kaugummi":nounMeta("masculine","Kaugummi"),
  "der Brei":nounMeta("masculine","Brei")
});
attachNouns(travelTransportCards,Object.fromEntries([
  ["masculine","Bahnhof"],["masculine","Flughafen"],["feminine","S-Bahn"],["neuter","Taxi"],["masculine","Bus"],
  ["masculine","Zug"],["feminine","Straßenbahn"],["feminine","U-Bahn"],["neuter","Flugzeug"],["neuter","Gleis"],
  ["masculine","Bahnsteig"],["masculine","Koffer"],["feminine","Tasche"],["neuter","Gepäck"],["feminine","Haltestelle"]
].map(([gender,word])=>[`${genderArticles[gender]} ${word}`,nounMeta(gender,word)])));
attachNouns(travelPhraseCards,{
  "der nächste Bahnhof":nounMeta("masculine","Bahnhof"),
  "mit dem Zug fahren":nounMeta("masculine","Zug"),
  "mit dem Flugzeug fliegen":nounMeta("neuter","Flugzeug"),
  "zu meiner Freundin":nounMeta("feminine","Freundin"),
  "die Fahrt":nounMeta("feminine","Fahrt"),
  "an der Haltestelle":nounMeta("feminine","Haltestelle")
});
// Pictures name files in assets/icons (Microsoft Fluent Emoji Flat, MIT). A word with no fitting picture gets none.
function attachPictures(cards,pictures){
  for(const card of cards){
    const picture=pictures[card.word];
    if(picture)card.picture=picture;
  }
}
attachPictures(travelTransportCards,{
  "der Bahnhof":"station","der Flughafen":"airplane-departure","die S-Bahn":"light-rail","das Taxi":"taxi",
  "der Bus":"bus","der Zug":"high-speed-train","die Straßenbahn":"tram-car","die U-Bahn":"metro",
  "das Flugzeug":"airplane","das Gleis":"railway-track","der Koffer":"luggage","die Tasche":"handbag",
  "das Gepäck":"baggage-claim","die Haltestelle":"bus-stop"
});
attachPictures(travelPhraseCards,{
  "der nächste Bahnhof":"station","mit dem Zug fahren":"high-speed-train",
  "mit dem Flugzeug fliegen":"airplane","an der Haltestelle":"bus-stop"
});
attachPictures(travelActionCards,{
  "anrufen":"telephone-receiver","einkaufen":"shopping-cart","fernsehen":"television"
});
attachNouns(directionLandmarkCards,{
  "an der Kreuzung":nounMeta("feminine","Kreuzung"),
  "in der Nähe von":nounMeta("feminine","Nähe"),
  "bis zur Ampel":nounMeta("feminine","Ampel"),
  "an der Ampel":nounMeta("feminine","Ampel"),
  "die erste Straße links":nounMeta("feminine","Straße"),
  "über die Straße gehen":nounMeta("feminine","Straße")
});
attachNouns(esGibtPatternCards,{
  "Es gibt einen Park.":nounMeta("masculine","Park"),
  "Es gibt eine Ausstellung.":nounMeta("feminine","Ausstellung"),
  "Es gibt ein Café.":nounMeta("neuter","Café"),
  "Es gibt viele Cafés.":nounMeta("plural","Cafés")
});
attachNouns(esGibtPracticeCards,{
  "Im Zentrum gibt es einen Park.":nounMeta("masculine","Park"),
  "Heute gibt es eine Ausstellung.":nounMeta("feminine","Ausstellung"),
  "Neben dem Museum gibt es ein Café.":nounMeta("neuter","Café"),
  "In der Stadt gibt es viele Restaurants.":nounMeta("plural","Restaurants")
});
attachNouns(leisurePlaceCards,Object.fromEntries([
  ["neuter","Kino","Kinos"],["neuter","Theater","Theater"],["neuter","Museum","Museen"],["neuter","Café","Cafés"],
  ["feminine","Ausstellung","Ausstellungen"],["feminine","Disco","Discos"],["neuter","Schwimmbad","Schwimmbäder"],
  ["neuter","Konzert","Konzerte"],["feminine","Kneipe","Kneipen"],["neuter","Restaurant","Restaurants"],["feminine","Bar","Bars"]
].map(([gender,word,plural])=>[`${genderArticles[gender]} ${word} / die ${plural}`,nounMeta(gender,word,{plural})])));
attachNouns(leisureActivityCards,{
  "ins Kino gehen":nounMeta("neuter","Kino"),
  "ein Konzert besuchen":nounMeta("neuter","Konzert"),
  "im Café Kaffee trinken":nounMeta("neuter","Café"),
  "das Gebäck":nounMeta("neuter","Gebäck"),
  "das ganze Jahr":nounMeta("neuter","Jahr")
});
attachNouns(photoDescriptionCards,{
  "auf dem Foto":nounMeta("neuter","Foto"),
  "der Mensch / die Menschen":nounMeta("masculine","Mensch",{exampleWord:"",plural:"Menschen",pluralExampleWord:"Menschen"})
});
attachPictures(everydayVocabularyFoodCards,{
  "der Kräutertee":"teacup-without-handle","die Süßigkeiten":"candy","der Brei":"bowl-with-spoon"
});
attachPictures(timeWorksheetVocabularyCards,{
  "der Baum / die Bäume":"deciduous-tree","das Blatt / die Blätter":"leaf-fluttering-in-wind","die Kirche":"church",
  "das Restaurant":"fork-and-knife-with-plate","der Weihnachtsmann":"santa-claus","blühen":"blossom",
  "der Pilz / die Pilze":"mushroom","das Fitnessstudio":"person-lifting-weights","die Wärme":"sun",
  "der Vogel / die Vögel":"bird"
});
attachPictures(directionInstructionCards,{
  "geradeaus":"up-arrow","nach rechts":"right-arrow","nach links":"left-arrow"
});
attachPictures(directionLandmarkCards,{
  "bis zur Ampel":"vertical-traffic-light","an der Ampel":"vertical-traffic-light"
});
attachPictures(esGibtPatternCards,{
  "Es gibt einen Park.":"national-park","Es gibt eine Ausstellung.":"framed-picture",
  "Es gibt ein Café.":"hot-beverage","Es gibt viele Cafés.":"hot-beverage"
});
attachPictures(leisurePlaceCards,{
  "das Kino / die Kinos":"clapper-board","das Theater / die Theater":"performing-arts",
  "das Museum / die Museen":"classical-building","das Café / die Cafés":"hot-beverage",
  "die Ausstellung / die Ausstellungen":"framed-picture","die Disco / die Discos":"mirror-ball",
  "das Schwimmbad / die Schwimmbäder":"person-swimming","das Konzert / die Konzerte":"musical-notes",
  "die Kneipe / die Kneipen":"beer-mug","das Restaurant / die Restaurants":"fork-and-knife-with-plate",
  "die Bar / die Bars":"cocktail-glass"
});
attachPictures(leisureActivityCards,{
  "ins Kino gehen":"clapper-board","ein Konzert besuchen":"musical-notes",
  "im Café Kaffee trinken":"hot-beverage","das Gebäck":"croissant","tanzen":"woman-dancing"
});
attachPictures(photoDescriptionCards,{
  "auf dem Foto":"camera-with-flash","denken":"thinking-face","der Mensch / die Menschen":"bust-in-silhouette"
});
const separableVerbPatternCards=[
  {word:"Hauptsatz: Ich stehe früh auf.",translation:"Головне речення: префікс іде в кінець.",category:"TRENNBARE VERBEN · HAUPTSATZ",example:"aufstehen → ich stehe auf",exampleTranslation:"У головному реченні відмінюється лише основа, а префікс стоїть наприкінці.",structure:[mainClause("Ich","stehe","früh","auf")]},
  {word:"..., weil ich früh aufstehe.",translation:"Підрядне речення: дієслово не розділяється.",category:"TRENNBARE VERBEN · NEBENSATZ",example:"weil ich früh aufstehe",exampleTranslation:"У підрядному реченні відмінювана форма з префіксом стоїть разом у кінці.",structure:[subordinateClause("weil","ich früh","aufstehe")]},
  {word:"Ich kann früh aufstehen.",translation:"З модальним дієсловом інфінітив не розділяється.",category:"TRENNBARE VERBEN · MODALVERB",example:"kann + aufstehen",exampleTranslation:"Відмінюване модальне дієслово стоїть на другому місці, а повний інфінітив — у кінці.",structure:[mainClause("Ich","kann","früh","aufstehen")]},
  {word:"Ich verstehe die Aufgabe.",translation:"Невідокремлюване дієслово: префікс не відділяється.",category:"NICHT TRENNBAR · VER-",example:"verstehen → ich verstehe",exampleTranslation:"Префікси be-, emp-, ent-, er-, ge-, miss-, ver-, zer- зазвичай не відокремлюються.",structure:[mainClause("Ich","verstehe","die Aufgabe")]}
];
const separableVerbSentenceCard=(word,translation,prompt,structure,category="TRENNBARE VERBEN · SATZBILDUNG")=>wordOrderSentenceCard(word,translation,prompt,structure,category);
const separableVerbStatementPracticeCards=[
  separableVerbSentenceCard("Ich stehe um sieben Uhr auf.","Я встаю о сьомій годині.","ich / um sieben Uhr / aufstehen.",[mainClause("Ich","stehe","um sieben Uhr","auf")]),
  separableVerbSentenceCard("Ich rufe dich später an.","Я подзвоню тобі пізніше.","ich / dich / später / anrufen.",[mainClause("Ich","rufe","dich später","an")]),
  separableVerbSentenceCard("Wir kaufen heute im Supermarkt ein.","Ми сьогодні робимо покупки в супермаркеті.","wir / heute / im Supermarkt / einkaufen.",[mainClause("Wir","kaufen","heute im Supermarkt","ein")]),
  separableVerbSentenceCard("Der Zug fährt um neun Uhr ab.","Потяг відправляється о дев'ятій годині.","der Zug / um neun Uhr / abfahren.",[mainClause("Der Zug","fährt","um neun Uhr","ab")]),
  separableVerbSentenceCard("Wir steigen am Alexanderplatz aus.","Ми виходимо на Александерплац.","wir / am Alexanderplatz / aussteigen.",[mainClause("Wir","steigen","am Alexanderplatz","aus")]),
  separableVerbSentenceCard("Ich hole meine Freundin vom Bahnhof ab.","Я зустрічаю подругу на вокзалі.","ich / meine Freundin / vom Bahnhof / abholen.",[mainClause("Ich","hole","meine Freundin vom Bahnhof","ab")]),
  separableVerbSentenceCard("Sie steigen in München um.","Вони пересаджуються в Мюнхені.","sie / in München / umsteigen.",[mainClause("Sie","steigen","in München","um")]),
  separableVerbSentenceCard("Ich bringe meine Tasche mit.","Я беру із собою сумку.","ich / meine Tasche / mitbringen.",[mainClause("Ich","bringe","meine Tasche","mit")])
];
const separableVerbContextPracticeCards=[
  separableVerbSentenceCard("Warum rufst du mich nicht an?","Чому ти мені не телефонуєш?","warum / du / mich / nicht / anrufen?",[mainClause("Warum","rufst","du mich nicht","an")],"TRENNBARE VERBEN · W-FRAGE"),
  separableVerbSentenceCard("Er sieht am Abend fern.","Він дивиться телевізор увечері.","er / am Abend / fernsehen.",[mainClause("Er","sieht","am Abend","fern")],"TRENNBARE VERBEN · HAUPTSATZ"),
  separableVerbSentenceCard("Der Bus kommt in fünf Minuten an.","Автобус прибуде через п'ять хвилин.","der Bus / in fünf Minuten / ankommen.",[mainClause("Der Bus","kommt","in fünf Minuten","an")],"TRENNBARE VERBEN · HAUPTSATZ"),
  separableVerbSentenceCard("Wir können um acht Uhr aufstehen.","Ми можемо встати о восьмій годині.","wir / um acht Uhr / aufstehen / können.",[mainClause("Wir","können","um acht Uhr","aufstehen")],"TRENNBARE VERBEN · MODALVERB"),
  separableVerbSentenceCard("Ich kann meine Freundin vom Bahnhof abholen.","Я можу зустріти подругу на вокзалі.","ich / meine Freundin / vom Bahnhof / abholen / können.",[mainClause("Ich","kann","meine Freundin vom Bahnhof","abholen")],"TRENNBARE VERBEN · MODALVERB"),
  separableVerbSentenceCard("Ich bleibe zu Hause, weil ich früh aufstehe.","Я залишаюся вдома, бо рано встаю.","ich / zu Hause / bleiben / weil / ich / früh / aufstehen.",[mainClause("Ich","bleibe","zu Hause"),subordinateClause("weil","ich früh","aufstehe")],"TRENNBARE VERBEN · NEBENSATZ")
];
const moegenPracticeCards=withVerbParadigms([
  modalVerbClozeCard("mögen","Ich mag Kaffee.","Я люблю каву.","Ich ___ Kaffee.","mag","люблю"),
  modalVerbClozeCard("mögen","Du magst deutsche Musik.","Тобі подобається німецька музика.","Du ___ deutsche Musik.","magst","любиш"),
  modalVerbClozeCard("mögen","Sie mag Schokolade.","Вона любить шоколад.","Sie ___ Schokolade.","mag","любить"),
  modalVerbClozeCard("mögen","Wir mögen Pizza.","Ми любимо піцу.","Wir ___ Pizza.","mögen","любимо"),
  modalVerbClozeCard("mögen","Ihr mögt Bücher.","Вам подобаються книжки.","Ihr ___ Bücher.","mögt","любите"),
  modalVerbClozeCard("mögen","Sie mögen den Film.","Їм подобається фільм.","Sie ___ den Film.","mögen","люблять")
],[moegenParadigm]);
const moechtenPracticeCards=withVerbParadigms([
  modalVerbClozeCard("möchten","Ich möchte einen Tee.","Я хотів би / хотіла б чай.","Ich ___ einen Tee.","möchte","хотів би / хотіла б"),
  modalVerbClozeCard("möchten","Du möchtest nach Hause gehen.","Ти хотів би / хотіла б піти додому.","Du ___ nach Hause gehen.","möchtest","хотів би / хотіла б"),
  modalVerbClozeCard("möchten","Sie möchte Deutsch lernen.","Вона хотіла б вивчати німецьку.","Sie ___ Deutsch lernen.","möchte","хотіла б"),
  modalVerbClozeCard("möchten","Wir möchten etwas essen.","Ми хотіли б щось поїсти.","Wir ___ etwas essen.","möchten","хотіли б"),
  modalVerbClozeCard("möchten","Ihr möchtet ins Kino gehen.","Ви хотіли б піти в кіно.","Ihr ___ ins Kino gehen.","möchtet","хотіли б"),
  modalVerbClozeCard("möchten","Sie möchten bezahlen.","Вони хотіли б заплатити.","Sie ___ bezahlen.","möchten","хотіли б")
],[moechtenParadigm]);
const wollenPracticeCards=withVerbParadigms([
  wollenClozeCard({id:"wollen-ich-cloze",targetId:"wollen-ich",word:"Ich will Italienisch lernen.",translation:"Я хочу вивчати італійську.",prompt:"Ich ___ Italienisch lernen.",answer:"will",answerTranslation:"хочу",explanation:"Для ich форма wollen — will."}),
  wollenClozeCard({id:"wollen-du-cloze",targetId:"wollen-du",word:"Du willst heute Abend ins Kino gehen.",translation:"Ти хочеш сьогодні ввечері піти в кіно.",prompt:"Du ___ heute Abend ins Kino gehen.",answer:"willst",answerTranslation:"хочеш",explanation:"Для du форма wollen — willst."}),
  wollenClozeCard({id:"wollen-er-cloze",targetId:"wollen-er",word:"Sie will im Urlaub Ski fahren.",translation:"Вона хоче кататися на лижах у відпустці.",prompt:"Sie ___ im Urlaub Ski fahren.",answer:"will",answerTranslation:"хоче",explanation:"Для er/sie/es форма wollen — will."}),
  wollenClozeCard({id:"wollen-wir-cloze",targetId:"wollen-wir",word:"Wir wollen zusammen kochen.",translation:"Ми хочемо готувати разом.",prompt:"Wir ___ zusammen kochen.",answer:"wollen",answerTranslation:"хочемо",explanation:"Для wir форма wollen — wollen."}),
  wollenClozeCard({id:"wollen-ihr-cloze",targetId:"wollen-ihr",word:"Ihr wollt nach Berlin fahren.",translation:"Ви хочете поїхати до Берліна.",prompt:"Ihr ___ nach Berlin fahren.",answer:"wollt",answerTranslation:"хочете",explanation:"Для ihr форма wollen — wollt."}),
  wollenClozeCard({id:"wollen-sie-cloze",targetId:"wollen-sie",word:"Sie wollen unbedingt noch Deutsch lernen.",translation:"Вони неодмінно хочуть ще вивчати німецьку.",prompt:"Sie ___ unbedingt noch Deutsch lernen.",answer:"wollen",answerTranslation:"хочуть",explanation:"Для sie/Sie форма wollen — wollen."})
],[wollenParadigm]);
const moegenMoechtenComparisonPracticeCards=[
  modalVerbClozeCard("mögen oder möchten","Ich mag Kaffee.","Мені подобається кава.","Ich ___ Kaffee.","mag","подобається"),
  modalVerbClozeCard("mögen oder möchten","Ich möchte einen Kaffee, bitte.","Я хотів би / хотіла б каву, будь ласка.","Ich ___ einen Kaffee, bitte.","möchte","хотів би / хотіла б"),
  modalVerbClozeCard("mögen oder möchten","Sie mag deutsche Musik.","Їй подобається німецька музика.","Sie ___ deutsche Musik.","mag","подобається"),
  modalVerbClozeCard("mögen oder möchten","Sie möchte bezahlen.","Вона хотіла б заплатити.","Sie ___ bezahlen.","möchte","хотіла б")
];
const koennenCards=[...koennenFormCards,...moegenFormCards,...moechtenFormCards,...wollenFormCards,...moegenMoechtenComparisonCards,...koennenWordOrderCards,...wollenWordOrderCards,...koennenPracticeCards,...moegenPracticeCards,...moechtenPracticeCards,...wollenPracticeCards,...moegenMoechtenComparisonPracticeCards,...wollenWordOrderPracticeCards];
const habenCards=[...habenFormCards,...habenPracticeCards,...bekommenFormCards,...bekommenPracticeCards,...brauchenFormCards,...brauchenPracticeCards];
const localPrepositionsDativeCards=[
  {id:"local-dative-in-schublade",targetId:"local-dative-in-schublade",type:"cloze",word:"in der Schublade",translation:"у шухляді",promptText:"Das Buch liegt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["in der Schublade"],caseSensitive:false,punctuationSensitive:false},explanation:"Wo? указує на розташування, тому in вимагає Dativ: die Schublade → der Schublade.",example:"Das Heft liegt in der Schublade.",exampleTranslation:"Зошит лежить у шухляді.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-an-wand",targetId:"local-dative-an-wand",type:"cloze",word:"an der Wand",translation:"на стіні",promptText:"Das Bild hängt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["an der Wand"],caseSensitive:false,punctuationSensitive:false},explanation:"Картина вже висить на місці, тому an вимагає Dativ: die Wand → der Wand.",example:"Neben der Tür hängt ein Kalender an der Wand.",exampleTranslation:"Біля дверей на стіні висить календар.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-auf-tisch",targetId:"local-dative-auf-tisch",type:"cloze",word:"auf dem Tisch",translation:"на столі",promptText:"Die Zeitung liegt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["auf dem Tisch"],caseSensitive:false,punctuationSensitive:false},explanation:"Газета вже лежить на поверхні, тому auf вимагає Dativ: der Tisch → dem Tisch.",example:"Auf dem Tisch liegt auch ein Brief.",exampleTranslation:"На столі також лежить лист.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-ueber-bett",targetId:"local-dative-ueber-bett",type:"cloze",word:"über dem Bett",translation:"над ліжком",promptText:"Die Lampe hängt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["über dem Bett"],caseSensitive:false,punctuationSensitive:false},explanation:"Лампа має нерухоме розташування, тому über вимагає Dativ: das Bett → dem Bett.",example:"Über dem Bett hängt eine kleine Lampe.",exampleTranslation:"Над ліжком висить маленька лампа.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-unter-stuhl",targetId:"local-dative-unter-stuhl",type:"cloze",word:"unter dem Stuhl",translation:"під стільцем",promptText:"Der Hund liegt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["unter dem Stuhl"],caseSensitive:false,punctuationSensitive:false},explanation:"Собака вже лежить на місці, тому unter вимагає Dativ: der Stuhl → dem Stuhl.",example:"Unter dem Stuhl schläft der Hund.",exampleTranslation:"Під стільцем спить собака.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-vor-haus",targetId:"local-dative-vor-haus",type:"cloze",word:"vor dem Haus",translation:"перед будинком",promptText:"Die Bank steht ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["vor dem Haus"],caseSensitive:false,punctuationSensitive:false},explanation:"Лавка вже стоїть на місці, тому vor вимагає Dativ: das Haus → dem Haus.",example:"Vor dem Haus wartet ein Freund.",exampleTranslation:"Перед будинком чекає друг.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-hinter-haus",targetId:"local-dative-hinter-haus",type:"cloze",word:"hinter dem Haus",translation:"за будинком",promptText:"Das Auto steht ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["hinter dem Haus"],caseSensitive:false,punctuationSensitive:false},explanation:"Автомобіль уже стоїть на місці, тому hinter вимагає Dativ: das Haus → dem Haus.",example:"Hinter dem Haus ist ein Parkplatz.",exampleTranslation:"За будинком є парковка.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-neben-studentin",targetId:"local-dative-neben-studentin",type:"cloze",word:"neben der Studentin",translation:"біля студентки",promptText:"Er sitzt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["neben der Studentin"],caseSensitive:false,punctuationSensitive:false},explanation:"Він уже сидить на місці, тому neben вимагає Dativ: die Studentin → der Studentin.",example:"Ihr Freund sitzt neben der Studentin.",exampleTranslation:"Її друг сидить біля студентки.",category:"LOKALE PRÄPOSITIONEN · WO?"},
  {id:"local-dative-zwischen-fenstern",targetId:"local-dative-zwischen-fenstern",type:"cloze",word:"zwischen den Fenstern",translation:"між вікнами",promptText:"Das Bild hängt ___.",support:"Wo? Місце без напрямку.",response:{mode:"text",scope:"phrase",accepted:["zwischen den Fenstern"],caseSensitive:false,punctuationSensitive:false},explanation:"Картина вже висить на місці, тому zwischen вимагає Dativ множини: die Fenster → den Fenstern.",example:"Zwischen den Fenstern hängt ein Bild.",exampleTranslation:"Між вікнами висить картина.",category:"LOKALE PRÄPOSITIONEN · WO?"}
];
const localPrepositionsAccusativeCards=[
  {id:"local-accusative-in-schublade",targetId:"local-accusative-in-schublade",type:"cloze",word:"in die Schublade",translation:"у шухляду",promptText:"Er legt das Buch ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["in die Schublade"],caseSensitive:false,punctuationSensitive:false},explanation:"Wohin? указує на напрямок, тому in вимагає Akkusativ: die Schublade → die Schublade.",example:"Sie legt das Heft in die Schublade.",exampleTranslation:"Вона кладе зошит у шухляду.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-an-wand",targetId:"local-accusative-an-wand",type:"cloze",word:"an die Wand",translation:"на стіну",promptText:"Er hängt das Bild ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["an die Wand"],caseSensitive:false,punctuationSensitive:false},explanation:"Картину переміщують на стіну, тому an вимагає Akkusativ: die Wand → die Wand.",example:"Ich hänge das Poster an die Wand.",exampleTranslation:"Я вішаю плакат на стіну.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-auf-tisch",targetId:"local-accusative-auf-tisch",type:"cloze",word:"auf den Tisch",translation:"на стіл",promptText:"Ich stelle die Vase ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["auf den Tisch"],caseSensitive:false,punctuationSensitive:false},explanation:"Вазу ставлять на поверхню, тому auf вимагає Akkusativ: der Tisch → den Tisch.",example:"Stell bitte die Gläser auf den Tisch.",exampleTranslation:"Будь ласка, постав склянки на стіл.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-ueber-bett",targetId:"local-accusative-ueber-bett",type:"cloze",word:"über das Bett",translation:"над ліжко",promptText:"Ich hänge die Lampe ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["über das Bett"],caseSensitive:false,punctuationSensitive:false},explanation:"Лампу переміщують на нове місце, тому über вимагає Akkusativ: das Bett → das Bett.",example:"Der Vater hängt die Lampe über das Bett.",exampleTranslation:"Тато вішає лампу над ліжком.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-unter-stuhl",targetId:"local-accusative-unter-stuhl",type:"cloze",word:"unter den Stuhl",translation:"під стілець",promptText:"Der Hund legt sich ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["unter den Stuhl"],caseSensitive:false,punctuationSensitive:false},explanation:"Собака переміщується туди, тому unter вимагає Akkusativ: der Stuhl → den Stuhl.",example:"Bei Gewitter läuft der Hund unter den Stuhl.",exampleTranslation:"Під час грози пес ховається під стілець.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-vor-haus",targetId:"local-accusative-vor-haus",type:"cloze",word:"vor das Haus",translation:"перед будинком",promptText:"Wir stellen die Bank ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["vor das Haus"],caseSensitive:false,punctuationSensitive:false},explanation:"Лавку переміщують на це місце, тому vor вимагає Akkusativ: das Haus → das Haus.",example:"Der Nachbar stellt die Bank vor das Haus.",exampleTranslation:"Сусід ставить лавку перед будинком.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-hinter-haus",targetId:"local-accusative-hinter-haus",type:"cloze",word:"hinter das Haus",translation:"за будинок",promptText:"Wir fahren das Auto ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["hinter das Haus"],caseSensitive:false,punctuationSensitive:false},explanation:"Автомобіль переміщують до місця призначення, тому hinter вимагає Akkusativ: das Haus → das Haus.",example:"Fahr bitte hinter das Haus.",exampleTranslation:"Будь ласка, їдь за будинок.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-neben-studentin",targetId:"local-accusative-neben-studentin",type:"cloze",word:"neben die Studentin",translation:"біля студентки",promptText:"Er setzt sich ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["neben die Studentin"],caseSensitive:false,punctuationSensitive:false},explanation:"Він сідає на нове місце, тому neben вимагає Akkusativ: die Studentin → die Studentin.",example:"Der Lehrer setzt sich neben die Studentin.",exampleTranslation:"Вчитель сідає біля студентки.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"},
  {id:"local-accusative-zwischen-fenster",targetId:"local-accusative-zwischen-fenster",type:"cloze",word:"zwischen die Fenster",translation:"між вікна",promptText:"Ich hänge das Bild ___.",support:"Wohin? Напрямок до місця.",response:{mode:"text",scope:"phrase",accepted:["zwischen die Fenster"],caseSensitive:false,punctuationSensitive:false},explanation:"Картину переміщують на нове місце, тому zwischen вимагає Akkusativ множини: die Fenster → die Fenster.",example:"Häng den Spiegel zwischen die Fenster.",exampleTranslation:"Повісь дзеркало між вікнами.",category:"LOKALE PRÄPOSITIONEN · WOHIN?"}
];
const localPrepositionsContrastCards=[
  {id:"local-contrast-vase",targetId:"local-contrast-vase",type:"sentence-build",word:"Ich stelle die Vase auf den Tisch.",translation:"Я ставлю вазу на стіл.",gap:"auf den Tisch",gloss:"ваза · стіл",response:{mode:"text",scope:"sentence",accepted:["Ich stelle die Vase auf den Tisch."],caseSensitive:false,punctuationSensitive:false},explanation:"Stellen відповідає на Wohin?, тому вживаємо auf + Akkusativ: auf den Tisch.",example:"Ich stelle die Vase auf den Tisch, damit alle sie sehen.",exampleTranslation:"Я ставлю вазу на стіл, щоб її бачили всі.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-vase-position",targetId:"local-contrast-vase-position",type:"sentence-build",word:"Die Vase steht auf dem Tisch.",translation:"Ваза стоїть на столі.",gap:"auf dem Tisch",gloss:"ваза · стіл",response:{mode:"text",scope:"sentence",accepted:["Die Vase steht auf dem Tisch."],caseSensitive:false,punctuationSensitive:false},explanation:"Stehen відповідає на Wo?, тому вживаємо auf + Dativ: auf dem Tisch.",example:"Die Vase steht auf dem Tisch, neben den Blumen.",exampleTranslation:"Ваза стоїть на столі, поруч із квітами.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-picture",targetId:"local-contrast-picture",type:"sentence-build",word:"Er hängt das Bild an die Wand.",translation:"Він вішає картину на стіну.",gap:"an die Wand",gloss:"картина · стіна",response:{mode:"text",scope:"sentence",accepted:["Er hängt das Bild an die Wand."],caseSensitive:false,punctuationSensitive:false},explanation:"Hängen тут описує переміщення на стіну, тому an вимагає Akkusativ.",example:"Er hängt das Bild an die Wand, weil es ihm gefällt.",exampleTranslation:"Він вішає картину на стіну, бо вона йому подобається.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-picture-position",targetId:"local-contrast-picture-position",type:"sentence-build",word:"Das Bild hängt an der Wand.",translation:"Картина висить на стіні.",gap:"an der Wand",gloss:"картина · стіна",response:{mode:"text",scope:"sentence",accepted:["Das Bild hängt an der Wand."],caseSensitive:false,punctuationSensitive:false},explanation:"Hängen тут описує нерухоме розташування, тому an вимагає Dativ.",example:"Das Bild hängt an der Wand, direkt neben der Tür.",exampleTranslation:"Картина висить на стіні, прямо біля дверей.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-key",targetId:"local-contrast-key",type:"sentence-build",word:"Sie legt den Schlüssel in die Tasche.",translation:"Вона кладе ключ у сумку.",gap:"in die Tasche",gloss:"ключ · сумка",response:{mode:"text",scope:"sentence",accepted:["Sie legt den Schlüssel in die Tasche."],caseSensitive:false,punctuationSensitive:false},explanation:"Legen відповідає на Wohin?, тому in вимагає Akkusativ: in die Tasche.",example:"Sie legt den Schlüssel in die Tasche, bevor sie geht.",exampleTranslation:"Вона кладе ключ у сумку, перш ніж піти.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-key-position",targetId:"local-contrast-key-position",type:"sentence-build",word:"Der Schlüssel ist in der Tasche.",translation:"Ключ у сумці.",gap:"in der Tasche",gloss:"ключ · сумка",response:{mode:"text",scope:"sentence",accepted:["Der Schlüssel ist in der Tasche."],caseSensitive:false,punctuationSensitive:false},explanation:"Sein відповідає на Wo?, тому in вимагає Dativ: in der Tasche.",example:"Der Schlüssel ist in der Tasche, nicht im Auto.",exampleTranslation:"Ключ у сумці, а не в машині.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-sofa",targetId:"local-contrast-sofa",type:"sentence-build",word:"Ich setze mich auf das Sofa.",translation:"Я сідаю на диван.",gap:"auf das Sofa",gloss:"диван",response:{mode:"text",scope:"sentence",accepted:["Ich setze mich auf das Sofa."],caseSensitive:false,punctuationSensitive:false},explanation:"Sich setzen описує переміщення на сидіння, тому auf вимагає Akkusativ.",example:"Ich setze mich auf das Sofa, weil ich müde bin.",exampleTranslation:"Я сідаю на диван, бо я втомився.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"},
  {id:"local-contrast-sofa-position",targetId:"local-contrast-sofa-position",type:"sentence-build",word:"Ich sitze auf dem Sofa.",translation:"Я сиджу на дивані.",gap:"auf dem Sofa",gloss:"диван",response:{mode:"text",scope:"sentence",accepted:["Ich sitze auf dem Sofa."],caseSensitive:false,punctuationSensitive:false},explanation:"Sitzen описує розташування, тому auf вимагає Dativ.",example:"Ich sitze auf dem Sofa und lese.",exampleTranslation:"Я сиджу на дивані й читаю.",category:"LOKALE PRÄPOSITIONEN · SATZBAU"}
];
// Explicit scene metadata for the shared card illustration (Constitution §2, "Visual language").
const localPrepositionScenes={
  "local-dative-in-schublade":{scene:"drawer",motion:false,noun:nounMeta("feminine","Schublade")},
  "local-dative-an-wand":{scene:"wall",motion:false,noun:nounMeta("feminine","Wand")},
  "local-dative-auf-tisch":{scene:"newspaper",motion:false,noun:nounMeta("masculine","Tisch")},
  "local-dative-ueber-bett":{scene:"bed",motion:false,noun:nounMeta("neuter","Bett")},
  "local-dative-unter-stuhl":{scene:"chair",motion:false,noun:nounMeta("masculine","Stuhl")},
  "local-dative-vor-haus":{scene:"house-front",motion:false,noun:nounMeta("neuter","Haus")},
  "local-dative-hinter-haus":{scene:"house-behind",motion:false,noun:nounMeta("neuter","Haus")},
  "local-dative-neben-studentin":{scene:"people",motion:false,noun:nounMeta("feminine","Studentin")},
  "local-dative-zwischen-fenstern":{scene:"windows",motion:false,noun:nounMeta("plural","Fenster",{exampleWord:"Fenstern"})},
  "local-accusative-in-schublade":{scene:"drawer",motion:true,noun:nounMeta("feminine","Schublade")},
  "local-accusative-an-wand":{scene:"wall",motion:true,noun:nounMeta("feminine","Wand")},
  "local-accusative-auf-tisch":{scene:"table",motion:true,noun:nounMeta("masculine","Tisch")},
  "local-accusative-ueber-bett":{scene:"bed",motion:true,noun:nounMeta("neuter","Bett")},
  "local-accusative-unter-stuhl":{scene:"chair",motion:true,noun:nounMeta("masculine","Stuhl")},
  "local-accusative-vor-haus":{scene:"house-front",motion:true,noun:nounMeta("neuter","Haus")},
  "local-accusative-hinter-haus":{scene:"house-behind",motion:true,noun:nounMeta("neuter","Haus")},
  "local-accusative-neben-studentin":{scene:"people",motion:true,noun:nounMeta("feminine","Studentin")},
  "local-accusative-zwischen-fenster":{scene:"windows",motion:true,noun:nounMeta("plural","Fenster")},
  "local-contrast-vase":{scene:"table",motion:true,noun:nounMeta("masculine","Tisch")},
  "local-contrast-vase-position":{scene:"table",motion:false,noun:nounMeta("masculine","Tisch")},
  "local-contrast-picture":{scene:"wall",motion:true,noun:nounMeta("feminine","Wand")},
  "local-contrast-picture-position":{scene:"wall",motion:false,noun:nounMeta("feminine","Wand")},
  "local-contrast-key":{scene:"bag",motion:true,noun:nounMeta("feminine","Tasche")},
  "local-contrast-key-position":{scene:"bag",motion:false,noun:nounMeta("feminine","Tasche")},
  "local-contrast-sofa":{scene:"sofa",motion:true,noun:nounMeta("neuter","Sofa")},
  "local-contrast-sofa-position":{scene:"sofa",motion:false,noun:nounMeta("neuter","Sofa")}
};
for(const card of [...localPrepositionsDativeCards,...localPrepositionsAccusativeCards,...localPrepositionsContrastCards]){
  const {scene,motion,noun}=localPrepositionScenes[card.targetId],cue=motion?"Wohin?":"Wo?";
  // The prompt names the place, so its noun and gender stay visible in practice.
  Object.assign(card,{
    scene:{kind:scene,motion},
    cue,
    noun,
    practiceSupport:{label:`${cue} · значення`,text:card.translation}
  });
}
// Practice-only variants (3x practice pools): each target keeps its learn card and gains two practice cards.
// A variant reuses its target's noun, scene and cue, so only the sentence changes. Sentence frames follow the
// Lokale Präpositionen worksheet (training-materials, Übung 1–5).
const localPrepositionBaseCard=targetId=>[...localPrepositionsDativeCards,...localPrepositionsAccusativeCards,...localPrepositionsContrastCards].find(card=>card.targetId===targetId);
const localPrepositionVariant=(targetId,{id,promptText,word,translation,gap,gloss,example,exampleTranslation,explanation})=>{
  const base=localPrepositionBaseCard(targetId);
  return {
    ...base,id,promptText,gap,gloss,example,exampleTranslation,explanation,
    // A sentence-build variant has its own sentence, so its answer and translation cue change with it.
    ...(word?{word,translation,response:{...base.response,accepted:[word]},practiceSupport:{...base.practiceSupport,text:translation}}:{})
  };
};
const localPrepositionsDativePracticeOnlyCards=[
  localPrepositionVariant("local-dative-in-schublade",{id:"local-dative-in-schublade-briefe",promptText:"Die Hefte liegen ___.",example:"Die alten Hefte liegen in der Schublade.",exampleTranslation:"Старі зошити лежать у шухляді.",explanation:"Wo? указує на розташування, тому in вимагає Dativ: die Schublade → der Schublade."}),
  localPrepositionVariant("local-dative-in-schublade",{id:"local-dative-in-schublade-geld",promptText:"Ein dickes Buch liegt ___.",example:"Ein dickes Buch liegt in der Schublade.",exampleTranslation:"Товста книжка лежить у шухляді.",explanation:"Wo? указує на розташування, тому in вимагає Dativ: die Schublade → der Schublade."}),
  localPrepositionVariant("local-dative-an-wand",{id:"local-dative-an-wand-plakate",promptText:"Die Plakate hängen ___.",example:"Die bunten Plakate hängen an der Wand.",exampleTranslation:"Яскраві плакати висять на стіні.",explanation:"Wo? указує на місце, тому an вимагає Dativ: die Wand → der Wand."}),
  localPrepositionVariant("local-dative-an-wand",{id:"local-dative-an-wand-tafel",promptText:"Die Tafel hängt ___.",example:"Die große Tafel hängt an der Wand.",exampleTranslation:"Велика дошка висить на стіні.",explanation:"Wo? указує на місце, тому an вимагає Dativ: die Wand → der Wand."}),
  localPrepositionVariant("local-dative-auf-tisch",{id:"local-dative-auf-tisch-zeitschrift",promptText:"Eine Zeitschrift liegt ___.",example:"Die alte Zeitschrift liegt auf dem Tisch.",exampleTranslation:"Старий журнал лежить на столі.",explanation:"Wo? указує на місце без напрямку, тому auf вимагає Dativ: der Tisch → dem Tisch."}),
  localPrepositionVariant("local-dative-auf-tisch",{id:"local-dative-auf-tisch-heft",promptText:"Ein Heft liegt ___.",example:"Das dicke Heft liegt auf dem Tisch.",exampleTranslation:"Товстий зошит лежить на столі.",explanation:"Wo? указує на місце без напрямку, тому auf вимагає Dativ: der Tisch → dem Tisch."}),
  localPrepositionVariant("local-dative-ueber-bett",{id:"local-dative-ueber-bett-bild",promptText:"Eine große Lampe hängt ___.",example:"Eine große Lampe hängt über dem Bett.",exampleTranslation:"Над ліжком висить велика лампа.",explanation:"Wo? указує на місце, тому über вимагає Dativ: das Bett → dem Bett."}),
  localPrepositionVariant("local-dative-ueber-bett",{id:"local-dative-ueber-bett-uhr",promptText:"Die Lampe hängt abends ___.",example:"Die Lampe hängt abends über dem Bett.",exampleTranslation:"Лампа ввечері висить над ліжком.",explanation:"Wo? указує на місце, тому über вимагає Dativ: das Bett → dem Bett."}),
  localPrepositionVariant("local-dative-unter-stuhl",{id:"local-dative-unter-stuhl-katze",promptText:"Der müde Hund schläft ___.",example:"Der müde Hund schläft unter dem Stuhl.",exampleTranslation:"Втомлений пес спить під стільцем.",explanation:"Wo? указує на місце, тому unter вимагає Dativ: der Stuhl → dem Stuhl."}),
  localPrepositionVariant("local-dative-unter-stuhl",{id:"local-dative-unter-stuhl-ball",promptText:"Der Hund sucht seinen Ball ___.",example:"Der Hund sucht seinen Ball unter dem Stuhl.",exampleTranslation:"Пес шукає свій м’яч під стільцем.",explanation:"Wo? указує на місце, тому unter вимагає Dativ: der Stuhl → dem Stuhl."}),
  localPrepositionVariant("local-dative-vor-haus",{id:"local-dative-vor-haus-auto",promptText:"Eine alte Bank steht ___.",example:"Eine alte Bank steht vor dem Haus.",exampleTranslation:"Перед будинком стоїть стара лавка.",explanation:"Wo? указує на місце, тому vor вимагає Dativ: das Haus → dem Haus."}),
  localPrepositionVariant("local-dative-vor-haus",{id:"local-dative-vor-haus-taxi",promptText:"Die Kinder warten ___.",example:"Die Kinder warten vor dem Haus.",exampleTranslation:"Діти чекають перед будинком.",explanation:"Wo? указує на місце, тому vor вимагає Dativ: das Haus → dem Haus."}),
  localPrepositionVariant("local-dative-hinter-haus",{id:"local-dative-hinter-haus-garten",promptText:"Der alte Wagen steht ___.",example:"Der alte Wagen steht hinter dem Haus.",exampleTranslation:"Старий автомобіль стоїть за будинком.",explanation:"Wo? указує на місце, тому hinter вимагає Dativ: das Haus → dem Haus."}),
  localPrepositionVariant("local-dative-hinter-haus",{id:"local-dative-hinter-haus-fest",promptText:"Mein Auto parkt ___.",example:"Mein Auto parkt hinter dem Haus.",exampleTranslation:"Моя машина припаркована за будинком.",explanation:"Wo? указує на місце, тому hinter вимагає Dativ: das Haus → dem Haus."}),
  localPrepositionVariant("local-dative-neben-studentin",{id:"local-dative-neben-studentin-lehrer",promptText:"Der Lehrer sitzt ___.",example:"Der Lehrer sitzt neben der Studentin und hilft ihr.",exampleTranslation:"Учитель сидить біля студентки і допомагає їй.",explanation:"Wo? указує на місце, тому neben вимагає Dativ: die Studentin → der Studentin."}),
  localPrepositionVariant("local-dative-neben-studentin",{id:"local-dative-neben-studentin-junge",promptText:"Der Junge sitzt ___.",example:"Der Junge sitzt neben der Studentin und lacht.",exampleTranslation:"Хлопець сидить біля студентки і сміється.",explanation:"Wo? указує на місце, тому neben вимагає Dativ: die Studentin → der Studentin."}),
  localPrepositionVariant("local-dative-zwischen-fenstern",{id:"local-dative-zwischen-fenstern-pflanze",promptText:"Ein großes Poster hängt ___.",example:"Ein großes Poster hängt zwischen den Fenstern.",exampleTranslation:"Між вікнами висить великий плакат.",explanation:"Wo? указує на місце, тому zwischen вимагає Dativ множини: die Fenster → den Fenstern."}),
  localPrepositionVariant("local-dative-zwischen-fenstern",{id:"local-dative-zwischen-fenstern-stuhl",promptText:"Ein Spiegel hängt ___.",example:"Ein Spiegel hängt zwischen den Fenstern.",exampleTranslation:"Між вікнами висить дзеркало.",explanation:"Wo? указує на місце, тому zwischen вимагає Dativ множини: die Fenster → den Fenstern."})
];
const localPrepositionsAccusativePracticeOnlyCards=[
  localPrepositionVariant("local-accusative-in-schublade",{id:"local-accusative-in-schublade-quittung",promptText:"Ich lege das alte Heft ___.",example:"Ich lege das alte Heft in die Schublade.",exampleTranslation:"Я кладу старий зошит у шухляду.",explanation:"Wohin? указує на напрямок, тому in вимагає Akkusativ: die Schublade → die Schublade."}),
  localPrepositionVariant("local-accusative-in-schublade",{id:"local-accusative-in-schublade-karte",promptText:"Sie legt das Buch ___.",example:"Sie legt das Buch abends in die Schublade.",exampleTranslation:"Вона ввечері кладе книжку в шухляду.",explanation:"Wohin? указує на напрямок, тому in вимагає Akkusativ: die Schublade → die Schublade."}),
  localPrepositionVariant("local-accusative-an-wand",{id:"local-accusative-an-wand-plakate",promptText:"Die Schülerin hängt die Plakate ___.",example:"Die Schülerin hängt die bunten Plakate an die Wand.",exampleTranslation:"Учениця вішає яскраві плакати на стіну.",explanation:"Wohin? указує на напрямок, тому an вимагає Akkusativ: die Wand → die Wand."}),
  localPrepositionVariant("local-accusative-an-wand",{id:"local-accusative-an-wand-karte",promptText:"Wir hängen die Karte ___.",example:"Wir hängen die große Karte an die Wand.",exampleTranslation:"Ми вішаємо велику карту на стіну.",explanation:"Wohin? указує на напрямок, тому an вимагає Akkusativ: die Wand → die Wand."}),
  localPrepositionVariant("local-accusative-auf-tisch",{id:"local-accusative-auf-tisch-teller",promptText:"Ich stelle den Teller ___.",example:"Ich stelle den Teller vorsichtig auf den Tisch.",exampleTranslation:"Я обережно ставлю тарілку на стіл.",explanation:"Wohin? указує на напрямок, тому auf вимагає Akkusativ: der Tisch → den Tisch."}),
  localPrepositionVariant("local-accusative-auf-tisch",{id:"local-accusative-auf-tisch-schluessel",promptText:"Ich stelle die Blumen ___.",example:"Ich stelle die Blumen bitte auf den Tisch.",exampleTranslation:"Будь ласка, я ставлю квіти на стіл.",explanation:"Wohin? указує на напрямок, тому auf вимагає Akkusativ: der Tisch → den Tisch."}),
  localPrepositionVariant("local-accusative-ueber-bett",{id:"local-accusative-ueber-bett-handtuch",promptText:"Die Mutter legt die Decke ___.",example:"Die Mutter legt die Decke abends über das Bett.",exampleTranslation:"Мама ввечері кладе ковдру над ліжко.",explanation:"Wohin? указує на напрямок, тому über вимагає Akkusativ: das Bett → das Bett."}),
  localPrepositionVariant("local-accusative-ueber-bett",{id:"local-accusative-ueber-bett-jacke",promptText:"Ich hänge die neue Lampe ___.",example:"Ich hänge die neue Lampe über das Bett.",exampleTranslation:"Я вішаю нову лампу над ліжко.",explanation:"Wohin? указує на напрямок, тому über вимагає Akkusativ: das Bett → das Bett."}),
  localPrepositionVariant("local-accusative-unter-stuhl",{id:"local-accusative-unter-stuhl-katze",promptText:"Der Hund flüchtet ___.",example:"Der Hund flüchtet schnell unter den Stuhl.",exampleTranslation:"Пес швидко ховається під стілець.",explanation:"Wohin? указує на напрямок, тому unter вимагає Akkusativ: der Stuhl → den Stuhl."}),
  localPrepositionVariant("local-accusative-unter-stuhl",{id:"local-accusative-unter-stuhl-ball",promptText:"Der Hund schleicht ___.",example:"Der Hund schleicht leise unter den Stuhl.",exampleTranslation:"Пес тихо підкрадається під стілець.",explanation:"Wohin? указує на напрямок, тому unter вимагає Akkusativ: der Stuhl → den Stuhl."}),
  localPrepositionVariant("local-accusative-vor-haus",{id:"local-accusative-vor-haus-fahrraeder",promptText:"Die Kinder stellen die Bank ___.",example:"Die Kinder stellen die Bank abends vor das Haus.",exampleTranslation:"Діти ввечері ставлять лавку перед будинком.",explanation:"Wohin? указує на напрямок, тому vor вимагає Akkusativ: das Haus → das Haus."}),
  localPrepositionVariant("local-accusative-vor-haus",{id:"local-accusative-vor-haus-hund",promptText:"Der Hund läuft ___.",example:"Der Hund läuft schnell vor das Haus.",exampleTranslation:"Пес швидко біжить перед будинком.",explanation:"Wohin? указує на напрямок, тому vor вимагає Akkusativ: das Haus → das Haus."}),
  localPrepositionVariant("local-accusative-hinter-haus",{id:"local-accusative-hinter-haus-auto",promptText:"Er fährt das Auto langsam ___.",example:"Er fährt das Auto langsam hinter das Haus.",exampleTranslation:"Він повільно заїжджає машиною за будинок.",explanation:"Wohin? указує на напрямок, тому hinter вимагає Akkusativ: das Haus → das Haus."}),
  localPrepositionVariant("local-accusative-hinter-haus",{id:"local-accusative-hinter-haus-katze",promptText:"Die Nachbarin fährt das Auto ___.",example:"Die Nachbarin fährt das Auto hinter das Haus.",exampleTranslation:"Сусідка заїжджає машиною за будинок.",explanation:"Wohin? указує на напрямок, тому hinter вимагає Akkusativ: das Haus → das Haus."}),
  localPrepositionVariant("local-accusative-neben-studentin",{id:"local-accusative-neben-studentin-ich",promptText:"Ich setze mich ___, weil noch ein Platz frei ist.",example:"Ich setze mich neben die Studentin, weil noch ein Platz frei ist.",exampleTranslation:"Я сідаю біля студентки, бо ще є вільне місце.",explanation:"Wohin? указує на напрямок, тому neben вимагає Akkusativ: die Studentin → die Studentin."}),
  localPrepositionVariant("local-accusative-neben-studentin",{id:"local-accusative-neben-studentin-junge",promptText:"Der Junge setzt sich ___.",example:"Der Junge setzt sich schnell neben die Studentin.",exampleTranslation:"Хлопець швидко сідає біля студентки.",explanation:"Wohin? указує на напрямок, тому neben вимагає Akkusativ: die Studentin → die Studentin."}),
  localPrepositionVariant("local-accusative-zwischen-fenster",{id:"local-accusative-zwischen-fenster-blume",promptText:"Der Schüler hängt das neue Bild ___.",example:"Der Schüler hängt das neue Bild zwischen die Fenster.",exampleTranslation:"Учень вішає нову картину між вікна.",explanation:"Wohin? указує на напрямок, тому zwischen вимагає Akkusativ множини: die Fenster → die Fenster."}),
  localPrepositionVariant("local-accusative-zwischen-fenster",{id:"local-accusative-zwischen-fenster-girlande",promptText:"Wir hängen das große Plakat ___.",example:"Wir hängen das große Plakat zwischen die Fenster.",exampleTranslation:"Ми вішаємо великий плакат між вікна.",explanation:"Wohin? указує на напрямок, тому zwischen вимагає Akkusativ множини: die Fenster → die Fenster."})
];
const localPrepositionsContrastPracticeOnlyCards=[
  localPrepositionVariant("local-contrast-vase",{id:"local-contrast-vase-teller",word:"Er legt den Teller auf den Tisch.",translation:"Він кладе тарілку на стіл.",gap:"auf den Tisch",gloss:"тарілка · стіл",example:"Er legt den Teller auf den Tisch, bevor er isst.",exampleTranslation:"Він кладе тарілку на стіл, перш ніж їсти.",explanation:"Legen відповідає на Wohin?, тому auf вимагає Akkusativ: auf den Tisch."}),
  localPrepositionVariant("local-contrast-vase",{id:"local-contrast-vase-glas",word:"Sie stellt das Glas auf den Tisch.",translation:"Вона ставить склянку на стіл.",gap:"auf den Tisch",gloss:"склянка · стіл",example:"Sie stellt das Glas auf den Tisch und trinkt.",exampleTranslation:"Вона ставить склянку на стіл і п’є.",explanation:"Stellen відповідає на Wohin?, тому auf вимагає Akkusativ: auf den Tisch."}),
  localPrepositionVariant("local-contrast-vase-position",{id:"local-contrast-vase-position-geschirr",word:"Das Geschirr steht noch auf dem Tisch.",translation:"Посуд ще стоїть на столі.",gap:"auf dem Tisch",gloss:"посуд · стіл",example:"Das Geschirr steht noch auf dem Tisch, aber es ist schon gespült.",exampleTranslation:"Посуд ще стоїть на столі, але він уже помитий.",explanation:"Stehen відповідає на Wo?, тому auf вимагає Dativ: auf dem Tisch."}),
  localPrepositionVariant("local-contrast-vase-position",{id:"local-contrast-vase-position-schultasche",word:"Die Blumen stehen auf dem Tisch.",translation:"Квіти стоять на столі.",gap:"auf dem Tisch",gloss:"квіти · стіл",example:"Die Blumen stehen auf dem Tisch und duften.",exampleTranslation:"Квіти стоять на столі й пахнуть.",explanation:"Stehen відповідає на Wo?, тому auf вимагає Dativ: auf dem Tisch."}),
  localPrepositionVariant("local-contrast-picture",{id:"local-contrast-picture-plakate",word:"Die Schülerin hängt die Plakate an die Wand.",translation:"Учениця вішає плакати на стіну.",gap:"an die Wand",gloss:"плакати · стіна",example:"Die Schülerin hängt die Plakate an die Wand und lächelt.",exampleTranslation:"Учениця вішає плакати на стіну і посміхається.",explanation:"Hängen тут описує переміщення на стіну, тому an вимагає Akkusativ."}),
  localPrepositionVariant("local-contrast-picture",{id:"local-contrast-picture-karte",word:"Wir hängen die Karte an die Wand.",translation:"Ми вішаємо карту на стіну.",gap:"an die Wand",gloss:"карта · стіна",example:"Wir hängen die Karte an die Wand, weil sie schön ist.",exampleTranslation:"Ми вішаємо карту на стіну, бо вона гарна.",explanation:"Hängen тут описує переміщення на стіну, тому an вимагає Akkusativ."}),
  localPrepositionVariant("local-contrast-picture-position",{id:"local-contrast-picture-position-plakate",word:"Die Plakate hängen an der Wand.",translation:"Плакати висять на стіні.",gap:"an der Wand",gloss:"плакати · стіна",example:"Die Plakate hängen an der Wand im Klassenzimmer.",exampleTranslation:"Плакати висять на стіні в класі.",explanation:"Hängen тут описує нерухоме розташування, тому an вимагає Dativ."}),
  localPrepositionVariant("local-contrast-picture-position",{id:"local-contrast-picture-position-tafel",word:"Die Tafel hängt an der Wand.",translation:"Дошка висить на стіні.",gap:"an der Wand",gloss:"дошка · стіна",example:"Die Tafel hängt an der Wand, direkt neben der Tür.",exampleTranslation:"Дошка висить на стіні, прямо біля дверей.",explanation:"Hängen тут описує нерухоме розташування, тому an вимагає Dativ."}),
  localPrepositionVariant("local-contrast-key",{id:"local-contrast-key-geld",word:"Ich stecke den Schlüssel in die Tasche.",translation:"Я кладу ключ у сумку.",gap:"in die Tasche",gloss:"ключ · сумка",example:"Ich stecke den Schlüssel in die Tasche, damit ich ihn nicht verliere.",exampleTranslation:"Я кладу ключ у сумку, щоб його не загубити.",explanation:"Stecken відповідає на Wohin?, тому in вимагає Akkusativ: in die Tasche."}),
  localPrepositionVariant("local-contrast-key",{id:"local-contrast-key-handy",word:"Er legt den Schlüssel in die Tasche.",translation:"Він кладе ключ у сумку.",gap:"in die Tasche",gloss:"ключ · сумка",example:"Er legt den Schlüssel in die Tasche, bevor er das Haus verlässt.",exampleTranslation:"Він кладе ключ у сумку, перш ніж вийти з дому.",explanation:"Legen відповідає на Wohin?, тому in вимагає Akkusativ: in die Tasche."}),
  localPrepositionVariant("local-contrast-key-position",{id:"local-contrast-key-position-brille",word:"Der Schlüssel liegt in der Tasche.",translation:"Ключ лежить у сумці.",gap:"in der Tasche",gloss:"ключ · сумка",example:"Der Schlüssel liegt in der Tasche, nicht auf dem Tisch.",exampleTranslation:"Ключ лежить у сумці, а не на столі.",explanation:"Liegen відповідає на Wo?, тому in вимагає Dativ: in der Tasche."}),
  localPrepositionVariant("local-contrast-key-position",{id:"local-contrast-key-position-handy",word:"Der Schlüssel ist noch in der Tasche.",translation:"Ключ ще в сумці.",gap:"in der Tasche",gloss:"ключ · сумка",example:"Der Schlüssel ist noch in der Tasche, nicht in der Küche.",exampleTranslation:"Ключ ще в сумці, а не на кухні.",explanation:"Sein відповідає на Wo?, тому in вимагає Dativ: in der Tasche."}),
  localPrepositionVariant("local-contrast-sofa",{id:"local-contrast-sofa-zusammen",word:"Wir setzen uns auf das Sofa.",translation:"Ми сідаємо на диван.",gap:"auf das Sofa",gloss:"диван",example:"Wir setzen uns auf das Sofa und sehen fern.",exampleTranslation:"Ми сідаємо на диван і дивимося телевізор.",explanation:"Sich setzen описує переміщення на сидіння, тому auf вимагає Akkusativ."}),
  localPrepositionVariant("local-contrast-sofa",{id:"local-contrast-sofa-hund",word:"Der Junge springt auf das Sofa.",translation:"Хлопець стрибає на диван.",gap:"auf das Sofa",gloss:"диван",example:"Der Junge springt auf das Sofa und lacht.",exampleTranslation:"Хлопець стрибає на диван і сміється.",explanation:"Springen описує рух на поверхню, тому auf вимагає Akkusativ."}),
  localPrepositionVariant("local-contrast-sofa-position",{id:"local-contrast-sofa-position-katze",word:"Die Oma sitzt auf dem Sofa.",translation:"Бабуся сидить на дивані.",gap:"auf dem Sofa",gloss:"диван",example:"Die Oma sitzt auf dem Sofa und strickt.",exampleTranslation:"Бабуся сидить на дивані й в’яже.",explanation:"Sitzen описує розташування, тому auf вимагає Dativ."}),
  localPrepositionVariant("local-contrast-sofa-position",{id:"local-contrast-sofa-position-wir",word:"Wir sitzen auf dem Sofa.",translation:"Ми сидимо на дивані.",gap:"auf dem Sofa",gloss:"диван",example:"Wir sitzen auf dem Sofa und essen Kuchen.",exampleTranslation:"Ми сидимо на дивані й їмо пиріг.",explanation:"Sitzen описує розташування, тому auf вимагає Dativ."})
];
const localPrepositionsDativePracticeCards=[...localPrepositionsDativeCards,...localPrepositionsDativePracticeOnlyCards];
const localPrepositionsAccusativePracticeCards=[...localPrepositionsAccusativeCards,...localPrepositionsAccusativePracticeOnlyCards];
// Contrast practice is a cloze: the German verb decides the case of the place phrase, so the gap is that phrase.
// The Ukrainian cue names only the nouns, and the Wo?/Wohin? cue and motion arrow wait until Check (cueAfterCheck).
const contrastPracticeCloze=card=>({
  ...card,
  type:"cloze",
  promptText:card.word.replace(card.gap,"___"),
  practiceSupport:{label:"Значення",text:card.gloss},
  practiceVariants:false,
  cueAfterCheck:true,
  response:{mode:"text",scope:"phrase",accepted:[card.gap],caseSensitive:false,punctuationSensitive:false}
});
const localPrepositionsContrastPracticeCards=[...localPrepositionsContrastCards,...localPrepositionsContrastPracticeOnlyCards].map(contrastPracticeCloze);
const dativeVerbCards=[
  {
    id:"dative-antworten-recall",targetId:"dative-antworten",type:"recall",word:"antworten",translation:"відповідати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"відповідати (інфінітив)",response:{mode:"text",scope:"word",accepted:["antworten"],caseSensitive:false,punctuationSensitive:false},
    example:"Er antwortet dem Lehrer.",exampleTranslation:"Він відповідає вчителю.",
    explanation:"Antworten: відповідати комусь. Одержувач відповіді стоїть у Dativ: der Lehrer → dem Lehrer."
  },
  {
    id:"dative-antworten-cloze-ich",targetId:"dative-antworten",type:"cloze",word:"antworten",translation:"відповідати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Ich ___ dir morgen.",support:"Я відповім тобі завтра.",
    response:{mode:"text",scope:"word",accepted:["antworte"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich antworte dir morgen.",exampleTranslation:"Я відповім тобі завтра.",
    explanation:"З ich: antworte. Відповідати тобі: dir, а не dich."
  },
  {
    id:"dative-antworten-cloze-wir",targetId:"dative-antworten",type:"cloze",word:"antworten",translation:"відповідати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ der Lehrerin.",support:"Ми відповідаємо вчительці.",
    response:{mode:"text",scope:"word",accepted:["antworten"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir antworten der Lehrerin.",exampleTranslation:"Ми відповідаємо вчительці.",
    explanation:"З wir: antworten. Die Lehrerin у Dativ стає der Lehrerin."
  },
  {
    id:"dative-danken-recall",targetId:"dative-danken",type:"recall",word:"danken",translation:"дякувати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"дякувати (інфінітив)",response:{mode:"text",scope:"word",accepted:["danken"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich danke dir.",exampleTranslation:"Я дякую тобі.",
    explanation:"Danken: дякувати комусь. Людина стоїть у Dativ: dir, а не dich."
  },
  {
    id:"dative-danken-cloze-wir",targetId:"dative-danken",type:"cloze",word:"danken",translation:"дякувати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ euch für die Hilfe.",support:"Ми дякуємо вам за допомогу.",
    response:{mode:"text",scope:"word",accepted:["danken"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir danken euch für die Hilfe.",exampleTranslation:"Ми дякуємо вам за допомогу.",
    explanation:"З wir: danken. Кому дякуємо? Euch. За що? Für die Hilfe."
  },
  {
    id:"dative-danken-cloze-du",targetId:"dative-danken",type:"cloze",word:"danken",translation:"дякувати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Du ___ deiner Mutter.",support:"Ти дякуєш своїй мамі.",
    response:{mode:"text",scope:"word",accepted:["dankst"],caseSensitive:false,punctuationSensitive:false},
    example:"Du dankst deiner Mutter.",exampleTranslation:"Ти дякуєш своїй мамі.",
    explanation:"З du: dankst. Deine Mutter у Dativ стає deiner Mutter."
  },
  {
    id:"dative-fehlen-recall",targetId:"dative-fehlen",type:"recall",word:"fehlen",translation:"бракувати; не вистачати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"бракувати, не вистачати (інфінітив)",response:{mode:"text",scope:"word",accepted:["fehlen"],caseSensitive:false,punctuationSensitive:false},
    example:"Sie fehlt mir.",exampleTranslation:"Мені її бракує.",
    explanation:"Те або той, кого бракує, є підметом. Кому бракує? Mir. Fehlen також уживають, коли сумують за людиною."
  },
  {
    id:"dative-fehlen-cloze-geld",targetId:"dative-fehlen",type:"cloze",word:"fehlen",translation:"бракувати; не вистачати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Mir ___ das Geld.",support:"Мені бракує грошей.",
    response:{mode:"text",scope:"word",accepted:["fehlt"],caseSensitive:false,punctuationSensitive:false},
    example:"Mir fehlt das Geld.",exampleTranslation:"Мені бракує грошей.",
    explanation:"Das Geld — підмет в однині, тому fehlt. Mir показує, кому бракує грошей."
  },
  {
    id:"dative-fehlen-cloze-freunde",targetId:"dative-fehlen",type:"cloze",word:"fehlen",translation:"бракувати; не вистачати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Meine Freunde ___ mir.",support:"Мені бракує моїх друзів.",
    response:{mode:"text",scope:"word",accepted:["fehlen"],caseSensitive:false,punctuationSensitive:false},
    example:"Meine Freunde fehlen mir.",exampleTranslation:"Мені бракує моїх друзів.",
    explanation:"Meine Freunde — підмет у множині, тому fehlen. Людина, яка сумує, стоїть у Dativ: mir."
  },
  {
    id:"dative-gefallen-recall",targetId:"dative-gefallen",type:"recall",word:"gefallen",translation:"подобатися",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"подобатися (інфінітив)",response:{mode:"text",scope:"word",accepted:["gefallen"],caseSensitive:false,punctuationSensitive:false},
    example:"Gefällt dir mein Hemd?",exampleTranslation:"Тобі подобається моя сорочка?",
    explanation:"Те, що подобається, є підметом. Людина стоїть у Dativ. Однина: gefällt; множина: gefallen."
  },
  {
    id:"dative-gefallen-cloze-buch",targetId:"dative-gefallen",type:"cloze",word:"gefallen",translation:"подобатися",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Das Buch ___ mir.",support:"Мені подобається ця книга.",
    response:{mode:"text",scope:"word",accepted:["gefällt"],caseSensitive:false,punctuationSensitive:false},
    example:"Das Buch gefällt mir.",exampleTranslation:"Мені подобається ця книга.",
    explanation:"Das Buch — однина, тому gefällt зі зміною a → ä. Кому подобається? Mir."
  },
  {
    id:"dative-gefallen-cloze-schuhe",targetId:"dative-gefallen",type:"cloze",word:"gefallen",translation:"подобатися",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"___ dir die Schuhe?",support:"Тобі подобаються ці туфлі?",
    response:{mode:"text",scope:"word",accepted:["gefallen"],caseSensitive:false,punctuationSensitive:false},
    example:"Gefallen dir die Schuhe?",exampleTranslation:"Тобі подобаються ці туфлі?",
    explanation:"Die Schuhe — множина, тому gefallen без зміни голосного. Питання починається з дієслова."
  },
  {
    id:"dative-gehoeren-recall",targetId:"dative-gehoeren",type:"recall",word:"gehören",translation:"належати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"належати (інфінітив)",response:{mode:"text",scope:"word",accepted:["gehören"],caseSensitive:false,punctuationSensitive:false},
    example:"Das Haus gehört meiner Mutter.",exampleTranslation:"Цей будинок належить моїй мамі.",
    explanation:"Gehören: належати комусь. Власник стоїть у Dativ: meiner Mutter."
  },
  {
    id:"dative-gehoeren-cloze-tasche",targetId:"dative-gehoeren",type:"cloze",word:"gehören",translation:"належати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Tasche ___ mir.",support:"Ця сумка належить мені.",
    response:{mode:"text",scope:"word",accepted:["gehört"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Tasche gehört mir.",exampleTranslation:"Ця сумка належить мені.",
    explanation:"Die Tasche — однина, тому gehört. Кому належить? Mir, а не mich."
  },
  {
    id:"dative-gehoeren-cloze-buecher",targetId:"dative-gehoeren",type:"cloze",word:"gehören",translation:"належати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Bücher ___ uns.",support:"Ці книги належать нам.",
    response:{mode:"text",scope:"word",accepted:["gehören"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Bücher gehören uns.",exampleTranslation:"Ці книги належать нам.",
    explanation:"Die Bücher — множина, тому gehören. Uns позначає власників у Dativ."
  },
  {
    id:"dative-glauben-recall",targetId:"dative-glauben",type:"recall",word:"glauben",translation:"вірити",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"вірити комусь (інфінітив)",response:{mode:"text",scope:"word",accepted:["glauben"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich glaube keinem Wort von dir.",exampleTranslation:"Я не вірю жодному твоєму слову.",
    explanation:"Glauben у значенні «вірити комусь» керує Dativ. Das Wort → keinem Wort."
  },
  {
    id:"dative-glauben-cloze-ich",targetId:"dative-glauben",type:"cloze",word:"glauben",translation:"вірити",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Ich ___ dir.",support:"Я вірю тобі.",
    response:{mode:"text",scope:"word",accepted:["glaube"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich glaube dir.",exampleTranslation:"Я вірю тобі.",
    explanation:"З ich: glaube. Glauben + Dativ: dir. Це не те саме, що glauben an + Akkusativ."
  },
  {
    id:"dative-glauben-cloze-du",targetId:"dative-glauben",type:"cloze",word:"glauben",translation:"вірити",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"___ du dem Kind?",support:"Ти віриш цій дитині?",
    response:{mode:"text",scope:"word",accepted:["glaubst"],caseSensitive:false,punctuationSensitive:false},
    example:"Glaubst du dem Kind?",exampleTranslation:"Ти віриш цій дитині?",
    explanation:"З du: glaubst. Das Kind у Dativ стає dem Kind."
  },
  {
    id:"dative-gratulieren-recall",targetId:"dative-gratulieren",type:"recall",word:"gratulieren",translation:"вітати з нагоди",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"вітати когось із днем народження або іншою подією (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["gratulieren"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich gratuliere dir zu deinem Geburtstag.",exampleTranslation:"Я вітаю тебе з днем народження.",
    explanation:"Jemandem zu etwas gratulieren: людина і подія після zu стоять у Dativ: dir, zu deinem Geburtstag."
  },
  {
    id:"dative-gratulieren-cloze-wir",targetId:"dative-gratulieren",type:"cloze",word:"gratulieren",translation:"вітати з нагоди",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ unserer Mutter zum Geburtstag.",support:"Ми вітаємо нашу маму з днем народження.",
    response:{mode:"text",scope:"word",accepted:["gratulieren"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir gratulieren unserer Mutter zum Geburtstag.",exampleTranslation:"Ми вітаємо нашу маму з днем народження.",
    explanation:"З wir: gratulieren. Кого вітаємо? Unserer Mutter у Dativ. Zum = zu dem."
  },
  {
    id:"dative-gratulieren-cloze-du",targetId:"dative-gratulieren",type:"cloze",word:"gratulieren",translation:"вітати з нагоди",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Du ___ ihm zur bestandenen Prüfung.",support:"Ти вітаєш його з успішним складанням іспиту.",
    response:{mode:"text",scope:"word",accepted:["gratulierst"],caseSensitive:false,punctuationSensitive:false},
    example:"Du gratulierst ihm zur bestandenen Prüfung.",exampleTranslation:"Ти вітаєш його з успішним складанням іспиту.",
    explanation:"З du: gratulierst. Людина: ihm. Подія: zur bestandenen Prüfung; zur = zu der."
  },
  {
    id:"dative-helfen-recall",targetId:"dative-helfen",type:"recall",word:"helfen",translation:"допомагати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"допомагати (інфінітив)",response:{mode:"text",scope:"word",accepted:["helfen"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir helfen alten Leuten.",exampleTranslation:"Ми допомагаємо літнім людям.",
    explanation:"Helfen керує Dativ. У множині: alten Leuten. З du та er/sie/es основа змінюється: hilfst, hilft."
  },
  {
    id:"dative-helfen-cloze-du",targetId:"dative-helfen",type:"cloze",word:"helfen",translation:"допомагати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"___ du mir?",support:"Ти допоможеш мені?",
    response:{mode:"text",scope:"word",accepted:["hilfst"],caseSensitive:false,punctuationSensitive:false},
    example:"Hilfst du mir?",exampleTranslation:"Ти допоможеш мені?",
    explanation:"З du: hilfst зі зміною e → i. Кому допомагаєш? Mir, а не mich."
  },
  {
    id:"dative-helfen-cloze-er",targetId:"dative-helfen",type:"cloze",word:"helfen",translation:"допомагати",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Er ___ seiner Schwester.",support:"Він допомагає своїй сестрі.",
    response:{mode:"text",scope:"word",accepted:["hilft"],caseSensitive:false,punctuationSensitive:false},
    example:"Er hilft seiner Schwester.",exampleTranslation:"Він допомагає своїй сестрі.",
    explanation:"З er: hilft. Seine Schwester у Dativ стає seiner Schwester."
  },
  {
    id:"dative-wehtun-recall",targetId:"dative-wehtun",type:"recall",word:"wehtun",translation:"боліти; завдавати болю",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"боліти, завдавати болю (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["wehtun","weh tun"],caseSensitive:false,punctuationSensitive:false},
    example:"Was tut dir weh?",exampleTranslation:"Що в тебе болить?",
    explanation:"Wehtun (також weh tun) у головному реченні розділяється: tut ... weh. Кому болить? Dir."
  },
  {
    id:"dative-wehtun-cloze-kopf",targetId:"dative-wehtun",type:"cloze",word:"wehtun",translation:"боліти; завдавати болю",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Mein Kopf ___ mir weh.",support:"У мене болить голова.",
    response:{mode:"text",scope:"word",accepted:["tut"],caseSensitive:false,punctuationSensitive:false},
    example:"Mein Kopf tut mir weh.",exampleTranslation:"У мене болить голова.",
    explanation:"Mein Kopf — однина, тому tut. Weh уже стоїть у кінці речення; впишіть лише tut."
  },
  {
    id:"dative-wehtun-cloze-fuesse",targetId:"dative-wehtun",type:"cloze",word:"wehtun",translation:"боліти; завдавати болю",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Meine Füße ___ mir weh.",support:"У мене болять ноги.",
    response:{mode:"text",scope:"word",accepted:["tun"],caseSensitive:false,punctuationSensitive:false},
    example:"Meine Füße tun mir weh.",exampleTranslation:"У мене болять ноги.",
    explanation:"Meine Füße — множина, тому tun. Людина стоїть у Dativ: mir."
  },
  {
    id:"dative-erlauben-recall",targetId:"dative-erlauben",type:"recall",word:"erlauben",translation:"дозволяти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"дозволяти (інфінітив)",response:{mode:"text",scope:"word",accepted:["erlauben"],caseSensitive:false,punctuationSensitive:false},
    example:"Sie erlaubt mir nicht, hier zu rauchen.",exampleTranslation:"Вона не дозволяє мені тут курити.",
    explanation:"Erlauben: дозволяти комусь щось. Людина стоїть у Dativ; перед інфінітивом потрібне zu: mir, zu rauchen."
  },
  {
    id:"dative-erlauben-cloze-wir",targetId:"dative-erlauben",type:"cloze",word:"erlauben",translation:"дозволяти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ dir, hier zu spielen.",support:"Ми дозволяємо тобі тут гратися.",
    response:{mode:"text",scope:"word",accepted:["erlauben"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir erlauben dir, hier zu spielen.",exampleTranslation:"Ми дозволяємо тобі тут гратися.",
    explanation:"З wir: erlauben. Кому дозволяємо? Dir. Дія оформлюється як zu spielen."
  },
  {
    id:"dative-erlauben-cloze-vater",targetId:"dative-erlauben",type:"cloze",word:"erlauben",translation:"дозволяти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Mein Vater ___ mir, das Auto zu nehmen.",support:"Мій батько дозволяє мені взяти автомобіль.",
    response:{mode:"text",scope:"word",accepted:["erlaubt"],caseSensitive:false,punctuationSensitive:false},
    example:"Mein Vater erlaubt mir, das Auto zu nehmen.",exampleTranslation:"Мій батько дозволяє мені взяти автомобіль.",
    explanation:"Mein Vater — третя особа однини, тому erlaubt. Mir — Dativ; інфінітив: zu nehmen."
  },
  {
    id:"dative-folgen-recall",targetId:"dative-folgen",type:"recall",word:"folgen",translation:"слідувати; стежити за",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"слідувати за кимось, стежити за новинами (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["folgen"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich folge den aktuellen Nachrichten.",exampleTranslation:"Я стежу за актуальними новинами.",
    explanation:"Folgen керує Dativ без додаткового прийменника: den aktuellen Nachrichten."
  },
  {
    id:"dative-folgen-cloze-wir",targetId:"dative-folgen",type:"cloze",word:"folgen",translation:"слідувати; стежити за",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ dem Lehrer.",support:"Ми йдемо слідом за вчителем.",
    response:{mode:"text",scope:"word",accepted:["folgen"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir folgen dem Lehrer.",exampleTranslation:"Ми йдемо слідом за вчителем.",
    explanation:"З wir: folgen. Der Lehrer у Dativ стає dem Lehrer."
  },
  {
    id:"dative-folgen-cloze-du",targetId:"dative-folgen",type:"cloze",word:"folgen",translation:"слідувати; стежити за",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"___ du mir?",support:"Ти йдеш слідом за мною?",
    response:{mode:"text",scope:"word",accepted:["folgst"],caseSensitive:false,punctuationSensitive:false},
    example:"Folgst du mir?",exampleTranslation:"Ти йдеш слідом за мною?",
    explanation:"З du: folgst. Українське «за мною» тут передається німецьким Dativ mir без прийменника."
  },
  {
    id:"dative-passen-recall",targetId:"dative-passen",type:"recall",word:"passen",translation:"пасувати; підходити за розміром",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"пасувати, підходити комусь за розміром (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["passen"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Bluse passt ihr sehr gut.",exampleTranslation:"Ця блузка їй дуже добре підходить.",
    explanation:"Passen описує, чи підходить річ людині, зокрема за розміром. Людина стоїть у Dativ: ihr."
  },
  {
    id:"dative-passen-cloze-jacke",targetId:"dative-passen",type:"cloze",word:"passen",translation:"пасувати; підходити за розміром",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Jacke ___ mir nicht.",support:"Ця куртка не підходить мені за розміром.",
    response:{mode:"text",scope:"word",accepted:["passt"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Jacke passt mir nicht.",exampleTranslation:"Ця куртка не підходить мені за розміром.",
    explanation:"Die Jacke — однина, тому passt. Кому не підходить? Mir."
  },
  {
    id:"dative-passen-cloze-schuhe",targetId:"dative-passen",type:"cloze",word:"passen",translation:"пасувати; підходити за розміром",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"___ dir die Schuhe?",support:"Ці туфлі підходять тобі за розміром?",
    response:{mode:"text",scope:"word",accepted:["passen"],caseSensitive:false,punctuationSensitive:false},
    example:"Passen dir die Schuhe?",exampleTranslation:"Ці туфлі підходять тобі за розміром?",
    explanation:"Die Schuhe — множина, тому passen. Dir — Dativ людини, яка приміряє взуття."
  },
  {
    id:"dative-vertrauen-recall",targetId:"dative-vertrauen",type:"recall",word:"vertrauen",translation:"довіряти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"довіряти (інфінітив)",response:{mode:"text",scope:"word",accepted:["vertrauen"],caseSensitive:false,punctuationSensitive:false},
    example:"Diesem Mann vertraue ich nicht.",exampleTranslation:"Цьому чоловікові я не довіряю.",
    explanation:"Vertrauen керує Dativ: diesem Mann. Навіть коли додаток стоїть першим, дієслово залишається на другому місці."
  },
  {
    id:"dative-vertrauen-cloze-ich",targetId:"dative-vertrauen",type:"cloze",word:"vertrauen",translation:"довіряти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Ich ___ meiner Freundin.",support:"Я довіряю своїй подрузі.",
    response:{mode:"text",scope:"word",accepted:["vertraue"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich vertraue meiner Freundin.",exampleTranslation:"Я довіряю своїй подрузі.",
    explanation:"З ich: vertraue. Meine Freundin у Dativ стає meiner Freundin."
  },
  {
    id:"dative-vertrauen-cloze-wir",targetId:"dative-vertrauen",type:"cloze",word:"vertrauen",translation:"довіряти",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Wir ___ euch.",support:"Ми довіряємо вам.",
    response:{mode:"text",scope:"word",accepted:["vertrauen"],caseSensitive:false,punctuationSensitive:false},
    example:"Wir vertrauen euch.",exampleTranslation:"Ми довіряємо вам.",
    explanation:"З wir: vertrauen. Кому довіряємо? Euch у Dativ."
  },
  {
    id:"dative-schmecken-recall",targetId:"dative-schmecken",type:"recall",word:"schmecken",translation:"смакувати; подобатися на смак",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"смакувати, подобатися на смак (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["schmecken"],caseSensitive:false,punctuationSensitive:false},
    example:"Schmeckt euch das Essen?",exampleTranslation:"Вам смакує ця їжа?",
    explanation:"Їжа є підметом, а людина стоїть у Dativ: euch. Das Essen — однина, тому schmeckt."
  },
  {
    id:"dative-schmecken-cloze-suppe",targetId:"dative-schmecken",type:"cloze",word:"schmecken",translation:"смакувати; подобатися на смак",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Suppe ___ mir gut.",support:"Цей суп мені смакує.",
    response:{mode:"text",scope:"word",accepted:["schmeckt"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Suppe schmeckt mir gut.",exampleTranslation:"Цей суп мені смакує.",
    explanation:"Die Suppe — однина, тому schmeckt. Кому смакує? Mir."
  },
  {
    id:"dative-schmecken-cloze-aepfel",targetId:"dative-schmecken",type:"cloze",word:"schmecken",translation:"смакувати; подобатися на смак",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Äpfel ___ uns.",support:"Ці яблука нам смакують.",
    response:{mode:"text",scope:"word",accepted:["schmecken"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Äpfel schmecken uns.",exampleTranslation:"Ці яблука нам смакують.",
    explanation:"Die Äpfel — множина, тому schmecken. Uns показує, кому смакують яблука."
  },
  {
    id:"dative-widersprechen-recall",targetId:"dative-widersprechen",type:"recall",word:"widersprechen",translation:"суперечити; заперечувати комусь",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"суперечити, заперечувати комусь (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["widersprechen"],caseSensitive:false,punctuationSensitive:false},
    example:"Der Sohn widerspricht seiner Mutter.",exampleTranslation:"Син суперечить своїй мамі.",
    explanation:"Widersprechen керує Dativ: seiner Mutter. Дієслово не розділяється; e → i у du та er/sie/es."
  },
  {
    id:"dative-widersprechen-cloze-ich",targetId:"dative-widersprechen",type:"cloze",word:"widersprechen",translation:"суперечити; заперечувати комусь",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Ich ___ dir nicht.",support:"Я не суперечу тобі.",
    response:{mode:"text",scope:"word",accepted:["widerspreche"],caseSensitive:false,punctuationSensitive:false},
    example:"Ich widerspreche dir nicht.",exampleTranslation:"Я не суперечу тобі.",
    explanation:"З ich: widerspreche без зміни голосного. Кому суперечимо? Dir."
  },
  {
    id:"dative-widersprechen-cloze-du",targetId:"dative-widersprechen",type:"cloze",word:"widersprechen",translation:"суперечити; заперечувати комусь",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Warum ___ du dem Lehrer?",support:"Чому ти суперечиш учителю?",
    response:{mode:"text",scope:"word",accepted:["widersprichst"],caseSensitive:false,punctuationSensitive:false},
    example:"Warum widersprichst du dem Lehrer?",exampleTranslation:"Чому ти суперечиш учителю?",
    explanation:"З du: widersprichst зі зміною e → i. Der Lehrer → dem Lehrer."
  },
  {
    id:"dative-auffallen-recall",targetId:"dative-auffallen",type:"recall",word:"auffallen",translation:"привертати увагу; впадати в око",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"привертати увагу, впадати в око (інфінітив)",
    response:{mode:"text",scope:"word",accepted:["auffallen"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Dame fällt ihm auf.",exampleTranslation:"Ця пані привертає його увагу.",
    explanation:"Auffallen — відокремлюване дієслово: fällt ... auf. Людина, яка помічає, стоїть у Dativ: ihm."
  },
  {
    id:"dative-auffallen-cloze-fehler",targetId:"dative-auffallen",type:"cloze",word:"auffallen",translation:"привертати увагу; впадати в око",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Der Fehler ___ mir sofort auf.",support:"Ця помилка відразу впадає мені в око.",
    response:{mode:"text",scope:"word",accepted:["fällt"],caseSensitive:false,punctuationSensitive:false},
    example:"Der Fehler fällt mir sofort auf.",exampleTranslation:"Ця помилка відразу впадає мені в око.",
    explanation:"Der Fehler — однина, тому fällt зі зміною a → ä. Auf уже стоїть у кінці; впишіть лише fällt."
  },
  {
    id:"dative-auffallen-cloze-blumen",targetId:"dative-auffallen",type:"cloze",word:"auffallen",translation:"привертати увагу; впадати в око",category:"VERBEN MIT DATIV",practiceVariants:false,
    promptText:"Die Blumen ___ ihr auf.",support:"Ці квіти привертають її увагу.",
    response:{mode:"text",scope:"word",accepted:["fallen"],caseSensitive:false,punctuationSensitive:false},
    example:"Die Blumen fallen ihr auf.",exampleTranslation:"Ці квіти привертають її увагу.",
    explanation:"Die Blumen — множина, тому fallen без умлаута. Кому впадають в око? Ihr."
  }
];
const lessonStep=(id,title,objective,cards,mode="learn",chapter="",phase="",progressId=id)=>({id,title,objective,cards,mode,chapter:chapter||title,phase:phase||(mode==="input"?"Практика":"Вивчення"),progressId});
const learnThenPractice=(id,title,objective,cards,chapter=title)=>[
  lessonStep(`${id}-learn`,`Вивчення: ${title}`,objective,cards,"learn",chapter,"Вивчення"),
  lessonStep(`${id}-recall`,`Практика: ${title}`,`Напишіть відповідь німецькою за українським значенням. ${objective}`,cards,"input",chapter,"Практика")
];
const splitIntoSteps=(id,title,objective,cards,size,mode="input",chapter=title)=>cards.reduce((steps,card,cardIndex)=>{
  const stepIndex=Math.floor(cardIndex/size);
  if(!steps[stepIndex])steps[stepIndex]=lessonStep(`${id}-${stepIndex+1}`,`${title} ${stepIndex+1}`,objective,[],mode,chapter,`Частина ${stepIndex+1}`);
  steps[stepIndex].cards.push(card);
  return steps;
},[]);
const wQuestionStages=[
  lessonStep("w-questions-learn","Вивчення питальних слів","Прочитайте кожне питальне слово з прикладом, а потім перевірте, як ви їх запам’ятали.",cards,"learn","Питальні слова","Вивчення","w-questions:learn"),
  lessonStep("w-questions-practice","Практика питальних слів","Пригадайте всі питальні слова в змішаному підході. Повторюйте набір, щоб краще розрізняти типи запитань.",cards,"input","Питальні слова","Практика","w-questions:practice")
];
const pronounStages=[
  lessonStep("pronouns-learn","Вивчення особових займенників","Прочитайте всі займенники однини, множини й ввічливого звертання, перш ніж перевіряти себе.",pronounCards,"learn","Особові займенники","Вивчення","pronouns:learn"),
  lessonStep("pronouns-practice","Практика особових займенників","Пригадайте займенники однини, множини й ввічливого звертання в одному змішаному етапі.",pronounCards,"input","Особові займенники","Практика","pronouns:practice")
];
const personalPronounCaseStages=[
  lessonStep("pronoun-cases-accusative-learn","Вивчення займенників в Akkusativ","Вивчіть форми всіх дев’яти займенників: після sehen, hören, besuchen, anrufen та für потрібен Akkusativ.",personalPronounAccusativeCards,"learn","Знахідний відмінок · Akkusativ","Вивчення"),
  lessonStep("pronoun-cases-accusative-practice","Практика займенників в Akkusativ","Введіть форму Akkusativ за вихідним займенником або доповніть речення. Розрізняйте sie (вона / вони) і Sie (Ви).",personalPronounAccusativeCards,"input","Знахідний відмінок · Akkusativ","Практика"),
  lessonStep("pronoun-cases-dative-learn","Вивчення займенників у Dativ","Вивчіть форми всіх дев’яти займенників: після helfen, danken і mit потрібен Dativ; з geben це форма одержувача.",personalPronounDativeCards,"learn","Давальний відмінок · Dativ","Вивчення"),
  lessonStep("pronoun-cases-dative-practice","Практика займенників у Dativ","Введіть форму Dativ за вихідним займенником або доповніть речення. Не плутайте їй, їм та ввічливе Вам.",personalPronounDativeCards,"input","Давальний відмінок · Dativ","Практика"),
  lessonStep("pronoun-cases-mixed-learn","Порівняння Akkusativ і Dativ","Порівняйте форми в контексті. Німецьке дієслово або прийменник визначає відмінок, а не український переклад.",personalPronounCaseCards,"learn","Akkusativ чи Dativ?","Вивчення"),
  {...lessonStep("pronoun-cases-mixed-practice","Практика обох відмінків","Спочатку визначте Akkusativ чи Dativ, потім введіть один займенник. Працюйте з усіма особами й ввічливим звертанням.",personalPronounMixedPracticeCards,"input","Akkusativ чи Dativ?","Практика"),categoryBeforeCheck:"PERSONALPRONOMEN"}
];
const possessiveStages=[
  ...learnThenPractice("possessives-stems","основи присвійних займенників","Визначте власника, перш ніж обирати mein, dein, sein, ihr, unser, euer, Ihr або ihr.",possessivePronounCards.slice(0,8),"Основи"),
  ...learnThenPractice("possessives-endings","присвійні закінчення","Зверніть увагу, як закінчення змінюється залежно від іменника в кожному прикладі.",possessivePronounCards.slice(8),"Закінчення")
];
// Each case is a closed four-target gender/number paradigm, so its passes contain four cards.
const possessiveCaseStages=[
  lessonStep("possessive-cases-accusative-learn","Вивчення присвійних артиклів в Akkusativ","Вивчіть чотири моделі: чоловічий рід -en, середній без закінчення, жіночий і множина -e.",possessiveAccusativeCards,"learn","Присвійні артиклі · Akkusativ","Вивчення"),
  lessonStep("possessive-cases-accusative-practice","Практика присвійних артиклів в Akkusativ","Доповніть речення одним присвійним артиклем. Власник визначає основу, а німецький рід або множина — закінчення.",possessiveAccusativeCards,"input","Присвійні артиклі · Akkusativ","Практика"),
  lessonStep("possessive-cases-dative-learn","Вивчення присвійних артиклів у Dativ","Вивчіть чотири моделі: чоловічий і середній рід -em, жіночий -er, множина -en. Зверніть увагу на -n в іменнику множини.",possessiveDativeCards,"learn","Присвійні артиклі · Dativ","Вивчення"),
  lessonStep("possessive-cases-dative-practice","Практика присвійних артиклів у Dativ","Доповніть речення одним присвійним артиклем. Після mit і bei, з helfen і danken та для одержувача з geben потрібен Dativ.",possessiveDativeCards,"input","Присвійні артиклі · Dativ","Практика"),
  lessonStep("possessive-cases-mixed-learn","Порівняння присвійних артиклів у двох відмінках","Порівняйте вісім моделей у контексті. Спочатку визначте відмінок за дієсловом або прийменником, потім власника й рід іменника.",possessiveMixedCards,"learn","Akkusativ чи Dativ?","Вивчення"),
  lessonStep("possessive-cases-mixed-practice","Змішана практика присвійних артиклів","Самостійно визначте Akkusativ чи Dativ та введіть один присвійний артикль. Розрізняйте euer з закінченням і ввічливе Ihr.",possessiveMixedCards,"input","Akkusativ чи Dativ?","Практика")
];
// Practice copies drop the noun line: its gender dot would reveal the article before Check.
const indefinitePracticeCards=cards=>{
  const targetIds=new Set(cards.map(card=>card.targetId));
  return [...cards,...indefinitePracticeExtraCards.filter(card=>targetIds.has(card.targetId))].map(({noun,...card})=>card);
};
const indefiniteArticleStages=[
  lessonStep("indefinite-nominative-learn","Вивчення ein у Nominativ","Вивчіть ein для чоловічого й середнього роду та eine для жіночого. У Nominativ закінчення в ein немає.",indefiniteNominativeCards,"learn","Називний відмінок · ein","Вивчення"),
  {...lessonStep("indefinite-nominative-practice","Практика ein у Nominativ","Доповніть речення ein або eine за родом іменника. Значення речення показує, що предмет є.",indefinitePracticeCards(indefiniteNominativeCards),"input","Називний відмінок · ein","Практика"),categoryBeforeCheck:"UNBESTIMMTER ARTIKEL · NOMINATIV"},
  lessonStep("indefinite-accusative-learn","Вивчення ein в Akkusativ","Вивчіть einen для чоловічого роду. Для середнього й жіночого роду ein і eine не змінюються.",indefiniteAccusativeCards,"learn","Знахідний відмінок · ein","Вивчення"),
  {...lessonStep("indefinite-accusative-practice","Практика ein в Akkusativ","Доповніть речення після haben, brauchen, kaufen, lesen і sehen. Прямий додаток стоїть в Akkusativ.",indefinitePracticeCards(indefiniteAccusativeCards),"input","Знахідний відмінок · ein","Практика"),categoryBeforeCheck:"UNBESTIMMTER ARTIKEL · AKKUSATIV"},
  lessonStep("indefinite-dative-learn","Вивчення ein у Dativ","Вивчіть einem для чоловічого й середнього роду та einer для жіночого. Після mit, helfen, zeigen і in (Wo?) стоїть Dativ.",indefiniteDativeCards,"learn","Давальний відмінок · ein","Вивчення"),
  {...lessonStep("indefinite-dative-practice","Практика ein у Dativ","Доповніть речення ein у Dativ. Визначте, кому щось дають або де це відбувається.",indefinitePracticeCards(indefiniteDativeCards),"input","Давальний відмінок · ein","Практика"),categoryBeforeCheck:"UNBESTIMMTER ARTIKEL · DATIV"},
  lessonStep("indefinite-negative-learn","Вивчення kein","Вивчіть kein у Nominativ, Akkusativ і Dativ: ті самі закінчення, що й у ein. У множині це keine або keinen.",[...negativeNominativeCards,...negativeAccusativeCards,...negativeDativeCards],"learn","Заперечний артикль · kein","Вивчення"),
  {...lessonStep("indefinite-negative-practice","Практика kein","Доповніть заперечне речення kein. Значення «немає» вказує на kein, а відмінок і число — на контекст речення.",indefinitePracticeCards([...negativeNominativeCards,...negativeAccusativeCards,...negativeDativeCards]),"input","Заперечний артикль · kein","Практика"),categoryBeforeCheck:"NEGATIVARTIKEL"},
  lessonStep("indefinite-mixed-learn","Порівняння ein і kein","Порівняйте ствердження з ein і заперечення з kein. Спочатку визначте, що каже речення, потім відмінок і рід іменника.",indefiniteArticleCards,"learn","Ein чи kein?","Вивчення"),
  {...lessonStep("indefinite-mixed-practice","Змішана практика ein і kein","Визначте, ствердження це чи заперечення, потім відмінок і рід. Введіть один артикль.",indefinitePracticeCards(indefiniteArticleCards),"input","Ein чи kein?","Практика"),categoryBeforeCheck:"UNBESTIMMTER ARTIKEL · NEGATIVARTIKEL"}
];
const seinStages=[
  lessonStep("sein-learn","Вивчення дієслова sein","Прочитайте всі шість форм теперішнього часу разом із займенниками, перш ніж перевіряти себе.",seinCards,"learn","Дієслово sein","Вивчення","sein:learn"),
  lessonStep("sein-practice","Практика дієслова sein","Пригадайте всі шість форм теперішнього часу в змішаному підході. Повторюйте набір для кращого запам’ятовування.",seinCards,"input","Дієслово sein","Практика","sein:practice")
];
const conjugationStages=[
  ...learnThenPractice("conjugation-regular","правильні закінчення","Дотримуйтеся схеми закінчень від ich до sie/Sie.",conjugationCards.slice(0,6),"Правильні закінчення"),
  ...learnThenPractice("conjugation-extra-e","правило додаткового -e","Додавайте e після основ на -t або -d.",conjugationCards.slice(6,15),"Додаткове -e"),
  ...learnThenPractice("conjugation-sibilants","основи на свистячі звуки","Уживайте -t замість -st після основ на -s, -ß або -z.",conjugationCards.slice(15),"Свистячі звуки")
];
const strongVerbStages=[
  lessonStep("strong-verbs-learn","Вивчення сильних дієслів","Прочитайте повні парадигми sprechen, fahren, treffen, lesen, essen, wissen і anfangen. Зверніть увагу на зміну голосного в однині.",strongVerbFormCards,"learn","Сильні дієслова","Вивчення"),
  lessonStep("strong-verbs-practice","Практика сильних дієслів","Введіть пропущену форму в змішаних реченнях для всіх семи дієслів. Для anfangen введіть дієслово й відокремлений префікс.",strongVerbPracticeCards,"input","Сильні дієслова","Практика")
];
const pastVerbStagesForLevel=(level,slug,formCards,practiceCards,legacyIds=false)=>{
  const a1=level==="A1";
  return [
    {...lessonStep(legacyIds?"past-verbs-learn":`past-verbs-${slug}-learn`,`Вивчення минулого часу · ${level}`,a1?"Вивчіть повсякденний Perfekt. Präteritum потрібен лише для sein і haben.":`Прочитайте інфінітив, теперішній час, Präteritum і Perfekt кожного дієслова рівня ${level}.`,formCards,"learn",`Минулий час · ${level}`,"Вивчення")},
    {...lessonStep(legacyIds?"past-verbs-practice":`past-verbs-${slug}-practice`,`Практика минулого часу · ${level}`,a1?"Введіть Perfekt; для sein і haben введіть Präteritum і Perfekt.":"Введіть Präteritum і Perfekt кожного дієслова через похилу риску.",practiceCards,"input",`Минулий час · ${level}`,"Практика")}
  ];
};
const pastVerbA1Stages=pastVerbStagesForLevel("A1","a1",pastVerbA1FormCards,pastVerbA1PracticeCards,true);
const pastVerbA2Stages=pastVerbStagesForLevel("A2","a2",pastVerbA2.formCards,pastVerbA2.practiceCards);
const pastVerbB1Stages=pastVerbStagesForLevel("B1","b1",pastVerbB1.formCards,pastVerbB1.practiceCards);
const perfektStages=[
  lessonStep("perfekt-frame-learn","Вивчіть рамку Perfekt","Відмінюване haben або sein стоїть на другому місці, а Partizip II — у кінці речення.",perfektFrameCards,"learn","Рамка речення","Вивчення"),
  lessonStep("perfekt-frame-practice","Побудуйте речення в Perfekt","Перекладіть українську підказку повним німецьким реченням із правильним допоміжним дієсловом.",perfektFrameCards,"input","Рамка речення","Практика"),
  lessonStep("perfekt-auxiliary-learn","Вивчіть: haben чи sein","Порівняйте чотири прості випадки: прямий додаток, звичайна дія, переміщення та зміна стану.",perfektAuxiliaryCards,"learn","Haben чи sein","Вивчення"),
  lessonStep("perfekt-auxiliary-practice","Оберіть haben або sein","Вставте правильну форму haben або sein. Коротка підказка допоможе визначити правило.",perfektAuxiliaryCards,"input","Haben чи sein","Практика"),
  lessonStep("perfekt-regular-learn","Вивчіть правильні Partizip II","Утворюйте правильні форми за схемою ge-…-t і ставте ge між відокремлюваним префіксом та основою.",perfektRegularCards,"learn","Правильні та відокремлювані","Вивчення"),
  lessonStep("perfekt-regular-practice","Потренуйте правильні форми","Напишіть Partizip II правильних дієслів і дієслів із відокремлюваними префіксами.",perfektRegularCards,"input","Правильні та відокремлювані","Практика"),
  lessonStep("perfekt-no-ge-learn","Дізнайтеся, коли зникає ge-","Дієслова з невідокремлюваними префіксами та дієслова на -ieren утворюють Partizip II без додаткового ge-.",perfektNoGeCards,"learn","Без ge-","Вивчення"),
  lessonStep("perfekt-no-ge-practice","Потренуйте форми без ge-","Напишіть Partizip II дієслів із невідокремлюваними префіксами та дієслів на -ieren.",perfektNoGeCards,"input","Без ge-","Практика"),
  lessonStep("perfekt-irregular-learn","Вивчіть неправильні форми","Запам’ятайте сильні та змішані дієприкметники, зокрема відокремлювані й невідокремлювані форми.",perfektIrregularCards,"learn","Неправильні форми","Вивчення"),
  lessonStep("perfekt-irregular-practice","Потренуйте неправильні Partizip II","Відновіть кожну неправильну форму Partizip II за інфінітивом і контекстом.",perfektIrregularCards,"input","Неправильні форми","Практика")
];
const presentClozeCards=presentPracticeCards.filter(card=>card.category==="CLOZE PRACTICE");
const presentTranslationCards=presentPracticeCards.filter(card=>card.category==="TRANSLATION PRACTICE");
const presentPracticeStages=[
  ...splitIntoSteps("present-form","Практика форм дієслів","Введіть лише пропущену форму дієслова; решта речення задає контекст.",presentClozeCards,9,"input","Форми дієслів"),
  ...splitIntoSteps("present-translate","Практика за українською підказкою","Використайте українське речення як контекст і введіть лише потрібну німецьку форму або форми дієслова.",presentTranslationCards,9,"input","Переклад")
];
const koennenClozeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · LÜCKENTEXT");
// The six form clozes run ich, du, wir, er, ihr, sie.
const koennenFormPracticeCards=withVerbParadigms(koennenClozeCards.slice(0,6),[koennenParadigm],[0,1,3,2,4,5]);
const koennenContextCards=koennenClozeCards.slice(6);
const koennenWordOrderPracticeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · SATZBILDUNG");
const studyCardsFromPractice=cards=>cards.map(({answer,answerTranslation,practiceType,...card})=>card);
const koennenStages=[
  lessonStep("koennen-forms-learn","Вивчення können","Прочитайте шість форм können разом із відповідними займенниками.",koennenFormCards,"learn","Форми können","Вивчення"),
  lessonStep("koennen-forms-practice","Практика шести форм können","Перевірте кожну пару займенника й форми, вводячи лише пропущену форму können.",koennenFormPracticeCards,"input","Форми können","Практика"),
  lessonStep("moegen-forms-learn","Вивчення mögen","Прочитайте шість форм mögen, щоб говорити про те, що вам подобається.",moegenFormCards,"learn","Форми mögen","Вивчення"),
  lessonStep("moegen-forms-practice","Практика шести форм mögen","Перевірте кожну пару займенника й форми, вводячи лише пропущену форму mögen.",moegenPracticeCards,"input","Форми mögen","Практика"),
  lessonStep("moechten-forms-learn","Вивчення möchten","Прочитайте шість форм möchten для ввічливого висловлення бажань.",moechtenFormCards,"learn","Форми möchten","Вивчення"),
  lessonStep("moechten-forms-practice","Практика шести форм möchten","Перевірте кожну пару займенника й форми, вводячи лише пропущену форму möchten.",moechtenPracticeCards,"input","Форми möchten","Практика"),
  lessonStep("moegen-moechten-compare-learn","Порівняння mögen і möchten","Порівняйте mögen для вподобань і möchten для ввічливих побажань.",moegenMoechtenComparisonCards,"learn","Mögen і möchten","Вивчення"),
  lessonStep("moegen-moechten-compare-practice","Вибір між mögen і möchten","Доповніть речення правильною формою: mag для вподобань або möchte для ввічливого побажання.",moegenMoechtenComparisonPracticeCards,"input","Mögen і möchten","Практика"),
  lessonStep("wollen-forms-learn","Вивчення wollen","Прочитайте шість форм wollen для вираження бажань і намірів.",wollenFormCards,"learn","Форми wollen","Вивчення"),
  lessonStep("wollen-forms-practice","Практика шести форм wollen","Перевірте кожну пару займенника й форми, вводячи лише пропущену форму wollen.",wollenPracticeCards,"input","Форми wollen","Практика"),
  lessonStep("koennen-order-learn","Вивчення порядку слів із модальними дієсловами","Порівняйте розповідні речення й обидва типи запитань, перш ніж будувати повні речення.",koennenWordOrderCards,"learn","Порядок слів","Вивчення"),
  lessonStep("koennen-order-practice","Практика речень із модальними дієсловами","Складіть повне речення з німецьких фрагментів. Поставте können на друге місце, а інфінітив — у кінець.",koennenWordOrderPracticeCards,"input","Порядок слів","Практика"),
  lessonStep("koennen-context-learn","Вивчення können у контексті","Прочитайте розповідні речення, запитання й короткі діалоги перед самостійним доповненням модального дієслова.",studyCardsFromPractice(koennenContextCards),"learn","Können у контексті","Вивчення"),
  lessonStep("koennen-context-practice","Практика können у контексті","Введіть лише пропущену форму können у довших реченнях і діалогах.",koennenContextCards,"input","Können у контексті","Практика"),
  lessonStep("wollen-order-learn","Вивчення порядку слів із wollen","Порівняйте розповідні речення й обидва типи запитань з wollen. Інфінітив завжди стоїть у кінці.",wollenWordOrderCards,"learn","Порядок слів з wollen","Вивчення"),
  lessonStep("wollen-order-practice","Практика речень із wollen","Складіть повне речення з німецьких фрагментів. Поставте wollen на друге місце, а інфінітив — у кінець.",wollenWordOrderPracticeCards,"input","Порядок слів з wollen","Практика")
];
const werdenParadigm=verbParadigm("werden","werd|e w[i]r|st w[i]rd| werd|en werd|et werd|en","e → i");
const werdenFormCard=({id,targetId,word,accepted,translation,example,exampleTranslation})=>({id,targetId,type:"recall",word,translation,category:"VERB · WERDEN",example,exampleTranslation,explanation:`${word} — форма werden: ${translation}.`,response:modalResponse(accepted,"phrase")});
const werdenFormCards=withVerbParadigms([
  werdenFormCard({id:"werden-ich-recall",targetId:"werden-ich",word:"ich werde",accepted:["ich werde"],translation:"я стаю / буду",example:"Ich werde Lehrer.",exampleTranslation:"Я стаю вчителем."}),
  werdenFormCard({id:"werden-du-recall",targetId:"werden-du",word:"du wirst",accepted:["du wirst"],translation:"ти стаєш",example:"Du wirst bald müde.",exampleTranslation:"Ти скоро втомишся."}),
  werdenFormCard({id:"werden-er-recall",targetId:"werden-er",word:"er / sie / es wird",accepted:["er wird","sie wird","es wird"],translation:"він / вона / воно стає",example:"Es wird kalt.",exampleTranslation:"Стає холодно."}),
  werdenFormCard({id:"werden-wir-recall",targetId:"werden-wir",word:"wir werden",accepted:["wir werden"],translation:"ми стаємо",example:"Wir werden Eltern.",exampleTranslation:"Ми стаємо батьками."}),
  werdenFormCard({id:"werden-ihr-recall",targetId:"werden-ihr",word:"ihr werdet",accepted:["ihr werdet"],translation:"ви стаєте",example:"Ihr werdet schnell müde.",exampleTranslation:"Ви швидко стомлюєтеся."}),
  werdenFormCard({id:"werden-sie-recall",targetId:"werden-sie",word:"sie / Sie werden",accepted:["sie werden"],translation:"вони стають / Ви стаєте",example:"Sie werden nächstes Jahr Großeltern.",exampleTranslation:"Вони наступного року стануть дідусем і бабусею."})
],[werdenParadigm]);
const werdenClozeCard=({id,targetId,word,translation,prompt,answer,answerTranslation,explanation})=>({id,targetId,type:"cloze",word,translation,category:"VERB · WERDEN · LÜCKENTEXT",prompt,example:prompt,exampleTranslation:"Доповни речення правильною формою werden.",answer,answerTranslation,explanation,practiceVariants:false,response:modalResponse([answer])});
const werdenPracticeCards=withVerbParadigms([
  werdenClozeCard({id:"werden-ich-cloze",targetId:"werden-ich",word:"Ich werde Lehrer.",translation:"Я стаю вчителем.",prompt:"Ich ___ Lehrer.",answer:"werde",answerTranslation:"стаю",explanation:"Для ich форма werden — werde."}),
  werdenClozeCard({id:"werden-du-cloze",targetId:"werden-du",word:"Du wirst bald müde.",translation:"Ти скоро втомишся.",prompt:"Du ___ bald müde.",answer:"wirst",answerTranslation:"стаєш",explanation:"Для du форма werden — wirst: e змінюється на i."}),
  werdenClozeCard({id:"werden-er-cloze",targetId:"werden-er",word:"Es wird kalt.",translation:"Стає холодно.",prompt:"Es ___ kalt.",answer:"wird",answerTranslation:"стає",explanation:"Для er/sie/es форма werden — wird, так само e змінюється на i."}),
  werdenClozeCard({id:"werden-wir-cloze",targetId:"werden-wir",word:"Wir werden Eltern.",translation:"Ми стаємо батьками.",prompt:"Wir ___ Eltern.",answer:"werden",answerTranslation:"стаємо",explanation:"Для wir форма werden — werden, основа не змінюється."}),
  werdenClozeCard({id:"werden-ihr-cloze",targetId:"werden-ihr",word:"Ihr werdet schnell müde.",translation:"Ви швидко стомлюєтеся.",prompt:"Ihr ___ schnell müde.",answer:"werdet",answerTranslation:"стаєте",explanation:"Для ihr форма werden — werdet."}),
  werdenClozeCard({id:"werden-sie-cloze",targetId:"werden-sie",word:"Sie werden nächstes Jahr Großeltern.",translation:"Вони наступного року стануть дідусем і бабусею.",prompt:"Sie ___ nächstes Jahr Großeltern.",answer:"werden",answerTranslation:"стануть",explanation:"Для sie/Sie форма werden — werden."}),
  werdenClozeCard({id:"werden-ich-cloze-warum",targetId:"werden-ich",word:"Warum werde ich so müde?",translation:"Чому я так втомлююся?",prompt:"Warum ___ ich so müde?",answer:"werde",answerTranslation:"втомлююся",explanation:"Для ich форма werden — werde. У питанні з Warum werde стоїть перед ich."}),
  werdenClozeCard({id:"werden-du-cloze-warum",targetId:"werden-du",word:"Warum wirst du so müde?",translation:"Чому ти так втомлюєшся?",prompt:"Warum ___ du so müde?",answer:"wirst",answerTranslation:"втомлюєшся",explanation:"Для du форма werden — wirst: e змінюється на i. У питанні wirst стоїть перед du."}),
  werdenClozeCard({id:"werden-er-cloze-warum",targetId:"werden-er",word:"Warum wird es so kalt?",translation:"Чому стає так холодно?",prompt:"Warum ___ es so kalt?",answer:"wird",answerTranslation:"стає",explanation:"Для es форма werden — wird: e змінюється на i. У питанні wird стоїть перед es."}),
  werdenClozeCard({id:"werden-wir-cloze-warum",targetId:"werden-wir",word:"Warum werden wir so schnell alt?",translation:"Чому ми так швидко старіємо?",prompt:"Warum ___ wir so schnell alt?",answer:"werden",answerTranslation:"старіємо",explanation:"Для wir форма werden — werden, основа не змінюється. У питанні werden стоїть перед wir."}),
  werdenClozeCard({id:"werden-ihr-cloze-warum",targetId:"werden-ihr",word:"Warum werdet ihr so müde?",translation:"Чому ви так втомлюєтеся?",prompt:"Warum ___ ihr so müde?",answer:"werdet",answerTranslation:"втомлюєтеся",explanation:"Для ihr форма werden — werdet. У питанні werdet стоїть перед ihr."}),
  werdenClozeCard({id:"werden-sie-cloze-warum",targetId:"werden-sie",word:"Warum werden Sie so müde?",translation:"Чому Ви так втомлюєтеся?",prompt:"Warum ___ Sie so müde?",answer:"werden",answerTranslation:"втомлюєтеся",explanation:"Для Sie (ввічливе «Ви») форма werden — werden, як і для sie (вони). Велике Sie всередині речення — ввічливе звертання."}),
  werdenClozeCard({id:"werden-ich-cloze-herbst",targetId:"werden-ich",word:"Ich werde im Herbst Student.",translation:"Восени я стану студентом.",prompt:"Ich ___ im Herbst Student.",answer:"werde",answerTranslation:"стану",explanation:"Для ich форма werden — werde. Після werden назва професії стоїть без артикля: Student."}),
  werdenClozeCard({id:"werden-du-cloze-vater",targetId:"werden-du",word:"Du wirst bald so groß wie dein Vater.",translation:"Ти скоро виростеш таким самим високим, як твій тато.",prompt:"Du ___ bald so groß wie dein Vater.",answer:"wirst",answerTranslation:"виростеш",explanation:"Для du форма werden — wirst. Werden з прикметником groß означає «рости», а порівняння з wie не змінює форму."}),
  werdenClozeCard({id:"werden-er-cloze-wetter",targetId:"werden-er",word:"Das Wetter wird morgen besser.",translation:"Завтра погода стане кращою.",prompt:"Das Wetter ___ morgen besser.",answer:"wird",answerTranslation:"стане",explanation:"Для das Wetter (однина) форма werden — wird: e змінюється на i."}),
  werdenClozeCard({id:"werden-wir-cloze-nachbarn",targetId:"werden-wir",word:"Wir werden bald Nachbarn.",translation:"Ми скоро станемо сусідами.",prompt:"Wir ___ bald Nachbarn.",answer:"werden",answerTranslation:"станемо",explanation:"Для wir форма werden — werden. Після werden іменник Nachbarn стоїть без артикля."}),
  werdenClozeCard({id:"werden-ihr-cloze-freunde",targetId:"werden-ihr",word:"Ihr werdet bald Freunde.",translation:"Ви скоро станете друзями.",prompt:"Ihr ___ bald Freunde.",answer:"werdet",answerTranslation:"станете",explanation:"Для ihr форма werden — werdet. Після werden іменник Freunde стоїть без артикля."}),
  werdenClozeCard({id:"werden-sie-cloze-kinder",targetId:"werden-sie",word:"Die Kinder werden bald groß.",translation:"Діти скоро виростуть.",prompt:"Die Kinder ___ bald groß.",answer:"werden",answerTranslation:"виростуть",explanation:"Для sie (вони) форма werden — werden. Множина Die Kinder вимагає werden, а не wird."})
],[werdenParadigm,werdenParadigm,werdenParadigm]);
const werdenUsageCard=({id,targetId,promptText,answer,translation,category,explanation})=>({id,targetId,type:"cloze",word:answer,promptText,support:translation,translation,example:promptText.replace("___",answer),explanation,category:`WERDEN · ${category}`,practiceVariants:false,response:modalResponse([answer])});
const werdenUsageCards=[
  werdenUsageCard({id:"werden-change-kalt",targetId:"werden-change",promptText:"Es ___ bald kalt.",answer:"wird",translation:"Незабаром стає холодно.",category:"VERÄNDERUNG",explanation:"Werden показує перехід у новий стан: Es wird kalt. Sein описує вже існуючий стан: Es ist kalt."}),
  werdenUsageCard({id:"werden-change-tage",targetId:"werden-change",promptText:"Die Tage ___ im Herbst kürzer.",answer:"werden",translation:"Восени дні стають коротшими.",category:"VERÄNDERUNG",explanation:"Множина Die Tage вимагає werden. Прикметник kürzer після werden без змін у кінці."}),
  werdenUsageCard({id:"werden-change-gross",targetId:"werden-change",promptText:"Meine Schwester ___ sehr schnell groß.",answer:"wird",translation:"Моя сестра дуже швидко росте.",category:"VERÄNDERUNG",explanation:"Groß werden означає «ставати більшим, дорослішати»: werden + прикметник."}),
  werdenUsageCard({id:"werden-role-lehrer",targetId:"werden-role",promptText:"Ich ___ bald Lehrer.",answer:"werde",translation:"Я скоро стану вчителем.",category:"BERUF",explanation:"Після werden назва професії стоїть без артикля: Lehrer, а не ein Lehrer."}),
  werdenUsageCard({id:"werden-role-arzt",targetId:"werden-role",promptText:"Mein Onkel ___ Arzt.",answer:"wird",translation:"Мій дядько стає лікарем.",category:"BERUF",explanation:"Arzt після werden — без артикля, як і інші професії."}),
  werdenUsageCard({id:"werden-role-eltern",targetId:"werden-role",promptText:"Wir ___ im Mai Eltern.",answer:"werden",translation:"Ми станемо батьками в травні.",category:"BERUF",explanation:"Eltern — множина без артикля після werden: Wir werden Eltern."}),
  werdenUsageCard({id:"werden-infinitive-musiker",targetId:"werden-infinitive",promptText:"Mein Bruder will Musiker ___.",answer:"werden",translation:"Мій брат хоче стати музикантом.",category:"INFINITIV",explanation:"Після модального will інфінітив werden стоїть в кінці речення: will Musiker werden."}),
  werdenUsageCard({id:"werden-infinitive-aerztin",targetId:"werden-infinitive",promptText:"Sie möchte später Ärztin ___.",answer:"werden",translation:"Вона хоче пізніше стати лікаркою.",category:"INFINITIV",explanation:"Möchte + werden: інфінітив werden стоїть в кінці речення."}),
  werdenUsageCard({id:"werden-infinitive-pilot",targetId:"werden-infinitive",promptText:"Du kannst Pilot ___.",answer:"werden",translation:"Ти можеш стати пілотом.",category:"INFINITIV",explanation:"Können + werden: werden — в інфінітиві наприкінці, а Pilot — без артикля."})
];
// Practice-only variants: the learn stage keeps werdenUsageCards, practice adds these to every target.
const werdenUsageExtraCards=[
  werdenUsageCard({id:"werden-change-wetter",targetId:"werden-change",promptText:"Im Frühling ___ es wärmer.",answer:"wird",translation:"Навесні стає тепліше.",category:"VERÄNDERUNG",explanation:"Es — однина, тому wird. Компаратив wärmer після werden показує поступову зміну погоди."}),
  werdenUsageCard({id:"werden-change-blaetter",targetId:"werden-change",promptText:"Die Blätter ___ im Herbst gelb.",answer:"werden",translation:"Восени листя жовтіє.",category:"VERÄNDERUNG",explanation:"Die Blätter — множина, тому werden. Прикметник gelb після werden без закінчення."}),
  werdenUsageCard({id:"werden-change-himmel",targetId:"werden-change",promptText:"Der Himmel ___ dunkel.",answer:"wird",translation:"Небо темніє.",category:"VERÄNDERUNG",explanation:"Der Himmel — однина, тому wird. Прикметник dunkel після werden без закінчення."}),
  werdenUsageCard({id:"werden-change-bruder",targetId:"werden-change",promptText:"Mein Bruder ___ schnell müde.",answer:"wird",translation:"Мій брат швидко втомлюється.",category:"VERÄNDERUNG",explanation:"Mein Bruder — однина, тому wird. Werden з müde означає зміну стану: втомлюватися."}),
  werdenUsageCard({id:"werden-change-preise",targetId:"werden-change",promptText:"Die Preise ___ jedes Jahr höher.",answer:"werden",translation:"Ціни щороку зростають.",category:"VERÄNDERUNG",explanation:"Die Preise — множина, тому werden. Компаратив höher після werden без закінчення."}),
  werdenUsageCard({id:"werden-change-milch",targetId:"werden-change",promptText:"Die Milch ___ schnell sauer.",answer:"wird",translation:"Молоко швидко скисає.",category:"VERÄNDERUNG",explanation:"Die Milch — однина, тому wird. Sauer werden означає «скисати»."}),
  werdenUsageCard({id:"werden-role-mutter",targetId:"werden-role",promptText:"Meine Mutter ___ Ärztin.",answer:"wird",translation:"Моя мама стає лікаркою.",category:"BERUF",explanation:"Meine Mutter — однина, тому wird. Після werden назва професії Ärztin стоїть без артикля."}),
  werdenUsageCard({id:"werden-role-ingenieur",targetId:"werden-role",promptText:"Du ___ Ingenieur.",answer:"wirst",translation:"Ти станеш інженером.",category:"BERUF",explanation:"Для du форма werden — wirst. Ingenieur після werden стоїть без артикля."}),
  werdenUsageCard({id:"werden-role-kinder",targetId:"werden-role",promptText:"Die Kinder ___ bald Schüler.",answer:"werden",translation:"Діти скоро стануть школярами.",category:"BERUF",explanation:"Die Kinder — множина, тому werden. Schüler після werden стоїть без артикля."}),
  werdenUsageCard({id:"werden-role-baeckerin",targetId:"werden-role",promptText:"Ich ___ Bäckerin.",answer:"werde",translation:"Я стану пекаркою.",category:"BERUF",explanation:"Для ich форма werden — werde. Bäckerin після werden без артикля; -in позначає жіночий варіант професії."}),
  werdenUsageCard({id:"werden-role-architekten",targetId:"werden-role",promptText:"Wir ___ Architekten.",answer:"werden",translation:"Ми станемо архітекторами.",category:"BERUF",explanation:"Для wir форма werden — werden. Architekten — множина без артикля після werden."}),
  werdenUsageCard({id:"werden-role-koch",targetId:"werden-role",promptText:"Er ___ Koch.",answer:"wird",translation:"Він стане кухарем.",category:"BERUF",explanation:"Для er форма werden — wird. Koch після werden стоїть без артикля."}),
  werdenUsageCard({id:"werden-infinitive-eltern",targetId:"werden-infinitive",promptText:"Wir wollen Eltern ___.",answer:"werden",translation:"Ми хочемо стати батьками.",category:"INFINITIV",explanation:"Після wollen інфінітив werden стоїть в кінці речення: wollen Eltern werden."}),
  werdenUsageCard({id:"werden-infinitive-arzt",targetId:"werden-infinitive",promptText:"Ich muss Arzt ___.",answer:"werden",translation:"Я мушу стати лікарем.",category:"INFINITIV",explanation:"Після muss інфінітив werden стоїть в кінці речення: muss Arzt werden."}),
  werdenUsageCard({id:"werden-infinitive-lehrer",targetId:"werden-infinitive",promptText:"Er soll Lehrer ___.",answer:"werden",translation:"Він має стати вчителем.",category:"INFINITIV",explanation:"Після soll інфінітив werden стоїть в кінці речення: soll Lehrer werden."}),
  werdenUsageCard({id:"werden-infinitive-darf",targetId:"werden-infinitive",promptText:"Du darfst Ärztin ___.",answer:"werden",translation:"Тобі можна стати лікаркою.",category:"INFINITIV",explanation:"Після darfst інфінітив werden стоїть в кінці речення: darfst Ärztin werden."}),
  werdenUsageCard({id:"werden-infinitive-baecker",targetId:"werden-infinitive",promptText:"Sie möchten Bäcker ___.",answer:"werden",translation:"Вони хочуть стати пекарями.",category:"INFINITIV",explanation:"Після möchten інфінітив werden стоїть в кінці речення: möchten Bäcker werden."}),
  werdenUsageCard({id:"werden-infinitive-tierarzt",targetId:"werden-infinitive",promptText:"Kannst du Tierärztin ___?",answer:"werden",translation:"Чи можеш ти стати ветеринаркою?",category:"INFINITIV",explanation:"Після kannst інфінітив werden стоїть в кінці питального речення: Kannst du Tierärztin werden?"})
];
const werdenUsagePracticeCards=[...werdenUsageCards,...werdenUsageExtraCards];
const werdenCards=[...werdenFormCards,...werdenPracticeCards,...werdenUsageCards,...werdenUsageExtraCards];
const werdenStages=[
  lessonStep("werden-forms-learn","Вивчення werden","Прочитайте шість форм werden і запам’ятайте зміну e → i у формах du wirst та er/sie/es wird.",werdenFormCards,"learn","Форми werden","Вивчення"),
  lessonStep("werden-forms-practice","Практика шести форм werden","Перевірте кожну пару займенника й форми, вводячи лише пропущену форму werden.",werdenPracticeCards,"input","Форми werden","Практика"),
  lessonStep("werden-usage-learn","Вивчення значень werden","Прочитайте речення про зміну стану, професію та werden з модальним дієсловом.",werdenUsageCards,"learn","Значення werden","Вивчення"),
  lessonStep("werden-usage-practice","Практика значень werden","Доповніть речення правильною формою werden або інфінітивом werden.",werdenUsagePracticeCards,"input","Значення werden","Практика")
];
// Mit + Dativ and ohne + Akkusativ: companion, means, manner, article or possessive after ohne, and the mit/ohne choice.
const mitOhnePracticeCategory="MIT ODER OHNE";
const mitOhnePracticeStep=(...args)=>({...lessonStep(...args),categoryBeforeCheck:mitOhnePracticeCategory});
const mitOhneCategories={
  "mit-begleitung":"MIT + DATIV · BEGLEITUNG",
  "mit-mittel":"MIT + DATIV · MITTEL",
  "mit-art-und-weise":"MIT + DATIV · ART UND WEISE",
  "mit-zutat":"MIT + DATIV · ZUTAT",
  "mit-pronomen":"MIT + DATIV · PRONOMEN",
  "ohne-artikel":"OHNE + AKKUSATIV · ARTIKEL",
  "ohne-possessiv":"OHNE + AKKUSATIV · POSSESSIV",
  "ohne-indefinit":  "OHNE + AKKUSATIV · UNBESTIMMTER ARTIKEL",
  "ohne-ohne-artikel":"OHNE + AKKUSATIV · OHNE ARTIKEL",
  "ohne-pronomen":"OHNE + AKKUSATIV · PRONOMEN",
  "mit-ohne-wahl-begleitung":"MIT ODER OHNE · BEDEUTUNG",
  "mit-ohne-wahl-zutat":"MIT ODER OHNE · BEDEUTUNG",
  "mit-ohne-wahl-hilfe":"MIT ODER OHNE · BEDEUTUNG",
  "mit-ohne-wahl-zahlung":"MIT ODER OHNE · BEDEUTUNG",
  "mit-ohne-wahl-gefuehl":"MIT ODER OHNE · BEDEUTUNG",
  "satzbau-mit":"MIT + DATIV · SATZBAU",
  "satzbau-ohne":"OHNE + AKKUSATIV · SATZBAU"
};
const mitOhneClozeCard=({id,targetId,promptText,answer,translation,explanation})=>({
  id,targetId,type:"cloze",word:answer,promptText,support:translation,translation,
  example:promptText.replace("___",answer),explanation,category:mitOhneCategories[targetId],practiceVariants:false,
  response:modalResponse([answer],answer.includes(" ")?"phrase":"word")
});
// Rows: [key, prompt with ___, answer, Ukrainian translation, explanation]
const mitOhneClozeRows=(targetId,rows)=>rows.map(([key,promptText,answer,translation,explanation])=>mitOhneClozeCard({id:`${targetId}-${key}`,targetId,promptText,answer,translation,explanation}));
const mitBegleitungCards=mitOhneClozeRows("mit-begleitung",[
  ["meiner","Ich gehe ___ Freundin ins Kino.","mit meiner","Я іду в кіно з моєю подругою.","Freundin — жіночий рід. Після mit — Dativ: mit meiner."],
  ["unserem","Wir fahren ___ Bruder nach Berlin.","mit unserem","Ми їдемо до Берліна з нашим братом.","Bruder — чоловічий рід. Після mit — Dativ: mit unserem."],
  ["seinem-hund","Er geht ___ Hund spazieren.","mit seinem","Він гуляє зі своїм псом.","Hund — чоловічий рід: sein → seinem після mit. «Свій» вказує на er."],
  ["seinen-eltern","Er wohnt ___ Eltern in Wien.","mit seinen","Він живе разом зі своїми батьками у Відні.","Eltern — множина. У Dativ множини присвійний — seinen, а іменник уже має -n."]
]);
const mitMittelCards=mitOhneClozeRows("mit-mittel",[
  ["auto","Ich fahre ___ Auto zur Arbeit.","mit dem","Я їду на роботу автомобілем.","Auto — середній рід: das → dem. Транспорт як засіб після mit: mit dem Auto."],
  ["bahn","Sie kommt ___ Bahn.","mit der","Вона приїжджає потягом.","Bahn — жіночий рід: die → der після mit."],
  ["flugzeug","Wir fliegen ___ Flugzeug nach Wien.","mit dem","Ми летимо до Відня літаком.","Flugzeug — середній рід: das → dem після mit."],
  ["rad","Wir fahren ___ Rad an den See.","mit dem","Ми їдемо до озера на велосипеді.","Rad — середній рід: das → dem після mit. Велосипед — засіб: mit dem Rad."]
]);
const mitArtUndWeiseCards=mitOhneClozeRows("mit-art-und-weise",[
  ["spass","Er macht das ___ Spaß.","mit","Він робить це із задоволенням.","Спосіб дії: mit + іменник без артикля — mit Spaß, mit Liebe, mit Geduld."],
  ["liebe","Sie kocht ___ Liebe.","mit","Вона готує з любов’ю.","Mit Liebe — спосіб дії без артикля."],
  ["geduld","Wir lernen Deutsch ___ Geduld.","mit","Ми вивчаємо німецьку з терпінням.","Mit Geduld — спосіб дії без артикля: Wir lernen Deutsch mit Geduld."]
]);
const mitZutatCards=mitOhneClozeRows("mit-zutat",[
  ["milch","Ich trinke Kaffee ___ Milch.","mit","Я п’ю каву з молоком.","Milch — без артикля після mit: Kaffee mit Milch. Інгредієнт стоїть без артикля."],
  ["zitrone","Ich trinke Tee ___ Zitrone.","mit","Я п’ю чай з лимоном.","Zitrone — без артикля після mit: Tee mit Zitrone."],
  ["pilze","Ich esse Pizza ___ Pilzen.","mit","Я їм піцу з грибами.","Pilze — множина; у Dativ множини додається -n: mit Pilzen."]
]);
const mitPronomenCards=mitOhneClozeRows("mit-pronomen",[
  ["dir","Am Samstag fahre ich ___ an den See.","mit dir","У суботу я їду з тобою на озеро.","Після mit — Dativ: du → dir. Mit dir — «з тобою»."],
  ["mir","Kommst du heute ___ ins Kino?","mit mir","Ти сьогодні йдеш зі мною в кіно?","Після mit — Dativ: ich → mir. Mit mir — «зі мною»."],
  ["ihm","Ich spreche ___ über den Film.","mit ihm","Я розмовляю з ним про фільм.","Після mit — Dativ: er → ihm, а не ihn. Mit ihm — «з ним»."],
  ["uns","Die Lehrerin spricht ___ über das Thema.","mit uns","Учителька говорить з нами на цю тему.","Після mit — Dativ: wir → uns. Mit uns — «з нами»."]
]);
const ohneArtikelCards=mitOhneClozeRows("ohne-artikel",[
  ["mantel","Der Mantel hängt im Flur. Ich gehe ___ Mantel nach draußen.","ohne den","Пальто висить у передпокої. Я виходжу на вулицю без нього.","Mantel — чоловічий рід: der → den після ohne. Вже згаданий предмет має означений артикль."],
  ["schluessel","Der Schlüssel liegt auf dem Tisch. Er geht ___ Schlüssel aus dem Haus.","ohne den","Ключ лежить на столі. Він виходить з дому без нього.","Schlüssel — чоловічий рід: der → den після ohne."],
  ["milch","Auf dem Tisch steht die Milch. Ich trinke den Tee ___ Milch.","ohne die","Молоко стоїть на столі. Я п’ю чай без нього.","Milch — жіночий рід: у Akkusativ die не змінюється. Молоко вже відоме, тому артикль лишається."],
  ["auto","Das Auto steht vor dem Haus. Wir fahren ___ Auto in die Stadt.","ohne das","Машина стоїть перед будинком. Ми їдемо до міста без неї.","Auto — середній рід: у Akkusativ das не змінюється, на відміну від der → den."]
]);
const ohnePossessivCards=mitOhneClozeRows("ohne-possessiv",[
  ["schirm","Er verlässt das Haus ___ Schirm.","ohne seinen","Він виходить з дому без свого зонта.","Schirm — чоловічий рід: sein → seinen після ohne (Akkusativ)."],
  ["tasche","Du gehst ___ Tasche ins Büro?","ohne deine","Ти йдеш в офіс без своєї сумки?","Tasche — жіночий рід: dein → deine. У Akkusativ жіночий присвійний такий самий, як у Nominativ."],
  ["kinder","Wir reisen ___ Kinder nach Spanien.","ohne unsere","Ми подорожуємо до Іспанії без наших дітей.","Kinder — множина: unsere в Akkusativ, як і в Nominativ."],
  ["handy","Ich fahre nie ___ Handy in den Urlaub.","ohne mein","Я ніколи не їжджу у відпустку без свого телефона.","Handy — середній рід: mein у Akkusativ не змінюється, як і в Nominativ."]
]);
const ohneIndefinitCards=mitOhneClozeRows("ohne-indefinit",[
  ["hut","Der Mann geht ___ Hut in die Kirche.","ohne einen","Чоловік іде до церкви без жодного капелюха.","Hut — чоловічий рід: ein → einen після ohne. «Жодного» — неозначена форма."],
  ["jacke","Sie geht ___ Jacke nach draußen.","ohne eine","Вона виходить на вулицю без жодної куртки.","Jacke — жіночий рід: ein → eine після ohne. Ohne eine Jacke — «без жодної куртки»."],
  ["wort","Er verlässt das Zimmer ___ Wort.","ohne ein","Він виходить з кімнати без жодного слова.","Wort — середній рід: ein у Akkusativ не змінюється. Ohne ein Wort — усталений вираз."]
]);
const ohneOhneArtikelCards=mitOhneClozeRows("ohne-ohne-artikel",[
  ["kaese","Ich esse Pizza ___ Käse.","ohne","Я їм піцу без сиру.","Käse — без артикля: ohne стоїть одразу перед іменником, коли мова про загальне поняття."],
  ["zucker","Ich trinke Tee ___ Zucker.","ohne","Я п’ю чай без цукру.","Zucker — без артикля, бо мова про загальне поняття: ohne Zucker."],
  ["dressing","Ich esse den Salat ___ Dressing.","ohne","Я їм салат без заправки.","Dressing — без артикля: ohne Dressing, бо йдеться про загальне поняття."]
]);
const ohnePronomenCards=mitOhneClozeRows("ohne-pronomen",[
  ["mich","Er geht nie ___ ins Kino.","ohne mich","Він ніколи не ходить у кіно без мене.","Після ohne — Akkusativ: ich → mich. Ohne mich — «без мене»."],
  ["dich","Wir fahren nicht ___ in den Urlaub.","ohne dich","Ми не їдемо у відпустку без тебе.","Після ohne — Akkusativ: du → dich, а не dir. Ohne dich — «без тебе»."],
  ["ihn","Ich kann nicht ___ leben.","ohne ihn","Я не можу жити без нього.","Після ohne — Akkusativ: er → ihn, а не ihm. Ohne ihn — «без нього»."],
  ["sie","Er kommt nie ___ zur Party.","ohne sie","Він ніколи не приходить на вечірку без неї.","Після ohne — Akkusativ: sie (вона) → sie. Ohne sie — «без неї»."]
]);
// Choice targets: each has a German gap with no article after it, so the following word never reveals mit or ohne.
const mitOhneWahlCards=[
  ...mitOhneClozeRows("mit-ohne-wahl-begleitung",[
    ["anna","Ich gehe heute Abend ___ Anna ins Kino.","mit","Я йду сьогодні ввечері в кіно з Анною.","Anna іде разом — mit + Dativ. Ім’я після mit не змінюється."],
    ["tom","Wir fahren morgen ___ Tom nach Berlin.","ohne","Ми завтра їдемо до Берліна без Тома.","Tom не їде — ohne + Akkusativ. Ім’я після ohne не змінюється."],
    ["tennis","Er spielt Tennis ___ Anna.","mit","Він грає в теніс з Анною.","Anna грає разом — mit + Dativ: mit Anna."]
  ]),
  ...mitOhneClozeRows("mit-ohne-wahl-zutat",[
    ["brot","Ich esse Brot ___ Butter.","mit","Я їм хліб з маслом.","Масло є — mit + Dativ: mit Butter."],
    ["kuchen","Wir essen den Kuchen ___ Sahne.","ohne","Ми їмо торт без вершків.","Сметани немає — ohne + Akkusativ: ohne Sahne."],
    ["tee","Ich trinke den Tee ___ Honig.","mit","Я п’ю чай з медом.","Мед є — mit + Dativ: mit Honig."]
  ]),
  ...mitOhneClozeRows("mit-ohne-wahl-hilfe",[
    ["aufgabe","Er löst die Aufgabe ___ Hilfe.","ohne","Він розв’язує завдання сам, без допомоги.","Допомоги немає — ohne + Akkusativ: ohne Hilfe."],
    ["regal","Wir bauen das Regal ___ Hilfe.","mit","Ми будуємо полицю за допомогою.","Допомога є — mit + Dativ: mit Hilfe."],
    ["schwimmbad","Kinder dürfen nicht ___ Begleitung von Erwachsenen ins Schwimmbad.","ohne","Дітям не можна в басейн без супроводу дорослих.","Супроводу немає — ohne + Akkusativ: ohne Begleitung."]
  ]),
  ...mitOhneClozeRows("mit-ohne-wahl-zahlung",[
    ["karte","Ich bezahle ___ Karte.","mit","Я плачу карткою.","Оплата карткою — засіб: mit + Dativ: mit Karte."],
    ["geld","Er geht ___ Geld in die Stadt.","ohne","Він іде до міста без грошей.","Грошей немає — ohne + Akkusativ: ohne Geld."],
    ["bargeld","Wir zahlen ___ Bargeld.","mit","Ми платимо готівкою.","Оплата готівкою — засіб: mit + Dativ: mit Bargeld."]
  ]),
  ...mitOhneClozeRows("mit-ohne-wahl-gefuehl",[
    ["tanz","Sie tanzt ___ Freude.","mit","Вона танцює з радістю.","Радість є — mit + Dativ: mit Freude."],
    ["angst","Lisa geht ___ Angst in die Prüfung.","ohne","Ліза йде на іспит без страху.","Страху немає — ohne + Akkusativ: ohne Angst."],
    ["arbeit","Er macht die Arbeit ___ Freude.","ohne","Він робить роботу без радості.","Радості немає — ohne + Akkusativ: ohne Freude."]
  ])
];
// [key, targetId, canonical sentence, other valid order, chunks, Ukrainian sentence, structure, explanation]
const mitOhneSentenceCards=[
  ["bus","satzbau-mit","Ich fahre heute mit dem Bus zur Arbeit.","Heute fahre ich mit dem Bus zur Arbeit.","mit dem Bus / ich / fahren / heute / zur Arbeit","Сьогодні я їду на роботу автобусом.",mainClause("Ich","fahre","heute mit dem Bus","zur Arbeit"),"Fahre стоїть на другому місці. Mit dem Bus стоїть перед напрямком zur Arbeit. Heute на початку теж правильно."],
  ["freunde","satzbau-mit","Wir gehen am Abend mit unseren Freunden ins Kino.","Am Abend gehen wir mit unseren Freunden ins Kino.","ins Kino / wir / mit unseren Freunden / am Abend / gehen","Увечері ми йдемо в кіно з нашими друзями.",mainClause("Wir","gehen","am Abend mit unseren Freunden","ins Kino"),"Gehen стоїть на другому місці. Mit unseren Freunden — Dativ множини. Am Abend на початку теж правильно."],
  ["bahn","satzbau-mit","Sie kommt mit der Bahn in die Stadt.","In die Stadt kommt sie mit der Bahn.","in die Stadt / sie / mit der Bahn / kommen","Вона приїжджає до міста потягом.",mainClause("Sie","kommt","mit der Bahn in die Stadt"),"Kommt стоїть на другому місці. Засіб mit der Bahn стоїть перед напрямком in die Stadt."],
  ["urlaub","satzbau-ohne","Wir fahren im Sommer ohne Auto in den Urlaub.","Im Sommer fahren wir ohne Auto in den Urlaub.","in den Urlaub / wir / ohne Auto / im Sommer / fahren","Влітку ми їдемо у відпустку без машини.",mainClause("Wir","fahren","im Sommer ohne Auto","in den Urlaub"),"Fahren стоїть на другому місці. Ohne Auto — без артикля, стоїть після часу й перед напрямком in den Urlaub."],
  ["bruder","satzbau-ohne","Er kommt heute ohne seinen Bruder zur Party.","Heute kommt er ohne seinen Bruder zur Party.","ohne seinen Bruder / er / heute / zur Party / kommen","Сьогодні він приходить на вечірку без свого брата.",mainClause("Er","kommt","heute ohne seinen Bruder","zur Party"),"Kommt стоїть на другому місці. Ohne seinen Bruder — Akkusativ: seinen для чоловічого роду."],
  ["stress","satzbau-ohne","Der Student lernt für die Prüfung ohne Stress.","Für die Prüfung lernt der Student ohne Stress.","ohne Stress / der Student / für die Prüfung / lernen","Студент готується до іспиту без стресу.",mainClause("Der Student","lernt","für die Prüfung ohne Stress"),"Lernt стоїть на другому місці. Ohne Stress — без артикля, стоїть наприкінці."]
].map(([key,targetId,word,alternative,promptText,translation,structure,explanation])=>({
  id:`${targetId}-${key}`,targetId,type:"sentence-build",word,promptText,support:translation,translation,
  example:alternative,exampleTranslation:translation,explanation,category:mitOhneCategories[targetId],structure:[structure],
  response:modalResponse([word,alternative],"sentence")
}));
const mitCards=[...mitBegleitungCards,...mitMittelCards,...mitArtUndWeiseCards,...mitZutatCards,...mitPronomenCards];
const ohneCards=[...ohneArtikelCards,...ohnePossessivCards,...ohneIndefinitCards,...ohneOhneArtikelCards,...ohnePronomenCards];
const mitOhneCards=[...mitCards,...ohneCards,...mitOhneWahlCards,...mitOhneSentenceCards];
const mitOhneStages=[
  lessonStep("mit-learn","Вивчення: mit + Dativ","Вивчіть mit (з) з Dativ: супровід, засіб, спосіб дії, інгредієнт і займенник. Після mit усі артиклі змінюються, присвійні отримують закінчення Dativ, а займенники — mir, dir, ihm, uns.",mitCards,"learn","Mit · з Dativ","Вивчення"),
  mitOhnePracticeStep("mit-practice","Практика: mit + Dativ","Впишіть mit з артиклем, присвійним займенником або займенником у Dativ. Рід іменника, множина або зміст речення підкажуть форму.",mitCards,"input","Mit · з Dativ","Практика"),
  lessonStep("ohne-learn","Вивчення: ohne + Akkusativ","Вивчіть ohne (без) з Akkusativ: змінюється лише der → den, присвійні та ein-форми — як артиклі, займенники — mich, dich, ihn, sie. Без артикля іменник стоїть просто після ohne.",ohneCards,"learn","Ohne · без Akkusativ","Вивчення"),
  mitOhnePracticeStep("ohne-practice","Практика: ohne + Akkusativ","Впишіть ohne з артиклем, присвійним займенником, неозначеним артиклем, займенником або без артикля — залежно від іменника чи займенника.",ohneCards,"input","Ohne · без Akkusativ","Практика"),
  lessonStep("choice-learn","Вивчення: mit чи ohne","Порівняйте mit і ohne: якщо є людина, їжа, допомога, гроші чи засіб — mit, якщо цього немає — ohne.",mitOhneWahlCards,"learn","Mit або ohne","Вивчення"),
  mitOhnePracticeStep("choice-practice","Практика: mit чи ohne","Оберіть mit або ohne за змістом речення: спершу визначте, чи є людина, їжа, засіб або допомога.",mitOhneWahlCards,"input","Mit або ohne","Практика"),
  lessonStep("satzbau-learn","Вивчення: речення з mit і ohne","Подивіться, де стоїть фраза з mit або ohne. Відмінюване дієслово завжди лишається на другому місці.",mitOhneSentenceCards,"learn","Речення з mit і ohne","Вивчення"),
  lessonStep("satzbau-practice","Побудова речень з mit і ohne","Складіть повне речення з фрагментів: поставте дієслово на друге місце, а фразу з mit або ohne — на її місце.",mitOhneSentenceCards,"input","Речення з mit і ohne","Практика")
];
const habenStages=[
  lessonStep("haben-learn","Вивчення haben","Прочитайте шість форм haben і пов’яжіть їх із володінням чимось.",habenFormCards,"learn","Мати · haben","Вивчення"),
  lessonStep("haben-practice","Практика haben","Введіть лише пропущену форму haben у кожному реченні.",habenPracticeCards,"input","Мати · haben","Практика"),
  lessonStep("bekommen-learn","Вивчення bekommen","Прочитайте шість форм bekommen і пов’яжіть їх з отриманням чогось.",bekommenFormCards,"learn","Отримувати · bekommen","Вивчення"),
  lessonStep("bekommen-practice","Практика bekommen","Введіть лише пропущену форму bekommen у кожному реченні.",bekommenPracticeCards,"input","Отримувати · bekommen","Практика"),
  lessonStep("brauchen-learn","Вивчення brauchen","Прочитайте шість форм brauchen і пов’яжіть їх із потребою в чомусь.",brauchenFormCards,"learn","Потребувати · brauchen","Вивчення"),
  lessonStep("brauchen-practice","Практика brauchen","Введіть лише пропущену форму brauchen у кожному реченні.",brauchenPracticeCards,"input","Потребувати · brauchen","Практика")
];
const frequencyStages=[
  lessonStep("frequency-scale-learn","Вивчення шкали частотності","Ознайомтеся з прислівниками від immer до nie, а потім потренуйте кожен із них.",frequencyCards,"learn","Шкала частотності","Вивчення"),
  lessonStep("frequency-scale-recall","Практика шкали частотності","Напишіть лише німецький прислівник частотності за українським значенням.",frequencyPracticeCards,"input","Шкала частотності","Практика")
];
const timeExpressionStages=[
  lessonStep("time-expressions-learn","Вивчення часових виразів","Пов’яжіть um, am, im, in та вирази з Nacht із відповідними часовими значеннями, перш ніж практикувати їх у контексті.",timeExpressionCards,"learn","Часові вирази","Вивчення"),
  lessonStep("time-expressions-practice","Практика часових виразів","Введіть пропущений вираз для часу на годиннику, дати, місяця, пори року, майбутнього проміжку або ночі.",timeExpressionPracticeCards,"input","Часові вирази","Практика"),
  lessonStep("spoken-time-learn","Вивчення розмовних позначень часу","Прочитайте повсякденні конструкції з nach, vor, Viertel і halb, а потім назвіть час самостійно.",spokenTimeCards,"learn","Час у розмові","Вивчення"),
  lessonStep("spoken-time-practice","Практика розмовних позначень часу","Напишіть повсякденний німецький вираз для часу на електронному годиннику.",spokenTimePracticeCards,"input","Час у розмові","Практика")
];
const timeWorksheetVocabularyStages=[
  ...learnThenPractice("time-worksheet-vocabulary","пори року й розпорядок дня","Вивчіть лексику про пори року й щоденні справи з матеріалу про часові вирази.",timeWorksheetVocabularyCards,"Пори року й розпорядок дня")
];
const everydayVocabularyStages=[
  ...learnThenPractice("everyday-routine","щоденні справи","Вивчіть слова послідовності й корисні дієслова для роботи з текстом або завданням.",everydayVocabularyRoutineCards,"Щоденні справи"),
  ...learnThenPractice("everyday-food","їжа й ласощі","Вивчіть поширені назви їжі й напоїв разом з артиклями.",everydayVocabularyFoodCards,"Їжа й ласощі")
];
const travelTransportStages=[
  ...learnThenPractice("travel-transport-words","транспорт","Вивчіть назви транспорту, місць на вокзалі й багажу разом з артиклями.",travelTransportCards,"Транспорт"),
  ...learnThenPractice("travel-route-phrases","вирази для маршруту","Уживайте поширені вирази для пунктів призначення, місць, напрямків і часу подорожі.",travelPhraseCards,"Вирази для маршруту"),
  ...learnThenPractice("travel-actions","дії під час подорожі","Вивчіть дієслова для посадки, пересадок, прибуття й пересування.",travelActionCards,"Дії під час подорожі")
];
const directionsStages=[
  ...learnThenPractice("directions-instructions","пояснення дороги","Пояснюйте простий маршрут за допомогою слів послідовності, напрямків і дієслів руху.",directionInstructionCards,"Пояснення дороги"),
  ...learnThenPractice("directions-landmarks","вуличні орієнтири","Описуйте розташування місць і маршрути через перехрестя, світлофори й вулиці.",directionLandmarkCards,"Вуличні орієнтири")
];
const dativeVerbStages=[
  {...lessonStep("dative-verbs-learn","Вивчення дієслів із Dativ","Вивчіть усі 16 дієслів з українськими значеннями й природними прикладами. Зверніть увагу, кому адресовано дію або хто відчуває її результат.",dativeVerbCards,"learn","Дієслова з Dativ","Вивчення")},
  {...lessonStep("dative-verbs-practice","Практика дієслів із Dativ","Пригадайте інфінітив за українським значенням або доповніть одну форму дієслова. Для wehtun і auffallen відокремлена частина вже показана.",dativeVerbCards,"input","Дієслова з Dativ","Практика")}
];
const esGibtLeisureStages=[
  lessonStep("es-gibt-pattern-learn","Вивчення es gibt","Уживайте es gibt, щоб повідомити про наявність місця або предмета. Зверніть увагу на артикль в Akkusativ після нього.",esGibtPatternCards,"learn","Конструкція es gibt","Вивчення"),
  lessonStep("es-gibt-pattern-practice","Практика es gibt","Доповніть речення словом gibt або правильним артиклем в Akkusativ після es gibt.",esGibtPracticeCards,"input","Конструкція es gibt","Практика"),
  ...learnThenPractice("leisure-places","місця для дозвілля","Вивчіть кожне місце для дозвілля з артиклем і формою множини.",leisurePlaceCards,"Місця для дозвілля"),
  ...learnThenPractice("leisure-activities","заняття на дозвіллі","Описуйте можливі заняття в місті й уживайте нові слова в контексті.",leisureActivityCards,"Заняття на дозвіллі"),
  ...learnThenPractice("photo-description","опис фотографій","Описуйте, що й кого ви бачите на фотографії.",photoDescriptionCards,"Опис фотографій")
];
const wordOrderStages=[
  lessonStep("word-order-statements-learn","Вивчення прямого порядку слів","Порівняйте речення, де підмет стоїть першим, а відмінюване дієслово — другим.",wordOrderStatementCards,"learn","Прямий порядок слів","Вивчення"),
  lessonStep("word-order-statements-practice","Практика прямого порядку слів","Складіть із німецьких фрагментів розповідні речення з дієсловом на другому місці.",wordOrderStatementPracticeCards,"input","Прямий порядок слів","Практика"),
  lessonStep("word-order-tekamolo-learn","Вивчення TE-KA-MO-LO","Дотримуйтеся звичного порядку обставин: час, причина, спосіб дії, місце.",wordOrderTeKaMoLoCards,"learn","Обставини · TE-KA-MO-LO","Вивчення"),
  lessonStep("word-order-tekamolo-practice","Практика TE-KA-MO-LO","Складіть речення з обставинами часу, причини, способу дії й місця в порядку TE-KA-MO-LO.",wordOrderTeKaMoLoPracticeCards,"input","Обставини · TE-KA-MO-LO","Практика"),
  lessonStep("word-order-modal-learn","Вивчення порядку слів із модальними дієсловами","Вивчіть чотири конструкції з матеріалу: модальне дієслово на другому місці, інфінітив у кінці й правильний порядок у розповідях та запитаннях.",wordOrderModalCards,"learn","Модальні дієслова","Вивчення"),
  lessonStep("word-order-modal-practice","Практика порядку слів із модальними дієсловами","Складіть речення з модальними дієсловами. Збережіть місце відмінюваного дієслова, а інфінітив поставте в кінець.",wordOrderModalPracticeCards,"input","Модальні дієслова","Практика"),
  lessonStep("word-order-inversion-learn","Вивчення інверсії","Почніть із часу або іншого виразу, поставте дієслово другим, а підмет — після нього.",wordOrderInversionCards,"learn","Інверсія","Вивчення"),
  lessonStep("word-order-inversion-practice","Практика інверсії","Складіть із німецьких фрагментів речення, що починаються з часового виразу.",wordOrderInversionPracticeCards,"input","Інверсія","Практика"),
  lessonStep("word-order-questions-learn","Вивчення питальних речень","Порівняйте загальні й спеціальні запитання та знайдіть місце відмінюваного дієслова.",wordOrderQuestionCards,"learn","Запитання","Вивчення"),
  lessonStep("word-order-questions-practice","Практика питальних речень","Складіть із німецьких фрагментів загальні й спеціальні запитання.",wordOrderQuestionPracticeCards,"input","Запитання","Практика")
];
const separableVerbStages=[
  lessonStep("separable-verbs-learn","Вивчення відокремлюваних дієслів","Вивчіть поширені дієслова A1 з відокремлюваними префіксами й повними прикладами головних речень.",separableVerbCards,"learn","Відокремлювані дієслова","Вивчення"),
  lessonStep("separable-verbs-statements-practice","Практика головних речень","Побудуйте головні речення: відмінюйте основу на другому місці й перенесіть префікс у кінець.",separableVerbStatementPracticeCards,"input","Головні речення","Практика"),
  lessonStep("separable-verbs-patterns-learn","Коли дієслово не розділяється","Порівняйте головні й підрядні речення, інфінітиви з модальними дієсловами та невідокремлювані дієслова.",separableVerbPatternCards,"learn","Коли відокремлювати префікс","Вивчення"),
  lessonStep("separable-verbs-context-practice","Практика змішаних контекстів","Побудуйте розповідні речення, спеціальне запитання, речення з модальними дієсловами й підрядне речення.",separableVerbContextPracticeCards,"input","Змішані контексти","Практика")
];
const localPrepositionsStages=[
  {...lessonStep("local-prepositions-dative-learn","Вивчення Wo? + Dativ","Розпізнавайте нерухоме розташування з in, an, auf, über, unter, vor, hinter, neben і zwischen.",localPrepositionsDativeCards,"learn","Де? · Wo? + Dativ","Вивчення")},
  {...lessonStep("local-prepositions-dative-practice","Практика Wo? + Dativ","Доповніть вираз місця. Спочатку поставте запитання Wo?, потім уживайте Dativ після прийменника.",localPrepositionsDativePracticeCards,"input","Де? · Wo? + Dativ","Практика")},
  {...lessonStep("local-prepositions-accusative-learn","Вивчення Wohin? + Akkusativ","Розпізнавайте напрямок руху з тими самими прийменниками й артиклем в Akkusativ.",localPrepositionsAccusativeCards,"learn","Куди? · Wohin? + Akkusativ","Вивчення")},
  {...lessonStep("local-prepositions-accusative-practice","Практика Wohin? + Akkusativ","Доповніть вираз напрямку. Спочатку поставте запитання Wohin?, потім уживайте Akkusativ після прийменника.",localPrepositionsAccusativePracticeCards,"input","Куди? · Wohin? + Akkusativ","Практика")},
  {...lessonStep("local-prepositions-contrast-learn","Порівняння руху й розташування","Прочитайте пари речень про рух і розташування. Обирайте відмінок за значенням, а не лише за прийменником.",localPrepositionsContrastCards,"learn","Рух чи розташування?","Вивчення")},
  {...lessonStep("local-prepositions-contrast-practice","Місце й напрямок у реченні","Доповніть місце. Дієслово показує, рух це чи розташування, і від цього залежить відмінок.",localPrepositionsContrastPracticeCards,"input","Рух чи розташування?","Практика")}
];
// Temporal prepositions: vor / nach with an event, vor / in / für with a span, the mixed drill and sentence builds.
const temporalResponse=(accepted,scope)=>({mode:"text",scope,accepted,caseSensitive:false,punctuationSensitive:false});
const temporalPracticeCategory="TEMPORALE PRÄPOSITION";
const temporalClozeCard=({id,targetId,word,accepted=[word],promptText,translation,studyTranslation,explanation,category,noun})=>({
  id,targetId,type:"cloze",word,promptText,support:translation,translation,studyTranslation,
  example:promptText.replace("___",word),explanation,category:`${temporalPracticeCategory} · ${category}`,practiceVariants:false,
  ...(noun?{noun}:{}),
  response:temporalResponse(accepted,word.includes(" ")?"phrase":"word")
});
const temporalEventTargets={
  "temporal-event-vor-dem":{word:"vor dem",category:"VOR + DATIV"},
  "temporal-event-vor-der":{word:"vor der",category:"VOR + DATIV"},
  "temporal-event-vor-den":{word:"vor den",category:"VOR + DATIV"},
  "temporal-event-nach-dem":{word:"nach dem",category:"NACH + DATIV"},
  "temporal-event-nach-der":{word:"nach der",category:"NACH + DATIV"},
  "temporal-event-nach-den":{word:"nach den",category:"NACH + DATIV"}
};
// [id, targetId, noun, Dativ form shown in the meaning, prompt, Ukrainian sentence, explanation]
const temporalEventCards=[
  ["essen","temporal-event-vor-dem",nounMeta("neuter","Essen"),"das Essen → dem Essen","Ich wasche mir ___ Essen die Hände.","Я мию руки перед їжею.","Vor + Dativ — перед подією. Das Essen — середній рід: das → dem."],
  ["fruehstueck","temporal-event-vor-dem",nounMeta("neuter","Frühstück"),"das Frühstück → dem Frühstück","Er joggt jeden Tag ___ Frühstück.","Він щодня бігає перед сніданком.","Vor + Dativ — перед подією. Das Frühstück — середній рід: das → dem."],
  ["deutschkurs","temporal-event-vor-dem",nounMeta("masculine","Deutschkurs"),"der Deutschkurs → dem Deutschkurs","Ich trinke ___ Deutschkurs einen Kaffee.","Перед курсом німецької я п’ю каву.","Vor + Dativ — перед подією. Der Deutschkurs — чоловічий рід: der → dem."],
  ["pruefung","temporal-event-vor-der",nounMeta("feminine","Prüfung"),"die Prüfung → der Prüfung","Ich bin ___ Prüfung sehr nervös.","Я дуже нервую перед іспитом.","Vor + Dativ — перед подією. Die Prüfung — жіночий рід: die → der."],
  ["party","temporal-event-vor-der",nounMeta("feminine","Party"),"die Party → der Party","Wir kaufen ___ Party Getränke.","Перед вечіркою ми купуємо напої.","Vor + Dativ — перед подією. Die Party — жіночий рід: die → der."],
  ["reise","temporal-event-vor-der",nounMeta("feminine","Reise"),"die Reise → der Reise","Sie packt ___ Reise ihren Koffer.","Перед подорожжю вона пакує валізу.","Vor + Dativ — перед подією. Die Reise — жіночий рід: die → der."],
  ["pruefungen","temporal-event-vor-den",nounMeta("feminine","Prüfung",{exampleWord:"",plural:"Prüfungen",pluralExampleWord:"Prüfungen"}),"die Prüfungen → den Prüfungen","Ich lerne ___ Prüfungen jeden Tag.","Перед іспитами я вчуся щодня.","Vor + Dativ — перед подією. Множина в Dativ: die → den; Prüfungen уже закінчується на -n."],
  ["feiertagen","temporal-event-vor-den",nounMeta("masculine","Feiertag",{exampleWord:"",plural:"Feiertage",pluralExampleWord:"Feiertagen"}),"die Feiertage → den Feiertagen","Ich kaufe ___ Feiertagen Geschenke.","Перед святами я купую подарунки.","Vor + Dativ — перед подією. Множина в Dativ: die → den, а іменник отримує -n: Feiertage → Feiertagen."],
  ["ferien","temporal-event-vor-den",nounMeta("plural","Ferien"),"die Ferien → den Ferien","Wir schreiben ___ Ferien noch einen Test.","Перед канікулами ми ще пишемо тест.","Vor + Dativ — перед подією. Die Ferien буває лише в множині: Dativ die → den."],
  ["meeting","temporal-event-nach-dem",nounMeta("neuter","Meeting"),"das Meeting → dem Meeting","Ich rufe dich ___ Meeting an.","Я подзвоню тобі після наради.","Nach + Dativ — після події. Das Meeting — середній рід: das → dem."],
  ["abendessen","temporal-event-nach-dem",nounMeta("neuter","Abendessen"),"das Abendessen → dem Abendessen","Wir sehen ___ Abendessen fern.","Після вечері ми дивимося телевізор.","Nach + Dativ — після події. Das Abendessen — середній рід: das → dem."],
  ["unterricht","temporal-event-nach-dem",nounMeta("masculine","Unterricht"),"der Unterricht → dem Unterricht","Die Kinder spielen ___ Unterricht im Hof.","Після уроків діти граються у дворі.","Nach + Dativ — після події. Der Unterricht — чоловічий рід: der → dem."],
  ["arbeit","temporal-event-nach-der",nounMeta("feminine","Arbeit"),"die Arbeit → der Arbeit","Ich gehe ___ Arbeit einkaufen.","Після роботи я йду по покупки.","Nach + Dativ — після події. Die Arbeit — жіночий рід: die → der."],
  ["pause","temporal-event-nach-der",nounMeta("feminine","Pause"),"die Pause → der Pause","Wir machen ___ Pause weiter.","Після перерви ми продовжуємо.","Nach + Dativ — після події. Die Pause — жіночий рід: die → der."],
  ["schule","temporal-event-nach-der",nounMeta("feminine","Schule"),"die Schule → der Schule","Sie macht ___ Schule ihre Hausaufgaben.","Після школи вона робить домашнє завдання.","Nach + Dativ — після події. Die Schule — жіночий рід: die → der."],
  ["kursen","temporal-event-nach-den",nounMeta("masculine","Kurs",{exampleWord:"",plural:"Kurse",pluralExampleWord:"Kursen"}),"die Kurse → den Kursen","Ich bin ___ Kursen immer müde.","Після курсів я завжди втомлений / втомлена.","Nach + Dativ — після події. Множина в Dativ: die → den, а іменник отримує -n: Kurse → Kursen."],
  ["sommerferien","temporal-event-nach-den",nounMeta("plural","Sommerferien"),"die Sommerferien → den Sommerferien","Die Schule beginnt ___ Sommerferien im September.","Після літніх канікул школа починається у вересні.","Nach + Dativ — після події. Die Sommerferien буває лише в множині: Dativ die → den."],
  ["hausaufgaben","temporal-event-nach-den",nounMeta("feminine","Hausaufgabe",{exampleWord:"",plural:"Hausaufgaben",pluralExampleWord:"Hausaufgaben"}),"die Hausaufgaben → den Hausaufgaben","Wir spielen ___ Hausaufgaben Fußball.","Після домашніх завдань ми граємо у футбол.","Nach + Dativ — після події. Множина в Dativ: die → den; Hausaufgaben уже закінчується на -n."]
].map(([key,targetId,noun,dative,promptText,translation,explanation])=>{
  const {word,category}=temporalEventTargets[targetId];
  return temporalClozeCard({id:`${targetId}-${key}`,targetId,word,promptText,translation,
    studyTranslation:`${word.startsWith("vor")?"перед":"після"} · Dativ: ${dative}`,explanation,category,noun});
});
const temporalDigits={zwei:"2",drei:"3",fünf:"5",sechs:"6",zehn:"10"};
// A number written as a word may also be typed as digits ("in 2 Minuten").
const temporalSpanAnswers=phrase=>{
  const digits=phrase.replace(/\b(zwei|drei|fünf|sechs|zehn)\b/u,number=>temporalDigits[number]);
  return digits===phrase?[phrase]:[phrase,digits];
};
const temporalSpanTargets={
  "temporal-span-vor-singular":{meaning:"тому",category:"VOR + DATIV"},
  "temporal-span-vor-plural":{meaning:"тому",category:"VOR + DATIV"},
  "temporal-span-in-singular":{meaning:"через",category:"IN + DATIV"},
  "temporal-span-in-plural":{meaning:"через",category:"IN + DATIV"},
  "temporal-span-fuer-singular":{meaning:"на (строк)",category:"FÜR + AKKUSATIV"},
  "temporal-span-fuer-plural":{meaning:"на (строк)",category:"FÜR + AKKUSATIV"}
};
// [id, targetId, answer, noun, Ukrainian span, prompt, Ukrainian sentence, explanation]
const temporalSpanCards=[
  ["woche","temporal-span-vor-singular","vor einer Woche",nounMeta("feminine","Woche"),"тиждень тому","Ich habe ___ meine Prüfung gemacht.","Я склав / склала іспит тиждень тому.","Vor + Dativ — «тому», подія в минулому. Die Woche — жіночий рід: eine → einer."],
  ["jahr","temporal-span-vor-singular","vor einem Jahr",nounMeta("neuter","Jahr"),"рік тому","Er ist ___ nach Berlin gezogen.","Він переїхав до Берліна рік тому.","Vor + Dativ — «тому», подія в минулому. Das Jahr — середній рід: ein → einem."],
  ["stunde","temporal-span-vor-singular","vor einer Stunde",nounMeta("feminine","Stunde"),"годину тому","Der Zug ist ___ abgefahren.","Потяг відправився годину тому.","Vor + Dativ — «тому», подія в минулому. Die Stunde — жіночий рід: eine → einer."],
  ["jahren","temporal-span-vor-plural","vor drei Jahren",nounMeta("neuter","Jahr",{exampleWord:"",plural:"Jahre",pluralExampleWord:"Jahren"}),"три роки тому","Wir haben uns ___ kennengelernt.","Ми познайомилися три роки тому.","Vor + Dativ — «тому». Множина в Dativ отримує -n: Jahre → vor drei Jahren."],
  ["stunden","temporal-span-vor-plural","vor zwei Stunden",nounMeta("feminine","Stunde",{exampleWord:"",plural:"Stunden",pluralExampleWord:"Stunden"}),"дві години тому","Der Film hat ___ angefangen.","Фільм почався дві години тому.","Vor + Dativ — «тому». Множина Stunden уже закінчується на -n, тому форма не змінюється."],
  ["tagen","temporal-span-vor-plural","vor fünf Tagen",nounMeta("masculine","Tag",{exampleWord:"",plural:"Tage",pluralExampleWord:"Tagen"}),"п’ять днів тому","Sie hat mich ___ angerufen.","Вона подзвонила мені п’ять днів тому.","Vor + Dativ — «тому». Множина в Dativ отримує -n: Tage → vor fünf Tagen."],
  ["woche","temporal-span-in-singular","in einer Woche",nounMeta("feminine","Woche"),"через тиждень","Der Kurs beginnt ___.","Курс починається через тиждень.","In + Dativ — «через», момент у майбутньому. Die Woche — жіночий рід: eine → einer."],
  ["stunde","temporal-span-in-singular","in einer Stunde",nounMeta("feminine","Stunde"),"через годину","Ich bin ___ zurück.","Я повернуся через годину.","In + Dativ — «через», момент у майбутньому. Die Stunde — жіночий рід: eine → einer."],
  ["monat","temporal-span-in-singular","in einem Monat",nounMeta("masculine","Monat"),"через місяць","Wir ziehen ___ um.","Ми переїжджаємо через місяць.","In + Dativ — «через», момент у майбутньому. Der Monat — чоловічий рід: ein → einem."],
  ["minuten","temporal-span-in-plural","in zwei Minuten",nounMeta("feminine","Minute",{exampleWord:"",plural:"Minuten",pluralExampleWord:"Minuten"}),"через дві хвилини","Der Bus kommt ___.","Автобус приїде через дві хвилини.","In + Dativ — «через». Множина Minuten уже закінчується на -n, тому форма не змінюється."],
  ["tagen","temporal-span-in-plural","in zwei Tagen",nounMeta("masculine","Tag",{exampleWord:"",plural:"Tage",pluralExampleWord:"Tagen"}),"через два дні","Wir sehen uns ___ wieder.","Ми знову побачимося через два дні.","In + Dativ — «через». Множина в Dativ отримує -n: Tage → in zwei Tagen."],
  ["monaten","temporal-span-in-plural","in drei Monaten",nounMeta("masculine","Monat",{exampleWord:"",plural:"Monate",pluralExampleWord:"Monaten"}),"через три місяці","Meine Schwester heiratet ___.","Моя сестра виходить заміж через три місяці.","In + Dativ — «через». Множина в Dativ отримує -n: Monate → in drei Monaten."],
  ["woche","temporal-span-fuer-singular","für eine Woche",nounMeta("feminine","Woche"),"на тиждень","Ich fahre ___ nach Wien.","Я їду до Відня на тиждень.","Für + Akkusativ — на який строк (Wie lange?). Die Woche — жіночий рід: eine лишається eine."],
  ["jahr","temporal-span-fuer-singular","für ein Jahr",nounMeta("neuter","Jahr"),"на рік","Er geht ___ nach Kanada.","Він їде до Канади на рік.","Für + Akkusativ — на який строк (Wie lange?). Das Jahr — середній рід: ein лишається ein."],
  ["monat","temporal-span-fuer-singular","für einen Monat",nounMeta("masculine","Monat"),"на місяць","Wir mieten die Wohnung ___.","Ми наймаємо квартиру на місяць.","Für + Akkusativ — на який строк (Wie lange?). Der Monat — чоловічий рід: ein → einen."],
  ["tage","temporal-span-fuer-plural","für drei Tage",nounMeta("masculine","Tag",{exampleWord:"",plural:"Tage",pluralExampleWord:"Tage"}),"на три дні","Wir fahren ___ an die Ostsee.","Ми їдемо на Балтійське море на три дні.","Für + Akkusativ — на який строк. В Akkusativ множини -n не додається: für drei Tage, але in drei Tagen."],
  ["jahre","temporal-span-fuer-plural","für zwei Jahre",nounMeta("neuter","Jahr",{exampleWord:"",plural:"Jahre",pluralExampleWord:"Jahre"}),"на два роки","Sie geht ___ nach Japan.","Вона їде до Японії на два роки.","Für + Akkusativ — на який строк. В Akkusativ множини -n не додається: für zwei Jahre, але vor zwei Jahren."],
  ["monate","temporal-span-fuer-plural","für sechs Monate",nounMeta("masculine","Monat",{exampleWord:"",plural:"Monate",pluralExampleWord:"Monate"}),"на шість місяців","Er bekommt ein Visum ___.","Він отримує візу на шість місяців.","Für + Akkusativ — на який строк. В Akkusativ множини -n не додається: für sechs Monate, але in sechs Monaten."]
].map(([key,targetId,word,noun,span,promptText,translation,explanation])=>{
  const {category}=temporalSpanTargets[targetId];
  return temporalClozeCard({id:`${targetId}-${key}`,targetId,word,accepted:temporalSpanAnswers(word),promptText,translation,
    studyTranslation:span,explanation,category,noun});
});
const temporalMixedTargets={
  "temporal-mixed-um":{word:"um",meaning:"о … — точний час на годиннику",category:"UM + UHRZEIT"},
  "temporal-mixed-am":{word:"am",meaning:"у / на … — день, частина доби, вихідні",category:"AM + TAG"},
  "temporal-mixed-von":{word:"von",meaning:"з … до … — початок і кінець",category:"VON … BIS"},
  "temporal-mixed-vor-event":{word:"vor",meaning:"перед подією",category:"VOR + DATIV"},
  "temporal-mixed-nach-event":{word:"nach",meaning:"після події",category:"NACH + DATIV"},
  "temporal-mixed-in":{word:"in",meaning:"через … — момент у майбутньому",category:"IN + DATIV"},
  "temporal-mixed-vor-ago":{word:"vor",meaning:"… тому — момент у минулому",category:"VOR + DATIV"},
  "temporal-mixed-fuer":{word:"für",meaning:"на … — запланований строк",category:"FÜR + AKKUSATIV"}
};
// [id, targetId, prompt, Ukrainian sentence, explanation]
const temporalMixedCards=[
  ["kurs","temporal-mixed-um","Der Deutschkurs beginnt ___ 9 Uhr.","Курс німецької починається о 9-й.","Точний час на годиннику — um: um 9 Uhr. Запитання: Um wie viel Uhr?"],
  ["halb-sieben","temporal-mixed-um","Ich stehe jeden Tag ___ halb sieben auf.","Я щодня встаю о пів на сьому.","Точний час на годиннику — um, також для halb: um halb sieben."],
  ["mittag","temporal-mixed-um","Wir essen ___ 13 Uhr zu Mittag.","Ми обідаємо о 13-й.","Точний час на годиннику — um: um 13 Uhr."],
  ["montag","temporal-mixed-am","Ich habe ___ Montag frei.","У понеділок я вільний / вільна.","День тижня — am (an + dem): am Montag."],
  ["wochenende","temporal-mixed-am","Wir gehen ___ Wochenende ins Kino.","На вихідних ми йдемо в кіно.","Вихідні — am Wochenende: am = an + dem, бо das Wochenende."],
  ["abend","temporal-mixed-am","Er trinkt ___ Abend einen Tee.","Увечері він п’є чай.","Частина доби — am: am Morgen, am Abend. Виняток: in der Nacht."],
  ["baeckerei","temporal-mixed-von","Die Bäckerei ist ___ 7 bis 18 Uhr geöffnet.","Пекарня відчинена з 7-ї до 18-ї.","Початок і кінець проміжку — von … bis: von 7 bis 18 Uhr."],
  ["kurs","temporal-mixed-von","Der Kurs dauert ___ Montag bis Freitag.","Курс триває з понеділка до п’ятниці.","Початок і кінець проміжку — von … bis: von Montag bis Freitag."],
  ["ferien","temporal-mixed-von","Wir haben ___ Juli bis August Ferien.","З липня до серпня в нас канікули.","Початок і кінець проміжку — von … bis: von Juli bis August."],
  ["unterricht","temporal-mixed-vor-event","Ich trinke ___ dem Unterricht einen Kaffee.","Перед уроком я п’ю каву.","«Перед подією» — vor + Dativ: vor dem Unterricht."],
  ["film","temporal-mixed-vor-event","Wir essen ___ dem Film eine Pizza.","Перед фільмом ми їмо піцу.","«Перед подією» — vor + Dativ: vor dem Film."],
  ["interview","temporal-mixed-vor-event","Er ist ___ dem Interview nervös.","Він нервує перед співбесідою.","«Перед подією» — vor + Dativ: vor dem Interview."],
  ["kurs","temporal-mixed-nach-event","Ich gehe ___ dem Kurs schwimmen.","Після курсу я йду плавати.","«Після події» — nach + Dativ: nach dem Kurs."],
  ["arbeit","temporal-mixed-nach-event","Sie ruft mich ___ der Arbeit an.","Вона телефонує мені після роботи.","«Після події» — nach + Dativ: nach der Arbeit."],
  ["essen","temporal-mixed-nach-event","Wir trinken ___ dem Essen einen Espresso.","Після їжі ми п’ємо еспресо.","«Після події» — nach + Dativ: nach dem Essen."],
  ["minuten","temporal-mixed-in","Der Zug kommt ___ zehn Minuten.","Потяг прибуде через десять хвилин.","«Через» (у майбутньому) — in + Dativ: in zehn Minuten."],
  ["meer","temporal-mixed-in","Wir fahren ___ zwei Wochen ans Meer.","Через два тижні ми їдемо на море.","«Через» (у майбутньому) — in + Dativ: in zwei Wochen."],
  ["geburtstag","temporal-mixed-in","Ich habe ___ drei Tagen Geburtstag.","Через три дні в мене день народження.","«Через» (у майбутньому) — in + Dativ з -n у множині: in drei Tagen."],
  ["gesehen","temporal-mixed-vor-ago","Ich habe ihn ___ zwei Tagen gesehen.","Я бачив / бачила його два дні тому.","«… тому» (у минулому) — vor + Dativ з -n у множині: vor zwei Tagen."],
  ["hund","temporal-mixed-vor-ago","Sie hat ___ einem Monat einen Hund gekauft.","Вона купила собаку місяць тому.","«… тому» (у минулому) — vor + Dativ: vor einem Monat."],
  ["gegessen","temporal-mixed-vor-ago","Wir haben ___ einer Stunde gegessen.","Ми поїли годину тому.","«… тому» (у минулому) — vor + Dativ: vor einer Stunde."],
  ["bei-uns","temporal-mixed-fuer","Er bleibt ___ eine Woche bei uns.","Він залишається в нас на тиждень.","«На» який строк (Wie lange?) — für + Akkusativ: für eine Woche."],
  ["deutschland","temporal-mixed-fuer","Ich gehe ___ ein Jahr nach Deutschland.","Я їду до Німеччини на рік.","«На» який строк (Wie lange?) — für + Akkusativ: für ein Jahr."],
  ["auto","temporal-mixed-fuer","Wir mieten ___ drei Tage ein Auto.","Ми беремо машину напрокат на три дні.","«На» який строк (Wie lange?) — für + Akkusativ без -n: für drei Tage."]
].map(([key,targetId,promptText,translation,explanation])=>{
  const {word,meaning,category}=temporalMixedTargets[targetId];
  return temporalClozeCard({id:`${targetId}-${key}`,targetId,word,promptText,translation,studyTranslation:meaning,explanation,category});
});
// [id, targetId, canonical sentence, other valid order, chunks, Ukrainian sentence, structure, explanation]
const temporalSentenceCards=[
  ["fitnessstudio","temporal-sentence-time-first","Nach der Arbeit gehe ich ins Fitnessstudio.","Ich gehe nach der Arbeit ins Fitnessstudio.","ins Fitnessstudio / ich / gehen / nach der Arbeit","Після роботи я йду в спортзал.",mainClause("Nach der Arbeit","gehe","ich ins Fitnessstudio"),"Вираз часу на першому місці → gehe лишається другим, ich стоїть після нього. Ich на початку теж правильно."],
  ["fruehstueck","temporal-sentence-time-first","Vor dem Frühstück joggt sie.","Sie joggt vor dem Frühstück.","joggen / vor dem Frühstück / sie","Перед сніданком вона бігає.",mainClause("Vor dem Frühstück","joggt","sie"),"Вираз часу на першому місці → joggt лишається другим, sie стоїть після нього. Sie на початку теж правильно."],
  ["spanien","temporal-sentence-time-first","In zwei Wochen fliegen wir nach Spanien.","Wir fliegen in zwei Wochen nach Spanien.","nach Spanien / wir / in zwei Wochen / fliegen","Через два тижні ми летимо до Іспанії.",mainClause("In zwei Wochen","fliegen","wir nach Spanien"),"Вираз часу на першому місці → fliegen лишається другим, wir — після нього. Напрямок nach Spanien стоїть у кінці."],
  ["aufstehen","temporal-sentence-separable","Ich stehe um 7 Uhr auf.","Um 7 Uhr stehe ich auf.","aufstehen / um 7 Uhr / ich","Я встаю о 7-й.",mainClause("Ich","stehe","um 7 Uhr","auf"),"Aufstehen відокремлюється: stehe на другому місці, префікс auf — у кінці. Um 7 Uhr може стояти й на початку."],
  ["einkaufen","temporal-sentence-separable","Wir kaufen am Samstag ein.","Am Samstag kaufen wir ein.","am Samstag / einkaufen / wir","У суботу ми робимо покупки.",mainClause("Wir","kaufen","am Samstag","ein"),"Einkaufen відокремлюється: kaufen на другому місці, префікс ein — у кінці. Am Samstag може стояти й на початку."],
  ["anfangen","temporal-sentence-separable","Der Film fängt um 20 Uhr an.","Um 20 Uhr fängt der Film an.","um 20 Uhr / der Film / anfangen","Фільм починається о 20-й.",mainClause("Der Film","fängt","um 20 Uhr","an"),"Anfangen відокремлюється й змінює a → ä: fängt на другому місці, an — у кінці."],
  ["umziehen","temporal-sentence-perfekt","Ich bin vor einer Woche umgezogen.","Vor einer Woche bin ich umgezogen.","umziehen / vor einer Woche / ich","Я переїхав / переїхала тиждень тому. (Perfekt)",mainClause("Ich","bin","vor einer Woche","umgezogen"),"Perfekt: bin на другому місці, Partizip II umgezogen — у кінці. Vor einer Woche стоїть між ними або на початку."],
  ["deutschland","temporal-sentence-perfekt","Er ist vor zwei Jahren nach Deutschland gekommen.","Vor zwei Jahren ist er nach Deutschland gekommen.","nach Deutschland / er / kommen / vor zwei Jahren","Він приїхав до Німеччини два роки тому. (Perfekt)",mainClause("Er","ist","vor zwei Jahren nach Deutschland","gekommen"),"Perfekt: ist на другому місці, gekommen — у кінці. Час стоїть перед напрямком: vor zwei Jahren nach Deutschland."],
  ["gegessen","temporal-sentence-perfekt","Ich habe vor zwei Stunden gegessen.","Vor zwei Stunden habe ich gegessen.","essen / ich / vor zwei Stunden","Я їв / їла дві години тому. (Perfekt)",mainClause("Ich","habe","vor zwei Stunden","gegessen"),"Perfekt: habe на другому місці, Partizip II gegessen — у кінці. Vor zwei Stunden — між ними або на початку."],
  ["urlaub","temporal-sentence-duration","Ich habe für zwei Wochen Urlaub.","Für zwei Wochen habe ich Urlaub.","Urlaub / ich / für zwei Wochen / haben","У мене відпустка на два тижні.",mainClause("Ich","habe","für zwei Wochen Urlaub"),"Habe стоїть на другому місці; für zwei Wochen — перед Urlaub або на початку речення."],
  ["eltern","temporal-sentence-duration","Meine Eltern kommen für eine Woche zu uns.","Für eine Woche kommen meine Eltern zu uns.","zu uns / für eine Woche / meine Eltern / kommen","Мої батьки приїжджають до нас на тиждень.",mainClause("Meine Eltern","kommen","für eine Woche zu uns"),"Kommen стоїть на другому місці. Час іде перед напрямком: für eine Woche zu uns."],
  ["hamburg","temporal-sentence-duration","Mein Bruder kommt für drei Tage nach Hamburg.","Für drei Tage kommt mein Bruder nach Hamburg.","nach Hamburg / mein Bruder / kommen / für drei Tage","Мій брат приїжджає до Гамбурга на три дні.",mainClause("Mein Bruder","kommt","für drei Tage nach Hamburg"),"Kommt стоїть на другому місці. Час іде перед напрямком: für drei Tage nach Hamburg."],
  ["arbeiten","temporal-sentence-range","Ich arbeite von 9 bis 17 Uhr.","Von 9 bis 17 Uhr arbeite ich.","arbeiten / von 9 bis 17 Uhr / ich","Я працюю з 9-ї до 17-ї.",mainClause("Ich","arbeite","von 9 bis 17 Uhr"),"Arbeite стоїть на другому місці. Von 9 bis 17 Uhr — один вираз часу, тому з ним на початку дієслово теж друге."],
  ["schule","temporal-sentence-range","Die Kinder gehen von Montag bis Freitag in die Schule.","Von Montag bis Freitag gehen die Kinder in die Schule.","in die Schule / die Kinder / von Montag bis Freitag / gehen","Діти ходять до школи з понеділка до п’ятниці.",mainClause("Die Kinder","gehen","von Montag bis Freitag in die Schule"),"Gehen стоїть на другому місці. Час іде перед напрямком: von Montag bis Freitag in die Schule."],
  ["pause","temporal-sentence-range","Wir machen von 12 bis 13 Uhr Pause.","Von 12 bis 13 Uhr machen wir Pause.","Pause / wir / machen / von 12 bis 13 Uhr","З 12-ї до 13-ї в нас перерва.",mainClause("Wir","machen","von 12 bis 13 Uhr Pause"),"Machen стоїть на другому місці, Pause як частина виразу Pause machen — після часу."]
].map(([key,targetId,word,alternative,promptText,translation,structure,explanation])=>({
  id:`${targetId}-${key}`,targetId,type:"sentence-build",word,promptText,support:translation,translation,
  example:alternative,exampleTranslation:translation,explanation,category:"TEMPORALE PRÄPOSITION · SATZBAU",structure:[structure],
  response:temporalResponse([word,alternative],"sentence")
}));
const temporalPrepositionCards=[...temporalEventCards,...temporalSpanCards,...temporalMixedCards,...temporalSentenceCards];
const temporalPracticeStep=(...args)=>({...lessonStep(...args),categoryBeforeCheck:temporalPracticeCategory});
const temporalPrepositionStages=[
  lessonStep("temporal-event-learn","Вивчення: перед і після події","Вивчіть vor (перед) і nach (після) з назвою події. Обидва вимагають Dativ: dem, der або den і -n у множині.",temporalEventCards,"learn","Перед і після події · vor, nach","Вивчення"),
  temporalPracticeStep("temporal-event-practice","Практика: перед і після події","Впишіть прийменник і артикль у Dativ. Значення підказує контекст, артикль — рід або множина іменника.",temporalEventCards,"input","Перед і після події · vor, nach","Практика"),
  lessonStep("temporal-span-learn","Вивчення: тому, через, на","Порівняйте vor (тому) та in (через) з Dativ і für (на який строк) з Akkusativ. Зверніть увагу на -n у Dativ множини.",temporalSpanCards,"learn","Тому, через, на · vor, in, für","Вивчення"),
  temporalPracticeStep("temporal-span-practice","Практика: тому, через, на","Напишіть увесь вираз часу: прийменник, артикль або число та іменник. Після vor і in — Dativ, після für — Akkusativ.",temporalSpanCards,"input","Тому, через, на · vor, in, für","Практика"),
  lessonStep("temporal-mixed-learn","Вивчення: усі прийменники часу","Порівняйте вісім моделей у контексті: um, am, von … bis, vor, nach, in і für.",temporalMixedCards,"learn","Змішані прийменники часу","Вивчення"),
  temporalPracticeStep("temporal-mixed-practice","Змішана практика прийменників часу","Самостійно оберіть один прийменник за значенням речення: точний час, день, проміжок, перед, після, тому, через чи на строк.",temporalMixedCards,"input","Змішані прийменники часу","Практика"),
  lessonStep("temporal-sentences-learn","Вивчення: речення з виразами часу","Подивіться, де стоїть вираз часу. Він може починати речення, але відмінюване дієслово завжди лишається на другому місці.",temporalSentenceCards,"learn","Речення з виразами часу","Вивчення"),
  lessonStep("temporal-sentences-practice","Побудова речень з виразами часу","Складіть повне речення з фрагментів: відмініть дієслово й поставте його на друге місце, а префікс чи Partizip II — у кінець.",temporalSentenceCards,"input","Речення з виразами часу","Практика")
];
const pastVerbGuide=level=>{
  const a1=level==="A1";
  return {
    title:a1?"Минулий час A1: Perfekt":"Минулий час "+level+": Präteritum і Perfekt",
    intro:a1?"На A1 основним минулим часом для розмови є Perfekt. Präteritum потрібен лише для високочастотних haben і sein.":`Вивчайте дієслова рівня ${level} як повний набір форм, щоб упізнавати минулий час у текстах і вживати Perfekt у розмові.`,
    rules:a1?[
      {title:"Perfekt — головна форма A1",detail:"Perfekt складається з haben або sein та Partizip II.",formula:"hat gefunden · ist gegangen"},
      {title:"Haben або sein",detail:"Дієслова руху та зміни стану часто утворюють Perfekt із sein; більшість інших дієслів — із haben.",formula:"ist gefahren · hat gearbeitet",visual:{auxiliary:{}}},
      {title:"Präteritum: лише sein і haben",detail:"Ці дві дуже часті форми вивчайте для розуміння й коротких повідомлень.",formula:"sein → war · haben → hatte"}
    ]:[
      {title:"Präteritum",detail:"Ця проста форма минулого часу часто трапляється в письмових текстах і розповідях.",formula:"gehen → ging · finden → fand"},
      {title:"Perfekt",detail:"Perfekt складається з haben або sein та Partizip II.",formula:"hat gefunden · ist gegangen"},
      {title:"Haben або sein",detail:"Дієслова руху та зміни стану зазвичай утворюють Perfekt з sein; деякі дієслова допускають обидва допоміжні дієслова залежно від значення.",formula:"ist gefahren · hat das Auto gefahren",visual:{auxiliary:{}}},
      {title:"Упізнавайте форми в парі",detail:"Під час практики вводьте спочатку Präteritum, а потім Perfekt через похилу риску.",formula:"begann / hat begonnen"}
    ]
  };
};
// Wrong-answer explanations for legacy cards, keyed by stable targetId.
const cardExplanations={
  // pronouns
  "pronouns-practice:ich:n5xkpm":"Займенник «я» — ich. Його видно й з дієслова: закінчення -e (ich lerne) вживається лише з ich.",
  "pronouns-practice:du:hfli1i":"Неофіційне «ти» — du. Форма bist від sein вживається лише з du: du bist.",
  "pronouns-practice:er:tvqxc9":"Займенник «він» — er. Закінчення -t (er kommt) вказує на 3-тю особу однини: er, sie, es.",
  "pronoun-feminine-sie":"Займенник «вона» — sie, дієслово в 3-й особі однини: sie heißt. Ввічливе Sie має форму на -en: Sie heißen.",
  "pronouns-practice:es:8jxwk2":"Займенник «воно» — es. У безособових реченнях про погоду й стан (Es ist kalt) es обов’язкове, хоча в українській підмета немає.",
  "pronouns-practice:wir:1xlzjah":"Займенник «ми» — wir, дієслово із закінченням -en: wir wohnen. Не плутати з ihr — це «ви».",
  "pronouns-practice:ihr:16nf779":"Неофіційне «ви» до кількох людей — ihr, від sein форма seid: ihr seid. Ввічливе «Ви» — Sie.",
  "pronoun-formal-sie":"Ввічливе «Ви» — Sie з великої літери навіть усередині речення. Дієслово має форму як у множині: heißen Sie.",
  // possessives
  "possessives-stems-recall:mein:tdavqc":"«Мій» — mein. Bruder чоловічого роду (der Bruder), тому в Nominativ без закінчення: mein Bruder.",
  "possessives-stems-recall:dein:1m6lwmq":"«Твій» — dein (від du). Buch середнього роду (das Buch), тому без закінчення: dein Buch, а не deine.",
  "possessives-stems-recall:sein:1r0qus":"«Його» — sein (від er або es). Auto середнього роду (das Auto), тому без закінчення: sein Auto.",
  "possessive-her":"«Її» — ihr з малої літери. Tasche жіночого роду (die Tasche), тому додаємо -e: ihre Tasche. Ввічливе Ihr пишеться з великої.",
  "possessives-stems-recall:unser:35ilr6":"«Наш» — unser; -er тут частина основи, а не закінчення. Kurs чоловічого роду (der Kurs), тому в Nominativ: unser Kurs.",
  "possessives-stems-recall:euer:1mathrq":"«Ваш» до кількох людей на «ти» — euer (від ihr). Haus середнього роду, тому без закінчення: euer Haus. З -e основа скорочується: eure.",
  "possessives-stems-recall:ihr:1qswyd7":"Ввічливе «Ваш» — Ihr з великої літери навіть усередині речення. Name чоловічого роду (der Name), тому без закінчення: Ihr Name.",
  "possessive-their":"«Їхній» — ihr з малої літери, як і «її». Kinder — множина, тому додаємо -e: ihre Kinder. Ввічливе Ihre пишеться з великої.",
  "possessives-endings-recall:meine:wayv0n":"Закінчення залежить від роду німецького іменника. Mutter жіночого роду (die Mutter), тому mein + -e: meine Mutter.",
  "possessives-endings-recall:deine:1dis4nn":"Freunde — множина, тому dein + -e: deine Freunde. Без закінчення лише з іменниками der/das у Nominativ: dein Freund.",
  "possessives-endings-recall:unsere:1gcwhhg":"Wohnung жіночого роду (die Wohnung), тому unser + -e: unsere Wohnung.",
  "possessives-endings-recall:ihre:1l3xyqi":"Kinder — множина, тому Ihr + -e: Ihre Kinder. Ввічливе Ihre пишеться з великої літери навіть усередині речення.",
  // sein
  "sein-practice:ich-bin:1nn9vxn":"Sein — неправильне дієслово, форми треба запам’ятати. Для ich: ich bin, а не ich ist.",
  "sein-practice:du-bist:1yrpe5e":"Для du дієслово sein має особливу форму bist: du bist, а не du ist.",
  "sein-practice:er-sie-es-ist:11vpg9r":"У 3-й особі однини sein має одну форму ist для er, sie і es: er ist, sie ist, es ist.",
  "sein-practice:wir-sind:1ndejqm":"Для wir дієслово sein має форму sind: wir sind, а не wir sein. Така сама форма для sie та Sie.",
  "sein-practice:ihr-seid:1k0piby":"Для ihr дієслово sein має форму seid із -d у кінці: ihr seid. Не плутати з seit (від, з — про час).",
  "sein-practice:sie-sie-sind:1lkuytj":"Для sie («вони») і ввічливого Sie дієслово sein має однакову форму sind: sie sind, Sie sind.",
  // conjugation
  "conjugation-regular-recall:ich-mache:1dezuid":"Після ich до основи mach- додаємо -e: ich mache.",
  "conjugation-regular-recall:du-machst:dhtqrc":"Після du до основи mach- додаємо -st: du machst.",
  "conjugation-regular-recall:er-sie-es-macht:1xyj2ti":"Для er, sie, es до основи mach- додаємо -t: er macht, sie macht, es macht.",
  "conjugation-regular-recall:wir-machen:wi7ogp":"Після wir закінчення -en, форма збігається з Infinitiv: wir machen.",
  "conjugation-regular-recall:ihr-macht:ga0paq":"Після ihr до основи mach- додаємо -t: ihr macht. Форма збігається з er macht, але це інша особа.",
  "conjugation-regular-recall:sie-sie-machen:hc5a9":"Для sie («вони») і ввічливого Sie закінчення -en, як в Infinitiv: sie machen, Sie machen.",
  "conjugation-extra-e-recall:ich-arbeite:1w440j8":"Після ich до основи arbeit- додаємо лише -e: ich arbeite. Додаткове -e- потрібне тільки перед -st і -t.",
  "conjugation-extra-e-recall:du-arbeitest:1m7a668":"Основа arbeit- закінчується на -t, тому перед -st вставляємо -e-: du arbeitest, а не du arbeitst.",
  "conjugation-extra-e-recall:er-sie-es-arbeitet:qie8fp":"Основа arbeit- закінчується на -t, тому перед закінченням -t вставляємо -e-: er arbeitet, а не er arbeitt.",
  "conjugation-extra-e-recall:wir-arbeiten:d06o52":"Після wir закінчення -en, як в Infinitiv: wir arbeiten. Додаткове -e- тут не потрібне.",
  "conjugation-extra-e-recall:ihr-arbeitet:1xc29j4":"Основа arbeit- закінчується на -t, тому для ihr перед -t вставляємо -e-: ihr arbeitet.",
  "conjugation-extra-e-recall:sie-sie-arbeiten:l946xq":"Для sie («вони») і ввічливого Sie закінчення -en, як в Infinitiv: sie arbeiten, Sie arbeiten.",
  "conjugation-extra-e-recall:du-atmest:hi8mu":"Основа atm- закінчується на приголосний + m, тому перед -st вставляємо -e-: du atmest, а не du atmst.",
  "conjugation-extra-e-recall:er-sie-es-landet:r22lif":"Основа land- закінчується на -d, тому перед -t вставляємо -e-: er landet, а не er landt.",
  "conjugation-extra-e-recall:ihr-rechnet:a1w8c9":"Основа rechn- закінчується на приголосний + n, тому перед -t вставляємо -e-: ihr rechnet, а не ihr rechnt.",
  "conjugation-sibilants-recall:du-hei-t:w9q849":"Основа heiß- закінчується на ß, тому для du додаємо лише -t: du heißt, а не du heißst.",
  "conjugation-sibilants-recall:du-tanzt:vtpyao":"Основа tanz- закінчується на z, тому для du додаємо лише -t: du tanzt, а не du tanzst.",
  "conjugation-sibilants-recall:du-ubersetzt:9tqdkj":"Основа übersetz- закінчується на z, тому для du додаємо лише -t: du übersetzt, а не du übersetzst.",
  // strong-verbs
  "strong-verbs-practice:spreche:1qss8r1":"Для ich у sprechen голосна не змінюється: основа sprech- + -e. Заміна e → i буває лише у du та er/sie/es, тому не spriche.",
  "strong-verbs-practice:sprichst:k4xv9n":"Sprechen для du змінює голосну e → i і додає -st: du sprichst, а не sprechst.",
  "strong-verbs-practice:spricht:m7toxa":"Meine Freundin = sie (3-тя особа однини), тому sprechen змінює e → i і додає -t: spricht, а не sprecht.",
  "strong-verbs-practice:sprechen:o6yogt":"Для wir форма збігається з Infinitiv: wir sprechen. Заміна e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:sprecht:1qtm9wv":"Для ihr: основа sprech- + -t = sprecht. Голосна не змінюється, бо e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:sprechen:gcjg4":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie sprechen, без заміни e → i.",
  "strong-verbs-practice:fahre:1lw3uzh":"Для ich у fahren голосна не змінюється: fahr- + -e = fahre. Umlaut a → ä буває лише у du та er/sie/es.",
  "strong-verbs-practice:fahrst:13yq5j2":"Fahren для du отримує Umlaut a → ä і закінчення -st: du fährst, а не fahrst.",
  "strong-verbs-practice:fahrt:shggy4":"Der Zug = er, тому a → ä і закінчення -t: fährt. Ab — trennbares Präfix від abfahren, воно стоїть у кінці речення.",
  "strong-verbs-practice:fahren:v7o2v0":"Для wir форма збігається з Infinitiv: wir fahren. Umlaut a → ä буває лише у du та er/sie/es.",
  "strong-verbs-practice:fahrt:5vacxm":"Для ihr: основа fahr- + -t = fahrt, без Umlaut. Форма fährt з ä належить er/sie/es.",
  "strong-verbs-practice:fahren:wrkl3o":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie fahren, без Umlaut a → ä.",
  "strong-verbs-practice:treffe:b6g0t0":"Для ich у treffen голосна не змінюється: treff- + -e = treffe. Заміна e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:triffst:1cm0zmf":"Treffen для du змінює e → i і додає -st: du triffst, а не treffst. Подвоєне ff зберігається.",
  "strong-verbs-practice:trifft:1tjy6cd":"Для er у treffen голосна змінюється e → i, а закінчення -t: er trifft, а не trefft.",
  "strong-verbs-practice:treffen:1joigkd":"Для wir форма збігається з Infinitiv: wir treffen uns. Заміна e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:trefft:7x64lw":"Для ihr: основа treff- + -t = trefft, без заміни e → i. Форма trifft належить er/sie/es.",
  "strong-verbs-practice:treffen:y39aak":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie treffen, без заміни e → i.",
  "strong-verbs-practice:lese:89xpiy":"Для ich у lesen голосна не змінюється: les- + -e = lese. Заміна e → ie буває лише у du та er/sie/es.",
  "strong-verbs-practice:liest:1o6h0jl":"Lesen для du змінює e → ie. Основа закінчується на -s, тому додаємо лише -t: du liest, а не liesst.",
  "strong-verbs-practice:liest:1f383hg":"Meine Mutter = sie (3-тя особа однини), тому lesen змінює e → ie і додає -t: liest, а не lest.",
  "strong-verbs-practice:lesen:xaetnb":"Для wir форма збігається з Infinitiv: wir lesen. Заміна e → ie буває лише у du та er/sie/es.",
  "strong-verbs-practice:lest:yu1flz":"Для ihr: основа les- + -t = lest, без заміни e → ie. Форма liest належить du та er/sie/es.",
  "strong-verbs-practice:lesen:1dwxc6a":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie lesen, без заміни e → ie.",
  "strong-verbs-practice:esse:1t6sdlp":"Для ich у essen голосна не змінюється: ess- + -e = esse. Заміна e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:isst:3gz5wd":"Essen для du змінює e → i. Основа закінчується на -ss, тому додаємо лише -t: du isst, а не essst.",
  "strong-verbs-practice:isst:1fnhfb3":"Для er у essen голосна змінюється e → i і додається -t: er isst, а не esst. Форма збігається з du isst.",
  "strong-verbs-practice:essen:27xgg1":"Для wir форма збігається з Infinitiv: wir essen. Заміна e → i буває лише у du та er/sie/es.",
  "strong-verbs-practice:esst:17hwmfx":"Для ihr: основа ess- + -t = esst, без заміни e → i. Форма isst належить du та er/sie/es.",
  "strong-verbs-practice:essen:1e9bc9a":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie essen, без заміни e → i.",
  "strong-verbs-practice:wei:1t34axh":"Wissen в однині має основу weiß-. Для ich закінчення немає, як у модальних дієслів: ich weiß, а не wisse.",
  "strong-verbs-practice:wei-t:1527zcg":"Для du wissen має основу weiß-. Після ß додаємо лише -t: du weißt, а не weißst.",
  "strong-verbs-practice:wei:13y1psy":"Sie тут означає «вона». Для er/sie/es wissen не має закінчення -t: sie weiß, так само як ich weiß.",
  "strong-verbs-practice:wissen:1wjyb2o":"У множині wissen повертається до основи wiss-: wir wissen. Основа weiß- буває лише в однині.",
  "strong-verbs-practice:wisst:587i91":"Для ihr: основа wiss- + -t = wisst. Основа weiß- буває лише в однині: ich weiß, du weißt.",
  "strong-verbs-practice:wissen:52pz6s":"Sie тут означає «вони», тому форма збігається з Infinitiv: sie wissen. Основа weiß- буває лише в однині.",
  "strong-verbs-practice:fange-an:d1x36t":"Для ich у anfangen голосна не змінюється: ich fange. Trennbares Präfix an стоїть у кінці речення.",
  "strong-verbs-practice:fangst-an:1s010yk":"Anfangen для du отримує Umlaut a → ä і -st: du fängst. Trennbares Präfix an стоїть у кінці речення.",
  "strong-verbs-practice:fangt-an:1sh3yrl":"Der Kurs = er, тому a → ä і закінчення -t: fängt. Trennbares Präfix an стоїть у кінці речення.",
  "strong-verbs-practice:fangen-an:2da53u":"Для wir: wir fangen, без Umlaut a → ä, бо він буває лише у du та er/sie/es. Trennbares Präfix an стоїть у кінці речення.",
  "strong-verbs-practice:fangt-an:1c6auuh":"Для ihr: fang- + -t = fangt, без Umlaut. Форма fängt належить er/sie/es. Trennbares Präfix an стоїть у кінці речення.",
  "strong-verbs-practice:fangen-an:w3qe1y":"Sie тут означає «вони»: sie fangen, без Umlaut a → ä. Trennbares Präfix an стоїть у кінці речення.",
  // past-verbs
  "past-verbs-practice:hat-begonnen:12pi2pc":"Beginnen утворює Perfekt з haben. Partizip II begonnen не має ge-, бо префікс be- ненаголошений; голосна i → o і закінчення -en.",
  "past-verbs-practice:ist-geblieben:1igr0h6":"Bleiben утворює Perfekt із sein, хоча не означає руху: ist geblieben. Partizip II: ge- + blieb- + -en, ei → ie.",
  "past-verbs-practice:hat-gebracht:1u73irf":"Bringen — змішане дієслово: основа змінюється на brach- і отримує ge-…-t, gebracht, а не gebringt. Perfekt — з haben.",
  "past-verbs-practice:hat-gedacht:7igiat":"Denken — змішане дієслово: основа змінюється на dach- і отримує ge-…-t, gedacht, а не gedenkt. Perfekt — з haben.",
  "past-verbs-practice:hat-gedurft:po2srh":"Модальне dürfen як самостійне дієслово має Partizip II gedurft: ge- + -t, без Umlaut ü. Perfekt — з haben.",
  "past-verbs-practice:hat-gegessen:ty0r1c":"Essen утворює Perfekt з haben. Partizip II нерегулярний, з додатковим -g-: gegessen, а не geesst.",
  "past-verbs-practice:ist-gefahren:4beqjh":"Fahren означає рух, тому Perfekt із sein: ist gefahren. Partizip II: ge- + fahr- + -en, без Umlaut.",
  "past-verbs-practice:hat-gefangen:1b7bfcw":"Fangen не означає руху, тому Perfekt з haben. Partizip II gefangen: ge- + -en, голосна a не змінюється.",
  "past-verbs-practice:hat-gefunden:1ggt7re":"Finden утворює Perfekt з haben. Partizip II сильного дієслова: голосна i → u і закінчення -en, gefunden.",
  "past-verbs-practice:ist-geflogen:m3e0m0":"Fliegen означає рух, тому Perfekt із sein: ist geflogen. Partizip II: голосна ie → o і закінчення -en.",
  "past-verbs-practice:hat-gegeben:1hhyk1b":"Geben утворює Perfekt з haben. Partizip II: ge- + geb- + -en = gegeben, голосна не змінюється, а не gegebt.",
  "past-verbs-practice:ist-gegangen:xdsi7s":"Gehen означає рух, тому Perfekt із sein: ist gegangen. Partizip II нерегулярний: основа gang- + -en, а не gegeht.",
  "past-verbs-practice:hatte-hat-gehabt:365jka":"Präteritum від haben — hatte (ha- + -tte, не habte). Perfekt — hat gehabt: haben як допоміжне дієслово і Partizip II ge-hab-t.",
  "past-verbs-practice:hat-gehei-en:1vjfptf":"Heißen утворює Perfekt з haben. Partizip II сильного дієслова: ge- + heiß- + -en = geheißen, а не geheißt.",
  "past-verbs-practice:hat-geholfen:dt1cq1":"Helfen утворює Perfekt з haben. Partizip II сильного дієслова: голосна e → o і закінчення -en, geholfen, а не geholft.",
  "past-verbs-practice:hat-gekannt:16qhew0":"Kennen — змішане дієслово: голосна e → a і ge-…-t, gekannt, а не gekennt. Perfekt — з haben.",
  "past-verbs-practice:ist-gekommen:1eb72l0":"Kommen означає рух, тому Perfekt із sein: ist gekommen. Partizip II: ge- + komm- + -en, а не gekommt.",
  "past-verbs-practice:hat-gekonnt:1uj3jzb":"Модальне können як самостійне дієслово має Partizip II gekonnt: ge- + -t, без Umlaut ö. Perfekt — з haben.",
  // present-practice
  "present-form-1:gehst:17xvciu":"Підмет du вимагає закінчення -st: geh + st = gehst. У W-Frage дієслово стоїть на другому місці, одразу після Wohin.",
  "present-form-1:machst:codrz9":"Після du додаємо -st до основи: mach + st = machst. Дієслово стоїть на другому місці після Was.",
  "present-form-1:geht:13bhzw8":"У звороті Wie geht es dir? підмет — es, а не du, тому форма третьої особи: geh + t = geht.",
  "present-form-1:liegt:tpgk6h":"Підмет das Buch = es, тобто третя особа однини: lieg + t = liegt. Дієслово стоїть на другому місці після Wo.",
  "present-form-1:hei-en:1m29nus":"Ввічливе Sie має форму, що збігається з Infinitiv: heißen. Закінчення -en, як і для wir та sie (вони).",
  "present-form-1:arbeitest:1l6siot":"Після du додаємо -st, але основа arbeit- закінчується на -t, тому вставляємо -e-: arbeitest, а не arbeitst.",
  "present-form-1:kommst:1djehqs":"Німецькою питають Woher kommst du? Підмет du вимагає -st: komm + st = kommst.",
  "present-form-1:fahren:5yuw05":"Sie тут означає «вони», тому закінчення -en: fahren. Umlaut a → ä з’являється лише для du та er/sie/es: fährst, fährt.",
  "present-form-1:machst:1hc7fow":"Після du додаємо -st до основи: mach + st = machst. Дієслово стоїть на другому місці після Was.",
  "present-form-2:arbeitet:yv90o4":"Mein Vater = er, тому потрібне -t. Основа arbeit- закінчується на -t, тож вставляємо -e-: arbeitet, а не arbeitt.",
  "present-form-2:schlafen:glerz9":"Die Kinder = sie (вони), тому закінчення -en: schlafen. Umlaut a → ä буває лише для du та er/sie/es: schläfst, schläft.",
  "present-form-2:helfen:1oa7lvl":"Після wir дієслово має закінчення -en: helfen. Зміна e → i буває лише для du та er/sie/es: hilfst, hilft.",
  "present-form-2:kauft:p4j1r2":"Після er додаємо -t до основи: kauf + t = kauft.",
  "present-form-2:hei-t-arbeitet:12hgmmk":"Обидва дієслова стоять після er, тому мають -t: heißt. Основа arbeit- закінчується на -t, тож додаємо -e-: arbeitet.",
  "present-form-2:fahren:1kcnkil":"Після wir закінчення -en: fahren. Umlaut a → ä з’являється лише для du та er/sie/es: fährst, fährt.",
  "present-form-2:geht:1vux3qx":"Після er додаємо -t до основи: geh + t = geht.",
  "present-form-2:hei-e:rptuan":"Після ich додаємо -e до основи: heiß + e = heiße.",
  "present-form-2:ist:1en3gsz":"Sein — неправильне дієслово: ich bin, du bist, er/sie/es ist. Eva = sie, тому ist.",
  "present-form-3:ist:1qi1cp9":"Sein — неправильне дієслово: ich bin, du bist, er/sie/es ist. Meine Mutter = sie, тому ist.",
  "present-form-3:wohnen:tz5525":"Після wir дієслово має закінчення -en, як в Infinitiv: wohnen.",
  "present-form-3:arbeitet:tuk0g8":"Mein Mann = er, тому потрібне -t. Основа arbeit- закінчується на -t, тож вставляємо -e-: arbeitet.",
  "present-form-3:besteht:1i2tyuk":"Meine Familie = sie (вона), тому -t: besteht. Префікс be- невідокремлюваний і лишається при дієслові.",
  "present-form-3:arbeitet:3ybtp":"Meine Mutter = sie (вона), тому потрібне -t. Основа arbeit- закінчується на -t, тож вставляємо -e-: arbeitet.",
  "present-form-3:gehen:1k6fykq":"Am Samstag стоїть на першому місці, тому дієслово йде другим, а підмет wir — після нього. Для wir закінчення -en: gehen.",
  "present-form-3:arbeite:17d4a70":"Після ich додаємо лише -e: arbeite. Вставне -e- потрібне тільки перед -st/-t: du arbeitest, er arbeitet.",
  "present-form-3:wartet:yhht9m":"Після er потрібне -t, але основа wart- закінчується на -t, тому вставляємо -e-: wartet, а не wartt.",
  "present-form-3:finde:gc4905":"Після ich додаємо -e: finde. Вставне -e- після -d потрібне лише для du findest, er findet.",
  "present-form-4:bittet:6q6wlo":"Sie тут означає «вона», тому -t. Основа bitt- закінчується на -t, тож вставляємо -e-: bittet.",
  "present-form-4:gru-t:1ks5ybh":"Після er додаємо -t: grüß + t = grüßt. Основа на -ß, тому й du grüßt, без -st.",
  "present-form-4:heiratet:1rmkw8":"Для ihr закінчення -t, але основа heirat- закінчується на -t, тому вставляємо -e-: heiratet.",
  "present-form-4:tanzt:7okh6c":"Mein Bruder = er, тому -t: tanz + t = tanzt. Основа на -z, тому й du tanzt, без -st.",
  "present-form-4:schlafen:1c44v3h":"Die Kinder = sie (вони), тому закінчення -en: schlafen. Umlaut a → ä буває лише для du та er/sie/es: schläft.",
  "present-form-4:verspreche:slgce3":"Після ich додаємо -e: verspreche. Зміна e → i буває лише для du та er/sie/es: versprichst, verspricht.",
  "present-translate-1:wartet:961zo":"«Він» = er, тому потрібне -t. Основа wart- закінчується на -t, тож вставляємо -e-: wartet.",
  "present-translate-1:arbeitest:1ovfrf4":"«Ти» = du, тому -st. Основа arbeit- закінчується на -t, тож вставляємо -e-: arbeitest, а не arbeitst.",
  "present-translate-1:gehst:1g2yepc":"«Ти» = du, тому закінчення -st: geh + st = gehst.",
  "present-translate-1:repariert:otjm0b":"Der Vater = er, тому -t. Дієслова на -ieren відмінюються правильно: reparier + t = repariert.",
  "present-translate-1:kocht:btaocu":"Die Mutter = sie (вона), тому закінчення -t: koch + t = kocht.",
  "present-translate-1:raucht:1aq3shc":"«Він» = er, тому закінчення -t: rauch + t = raucht.",
  "present-translate-1:machen:10gztsr":"«Ми» = wir, тому закінчення -en, як в Infinitiv: machen.",
  "present-translate-1:sprechen:1ejchrv":"«Вони» = sie, тому закінчення -en: sprechen. Зміна e → i буває лише для du та er/sie/es: sprichst, spricht.",
  "present-translate-1:fahren:17oqinn":"«Ми» = wir, тому -en: fahren. Umlaut a → ä з’являється лише для du та er/sie/es: fährst, fährt.",
  "present-translate-2:kauft:1oyj13u":"«Вона» = sie, третя особа однини, тому -t: kauft. Форма kaufen була б для sie «вони» або ввічливого Sie.",
  "present-translate-2:kommst:1da4czc":"Майбутню дію німецькою часто передає Präsens: Wann kommst du? «Ти» = du, тому -st: kommst.",
  "present-translate-2:kommst:fx8tke":"Німецькою речення потребує дієслова: Woher kommst du? «Ти» = du, тому -st: kommst.",
  "present-translate-2:schlafen:13chgof":"Die Kinder = sie (вони), тому -en: schlafen. Umlaut a → ä буває лише для du та er/sie/es: schläft.",
  "present-translate-2:bleiben:1tzv7s2":"«Ми» = wir, тому закінчення -en, як в Infinitiv: bleiben.",
  "present-translate-2:macht:1he72vw":"«Займатися спортом» = Sport machen. «Він» = er, тому -t: macht.",
  "present-translate-2:trinke:om5fnw":"«Я» = ich, тому до основи додаємо -e: trink + e = trinke.",
  "present-translate-2:sehe:179lb9y":"«Я» = ich, тому -e: sehe. Зміна e → ie буває лише для du та er/sie/es: siehst, sieht.",
  "present-translate-2:mochte:gmf13i":"«Я б хотів» = ich möchte, ввічлива форма від mögen. Для ich і er/sie/es вона однакова, без -t: er möchte.",
  "present-translate-3:machst:1dxugu3":"«Ти» = du, тому закінчення -st: mach + st = machst.",
  "present-translate-3:suche:lpcm8h":"«Я» = ich, тому до основи додаємо -e: such + e = suche.",
  "present-translate-3:tanzt-singt:1fjtpfk":"«Вона» = sie, «він» = er, тож обидва дієслова мають -t: tanzt, singt. Основа tanz- на -z не отримує вставного -e-.",
  "present-translate-3:schreibe:1ea4f8u":"«Я» = ich, тому до основи додаємо -e: schreib + e = schreibe.",
  "present-translate-3:kaufen:ry5shv":"«Ви» тут — ввічливе Sie, тому -en: kaufen, а не ihr kauft. У питанні без W-слова дієслово стоїть першим.",
  "present-translate-3:machst:1vjugxr":"«Ти» = du, тому закінчення -st: mach + st = machst.",
  // koennen
  "koennen-forms-practice:kann:19mthzk":"Können в однині має корінь a: ich kann без закінчення, а не ich kanne чи ich könne. Infinitiv malen стоїть у кінці речення.",
  "koennen-forms-practice:kannst:gaf759":"Для du від können: kann + -st = kannst, з a замість ö. Модальне дієслово стоїть на другому місці, Infinitiv schwimmen — у кінці.",
  "koennen-forms-practice:konnen:3z46mp":"Для wir форма збігається з Infinitiv: wir können, з ö. Корінь a буває лише в однині (ich kann, du kannst, er kann). Fahren стоїть у кінці.",
  "koennen-forms-practice:kann:1y8q9qy":"Для er модальне дієслово не має закінчення -t: er kann, а не er kannt. Spazieren gehen стоїть у кінці речення.",
  "koennen-forms-practice:konnt:nkkzrc":"Для ihr können зберігає ö і отримує -t: ihr könnt. Корінь змінюється на a лише в однині (ich, du, er/sie/es).",
  "koennen-forms-practice:konnen:bt8vlt":"Sie (Pl.) означає «вони», тож форма як у wir: sie können, з ö і закінченням -en. Gitarre spielen стоїть у кінці.",
  "moegen-forms-practice:mag:12k38ie":"Mögen в однині має корінь a: ich mag без закінчення, а не ich möge. Тут mögen вживається з іменником Kaffee без Infinitiv.",
  "moegen-forms-practice:magst:1bcetmi":"Для du від mögen: mag + -st = magst. В однині корінь з a, тому не mögst.",
  "moegen-forms-practice:mag:1bi6j2d":"Sie тут означає «вона» (однина), тож sie mag без закінчення, як ich mag, а не sie magt чи sie mögen.",
  "moegen-forms-practice:mogen:52tanp":"Для wir форма збігається з Infinitiv: wir mögen, з ö. Корінь a буває лише в однині: ich mag, du magst, er mag.",
  "moegen-forms-practice:mogt:ec04zi":"Для ihr mögen зберігає ö і отримує -t: ihr mögt. Корінь a (mag) буває лише в однині.",
  "moegen-forms-practice:mogen:48p8kp":"Sie тут означає «вони» (множина), тож sie mögen, як wir mögen. Для «вона» було б sie mag.",
  "moechten-forms-practice:mochte:zxl6tr":"Для ich форма möchte без додаткового закінчення, а не ich möchten. Möchte виражає ввічливе бажання зараз, тут з Akkusativ einen Tee.",
  "moechten-forms-practice:mochtest:1l0c62o":"Для du: möchte + -st = möchtest. Модальне дієслово стоїть на другому місці, Infinitiv gehen — у кінці речення.",
  "moechten-forms-practice:mochte:iiheeo":"Sie тут означає «вона», тож sie möchte, як ich möchte, без -t: не sie möchtet і не sie möchten. Lernen стоїть у кінці.",
  "moechten-forms-practice:mochten:1ot5i4d":"Для wir до möchte додаємо -n: wir möchten. Infinitiv essen стоїть у кінці речення.",
  "moechten-forms-practice:mochtet:voflcb":"Для ihr до möchte додаємо -t: ihr möchtet. Infinitiv gehen стоїть у кінці речення.",
  "moechten-forms-practice:mochten:1uyyrg0":"Sie тут означає «вони», тож sie möchten із закінченням -n, як wir möchten. Для «вона» було б sie möchte.",
  "moegen-moechten-compare-practice:mag:1l8icjp":"Mögen означає «подобатися» загалом, постійну симпатію: ich mag Kaffee. Möchte означало б бажання зараз — «хотів би».",
  "moegen-moechten-compare-practice:mochte:1gfkjtq":"Ввічливе бажання зараз, типове для замовлення з bitte, виражає möchten: ich möchte einen Kaffee. Ich mag означало б «люблю каву» загалом.",
  "moegen-moechten-compare-practice:mag:1r8xt5s":"Mögen означає «подобатися» загалом: sie mag Musik. Для sie (вона) форма mag без закінчення, а не magt.",
  "moegen-moechten-compare-practice:mochte:1b9tfai":"Бажання зараз виражає möchten, а не mögen: sie möchte bezahlen. Для sie (вона) форма без -t, Infinitiv bezahlen — у кінці.",
  "koennen-order-practice:ich-kann-immer-gut-malen:zrkysn":"Модальне дієслово kann стоїть на другому місці, а Infinitiv malen — у самому кінці (Satzklammer). Immer gut стоїть між ними.",
  "koennen-order-practice:du-kannst-im-sommer-immer-gerne-schwimmen:y87jm":"Kannst стоїть на другому місці після du, Infinitiv schwimmen — у кінці. Im Sommer immer gerne стоїть усередині Satzklammer.",
  "koennen-order-practice:ich-kann-selten-spazieren-gehen:1fqsugv":"Kann стоїть на другому місці, а spazieren gehen разом іде в кінець речення. Selten стоїть між модальним дієсловом і Infinitiv.",
  "koennen-order-practice:wir-konnen-im-winter-oft-ski-fahren:id9r1":"Для wir — können на другому місці. Ski fahren — єдине ціле в кінці речення: Ski стоїть перед Infinitiv fahren.",
  "koennen-order-practice:ihr-konnt-manchmal-zusammen-rad-fahren:1ct2o5f":"Для ihr — könnt на другому місці, Rad fahren — у кінці речення. Manchmal zusammen стоїть усередині Satzklammer.",
  "koennen-order-practice:sie-konnen-gut-gitarre-spielen:1yhsc2a":"Sie (Pl.) вимагає форму können на другому місці, а Gitarre spielen іде в кінець. Gut стоїть між ними.",
  "koennen-order-practice:meine-oma-kann-oft-kuchen-backen:hyulyo":"Meine Oma = sie, тому kann без закінчення стоїть на другому місці. Infinitiv backen іде в кінець, Kuchen — перед ним.",
  "koennen-order-practice:am-abend-kann-ich-immer-meine-freunde-treffen:vufd2z":"Am Abend займає перше місце, тож kann іде другим, а ich — одразу після нього (інверсія). Infinitiv treffen стоїть у кінці.",
  "koennen-order-practice:meine-bruder-konnen-manchmal-romane-lesen:vlf08d":"Meine Brüder — множина (= sie), тож können стоїть на другому місці. Infinitiv lesen іде в кінець, Romane — перед ним.",
  "koennen-order-practice:mein-opa-kann-oft-im-internet-surfen:fliy3i":"Mein Opa = er, тому kann без закінчення стоїть на другому місці. Surfen іде в кінець речення, im Internet — перед ним.",
  "koennen-order-practice:mein-mann-kann-nie-gut-fotografieren:1cs6wmj":"Kann стоїть на другому місці після mein Mann, Infinitiv fotografieren — у кінці. Nie gut стоїть усередині Satzklammer.",
  "koennen-order-practice:mein-bruder-kann-super-gitarre-spielen:1do7c1k":"Уміння передає können: mein Bruder kann на другому місці, Infinitiv spielen — у кінці. Super Gitarre стоїть між ними.",
  "koennen-order-practice:meine-schwester-kann-wunderbar-singen:1015zpb":"Meine Schwester = sie, тож kann без закінчення стоїть на другому місці. Infinitiv singen іде в кінець речення.",
  "koennen-order-practice:deine-oma-kann-einen-kuchen-backen:mzmnm8":"Kann стоїть на другому місці, Infinitiv backen — у кінці. Einen Kuchen — Akkusativ від der Kuchen, стоїть усередині Satzklammer.",
  "koennen-order-practice:kannst-du-schwimmen:16o20sz":"У питанні без W-слова модальне дієслово стоїть першим: Kannst du …? Infinitiv schwimmen залишається в кінці.",
  "koennen-order-practice:seine-tochter-kann-schon-malen:17640oj":"Уміння передає können: seine Tochter kann, без закінчення, на другому місці. Infinitiv malen іде в кінець, schön — перед ним.",
  "koennen-order-practice:manchmal-kann-ich-ein-buch-lesen:1dkpn17":"Manchmal займає перше місце, тож kann іде другим, а ich — після нього (інверсія). Infinitiv lesen стоїть у кінці.",
  "koennen-order-practice:ich-kann-nicht-so-gut-kochen:19hctrd":"Уміння передає können: ich kann на другому місці, Infinitiv kochen — у кінці. Nicht so gut стоїть між ними.",
  "koennen-order-practice:meine-oma-kann-manchmal-im-internet-surfen:1ewig0s":"Meine Oma = sie, тож kann без закінчення стоїть на другому місці. Surfen іде в кінець, manchmal im Internet — усередині Satzklammer.",
  "koennen-order-practice:kannst-du-mir-bitte-helfen:1bmvzdk":"У питанні без W-слова kannst стоїть першим, Infinitiv helfen — у кінці. Helfen вимагає Dativ: du → mir.",
  "koennen-order-practice:meine-mutter-kann-nicht-so-gut-schach-spielen:30gge6":"Meine Mutter = sie, тож kann стоїть на другому місці. Schach spielen іде в кінець, nicht so gut — перед ним.",
  "koennen-context-practice:kannst-kann:1io877g":"У питанні без W-слова kannst стоїть першим, у відповіді kann — другим. Для du — kannst, для ich — kann без закінчення.",
  "koennen-context-practice:kann:1vvwgag":"Sie (Sg.) означає «вона», тож kann без закінчення, як ich kann, а не sie kannt чи sie können.",
  "koennen-context-practice:konnen:1tomg1q":"Для wir форма збігається з Infinitiv: wir können, з ö. Infinitiv backen стоїть у кінці речення.",
  "koennen-context-practice:kann:xdzsp8":"Для ich — kann без закінчення і з a замість ö. Infinitiv lesen стоїть у кінці речення.",
  "koennen-context-practice:kann:1dw3u5g":"Mein Bruder = er, тож kann без закінчення -t: er kann, а не er kannt. Infinitiv sprechen стоїть у кінці.",
  "koennen-context-practice:kann:15iyq9l":"Meine Schwester = sie, тож форма kann без закінчення, як у ich. Infinitiv surfen стоїть у кінці речення.",
  "koennen-context-practice:konnt:e06149":"Для ihr können зберігає ö і отримує -t: ihr könnt. Infinitiv hören стоїть у кінці речення.",
  "koennen-context-practice:kann:v548i2":"Після am Wochenende на першому місці дієслово стоїть другим, перед ich (інверсія): kann ich. Для ich — kann без закінчення.",
  "koennen-context-practice:kannst:1bl9hjj":"Для du: kann + -st = kannst. Oder у кінці не змінює порядок: це розповідне речення з дієсловом на другому місці.",
  "koennen-context-practice:kann:iofec1":"Sie (Sg.) означає «вона», тож kann без закінчення. Nicht so gut стоїть перед Infinitiv tanzen у кінці.",
  "koennen-context-practice:kann:17lb1yd":"Для er модальне дієслово не має закінчення -t: er kann. Infinitiv fahren стоїть у кінці, після in den Urlaub.",
  "koennen-context-practice:kann-kann:lwds2r":"У питанні без W-слова kann стоїть першим, у відповіді — другим. Для er обидва рази kann без -t, а у відповіді Infinitiv опущено.",
  "koennen-context-practice:konnt:buh25m":"Для ihr können зберігає ö і отримує -t: ihr könnt. Aber тут не займає першого місця, Infinitiv spielen — у кінці.",
  "koennen-context-practice:kann:1onza6j":"Для ich — kann без закінчення. Infinitiv treffen стоїть у кінці першого речення, перед denn.",
  "koennen-context-practice:kann:6zir4z":"Die Oma = sie, тож kann без закінчення, а не kannt. Infinitiv backen стоїть у кінці.",
  "koennen-context-practice:kannst-kann:i0k1nd":"Питання без W-слова починається з модального дієслова: Kannst du …? У відповіді kann стоїть другим, для ich — без закінчення.",
  "koennen-context-practice:kann:109iurq":"Питання без W-слова починається з модального дієслова. Dein Kind = es, тож kann без закінчення, а Infinitiv lesen — у кінці.",
  "koennen-context-practice:kann:1nxvdam":"Meine Tante = sie, тож kann без закінчення стоїть на другому місці. Infinitiv sprechen іде в кінець речення.",
  "koennen-context-practice:kann:10hqe7j":"Для ich — kann без закінчення і з a. Noch nicht so gut Deutsch стоїть між kann і Infinitiv sprechen у кінці.",
  "koennen-context-practice:kannst:1qtmw00":"Питання без W-слова починається з модального дієслова: Kannst du …? Spazieren gehen стоїть у кінці речення.",
  "koennen-context-practice:kann:1axuuth":"Для ich — kann без закінчення. Коли зміст зрозумілий з контексту, Infinitiv можна опустити: ich kann leider nicht.",
  "koennen-context-practice:kannst:14ojy5p":"У питанні без W-слова модальне дієслово стоїть першим: Kannst du …? Для du — kann + -st, а Schach spielen — у кінці.",
  "koennen-context-practice:kannst:1403py4":"Для du — kannst. Це розповідне речення з oder у кінці, тому дієслово на другому місці, а spielen — у кінці.",
  "koennen-context-practice:kann:1bkri6p":"Ja стоїть поза реченням, тож після ich на другому місці іде kann без закінчення. Infinitiv spielen стоїть у кінці.",
  "koennen-context-practice:kannst:1q8tq5e":"Питання без W-слова починається з модального дієслова: Kannst du …? Для du — kann + -st, Infinitiv spielen — у кінці.",
  "koennen-context-practice:kann:1109meb":"Das займає перше місце, тож kann іде другим, а ich — після нього (інверсія). Для ich — kann без закінчення.",
  "koennen-context-practice:kannst:15kl541":"Друге речення — питання без W-слова, тож модальне дієслово стоїть першим: Kannst du …? Gitarre spielen залишається в кінці.",
  "koennen-context-practice:kann:kmf4pl":"Ja стоїть поза реченням, тож після ich на другому місці іде kann без закінчення. Gitarre spielen стоїть у кінці.",
  "koennen-context-practice:kann:vvad49":"Для ich — kann без закінчення на другому місці. Усе між kann і Infinitiv machen у кінці утворює Satzklammer.",
  "koennen-context-practice:konnen:yz02pd":"Dann займає перше місце, тож können іде другим, перед wir (інверсія). Для wir — können, spazieren gehen — у кінці.",
  "koennen-context-practice:konnen:1hj19jh":"Das займає перше місце, тож können іде другим, а wir — після нього. Для wir — können, Infinitiv machen — у кінці.",
  // haben
  "haben-practice:habe:cnzgcj":"Після ich дієслово haben має закінчення -e: ich habe.",
  "haben-practice:hast:7cvizu":"Для du у haben випадає b: du hast, а не du habst.",
  "haben-practice:hat:1yqao64":"Meine Schwester = sie. Для er, sie, es haben втрачає b і має форму hat, а не habt.",
  "haben-practice:haben:p55xfc":"Після wir форма haben збігається з Infinitiv: wir haben.",
  "haben-practice:habt:1cs6goo":"Після ihr haben відмінюється регулярно: hab- + -t = ihr habt. На відміну від du hast і er hat, b зберігається.",
  "haben-practice:haben:tkh1pf":"Sie тут означає «вони». Для sie та ввічливого Sie форма збігається з Infinitiv: sie haben.",
  "bekommen-practice:bekomme:yzqxlh":"Bekommen відмінюється регулярно: після ich до основи bekomm- додаємо -e: ich bekomme.",
  "bekommen-practice:bekommst:cxjwby":"Після du до основи bekomm- додаємо -st: du bekommst. Голосна в основі не змінюється.",
  "bekommen-practice:bekommt:1tlmbrs":"Meine Schwester = sie, тому до основи bekomm- додаємо -t: sie bekommt.",
  "bekommen-practice:bekommen:3duavb":"Після wir форма збігається з Infinitiv: wir bekommen.",
  "bekommen-practice:bekommt:1likhd0":"Після ihr до основи bekomm- додаємо -t: ihr bekommt, як і er bekommt.",
  "bekommen-practice:bekommen:35zmi9":"Sie тут означає «вони». Для sie та ввічливого Sie форма збігається з Infinitiv: sie bekommen.",
  "brauchen-practice:brauche:10q9juw":"Brauchen — регулярне дієслово: після ich до основи brauch- додаємо -e: ich brauche.",
  "brauchen-practice:brauchst:1u1n4s2":"Після du до основи brauch- додаємо -st: du brauchst.",
  "brauchen-practice:braucht:fo0ety":"Для er, sie, es до основи brauch- додаємо -t: er braucht.",
  "brauchen-practice:brauchen:k1hcq5":"Після wir форма збігається з Infinitiv: wir brauchen.",
  "brauchen-practice:braucht:nv2b6m":"Після ihr до основи brauch- додаємо -t: ihr braucht, як і er braucht.",
  "brauchen-practice:brauchen:zctv74":"Sie тут означає «вони». Для sie та ввічливого Sie форма збігається з Infinitiv: sie brauchen.",
  // time-expressions
  "time-expressions-practice:um:1p468zt":"Для точного часу на годиннику вживаємо um: um neun Uhr, um halb vier.",
  "time-expressions-practice:am:17jtmm9":"Перед днями тижня вживаємо am (an + dem): am Freitag, am Montag.",
  "time-expressions-practice:am:1irfyzz":"Перед частинами доби вживаємо am: am Morgen, am Abend. Виняток — in der Nacht.",
  "time-expressions-practice:im:1g7lkgi":"Перед назвами місяців вживаємо im (in + dem): im September, im Mai.",
  "time-expressions-practice:im:16payfg":"Перед порами року вживаємо im (in + dem): im Sommer, im Winter.",
  "time-expressions-practice:in:1pw3l2":"«Через» + проміжок часу в майбутньому — in: in zwei Stunden, in einer Woche.",
  "time-expressions-practice:nachts:epi1so":"Прислівник nachts («уночі, ночами») вживається без прийменника й артикля, як morgens чи abends, і пишеться з малої літери.",
  "time-expressions-practice:in-der:95fq52":"Nacht — виняток серед частин доби: не am, а in der Nacht (die Nacht, Dativ).",
  "time-expressions-practice:letzte:jdlham":"«Минулої ночі» — letzte Nacht, без прийменника. Nacht жіночого роду, тому letzte із закінченням -e.",
  "spoken-time-practice:funf-nach-zehn:sbl6m3":"Хвилини після повної години позначаємо nach, спочатку хвилини, потім година: 10:05 = fünf nach zehn.",
  "spoken-time-practice:zehn-vor-sechs:1pjwq7k":"Хвилини до наступної години позначаємо vor: 5:50 = zehn vor sechs, бо до 6:00 лишається десять хвилин.",
  "spoken-time-practice:viertel-nach-drei:1gnxfsf":"15 хвилин — Viertel, після години — nach: 3:15 = Viertel nach drei.",
  "spoken-time-practice:halb-vier:1rkd88j":"Halb рахує до наступної години: 3:30 = halb vier («пів на четверту»), а не halb drei.",
  "spoken-time-practice:viertel-vor-sieben:4b7y60":"6:45 — це чверть до наступної години: Viertel vor sieben, а не Viertel nach sechs (це 6:15).",
  // es-gibt-leisure
  "es-gibt-pattern-practice:gibt:s84zt7":"«Є, існує» — es gibt; geben змінює e → i: es gibt. Через інверсію дієслово стоїть на другому місці, es — після нього.",
  "es-gibt-pattern-practice:einen:14bpo3i":"Після es gibt іменник стоїть в Akkusativ. Park чоловічого роду (der Park), тому ein → einen.",
  "es-gibt-pattern-practice:eine:14rfkf1":"Після es gibt — Akkusativ. Ausstellung жіночого роду (die Ausstellung), тому eine, як і в Nominativ.",
  "es-gibt-pattern-practice:ein:uh2rr5":"Після es gibt — Akkusativ. Café середнього роду (das Café), тому ein без закінчення.",
  "es-gibt-pattern-practice:viele:1p3g9ow":"Restaurants — множина, а ein у множині не вживається. «Багато» перед іменником у множині — viele.",
  "leisure-activities-recall:denn:13rys38":"Denn («тому що») не змінює порядок слів: дієслово стоїть на другому місці (denn der Film ist), на відміну від weil.",
  // word-order
  "word-order-statements-practice:der-mann-ist-da:gxy8j1":"У розповідному реченні дієслово стоїть на другому місці: спершу підмет der Mann, потім ist, а da — у кінці.",
  "word-order-statements-practice:das-arbeitszimmer-ist-gro:h3ceps":"Підмет das Arbeitszimmer стоїть першим, sein у формі ist — на другому місці, а прикметник groß іде в кінець.",
  "word-order-statements-practice:ich-fahre-heute-mit-dem-bus-nach-hause:1bxtpe7":"Дієслово fahre стоїть на другому місці після ich. Далі TeKaMoLo: спершу час (heute), потім спосіб (mit dem Bus), наприкінці місце (nach Hause).",
  "word-order-statements-practice:meine-schwester-ist-schon-studentin:1ap5a6i":"Підмет meine Schwester стоїть першим, ist — на другому місці. Schon іде одразу після дієслова, перед Studentin.",
  "word-order-tekamolo-practice:ich-fahre-heute-wegen-des-regens-mit-dem-bus-zur-arbeit:1yml32j":"Дієслово fahre стоїть на другому місці після ich. Далі TeKaMoLo: heute (час) – wegen des Regens (причина) – mit dem Bus (спосіб) – zur Arbeit (місце).",
  "word-order-tekamolo-practice:wir-lernen-heute-wegen-der-prufung-zusammen-in-der-bibliothek:3pr55g":"Дієслово lernen стоїть на другому місці після wir. Далі TeKaMoLo: heute (час) – wegen der Prüfung (причина) – zusammen (спосіб) – in der Bibliothek (місце).",
  "word-order-modal-practice:ich-mag-am-morgen-kaffee-trinken:7tn4wu":"Модальне mag стоїть на другому місці після ich, а Infinitiv trinken — у самому кінці речення, після am Morgen і Kaffee.",
  "word-order-modal-practice:am-morgen-mag-ich-kaffee-trinken:nbwad2":"Am Morgen стоїть перед підметом, тому mag лишається на другому місці, а ich іде після нього (інверсія). Infinitiv trinken — у кінці.",
  "word-order-modal-practice:magst-du-am-morgen-kaffee-trinken:12ld88h":"У питанні так/ні модальне дієслово magst стоїть на першому місці, далі du, а Infinitiv trinken — у самому кінці.",
  "word-order-modal-practice:was-magst-du-am-morgen-trinken:1j49tv3":"У W-Frage was стоїть першим, модальне magst — другим, далі du і am Morgen. Infinitiv trinken іде в кінець.",
  "word-order-modal-practice:ich-mochte-am-abend-einen-tee-trinken:1b2vps":"Модальне möchte стоїть на другому місці після ich, а Infinitiv trinken — у кінці, після am Abend і einen Tee.",
  "word-order-modal-practice:wann-kannst-du-deutsch-lernen:a9w20i":"У W-Frage wann стоїть першим, модальне kannst — другим, далі du. Infinitiv lernen іде в кінець, після Deutsch.",
  "word-order-inversion-practice:heute-fahre-ich-mit-dem-bus-nach-hause:lg0yf1":"Heute стоїть перед підметом, тому fahre лишається на другому місці, а ich іде після дієслова (інверсія). Далі mit dem Bus, потім nach Hause.",
  "word-order-inversion-practice:am-abend-ist-mein-bruder-frei:1o5t4vy":"Am Abend стоїть перед підметом, тому ist лишається на другому місці, а mein Bruder іде після дієслова (інверсія). Frei — у кінці.",
  "word-order-inversion-practice:morgen-ist-die-mutter-zu-hause:13ir91k":"Morgen стоїть першим, тому ist лишається на другому місці, а die Mutter іде після дієслова (інверсія). Zu Hause — у кінці.",
  "word-order-inversion-practice:jetzt-haben-wir-ein-neues-auto:8dymei":"Jetzt стоїть першим, тому haben лишається на другому місці, а wir іде після дієслова (інверсія). Ein neues Auto — у кінці.",
  "word-order-questions-practice:fahrst-du-heute-mit-dem-bus-nach-hause:1ywutgy":"У питанні так/ні дієслово стоїть першим: Fährst du … (для du a → ä). Далі heute – mit dem Bus – nach Hause за TeKaMoLo.",
  "word-order-questions-practice:ist-der-mann-da:fy6ucc":"У питанні так/ні дієслово стоїть на першому місці: ist, потім підмет der Mann, а da — у кінці.",
  "word-order-questions-practice:warum-fahrst-du-heute-mit-dem-bus-nach-hause:1roeekh":"У W-Frage warum стоїть першим, fährst (для du a → ä) — другим, далі du. Потім heute – mit dem Bus – nach Hause за TeKaMoLo.",
  "word-order-questions-practice:wo-ist-dein-handy:ft0g5t":"У W-Frage питальне слово wo стоїть першим, дієслово ist — другим, а підмет dein Handy — після дієслова.",
  "word-order-questions-practice:wann-ist-er-zu-hause:e8rx11":"У W-Frage wann стоїть першим, ist — другим, далі підмет er, а zu Hause — у кінці.",
  "word-order-questions-practice:wie-geht-es-dir:1pg6d1v":"У W-Frage wie стоїть першим, geht — другим. Підмет тут es, тому gehen має форму 3-ї особи однини, а dir (Dativ) іде в кінець.",
  // separable-verbs
  "separable-verbs-statements-practice:ich-stehe-um-sieben-uhr-auf:a6ph4j":"Aufstehen має trennbares Präfix: stehe стоїть на другому місці, а auf іде в самий кінець речення, після um sieben Uhr.",
  "separable-verbs-statements-practice:ich-rufe-dich-spater-an:seeclz":"Anrufen має trennbares Präfix: rufe стоїть на другому місці, а an — у кінці, після dich і später.",
  "separable-verbs-statements-practice:wir-kaufen-heute-im-supermarkt-ein:1kyvdz2":"Einkaufen має trennbares Präfix: kaufen стоїть на другому місці, а ein — у кінці, після heute і im Supermarkt.",
  "separable-verbs-statements-practice:der-zug-fahrt-um-neun-uhr-ab:14zih2n":"Abfahren має trennbares Präfix: fährt (для er/sie/es a → ä) стоїть на другому місці, а ab — у кінці речення.",
  "separable-verbs-statements-practice:wir-steigen-am-alexanderplatz-aus:1434jdu":"Aussteigen має trennbares Präfix: steigen стоїть на другому місці, а aus — у кінці, після am Alexanderplatz.",
  "separable-verbs-statements-practice:ich-hole-meine-freundin-vom-bahnhof-ab:7nqovq":"Abholen має trennbares Präfix: hole стоїть на другому місці, а ab — у кінці, після meine Freundin і vom Bahnhof.",
  "separable-verbs-statements-practice:sie-steigen-in-munchen-um:12t5gyb":"Umsteigen має trennbares Präfix: steigen стоїть на другому місці, а um — у кінці, після in München.",
  "separable-verbs-statements-practice:ich-bringe-meine-tasche-mit:1530d3p":"Mitbringen має trennbares Präfix: bringe стоїть на другому місці, а mit — у кінці, після meine Tasche.",
  "separable-verbs-context-practice:warum-rufst-du-mich-nicht-an:vq251l":"У W-Frage warum стоїть першим, rufst — другим, далі du mich nicht. Префікс an від anrufen іде в самий кінець, після nicht.",
  "separable-verbs-context-practice:er-sieht-am-abend-fern:19g13og":"Fernsehen має trennbares Präfix: sieht (для er e → ie) стоїть на другому місці, а fern — у кінці, після am Abend.",
  "separable-verbs-context-practice:der-bus-kommt-in-funf-minuten-an:1ddwcq5":"Ankommen має trennbares Präfix: kommt стоїть на другому місці, а an — у кінці, після in fünf Minuten.",
  "separable-verbs-context-practice:wir-konnen-um-acht-uhr-aufstehen:z26kzi":"Модальне können стоїть на другому місці, а aufstehen як Infinitiv лишається цілим у кінці речення, без відокремлення префікса.",
  "separable-verbs-context-practice:ich-kann-meine-freundin-vom-bahnhof-abholen:vp87kh":"Модальне kann стоїть на другому місці, а abholen як Infinitiv лишається цілим у кінці речення, а не hole … ab.",
  "separable-verbs-context-practice:ich-bleibe-zu-hause-weil-ich-fruh-aufstehe:mbtia9":"У Nebensatz з weil дієслово йде в кінець, і префікс з’єднується з ним: weil ich früh aufstehe, а не stehe … auf. Перед weil ставиться кома."
};
// Only ich and du change form between Akkusativ and Dativ; the other persons use the same form in both cases.
const reflexivePronounPersons=[
  ["ich","ich (я)","ich mich mir"],
  ["du","du (ти)","du dich dir"],
  ["er","er (він)","er sich sich"],
  ["she","sie (вона)","sie sich sich"],
  ["es","es (воно)","es sich sich"],
  ["wir","wir (ми)","wir uns uns"],
  ["ihr","ihr (ви)","ihr euch euch"],
  ["they","sie (вони)","sie sich sich"],
  ["formal","Sie (Ви)","Sie sich sich"]
];
const reflexivePronounParadigm={
  title:"Reflexivpronomen",forms:true,columns:[{label:"Nom.",title:"Nominativ"},{label:"Akk.",title:"Akkusativ"},{label:"Dat.",title:"Dativ"}],
  rows:reflexivePronounPersons.map(([,title,forms])=>({label:title.split(" ")[0],title,cells:forms.split(" ").map(stem=>({stem,ending:""}))}))
};
const reflexivePronounCaseTable={
  columns:reflexivePronounParadigm.columns,
  rows:reflexivePronounParadigm.rows.map((row,index)=>({label:reflexivePronounPersons[index][0]==="they"?"sie (мн.)":row.label,title:row.title,cells:row.cells.map(({stem})=>stem)})),
  highlights:reflexivePronounParadigm.rows.flatMap((row,index)=>row.cells[1].stem===row.cells[2].stem?[{row:index,column:1},{row:index,column:2}]:[]),
  note:"Виділено рядки, де Akkusativ і Dativ мають однакову форму: sich для er, sie, es, sie (мн.) і Sie, uns для wir та euch для ihr."
};
const reflexivePronounGlosses={
  "Akk.":{mich:"мене",dich:"тебе",sich:"себе",uns:"нас",euch:"вас"},
  "Dat.":{mir:"мені",dir:"тобі",sich:"собі",uns:"нам",euch:"вам"}
};
function reflexiveCases(caseLabel,rows){
  const column=reflexivePronounParadigm.columns.findIndex(({label})=>label===caseLabel);
  if(column<1)throw new Error(`Unknown reflexive case: ${caseLabel}`);
  const grammaticalCase=column===1?"accusative":"dative";
  return rows.map(([person,verbPhrase,promptText,translation])=>{
    const row=reflexivePronounPersons.findIndex(([key])=>key===person);
    if(row<0)throw new Error(`Unknown reflexive person: ${person}`);
    const paradigmRow=reflexivePronounParadigm.rows[row];
    const answer=paradigmRow.cells[column].stem;
    const subject=paradigmRow.cells[0].stem;
    const verb=verbPhrase.split(" ")[1].normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    return {
      id:`reflexive-${grammaticalCase}-${person}-${verb}`,targetId:`reflexive-${grammaticalCase}-${person}`,person,type:"cloze",
      word:answer,example:promptText.replace("___",answer),translation,studyTranslation:`${subject} → ${answer} · ${reflexivePronounGlosses[caseLabel][answer]}`,
      promptText,support:`Підмет: ${paradigmRow.title}.`,
      explanation:column===1?`${verbPhrase} вимагає Akkusativ: ${subject} → ${answer}.`:`Поруч є прямий додаток в Akkusativ, тому займенник стоїть у Dativ: ${subject} → ${answer}.`,
      category:`REFLEXIVPRONOMEN · ${column===1?"AKKUSATIV":"DATIV"}`,practiceVariants:false,
      answerParts:paradigmRow.cells[column],paradigm:{...reflexivePronounParadigm,active:{row,column}},
      response:{mode:"text",scope:"word",accepted:[answer],caseSensitive:false,punctuationSensitive:false}
    };
  });
}
const reflexiveAccusativeCards=reflexiveCases("Akk.",[
  ["ich","sich freuen auf","Ich freue ___ auf den Urlaub.","Я з нетерпінням чекаю на відпустку."],
  ["ich","sich interessieren für","Ich interessiere ___ für Musik.","Я цікавлюся музикою."],
  ["ich","sich anmelden für","Ich melde ___ für den Kurs an.","Я записуюся на курс."],
  ["du","sich freuen auf","Du freust ___ auf die Ferien.","Ти радієш канікулам."],
  ["du","sich interessieren für","Interessierst du ___ für Sport?","Тебе цікавить спорт?"],
  ["du","sich kümmern um","Kümmerst du ___ um die Kinder?","Ти піклуєшся про дітей?"],
  ["er","sich ärgern über","Der Vater ärgert ___ über den Lärm.","Батько сердиться через шум."],
  ["er","sich erinnern an","Er erinnert ___ an den Termin.","Він згадує про зустріч."],
  ["er","sich fühlen","Er fühlt ___ heute gut.","Сьогодні він почувається добре."],
  ["she","sich interessieren für","Anna interessiert ___ für Kunst.","Анну цікавить мистецтво."],
  ["she","sich verabschieden von","Anna verabschiedet ___ von ihrer Freundin.","Анна прощається з подругою."],
  ["she","sich waschen","Anna wäscht ___ nach dem Sport.","Анна миється після спорту."],
  ["es","sich setzen auf","Das Kind setzt ___ auf den Stuhl.","Дитина сідає на стілець."],
  ["es","sich freuen über","Das Kind freut ___ über das Geschenk.","Дитина радіє подарунку."],
  ["es","sich erholen","Das Baby erholt ___ im Bett.","Немовля відпочиває в ліжку."],
  ["wir","sich treffen","Wir treffen ___ um acht.","Ми зустрічаємося о восьмій."],
  ["wir","sich beeilen","Wir beeilen ___ sehr.","Ми дуже поспішаємо."],
  ["wir","sich interessieren für","Wir interessieren ___ für Musik.","Нас цікавить музика."],
  ["ihr","sich interessieren für","Ihr interessiert ___ für Filme.","Вас цікавлять фільми."],
  ["ihr","sich freuen auf","Ihr freut ___ auf das Wochenende.","Ви радієте вихідним."],
  ["ihr","sich setzen","Setzt ___ bitte!","Сідайте, будь ласка!"],
  ["formal","sich interessieren für","Interessieren Sie ___ für Musik?","Вас цікавить музика?"],
  ["formal","sich setzen","Setzen Sie ___ bitte hier hin.","Сідайте сюди, будь ласка."],
  ["formal","sich entschuldigen","Entschuldigen Sie ___ bitte.","Вибачте, будь ласка."],
  ["they","sich freuen auf","Die Gäste freuen ___ auf den Abend.","Гості з нетерпінням чекають на вечір."],
  ["they","sich interessieren für","Die Kinder interessieren ___ für Tiere.","Дітей цікавлять тварини."],
  ["they","sich verabschieden","Die Freunde verabschieden ___ am Bahnhof.","Друзі прощаються на вокзалі."]
]);
const reflexiveDativeCards=reflexiveCases("Dat.",[
  ["ich","sich waschen","Ich wasche ___ die Hände.","Я мию руки."],
  ["ich","sich putzen","Ich putze ___ die Zähne.","Я чищу зуби."],
  ["ich","sich kaufen","Ich kaufe ___ ein neues Buch.","Я купую собі нову книжку."],
  ["du","sich waschen","Wäschst du ___ die Hände vor dem Essen?","Ти миєш руки перед їжею?"],
  ["du","sich putzen","Du putzt ___ die Zähne.","Ти чистиш зуби."],
  ["du","sich kaufen","Du kaufst ___ ein neues Handy.","Ти купуєш собі новий телефон."],
  ["er","sich waschen","Er wäscht ___ die Hände.","Він миє руки."],
  ["er","sich putzen","Er putzt ___ die Zähne.","Він чистить зуби."],
  ["er","sich kaufen","Er kauft ___ ein neues Auto.","Він купує собі нове авто."],
  ["she","sich waschen","Anna wäscht ___ die Hände.","Анна миє руки."],
  ["she","sich putzen","Anna putzt ___ die Zähne.","Анна чистить зуби."],
  ["she","sich kaufen","Anna kauft ___ ein neues Kleid.","Анна купує собі нову сукню."],
  ["es","sich waschen","Das Kind wäscht ___ die Hände.","Дитина миє руки."],
  ["es","sich putzen","Das Kind putzt ___ die Zähne.","Дитина чистить зуби."],
  ["es","sich kaufen","Das Kind kauft ___ ein Eis.","Дитина купує собі морозиво."],
  ["wir","sich waschen","Wir waschen ___ vor dem Essen die Hände.","Ми миємо руки перед їжею."],
  ["wir","sich putzen","Wir putzen ___ die Zähne.","Ми чистимо зуби."],
  ["wir","sich kaufen","Wir kaufen ___ ein Haus.","Ми купуємо собі будинок."],
  ["ihr","sich waschen","Ihr wascht ___ die Hände.","Ви миєте руки."],
  ["ihr","sich putzen","Ihr putzt ___ die Zähne.","Ви чистите зуби."],
  ["ihr","sich kaufen","Ihr kauft ___ ein Geschenk.","Ви купуєте собі подарунок."],
  ["formal","sich waschen","Waschen Sie ___ die Hände?","Ви миєте руки?"],
  ["formal","sich putzen","Putzen Sie ___ jeden Tag die Zähne?","Ви чистите зуби щодня?"],
  ["formal","sich kaufen","Kaufen Sie ___ eine Fahrkarte?","Ви купуєте собі квиток?"],
  ["they","sich waschen","Die Kinder waschen ___ die Hände.","Діти миють руки."],
  ["they","sich putzen","Die Kinder putzen ___ die Zähne.","Діти чистять зуби."],
  ["they","sich kaufen","Die Freunde kaufen ___ ein Buch.","Друзі купують собі книжку."]
]);
const reflexiveCaseCards=[...reflexiveAccusativeCards,...reflexiveDativeCards];
const reflexivePronounStages=[
  lessonStep("reflexive-cases-accusative-learn","Вивчення зворотних займенників в Akkusativ","Вивчіть форми всіх дев’яти займенників в Akkusativ. Дієслова sich freuen auf, sich interessieren für і sich ärgern über вимагають sich в Akkusativ.",reflexiveAccusativeCards,"learn","Знахідний відмінок · Akkusativ","Вивчення"),
  lessonStep("reflexive-cases-accusative-practice","Практика зворотних займенників в Akkusativ","Введіть займенник в Akkusativ за підметом речення. Після перевірки звірте форму з таблицею.",reflexiveAccusativeCards,"input","Знахідний відмінок · Akkusativ","Практика"),
  lessonStep("reflexive-cases-dative-learn","Вивчення зворотних займенників у Dativ","Вивчіть форми в Dativ. Вони з’являються, коли після дієслова вже є прямий додаток: Ich wasche mir die Hände.",reflexiveDativeCards,"learn","Давальний відмінок · Dativ","Вивчення"),
  lessonStep("reflexive-cases-dative-practice","Практика зворотних займенників у Dativ","Введіть займенник у Dativ за підметом. Перш ніж відповідати, знайдіть у реченні прямий додаток.",reflexiveDativeCards,"input","Давальний відмінок · Dativ","Практика"),
  lessonStep("reflexive-cases-mixed-learn","Порівняння Akkusativ і Dativ","Порівняйте форми в контексті. Відмінок визначає дієслово або наявність прямого додатка, а не український переклад.",reflexiveCaseCards,"learn","Akkusativ чи Dativ?","Вивчення"),
  {...lessonStep("reflexive-cases-mixed-practice","Практика обох відмінків","Спочатку визначте відмінок за дієсловом або прямим додатком, потім введіть займенник. Працюйте з усіма особами й ввічливим Sie.",reflexiveCaseCards,"input","Akkusativ чи Dativ?","Практика"),categoryBeforeCheck:"REFLEXIVPRONOMEN"}
];
// Each vocabulary target gets a forward card (Ukrainian → German) and a reverse card
// (German → Ukrainian) that share one targetId. Learn stages use forward cards only.
function vocabPair(targetId,{word,translation,promptText=translation,accepted,reverseAccepted,example,exampleTranslation,explanation,category,noun,cloze}){
  const shared={word,category,example,exampleTranslation,...(noun?{noun}:{})};
  const response=(answers,scope)=>({mode:"text",scope,accepted:answers,caseSensitive:false,punctuationSensitive:false});
  const forward=cloze
    ? {id:`${targetId}-cloze`,targetId,type:"cloze",...shared,translation,promptText:cloze.promptText,support:cloze.support,practiceVariants:false,response:response(accepted,"word"),explanation}
    : {id:`${targetId}-recall`,targetId,type:"recall",...shared,translation,promptText,response:response(accepted,word.includes(" ")?"phrase":"word"),explanation};
  const reverse={id:`${targetId}-reverse`,targetId,type:"recall-reverse",...shared,translation:reverseAccepted.join(" / "),promptText:word,response:response(reverseAccepted,"word")};
  return [forward,reverse];
}
const vocabStages=(lessonId,chapter,cards)=>[
  lessonStep(`${lessonId}-learn`,`Вивчення: ${chapter}`,"Вивчіть німецькі слова з артиклями, українськими значеннями та прикладами. Звертайте увагу на форми, які змінюються.",cards.filter(card=>card.type!=="recall-reverse"),"learn",chapter,"Вивчення"),
  lessonStep(`${lessonId}-practice`,`Практика: ${chapter}`,"Напишіть німецьке слово за українським значенням або українське значення за німецьким словом.",cards,"input",chapter,"Практика")
];
const vocabLicenseTravelCards=[
  ...vocabPair("vocab-fuehrerschein",{word:"der Führerschein",translation:"водійське посвідчення",accepted:["der Führerschein"],reverseAccepted:["водійське посвідчення","водійські права"],example:"Ich habe den Führerschein.",exampleTranslation:"Я маю водійське посвідчення.",explanation:"Führerschein — чоловічий рід: der. Після haben стоїть Akkusativ: den Führerschein.",category:"FÜHRERSCHEIN · REISEN",noun:nounMeta("masculine","Führerschein")}),
  ...vocabPair("vocab-pruefung",{word:"die Führerscheinprüfung",translation:"іспит на водійське посвідчення",accepted:["die Führerscheinprüfung"],reverseAccepted:["іспит на водійське посвідчення","іспит на водійські права"],example:"Die Führerscheinprüfung war schwer.",exampleTranslation:"Іспит на водійське посвідчення був важкий.",explanation:"Складений іменник має артикль останнього слова: die Prüfung → die Führerscheinprüfung.",category:"FÜHRERSCHEIN · REISEN",noun:nounMeta("feminine","Führerscheinprüfung")}),
  ...vocabPair("vocab-motorrad",{word:"das Motorrad",translation:"мотоцикл",accepted:["das Motorrad"],reverseAccepted:["мотоцикл"],example:"Er fährt mit dem Motorrad.",exampleTranslation:"Він їде на мотоциклі.",explanation:"Motorrad — середній рід: das. Після mit стоїть Dativ: dem Motorrad.",category:"FÜHRERSCHEIN · REISEN",noun:nounMeta("neuter","Motorrad")}),
  ...vocabPair("vocab-reisen",{word:"reisen",translation:"подорожувати",promptText:"подорожувати (інфінітив)",accepted:["reisen"],reverseAccepted:["подорожувати"],example:"Wir reisen gern nach Italien.",exampleTranslation:"Ми охоче подорожуємо до Італії.",explanation:"reisen — подорожувати. Не плутайте з die Reise — подорож.",category:"FÜHRERSCHEIN · REISEN"}),
  ...vocabPair("vocab-durch",{word:"durch",translation:"через",accepted:["durch"],reverseAccepted:["через","крізь"],example:"Wir fahren durch den Tunnel.",exampleTranslation:"Ми їдемо через тунель.",explanation:"durch завжди стоїть з Akkusativ: durch den Tunnel, durch die Stadt, durch das Feld.",category:"FÜHRERSCHEIN · REISEN"}),
  ...vocabPair("vocab-schaffen",{word:"schaffen",translation:"впоратися",promptText:"впоратися (інфінітив)",accepted:["schaffen"],reverseAccepted:["впоратися","встигнути"],example:"Das schaffe ich!",exampleTranslation:"Я з цим впораюся!",explanation:"schaffen — впоратися або встигнути. З ich: schaffe, з er/sie/es: schafft.",category:"FÜHRERSCHEIN · REISEN"}),
  ...vocabPair("vocab-geschafft",{word:"geschafft",translation:"впорався / впоралася",accepted:["geschafft"],reverseAccepted:["впорався","впоралася"],example:"Ich habe es geschafft!",exampleTranslation:"Я впорався!",explanation:"Partizip II від schaffen — geschafft. Разом із haben: habe … geschafft.",category:"FÜHRERSCHEIN · REISEN"})
];
const vocabPostContractsCards=[
  ...vocabPair("vocab-nachricht",{word:"die Nachricht",translation:"повідомлення",accepted:["die Nachricht"],reverseAccepted:["повідомлення","новина"],example:"Ich habe eine Nachricht bekommen.",exampleTranslation:"Я отримав повідомлення.",explanation:"Nachricht — жіночий рід: die. Залежно від контексту — повідомлення або новина.",category:"POST · VERTRÄGE",noun:nounMeta("feminine","Nachricht")}),
  ...vocabPair("vocab-schicken",{word:"schicken",translation:"надсилати",promptText:"надсилати (інфінітив)",accepted:["schicken"],reverseAccepted:["надсилати","відправляти"],example:"Ich schicke dir die Unterlagen morgen.",exampleTranslation:"Я надішлю тобі документи завтра.",explanation:"schicken — надсилати. Кому? dir (Dativ). Що? die Unterlagen (Akkusativ).",category:"POST · VERTRÄGE"}),
  ...vocabPair("vocab-unterlagen",{word:"die Unterlagen",translation:"документи",accepted:["die Unterlagen"],reverseAccepted:["документи","матеріали"],example:"Bitte schicken Sie mir die Unterlagen.",exampleTranslation:"Будь ласка, надішліть мені документи.",explanation:"Unterlagen — лише множина, тому завжди die.",category:"POST · VERTRÄGE",noun:nounMeta("plural","Unterlagen")}),
  ...vocabPair("vocab-vertrag",{word:"den Vertrag",translation:"договір",accepted:["den Vertrag"],reverseAccepted:["договір"],example:"Ich habe den Vertrag gelesen.",exampleTranslation:"Я прочитав договір.",explanation:"Der Vertrag у знахідному відмінку — den Vertrag. Чоловічий рід змінює der на den.",category:"POST · VERTRÄGE"}),
  ...vocabPair("vocab-abschliessen",{word:"abschließen",translation:"укладати; завершувати",promptText:"укладати; завершувати (інфінітив)",accepted:["abschließen","abschliessen"],reverseAccepted:["укладати","завершувати"],example:"Wir schließen den Vertrag ab.",exampleTranslation:"Ми укладаємо договір.",explanation:"abschließen — відокремлюване дієслово. У головному реченні ab стоїть у кінці.",category:"POST · VERTRÄGE"}),
  ...vocabPair("vocab-zeichnung",{word:"eine Zeichnung",translation:"малюнок; креслення",accepted:["eine Zeichnung"],reverseAccepted:["малюнок","креслення"],example:"Das ist eine schöne Zeichnung.",exampleTranslation:"Це гарний малюнок.",explanation:"Zeichnung — жіночий рід: die. Eine — неозначений артикль. Залежно від контексту — малюнок або креслення.",category:"POST · VERTRÄGE"})
];
const vocabTalkFeelingsCards=[
  ...vocabPair("vocab-vielleicht",{word:"vielleicht",translation:"можливо",accepted:["vielleicht"],reverseAccepted:["можливо","може"],example:"Vielleicht komme ich morgen.",exampleTranslation:"Можливо, я прийду завтра.",explanation:"vielleicht — можливо. Після нього одразу стоїть дієслово: Vielleicht komme ich.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-unbedingt",{word:"unbedingt",translation:"обов'язково",accepted:["unbedingt"],reverseAccepted:["обов'язково","неодмінно"],example:"Du musst unbedingt kommen!",exampleTranslation:"Ти обов'язково маєш прийти!",explanation:"unbedingt — обов'язково, неодмінно. Стоїть перед інфінітивом: musst unbedingt kommen.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-niemand",{word:"niemand",translation:"ніхто",accepted:["niemand"],reverseAccepted:["ніхто"],example:"Niemand kommt heute.",exampleTranslation:"Сьогодні ніхто не прийде.",explanation:"niemand — ніхто. Як підмет не змінюється: Niemand kommt. У знахідному відмінку — niemanden.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-erwarten",{word:"erwarten",translation:"очікувати",promptText:"очікувати (інфінітив)",accepted:["erwarten"],reverseAccepted:["очікувати","чекати"],example:"Ich erwarte dich um acht.",exampleTranslation:"Я чекаю на тебе о восьмій.",explanation:"erwarten — очікувати. Людину, яку очікують, ставимо в Akkusativ: dich.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-lacht",{word:"lacht",translation:"сміється",cloze:{promptText:"Er ___ laut.",support:"Він голосно сміється."},accepted:["lacht"],reverseAccepted:["сміється"],example:"Er lacht laut.",exampleTranslation:"Він голосно сміється.",explanation:"lachen → er lacht: для er, sie, es до основи додається -t.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-erklaert",{word:"erklärt",translation:"пояснює",cloze:{promptText:"Der Lehrer ___ die Regel.",support:"Учитель пояснює правило."},accepted:["erklärt","erklaert"],reverseAccepted:["пояснює","заявляє"],example:"Der Lehrer erklärt die Regel.",exampleTranslation:"Учитель пояснює правило.",explanation:"erklären → er erklärt: -t, як у lacht.",category:"GESPRÄCHE · GEFÜHLE"}),
  ...vocabPair("vocab-zeigt",{word:"zeigt",translation:"показує",cloze:{promptText:"Sie ___ mir das Foto.",support:"Вона показує мені фото."},accepted:["zeigt"],reverseAccepted:["показує"],example:"Sie zeigt mir das Foto.",exampleTranslation:"Вона показує мені фото.",explanation:"zeigen → sie zeigt: -t. Кому? mir — Dativ.",category:"GESPRÄCHE · GEFÜHLE"})
];
const vocabLifeDailyCards=[
  ...vocabPair("vocab-verdienen",{word:"verdienen",translation:"заробляти",promptText:"заробляти (інфінітив)",accepted:["verdienen"],reverseAccepted:["заробляти","заробити"],example:"Er verdient viel Geld.",exampleTranslation:"Він заробляє багато грошей.",explanation:"verdienen — заробляти, заробити. З er: verdient.",category:"ALLTAG · LEBEN"}),
  ...vocabPair("vocab-heiraten",{word:"heiraten",translation:"одружуватися",promptText:"одружуватися (інфінітив)",accepted:["heiraten"],reverseAccepted:["одружуватися","одружитися","вийти заміж"],example:"Sie will im Sommer heiraten.",exampleTranslation:"Вона хоче одружитися влітку.",explanation:"heiraten — одружуватися. Кого? Akkusativ: Er heiratet Anna.",category:"ALLTAG · LEBEN"}),
  ...vocabPair("vocab-leute",{word:"die Leute",translation:"люди",accepted:["die Leute"],reverseAccepted:["люди"],example:"Viele Leute kommen zum Fest.",exampleTranslation:"На свято прийде багато людей.",explanation:"Leute — лише множина з артиклем die.",category:"ALLTAG · LEBEN",noun:nounMeta("plural","Leute")}),
  ...vocabPair("vocab-darf",{word:"darf",translation:"можна",cloze:{promptText:"___ ich hier sitzen?",support:"Можна тут сісти?"},accepted:["darf"],reverseAccepted:["можу","можна","може"],example:"Darf ich hier sitzen?",exampleTranslation:"Можна тут сісти?",explanation:"dürfen — мати дозвіл. З ich і er/sie/es: darf; з du: darfst.",category:"ALLTAG · LEBEN"}),
  ...vocabPair("vocab-lied",{word:"das Lied",translation:"пісня",accepted:["das Lied"],reverseAccepted:["пісня"],example:"Ich höre das Lied gern.",exampleTranslation:"Я охоче слухаю цю пісню.",explanation:"Lied — середній рід: das.",category:"ALLTAG · LEBEN",noun:nounMeta("neuter","Lied")})
];
const vocabLicenseTravelStages=vocabStages("vocab-license-travel","Водійське посвідчення і подорожі",vocabLicenseTravelCards);
const vocabPostContractsStages=vocabStages("vocab-post-contracts","Пошта і договори",vocabPostContractsCards);
const vocabTalkFeelingsStages=vocabStages("vocab-talk-feelings","Розмови і почуття",vocabTalkFeelingsCards);
const vocabLifeDailyStages=vocabStages("vocab-life-daily","Життя і щодня",vocabLifeDailyCards);
const deckDefinitions={
  "w-questions":{title:"W-Fragen",label:"W-Fragen",badge:"W",tip:"W-questions always come first in a question, followed by the verb.",guide:{title:"W-Fragen: запитання",intro:"Оберіть питальне слово відповідно до потрібної інформації, а потім побудуйте речення навколо відмінюваного дієслова.",rules:[{detail:"Питальне слово стоїть на першому місці, а відмінюване дієслово — на другому: Wo wohnst du?",visual:{structure:[mainClause("Wo","wohnst","du")]}},{detail:"Підмет зазвичай стоїть після дієслова: Wann kommt ihr? Решта інформації йде далі.",visual:{structure:[mainClause("Wann","kommt","ihr")]}},"Використовуйте wo для місця, wohin для руху до місця, а woher — для місця, звідки хтось прибуває.","На W-Fragen не можна відповісти лише ja або nein: вони потребують конкретної інформації."]},cards,stages:wQuestionStages},
  pronouns:{title:"Personal pronouns",label:"Personal pronouns",badge:"ich",tip:"Use the pronoun that matches the person or people you are talking about.",guide:{title:"Особові займенники",intro:"Німецькі особові займенники показують, хто говорить, до кого звертаються або про кого йдеться.",rules:["ich, du, er/sie/es, wir, ihr, sie відповідають особі або групі в реченні.","Пишіть Sie з великої літери для ввічливого «Ви» в однині або множині; sie означає «вона» або «вони».","Займенник визначає форму дієслова: ich bin, du bist, wir sind.","Оберіть ihr для неформального звертання до кількох людей."]},cards:pronounCards,stages:pronounStages},
  "personal-pronoun-cases":{
    title:"Personal pronouns: Akkusativ & Dativ",label:"Pronouns · Akkusativ & Dativ",badge:"A/D",
    tip:"Спочатку визнач відмінок за німецьким дієсловом або прийменником, потім зміни займенник. Український відмінок не завжди збігається.",
    guide:{
      title:"Особові займенники: Akkusativ і Dativ",
      intro:"Повторіть Nominativ в уроці «Особові займенники». Тут вивчайте, як та сама особа змінює форму в ролі додатка. У кожному завданні потрібен лише один займенник.",
      rules:[
        {title:"Nominativ: хто виконує дію?",detail:"Вихідний займенник називає особу: ich — я, du — ти, er — він, sie — вона, es — воно, wir — ми, ihr — ви (неформально), sie — вони, Sie — Ви (ввічливо)."},
        {title:"Akkusativ: wen? / was?",detail:"Sehen, hören, kennen, besuchen і anrufen вимагають Akkusativ. Прийменник für також завжди вимагає Akkusativ."},
        {title:"Dativ: wem?",detail:"Helfen і danken вимагають Dativ. З geben одержувач стоїть у Dativ, а предмет, який передають, — в Akkusativ. Після mit завжди потрібен Dativ."},
        {title:"Не перекладай відмінок механічно",detail:"Українською кажемо «телефонувати кому», але німецьке anrufen вимагає Akkusativ. Після mit українською часто вживаємо орудний відмінок, а німецькою — Dativ."},
        {title:"Особа, число й регістр",detail:"Вона й вони мають однакову форму Nominativ, але різні форми Dativ. Ввічливе звертання завжди пишеться з великої літери, зокрема в Dativ."},
        {title:"Рід і незмінні форми",detail:"Порівняй форми в Nominativ, Akkusativ і Dativ. У er та es збігається форма Dativ; у wir та ihr однакові форми Akkusativ і Dativ. Рід es визначається німецьким іменником, навіть якщо український переклад має інший рід.",table:personalPronounCaseTable}
      ]
    },
    cards:personalPronounCaseCards,stages:personalPronounCaseStages
  },
  "reflexive-pronouns":{
    title:"Reflexive pronouns: sich & similar forms",label:"Reflexive · sich",badge:"sich",
    tip:"Спочатку визнач відмінок: якщо після дієслова вже є прямий додаток, займенник стоїть у Dativ.",
    guide:{
      title:"Зворотні займенники: sich і схожі форми",
      intro:"Повторіть особові займенники в Akkusativ і Dativ (урок «Особові займенники: Akkusativ і Dativ»). Зворотний займенник ставимо, коли підмет і додаток — одна й та сама особа.",
      rules:[
        {title:"Sich — та сама особа",detail:"Зворотний займенник показує, що дію виконує й отримує та сама особа: Ich freue mich. Для кожної особи є власна форма: mich, dich, sich, uns, euch."},
        {title:"Akkusativ після дієслів із sich",detail:"Більшість дієслів із sich вимагають Akkusativ: sich freuen auf, sich interessieren für, sich ärgern über, sich erinnern an. Прийменник після дієслова не змінює відмінка займенника."},
        {title:"Dativ, коли є прямий додаток",detail:"Якщо після дієслова вже стоїть прямий додаток в Akkusativ (die Hände, die Zähne, ein Buch), займенник стоїть у Dativ: Ich wasche mir die Hände. Ich kaufe mir ein Buch."},
        {title:"Sich для er, sie, es і Sie",detail:"Для er, sie, es, sie (мн.) і Sie форма sich однакова в обох відмінках. Ввічливе Sie пишемо з великої літери, а sich — завжди з малої."},
        {title:"Наказовий спосіб",detail:"У наказах займенник стоїть після дієслова: Setzt euch bitte! Setzen Sie sich bitte!"},
        {title:"Порівняй відмінки",detail:"Змінюються лише mich → mir і dich → dir. Решта форм, як-от sich, uns і euch, в Akkusativ і Dativ однакові.",table:reflexivePronounCaseTable}
      ]
    },
    cards:reflexiveCaseCards,stages:reflexivePronounStages
  },
  "indefinite-articles":{
    title:"Unbestimmter Artikel: ein und kein",label:"Unbestimmter Artikel: ein und kein",badge:"ein",
    tip:"Спочатку визначте рід і відмінок іменника, потім оберіть ein для ствердження або kein для заперечення.",
    guide:{
      title:"Неозначений артикль: ein і kein",
      intro:"Ein і eine вводять іменник, який ще не визначений: Das ist ein Tisch. Українська мова артиклів не має, тому рід і відмінок визначайте за німецьким іменником. Kein заперечує той самий іменник.",
      rules:[
        {title:"Ein має форми за родом",detail:"Чоловічий і середній рід мають ein, жіночий — eine. Неозначеного артикля в множині немає.",formula:"ein Tisch · ein Buch · eine Lampe · Das sind Bücher."},
        {
          title:"Ein змінюється за відмінком",
          detail:"Колонки — рід іменника: der, das, die. Від Nominativ до Akkusativ змінюється лише чоловічий рід, а в Dativ змінюються всі три.",
          table:{
            columns:genderColumns.slice(0,3),
            rows:[{label:"Nom.",title:"Nominativ",cells:["ein","ein","eine"]},{label:"Akk.",title:"Akkusativ",cells:["einen","ein","eine"]},{label:"Dat.",title:"Dativ",cells:["einem","einem","einer"]}],
            highlights:[{row:1,column:0},{row:2,column:0},{row:2,column:1},{row:2,column:2}],
            note:"Виділено зміни порівняно з Nominativ: einen в Akkusativ і всі форми в Dativ."
          }
        },
        {title:"Akkusativ стоїть після прямого додатка",detail:"Haben, brauchen, kaufen, lesen і sehen вимагають Akkusativ. Чоловічий рід отримує -en, решта роду лишаються без змін.",formula:"Ich habe einen Hund. · Ich lese ein Buch. · Ich sehe eine Katze."},
        {title:"Dativ після mit, helfen і in (Wo?)",detail:"Mit, helfen, schreiben і zeigen вимагають Dativ. Після in, що вказує на місце (Wo?), теж стоїть Dativ.",formula:"mit einem Bus · einem Freund helfen · in einer Wohnung"},
        {
          title:"Kein — заперечний артикль",
          detail:"Kein має ті самі закінчення, що й ein. У множині всі роди мають keine (Nominativ, Akkusativ) і keinen (Dativ).",
          formula:"Das sind keine Bücher. · Ich habe keine Bücher.",
          table:{
            columns:genderColumns,
            rows:[{label:"Nom.",title:"Nominativ",cells:["kein","kein","keine","keine"]},{label:"Akk.",title:"Akkusativ",cells:["keinen","kein","keine","keine"]},{label:"Dat.",title:"Dativ",cells:["keinem","keinem","keiner","keinen"]}],
            highlights:[{row:0,column:3},{row:1,column:3},{row:2,column:3}],
            note:"Виділено множину: вона однакова для всіх родів."
          }
        },
        {title:"Kein чи nicht",detail:"Kein заперечує іменник, який у ствердженні мав би ein або стояв би в множині без артикля. Nicht заперечує дію, прикметник або іменник з визначеним артиклем.",formula:"Ich habe keinen Hund. · Ich habe den Hund nicht."},
        {title:"Без артикля після sein з професією",detail:"Після sein з професією, національністю чи релігією ein не ставимо.",formula:"Er ist Lehrer. · Sie ist Ärztin."}
      ]
    },
    cards:[...indefiniteArticleCards,...indefinitePracticeExtraCards],stages:indefiniteArticleStages
  },
  possessives:{title:"Possessive pronouns",label:"Possessive pronouns",badge:"mein",tip:"Possessive pronouns show who something belongs to. Their ending follows the noun.",guide:{title:"Присвійні займенники",intro:"Уживайте присвійний займенник перед іменником, щоб показати належність: mein означає «мій», dein — «твій» тощо.",rules:["Особа-власник визначає основу: mein, dein, sein, ihr, unser, euer, Ihr, ihr.",{title:"Закінчення змінюється відповідно до іменника",detail:"mein Bruder, meine Mutter, mein Kind, meine Freunde.",table:{columns:genderColumns,rows:[{label:"Nom.",title:"Nominativ",cells:["—","—","-e","-e"]}],highlights:[{row:0,column:2},{row:0,column:3}],note:"Чоловічий і середній рід лишаються без закінчення; жіночий рід і множина додають -e до основи."}},"Пишіть Ihr з великої літери для ввічливого «Ваш»; ihr залежно від контексту означає «її» або «їхній».","Присвійний займенник стоїть перед іменником і зазвичай має ті самі закінчення, що й ein: ein Buch, mein Buch; eine Tasche, meine Tasche."]},cards:possessivePronounCards,stages:possessiveStages},
  "possessive-cases":{
    title:"Possessivartikel: Akkusativ und Dativ",label:"Possessivartikel: Akkusativ und Dativ",badge:"-em",
    tip:"Спочатку визнач відмінок, потім основу за власником і закінчення за німецьким родом або множиною іменника.",
    guide:{
      title:"Присвійні артиклі: Akkusativ і Dativ",
      intro:"Повторіть основи в уроці «Присвійні займенники». Тут вивчайте чотири моделі роду й числа в кожному відмінку. Присвійний артикль стоїть перед іменником; у відповідь вводьте лише артикль.",
      rules:[
        {title:"Власник визначає основу",detail:"Ich → mein, du → dein, er/es → sein, sie (вона) → ihr, wir → unser, ihr (ви, неформально) → euer, sie (вони) → ihr, Sie (ввічливо) → Ihr. Закінчення визначає не власник, а іменник після артикля."},
        {
          title:"Таблиця закінчень за родом і відмінком",
          detail:"Колонки за родом іменника: der — Maskulinum, das — Neutrum, die — Femininum, далі Plural. Позначка «—» означає відсутність закінчення.",
          table:{
            columns:genderColumns,
            rows:possessiveCaseRows.map(row=>({label:row.label,title:row.title,cells:genderColumns.map(column=>{
              const ending=possessiveEndings[row.grammarCase][column.gender];
              return ending?`-${ending}`:"—";
            })})),
            highlights:[{row:1,column:0}],
            note:"Від Nominativ до Akkusativ змінюється лише der: додається -en. Das, die і Plural не змінюються."
          }
        },
        {title:"Akkusativ визначає дієслово або прийменник",detail:"Besuchen, sehen, suchen, haben і brauchen вимагають Akkusativ; після für також завжди Akkusativ. У порівнянні з Nominativ змінюється лише чоловічий рід.",formula:"Akkusativ: -en · — · -e · -e"},
        {title:"Dativ: кому? або після mit і bei",detail:"Helfen, danken і antworten вимагають Dativ. З geben одержувач стоїть у Dativ, а предмет — в Akkusativ. Mit і bei завжди мають Dativ, навіть під час руху.",formula:"Dativ: -em · -em · -er · -en"},
        {title:"Дві зміни в Dativ множини",detail:"Присвійний артикль отримує -en; іменник зазвичай також отримує -n. Не додавайте -n, якщо множина вже закінчується на -n або -s.",formula:"mit meinen Freunden · mit meinen Kindern · bei meinen Eltern · mit meinen Autos"},
        {title:"Euer і ввічливе Ihr",detail:"Без закінчення пишемо euer; з закінченням зазвичай випадає внутрішнє e: eure, euren, eurem, eurer. Повні форми euere, eueren, euerem, euerer теж правильні. Ввічливе Ihr та його форми завжди мають велику літеру."},
        {title:"Не переносьте український відмінок",detail:"Anrufen має Akkusativ, хоча українською «телефонувати кому». Das Kind має середній рід, хоча «дитина» — жіночий. З in і neben місце (Wo?) має Dativ, напрямок (Wohin?) — Akkusativ."}
      ]
    },
    cards:possessiveCaseCards,stages:possessiveCaseStages
  },
  sein:{title:"Verb sein",label:"Verb sein",badge:"sein",tip:"The verb sein is irregular, so learn each form as a complete pair with its pronoun.",guide:{title:"Sein у теперішньому часі",intro:"Sein означає «бути» й відмінюється неправильно, тому його форми потрібно вивчати окремо.",rules:[{title:"Шість форм sein",detail:"Жодна форма не повторює основу sein, тому вчіть кожну разом із займенником.",table:{columns:[{label:"Однина"},{label:"Множина"}],rows:[{label:"1-ша особа",cells:["ich bin","wir sind"]},{label:"2-га особа",cells:["du bist","ihr seid"]},{label:"3-тя особа",cells:["er/sie/es ist","sie/Sie sind"]}],highlights:[{row:0,column:1},{row:2,column:1}],note:"Виділено однакову форму: у 1-й і 3-й особі множини — sind."}},"Уживайте sein для ідентифікації, опису, місцеперебування та багатьох простих представлень: Ich bin müde.","Форма має відповідати підмету: Anna ist hier, але Anna und Paul sind hier.","Пам’ятайте про велику літеру S у Sie sind під час ввічливого звертання."]},cards:seinCards,stages:seinStages},
  conjugation:{title:"Verb conjugation",label:"Verb conjugation",badge:"V",tip:"Weak verbs take regular endings: -e, -st, -t, -en, -t, -en. After a stem ending in -t or -d, add an extra e.",guide:{title:"Слабкі дієслова в Präsens",intro:"Візьміть основу дієслова й доберіть закінчення, що відповідає підмету.",rules:[{title:"Використовуйте регулярні закінчення",detail:"Більшість слабких дієслів відмінюються за однаковою схемою від ich до sie/Sie.",formula:"ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en"},{title:"Додавайте додаткове -e",detail:"Якщо основа закінчується на -t, -d або приголосний + -m/-n, додайте e перед закінченням.",formula:"du arbeitest · er arbeitet · ihr arbeitet",table:{columns:[{label:"mach-"},{label:"arbeit-"}],rows:[{label:"ich",cells:["-e","-e"]},{label:"du",cells:["-st","-est"]},{label:"er/sie/es",cells:["-t","-et"]},{label:"wir",cells:["-en","-en"]},{label:"ihr",cells:["-t","-et"]},{label:"sie/Sie",cells:["-en","-en"]}],highlights:[{row:1,column:1},{row:2,column:1},{row:4,column:1}],note:"Додаткове e з'являється лише перед закінченнями -st і -t."}},{title:"Не додавайте зайве -s",detail:"В основах на -s, -ß або -z форма du має закінчення -t замість -st.",formula:"du heißt · du tanzt · du übersetzt"}]},cards:conjugationCards,stages:conjugationStages},
  "strong-verbs":{title:"Strong verbs",label:"Strong verbs",badge:"ä",tip:"Strong verbs can change their stem vowel in singular present-tense forms.",guide:{title:"Сильні дієслова в Präsens",intro:"Спочатку повторіть повну парадигму кожного дієслова, а потім утворюйте всі форми за картками з пропусками.",rules:[{title:"Зміна e на i",detail:"Sprechen, treffen, lesen і essen змінюють e на i у другій та третій особі однини.",formula:"du sprichst · er trifft · sie liest · du isst"},{title:"Зміна a на ä",detail:"Fahren і anfangen змінюють a на ä у другій та третій особі однини.",formula:"du fährst · er fährt · du fängst an"},{title:"Особлива форма wissen",detail:"Wissen має weiß у ich і er/sie/es, weißt у du та регулярну основу wiss- у множині.",formula:"ich weiß · du weißt · wir wissen"},{title:"Anfangen є відокремлюваним",detail:"Відмінювана частина fängt стоїть на другому місці, а префікс an — у кінці головного речення.",formula:"Der Kurs fängt um neun Uhr an.",visual:{structure:[mainClause("Der Kurs","fängt","um neun Uhr","an")]}},{title:"Зберігайте основу в множині",detail:"Зміна голосного не відбувається з wir, ihr або sie/Sie.",formula:"wir sprechen · ihr esst · sie wissen · wir fangen an",table:{columns:[{label:"ich"},{label:"du"},{label:"er/sie/es"},{label:"wir/ihr/sie"}],rows:[{label:"e → i",title:"sprechen, treffen, essen",cells:["e","i","i","e"]},{label:"e → ie",title:"lesen",cells:["e","ie","ie","e"]},{label:"a → ä",title:"fahren, anfangen",cells:["a","ä","ä","a"]},{label:"i → ei",title:"wissen",cells:["ei","ei","ei","i"]}],highlights:[[0,1],[0,2],[1,1],[1,2],[2,1],[2,2],[3,0],[3,1],[3,2]].map(([row,column])=>({row,column})),note:"Голосний основи в кожній особі. Виділено зміну: e → i — sprechen, treffen, essen; e → ie — lesen; a → ä — fahren, anfangen; i → ei — wissen."}}]},cards:strongVerbCards,stages:strongVerbStages},
  "past-verbs":{title:"Past verb forms · A1",label:"Past verb forms · A1",badge:"A1",tip:"Use Perfekt for everyday A1 past events; learn Präteritum only for sein and haben.",guide:pastVerbGuide("A1"),cards:pastVerbA1Cards,stages:pastVerbA1Stages},
  "past-verbs-a2":{title:"Past verb forms · A2",label:"Past verb forms · A2",badge:"A2",tip:"Use Präteritum for modal verbs and common biography facts; retain Perfekt for everyday past events.",guide:pastVerbGuide("A2"),cards:pastVerbA2.cards,stages:pastVerbA2Stages},
  "past-verbs-b1":{title:"Past verb forms · B1",label:"Past verb forms · B1",badge:"B1",tip:"Use the broader Präteritum vocabulary in written narratives and contrast it with Perfekt.",guide:pastVerbGuide("B1"),cards:pastVerbB1.cards,stages:pastVerbB1Stages},
  perfekt:{title:"Perfekt: haben und sein",label:"Perfekt",badge:"P2",tip:"Спочатку визначте: це дія, переміщення чи зміна стану? Потім виберіть haben або sein і поставте Partizip II в кінці.",guide:{title:"Perfekt: коли haben, а коли sein?",intro:"Perfekt утворюється з відмінюваного haben або sein та Partizip II. Починайте з простого алгоритму: haben — для більшості дій; sein — переважно для переміщення і зміни стану.",rules:[{title:"1. Побудуйте рамку речення",detail:"Допоміжне дієслово стоїть на другому місці, а Partizip II — у кінці.",formula:"Ich habe die Hausaufgaben gemacht.",visual:{structure:[mainClause("Ich","habe","die Hausaufgaben","gemacht")]}},{title:"2. Оберіть haben для більшості дій",detail:"Haben уживається з діяльністю, станами, зворотними та більшістю перехідних дієслів.",formula:"Ich habe gearbeitet. · Wir haben uns getroffen.",visual:{auxiliary:{verb:"haben"}}},{title:"3. Оберіть sein для переміщення",detail:"Sein уживається, коли підмет сам переміщується або прибуває в інше місце.",formula:"Ich bin nach Hause gegangen. · Der Zug ist angekommen.",visual:{auxiliary:{verb:"sein"}}},{title:"4. Оберіть sein для зміни стану",detail:"Sein уживається, коли хтось або щось переходить у новий стан.",formula:"Das Kind ist eingeschlafen. · Er ist krank geworden."},{title:"5. Запам’ятайте особливі дієслова",detail:"Sein також уживається з sein, werden, bleiben, passieren, geschehen, begegnen та gelingen.",formula:"Sie ist zu Hause geblieben. · Was ist passiert?"},{title:"6. Перевірте прямий додаток",detail:"Якщо дієслово має прямий додаток в Akkusativ, зазвичай потрібне haben.",formula:"Ich habe ein Buch gelesen. · Sie hat die Tür geöffnet."},{title:"7. Утворіть Partizip II",detail:"Для правильних дієслів зазвичай додаємо ge-…-t; дієслова на -ieren та з невідокремлюваним префіксом не отримують ge-.",formula:"machen → gemacht · studieren → studiert · erzählen → erzählt"},{title:"8. Не плутайте стан і зміну стану",detail:"Звичайний стан часто вживається з haben, а початок нового стану — із sein.",formula:"Ich habe geschlafen. · Ich bin eingeschlafen."}]},cards:perfektCards,stages:perfektStages},
  "present-practice":{title:"Present-tense practice",practiceTitle:"Present-tense practice",label:"Präsens practice",badge:"P",tip:"Use this focused review to retrieve conjugated forms in context. Revise each verb pattern in its dedicated lesson first.",guide:{title:"Відпрацювання форм Präsens",intro:"Це повторення вже вивчених моделей дієвідмінювання, а не вступ до нових правил. Використовуйте речення як контекст, але вводьте лише відмінювану форму або форми.",rules:["У частині з пропусками введіть форму, якої бракує в німецькому реченні; підказка в дужках показує інфінітив.","У частині з українськими підказками визначте особу й число, а потім введіть лише відповідну німецьку форму, не все речення.","Вправа повторює слабкі, сильні та неправильні форми, зокрема sein, gehen, fahren, sehen і möchten."]},cards:presentPracticeCards,stages:presentPracticeStages},
  werden:{title:"Verb werden",label:"Verb werden",badge:"werden",tip:"Use werden for becoming something: Es wird kalt, Ich werde Lehrer.",guide:{title:"Werden у теперішньому часі",intro:"Werden означає «ставати». Воно відмінюється неправильно: у du і er/sie/es голосний e змінюється на i.",rules:[{title:"Шість форм werden",detail:"Основа werd- зберігається, крім du і er/sie/es: у них e переходить в i.",table:{columns:[{label:"Однина"},{label:"Множина"}],rows:[{label:"1-ша особа",cells:["ich werde","wir werden"]},{label:"2-га особа",cells:["du wirst","ihr werdet"]},{label:"3-тя особа",cells:["er/sie/es wird","sie/Sie werden"]}],highlights:[{row:1,column:0},{row:2,column:0}],note:"Виділено форми з e → i: du wirst і er/sie/es wird. Форми werde, werden і werdet мають основу werd-."}},"Werden означає «ставати»: Es wird kalt — стає холодно. Ich werde Lehrer — я стаю вчителем.","Sein описує стан, werden — зміну: Es ist kalt. Es wird kalt.",{title:"Після werden — іменна частина",detail:"Прикметник стоїть без закінчення, а назва професії — без артикля: Ich werde Lehrer. Mein Bruder will Musiker werden.",visual:{structure:[mainClause("Ich","werde","","Lehrer")]}}]},cards:werdenCards,stages:werdenStages},
  koennen:{title:"Modal verbs",label:"Modal verbs",badge:"M",tip:"Use können for ability, mögen for likes, möchten for polite wishes, and wollen for intentions.",guide:{title:"Модальні дієслова: können, mögen, möchten і wollen",intro:"Ці дієслова допомагають говорити про вміння, уподобання, ввічливі бажання та наміри. Форма залежить від підмета.",rules:[{title:"Чотири дієслова, чотири значення",detail:"Können означає «могти, вміти», mögen — «любити, подобатися», möchten — ввічливе «хотів би / хотіла б» (Konjunktiv II від mögen), wollen — «хотіти, мати намір».",table:{columns:[{label:"können"},{label:"mögen"},{label:"möchten"},{label:"wollen"}],rows:verbPersons.map((label,person)=>({label,cells:[koennenParadigm,moegenParadigm,moechtenParadigm,wollenParadigm].map(paradigm=>paradigm.forms[person])})),highlights:[0,1,2].flatMap(row=>[0,1,3].map(column=>({row,column}))),note:"Виділено однину können, mögen і wollen: ö → a, o → i; ich і er/sie/es не мають закінчення. У möchten ich і er/sie/es мають однакову форму."}},"Порівнюйте значення: Ich mag Kaffee. = «Мені подобається кава». Ich möchte einen Kaffee. = «Я хотів би / хотіла б каву». Ich will Deutsch lernen. = «Я маю намір вчити німецьку».",{detail:"З können, möchten і wollen друге дієслово стоїть в інфінітиві в кінці речення: Ich kann schwimmen. Wir möchten bezahlen. Er will nach Hause gehen.",visual:{structure:[mainClause("Ich","kann","","schwimmen")]}}]},cards:koennenCards,stages:koennenStages},  haben:{title:"Haben, bekommen & brauchen",label:"Haben, bekommen & brauchen",badge:"hab",tip:"Use haben for what you have, bekommen for what you receive, and brauchen for what you need.",guide:{title:"Haben, bekommen & brauchen",intro:"Ці три дієслова допомагають говорити про речі, людей, потреби та отримання в повсякденних ситуаціях A1.",rules:["haben означає «мати»: Ich habe einen Hund.","bekommen означає «отримувати»: Wir bekommen morgen Geld.","brauchen означає «потребувати»: Er braucht eine neue Brille.",{title:"Порівняйте форми",detail:"Bekommen і brauchen відмінюються регулярно. У haben в однині перед -st і -t випадає b.",table:{columns:[{label:"haben"},{label:"bekommen"},{label:"brauchen"}],rows:verbPersons.map((label,person)=>({label,cells:[habenParadigm,bekommenParadigm,brauchenParadigm].map(paradigm=>paradigm.forms[person])})),highlights:[{row:1,column:0},{row:2,column:0}],note:"Виділено форми haben без b."}}]},cards:habenCards,stages:habenStages},
  frequency:{title:"Frequency adverbs",label:"Frequency adverbs",badge:"oft",tip:"Frequency adverbs such as oft and nie normally stay in the middle of the sentence after the conjugated verb.",guide:{title:"Прислівники частоти",intro:"Прислівники частоти показують, як часто щось відбувається. Вони не змінюють форму й зазвичай стоять у середині речення.",rules:[{title:"Вивчайте шкалу частоти",detail:"Від найбільшої до найменшої частоти: immer, fast immer, meistens, oft, manchmal, selten, fast nie, nie.",formula:"immer → oft → manchmal → selten → nie",visual:{frequency:{scale:frequencyScale}}},{title:"Ставте прислівник після відмінюваного дієслова",detail:"У простому реченні прислівник частоти зазвичай стоїть після дієслова.",formula:"Ich lerne oft Deutsch.",visual:{structure:[mainClause("Ich","lerne","oft Deutsch")]}},{title:"Зберігайте дієслово на другому місці",detail:"Якщо речення починається з часу, підмет і прислівник ідуть після відмінюваного дієслова.",formula:"Am Sonntag lese ich manchmal ein Buch.",visual:{structure:[mainClause("Am Sonntag","lese","ich manchmal ein Buch")]}},{title:"Використовуйте nie без nicht",detail:"Nie уже означає заперечення «ніколи», тому в таких реченнях nicht не потрібне.",formula:"Wir essen nie Fleisch."}]},cards:frequencyCards,stages:frequencyStages},
  "local-prepositions":{title:"Local prepositions: Dativ & Akkusativ",label:"Local prepositions",badge:"Wo?",tip:"Ask Wo? for a position and Wohin? for a destination. The question decides Dativ or Akkusativ.",guide:{title:"Локальні прийменники: Dativ чи Akkusativ?",intro:"In, an, auf, über, unter, vor, hinter, neben і zwischen можуть стояти з двома відмінками. Відмінок визначає не сам прийменник, а значення: місце чи напрямок.",rules:[{title:"1. Запитайте Wo?",detail:"Якщо щось уже перебуває в певному місці, вживайте Dativ.",formula:"Das Buch liegt in der Schublade. · Die Vase steht auf dem Tisch.",visual:{scenes:[{kind:"drawer",motion:false,cue:"Wo?",text:"Das Buch liegt in der Schublade."},{kind:"table",motion:false,cue:"Wo?",text:"Die Vase steht auf dem Tisch."}]}},{title:"2. Запитайте Wohin?",detail:"Якщо хтось або щось рухається до місця, вживайте Akkusativ.",formula:"Er legt das Buch in die Schublade. · Ich stelle die Vase auf den Tisch.",visual:{scenes:[{kind:"drawer",motion:true,cue:"Wohin?",text:"Er legt das Buch in die Schublade."},{kind:"table",motion:true,cue:"Wohin?",text:"Ich stelle die Vase auf den Tisch."}]}},{title:"3. Помічайте артикль",detail:"У чоловічому роді Dativ dem і Akkusativ den добре показують різницю. У жіночому та середньому роді Akkusativ збігається з Nominativ (die, das), тому змінюється лише Dativ: der, dem.",formula:"Wo? → Dativ · Wohin? → Akkusativ",table:{columns:genderColumns,rows:[nominativeArticleRow,{label:"Wohin?",title:"Akkusativ",cells:definiteArticles.accusative},{label:"Wo?",title:"Dativ",cells:definiteArticles.dative}],highlights:[{row:1,column:0},{row:2,column:0},{row:2,column:1},{row:2,column:2},{row:2,column:3}],note:"Виділено зміни порівняно з Nominativ: Wohin? змінює лише чоловічий рід, Wo? — усі артиклі."}},{title:"4. Вивчайте дієслово разом зі значенням",detail:"Liegen, stehen, sitzen і hängen часто описують місце; legen, stellen, sich setzen і hängen часто описують напрямок.",formula:"Der Hund liegt unter dem Stuhl. · Der Hund läuft unter den Stuhl.",visual:{scenes:[{kind:"chair",motion:false,cue:"Wo?",text:"Der Hund liegt unter dem Stuhl."},{kind:"chair",motion:true,cue:"Wohin?",text:"Der Hund läuft unter den Stuhl."}]}},
        {title:"in — «у, в»",detail:"Щось перебуває всередині предмета, контейнера або простору.",formula:"in der Schublade · in die Schublade"},
        {title:"an — «на», «біля»",detail:"Щось висить, притулене або прикріплене до вертикальної поверхні чи краю.",formula:"an der Wand · an die Wand"},
        {title:"auf — «на»",detail:"Щось лежить або стоїть зверху на горизонтальній поверхні.",formula:"auf dem Tisch · auf den Tisch"},
        {title:"über — «над»",detail:"Щось знаходиться вище предмета, без контакту з ним.",formula:"über dem Bett · über das Bett"},
        {title:"unter — «під»",detail:"Щось знаходиться нижче предмета.",formula:"unter dem Stuhl · unter den Stuhl"},
        {title:"vor — «перед»",detail:"Щось знаходиться попереду предмета або будинку.",formula:"vor dem Haus · vor das Haus"},
        {title:"hinter — «за»",detail:"Щось знаходиться позаду предмета.",formula:"hinter dem Haus · hinter das Haus"},
        {title:"neben — «біля», «поруч»",detail:"Щось знаходиться збоку від предмета або людини, поряд з ними.",formula:"neben der Studentin · neben die Studentin"},
        {title:"zwischen — «між»",detail:"Щось знаходиться між двома або кількома предметами.",formula:"zwischen den Fenstern · zwischen die Fenster"}
      ]},cards:[...localPrepositionsDativePracticeCards,...localPrepositionsAccusativePracticeCards,...localPrepositionsContrastPracticeCards],stages:localPrepositionsStages},
  "time-expressions":{title:"Time expressions",label:"Time expressions",badge:"Zeit",tip:"Use um for clock times, am for days and daytime periods, im for months and seasons, and nachts for habitual night actions.",guide:{title:"Час: um, am, im, in та Nacht",intro:"Ці короткі слова показують, коли щось відбувається. Обирайте форму за типом часу: година, день, місяць, проміжок часу або ніч.",rules:[{title:"Уживайте um з точною годиною",detail:"Um відповідає на запитання «о котрій годині?»",formula:"um acht Uhr",visual:{clocks:[{hour:8,minute:0,text:"um acht Uhr"}]}},{title:"Уживайте am з днями, датами й частинами дня",detail:"Am — це скорочення an dem. Воно вживається з днями тижня, датами та Morgen, Vormittag, Mittag, Nachmittag, Abend.",formula:"am Montag · am ersten Mai · am Abend"},{title:"Уживайте im з місяцями та порами року",detail:"Im — це скорочення in dem.",formula:"im Mai · im Sommer"},{title:"Уживайте in для майбутнього  проміжку часу",detail:"In показує, через який час щось станеться.",formula:"in zwei Wochen · in einer Stunde"},{title:"Запам’ятайте особливі форми з Nacht",detail:"Не кажемо am Nacht. Nachts означає «уночі» загалом або регулярно; in der Nacht — під час конкретної ночі. З heute, gestern, letzte не потрібен прийменник.",formula:"nachts · in der Nacht · letzte Nacht"},{title:"Використовуйте nach і vor для розмовного часу",detail:"Nach означає хвилини після поточної години, vor — хвилини до наступної. Halb vier означає 3:30, тобто половина до четвертої.",formula:"fünf nach zehn · zehn vor sechs · halb vier",visual:{clocks:[{hour:10,minute:5,text:"fünf nach zehn"},{hour:5,minute:50,text:"zehn vor sechs"},{hour:3,minute:30,text:"halb vier"}]}}]},cards:[...timeExpressionCards,...spokenTimeCards],stages:timeExpressionStages},
  "temporal-prepositions":{
    title:"Temporale Präpositionen",label:"Temporale Präpositionen",badge:"vor",
    tip:"Спочатку визнач значення — перед, після, тому, через чи на строк, — потім відмінок: vor, in, nach + Dativ, für + Akkusativ.",
    guide:{
      title:"Прийменники часу: vor, in, nach, für",
      intro:"Um, am та im повторіть в уроці «Часові вирази». Тут вивчайте, як сказати «перед», «після», «… тому», «через …» і «на (строк)». Після vor, in і nach іменник стоїть у Dativ, після für — в Akkusativ.",
      rules:[
        {title:"Vor і nach + подія",detail:"Vor означає «перед подією», nach — «після події». Обидва прийменники вимагають Dativ.",formula:"vor dem Essen · nach der Arbeit · nach den Ferien"},
        {title:"Vor + проміжок: «… тому»",detail:"Vor із проміжком часу показує, коли щось сталося в минулому. Запитання: Wann?",formula:"vor einer Woche · vor zwei Jahren"},
        {title:"In + проміжок: «через …»",detail:"In показує момент у майбутньому, коли щось станеться. Запитання: Wann?",formula:"in zwei Minuten · in einem Monat"},
        {title:"Für + Akkusativ: «на (строк)»",detail:"Für називає запланований строк — як довго щось триватиме. Запитання: (Für) wie lange?",formula:"für eine Woche · für zwei Jahre"},
        {
          title:"Артиклі після прийменників часу",
          detail:"Колонки — рід іменника. Неозначений артикль змінюється так само: в Akkusativ einen · ein · eine, в Dativ einem · einem · einer.",
          table:{
            columns:genderColumns,
            rows:[nominativeArticleRow,{label:"Akk.",title:"Akkusativ",cells:definiteArticles.accusative},{label:"Dat.",title:"Dativ",cells:definiteArticles.dative}],
            highlights:[{row:1,column:0},{row:2,column:0},{row:2,column:1},{row:2,column:2},{row:2,column:3}],
            note:"Виділено зміни порівняно з Nominativ: в Akkusativ змінюється лише der → den, у Dativ — усі артиклі."
          }
        },
        {title:"Dativ множини отримує -n",detail:"Після vor, in і nach іменник у множині отримує -n, якщо його ще немає. Після für (Akkusativ) -n не додається.",formula:"in drei Tagen ↔ für drei Tage"},
        {title:"Um, am, von … bis",detail:"Um — точний час на годиннику, am — день тижня, частина доби або вихідні, von … bis — початок і кінець проміжку.",formula:"um 9 Uhr · am Montag · von 9 bis 17 Uhr",visual:{clocks:[{hour:9,minute:0,text:"um 9 Uhr"}]}},
        {title:"Вираз часу на початку речення",detail:"Вираз часу може стояти на першому місці. Відмінюване дієслово лишається другим, підмет іде після нього, префікс або Partizip II — у кінці.",formula:"Nach der Arbeit gehe ich ins Fitnessstudio.",visual:{structure:[mainClause("Nach der Arbeit","gehe","ich ins Fitnessstudio")]}}
      ]
    },
    cards:temporalPrepositionCards,stages:temporalPrepositionStages
  },
  "mit-ohne":{
    title:"Präpositionen mit und ohne",label:"Präpositionen mit und ohne",badge:"mit",
    tip:"Спочатку визнач, чи є предмет — mit або ohne, — потім відмінок: mit + Dativ, ohne + Akkusativ.",
    guide:{
      title:"Прийменники mit і ohne",
      intro:"Mit означає «з» і вимагає Dativ. Ohne означає «без» і вимагає Akkusativ. Вивчайте обидва прийменники разом з артиклем, присвійним займенником, займенником або без артикля.",
      rules:[
        {title:"Mit + Dativ: супровід і засіб",detail:"Mit показує, з ким щось робимо або чим щось робимо. Після mit завжди Dativ.",formula:"mit meiner Freundin · mit dem Bus"},
        {
          title:"Артиклі після mit",
          detail:"Колонки — рід іменника. Після mit усі артиклі змінюються: der → dem, die → der, das → dem, die (мн.) → den.",
          table:{
            columns:genderColumns,
            rows:[nominativeArticleRow,{label:"Dat.",title:"mit + Dativ",cells:definiteArticles.dative}],
            highlights:[0,1,2,3].map(column=>({row:1,column})),
            note:"Виділено зміни порівняно з Nominativ: після mit змінюється кожен артикль."
          }
        },
        {title:"Mit без артикля",detail:"Спосіб дії та інгредієнти часто стоять без артикля: mit Spaß, mit Liebe, Kaffee mit Milch.",formula:"mit Spaß · Kaffee mit Milch"},
        {title:"Ohne + Akkusativ: без чогось",detail:"Ohne означає «без» і вимагає Akkusativ. Змінюється лише der → den. Die, das і die (мн.) не змінюються.",formula:"ohne den Mantel · ohne Milch"},
        {
          title:"Артиклі після ohne",
          detail:"У Akkusativ змінюється лише чоловічий рід: der → den. Середній і жіночий рід та множина лишаються такими самими.",
          table:{
            columns:genderColumns,
            rows:[nominativeArticleRow,{label:"Akk.",title:"ohne + Akkusativ",cells:definiteArticles.accusative}],
            highlights:[{row:1,column:0}],
            note:"Виділено єдину зміну порівняно з Nominativ: der → den."
          }
        },
        {title:"Присвійні після ohne",detail:"Присвійні займенники після ohne змінюються як артиклі в Akkusativ: seinen, meinen, unsere.",formula:"ohne seinen Schirm · ohne unsere Kinder"},
        {title:"Займенники після mit і ohne",detail:"Після mit стоїть Dativ: mir, dir, ihm, ihr, uns, euch, ihnen. Після ohne стоїть Akkusativ: mich, dich, ihn, sie, uns, euch.",formula:"mit dir · ohne dich"},
        {title:"Неозначений артикль після ohne",detail:"Ein змінюється як у Akkusativ: einen для чоловічого роду, eine для жіночого, ein для середнього. Значення — «жодного».",formula:"ohne einen Hut · ohne eine Jacke · ohne ein Wort"},
        {title:"Mit чи ohne за змістом",detail:"Якщо є людина, їжа, допомога, гроші чи засіб — mit, якщо цього немає — ohne. Порівняйте: Brot mit Butter (з маслом) і Brot ohne Butter (без масла).",formula:"Brot mit Butter ↔ Brot ohne Butter"},
        {title:"Вираз з mit або ohne на початку речення",detail:"Фраза з mit або ohne може стояти на першому місці. Відмінюване дієслово лишається другим, підмет — після нього.",formula:"Mit dem Bus fahre ich zur Arbeit.",visual:{structure:[mainClause("Mit dem Bus","fahre","ich","zur Arbeit")]}}
      ]
    },
    cards:mitOhneCards,stages:mitOhneStages
  },
  "time-worksheet-vocabulary":{title:"Time worksheet vocabulary",label:"Time worksheet vocabulary",badge:"Zeit",tip:"Learn each new word with the seasonal or daily-routine context from the worksheet.",guide:{title:"Словник: час і пори року",intro:"У цьому уроці зібрано лише нові слова з аркуша про час. Вивчайте іменники разом з артиклем і формою множини, а дієслова — у короткому реченні.",rules:[{detail:"Вивчайте іменники з артиклем: der Baum, die Kirche, das Restaurant.",visual:{pictures:[{picture:"deciduous-tree",noun:nounMeta("masculine","Baum")},{picture:"church",noun:nounMeta("feminine","Kirche")},{picture:"fork-and-knife-with-plate",noun:nounMeta("neuter","Restaurant")}]}},"Форма множини наведена там, де вона є в аркуші: die Bäume, die Blätter, die Pilze, die Vögel.","Дієслова fallen, blühen, verbringen і genießen найкраще запам'ятовувати разом із сезонним контекстом."]},cards:timeWorksheetVocabularyCards,stages:timeWorksheetVocabularyStages},
  "everyday-vocabulary":{title:"Everyday vocabulary",label:"Everyday vocabulary",badge:"Alltag",tip:"Learn sequence words in pairs and nouns with their articles.",guide:{title:"Повсякденна лексика",intro:"Цей урок поєднує слова для опису послідовності дій із базовою лексикою про їжу та напої.",rules:[{title:"Zuerst і danach",detail:"Ці прислівники допомагають показати порядок дій.",formula:"Zuerst lese ich. Danach mache ich die Aufgabe."},{title:"Anfangen — відокремлюване дієслово",detail:"У простому реченні an стоїть у кінці.",formula:"Der Kurs fängt um neun Uhr an.",visual:{structure:[mainClause("Der Kurs","fängt","um neun Uhr","an")]}},{title:"Вивчайте іменники з артиклем",detail:"Артикль показує рід іменника. Süßigkeiten уживається у множині.",formula:"der Kräutertee · die Süßigkeiten · der Kaugummi · der Brei",visual:{pictures:[{picture:"teacup-without-handle",noun:nounMeta("masculine","Kräutertee")},{picture:"candy",noun:nounMeta("plural","Süßigkeiten")},{picture:"bowl-with-spoon",noun:nounMeta("masculine","Brei")}]}}]},cards:[...everydayVocabularyRoutineCards,...everydayVocabularyFoodCards],stages:everydayVocabularyStages},
  "travel-transport":{title:"Travel & transport",label:"Travel & transport",badge:"Bahn",tip:"Learn travel nouns with their articles, then connect route phrases and separable verbs to complete situations.",guide:{title:"Подорожі та транспорт",intro:"Цей урок охоплює транспорт, місця на станції, багаж, корисні фрази для маршруту та дії в дорозі.",rules:[{title:"Вивчайте іменники з артиклем",detail:"Артикль показує рід іменника, тому запам'ятовуйте його разом зі словом.",formula:"der Bahnhof · die Haltestelle · das Gepäck",visual:{pictures:[{picture:"station",noun:nounMeta("masculine","Bahnhof")},{picture:"bus-stop",noun:nounMeta("feminine","Haltestelle")},{picture:"baggage-claim",noun:nounMeta("neuter","Gepäck")}]}},{title:"Mit для транспорту",detail:"Щоб сказати, чим ви подорожуєте, використовуйте mit + Dativ.",formula:"mit dem Zug · mit der S-Bahn · mit dem Flugzeug",table:{columns:genderColumns,rows:[nominativeArticleRow,{label:"mit",title:"mit + Dativ",cells:definiteArticles.dative}],highlights:[0,1,2,3].map(column=>({row:1,column})),note:"Після mit змінюються всі артиклі. У множині іменник зазвичай додає -n."}},{title:"Nach і zu для напрямку",detail:"Nach уживається з містами без артикля, а zu - з людьми та багатьма місцями.",formula:"nach Paris · zu meiner Freundin"},{title:"Відокремлювані дієслова",detail:"У простому реченні префікс іде в кінець.",formula:"Der Zug fährt ab. · Wir steigen ein.",visual:{structure:[mainClause("Der Zug","fährt","","ab")]}}]},cards:[...travelTransportCards,...travelPhraseCards,...travelActionCards],stages:travelTransportStages},
  "giving-directions":{
    title:"Giving directions",label:"Giving directions",badge:"Weg",
    tip:"Give clear route instructions with direction words and familiar street landmarks.",
    guide:{
      title:"Запитати й пояснити дорогу",
      intro:"Вивчіть короткі вказівки для маршруту: спочатку задайте послідовність, потім назвіть напрямок і орієнтир.",
      rules:[
        {title:"Zuerst: спочатку",detail:"Zuerst може стояти на початку речення. Відмінюване дієслово залишається на другому місці, а підмет іде після нього.",formula:"Zuerst gehen Sie geradeaus. · Zuerst fährst du bis zur Ampel.",visual:{structure:[mainClause("Zuerst","gehen","Sie geradeaus")]}},
        {title:"Праворуч, ліворуч і прямо",detail:"Nach rechts і nach links називають напрямок; geradeaus означає рух прямо.",formula:"Gehen Sie geradeaus. · Biegen Sie nach rechts ab.",visual:{pictures:[{picture:"up-arrow",word:"geradeaus"},{picture:"right-arrow",word:"nach rechts"},{picture:"left-arrow",word:"nach links"}]}},
        {title:"Відокремлюване abbiegen",detail:"У головному реченні відмінюється biegen, а префікс ab стоїть наприкінці. В інфінітиві слово пишеться разом: abbiegen.",formula:"Sie biegen links ab. · Sie müssen links abbiegen.",visual:{structure:[mainClause("Sie","biegen","links","ab")]}},
        {title:"Орієнтири та відмінки",detail:"An der Kreuzung і an der Ampel позначають місце. Bis zur Ampel означає рух до світлофора; von керує Dativ, а zur — це скорочення zu der.",formula:"an der Kreuzung · bis zur Ampel · in der Nähe von einem Park"}
      ]
    },
    cards:[...directionInstructionCards,...directionLandmarkCards],stages:directionsStages
  },
  "dative-verbs":{
    title:"Verbs with Dativ",label:"Verbs with Dativ",badge:"D",
    tip:"Learn the verb together with its dative complement: jemandem helfen, danken, antworten.",
    guide:{
      title:"Дієслова з Dativ",
      intro:"Вивчіть 16 дієслів із таблиці. У цих значеннях людина або інший додаток стоїть у Dativ. Під час практики відновлюйте інфінітив або одну форму дієслова за українською підказкою.",
      rules:[
        {title:"Запитайте Wem? — кому?",detail:"Німецький відмінок визначає дієслово, а не український переклад. Наприклад, українське «допомагати комусь» і «слідувати за кимось» обидва мають Dativ у німецькій.",formula:"Wem? → mir · dir · ihm · ihr"},
        {title:"Займенники й артиклі",detail:"Dativ: ich → mir, du → dir, er → ihm, sie → ihr, es → ihm, wir → uns, ihr → euch, sie → ihnen, Sie → Ihnen. Артиклі: der/das → dem, die → der; множина die → den, зазвичай із -n в іменнику.",formula:"dem Lehrer · der Mutter · den Kindern",table:{columns:genderColumns,rows:[nominativeArticleRow,{label:"Dat.",title:"Dativ",cells:definiteArticles.dative}],highlights:[0,1,2,3].map(column=>({row:1,column})),note:"У Dativ змінюються всі артиклі. У множині іменник зазвичай додає -n."}},
        {title:"Що є підметом?",detail:"Коли описуєте, що подобається, належить, підходить, смакує, болить, привертає увагу або чого бракує, підметом є відповідна річ або людина. Той, хто відчуває, помічає або володіє, стоїть у Dativ. Дієслово узгоджується з підметом.",formula:"підмет: die Schuhe · Dativ: dir"},
        {title:"Особливі форми й відокремлення",detail:"У деяких дієслів голосний змінюється з a на ä або з e на i у du та er/sie/es, але не в множині. У дієсловах зі значеннями «боліти» й «привертати увагу» відокремлювана частина стоїть у кінці головного речення.",formula:"a → ä · e → i"},
        {title:"Вітати з подією",detail:"Коли вітаєте когось із подією, і людина, і подія після zu стоять у Dativ; zum = zu dem, zur = zu der.",formula:"кому: dir · з чим: zu deinem Geburtstag"},
        {title:"Дозволяти та вірити",detail:"Коли дозволяєте щось, людина стоїть у Dativ. Дозволена річ може бути в Akkusativ, а дія — у формі zu + інфінітив. «Вірити комусь» має Dativ; «вірити в когось або щось» має an + Akkusativ.",formula:"людина: Dativ · дія: zu + Infinitiv"}
      ]
    },
    cards:dativeVerbCards,stages:dativeVerbStages
  },
  "es-gibt-leisure":{title:"Es gibt & leisure places",label:"Es gibt & leisure places",badge:"gibt",tip:"Use Es gibt to say that something exists; the noun after it is in the accusative.",guide:{title:"Es gibt і місця для дозвілля",intro:"За допомогою Es gibt можна сказати, що в місті або в певному місці щось є. Далі вивчайте назви місць разом з артиклем і вислови про дозвілля.",rules:[{title:"Es gibt означає «є»",detail:"Цей вираз уживається як в однині, так і в множині. Es не перекладається окремо.",formula:"Es gibt ein Kino. · Es gibt viele Cafés."},{title:"Після Es gibt - Akkusativ",detail:"Неозначений артикль чоловічого роду змінюється з ein на einen; жіночий і середній рід залишаються без змін.",formula:"einen Park · eine Ausstellung · ein Café",table:{columns:genderColumns.slice(0,3),rows:[{label:"Nom.",title:"Nominativ",cells:["—","—","-e"]},{label:"Akk.",title:"Akkusativ",cells:["-en","—","-e"]}],highlights:[{row:1,column:0}],note:"Закінчення додається до неозначеного артикля. Змінюється лише чоловічий рід. У множині неозначеного артикля немає."}},{title:"Вивчайте місця з артиклем",detail:"Запам'ятовуйте рід і форму множини разом зі словом.",formula:"das Museum - die Museen · die Bar - die Bars",visual:{pictures:[{picture:"classical-building",noun:nounMeta("neuter","Museum",{plural:"Museen"})},{picture:"cocktail-glass",noun:nounMeta("feminine","Bar",{plural:"Bars"})}]}},{title:"Man для загальних дій",detail:"Man означає «людина / люди» в загальному значенні та має форму дієслова третьої особи однини.",formula:"Im Café kann man Kaffee trinken. · In der Disco tanzt man."},{title:"Denn пояснює причину",detail:"Denn означає «тому що». Після нього порядок слів у простому реченні не змінюється.",formula:"Ich gehe ins Kino, denn der Film ist interessant."}]},cards:[...esGibtPatternCards,...leisurePlaceCards,...leisureActivityCards],stages:esGibtLeisureStages},
  "word-order":{title:"Word order",label:"Word order",badge:"S",tip:"Use TE-KA-MO-LO for several adverbials: time, reason, manner, then place.",guide:{title:"Порядок слів у реченні",intro:"Німецький порядок слів суворіший, ніж український. Спочатку визначте тип речення, а потім знайдіть місце для відмінюваного дієслова й інфінітива.",rules:[{title:"TE-KA-MO-LO",detail:"Коли в середині речення є кілька обставин, їхній звичний порядок: TE (wann?) - KA (warum?) - MO (wie?) - LO (wo?/wohin?).",formula:"Ich fahre heute wegen des Regens mit dem Bus zur Arbeit."},{title:"Пряме речення з модальним дієсловом",detail:"Підмет стоїть першим, модальне дієслово - другим, а друге дієслово в інфінітиві - в кінці.",formula:"Ich mag am Morgen Kaffee trinken.",visual:{structure:[mainClause("Ich","mag","am Morgen Kaffee","trinken")]}},{title:"Інверсія з модальним дієсловом",detail:"Час або інша фраза може стояти першою, але модальне дієслово залишається на другому місці.",formula:"Am Morgen mag ich Kaffee trinken.",visual:{structure:[mainClause("Am Morgen","mag","ich Kaffee","trinken")]}},{title:"Питання ja/nein",detail:"Без питального слова модальне дієслово стоїть першим, підмет - другим, а інфінітив - у кінці.",formula:"Magst du am Morgen Kaffee trinken?",visual:{structure:[verbFirstClause("Magst","du am Morgen Kaffee","trinken")]}},{title:"W-Frage з модальним дієсловом",detail:"Питальне слово стоїть першим, модальне дієслово - другим, підмет - після нього, а інфінітив - у кінці.",formula:"Was magst du am Morgen trinken?",visual:{structure:[mainClause("Was","magst","du am Morgen","trinken")]}},{title:"Інші розповідні речення",detail:"Без модального дієслова відмінюване дієслово все одно стоїть на другому місці: підмет або обставина часу можуть бути першими.",formula:"Heute fahre ich mit dem Bus nach Hause.",visual:{structure:[mainClause("Heute","fahre","ich mit dem Bus nach Hause")]}}]},cards:[...wordOrderStatementCards,...wordOrderTeKaMoLoCards,...wordOrderModalCards,...wordOrderInversionCards,...wordOrderQuestionCards],stages:wordOrderStages},
  "separable-verbs":{title:"Separable verbs",label:"Separable verbs",badge:"auf",tip:"In a main clause, conjugate the verb stem and put the separable prefix at the end.",guide:{title:"Відокремлювані дієслова",intro:"Багато німецьких дієслів мають префікс, який у головному реченні відокремлюється та переходить у кінець. Вивчайте дієслово як одну одиницю: aufstehen, anrufen, einkaufen.",rules:[{title:"У головному реченні префікс відокремлюється",detail:"Відмінюється основа, а префікс стоїть у кінці речення.",formula:"Ich stehe früh auf. · Der Zug fährt ab.",visual:{structure:[mainClause("Ich","stehe","früh","auf")]}},{title:"У питанні префікс теж у кінці",detail:"Відмінювана основа стоїть після W-слова або на початку питання ja/nein.",formula:"Warum rufst du mich an?",visual:{structure:[mainClause("Warum","rufst","du mich","an")]}},{title:"У підрядному реченні дієслово не розділяється",detail:"Після weil, dass та інших сполучників повна відмінювана форма стоїть наприкінці.",formula:"..., weil ich früh aufstehe.",visual:{structure:[subordinateClause("weil","ich früh","aufstehe")]}},{title:"З модальним дієсловом інфінітив не розділяється",detail:"Модальне дієслово відмінюється, а повний інфінітив стоїть наприкінці.",formula:"Wir können früh aufstehen.",visual:{structure:[mainClause("Wir","können","früh","aufstehen")]}},{title:"Не всі префіксальні дієслова відокремлюються",detail:"be-, emp-, ent-, er-, ge-, miss-, ver-, zer- зазвичай невідокремлювані.",formula:"Ich verstehe die Aufgabe. · Wir besuchen Freunde.",visual:{structure:[mainClause("Ich","verstehe","die Aufgabe")]}}]},cards:[...separableVerbCards,...separableVerbPatternCards],stages:separableVerbStages},
  "vocab-license-travel":{
    title:"Driving licence and travel",label:"Driving licence and travel",badge:"V",
    tip:"Learn each noun with its article. Compound nouns take the article of their last part: die Führerscheinprüfung.",
    guide:{
      title:"Водійське посвідчення і подорожі",
      intro:"Ці слова стосуються водійського посвідчення, мотоцикла, подорожей і складання іспиту. Спочатку вивчіть слово з артиклем, а потім перевірте, як воно змінюється в реченні.",
      rules:[
        {title:"Складені іменники мають артикль останнього слова",detail:"Рід складеного іменника визначає його остання частина. Prüfung — жіночий рід, тож і Führerscheinprüfung — die.",formula:"die Prüfung → die Führerscheinprüfung"},
        {title:"Akkusativ після haben і durch",detail:"У знахідному відмінку чоловічий рід змінює der на den. Після durch завжди стоїть Akkusativ.",formula:"Ich habe den Führerschein. · Wir fahren durch den Tunnel."},
        {title:"Dativ після mit",detail:"Після mit стоїть Dativ: das Motorrad → dem Motorrad.",formula:"Er fährt mit dem Motorrad."},
        {title:"Дієслова reisen і schaffen",detail:"Для ich пишемо -e, а для er/sie/es — -t: reisen і schaffen відмінюються так само, як інші дієслова з цим закінченням.",formula:"ich reise · er reist · ich schaffe · er schafft"},
        {title:"geschafft у Perfekt",detail:"Partizip II від schaffen — geschafft. Разом із haben воно утворює минулий час: habe … geschafft.",formula:"Ich habe es geschafft!"}
      ]
    },
    cards:vocabLicenseTravelCards,stages:vocabLicenseTravelStages
  },
  "vocab-post-contracts":{
    title:"Post and contracts",label:"Post and contracts",badge:"P",
    tip:"Use Dativ for the recipient and Akkusativ for the thing: schicken dir die Unterlagen.",
    guide:{
      title:"Пошта і договори",
      intro:"Ці слова стосуються листів, документів і договорів. Звертайте увагу на відмінки після дієслова schicken та на відокремлюване дієслово abschließen.",
      rules:[
        {title:"Dativ і Akkusativ з schicken",detail:"Кому? — Dativ, що? — Akkusativ. Займенник dir стоїть у Dativ, а die Unterlagen — в Akkusativ.",formula:"Ich schicke dir die Unterlagen."},
        {title:"Unterlagen лише в множині",detail:"Слово Unterlagen вживається тільки в множині з артиклем die: документи, матеріали.",formula:"die Unterlagen"},
        {title:"den Vertrag — Akkusativ",detail:"Чоловічий рід у знахідному відмінку змінює der на den: der Vertrag → den Vertrag.",formula:"Ich habe den Vertrag gelesen."},
        {title:"Відокремлюване abschließen",detail:"У головному реченні відокремлювана частина ab стоїть у кінці речення.",formula:"Wir schließen den Vertrag ab."},
        {title:"eine Zeichnung — малюнок або креслення",detail:"Zeichnung — жіночий рід, тож артикль die. Неозначений артикль eine. Значення залежить від контексту.",formula:"eine Zeichnung · die Zeichnung"}
      ]
    },
    cards:vocabPostContractsCards,stages:vocabPostContractsStages
  },
  "vocab-talk-feelings":{
    title:"Conversation and feelings",label:"Conversation and feelings",badge:"C",
    tip:"Add -t for er, sie, es: er lacht, er erklärt, sie zeigt.",
    guide:{
      title:"Розмови і почуття",
      intro:"Ці слова допомагають говорити про думки, почуття та дії. Звертайте увагу на закінчення -t, порядок слів після vielleicht і форми niemand та erwarten.",
      rules:[
        {title:"Закінчення -t у er, sie, es",detail:"У формах er, sie і es до основи дієслова додається -t.",formula:"er lacht · er erklärt · sie zeigt"},
        {title:"Порядок слів після vielleicht",detail:"Після vielleicht дієслово стоїть на другому місці, тобто одразу після нього.",formula:"Vielleicht komme ich morgen."},
        {title:"niemand — ніхто",detail:"Як підмет niemand не змінюється. У знахідному відмінку це niemanden.",formula:"Niemand kommt. · Ich sehe niemanden."},
        {title:"erwarten і unbedingt",detail:"erwarten вимагає Akkusativ: Ich erwarte dich. Слово unbedingt стоїть перед інфінітивом.",formula:"Ich erwarte dich. · Du musst unbedingt kommen."}
      ]
    },
    cards:vocabTalkFeelingsCards,stages:vocabTalkFeelingsStages
  },
  "vocab-life-daily":{
    title:"Everyday life",label:"Everyday life",badge:"L",
    tip:"Remember the forms of dürfen: ich darf, du darfst, er darf. Leute is always plural.",
    guide:{
      title:"Життя і щодня",
      intro:"Ці слова стосуються життя, людей і щоденних справ. Звертайте увагу на форми dürfen, слово Leute, яке вживається лише в множині, та Akkusativ після heiraten.",
      rules:[
        {title:"dürfen: ich darf",detail:"dürfen означає «мати дозвіл». Форми: ich darf, du darfst, er/sie/es darf.",formula:"Darf ich? · du darfst · er darf"},
        {title:"die Leute — лише множина",detail:"Leute вживається лише в множині з артиклем die і означає «люди» як групу.",formula:"Viele Leute kommen zum Fest."},
        {title:"heiraten з Akkusativ",detail:"Кого? — Akkusativ: Er heiratet Anna.",formula:"Er heiratet Anna."},
        {title:"verdienen з -t",detail:"У формі er/sie/es додається -t, а для ich — -e.",formula:"ich verdiene · er verdient"},
        {title:"das Lied — середній рід",detail:"Lied має артикль das, і в знахідному відмінку він не змінюється.",formula:"Ich höre das Lied gern."}
      ]
    },
    cards:vocabLifeDailyCards,stages:vocabLifeDailyStages
  }
};
if(false){
let activeDeckId="w-questions",activeStageIndex=0,deck=[...wQuestionStages[0].cards],index=0,flipped=false,completed=0,roundCorrect=0,roundCorrectCards={},roundHadIncorrect=false,roundFinished=false,practiceInputStarted=false,verificationMode=false,verified=false,answerRevealed=false,celebrating=false,studyMode="learn",direction="uk-de";
const $=id=>document.getElementById(id);
function updatePageTitle(view){
  const activeDeck=deckDefinitions[activeDeckId];
  $("page-title").textContent=view==="practice"?(activeDeck.practiceTitle||`Practice ${activeDeck.title}`):view==="library"?"Card library":"Your progress";
}
const activityStorageKey="german-wfragen-activity-v1";
let activity={attempts:0,correct:0,days:{}};
const saved=JSON.parse(localStorage.getItem(activityStorageKey)||"null");
if(saved&&typeof saved==="object"&&saved.days&&typeof saved.days==="object")activity={attempts:Number(saved.attempts)||0,correct:Number(saved.correct)||0,days:saved.days};
const lessonStorageKey="german-progressive-lesson-path-v1";
const savedLessonProgress=JSON.parse(localStorage.getItem(lessonStorageKey)||"null");
let lessonProgress=savedLessonProgress&&typeof savedLessonProgress==="object"&&savedLessonProgress.completedStages&&typeof savedLessonProgress.completedStages==="object"?savedLessonProgress:{completedStages:{}};
const dailyPracticeStorageKey="german-daily-practice-v2";
const today=dateKey(new Date());
const savedDailyPractice=JSON.parse(localStorage.getItem(dailyPracticeStorageKey)||"null");
let dailyPractice=savedDailyPractice&&typeof savedDailyPractice==="object"&&savedDailyPractice.date===today&&savedDailyPractice.correct&&typeof savedDailyPractice.correct==="object"?{...savedDailyPractice,portions:savedDailyPractice.portions&&typeof savedDailyPractice.portions==="object"?savedDailyPractice.portions:{}}:{date:today,correct:{},portions:{}};
const lessonActivityStorageKey="german-lesson-activity-v1";
const savedLessonActivity=JSON.parse(localStorage.getItem(lessonActivityStorageKey)||"null");
let lessonActivity=savedLessonActivity&&typeof savedLessonActivity==="object"&&savedLessonActivity.lessons&&typeof savedLessonActivity.lessons==="object"?savedLessonActivity:{lessons:{}};
const lessonHistoryEndpoint="/api/lesson-history";
function migrateHabenLessonProgress(){
  let progressChanged=false,dailyPracticeChanged=false;
  const oldCompleted=lessonProgress.completedStages.koennen;
  if(Array.isArray(oldCompleted)&&oldCompleted.includes("haben-learn")){
    const habenCompleted=lessonProgress.completedStages.haben||[];
    lessonProgress.completedStages.haben=[...new Set([...habenCompleted,"haben-learn"])];
    lessonProgress.completedStages.koennen=oldCompleted.filter(stageId=>stageId!=="haben-learn");
    progressChanged=true;
  }
  const oldPracticeKey="koennen:haben-practice",newPracticeKey="haben:haben-practice";
  if(dailyPractice.correct[oldPracticeKey]){
    dailyPractice.correct[newPracticeKey]={...dailyPractice.correct[oldPracticeKey],...dailyPractice.correct[newPracticeKey]};
    delete dailyPractice.correct[oldPracticeKey];
    dailyPracticeChanged=true;
  }
  if(progressChanged)localStorage.setItem(lessonStorageKey,JSON.stringify(lessonProgress));
  if(dailyPracticeChanged)localStorage.setItem(dailyPracticeStorageKey,JSON.stringify(dailyPractice));
}
migrateHabenLessonProgress();
const legacyStageCompletions={
  "w-questions":{"w-questions:learn":["w-basics-learn","w-place-learn","w-time-learn"]},
  pronouns:{"pronouns:learn":["pronouns-singular-learn","pronouns-plural-learn"]},
  sein:{"sein:learn":["sein-singular-learn","sein-plural-learn"]}
};
function activeStage(){return deckDefinitions[activeDeckId].stages[activeStageIndex]}
function completedStages(deckId){return lessonProgress.completedStages[deckId]||[]}
function stageProgressId(stage){return stage.progressId||stage.id}
function ensureCurrentPracticeDay(){
  const currentDate=dateKey(new Date());
  if(dailyPractice.date===currentDate)return false;
  dailyPractice={date:currentDate,correct:{},portions:{}};
  localStorage.setItem(dailyPracticeStorageKey,JSON.stringify(dailyPractice));
  return true;
}
function practiceProgressKey(deckId,stage){return `${deckId}:${stageProgressId(stage)}`}
function practiceCardKey(card){return `${card.word}\u0000${card.answer||""}\u0000${card.prompt||""}`}
function hasCompletedLegacyStage(deckId,stage,done){
  const legacyIds=legacyStageCompletions[deckId]?.[stageProgressId(stage)];
  return Boolean(legacyIds?.length)&&legacyIds.every(stageId=>done.includes(stageId));
}
function isStageComplete(deckId,stageId){
  const stage=deckDefinitions[deckId].stages.find(candidate=>candidate.id===stageId);
  if(stage&&stage.mode==="input"){
    ensureCurrentPracticeDay();
    const correctCards=dailyPractice.correct[practiceProgressKey(deckId,stage)]||{};
    const practiceCards=practiceCardsForStage(deckId,stage);
    return practiceCards.length>0&&practiceCards.every(card=>correctCards[practiceCardKey(card)]===true);
  }
  const done=completedStages(deckId);
  return Boolean(stage)&&(done.includes(stageProgressId(stage))||done.includes(stage.id)||hasCompletedLegacyStage(deckId,stage,done));
}
function isStageAvailable(deckId,stageIndex){
  return true;
}
function markStageComplete(){
  const stage=activeStage(),done=completedStages(activeDeckId);
  if(stage.mode==="input")return;
  if(done.includes(stage.id))return;
  lessonProgress.completedStages[activeDeckId]=[...done,stageProgressId(stage)];
  localStorage.setItem(lessonStorageKey,JSON.stringify(lessonProgress));
}
function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function recordReview(wasCorrect){
  const today=dateKey(new Date());
  activity.attempts+=1;
  if(wasCorrect)activity.correct+=1;
  recordLessonReview(wasCorrect);
  if(wasCorrect&&activeStage().mode==="input"){
    ensureCurrentPracticeDay();
    const key=practiceProgressKey(activeDeckId,activeStage());
    if(!dailyPractice.correct[key])dailyPractice.correct[key]={};
    dailyPractice.correct[key][practiceCardKey(deck[index])]=true;
    localStorage.setItem(dailyPracticeStorageKey,JSON.stringify(dailyPractice));
  }
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
  $("streak").textContent=streak;
  document.querySelectorAll(".bar[data-day]").forEach((bar,index)=>{bar.style.height=`${Math.max(8,counts[index]/maxCount*82)}%`;bar.classList.toggle("today",dateKey(new Date(today.getFullYear(),today.getMonth(),today.getDate()-6+index))===todayKey)});
  renderProgressDashboard(streak,weeklyTotal);
}
function recordLessonReview(wasCorrect){
  const lesson=lessonActivity.lessons[activeDeckId]||{attempts:0,correct:0,lastPracticed:""};
  lesson.attempts+=1;
  if(wasCorrect)lesson.correct+=1;
  lesson.lastPracticed=new Date().toISOString();
  lessonActivity.lessons[activeDeckId]=lesson;
  localStorage.setItem(lessonActivityStorageKey,JSON.stringify(lessonActivity));
}
function isValidLessonActivity(value){
  return value&&typeof value==="object"&&value.lessons&&typeof value.lessons==="object";
}
function isValidActivity(value){
  return value&&typeof value==="object"&&Number.isFinite(value.attempts)&&Number.isFinite(value.correct)&&value.days&&typeof value.days==="object";
}
function newerLessonActivity(first,second){
  if(!first)return second;
  if(!second)return first;
  if(first.attempts!==second.attempts)return first.attempts>second.attempts?first:second;
  return new Date(first.lastPracticed).getTime()>=new Date(second.lastPracticed).getTime()?first:second;
}
function mergeLessonActivity(localHistory,diskHistory){
  const lessons={};
  Object.keys(deckDefinitions).forEach(lessonId=>{
    const localLesson=localHistory.lessons[lessonId],diskLesson=diskHistory.lessons[lessonId];
    const latest=newerLessonActivity(localLesson,diskLesson);
    if(latest)lessons[lessonId]=latest;
  });
  return {lessons};
}
function mergeActivity(localActivity,diskActivity){
  const latest=diskActivity.attempts>localActivity.attempts?diskActivity:localActivity;
  const days={...localActivity.days};
  Object.entries(diskActivity.days).forEach(([date,count])=>{days[date]=Math.max(Number(days[date])||0,Number(count)||0)});
  return {attempts:latest.attempts,correct:latest.correct,days};
}
function mergeCompletedStages(localProgress,diskProgress){
  const completedStages={...localProgress.completedStages};
  Object.entries(diskProgress).forEach(([deckId,stages])=>{
    if(!Array.isArray(stages))return;
    completedStages[deckId]=[...new Set([...(completedStages[deckId]||[]),...stages.filter(stageId=>typeof stageId==="string")])];
  });
  return {completedStages};
}
function lessonHistorySnapshot(){
  return {version:2,lessons:lessonActivity.lessons,activity,completedStages:lessonProgress.completedStages};
}
async function restoreLessonHistory(){
  try{
    const response=await fetch(lessonHistoryEndpoint);
    if(!response.ok)throw new Error(`History request failed with ${response.status}.`);
    const diskHistory=await response.json();
    if(!isValidLessonActivity(diskHistory))throw new Error("History response has an invalid format.");
    lessonActivity=mergeLessonActivity(lessonActivity,diskHistory);
    if(isValidActivity(diskHistory.activity))activity=mergeActivity(activity,diskHistory.activity);
    if(diskHistory.completedStages&&typeof diskHistory.completedStages==="object")lessonProgress=mergeCompletedStages(lessonProgress,diskHistory.completedStages);
    migrateHabenLessonProgress();
    localStorage.setItem(lessonActivityStorageKey,JSON.stringify(lessonActivity));
    localStorage.setItem(activityStorageKey,JSON.stringify(activity));
    localStorage.setItem(lessonStorageKey,JSON.stringify(lessonProgress));
    updateStats();
  }catch(error){
    console.error("Could not restore lesson history from disk.",error);
  }
}
function persistLessonHistory(){
  fetch(lessonHistoryEndpoint,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(lessonHistorySnapshot())
  }).then(response=>{
    if(!response.ok)throw new Error(`History save failed with ${response.status}.`);
  }).catch(error=>console.error("Could not save lesson history to disk.",error));
}
function lessonAccuracy(lesson){
  return lesson&&lesson.attempts?Math.round(lesson.correct/lesson.attempts*100):null;
}
function relativePracticeTime(timestamp){
  if(!timestamp)return "Not practiced yet";
  const elapsed=Math.max(0,Date.now()-new Date(timestamp).getTime()),minutes=Math.floor(elapsed/60000);
  if(minutes<1)return "Just now";
  if(minutes<60)return `${minutes}m ago`;
  const hours=Math.floor(minutes/60);
  if(hours<24)return `${hours}h ago`;
  const days=Math.floor(hours/24);
  return `${days}d ago`;
}
function startLessonReview(deckId){
  selectDeck(deckId);
  document.querySelector('[data-view="practice"]').click();
}
function renderProgressDashboard(streak,weeklyTotal){
  const overallAccuracy=activity.attempts?Math.round(activity.correct/activity.attempts*100):0;
  $("progress-accuracy").textContent=`${overallAccuracy}%`;
  $("progress-streak").textContent=streak;
  $("progress-reviewed").textContent=weeklyTotal;
  const lessons=Object.entries(deckDefinitions).map(([id,definition])=>({id,definition,activity:lessonActivity.lessons[id],accuracy:lessonAccuracy(lessonActivity.lessons[id])}));
  const practiced=lessons.filter(lesson=>lesson.activity&&lesson.activity.attempts);
  const lessonsNeedingReview=practiced.filter(lesson=>lesson.accuracy<100);
  const unpracticed=lessons.filter(lesson=>!lesson.activity?.attempts);
  $("lesson-history-note").textContent=practiced.length?"Based on your test answers":"Tracking begins with your first test answer";
  const sortByPriority=(first,second)=>first.accuracy-second.accuracy||new Date(first.activity.lastPracticed)-new Date(second.activity.lastPracticed);
  const recommended=[...lessonsNeedingReview].sort(sortByPriority)[0]||unpracticed[0]||[...practiced].sort(sortByPriority)[0];
  const shouldReview=Boolean(recommended.activity?.attempts);
  const focusButton=$("review-focus-button"),focusMessage=$("review-focus-message");
  focusButton.textContent=shouldReview?`Review ${recommended.definition.title} →`:`Start ${recommended.definition.title} →`;
  focusMessage.textContent=lessonsNeedingReview.length?`${recommended.definition.title} has your lowest recorded accuracy (${recommended.accuracy}%). A short retrieval test is the best next step.`:unpracticed.length?`Your tested lessons are all at 100% accuracy. Start ${recommended.definition.title} to build your next retrieval practice.`:`All recorded lessons are at 100% accuracy. Revisit ${recommended.definition.title} to keep your recall strong.`;
  focusButton.onclick=()=>startLessonReview(recommended.id);
  const list=$("lesson-progress-list");
  const lessonsByRecency=[...lessons].sort((first,second)=>{
    const firstPracticedAt=Date.parse(first.activity?.lastPracticed||"")||0;
    const secondPracticedAt=Date.parse(second.activity?.lastPracticed||"")||0;
    return secondPracticedAt-firstPracticedAt;
  });
  list.replaceChildren(...lessonsByRecency.map(lesson=>{
    const item=document.createElement("article");
    item.className="lesson-progress-card";
    const heading=document.createElement("div");
    const title=document.createElement("h4");
    title.textContent=lesson.definition.title;
    const lastPractice=document.createElement("span");
    lastPractice.className="lesson-last-practice";
    lastPractice.textContent=`Last test: ${relativePracticeTime(lesson.activity?.lastPracticed)}`;
    heading.append(title,lastPractice);
    const details=document.createElement("div");
    details.className="lesson-progress-details";
    const accuracy=document.createElement("strong");
    accuracy.textContent=lesson.accuracy===null?"—":`${lesson.accuracy}%`;
    const accuracyLabel=document.createElement("span");
    accuracyLabel.textContent=lesson.accuracy===null?"accuracy":"accuracy";
    const attempts=document.createElement("span");
    attempts.textContent=lesson.activity?.attempts?`${lesson.activity.attempts} test answer${lesson.activity.attempts===1?"":"s"}`:"No test answers yet";
    details.append(accuracy,accuracyLabel,attempts);
    const review=document.createElement("button");
    review.type="button";
    review.className="lesson-review-button";
    review.textContent=lesson.activity?.attempts?"Review lesson →":"Start lesson →";
    review.addEventListener("click",()=>startLessonReview(lesson.id));
    item.append(heading,details,review);
    return item;
  }));
}
function seededRandom(seed){
  let state=2166136261;
  for(let charIndex=0;charIndex<seed.length;charIndex+=1)state=Math.imul(state^seed.charCodeAt(charIndex),16777619);
  return ()=>{
    state+=0x6D2B79F5;
    let value=state;
    value=Math.imul(value^value>>>15,value|1);
    value^=value+Math.imul(value^value>>>7,value|61);
    return((value^value>>>14)>>>0)/4294967296;
  };
}
function escapedRegExp(value){return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
function sentenceRecallCard(card){
  const sentence=card.answer?card.word:card.example,translation=card.answer?card.translation:card.exampleTranslation;
  if(!sentence||!translation)return null;
  return {word:sentence,translation,category:`${card.category} · SENTENCE`,example:sentence,exampleTranslation:translation,practiceType:"sentence"};
}
function contextClozeCard(card){
  const sentence=card.answer?card.word:card.example,answer=card.answer||card.word,answerTranslation=card.answer?card.answerTranslation:card.translation;
  const matchableAnswer=answer.replace(/[?!.,]+$/,"");
  if(!sentence||!answerTranslation||!matchableAnswer)return null;
  const expression=new RegExp(escapedRegExp(matchableAnswer),"i");
  if(!expression.test(sentence))return null;
  return {word:sentence,translation:card.answer?card.translation:card.exampleTranslation,category:`${card.category} · CONTEXT`,prompt:sentence.replace(expression,"___"),exampleTranslation:"Complete the German sentence.",answer,answerTranslation};
}
function practicePool(cards){
  const variants=cards.flatMap(card=>card.practiceVariants===false?[card]:[card,sentenceRecallCard(card),contextClozeCard(card)].filter(Boolean)),unique=new Map();
  variants.forEach(card=>unique.set(practiceCardKey(card),card));
  return [...unique.values()];
}
function sampledPracticeCards(cards,size,seed){
  const shuffled=[...cards],random=seededRandom(seed);
  for(let cardIndex=shuffled.length-1;cardIndex>0;cardIndex-=1){
    const swapIndex=Math.floor(random()*(cardIndex+1));
    [shuffled[cardIndex],shuffled[swapIndex]]=[shuffled[swapIndex],shuffled[cardIndex]];
  }
  return shuffled.slice(0,Math.min(size,shuffled.length));
}
function practicePortionKey(deckId,stage){return practiceProgressKey(deckId,stage)}
function practiceCardsForStage(deckId,stage){
  if(stage.mode!=="input")return [...stage.cards];
  ensureCurrentPracticeDay();
  const key=practicePortionKey(deckId,stage),portion=Number(dailyPractice.portions[key])||0;
  return sampledPracticeCards(practicePool(stage.cards),stage.cards.length,`${dailyPractice.date}:${key}:${portion}`);
}
function startNewPracticePortion(){
  const stage=activeStage();
  if(stage.mode!=="input")return;
  ensureCurrentPracticeDay();
  const key=practicePortionKey(activeDeckId,stage);
  dailyPractice.portions[key]=(Number(dailyPractice.portions[key])||0)+1;
  delete dailyPractice.correct[key];
  localStorage.setItem(dailyPracticeStorageKey,JSON.stringify(dailyPractice));
  startStageAttempt();
  render("verification-input");
}
function startStageAttempt(){
  deck=practiceCardsForStage(activeDeckId,activeStage());
  resetStageSession();
}
function resetStageSession(){
  index=0;
  completed=0;
  roundCorrect=0;
  roundCorrectCards={};
  roundHadIncorrect=false;
  roundFinished=false;
  practiceInputStarted=false;
  verificationMode=studyMode==="test";
  flipped=false;
  verified=false;
  answerRevealed=false;
  $("verification-feedback").textContent="";
  $("verification-feedback").className="verification-feedback";
}
function setStudyMode(mode){
  studyMode=mode;
  verificationMode=mode==="test";
}
function centerPracticeCard(){
  if(verificationMode)$("flashcard").scrollIntoView({behavior:"smooth",block:"center"});
}
function selectStage(stageIndex,focusTarget="flashcard"){
  if(!isStageAvailable(activeDeckId,stageIndex))return;
  activeStageIndex=stageIndex;
  setStudyMode(activeStage().mode==="input"?"test":"learn");
  startStageAttempt();
  render(focusTarget);
}
function selectDeck(deckId,stageId){
  activeDeckId=deckId;
  const stages=deckDefinitions[deckId].stages;
  const requestedIndex=stageId?stages.findIndex(stage=>stage.id===stageId):-1;
  const firstIncompleteIndex=stages.findIndex(stage=>!isStageComplete(deckId,stage.id));
  activeStageIndex=requestedIndex>=0&&isStageAvailable(deckId,requestedIndex)?requestedIndex:firstIncompleteIndex>=0?firstIncompleteIndex:0;
  setStudyMode(activeStage().mode==="input"?"test":"learn");
  startStageAttempt();
  document.querySelector(".nav-count").textContent=deck.length;
  $("deck-guide-disclosure").open=false;
  if(!$("practice-view").classList.contains("hidden"))updatePageTitle("practice");
  render("flashcard");
}
function render(focusTarget=""){
  const card=deck[index%deck.length],activeDeck=deckDefinitions[activeDeckId],hasTarget=Boolean(card.answer),isSentencePractice=card.practiceType==="sentence",revealed=verified||answerRevealed,germanPrompt=hasTarget?(card.prompt||card.word):card.word,ukrainianPrompt=hasTarget?card.answer:card.translation,expected=hasTarget?(direction==="uk-de"?card.answer:card.answerTranslation):(direction==="uk-de"?card.word:card.translation),hasMultipleExpectedAnswers=splitAnswer(expected).length>1,testPrompt=direction==="uk-de"?hasTarget?germanPrompt:card.translation:ukrainianPrompt,studyPrompt=hasTarget?germanPrompt:card.word,studyTranslation=hasTarget?card.exampleTranslation:card.translation,answerSentence=hasTarget?card.word:card.example,answerTranslation=hasTarget?card.translation:card.exampleTranslation,inputLabel=direction==="uk-de"?(hasTarget?(isSentencePractice?"Write the complete German sentence":hasMultipleExpectedAnswers?"Write only the missing German forms":"Write only the missing German form"):"Write the German answer"):(hasTarget?(isSentencePractice?"Write the complete Ukrainian translation":hasMultipleExpectedAnswers?"Write only the missing Ukrainian meanings":"Write only the Ukrainian meaning"):"Write the Ukrainian translation"),inputPlaceholder=direction==="uk-de"?(isSentencePractice?"Type the complete German sentence...":hasMultipleExpectedAnswers?"Type the German forms...":"Type the German answer..."):(isSentencePractice?"Type the complete Ukrainian translation...":hasMultipleExpectedAnswers?"Type the Ukrainian meanings...":"Type the Ukrainian meaning...");
  renderDeckGuide(activeDeck);
  renderLessonPath(activeDeck);
  setStudyMode(studyMode);
  $("question-word").textContent=verificationMode?(revealed?expected:testPrompt):studyPrompt;
  $("translation").textContent=verificationMode?(revealed?"Правильна відповідь":inputLabel):studyTranslation;
  $("original-question-text").textContent=direction==="uk-de"?card.translation:germanPrompt;
  $("original-question").hidden=!answerRevealed||!hasTarget;
  $("category-label").textContent=card.category;
  $("w-badge").hidden=true;
  $("example").textContent=answerSentence;
  $("example-translation").textContent=answerTranslation;
  const dynamicPractice=activeStage().mode==="input";
  $("practice-portion").hidden=!dynamicPractice;
  if(dynamicPractice){
    const key=practicePortionKey(activeDeckId,activeStage()),portion=(Number(dailyPractice.portions[key])||0)+1,poolSize=practicePool(activeStage().cards).length;
    $("practice-portion-note").textContent=`Today's ${deck.length}-card set · ${poolSize} examples available${portion>1?` · portion ${portion}`:""}`;
  }
  $("session-progress-label").textContent=`Card ${index+1} of ${deck.length}`;
  const progress=Math.min(completed/deck.length*100,100),progressTrack=$("session-progress").parentElement;
  $("session-progress").style.width=`${progress}%`;
  progressTrack.setAttribute("aria-valuemax",String(deck.length));
  progressTrack.setAttribute("aria-valuenow",String(completed));
  $("deck-label").textContent=activeDeck.label;
  document.querySelector(".nav-count").textContent=deck.length;
  $("verification-label").textContent=inputLabel;
  $("verification-label").hidden=answerRevealed;
  $("verification-input").placeholder=inputPlaceholder;
  $("verification-input").hidden=answerRevealed;
  $("flashcard").classList.toggle("flipped",!verificationMode||verificationMode&&revealed);
  $("answer").style.display=verificationMode&&revealed?"block":verificationMode?"none":"";
  $("verification-panel").classList.toggle("visible",verificationMode);
  $("study-actions").classList.toggle("hidden",verificationMode);
  $("continue-button").innerHTML=verificationMode?(revealed?"Next card <span>→</span>":"Check answer"):"Next card <span>→</span>";
  $("flip-hint").hidden=!verificationMode;
  $("flip-hint").innerHTML=verificationMode?(revealed?"<span>→</span> Press Enter for next card":"<span>✓</span> Type the answer and press Enter"):"";
  $("bookmark").classList.remove("saved");
  if(!answerRevealed)$("verification-input").value=verified?expected:"";
  $("verification-input").readOnly=revealed;
  $("check-button").textContent=revealed?"Next card":"Check answer";
  $("correction-display").hidden=!answerRevealed;
  if(answerRevealed)renderCorrection($("verification-input").value,expected);else $("correction-text").replaceChildren();
  if(focusTarget)requestAnimationFrame(()=>{const element=$(focusTarget);if(!element||element.hidden){centerPracticeCard();return}element.focus();if(element===$("verification-input")&&!revealed)element.select();centerPracticeCard()});
}
function lessonChapters(stages){
  return stages.reduce((chapters,stage,stageIndex)=>{
    const name=stage.chapter||stage.title,last=chapters[chapters.length-1];
    if(last&&last.name===name)last.steps.push({stage,stageIndex});
    else chapters.push({name,steps:[{stage,stageIndex}]});
    return chapters;
  },[]);
}
function renderLessonPath(activeDeck){
  const stages=activeDeck.stages,chapters=lessonChapters(stages),current=stages[activeStageIndex];
  const doneCount=stages.filter(stage=>isStageComplete(activeDeckId,stage.id)).length;
  const activeChapterIndex=chapters.findIndex(chapter=>chapter.steps.some(step=>step.stageIndex===activeStageIndex));
  $("lesson-chapter-label").textContent=current.chapter||current.title;
  $("lesson-phase-label").textContent=current.phase||(current.mode==="input"?"Practice":"Learn");
  $("lesson-path-title").textContent=current.title;
  $("stage-objective").textContent=current.objective;
  $("lesson-step-count").textContent=`Chapter ${activeChapterIndex+1} of ${chapters.length} · ${doneCount}/${stages.length} steps done`;
  $("lesson-steps").replaceChildren(...chapters.map((chapter,chapterIndex)=>{
    const isComplete=chapter.steps.every(step=>isStageComplete(activeDeckId,step.stage.id));
    const isActive=chapterIndex===activeChapterIndex;
    const item=document.createElement("li");
    item.className=`journey-chapter${isActive?" active":""}${isComplete?" complete":""}${!isActive&&chapterIndex<activeChapterIndex?" past":""}`;
    item.style.setProperty("--steps",String(chapter.steps.length));
    const head=document.createElement("div");
    head.className="chapter-head";
    const marker=document.createElement("span");
    marker.className="chapter-marker";
    marker.textContent=isComplete?"✓":String(chapterIndex+1);
    const name=document.createElement("span");
    name.className="chapter-name";
    name.textContent=chapter.name;
    head.append(marker,name);
    const phases=document.createElement("div");
    phases.className="chapter-phases";
    phases.append(...chapter.steps.map(({stage,stageIndex})=>{
      const stepDone=isStageComplete(activeDeckId,stage.id),isCurrent=stageIndex===activeStageIndex;
      const button=document.createElement("button");
      button.type="button";
      button.className=`phase${isCurrent?" current":""}${stepDone?" done":""}`;
      button.textContent=stage.phase||(stage.mode==="input"?"Practice":"Learn");
      button.setAttribute("aria-current",isCurrent?"step":"false");
      button.setAttribute("aria-label",`${chapter.name} · ${stage.title}${stepDone?" (completed)":""}`);
      button.addEventListener("click",()=>selectStage(stageIndex));
      return button;
    }));
    item.append(head,phases);
    return item;
  }));
  const rail=$("lesson-steps"),activeItem=rail.children[activeChapterIndex];
  if(activeItem){
    const start=activeItem.offsetLeft,end=start+activeItem.offsetWidth;
    if(start<rail.scrollLeft)rail.scrollLeft=Math.max(start-14,0);
    else if(end>rail.scrollLeft+rail.clientWidth)rail.scrollLeft=end-rail.clientWidth+14;
  }
}
function renderDeckGuide(activeDeck){
  const guide=activeDeck.guide;
  $("deck-guide").hidden=!guide;
  if(!guide)return;
  $("deck-guide-title").textContent=guide.title;
  $("deck-guide-intro").textContent=guide.intro;
  $("deck-guide-count").textContent=formatRuleCount(guide.rules.length);
  $("deck-guide-toggle-label").textContent=$("deck-guide-disclosure").open?"Сховати правила":"Показати правила";
  $("deck-guide-rules").replaceChildren(...guide.rules.map((rule,index)=>{
    const item=document.createElement("li");
    const number=document.createElement("span");
    number.className="guide-rule-number";
    number.textContent=String(index+1).padStart(2,"0");
    const text=document.createElement("span");
    text.className="guide-rule-text";
    if(typeof rule==="string"){
      text.textContent=rule;
    }else{
      const title=document.createElement("strong");
      title.className="guide-rule-title";
      title.textContent=rule.title;
      const detail=document.createElement("span");
      detail.className="guide-rule-detail";
      detail.textContent=rule.detail;
      text.append(title,detail);
      if(rule.formula){
        const formula=document.createElement("span");
        formula.className="guide-rule-formula";
        formula.textContent=rule.formula;
        text.append(formula);
      }
    }
    item.append(number,text);
    return item;
  }));
}
function formatRuleCount(count){
  const lastDigit=count%10,lastTwoDigits=count%100;
  const noun=lastDigit===1&&lastTwoDigits!==11?"правило":lastDigit>=2&&lastDigit<=4&&(lastTwoDigits<12||lastTwoDigits>14)?"правила":"правил";
  return `${count} ${noun}`;
}
$("deck-guide-disclosure").addEventListener("toggle",()=>{$("deck-guide-toggle-label").textContent=$("deck-guide-disclosure").open?"Сховати правила":"Показати правила"});
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
  $("celebration-title").textContent=verificationMode?"Perfect round!":"Step complete!";
  $("celebration-message").textContent=verificationMode?"100% correct — every answer was right.":"Choose any step or switch to test mode when you are ready.";
  $("celebration").hidden=false;
  celebrating=true;
  window.setTimeout(()=>{
    $("celebration").hidden=true;
    confetti.replaceChildren();
    celebrating=false;
    startStageAttempt();
    render("flashcard");
  },2800);
}
function next(){
  if(celebrating||verificationMode&&!verified&&!answerRevealed)return;
  if(roundFinished){startStageAttempt();render(verificationMode?"verification-input":"flashcard");return}
  if(index===deck.length-1){
    completed=deck.length;
    roundFinished=true;
    markStageComplete();
    persistLessonHistory();
    render(verificationMode?"verification-input":"flashcard");
    if(!verificationMode||roundCorrect===deck.length&&!roundHadIncorrect)showCelebration();
    return;
  }
  index+=1;
  completed=Math.min(completed+1,deck.length);
  flipped=false;
  verified=false;
  answerRevealed=false;
  $("verification-feedback").textContent="";
  $("verification-feedback").className="verification-feedback";
  render(verificationMode?"verification-input":"continue-button");
}
function previous(){if(celebrating)return;if(roundFinished)startStageAttempt();index=(index-1+deck.length)%deck.length;flipped=false;verified=false;answerRevealed=false;$("verification-feedback").textContent="";render(verificationMode?"verification-input":"flashcard")}
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
function answersMatch(value,expected,allowIndividualOption=false){
  const normalizedValue=normalizeAnswer(value),normalizedExpected=normalizeAnswer(expected);
  if(normalizedValue===normalizedExpected)return true;
  const expectedOptions=splitAnswer(expected),inputOptions=splitAnswer(value);
  if(allowIndividualOption&&inputOptions.length===1)return expectedOptions.includes(inputOptions[0]);
  return expectedOptions.length>1&&inputOptions.length===expectedOptions.length&&inputOptions.every((option,index)=>option===expectedOptions[index]);
}
function handleTestEnter(){
  if(verified||answerRevealed){next();return}
  checkAnswer();
}
function checkAnswer(){
  if(verified||answerRevealed){next();return}
  if(ensureCurrentPracticeDay()){
    startStageAttempt();
    render("verification-input");
    return;
  }
  const card=deck[index%deck.length],focusedPractice=Boolean(card.answer),value=$("verification-input").value,expected=focusedPractice?(direction==="uk-de"?card.answer:card.answerTranslation):(direction==="uk-de"?card.word:card.translation);
  if(!normalizeAnswer(value)){
    $("verification-feedback").textContent="Type an answer first.";
    $("verification-feedback").className="verification-feedback incorrect";
    requestAnimationFrame(()=>$("verification-input").focus());
    return;
  }
  if(answersMatch(value,expected,card.allowIndividualOption===true)){
    verified=true;
    if(!roundCorrectCards[index]){
      roundCorrect+=1;
      roundCorrectCards[index]=true;
    }
    recordReview(true);
    $("verification-feedback").textContent="Correct! Well done.";
    $("verification-feedback").className="verification-feedback correct";
    render("verification-input");
    return;
  }
  answerRevealed=true;
  roundHadIncorrect=true;
  recordReview(false);
  $("verification-feedback").textContent="Not quite. Review the corrections below.";
  $("verification-feedback").className="verification-feedback incorrect";
  render("verification-input");
}
$("bookmark").addEventListener("click",e=>{e.stopPropagation();e.currentTarget.classList.toggle("saved");e.currentTarget.textContent=e.currentTarget.classList.contains("saved")?"♥":"♡"});
$("verification-input").addEventListener("input",e=>{if(verificationMode&&!practiceInputStarted&&e.target.value.trim()){practiceInputStarted=true;centerPracticeCard()}});
document.addEventListener("keydown",e=>{if(e.target.id==="verification-input"){if(e.key==="Enter"){e.preventDefault();handleTestEnter()}return}if(e.key==="Enter"&&verificationMode){e.preventDefault();handleTestEnter();return}if(e.key===" "&&!verificationMode){e.preventDefault();next()}if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")previous()});
document.querySelector("#check-button").addEventListener("click",handleTestEnter);
document.querySelector("#continue-button").addEventListener("click",next);
$("new-practice-portion").addEventListener("click",startNewPracticePortion);
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{const view=item.dataset.view;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(`${view}-view`).classList.remove("hidden");updatePageTitle(view)}));
document.querySelector("#start-library").addEventListener("click",()=>{selectDeck("w-questions");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-pronouns").addEventListener("click",()=>{selectDeck("pronouns");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-possessives").addEventListener("click",()=>{selectDeck("possessives");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-sein").addEventListener("click",()=>{selectDeck("sein");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-conjugation").addEventListener("click",()=>{selectDeck("conjugation");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-strong-verbs").addEventListener("click",()=>{selectDeck("strong-verbs");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-past-verbs").addEventListener("click",()=>{selectDeck("past-verbs");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-present-practice").addEventListener("click",()=>{selectDeck("present-practice");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-koennen").addEventListener("click",()=>{selectDeck("koennen");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-haben").addEventListener("click",()=>{selectDeck("haben");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-frequency").addEventListener("click",()=>{selectDeck("frequency");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-time-expressions").addEventListener("click",()=>{selectDeck("time-expressions");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-time-worksheet-vocabulary").addEventListener("click",()=>{selectDeck("time-worksheet-vocabulary");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-everyday-vocabulary").addEventListener("click",()=>{selectDeck("everyday-vocabulary");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-travel-transport").addEventListener("click",()=>{selectDeck("travel-transport");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-es-gibt-leisure").addEventListener("click",()=>{selectDeck("es-gibt-leisure");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-word-order").addEventListener("click",()=>{selectDeck("word-order");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-separable-verbs").addEventListener("click",()=>{selectDeck("separable-verbs");document.querySelector('[data-view="practice"]').click()});
render();updateStats();restoreLessonHistory();
}
