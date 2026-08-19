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
const possessivePronounCards=[
  {word:"mein",translation:"мій / моє",category:"POSSESSIVE PRONOUN",example:"Mein Bruder lernt Deutsch.",exampleTranslation:"Мій брат вивчає німецьку."},
  {word:"dein",translation:"твій / твоє",category:"POSSESSIVE PRONOUN",example:"Ist das dein Buch?",exampleTranslation:"Це твоя книга?"},
  {word:"sein",translation:"його",category:"POSSESSIVE PRONOUN",example:"Sein Auto ist neu.",exampleTranslation:"Його автомобіль новий."},
  {word:"ihr / ihre",translation:"її",category:"POSSESSIVE PRONOUN",example:"Ihre Tasche ist hier.",exampleTranslation:"Її сумка тут."},
  {word:"unser",translation:"наш / наше",category:"POSSESSIVE PRONOUN",example:"Unser Kurs beginnt heute.",exampleTranslation:"Наш курс починається сьогодні."},
  {word:"euer",translation:"ваш / ваше (неофіційно, множина)",category:"POSSESSIVE PRONOUN",example:"Euer Haus ist groß.",exampleTranslation:"Ваш будинок великий."},
  {word:"Ihr",translation:"Ваш / Ваше (ввічливо)",category:"POSSESSIVE PRONOUN",example:"Wie ist Ihr Name?",exampleTranslation:"Як Ваше ім'я?"},
  {word:"ihr / ihre",translation:"їхній / їхня",category:"POSSESSIVE PRONOUN",example:"Ihre Kinder spielen draußen.",exampleTranslation:"Їхні діти граються надворі."},
  {word:"meine",translation:"моя / моє / мої",category:"POSSESSIVE ENDING",example:"Meine Mutter arbeitet im Büro.",exampleTranslation:"Моя мама працює в офісі."},
  {word:"deine",translation:"твоя / твоє / твої",category:"POSSESSIVE ENDING",example:"Deine Freunde warten draußen.",exampleTranslation:"Твої друзі чекають надворі."},
  {word:"unsere",translation:"наша / наше / наші",category:"POSSESSIVE ENDING",example:"Unsere Wohnung ist hell.",exampleTranslation:"Наша квартира світла."},
  {word:"Ihre",translation:"Ваша / Ваше / Ваші (ввічливо)",category:"POSSESSIVE ENDING",example:"Sind Ihre Kinder zu Hause?",exampleTranslation:"Ваші діти вдома?"}
];
possessivePronounCards.filter(card=>card.word.includes("/")).forEach(card=>{card.allowIndividualOption=true});
const seinCards=[
  {word:"ich bin",translation:"я є / я знаходжусь",category:"VERB SEIN",example:"Ich bin müde.",exampleTranslation:"Я втомлений."},
  {word:"du bist",translation:"ти є / ти знаходишся",category:"VERB SEIN",example:"Du bist sehr nett.",exampleTranslation:"Ти дуже милий."},
  {word:"er / sie / es ist",translation:"він / вона / воно є",category:"VERB SEIN",example:"Sie ist meine Schwester.",exampleTranslation:"Вона моя сестра."},
  {word:"wir sind",translation:"ми є / ми знаходимося",category:"VERB SEIN",example:"Wir sind zu Hause.",exampleTranslation:"Ми вдома."},
  {word:"ihr seid",translation:"ви є / ви знаходитеся",category:"VERB SEIN",example:"Ihr seid heute spät.",exampleTranslation:"Ви сьогодні запізнилися."},
  {word:"sie / Sie sind",translation:"вони є / Ви є",category:"VERB SEIN",example:"Sie sind aus Deutschland.",exampleTranslation:"Вони з Німеччини."}
];
const conjugationCards=[
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
  {word:"sie / Sie arbeiten",translation:"вони / Ви працюють / працюєте",category:"WEAK VERB · ARBEITEN",example:"Sie arbeiten in Berlin.",exampleTranslation:"Вони працюють у Берліні."},
  {word:"du atmest",translation:"ти дихаєш",category:"EXTRA -E · ATMEN",example:"Du atmest tief ein.",exampleTranslation:"Ти глибоко вдихаєш."},
  {word:"er / sie / es landet",translation:"він / вона / воно приземляється",category:"EXTRA -E · LANDEN",example:"Das Flugzeug landet um acht Uhr.",exampleTranslation:"Літак приземляється о восьмій."},
  {word:"ihr rechnet",translation:"ви рахуєте",category:"EXTRA -E · RECHNEN",example:"Ihr rechnet die Aufgabe.",exampleTranslation:"Ви рахуєте завдання."},
  {word:"du heißt",translation:"тебе звати",category:"SIBILANT STEM · HEISSEN",example:"Wie heißt du?",exampleTranslation:"Як тебе звати?"},
  {word:"du tanzt",translation:"ти танцюєш",category:"SIBILANT STEM · TANZEN",example:"Du tanzt sehr gut.",exampleTranslation:"Ти дуже добре танцюєш."},
  {word:"du übersetzt",translation:"ти перекладаєш",category:"SIBILANT STEM · ÜBERSETZEN",example:"Du übersetzt den Text.",exampleTranslation:"Ти перекладаєш текст."}
];
const strongVerbFormCards=[
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
  {word:"sie / Sie lesen",translation:"вони читають / Ви читаєте",category:"STRONG VERB · LESEN",example:"Sie lesen deutsche Romane.",exampleTranslation:"Вони читають німецькі романи."}
];
const strongVerbClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"STRONG VERB · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова.",answer,answerTranslation,practiceType:"cloze"});
const strongVerbPracticeCards=[
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
  strongVerbClozeCard("Sie lesen die Aufgabe noch einmal.","Вони ще раз читають завдання.","Sie ___ die Aufgabe noch einmal. (lesen)","lesen","читають")
];
const strongVerbCards=[...strongVerbFormCards,...strongVerbPracticeCards];
const clozeCard=(word,translation,prompt)=>({word,translation,category:"CLOZE PRACTICE",example:prompt,exampleTranslation:"Доповни речення правильною формою дієслова."});
const translationCard=(word,translation)=>({word,translation,category:"TRANSLATION PRACTICE",example:"Übersetze den Satz ins Deutsche.",exampleTranslation:"Переклади речення німецькою."});
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
  clozeCard("Ich habe einen Mann.","У мене є чоловік.","Ich ___ einen Mann. (haben)"),
  clozeCard("Wir haben Kinder.","У нас є діти.","Wir ___ Kinder. (haben)"),
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
  translationCard("Wann bekommen wir Geld?","Коли ми отримаємо гроші?"),
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
  "Ich habe einen Mann.":["habe","маю"],
  "Wir haben Kinder.":["haben","маємо"],
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
  "Wann bekommen wir Geld?":["bekommen","отримуємо"],
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
const modalClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"KÖNNEN · LÜCKENTEXT",prompt,example:prompt,exampleTranslation:"Доповни речення правильною формою können.",answer,answerTranslation});
const modalSentenceCard=(word,translation,prompt,category="KÖNNEN · SATZBILDUNG")=>({word,translation,category,example:prompt,exampleTranslation:"Напиши повну відповідь німецькою.",answer:word,answerTranslation:translation,practiceType:"sentence"});
const koennenFormCards=[
  {word:"ich kann",translation:"я можу / вмію",category:"MODALVERB · KÖNNEN",example:"Ich kann sehr gut malen.",exampleTranslation:"Я можу дуже добре малювати."},
  {word:"du kannst",translation:"ти можеш / вмієш",category:"MODALVERB · KÖNNEN",example:"Du kannst im Sommer schwimmen.",exampleTranslation:"Ти можеш плавати влітку."},
  {word:"er / sie / es kann",translation:"він / вона / воно може",category:"MODALVERB · KÖNNEN",example:"Sie kann gut Schach spielen.",exampleTranslation:"Вона може добре грати в шахи."},
  {word:"wir können",translation:"ми можемо / вміємо",category:"MODALVERB · KÖNNEN",example:"Wir können im Winter Ski fahren.",exampleTranslation:"Ми можемо кататися на лижах узимку."},
  {word:"ihr könnt",translation:"ви можете / вмієте",category:"MODALVERB · KÖNNEN",example:"Ihr könnt zusammen Rad fahren.",exampleTranslation:"Ви можете разом кататися на велосипеді."},
  {word:"sie / Sie können",translation:"вони можуть / Ви можете",category:"MODALVERB · KÖNNEN",example:"Sie können gut Gitarre spielen.",exampleTranslation:"Вони можуть добре грати на гітарі."}
];
const koennenWordOrderCards=[
  {word:"Ich kann heute mit dem Auto zur Arbeit fahren.",translation:"Я можу сьогодні їхати на роботу машиною.",category:"KÖNNEN · AUSSAGESATZ",example:"Subjekt + können + heute + ... + Infinitiv am Ende",exampleTranslation:"Після können основне дієслово стоїть в інфінітиві в кінці речення."},
  {word:"Heute kann ich mit dem Auto zur Arbeit fahren.",translation:"Сьогодні я можу їхати на роботу машиною.",category:"KÖNNEN · AUSSAGESATZ",example:"Temporal + können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Якщо час стоїть першим, відмінюване können залишається на другому місці."},
  {word:"Kann ich heute mit dem Auto zur Arbeit fahren?",translation:"Чи можу я сьогодні їхати на роботу машиною?",category:"KÖNNEN · JA/NEIN-FRAGE",example:"Können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"У питанні без питального слова können стоїть першим."},
  {word:"Wohin kannst du mit dem Auto fahren?",translation:"Куди ти можеш поїхати машиною?",category:"KÖNNEN · W-FRAGE",example:"W-Frage + können + Subjekt + ... + Infinitiv am Ende",exampleTranslation:"Питальне слово стоїть першим, а können - другим."}
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
  modalSentenceCard("Ich kann immer gut malen.","Я завжди можу добре малювати.","gut / malen / ich / können / immer.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Du kannst im Sommer immer gerne schwimmen.","Ти завжди можеш охоче плавати влітку.","gerne / können / du / im Sommer / schwimmen / immer.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Ich kann selten spazieren gehen.","Я рідко можу гуляти.","ich / gehen / spazieren / selten / können.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Wir können im Winter oft Ski fahren.","Ми часто можемо кататися на лижах узимку.","wir / im Winter / fahren / Ski / oft / können.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Ihr könnt manchmal zusammen Rad fahren.","Ви можете іноді разом кататися на велосипедах.","zusammen / können / ihr / Rad fahren / manchmal.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Sie können gut Gitarre spielen.","Вони можуть добре грати на гітарі.","Gitarre spielen / gut / können / sie (Pl.).","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Meine Oma kann oft Kuchen backen.","Моя бабуся може часто пекти пироги.","backen / oft / meine Oma / Kuchen / können.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Am Abend kann ich immer meine Freunde treffen.","Увечері я завжди можу зустрічатися з друзями.","am Abend / ich / treffen / immer / meine Freunde / können.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Meine Brüder können manchmal Romane lesen.","Мої брати можуть іноді читати романи.","lesen / meine Brüder / manchmal / können / Romane.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Mein Opa kann oft im Internet surfen.","Мій дідусь може часто сидіти в інтернеті.","surfen / mein Opa / können / oft / im Internet.","KÖNNEN · SATZBILDUNG"),
  modalSentenceCard("Mein Mann kann nie gut fotografieren.","Мій чоловік ніколи не може добре фотографувати.","nie / mein Mann / können / gut / fotografieren.","KÖNNEN · SATZBILDUNG"),
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
  modalSentenceCard("Mein Bruder kann super Gitarre spielen.","Мій брат чудово грає на гітарі.","Мій брат круто грає на гітарі."),
  modalSentenceCard("Meine Schwester kann wunderbar singen.","Моя сестра може чудово співати.","Моя сестра може чудово співати."),
  modalSentenceCard("Deine Oma kann einen Kuchen backen.","Твоя бабуся може спекти пиріг.","Твоя бабуся може спекти пиріг."),
  modalSentenceCard("Kannst du schwimmen?","Ти вмієш плавати?","Ти вмієш плавати?"),
  modalSentenceCard("Seine Tochter kann schön malen.","Його донька вміє гарно малювати.","Його донька вміє гарно малювати."),
  modalSentenceCard("Manchmal kann ich ein Buch lesen.","Іноді я можу читати книжку.","Іноді я можу читати книжку."),
  modalSentenceCard("Ich kann nicht so gut kochen.","Я не дуже добре вмію готувати.","Я не дуже добре готую."),
  modalSentenceCard("Meine Oma kann manchmal im Internet surfen.","Моя бабуся іноді може сидіти в інтернеті.","Моя бабуся іноді сидить в інтернеті."),
  modalSentenceCard("Kannst du mir bitte helfen?","Ти можеш мені, будь ласка, допомогти?","Ти можеш будь ласка допомогти?"),
  modalSentenceCard("Meine Mutter kann nicht so gut Schach spielen.","Моя мама не дуже добре може грати в шахи.","Моя мама не дуже може грати в шахи."),
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
const habenFormCards=[
  {word:"ich habe",translation:"я маю / у мене є",category:"VERB · HABEN",example:"Ich habe heute Zeit.",exampleTranslation:"Я сьогодні маю час."},
  {word:"du hast",translation:"ти маєш / у тебе є",category:"VERB · HABEN",example:"Du hast einen Bruder.",exampleTranslation:"У тебе є брат."},
  {word:"er / sie / es hat",translation:"він / вона / воно має",category:"VERB · HABEN",example:"Sie hat eine neue Tasche.",exampleTranslation:"У неї є нова сумка."},
  {word:"wir haben",translation:"ми маємо / у нас є",category:"VERB · HABEN",example:"Wir haben ein großes Haus.",exampleTranslation:"У нас є великий будинок."},
  {word:"ihr habt",translation:"ви маєте / у вас є",category:"VERB · HABEN",example:"Ihr habt viele Fragen.",exampleTranslation:"У вас багато запитань."},
  {word:"sie / Sie haben",translation:"вони мають / Ви маєте",category:"VERB · HABEN",example:"Sie haben heute Unterricht.",exampleTranslation:"У них / Вас сьогодні урок."}
];
const habenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"HABEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова haben.",answer,answerTranslation,practiceType:"cloze"});
const habenPracticeCards=[
  habenClozeCard("Ich habe einen Hund.","У мене є собака.","Ich ___ einen Hund. (haben)","habe","маю"),
  habenClozeCard("Du hast heute Zeit.","Ти маєш час сьогодні.","Du ___ heute Zeit. (haben)","hast","маєш"),
  habenClozeCard("Meine Schwester hat eine neue Tasche.","У моєї сестри є нова сумка.","Meine Schwester ___ eine neue Tasche. (haben)","hat","має"),
  habenClozeCard("Wir haben morgen eine Prüfung.","У нас завтра іспит.","Wir ___ morgen eine Prüfung. (haben)","haben","маємо"),
  habenClozeCard("Ihr habt viele Fragen.","У вас багато запитань.","Ihr ___ viele Fragen. (haben)","habt","маєте"),
  habenClozeCard("Sie haben ein großes Haus.","У них є великий будинок.","Sie ___ ein großes Haus. (haben)","haben","мають")
];
const frequencyCards=[
  {word:"immer",translation:"завжди",category:"FREQUENCY ADVERB",example:"Ich trinke immer Kaffee.",exampleTranslation:"Я завжди п'ю каву."},
  {word:"fast immer",translation:"майже завжди",category:"FREQUENCY ADVERB",example:"Sie kommt fast immer pünktlich.",exampleTranslation:"Вона майже завжди приходить вчасно."},
  {word:"meistens",translation:"здебільшого / зазвичай",category:"FREQUENCY ADVERB",example:"Wir essen meistens zu Hause.",exampleTranslation:"Ми зазвичай їмо вдома."},
  {word:"oft",translation:"часто",category:"FREQUENCY ADVERB",example:"Er geht oft ins Kino.",exampleTranslation:"Він часто ходить у кіно."},
  {word:"manchmal",translation:"іноді",category:"FREQUENCY ADVERB",example:"Ich höre manchmal Musik.",exampleTranslation:"Я іноді слухаю музику."},
  {word:"selten",translation:"рідко",category:"FREQUENCY ADVERB",example:"Sie fährt selten mit dem Taxi.",exampleTranslation:"Вона рідко їздить таксі."},
  {word:"fast nie",translation:"майже ніколи",category:"FREQUENCY ADVERB",example:"Du kommst fast nie zu spät.",exampleTranslation:"Ти майже ніколи не запізнюєшся."},
  {word:"nie",translation:"ніколи",category:"FREQUENCY ADVERB",example:"Wir essen nie Fleisch.",exampleTranslation:"Ми ніколи не їмо м'яса."}
];
const koennenCards=[...koennenFormCards,...koennenWordOrderCards,...koennenPracticeCards,...habenFormCards,...habenPracticeCards];
const lessonStep=(id,title,objective,cards,mode="learn",chapter="",phase="")=>({id,title,objective,cards,mode,chapter:chapter||title,phase:phase||(mode==="input"?"Practice":"Learn")});
const learnThenPractice=(id,title,objective,cards,chapter=title)=>[
  lessonStep(`${id}-learn`,`Learn ${title}`,objective,cards,"learn",chapter,"Learn"),
  lessonStep(`${id}-recall`,`Practice ${title}`,`Write the German answer from the Ukrainian meaning. ${objective}`,cards,"input",chapter,"Practice")
];
const splitIntoSteps=(id,title,objective,cards,size,mode="input",chapter=title)=>cards.reduce((steps,card,cardIndex)=>{
  const stepIndex=Math.floor(cardIndex/size);
  if(!steps[stepIndex])steps[stepIndex]=lessonStep(`${id}-${stepIndex+1}`,`${title} ${stepIndex+1}`,objective,[],mode,chapter,`Part ${stepIndex+1}`);
  steps[stepIndex].cards.push(card);
  return steps;
},[]);
const wQuestionStages=[
  ...learnThenPractice("w-basics","the basic question words","Match who, what, how, which, and how many to the information you need.",cards.filter(card=>card.filter==="basics"),"Basics"),
  ...learnThenPractice("w-place","place and direction","Keep wo, wohin, and woher distinct before practicing them.",cards.filter(card=>card.filter==="place"),"Place & direction"),
  ...learnThenPractice("w-time","time and reason","Choose when or why, then practice the German question word.",cards.filter(card=>card.filter==="time"),"Time & reason")
];
const pronounStages=[
  ...learnThenPractice("pronouns-singular","singular pronouns","Connect ich, du, er, sie, and es with the person being discussed.",pronounCards.slice(0,5),"Singular"),
  ...learnThenPractice("pronouns-plural","plural and formal pronouns","Separate wir, ihr, sie, and formal Sie by who is being addressed.",pronounCards.slice(5),"Plural & formal")
];
const possessiveStages=[
  ...learnThenPractice("possessives-stems","ownership stems","Identify the owner before choosing mein, dein, sein, ihr, unser, euer, Ihr, or ihr.",possessivePronounCards.slice(0,8),"Stems"),
  ...learnThenPractice("possessives-endings","possessive endings","Notice how the ending changes with the noun in each example.",possessivePronounCards.slice(8),"Endings")
];
const seinStages=[
  ...learnThenPractice("sein-singular","singular forms of sein","Learn ich bin, du bist, and er/sie/es ist as complete pairs.",seinCards.slice(0,3),"Singular"),
  ...learnThenPractice("sein-plural","plural and formal forms of sein","Learn wir sind, ihr seid, and sie/Sie sind as complete pairs.",seinCards.slice(3),"Plural & formal")
];
const conjugationStages=[
  ...learnThenPractice("conjugation-regular","regular endings","Follow the regular ending pattern from ich to sie/Sie.",conjugationCards.slice(0,6),"Regular endings"),
  ...learnThenPractice("conjugation-extra-e","the extra -e rule","Use the extra e after stems ending in -t or -d.",conjugationCards.slice(6,15),"Extra -e"),
  ...learnThenPractice("conjugation-sibilants","sibilant stems","Use -t rather than -st after stems ending in -s, -ß, or -z.",conjugationCards.slice(15),"Sibilants")
];
const strongVerbStages=["sprechen","fahren","treffen","lesen"].flatMap((verb,verbIndex)=>[
  lessonStep(`strong-${verb}-learn`,`Learn ${verb}`,`Read the full paradigm first; notice the vowel change in du and er/sie/es.`,strongVerbFormCards.slice(verbIndex*6,verbIndex*6+6),"learn",verb,"Learn"),
  lessonStep(`strong-${verb}-cloze`,`Practice ${verb}`,`Enter only the missing conjugated form in each sentence.`,strongVerbPracticeCards.slice(verbIndex*6,verbIndex*6+6),"input",verb,"Practice")
]);
const presentClozeCards=presentPracticeCards.filter(card=>card.category==="CLOZE PRACTICE");
const presentTranslationCards=presentPracticeCards.filter(card=>card.category==="TRANSLATION PRACTICE");
const presentPracticeStages=[
  ...splitIntoSteps("present-form","Practice verb forms","Enter only the missing conjugated form; the rest of the sentence provides context.",presentClozeCards,9,"input","Verb forms"),
  ...splitIntoSteps("present-translate","Practice verb translations","Use the Ukrainian prompt, but enter only the German verb form being tested.",presentTranslationCards,9,"input","Translation")
];
const koennenClozeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · LÜCKENTEXT");
const koennenFormPracticeCards=koennenClozeCards.slice(0,6);
const koennenContextCards=koennenClozeCards.slice(6);
const koennenWordOrderPracticeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · SATZBILDUNG");
const studyCardsFromPractice=cards=>cards.map(({answer,answerTranslation,practiceType,...card})=>card);
const koennenStages=[
  lessonStep("koennen-forms-learn","Learn können","Read the six forms of können as complete pronoun-form pairs.",koennenFormCards,"learn","Können forms","Learn"),
  lessonStep("koennen-forms-practice","Practice the six forms","Test each pronoun-form pairing once by entering only the missing form of können.",koennenFormPracticeCards,"input","Können forms","Practice"),
  lessonStep("koennen-order-learn","Learn modal verb word order","Compare statements and both question patterns before building full sentences.",koennenWordOrderCards,"learn","Word order","Learn"),
  lessonStep("koennen-order-practice","Practice modal verb sentences","Reorder the given German chunks into a complete sentence. Put können in position two and the infinitive at the end.",koennenWordOrderPracticeCards,"input","Word order","Practice"),
  lessonStep("koennen-context-learn","See können in context","Read complete statements, questions, and short dialogues before completing the modal verb yourself.",studyCardsFromPractice(koennenContextCards),"learn","Können in context","Learn"),
  lessonStep("koennen-context-practice","Practice können in context","Enter only the missing form of können in longer sentences and dialogues.",koennenContextCards,"input","Können in context","Practice"),
  lessonStep("haben-learn","Learn haben","Read the six forms of haben and connect them to possession or having something.",habenFormCards,"learn","haben","Learn"),
  lessonStep("haben-practice","Practice haben","Enter only the missing conjugated form of haben in each sentence.",habenPracticeCards,"input","haben","Practice")
];
const frequencyStages=[
  ...learnThenPractice("frequency-scale","the frequency scale","Work through immer to nie in descending frequency, then practice every adverb in the same sequence.",frequencyCards,"Frequency scale")
];
const deckDefinitions={
  "w-questions":{title:"W-Fragen",label:"W-Fragen",badge:"W",tip:"W-questions always come first in a question, followed by the verb.",guide:{title:"W-Fragen: запитання",intro:"Оберіть питальне слово відповідно до потрібної інформації, а потім побудуйте речення навколо відмінюваного дієслова.",rules:["Питальне слово стоїть на першому місці, а відмінюване дієслово — на другому: Wo wohnst du?","Підмет зазвичай стоїть після дієслова: Wann kommt ihr? Решта інформації йде далі.","Використовуйте wo для місця, wohin для руху до місця, а woher — для місця, звідки хтось прибуває.","На W-Fragen не можна відповісти лише ja або nein: вони потребують конкретної інформації."]},cards,stages:wQuestionStages},
  pronouns:{title:"Personal pronouns",label:"Personal pronouns",badge:"ich",tip:"Use the pronoun that matches the person or people you are talking about.",guide:{title:"Особові займенники",intro:"Німецькі особові займенники показують, хто говорить, до кого звертаються або про кого йдеться.",rules:["ich, du, er/sie/es, wir, ihr, sie відповідають особі або групі в реченні.","Пишіть Sie з великої літери для ввічливого «Ви» в однині або множині; sie означає «вона» або «вони».","Займенник визначає форму дієслова: ich bin, du bist, wir sind.","Оберіть ihr для неформального звертання до кількох людей."]},cards:pronounCards,stages:pronounStages},
  possessives:{title:"Possessive pronouns",label:"Possessive pronouns",badge:"mein",tip:"Possessive pronouns show who something belongs to. Their ending follows the noun.",guide:{title:"Присвійні займенники",intro:"Уживайте присвійний займенник перед іменником, щоб показати належність: mein означає «мій», dein — «твій» тощо.",rules:["Особа-власник визначає основу: mein, dein, sein, ihr, unser, euer, Ihr, ihr.","Закінчення змінюється відповідно до іменника: mein Bruder, meine Mutter, mein Kind, meine Freunde.","Пишіть Ihr з великої літери для ввічливого «Ваш»; ihr залежно від контексту означає «її» або «їхній».","Присвійний займенник стоїть перед іменником і зазвичай має ті самі закінчення, що й ein: ein Buch, mein Buch; eine Tasche, meine Tasche."]},cards:possessivePronounCards,stages:possessiveStages},
  sein:{title:"Verb sein",label:"Verb sein",badge:"sein",tip:"The verb sein is irregular, so learn each form as a complete pair with its pronoun.",guide:{title:"Sein у теперішньому часі",intro:"Sein означає «бути» й відмінюється неправильно, тому його форми потрібно вивчати окремо.",rules:["ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.","Уживайте sein для ідентифікації, опису, місцеперебування та багатьох простих представлень: Ich bin müde.","Форма має відповідати підмету: Anna ist hier, але Anna und Paul sind hier.","Пам’ятайте про велику літеру S у Sie sind під час ввічливого звертання."]},cards:seinCards,stages:seinStages},
  conjugation:{title:"Verb conjugation",label:"Verb conjugation",badge:"V",tip:"Weak verbs take regular endings: -e, -st, -t, -en, -t, -en. After a stem ending in -t or -d, add an extra e.",guide:{title:"Слабкі дієслова в Präsens",intro:"Візьміть основу дієслова й доберіть закінчення, що відповідає підмету.",rules:[{title:"Використовуйте регулярні закінчення",detail:"Більшість слабких дієслів відмінюються за однаковою схемою від ich до sie/Sie.",formula:"ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en"},{title:"Додавайте додаткове -e",detail:"Якщо основа закінчується на -t, -d або приголосний + -m/-n, додайте e перед закінченням.",formula:"du arbeitest · er arbeitet · ihr arbeitet"},{title:"Не додавайте зайве -s",detail:"В основах на -s, -ß або -z форма du має закінчення -t замість -st.",formula:"du heißt · du tanzt · du übersetzt"}]},cards:conjugationCards,stages:conjugationStages},
  "strong-verbs":{title:"Strong verbs",label:"Strong verbs",badge:"ä",tip:"With these strong verbs, the stem vowel changes only in du and er/sie/es.",guide:{title:"Сильні дієслова в Präsens",intro:"Спочатку повторіть повну парадигму кожного дієслова, а потім утворюйте всі форми за картками з пропусками.",rules:[{title:"Зміна e на i",detail:"Sprechen, treffen і lesen змінюють e на i у другій та третій особі однини.",formula:"du sprichst · er trifft · sie liest"},{title:"Зміна a на ä",detail:"Fahren змінює a на ä у другій та третій особі однини.",formula:"du fährst · er fährt"},{title:"Зберігайте основу в множині",detail:"Зміна голосного не відбувається з wir, ihr або sie/Sie.",formula:"wir sprechen · ihr fahrt · sie lesen"},{title:"Уживайте звичайні закінчення Präsens",detail:"Змінюється лише голосний в основі; закінчення залишаються -e, -st, -t, -en, -t, -en.",formula:"ich lese · du liest · er liest · wir lesen"}]},cards:strongVerbCards,stages:strongVerbStages},
  "present-practice":{title:"Present-tense practice",label:"Präsens practice",badge:"P",tip:"Use this mixed review after the weak-verb lesson. It also includes irregular and strong verbs from the worksheet.",guide:{title:"Відпрацювання форм Präsens",intro:"Використовуйте речення як контекст, але вводьте лише відмінювану форму або форми, які вивчаєте.",rules:["Картки з пропусками закріплюють потрібну відмінювану форму в реченні, зокрема в запитаннях і довших контекстах.","Перекладні картки просять ввести лише форму дієслова, яку вивчають, а не все німецьке речення.","Вправа поєднує слабкі, сильні та неправильні дієслова: sein, haben, gehen, fahren, sehen і möchten."]},cards:presentPracticeCards,stages:presentPracticeStages},
  koennen:{title:"Können & haben",label:"Können & haben",badge:"k",tip:"Conjugate können in second position and put the second verb in the infinitive at the end.",guide:{title:"Können & haben: уміння та можливість",intro:"Уживайте können, щоб сказати, що хтось щось уміє або може зробити. Форма залежить від підмета, а друге дієслово залишається в інфінітиві.",rules:["Форми: ich kann, du kannst, er/sie/es kann, wir können, ihr könnt, sie/Sie können.","У розповідному реченні können стоїть на другому місці; спочатку може стояти обставина часу: Heute kann ich ... fahren.","У загальному запитанні können стоїть на першому місці. У W-Frage питальне слово стоїть першим, а können — другим.","Коли können вживається з іншим дієсловом, це дієслово переходить у кінець речення в інфінітиві: Ich kann gut Gitarre spielen.","У додатковій секції повторіть форми haben: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben."]},cards:koennenCards,stages:koennenStages},
  frequency:{title:"Frequency adverbs",label:"Frequency adverbs",badge:"oft",tip:"Frequency adverbs such as oft and nie normally stay in the middle of the sentence after the conjugated verb.",guide:{title:"Прислівники частоти",intro:"Прислівники частоти показують, як часто щось відбувається. Вони не змінюють форму й зазвичай стоять у середині речення.",rules:[{title:"Вивчайте шкалу частоти",detail:"Від найбільшої до найменшої частоти: immer, fast immer, meistens, oft, manchmal, selten, fast nie, nie.",formula:"immer → oft → manchmal → selten → nie"},{title:"Ставте прислівник після відмінюваного дієслова",detail:"У простому реченні прислівник частоти зазвичай стоїть після дієслова.",formula:"Ich lerne oft Deutsch."},{title:"Зберігайте дієслово на другому місці",detail:"Якщо речення починається з часу, підмет і прислівник ідуть після відмінюваного дієслова.",formula:"Am Sonntag lese ich manchmal ein Buch."},{title:"Використовуйте nie без nicht",detail:"Nie уже означає заперечення «ніколи», тому в таких реченнях nicht не потрібне.",formula:"Wir essen nie Fleisch."}]},cards:frequencyCards,stages:frequencyStages}
};
let activeDeckId="w-questions",activeStageIndex=0,deck=[...wQuestionStages[0].cards],index=0,flipped=false,completed=0,roundCorrect=0,roundCorrectCards={},roundHadIncorrect=false,roundFinished=false,practiceInputStarted=false,verificationMode=false,verified=false,answerRevealed=false,celebrating=false,studyMode="learn",direction="uk-de",practiceAttempt=0;
const $=id=>document.getElementById(id);
function updatePageTitle(view){
  $("page-title").textContent=view==="practice"?`Practice ${deckDefinitions[activeDeckId].title}`:view==="library"?"Card library":"Your progress";
}
const activityStorageKey="german-wfragen-activity-v1";
let activity={attempts:0,correct:0,days:{}};
const saved=JSON.parse(localStorage.getItem(activityStorageKey)||"null");
if(saved&&typeof saved==="object"&&saved.days&&typeof saved.days==="object")activity={attempts:Number(saved.attempts)||0,correct:Number(saved.correct)||0,days:saved.days};
const lessonStorageKey="german-progressive-lesson-path-v1";
const savedLessonProgress=JSON.parse(localStorage.getItem(lessonStorageKey)||"null");
let lessonProgress=savedLessonProgress&&typeof savedLessonProgress==="object"&&savedLessonProgress.completedStages&&typeof savedLessonProgress.completedStages==="object"?savedLessonProgress:{completedStages:{}};
const dailyPracticeStorageKey="german-daily-practice-v1";
const today=dateKey(new Date());
const savedDailyPractice=JSON.parse(localStorage.getItem(dailyPracticeStorageKey)||"null");
let dailyPractice=savedDailyPractice&&typeof savedDailyPractice==="object"&&savedDailyPractice.date===today&&savedDailyPractice.correct&&typeof savedDailyPractice.correct==="object"?savedDailyPractice:{date:today,correct:{}};
function activeStage(){return deckDefinitions[activeDeckId].stages[activeStageIndex]}
function completedStages(deckId){return lessonProgress.completedStages[deckId]||[]}
function ensureCurrentPracticeDay(){
  const currentDate=dateKey(new Date());
  if(dailyPractice.date===currentDate)return;
  dailyPractice={date:currentDate,correct:{}};
  localStorage.setItem(dailyPracticeStorageKey,JSON.stringify(dailyPractice));
}
function practiceProgressKey(deckId,stageId){return `${deckId}:${stageId}`}
function isStageComplete(deckId,stageId){
  const stage=deckDefinitions[deckId].stages.find(candidate=>candidate.id===stageId);
  if(stage&&stage.mode==="input"){
    ensureCurrentPracticeDay();
    const correctCards=dailyPractice.correct[practiceProgressKey(deckId,stageId)]||{};
    return stage.cards.length>0&&stage.cards.every((_,cardIndex)=>correctCards[cardIndex]===true);
  }
  return completedStages(deckId).includes(stageId);
}
function isStageAvailable(deckId,stageIndex){
  return true;
}
function markStageComplete(){
  const stage=activeStage(),done=completedStages(activeDeckId);
  if(stage.mode==="input")return;
  if(done.includes(stage.id))return;
  lessonProgress.completedStages[activeDeckId]=[...done,stage.id];
  localStorage.setItem(lessonStorageKey,JSON.stringify(lessonProgress));
}
function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function recordReview(wasCorrect){
  const today=dateKey(new Date());
  activity.attempts+=1;
  if(wasCorrect)activity.correct+=1;
  if(wasCorrect&&activeStage().mode==="input"){
    ensureCurrentPracticeDay();
    const key=practiceProgressKey(activeDeckId,activeStage().id);
    const cardIndex=activeStage().cards.indexOf(deck[index]);
    if(cardIndex<0)throw new Error("Practice card is not part of the active stage.");
    if(!dailyPractice.correct[key])dailyPractice.correct[key]={};
    dailyPractice.correct[key][cardIndex]=true;
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
  $("streak").textContent=streak;$("overview-streak").textContent=streak;$("accuracy-rate").textContent=`${activity.attempts?Math.round(activity.correct/activity.attempts*100):0}%`;$("weekly-reviewed").innerHTML=`${weeklyTotal} <small>this week</small>`;
  document.querySelectorAll(".bar[data-day]").forEach((bar,index)=>{bar.style.height=`${Math.max(8,counts[index]/maxCount*82)}%`;bar.classList.toggle("today",dateKey(new Date(today.getFullYear(),today.getMonth(),today.getDate()-6+index))===todayKey)});
}
function createUniqueShuffleSeed(){
  const entropy=new Uint32Array(2);
  globalThis.crypto.getRandomValues(entropy);
  practiceAttempt+=1;
  return `${practiceAttempt}:${entropy[0].toString(36)}:${entropy[1].toString(36)}`;
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
function shuffledPracticeCards(cards){
  const shuffled=[...cards],random=seededRandom(createUniqueShuffleSeed());
  for(let cardIndex=shuffled.length-1;cardIndex>0;cardIndex-=1){
    const swapIndex=Math.floor(random()*(cardIndex+1));
    [shuffled[cardIndex],shuffled[swapIndex]]=[shuffled[swapIndex],shuffled[cardIndex]];
  }
  return shuffled;
}
function startStageAttempt(){
  deck=activeStage().mode==="input"?shuffledPracticeCards(activeStage().cards):[...activeStage().cards];
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
  const card=deck[index%deck.length],activeDeck=deckDefinitions[activeDeckId],hasTarget=Boolean(card.answer),isSentencePractice=card.practiceType==="sentence",revealed=verified||answerRevealed,germanPrompt=hasTarget?(card.prompt||card.word):card.word,ukrainianPrompt=hasTarget?card.answer:card.translation,expected=hasTarget?(direction==="uk-de"?card.answer:card.answerTranslation):(direction==="uk-de"?card.word:card.translation),testPrompt=direction==="uk-de"?hasTarget?germanPrompt:card.translation:ukrainianPrompt,studyPrompt=hasTarget?germanPrompt:card.word,studyTranslation=hasTarget?card.exampleTranslation:card.translation,answerSentence=hasTarget?card.word:card.example,answerTranslation=hasTarget?card.translation:card.exampleTranslation,inputLabel=direction==="uk-de"?(hasTarget?(isSentencePractice?"Write the complete German sentence":"Write only the missing German form"):"Write the German answer"):(hasTarget?(isSentencePractice?"Write the complete Ukrainian translation":"Write the Ukrainian meaning"):"Write the Ukrainian translation"),inputPlaceholder=direction==="uk-de"?(isSentencePractice?"Type the complete German sentence...":"Type the German answer..."):(isSentencePractice?"Type the complete Ukrainian translation...":"Type the Ukrainian meaning...");
  renderDeckGuide(activeDeck);
  renderLessonPath(activeDeck);
  setStudyMode(studyMode);
  $("question-word").textContent=verificationMode?(revealed?expected:testPrompt):studyPrompt;
  $("translation").textContent=verificationMode?(revealed?"Правильна відповідь":inputLabel):studyTranslation;
  $("original-question-text").textContent=direction==="uk-de"?card.translation:germanPrompt;
  $("original-question").hidden=!answerRevealed||!hasTarget;
  $("category-label").textContent=card.category;
  $("w-badge").textContent=activeDeck.badge;
  $("study-tip").textContent=activeDeck.tip;
  $("example").textContent=answerSentence;
  $("example-translation").textContent=answerTranslation;
  $("remaining").textContent=Math.max(deck.length-completed,0);
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
document.querySelectorAll(".deck-item").forEach(item=>item.addEventListener("click",()=>{const filter=item.dataset.filter,stageId=filter==="all"?"":`w-${filter}-learn`;selectDeck("w-questions",stageId);document.querySelectorAll(".deck-item").forEach(x=>x.classList.remove("active"));item.classList.add("active")}));
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{const view=item.dataset.view;document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(`${view}-view`).classList.remove("hidden");updatePageTitle(view)}));
document.querySelector("#start-library").addEventListener("click",()=>{selectDeck("w-questions");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-pronouns").addEventListener("click",()=>{selectDeck("pronouns");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-possessives").addEventListener("click",()=>{selectDeck("possessives");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-sein").addEventListener("click",()=>{selectDeck("sein");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-conjugation").addEventListener("click",()=>{selectDeck("conjugation");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-strong-verbs").addEventListener("click",()=>{selectDeck("strong-verbs");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-present-practice").addEventListener("click",()=>{selectDeck("present-practice");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-koennen").addEventListener("click",()=>{selectDeck("koennen");document.querySelector('[data-view="practice"]').click()});
document.querySelector("#start-frequency").addEventListener("click",()=>{selectDeck("frequency");document.querySelector('[data-view="practice"]').click()});
render();updateStats();
