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
const possessivePronounCards=[
  {word:"mein",translation:"мій / моє",category:"POSSESSIVE PRONOUN",example:"Mein Bruder lernt Deutsch.",exampleTranslation:"Мій брат вивчає німецьку."},
  {word:"dein",translation:"твій / твоє",category:"POSSESSIVE PRONOUN",example:"Ist das dein Buch?",exampleTranslation:"Це твоя книга?"},
  {word:"sein",translation:"його",category:"POSSESSIVE PRONOUN",example:"Sein Auto ist neu.",exampleTranslation:"Його автомобіль новий."},
  {word:"ihr / ihre",translation:"її",category:"POSSESSIVE PRONOUN",targetId:"possessive-her",example:"Ihre Tasche ist hier.",exampleTranslation:"Її сумка тут."},
  {word:"unser",translation:"наш / наше",category:"POSSESSIVE PRONOUN",example:"Unser Kurs beginnt heute.",exampleTranslation:"Наш курс починається сьогодні."},
  {word:"euer",translation:"ваш / ваше (неофіційно, множина)",category:"POSSESSIVE PRONOUN",example:"Euer Haus ist groß.",exampleTranslation:"Ваш будинок великий."},
  {word:"Ihr",translation:"Ваш / Ваше (ввічливо)",category:"POSSESSIVE PRONOUN",example:"Wie ist Ihr Name?",exampleTranslation:"Як Ваше ім'я?",caseSensitive:true},
  {word:"ihr / ihre",translation:"їхній / їхня",category:"POSSESSIVE PRONOUN",targetId:"possessive-their",example:"Ihre Kinder spielen draußen.",exampleTranslation:"Їхні діти граються надворі."},
  {word:"meine",translation:"моя / моє / мої",category:"POSSESSIVE ENDING",example:"Meine Mutter arbeitet im Büro.",exampleTranslation:"Моя мама працює в офісі."},
  {word:"deine",translation:"твоя / твоє / твої",category:"POSSESSIVE ENDING",example:"Deine Freunde warten draußen.",exampleTranslation:"Твої друзі чекають надворі."},
  {word:"unsere",translation:"наша / наше / наші",category:"POSSESSIVE ENDING",example:"Unsere Wohnung ist hell.",exampleTranslation:"Наша квартира світла."},
  {word:"Ihre",translation:"Ваша / Ваше / Ваші (ввічливо)",category:"POSSESSIVE ENDING",example:"Sind Ihre Kinder zu Hause?",exampleTranslation:"Ваші діти вдома?",caseSensitive:true}
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
];
const strongVerbCards=[...strongVerbFormCards,...strongVerbPracticeCards];
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
  return a1PreteriteVerbs.has(infinitive)?card:{...card,word:`${infinitiveAndPresent} · ${perfect}`};
});
const pastVerbLegacyA1PracticeCards=pastVerbLegacyA1FormCards.map(card=>{
  const [infinitiveAndPresent,...forms]=card.word.split(" · ");
  const infinitive=infinitiveAndPresent.split(" ")[0];
  const includesPreterite=a1PreteriteVerbs.has(infinitive);
  const [preterite,perfect]=includesPreterite?forms:[null,forms[0]];
  const answer=includesPreterite?`${preterite} / ${perfect}`:perfect;
  return {word:infinitiveAndPresent,translation:card.translation,category:"PAST VERB FORMS · RECALL",prompt:includesPreterite?`Schreibe Präteritum und Perfekt von ${infinitive}.`:`Schreibe Perfekt von ${infinitive}.`,example:card.example,exampleTranslation:card.exampleTranslation,answer,answerTranslation:answer,practiceType:"cloze"};
});
function createPastVerbLevelCards(level,entries,{includePreterite=()=>true}={}){
  const formCards=entries.map(([id,infinitive,present,preterite,perfect,translation,example,exampleTranslation])=>{
    const perfectForms=Array.isArray(perfect)?perfect:[perfect];
    const showsPreterite=includePreterite({id,infinitive,present,preterite,perfect:perfectForms,translation});
    const word=showsPreterite?`${infinitive} (${present}) · ${preterite} · ${perfectForms[0]}`:`${infinitive} (${present}) · ${perfectForms[0]}`;
    return {
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
    };
  });
  const practiceCards=entries.map(([id,infinitive,present,preterite,perfect,translation,example,exampleTranslation])=>{
    const perfectForms=Array.isArray(perfect)?perfect:[perfect];
    const showsPreterite=includePreterite({id,infinitive,present,preterite,perfect:perfectForms,translation});
    const answer=showsPreterite?`${preterite} / ${perfectForms[0]}`:perfectForms[0];
    return {
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
    };
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
const perfektFrameCards=[
  {
    id:"perfekt-frame-hausaufgaben",targetId:"perfekt-frame-haben",type:"sentence-build",
    word:"Ich habe gestern die Hausaufgaben gemacht.",translation:"Я вчора зробив / зробила домашнє завдання.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Я вчора зробив / зробила домашнє завдання.",
    example:"haben + gemacht",exampleTranslation:"Відмінюване haben стоїть на другому місці, Partizip II — у кінці.",
    explanation:"Perfekt утворюється з відмінюваної форми haben та Partizip II у кінці речення.",
    response:{mode:"text",scope:"sentence",accepted:["Ich habe gestern die Hausaufgaben gemacht."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-abholen",targetId:"perfekt-frame-haben",type:"sentence-build",
    word:"Ich habe meine Tochter von der Schule abgeholt.",translation:"Я забрав / забрала доньку зі школи.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Я забрав / забрала доньку зі школи.",
    example:"habe + abgeholt",exampleTranslation:"У відокремлюваному дієслові ge стоїть між префіксом і основою.",
    explanation:"Abholen утворює Partizip II abgeholt і вживається з haben.",
    response:{mode:"text",scope:"sentence",accepted:["Ich habe meine Tochter von der Schule abgeholt."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-schreiben",targetId:"perfekt-frame-haben",type:"sentence-build",
    word:"Sie hat eine E-Mail geschrieben.",translation:"Вона написала електронного листа.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Вона написала електронного листа.",
    example:"hat + geschrieben",exampleTranslation:"Неправильний Partizip II потрібно запам’ятати разом з інфінітивом.",
    explanation:"Schreiben утворює Partizip II geschrieben і вживається з haben.",
    response:{mode:"text",scope:"sentence",accepted:["Sie hat eine E-Mail geschrieben."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-fahren",targetId:"perfekt-frame-sein",type:"sentence-build",
    word:"Wir sind nach Berlin gefahren.",translation:"Ми поїхали до Берліна.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Ми поїхали до Берліна.",
    example:"sein + gefahren",exampleTranslation:"Рух до іншого місця зазвичай утворює Perfekt із sein.",
    explanation:"Fahren у значенні руху до іншого місця вживається з sein.",
    response:{mode:"text",scope:"sentence",accepted:["Wir sind nach Berlin gefahren."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-ankommen",targetId:"perfekt-frame-sein",type:"sentence-build",
    word:"Der Bus ist spät angekommen.",translation:"Автобус прибув пізно.",category:"PERFEKT · SATZRAHMEN",
    promptText:"Автобус прибув пізно.",
    example:"ist + angekommen",exampleTranslation:"Ankommen описує прибуття й утворює Perfekt із sein.",
    explanation:"Ankommen вживається з sein; Partizip II має форму angekommen.",
    response:{mode:"text",scope:"sentence",accepted:["Der Bus ist spät angekommen."],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-frame-bleiben",targetId:"perfekt-frame-sein",type:"sentence-build",
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
    word:"Ich habe einen Brief geschrieben.",translation:"Я написав / написала листа.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ich ___ einen Brief geschrieben.",support:"У реченні є прямий додаток: einen Brief.",
    example:"Ich habe einen Brief geschrieben.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток einen Brief.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habe"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-object-door",targetId:"perfekt-auxiliary-haben-object",type:"cloze",
    word:"Sie hat die Tür geöffnet.",translation:"Вона відчинила двері.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Sie ___ die Tür geöffnet.",support:"У реченні є прямий додаток: die Tür.",
    example:"Sie hat die Tür geöffnet.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток die Tür.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["hat"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-object-film",targetId:"perfekt-auxiliary-haben-object",type:"cloze",
    word:"Ihr habt den Film gesehen.",translation:"Ви подивилися фільм.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ihr ___ den Film gesehen.",support:"У реченні є прямий додаток: den Film.",
    example:"Ihr habt den Film gesehen.",exampleTranslation:"Прямий додаток зазвичай вимагає haben.",
    explanation:"Використовуємо haben, бо дія має прямий додаток den Film.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habt"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-work",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    word:"Ich habe gestern gearbeitet.",translation:"Я вчора працював / працювала.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ich ___ gestern gearbeitet.",support:"Це просто дія, без переміщення до іншого місця.",
    example:"Ich habe gestern gearbeitet.",exampleTranslation:"Звичайна діяльність утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо arbeiten описує діяльність, а не переміщення.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["habe"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-speak",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    word:"Wir haben lange gesprochen.",translation:"Ми довго розмовляли.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Wir ___ lange gesprochen.",support:"Це діяльність, а не зміна місця.",
    example:"Wir haben lange gesprochen.",exampleTranslation:"Звичайна діяльність утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо sprechen описує діяльність.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["haben"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-activity-sleep",targetId:"perfekt-auxiliary-haben-activity",type:"cloze",
    word:"Du hast gut geschlafen.",translation:"Ти добре спав / спала.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Du ___ gut geschlafen.",support:"Це стан або діяльність без переміщення.",
    example:"Du hast gut geschlafen.",exampleTranslation:"Сон утворює Perfekt із haben.",
    explanation:"Використовуємо haben, бо schlafen не означає переміщення або зміну стану.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["hast"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-berlin",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    word:"Er ist nach Berlin gefahren.",translation:"Він поїхав до Берліна.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Er ___ nach Berlin gefahren.",support:"Підмет перемістився до іншого місця: nach Berlin.",
    example:"Er ist nach Berlin gefahren.",exampleTranslation:"Переміщення до іншого місця зазвичай вимагає sein.",
    explanation:"Використовуємо sein, бо fahren описує переміщення до іншого місця.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-arrive",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    word:"Wir sind spät angekommen.",translation:"Ми прибули пізно.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Wir ___ spät angekommen.",support:"Дієслово означає прибуття.",
    example:"Wir sind spät angekommen.",exampleTranslation:"Прибуття утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо ankommen означає прибуття в інше місце.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["sind"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-movement-home",targetId:"perfekt-auxiliary-sein-movement",type:"cloze",
    word:"Ihr seid nach Hause gegangen.",translation:"Ви пішли додому.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Ihr ___ nach Hause gegangen.",support:"Підмет перемістився додому.",
    example:"Ihr seid nach Hause gegangen.",exampleTranslation:"Переміщення до іншого місця зазвичай вимагає sein.",
    explanation:"Використовуємо sein, бо gehen описує переміщення.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["seid"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-asleep",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
    word:"Das Kind ist eingeschlafen.",translation:"Дитина заснула.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Das Kind ___ eingeschlafen.",support:"Відбулася зміна стану: дитина не спала, а потім заснула.",
    example:"Das Kind ist eingeschlafen.",exampleTranslation:"Зміна стану утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо einschlafen означає перехід у новий стан.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-awake",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
    word:"Meine Schwester ist aufgewacht.",translation:"Моя сестра прокинулася.",category:"PERFEKT · HABEN ODER SEIN",
    promptText:"Meine Schwester ___ aufgewacht.",support:"Відбулася зміна стану: від сну до пробудження.",
    example:"Meine Schwester ist aufgewacht.",exampleTranslation:"Зміна стану утворює Perfekt із sein.",
    explanation:"Використовуємо sein, бо aufwachen означає зміну стану.",
    practiceVariants:false,response:{mode:"text",scope:"word",accepted:["ist"],caseSensitive:false,punctuationSensitive:false}
  },
  {
    id:"perfekt-auxiliary-state-become",targetId:"perfekt-auxiliary-sein-state",type:"cloze",
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
const modalVerbClozeCard=(verb,word,translation,prompt,answer,answerTranslation)=>({word,translation,category:`MODALVERB · ${verb.toUpperCase()} · LÜCKENTEXT`,prompt,example:prompt,exampleTranslation:`Доповни речення правильною формою ${verb}.`,answer,answerTranslation,practiceVariants:false});
const koennenFormCards=[
  {word:"ich kann",translation:"я можу / вмію",category:"MODALVERB · KÖNNEN",example:"Ich kann sehr gut malen.",exampleTranslation:"Я можу дуже добре малювати."},
  {word:"du kannst",translation:"ти можеш / вмієш",category:"MODALVERB · KÖNNEN",example:"Du kannst im Sommer schwimmen.",exampleTranslation:"Ти можеш плавати влітку."},
  {word:"er / sie / es kann",translation:"він / вона / воно може",category:"MODALVERB · KÖNNEN",example:"Sie kann gut Schach spielen.",exampleTranslation:"Вона може добре грати в шахи."},
  {word:"wir können",translation:"ми можемо / вміємо",category:"MODALVERB · KÖNNEN",example:"Wir können im Winter Ski fahren.",exampleTranslation:"Ми можемо кататися на лижах узимку."},
  {word:"ihr könnt",translation:"ви можете / вмієте",category:"MODALVERB · KÖNNEN",example:"Ihr könnt zusammen Rad fahren.",exampleTranslation:"Ви можете разом кататися на велосипеді."},
  {word:"sie / Sie können",translation:"вони можуть / Ви можете",category:"MODALVERB · KÖNNEN",example:"Sie können gut Gitarre spielen.",exampleTranslation:"Вони можуть добре грати на гітарі."}
];
const moegenFormCards=[
  {word:"ich mag",translation:"я люблю / мені подобається",category:"MODALVERB · MÖGEN",example:"Ich mag Kaffee.",exampleTranslation:"Я люблю каву."},
  {word:"du magst",translation:"ти любиш / тобі подобається",category:"MODALVERB · MÖGEN",example:"Du magst deutsche Musik.",exampleTranslation:"Тобі подобається німецька музика."},
  {word:"er / sie / es mag",translation:"він / вона / воно любить",category:"MODALVERB · MÖGEN",example:"Sie mag Schokolade.",exampleTranslation:"Вона любить шоколад."},
  {word:"wir mögen",translation:"ми любимо / нам подобається",category:"MODALVERB · MÖGEN",example:"Wir mögen Pizza.",exampleTranslation:"Ми любимо піцу."},
  {word:"ihr mögt",translation:"ви любите / вам подобається",category:"MODALVERB · MÖGEN",example:"Ihr mögt Bücher.",exampleTranslation:"Вам подобаються книжки."},
  {word:"sie / Sie mögen",translation:"вони люблять / Ви любите",category:"MODALVERB · MÖGEN",example:"Sie mögen den Film.",exampleTranslation:"Їм подобається фільм."}
];
const moechtenFormCards=[
  {word:"ich möchte",translation:"я хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Ich möchte einen Tee.",exampleTranslation:"Я хотів би / хотіла б чай."},
  {word:"du möchtest",translation:"ти хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Du möchtest nach Hause gehen.",exampleTranslation:"Ти хотів би / хотіла б піти додому."},
  {word:"er / sie / es möchte",translation:"він / вона / воно хотів би / хотіла б",category:"MODALVERB · MÖCHTEN",example:"Sie möchte Deutsch lernen.",exampleTranslation:"Вона хотіла б вивчати німецьку."},
  {word:"wir möchten",translation:"ми хотіли б",category:"MODALVERB · MÖCHTEN",example:"Wir möchten etwas essen.",exampleTranslation:"Ми хотіли б щось поїсти."},
  {word:"ihr möchtet",translation:"ви хотіли б",category:"MODALVERB · MÖCHTEN",example:"Ihr möchtet ins Kino gehen.",exampleTranslation:"Ви хотіли б піти в кіно."},
  {word:"sie / Sie möchten",translation:"вони хотіли б / Ви хотіли б",category:"MODALVERB · MÖCHTEN",example:"Sie möchten bezahlen.",exampleTranslation:"Вони хотіли б заплатити."}
];
const moegenMoechtenComparisonCards=[
  {word:"Ich mag Kaffee.",translation:"Мені подобається кава.",category:"MODALVERBEN · MÖGEN ODER MÖCHTEN",example:"mögen = мати вподобання",exampleTranslation:"Mögen описує те, що вам загалом подобається."},
  {word:"Ich möchte einen Kaffee.",translation:"Я хотів би / хотіла б каву.",category:"MODALVERBEN · MÖGEN ODER MÖCHTEN",example:"möchten = ввічливе бажання",exampleTranslation:"Möchten висловлює ввічливе бажання або замовлення."},
  {word:"mögen → möchten",translation:"möchten — форма Konjunktiv II від mögen",category:"MODALVERBEN · ЗВ'ЯЗОК",example:"Ich mag Kaffee. / Ich möchte einen Kaffee.",exampleTranslation:"Möchten походить від mögen, але в сучасній мові зазвичай означає «хотів би / хотіла б»."}
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
const bekommenFormCards=[
  {word:"ich bekomme",translation:"я отримую",category:"VERB · BEKOMMEN",example:"Ich bekomme eine E-Mail.",exampleTranslation:"Я отримую електронний лист."},
  {word:"du bekommst",translation:"ти отримуєш",category:"VERB · BEKOMMEN",example:"Du bekommst heute Besuch.",exampleTranslation:"Ти сьогодні приймаєш гостей."},
  {word:"er / sie / es bekommt",translation:"він / вона / воно отримує",category:"VERB · BEKOMMEN",example:"Sie bekommt ein Geschenk.",exampleTranslation:"Вона отримує подарунок."},
  {word:"wir bekommen",translation:"ми отримуємо",category:"VERB · BEKOMMEN",example:"Wir bekommen morgen Geld.",exampleTranslation:"Ми отримаємо гроші завтра."},
  {word:"ihr bekommt",translation:"ви отримуєте",category:"VERB · BEKOMMEN",example:"Ihr bekommt die Tickets.",exampleTranslation:"Ви отримуєте квитки."},
  {word:"sie / Sie bekommen",translation:"вони / Ви отримують / отримуєте",category:"VERB · BEKOMMEN",example:"Sie bekommen eine Antwort.",exampleTranslation:"Вони отримують відповідь."}
];
const bekommenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"BEKOMMEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова bekommen.",answer,answerTranslation,practiceType:"cloze"});
const bekommenPracticeCards=[
  bekommenClozeCard("Ich bekomme eine E-Mail.","Я отримую електронний лист.","Ich ___ eine E-Mail. (bekommen)","bekomme","отримую"),
  bekommenClozeCard("Du bekommst heute Besuch.","Ти сьогодні приймаєш гостей.","Du ___ heute Besuch. (bekommen)","bekommst","отримуєш"),
  bekommenClozeCard("Meine Schwester bekommt ein Geschenk.","Моя сестра отримує подарунок.","Meine Schwester ___ ein Geschenk. (bekommen)","bekommt","отримує"),
  bekommenClozeCard("Wir bekommen morgen Geld.","Ми отримаємо гроші завтра.","Wir ___ morgen Geld. (bekommen)","bekommen","отримуємо"),
  bekommenClozeCard("Ihr bekommt die Tickets.","Ви отримуєте квитки.","Ihr ___ die Tickets. (bekommen)","bekommt","отримуєте"),
  bekommenClozeCard("Sie bekommen eine Antwort.","Вони отримують відповідь.","Sie ___ eine Antwort. (bekommen)","bekommen","отримують")
];
const brauchenFormCards=[
  {word:"ich brauche",translation:"я потребую",category:"VERB · BRAUCHEN",example:"Ich brauche Hilfe.",exampleTranslation:"Мені потрібна допомога."},
  {word:"du brauchst",translation:"ти потребуєш",category:"VERB · BRAUCHEN",example:"Du brauchst eine Pause.",exampleTranslation:"Тобі потрібна перерва."},
  {word:"er / sie / es braucht",translation:"він / вона / воно потребує",category:"VERB · BRAUCHEN",example:"Er braucht eine neue Brille.",exampleTranslation:"Йому потрібні нові окуляри."},
  {word:"wir brauchen",translation:"ми потребуємо",category:"VERB · BRAUCHEN",example:"Wir brauchen mehr Zeit.",exampleTranslation:"Нам потрібно більше часу."},
  {word:"ihr braucht",translation:"ви потребуєте",category:"VERB · BRAUCHEN",example:"Ihr braucht eure Bücher.",exampleTranslation:"Вам потрібні ваші книжки."},
  {word:"sie / Sie brauchen",translation:"вони / Ви потребують / потребуєте",category:"VERB · BRAUCHEN",example:"Sie brauchen einen Termin.",exampleTranslation:"Їм потрібна зустріч."}
];
const brauchenClozeCard=(word,translation,prompt,answer,answerTranslation)=>({word,translation,category:"BRAUCHEN · LÜCKENTEXT",prompt,exampleTranslation:"Доповни речення правильною формою дієслова brauchen.",answer,answerTranslation,practiceType:"cloze"});
const brauchenPracticeCards=[
  brauchenClozeCard("Ich brauche Hilfe.","Мені потрібна допомога.","Ich ___ Hilfe. (brauchen)","brauche","потребую"),
  brauchenClozeCard("Du brauchst eine Pause.","Тобі потрібна перерва.","Du ___ eine Pause. (brauchen)","brauchst","потребуєш"),
  brauchenClozeCard("Er braucht eine neue Brille.","Йому потрібні нові окуляри.","Er ___ eine neue Brille. (brauchen)","braucht","потребує"),
  brauchenClozeCard("Wir brauchen mehr Zeit.","Нам потрібно більше часу.","Wir ___ mehr Zeit. (brauchen)","brauchen","потребуємо"),
  brauchenClozeCard("Ihr braucht eure Bücher.","Вам потрібні ваші книжки.","Ihr ___ eure Bücher. (brauchen)","braucht","потребуєте"),
  brauchenClozeCard("Sie brauchen einen Termin.","Їм потрібна зустріч.","Sie ___ einen Termin. (brauchen)","brauchen","потребують")
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
const spokenTimeCards=[
  {word:"fünf nach zehn",translation:"10:05",category:"UHRZEIT · GESPROCHEN",example:"Es ist fünf nach zehn.",exampleTranslation:"Зараз 10:05."},
  {word:"zehn vor sechs",translation:"5:50",category:"UHRZEIT · GESPROCHEN",example:"Es ist zehn vor sechs.",exampleTranslation:"Зараз 5:50."},
  {word:"Viertel nach drei",translation:"3:15",category:"UHRZEIT · GESPROCHEN",example:"Es ist Viertel nach drei.",exampleTranslation:"Зараз 3:15."},
  {word:"halb vier",translation:"3:30",category:"UHRZEIT · GESPROCHEN",example:"Es ist halb vier.",exampleTranslation:"Зараз 3:30 — половина до четвертої."},
  {word:"Viertel vor sieben",translation:"6:45",category:"UHRZEIT · GESPROCHEN",example:"Es ist Viertel vor sieben.",exampleTranslation:"Зараз 6:45."}
];
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
const spokenTimePracticeCard=(spokenTime,digitalTime)=>({word:spokenTime,translation:digitalTime,category:"UHRZEIT · GESPROCHEN",prompt:`Es ist ${digitalTime} Uhr.`,exampleTranslation:"Напиши час розмовною німецькою.",answer:spokenTime,answerTranslation:digitalTime,practiceType:"cloze"});
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
const wordOrderSentenceCard=(word,translation,prompt,category="WORTFOLGE · SATZBILDUNG")=>({word,translation,category,prompt,example:prompt,exampleTranslation:"Розстав слова в правильному порядку та напиши повне німецьке речення.",answer:word,answerTranslation:translation,practiceType:"sentence"});
const wordOrderStatementCards=[
  {word:"Der Mann ist da.",translation:"Чоловік тут.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + weitere Informationen",exampleTranslation:"У прямому розповідному реченні підмет стоїть першим, а відмінюване дієслово - другим."},
  {word:"Das Arbeitszimmer ist groß.",translation:"Кабінет великий.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + Ergänzung",exampleTranslation:"Навіть із прикметником відмінюване дієслово залишається на другому місці."},
  {word:"Ich fahre heute mit dem Bus nach Hause.",translation:"Я сьогодні їду автобусом додому.",category:"WORTFOLGE · AUSSAGESATZ",example:"Subjekt + Verb + Temporal + Modal + Lokal",exampleTranslation:"Після дієслова інформація часто йде в порядку час - спосіб - місце."}
];
const wordOrderTeKaMoLoCards=[
  {word:"Ich fahre heute wegen des Regens mit dem Bus zur Arbeit.",translation:"Я сьогодні їду автобусом на роботу через дощ.",category:"WORTFOLGE · TE-KA-MO-LO",example:"Subjekt + Verb + Temporal + Kausal + Modal + Lokal",exampleTranslation:"У середині речення обставини зазвичай стоять у порядку TE-KA-MO-LO: час - причина - спосіб - місце."},
  {word:"Wir lernen heute wegen der Prüfung zusammen in der Bibliothek.",translation:"Ми сьогодні вчимося разом у бібліотеці через іспит.",category:"WORTFOLGE · TE-KA-MO-LO",example:"Subjekt + Verb + Temporal + Kausal + Modal + Lokal",exampleTranslation:"TE = wann?, KA = warum?, MO = wie?, LO = wo?/wohin?."}
];
const wordOrderInversionCards=[
  {word:"Heute fahre ich mit dem Bus nach Hause.",translation:"Сьогодні я їду автобусом додому.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Modal + Lokal",exampleTranslation:"Якщо час стоїть першим, дієслово все одно посідає другу позицію, а підмет іде після нього."},
  {word:"Am Abend ist mein Bruder frei.",translation:"Увечері мій брат вільний.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Ergänzung",exampleTranslation:"Початкове слово або фраза змінює місце підмета, але не місце дієслова."},
  {word:"Jetzt haben wir ein neues Auto.",translation:"Тепер у нас є нова машина.",category:"WORTFOLGE · INVERSION",example:"Temporal + Verb + Subjekt + Objekt",exampleTranslation:"У стверджувальному реченні відмінюване дієслово завжди на другому місці."}
];
const wordOrderQuestionCards=[
  {word:"Fährst du heute mit dem Bus nach Hause?",translation:"Ти сьогодні їдеш автобусом додому?",category:"WORTFOLGE · JA/NEIN-FRAGE",example:"Verb + Subjekt + weitere Informationen",exampleTranslation:"У питанні без питального слова відмінюване дієслово стоїть на першому місці."},
  {word:"Warum fährst du heute mit dem Bus nach Hause?",translation:"Чому ти сьогодні їдеш автобусом додому?",category:"WORTFOLGE · W-FRAGE",example:"Fragewort + Verb + Subjekt + weitere Informationen",exampleTranslation:"У W-Frage питальне слово стоїть першим, а відмінюване дієслово - другим."},
  {word:"Wo ist dein Handy?",translation:"Де твій телефон?",category:"WORTFOLGE · W-FRAGE",example:"Fragewort + Verb + Subjekt",exampleTranslation:"Після питального слова одразу ставте відмінюване дієслово."}
];
const wordOrderModalCards=[
  {word:"Ich mag am Morgen Kaffee trinken.",translation:"Я люблю вранці пити каву.",category:"WORTFOLGE · MODALVERB",example:"Subjekt (P1) + Modalverb (P2) + Temporal + Objekt + Verb am Ende",exampleTranslation:"У розповідному реченні підмет стоїть першим, відмінюване модальне дієслово - другим, а інфінітив - у кінці."},
  {word:"Am Morgen mag ich Kaffee trinken.",translation:"Вранці я люблю пити каву.",category:"WORTFOLGE · MODALVERB",example:"Temporal + Modalverb (P2) + Subjekt (P3) + Objekt + Verb am Ende",exampleTranslation:"Якщо обставина часу стоїть першою, модальне дієслово все одно залишається на другому місці."},
  {word:"Magst du am Morgen Kaffee trinken?",translation:"Ти любиш вранці пити каву?",category:"WORTFOLGE · MODALVERB · JA/NEIN",example:"Modalverb (P1) + Subjekt (P2) + Temporal + Objekt + Verb am Ende",exampleTranslation:"У питанні без питального слова модальне дієслово відкриває речення, а інфінітив залишається в кінці."},
  {word:"Was magst du am Morgen trinken?",translation:"Що ти любиш пити вранці?",category:"WORTFOLGE · MODALVERB · W-FRAGE",example:"Fragewort + Modalverb (P2) + Subjekt (P3) + Temporal + Verb am Ende",exampleTranslation:"У W-Frage питальне слово стоїть першим, модальне дієслово - другим, а інфінітив - у кінці."}
];
const wordOrderStatementPracticeCards=[
  wordOrderSentenceCard("Der Mann ist da.","Чоловік тут.","da / der Mann / sein."),
  wordOrderSentenceCard("Das Arbeitszimmer ist groß.","Кабінет великий.","sein / groß / das Arbeitszimmer."),
  wordOrderSentenceCard("Ich fahre heute mit dem Bus nach Hause.","Я сьогодні їду автобусом додому.","heute / ich / mit dem Bus / nach Hause / fahren."),
  wordOrderSentenceCard("Meine Schwester ist schon Studentin.","Моя сестра вже студентка.","schon / meine Schwester / Studentin / sein.")
];
const wordOrderTeKaMoLoPracticeCards=[
  wordOrderSentenceCard("Ich fahre heute wegen des Regens mit dem Bus zur Arbeit.","Я сьогодні їду автобусом на роботу через дощ.","heute / zur Arbeit / ich / wegen des Regens / mit dem Bus / fahren.","WORTFOLGE · TE-KA-MO-LO"),
  wordOrderSentenceCard("Wir lernen heute wegen der Prüfung zusammen in der Bibliothek.","Ми сьогодні вчимося разом у бібліотеці через іспит.","in der Bibliothek / zusammen / heute / wir / wegen der Prüfung / lernen.","WORTFOLGE · TE-KA-MO-LO")
];
const wordOrderInversionPracticeCards=[
  wordOrderSentenceCard("Heute fahre ich mit dem Bus nach Hause.","Сьогодні я їду автобусом додому.","ich / heute / mit dem Bus / nach Hause / fahren."),
  wordOrderSentenceCard("Am Abend ist mein Bruder frei.","Увечері мій брат вільний.","frei / mein Bruder / sein / am Abend."),
  wordOrderSentenceCard("Morgen ist die Mutter zu Hause.","Завтра мама вдома.","die Mutter / morgen / zu Hause / sein."),
  wordOrderSentenceCard("Jetzt haben wir ein neues Auto.","Тепер у нас є нова машина.","ein neues Auto / jetzt / wir / haben.")
];
const wordOrderQuestionPracticeCards=[
  wordOrderSentenceCard("Fährst du heute mit dem Bus nach Hause?","Ти сьогодні їдеш автобусом додому?","du / heute / mit dem Bus / nach Hause / fahren?","WORTFOLGE · FRAGEBILDUNG"),
  wordOrderSentenceCard("Ist der Mann da?","Чоловік тут?","da / der Mann / sein?","WORTFOLGE · FRAGEBILDUNG"),
  wordOrderSentenceCard("Warum fährst du heute mit dem Bus nach Hause?","Чому ти сьогодні їдеш автобусом додому?","warum / du / heute / mit dem Bus / nach Hause / fahren?","WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wo ist dein Handy?","Де твій телефон?","dein Handy / wo / sein?","WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wann ist er zu Hause?","Коли він удома?","er / zu Hause / wann / sein?","WORTFOLGE · W-FRAGE"),
  wordOrderSentenceCard("Wie geht es dir?","Як у тебе справи?","es / dir / wie / gehen?","WORTFOLGE · W-FRAGE")
];
const wordOrderModalPracticeCards=[
  wordOrderSentenceCard("Ich mag am Morgen Kaffee trinken.","Я люблю вранці пити каву.","am Morgen / ich / Kaffee / trinken / mag.","WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Am Morgen mag ich Kaffee trinken.","Вранці я люблю пити каву.","Kaffee / am Morgen / trinken / ich / mag.","WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Magst du am Morgen Kaffee trinken?","Ти любиш вранці пити каву?","am Morgen / trinken / du / Kaffee / magst?","WORTFOLGE · MODALVERB · JA/NEIN"),
  wordOrderSentenceCard("Was magst du am Morgen trinken?","Що ти любиш пити вранці?","am Morgen / trinken / du / was / magst?","WORTFOLGE · MODALVERB · W-FRAGE"),
  wordOrderSentenceCard("Ich möchte am Abend einen Tee trinken.","Я хотів би / хотіла б увечері випити чаю.","am Abend / einen Tee / ich / trinken / möchte.","WORTFOLGE · MODALVERB"),
  wordOrderSentenceCard("Wann kannst du Deutsch lernen?","Коли ти можеш вивчати німецьку?","Deutsch / du / wann / lernen / kannst?","WORTFOLGE · MODALVERB · W-FRAGE")
];
const separableVerbCards=[
  {word:"aufstehen",translation:"вставати",category:"TRENNBARES VERB · AUF",example:"Ich stehe um sieben Uhr auf.",exampleTranslation:"Я встаю о сьомій годині."},
  {word:"anrufen",translation:"телефонувати",category:"TRENNBARES VERB · AN",example:"Ich rufe dich später an.",exampleTranslation:"Я подзвоню тобі пізніше."},
  {word:"einkaufen",translation:"робити покупки",category:"TRENNBARES VERB · EIN",example:"Wir kaufen heute im Supermarkt ein.",exampleTranslation:"Ми сьогодні робимо покупки в супермаркеті."},
  {word:"abfahren",translation:"відправлятися",category:"TRENNBARES VERB · AB",example:"Der Zug fährt um neun Uhr ab.",exampleTranslation:"Потяг відправляється о дев'ятій годині."},
  {word:"ankommen",translation:"прибувати",category:"TRENNBARES VERB · AN",example:"Der Bus kommt in fünf Minuten an.",exampleTranslation:"Автобус прибуде через п'ять хвилин."},
  {word:"abholen",translation:"забирати / зустрічати",category:"TRENNBARES VERB · AB",example:"Ich hole meine Freundin vom Bahnhof ab.",exampleTranslation:"Я зустрічаю подругу на вокзалі."},
  {word:"aussteigen",translation:"виходити (з транспорту)",category:"TRENNBARES VERB · AUS",example:"Wir steigen am Alexanderplatz aus.",exampleTranslation:"Ми виходимо на Александерплац."},
  {word:"umsteigen",translation:"пересідати",category:"TRENNBARES VERB · UM",example:"Sie steigen in München um.",exampleTranslation:"Вони пересаджуються в Мюнхені."},
  {word:"mitbringen",translation:"приносити із собою",category:"TRENNBARES VERB · MIT",example:"Ich bringe meine Tasche mit.",exampleTranslation:"Я беру із собою сумку."},
  {word:"fernsehen",translation:"дивитися телевізор",category:"TRENNBARES VERB · FERN",example:"Er sieht am Abend fern.",exampleTranslation:"Він дивиться телевізор увечері."}
];
const everydayVocabularyRoutineCards=[
  {word:"zuerst",translation:"спочатку",category:"ALLTAG · ABLAUF",example:"Zuerst lese ich den Text.",exampleTranslation:"Спочатку я читаю текст."},
  {word:"danach",translation:"після цього",category:"ALLTAG · ABLAUF",example:"Danach mache ich die Aufgabe.",exampleTranslation:"Після цього я роблю завдання."},
  {word:"anfangen",translation:"починати",category:"ALLTAG · VERB",example:"Der Kurs fängt um neun Uhr an.",exampleTranslation:"Курс починається о дев'ятій годині.",explanation:"Anfangen is separable: fängt comes second and an goes at the end of a main clause."},
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
const separableVerbPatternCards=[
  {word:"Hauptsatz: Ich stehe früh auf.",translation:"Головне речення: префікс іде в кінець.",category:"TRENNBARE VERBEN · HAUPTSATZ",example:"aufstehen → ich stehe auf",exampleTranslation:"У головному реченні відмінюється лише основа, а префікс стоїть наприкінці."},
  {word:"..., weil ich früh aufstehe.",translation:"Підрядне речення: дієслово не розділяється.",category:"TRENNBARE VERBEN · NEBENSATZ",example:"weil ich früh aufstehe",exampleTranslation:"У підрядному реченні відмінювана форма з префіксом стоїть разом у кінці."},
  {word:"Ich kann früh aufstehen.",translation:"З модальним дієсловом інфінітив не розділяється.",category:"TRENNBARE VERBEN · MODALVERB",example:"kann + aufstehen",exampleTranslation:"Відмінюване модальне дієслово стоїть на другому місці, а повний інфінітив — у кінці."},
  {word:"Ich verstehe die Aufgabe.",translation:"Невідокремлюване дієслово: префікс не відділяється.",category:"NICHT TRENNBAR · VER-",example:"verstehen → ich verstehe",exampleTranslation:"Префікси be-, emp-, ent-, er-, ge-, miss-, ver-, zer- зазвичай не відокремлюються."}
];
const separableVerbSentenceCard=(word,translation,prompt,category="TRENNBARE VERBEN · SATZBILDUNG")=>wordOrderSentenceCard(word,translation,prompt,category);
const separableVerbStatementPracticeCards=[
  separableVerbSentenceCard("Ich stehe um sieben Uhr auf.","Я встаю о сьомій годині.","ich / um sieben Uhr / aufstehen."),
  separableVerbSentenceCard("Ich rufe dich später an.","Я подзвоню тобі пізніше.","ich / dich / später / anrufen."),
  separableVerbSentenceCard("Wir kaufen heute im Supermarkt ein.","Ми сьогодні робимо покупки в супермаркеті.","wir / heute / im Supermarkt / einkaufen."),
  separableVerbSentenceCard("Der Zug fährt um neun Uhr ab.","Потяг відправляється о дев'ятій годині.","der Zug / um neun Uhr / abfahren."),
  separableVerbSentenceCard("Wir steigen am Alexanderplatz aus.","Ми виходимо на Александерплац.","wir / am Alexanderplatz / aussteigen."),
  separableVerbSentenceCard("Ich hole meine Freundin vom Bahnhof ab.","Я зустрічаю подругу на вокзалі.","ich / meine Freundin / vom Bahnhof / abholen."),
  separableVerbSentenceCard("Sie steigen in München um.","Вони пересаджуються в Мюнхені.","sie / in München / umsteigen."),
  separableVerbSentenceCard("Ich bringe meine Tasche mit.","Я беру із собою сумку.","ich / meine Tasche / mitbringen.")
];
const separableVerbContextPracticeCards=[
  separableVerbSentenceCard("Warum rufst du mich nicht an?","Чому ти мені не телефонуєш?","warum / du / mich / nicht / anrufen?","TRENNBARE VERBEN · W-FRAGE"),
  separableVerbSentenceCard("Er sieht am Abend fern.","Він дивиться телевізор увечері.","er / am Abend / fernsehen.","TRENNBARE VERBEN · HAUPTSATZ"),
  separableVerbSentenceCard("Der Bus kommt in fünf Minuten an.","Автобус прибуде через п'ять хвилин.","der Bus / in fünf Minuten / ankommen.","TRENNBARE VERBEN · HAUPTSATZ"),
  separableVerbSentenceCard("Wir können um acht Uhr aufstehen.","Ми можемо встати о восьмій годині.","wir / um acht Uhr / aufstehen / können.","TRENNBARE VERBEN · MODALVERB"),
  separableVerbSentenceCard("Ich kann meine Freundin vom Bahnhof abholen.","Я можу зустріти подругу на вокзалі.","ich / meine Freundin / vom Bahnhof / abholen / können.","TRENNBARE VERBEN · MODALVERB"),
  separableVerbSentenceCard("Ich bleibe zu Hause, weil ich früh aufstehe.","Я залишаюся вдома, бо рано встаю.","ich / zu Hause / bleiben / weil / ich / früh / aufstehen.","TRENNBARE VERBEN · NEBENSATZ")
];
const moegenPracticeCards=[
  modalVerbClozeCard("mögen","Ich mag Kaffee.","Я люблю каву.","Ich ___ Kaffee.","mag","люблю"),
  modalVerbClozeCard("mögen","Du magst deutsche Musik.","Тобі подобається німецька музика.","Du ___ deutsche Musik.","magst","любиш"),
  modalVerbClozeCard("mögen","Sie mag Schokolade.","Вона любить шоколад.","Sie ___ Schokolade.","mag","любить"),
  modalVerbClozeCard("mögen","Wir mögen Pizza.","Ми любимо піцу.","Wir ___ Pizza.","mögen","любимо"),
  modalVerbClozeCard("mögen","Ihr mögt Bücher.","Вам подобаються книжки.","Ihr ___ Bücher.","mögt","любите"),
  modalVerbClozeCard("mögen","Sie mögen den Film.","Їм подобається фільм.","Sie ___ den Film.","mögen","люблять")
];
const moechtenPracticeCards=[
  modalVerbClozeCard("möchten","Ich möchte einen Tee.","Я хотів би / хотіла б чай.","Ich ___ einen Tee.","möchte","хотів би / хотіла б"),
  modalVerbClozeCard("möchten","Du möchtest nach Hause gehen.","Ти хотів би / хотіла б піти додому.","Du ___ nach Hause gehen.","möchtest","хотів би / хотіла б"),
  modalVerbClozeCard("möchten","Sie möchte Deutsch lernen.","Вона хотіла б вивчати німецьку.","Sie ___ Deutsch lernen.","möchte","хотіла б"),
  modalVerbClozeCard("möchten","Wir möchten etwas essen.","Ми хотіли б щось поїсти.","Wir ___ etwas essen.","möchten","хотіли б"),
  modalVerbClozeCard("möchten","Ihr möchtet ins Kino gehen.","Ви хотіли б піти в кіно.","Ihr ___ ins Kino gehen.","möchtet","хотіли б"),
  modalVerbClozeCard("möchten","Sie möchten bezahlen.","Вони хотіли б заплатити.","Sie ___ bezahlen.","möchten","хотіли б")
];
const moegenMoechtenComparisonPracticeCards=[
  modalVerbClozeCard("mögen oder möchten","Ich mag Kaffee.","Мені подобається кава.","Ich ___ Kaffee.","mag","подобається"),
  modalVerbClozeCard("mögen oder möchten","Ich möchte einen Kaffee, bitte.","Я хотів би / хотіла б каву, будь ласка.","Ich ___ einen Kaffee, bitte.","möchte","хотів би / хотіла б"),
  modalVerbClozeCard("mögen oder möchten","Sie mag deutsche Musik.","Їй подобається німецька музика.","Sie ___ deutsche Musik.","mag","подобається"),
  modalVerbClozeCard("mögen oder möchten","Sie möchte bezahlen.","Вона хотіла б заплатити.","Sie ___ bezahlen.","möchte","хотіла б")
];
const koennenCards=[...koennenFormCards,...moegenFormCards,...moechtenFormCards,...moegenMoechtenComparisonCards,...koennenWordOrderCards,...koennenPracticeCards,...moegenPracticeCards,...moechtenPracticeCards,...moegenMoechtenComparisonPracticeCards];
const habenCards=[...habenFormCards,...habenPracticeCards,...bekommenFormCards,...bekommenPracticeCards,...brauchenFormCards,...brauchenPracticeCards];
const lessonStep=(id,title,objective,cards,mode="learn",chapter="",phase="",progressId=id)=>({id,title,objective,cards,mode,chapter:chapter||title,phase:phase||(mode==="input"?"Practice":"Learn"),progressId});
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
  lessonStep("w-questions-learn","Learn W-Fragen","Read every W-Frage and its example before testing your recall across the full set.",cards,"learn","W-Fragen","Learn","w-questions:learn"),
  lessonStep("w-questions-practice","Practice W-Fragen","Retrieve every W-Frage in one mixed series. Repeat the full set to strengthen recall across question types.",cards,"input","W-Fragen","Practice","w-questions:practice")
];
const pronounStages=[
  lessonStep("pronouns-learn","Learn personal pronouns","Read every singular, plural, and formal pronoun as a complete set before testing your recall.",pronounCards,"learn","Personal pronouns","Learn","pronouns:learn"),
  lessonStep("pronouns-practice","Practice personal pronouns","Retrieve every singular, plural, and formal pronoun in one mixed practice sequence.",pronounCards,"input","Personal pronouns","Practice","pronouns:practice")
];
const possessiveStages=[
  ...learnThenPractice("possessives-stems","ownership stems","Identify the owner before choosing mein, dein, sein, ihr, unser, euer, Ihr, or ihr.",possessivePronounCards.slice(0,8),"Stems"),
  ...learnThenPractice("possessives-endings","possessive endings","Notice how the ending changes with the noun in each example.",possessivePronounCards.slice(8),"Endings")
];
const seinStages=[
  lessonStep("sein-learn","Learn Verb sein","Read all six present-tense forms as complete pronoun-form pairs before testing your recall.",seinCards,"learn","Verb sein","Learn","sein:learn"),
  lessonStep("sein-practice","Practice Verb sein","Retrieve all six present-tense forms in one mixed series. Repeat the full set to strengthen recall.",seinCards,"input","Verb sein","Practice","sein:practice")
];
const conjugationStages=[
  ...learnThenPractice("conjugation-regular","regular endings","Follow the regular ending pattern from ich to sie/Sie.",conjugationCards.slice(0,6),"Regular endings"),
  ...learnThenPractice("conjugation-extra-e","the extra -e rule","Use the extra e after stems ending in -t or -d.",conjugationCards.slice(6,15),"Extra -e"),
  ...learnThenPractice("conjugation-sibilants","sibilant stems","Use -t rather than -st after stems ending in -s, -ß, or -z.",conjugationCards.slice(15),"Sibilants")
];
const strongVerbStages=[
  lessonStep("strong-verbs-learn","Learn strong verbs","Read the full paradigms for sprechen, fahren, treffen, lesen, essen, wissen, and anfangen. Notice the stem-vowel changes in singular forms.",strongVerbFormCards,"learn","Strong verbs","Learn"),
  lessonStep("strong-verbs-practice","Practice strong verbs","Enter the missing conjugated form in mixed sentences for all seven strong verbs. For anfangen, enter both the verb and its separated prefix.",strongVerbPracticeCards,"input","Strong verbs","Practice")
];
const pastVerbStagesForLevel=(level,slug,formCards,practiceCards,legacyIds=false)=>{
  const a1=level==="A1";
  return [
    {...lessonStep(legacyIds?"past-verbs-learn":`past-verbs-${slug}-learn`,`Learn Past verb forms · ${level}`,a1?"Learn everyday Perfekt. Keep Präteritum only for sein and haben.":`Read the infinitive, present form, Präteritum, and Perfekt form for each ${level} verb.`,formCards,"learn",`Past verb forms · ${level}`,"Learn"),requiresFullCoverage:true},
    {...lessonStep(legacyIds?"past-verbs-practice":`past-verbs-${slug}-practice`,`Practice Past verb forms · ${level}`,a1?"Enter the Perfekt form; enter Präteritum and Perfekt only for sein and haben.":"Enter the Präteritum and Perfekt forms for every verb, separated by a slash.",practiceCards,"input",`Past verb forms · ${level}`,"Practice"),requiresFullCoverage:true}
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
  ...splitIntoSteps("present-form","Practice verb forms","Enter only the missing conjugated form; the rest of the sentence provides context.",presentClozeCards,9,"input","Verb forms"),
  ...splitIntoSteps("present-translate","Practice forms from Ukrainian","Use the Ukrainian sentence as context, then enter only the German verb form or forms being tested.",presentTranslationCards,9,"input","Translation")
];
const koennenClozeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · LÜCKENTEXT");
const koennenFormPracticeCards=koennenClozeCards.slice(0,6);
const koennenContextCards=koennenClozeCards.slice(6);
const koennenWordOrderPracticeCards=koennenPracticeCards.filter(card=>card.category==="KÖNNEN · SATZBILDUNG");
const studyCardsFromPractice=cards=>cards.map(({answer,answerTranslation,practiceType,...card})=>card);
const koennenStages=[
  lessonStep("koennen-forms-learn","Learn können","Read the six forms of können as complete pronoun-form pairs.",koennenFormCards,"learn","Können forms","Learn"),
  lessonStep("koennen-forms-practice","Practice the six forms","Test each pronoun-form pairing once by entering only the missing form of können.",koennenFormPracticeCards,"input","Können forms","Practice"),
  lessonStep("moegen-forms-learn","Learn mögen","Read the six forms of mögen and use them to say what you like.",moegenFormCards,"learn","Mögen forms","Learn"),
  lessonStep("moegen-forms-practice","Practice the six forms","Test each pronoun-form pairing once by entering only the missing form of mögen.",moegenPracticeCards,"input","Mögen forms","Practice"),
  lessonStep("moechten-forms-learn","Learn möchten","Read the six forms of möchten and use them for polite wishes.",moechtenFormCards,"learn","Möchten forms","Learn"),
  lessonStep("moechten-forms-practice","Practice the six forms","Test each pronoun-form pairing once by entering only the missing form of möchten.",moechtenPracticeCards,"input","Möchten forms","Practice"),
  lessonStep("moegen-moechten-compare-learn","Compare mögen and möchten","See how mögen expresses a preference while möchten expresses a polite wish.",moegenMoechtenComparisonCards,"learn","Mögen & möchten","Learn"),
  lessonStep("moegen-moechten-compare-practice","Choose mögen or möchten","Complete each sentence with the correct form: mag for a preference or möchte for a polite wish.",moegenMoechtenComparisonPracticeCards,"input","Mögen & möchten","Practice"),
  lessonStep("koennen-order-learn","Learn modal verb word order","Compare statements and both question patterns before building full sentences.",koennenWordOrderCards,"learn","Word order","Learn"),
  lessonStep("koennen-order-practice","Practice modal verb sentences","Reorder the given German chunks into a complete sentence. Put können in position two and the infinitive at the end.",koennenWordOrderPracticeCards,"input","Word order","Practice"),
  lessonStep("koennen-context-learn","See können in context","Read complete statements, questions, and short dialogues before completing the modal verb yourself.",studyCardsFromPractice(koennenContextCards),"learn","Können in context","Learn"),
  lessonStep("koennen-context-practice","Practice können in context","Enter only the missing form of können in longer sentences and dialogues.",koennenContextCards,"input","Können in context","Practice")
];
const habenStages=[
  lessonStep("haben-learn","Learn haben","Read the six forms of haben and connect them to possession or having something.",habenFormCards,"learn","haben","Learn"),
  lessonStep("haben-practice","Practice haben","Enter only the missing conjugated form of haben in each sentence.",habenPracticeCards,"input","haben","Practice"),
  lessonStep("bekommen-learn","Learn bekommen","Read the six forms of bekommen and connect them to receiving something.",bekommenFormCards,"learn","bekommen","Learn"),
  lessonStep("bekommen-practice","Practice bekommen","Enter only the missing conjugated form of bekommen in each sentence.",bekommenPracticeCards,"input","bekommen","Practice"),
  lessonStep("brauchen-learn","Learn brauchen","Read the six forms of brauchen and connect them to needing something.",brauchenFormCards,"learn","brauchen","Learn"),
  lessonStep("brauchen-practice","Practice brauchen","Enter only the missing conjugated form of brauchen in each sentence.",brauchenPracticeCards,"input","brauchen","Practice")
];
const frequencyStages=[
  lessonStep("frequency-scale-learn","Learn the frequency scale","Work through immer to nie in descending frequency before practising every adverb in the same sequence.",frequencyCards,"learn","Frequency scale","Learn"),
  lessonStep("frequency-scale-recall","Practice the frequency scale","Write only the German frequency adverb for each Ukrainian meaning.",frequencyPracticeCards,"input","Frequency scale","Practice")
];
const timeExpressionStages=[
  lessonStep("time-expressions-learn","Learn time expressions","Connect um, am, im, in, and the Nacht forms with their time patterns before practising in context.",timeExpressionCards,"learn","Time expressions","Learn"),
  lessonStep("time-expressions-practice","Practice time expressions","Enter the missing time expression for a clock time, date, month, season, future interval, or night.",timeExpressionPracticeCards,"input","Time expressions","Practice"),
  lessonStep("spoken-time-learn","Learn spoken times","Read the everyday patterns with nach, vor, Viertel, and halb before practising each clock time.",spokenTimeCards,"learn","Spoken times","Learn"),
  lessonStep("spoken-time-practice","Practice spoken times","Write the everyday German expression for each digital clock time.",spokenTimePracticeCards,"input","Spoken times","Practice")
];
const timeWorksheetVocabularyStages=[
  ...learnThenPractice("time-worksheet-vocabulary","time worksheet vocabulary","Learn the new words from the time worksheet through their original seasonal and daily-routine contexts.",timeWorksheetVocabularyCards,"Time worksheet vocabulary")
];
const everydayVocabularyStages=[
  ...learnThenPractice("everyday-routine","everyday routine words","Learn sequence words and useful verbs for working with a text or task.",everydayVocabularyRoutineCards,"Everyday routine"),
  ...learnThenPractice("everyday-food","food and treats","Learn common food and drink words together with their articles.",everydayVocabularyFoodCards,"Food and treats")
];
const travelTransportStages=[
  ...learnThenPractice("travel-transport-words","transport words","Learn vehicles, station places, and luggage with their articles.",travelTransportCards,"Transport"),
  ...learnThenPractice("travel-route-phrases","route phrases","Use common expressions for destinations, locations, directions, and travel times.",travelPhraseCards,"Route phrases"),
  ...learnThenPractice("travel-actions","travel actions","Learn the verbs you need for boarding, changing, arriving, and getting around.",travelActionCards,"Travel actions")
];
const esGibtLeisureStages=[
  lessonStep("es-gibt-pattern-learn","Learn Es gibt","Use Es gibt to say that a place or thing exists. Notice the accusative article after it.",esGibtPatternCards,"learn","Es gibt","Learn"),
  lessonStep("es-gibt-pattern-practice","Practice Es gibt","Complete sentences with gibt or the correct accusative article after Es gibt.",esGibtPracticeCards,"input","Es gibt","Practice"),
  ...learnThenPractice("leisure-places","leisure places","Learn each leisure place with its article and plural form.",leisurePlaceCards,"Leisure places"),
  ...learnThenPractice("leisure-activities","leisure activities","Describe what people can do in town and use the new words in context.",leisureActivityCards,"Leisure activities"),
  ...learnThenPractice("photo-description","photo descriptions","Describe what and who you see in a photo.",photoDescriptionCards,"Photo descriptions")
];
const wordOrderStages=[
  lessonStep("word-order-statements-learn","Learn direct statements","See how the subject comes first and the conjugated verb stays in second position.",wordOrderStatementCards,"learn","Direct statements","Learn"),
  lessonStep("word-order-statements-practice","Practice direct statements","Reorder the German chunks into direct statements with the verb in second position.",wordOrderStatementPracticeCards,"input","Direct statements","Practice"),
  lessonStep("word-order-tekamolo-learn","Learn TE-KA-MO-LO","Use the default order for several adverbials in the middle field: time, reason, manner, then place.",wordOrderTeKaMoLoCards,"learn","TE-KA-MO-LO","Learn"),
  lessonStep("word-order-tekamolo-practice","Practice TE-KA-MO-LO","Reorder sentences with time, reason, manner, and place in the TE-KA-MO-LO sequence.",wordOrderTeKaMoLoPracticeCards,"input","TE-KA-MO-LO","Practice"),
  lessonStep("word-order-modal-learn","Learn modal verb word order","Use the four patterns from the worksheet: modal verb in position two, infinitive at the end, and the correct order for statements and questions.",wordOrderModalCards,"learn","Modal verbs","Learn"),
  lessonStep("word-order-modal-practice","Practice modal verb word order","Reorder modal-verb sentences. Keep the conjugated modal in its sentence position and put the infinitive at the end.",wordOrderModalPracticeCards,"input","Modal verbs","Practice"),
  lessonStep("word-order-inversion-learn","Learn inversion","Start with time or another phrase, then place the conjugated verb second and the subject after it.",wordOrderInversionCards,"learn","Inversion","Learn"),
  lessonStep("word-order-inversion-practice","Practice inversion","Reorder the German chunks into statements that begin with a time expression.",wordOrderInversionPracticeCards,"input","Inversion","Practice"),
  lessonStep("word-order-questions-learn","Learn question patterns","Compare yes/no questions with W-questions and find the position of the conjugated verb.",wordOrderQuestionCards,"learn","Questions","Learn"),
  lessonStep("word-order-questions-practice","Practice question patterns","Build yes/no and W-questions from the German chunks.",wordOrderQuestionPracticeCards,"input","Questions","Practice")
];
const separableVerbStages=[
  lessonStep("separable-verbs-learn","Learn separable verbs","Learn the common A1 separable verbs with a complete main-clause example.",separableVerbCards,"learn","Separable verbs","Learn"),
  lessonStep("separable-verbs-statements-practice","Practice main clauses","Build main-clause sentences: conjugate the stem in position two and move the prefix to the end.",separableVerbStatementPracticeCards,"input","Main clauses","Practice"),
  lessonStep("separable-verbs-patterns-learn","Learn when verbs stay together","Compare main clauses with subordinate clauses, modal-verb infinitives, and non-separable verbs.",separableVerbPatternCards,"learn","When to separate","Learn"),
  lessonStep("separable-verbs-context-practice","Practice mixed contexts","Build statements, a W-question, modal-verb sentences, and a subordinate clause with separable verbs.",separableVerbContextPracticeCards,"input","Mixed contexts","Practice")
];
const pastVerbGuide=level=>{
  const a1=level==="A1";
  return {
    title:a1?"Минулий час A1: Perfekt":"Минулий час "+level+": Präteritum і Perfekt",
    intro:a1?"На A1 основним минулим часом для розмови є Perfekt. Präteritum потрібен лише для високочастотних haben і sein.":`Вивчайте дієслова рівня ${level} як повний набір форм, щоб упізнавати минулий час у текстах і вживати Perfekt у розмові.`,
    rules:a1?[
      {title:"Perfekt — головна форма A1",detail:"Perfekt складається з haben або sein та Partizip II.",formula:"hat gefunden · ist gegangen"},
      {title:"Haben або sein",detail:"Дієслова руху та зміни стану часто утворюють Perfekt із sein; більшість інших дієслів — із haben.",formula:"ist gefahren · hat gearbeitet"},
      {title:"Präteritum: лише sein і haben",detail:"Ці дві дуже часті форми вивчайте для розуміння й коротких повідомлень.",formula:"sein → war · haben → hatte"}
    ]:[
      {title:"Präteritum",detail:"Ця проста форма минулого часу часто трапляється в письмових текстах і розповідях.",formula:"gehen → ging · finden → fand"},
      {title:"Perfekt",detail:"Perfekt складається з haben або sein та Partizip II.",formula:"hat gefunden · ist gegangen"},
      {title:"Haben або sein",detail:"Дієслова руху та зміни стану зазвичай утворюють Perfekt з sein; деякі дієслова допускають обидва допоміжні дієслова залежно від значення.",formula:"ist gefahren · hat das Auto gefahren"},
      {title:"Упізнавайте форми в парі",detail:"Під час практики вводьте спочатку Präteritum, а потім Perfekt через похилу риску.",formula:"begann / hat begonnen"}
    ]
  };
};
const deckDefinitions={
  "w-questions":{title:"W-Fragen",label:"W-Fragen",badge:"W",tip:"W-questions always come first in a question, followed by the verb.",guide:{title:"W-Fragen: запитання",intro:"Оберіть питальне слово відповідно до потрібної інформації, а потім побудуйте речення навколо відмінюваного дієслова.",rules:["Питальне слово стоїть на першому місці, а відмінюване дієслово — на другому: Wo wohnst du?","Підмет зазвичай стоїть після дієслова: Wann kommt ihr? Решта інформації йде далі.","Використовуйте wo для місця, wohin для руху до місця, а woher — для місця, звідки хтось прибуває.","На W-Fragen не можна відповісти лише ja або nein: вони потребують конкретної інформації."]},cards,stages:wQuestionStages},
  pronouns:{title:"Personal pronouns",label:"Personal pronouns",badge:"ich",tip:"Use the pronoun that matches the person or people you are talking about.",guide:{title:"Особові займенники",intro:"Німецькі особові займенники показують, хто говорить, до кого звертаються або про кого йдеться.",rules:["ich, du, er/sie/es, wir, ihr, sie відповідають особі або групі в реченні.","Пишіть Sie з великої літери для ввічливого «Ви» в однині або множині; sie означає «вона» або «вони».","Займенник визначає форму дієслова: ich bin, du bist, wir sind.","Оберіть ihr для неформального звертання до кількох людей."]},cards:pronounCards,stages:pronounStages},
  possessives:{title:"Possessive pronouns",label:"Possessive pronouns",badge:"mein",tip:"Possessive pronouns show who something belongs to. Their ending follows the noun.",guide:{title:"Присвійні займенники",intro:"Уживайте присвійний займенник перед іменником, щоб показати належність: mein означає «мій», dein — «твій» тощо.",rules:["Особа-власник визначає основу: mein, dein, sein, ihr, unser, euer, Ihr, ihr.","Закінчення змінюється відповідно до іменника: mein Bruder, meine Mutter, mein Kind, meine Freunde.","Пишіть Ihr з великої літери для ввічливого «Ваш»; ihr залежно від контексту означає «її» або «їхній».","Присвійний займенник стоїть перед іменником і зазвичай має ті самі закінчення, що й ein: ein Buch, mein Buch; eine Tasche, meine Tasche."]},cards:possessivePronounCards,stages:possessiveStages},
  sein:{title:"Verb sein",label:"Verb sein",badge:"sein",tip:"The verb sein is irregular, so learn each form as a complete pair with its pronoun.",guide:{title:"Sein у теперішньому часі",intro:"Sein означає «бути» й відмінюється неправильно, тому його форми потрібно вивчати окремо.",rules:["ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.","Уживайте sein для ідентифікації, опису, місцеперебування та багатьох простих представлень: Ich bin müde.","Форма має відповідати підмету: Anna ist hier, але Anna und Paul sind hier.","Пам’ятайте про велику літеру S у Sie sind під час ввічливого звертання."]},cards:seinCards,stages:seinStages},
  conjugation:{title:"Verb conjugation",label:"Verb conjugation",badge:"V",tip:"Weak verbs take regular endings: -e, -st, -t, -en, -t, -en. After a stem ending in -t or -d, add an extra e.",guide:{title:"Слабкі дієслова в Präsens",intro:"Візьміть основу дієслова й доберіть закінчення, що відповідає підмету.",rules:[{title:"Використовуйте регулярні закінчення",detail:"Більшість слабких дієслів відмінюються за однаковою схемою від ich до sie/Sie.",formula:"ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en"},{title:"Додавайте додаткове -e",detail:"Якщо основа закінчується на -t, -d або приголосний + -m/-n, додайте e перед закінченням.",formula:"du arbeitest · er arbeitet · ihr arbeitet"},{title:"Не додавайте зайве -s",detail:"В основах на -s, -ß або -z форма du має закінчення -t замість -st.",formula:"du heißt · du tanzt · du übersetzt"}]},cards:conjugationCards,stages:conjugationStages},
  "strong-verbs":{title:"Strong verbs",label:"Strong verbs",badge:"ä",tip:"Strong verbs can change their stem vowel in singular present-tense forms.",guide:{title:"Сильні дієслова в Präsens",intro:"Спочатку повторіть повну парадигму кожного дієслова, а потім утворюйте всі форми за картками з пропусками.",rules:[{title:"Зміна e на i",detail:"Sprechen, treffen, lesen і essen змінюють e на i у другій та третій особі однини.",formula:"du sprichst · er trifft · sie liest · du isst"},{title:"Зміна a на ä",detail:"Fahren і anfangen змінюють a на ä у другій та третій особі однини.",formula:"du fährst · er fährt · du fängst an"},{title:"Особлива форма wissen",detail:"Wissen має weiß у ich і er/sie/es, weißt у du та регулярну основу wiss- у множині.",formula:"ich weiß · du weißt · wir wissen"},{title:"Anfangen є відокремлюваним",detail:"Відмінювана частина fängt стоїть на другому місці, а префікс an — у кінці головного речення.",formula:"Der Kurs fängt um neun Uhr an."},{title:"Зберігайте основу в множині",detail:"Зміна голосного не відбувається з wir, ihr або sie/Sie.",formula:"wir sprechen · ihr esst · sie wissen · wir fangen an"}]},cards:strongVerbCards,stages:strongVerbStages},
  "past-verbs":{title:"Past verb forms · A1",label:"Past verb forms · A1",badge:"A1",tip:"Use Perfekt for everyday A1 past events; learn Präteritum only for sein and haben.",guide:pastVerbGuide("A1"),cards:pastVerbA1Cards,stages:pastVerbA1Stages},
  "past-verbs-a2":{title:"Past verb forms · A2",label:"Past verb forms · A2",badge:"A2",tip:"Use Präteritum for modal verbs and common biography facts; retain Perfekt for everyday past events.",guide:pastVerbGuide("A2"),cards:pastVerbA2.cards,stages:pastVerbA2Stages},
  "past-verbs-b1":{title:"Past verb forms · B1",label:"Past verb forms · B1",badge:"B1",tip:"Use the broader Präteritum vocabulary in written narratives and contrast it with Perfekt.",guide:pastVerbGuide("B1"),cards:pastVerbB1.cards,stages:pastVerbB1Stages},
  perfekt:{title:"Perfekt: haben und sein",label:"Perfekt",badge:"P2",tip:"Спочатку визначте: це дія, переміщення чи зміна стану? Потім виберіть haben або sein і поставте Partizip II в кінці.",guide:{title:"Perfekt: коли haben, а коли sein?",intro:"Perfekt утворюється з відмінюваного haben або sein та Partizip II. Починайте з простого алгоритму: haben — для більшості дій; sein — переважно для переміщення і зміни стану.",rules:[{title:"1. Побудуйте рамку речення",detail:"Допоміжне дієслово стоїть на другому місці, а Partizip II — у кінці.",formula:"Ich habe die Hausaufgaben gemacht."},{title:"2. Оберіть haben для більшості дій",detail:"Haben уживається з діяльністю, станами, зворотними та більшістю перехідних дієслів.",formula:"Ich habe gearbeitet. · Wir haben uns getroffen."},{title:"3. Оберіть sein для переміщення",detail:"Sein уживається, коли підмет сам переміщується або прибуває в інше місце.",formula:"Ich bin nach Hause gegangen. · Der Zug ist angekommen."},{title:"4. Оберіть sein для зміни стану",detail:"Sein уживається, коли хтось або щось переходить у новий стан.",formula:"Das Kind ist eingeschlafen. · Er ist krank geworden."},{title:"5. Запам’ятайте особливі дієслова",detail:"Sein також уживається з sein, werden, bleiben, passieren, geschehen, begegnen та gelingen.",formula:"Sie ist zu Hause geblieben. · Was ist passiert?"},{title:"6. Перевірте прямий додаток",detail:"Якщо дієслово має прямий додаток в Akkusativ, зазвичай потрібне haben.",formula:"Ich habe ein Buch gelesen. · Sie hat die Tür geöffnet."},{title:"7. Утворіть Partizip II",detail:"Для правильних дієслів зазвичай додаємо ge-…-t; дієслова на -ieren та з невідокремлюваним префіксом не отримують ge-.",formula:"machen → gemacht · studieren → studiert · erzählen → erzählt"},{title:"8. Не плутайте стан і зміну стану",detail:"Звичайний стан часто вживається з haben, а початок нового стану — із sein.",formula:"Ich habe geschlafen. · Ich bin eingeschlafen."}]},cards:perfektCards,stages:perfektStages},
  "present-practice":{title:"Present-tense practice",practiceTitle:"Present-tense practice",label:"Präsens practice",badge:"P",tip:"Use this focused review to retrieve conjugated forms in context. Revise each verb pattern in its dedicated lesson first.",guide:{title:"Відпрацювання форм Präsens",intro:"Це повторення вже вивчених моделей дієвідмінювання, а не вступ до нових правил. Використовуйте речення як контекст, але вводьте лише відмінювану форму або форми.",rules:["У частині з пропусками введіть форму, якої бракує в німецькому реченні; підказка в дужках показує інфінітив.","У частині з українськими підказками визначте особу й число, а потім введіть лише відповідну німецьку форму, не все речення.","Вправа повторює слабкі, сильні та неправильні форми, зокрема sein, gehen, fahren, sehen і möchten."]},cards:presentPracticeCards,stages:presentPracticeStages},
  koennen:{title:"Modal verbs",label:"Modal verbs",badge:"M",tip:"Use können for ability, mögen for likes, and möchten for polite wishes.",guide:{title:"Модальні дієслова: können, mögen і möchten",intro:"Ці дієслова допомагають говорити про вміння, уподобання та ввічливі бажання. Форма залежить від підмета.",rules:["Können означає «могти, вміти»: ich kann, du kannst, er/sie/es kann, wir können, ihr könnt, sie/Sie können.","Mögen означає «любити, подобатися»: ich mag, du magst, er/sie/es mag, wir mögen, ihr mögt, sie/Sie mögen.","Möchten — форма Konjunktiv II від mögen. У сучасній мові вона означає ввічливе «хотів би / хотіла б»: ich möchte, du möchtest, er/sie/es möchte, wir möchten, ihr möchtet, sie/Sie möchten.","Порівнюйте значення: Ich mag Kaffee. = «Мені подобається кава». Ich möchte einen Kaffee. = «Я хотів би / хотіла б каву».","З können і möchten друге дієслово стоїть в інфінітиві в кінці речення: Ich kann schwimmen. Wir möchten bezahlen."]},cards:koennenCards,stages:koennenStages},
  haben:{title:"Haben, bekommen & brauchen",label:"Haben, bekommen & brauchen",badge:"hab",tip:"Use haben for what you have, bekommen for what you receive, and brauchen for what you need.",guide:{title:"Haben, bekommen & brauchen",intro:"Ці три дієслова допомагають говорити про речі, людей, потреби та отримання в повсякденних ситуаціях A1.",rules:["haben означає «мати»: Ich habe einen Hund.","bekommen означає «отримувати»: Wir bekommen morgen Geld.","brauchen означає «потребувати»: Er braucht eine neue Brille.","Форми bekommen і brauchen відмінюються регулярно; haben має особливі форми du hast, er/sie/es hat та ihr habt."]},cards:habenCards,stages:habenStages},
  frequency:{title:"Frequency adverbs",label:"Frequency adverbs",badge:"oft",tip:"Frequency adverbs such as oft and nie normally stay in the middle of the sentence after the conjugated verb.",guide:{title:"Прислівники частоти",intro:"Прислівники частоти показують, як часто щось відбувається. Вони не змінюють форму й зазвичай стоять у середині речення.",rules:[{title:"Вивчайте шкалу частоти",detail:"Від найбільшої до найменшої частоти: immer, fast immer, meistens, oft, manchmal, selten, fast nie, nie.",formula:"immer → oft → manchmal → selten → nie"},{title:"Ставте прислівник після відмінюваного дієслова",detail:"У простому реченні прислівник частоти зазвичай стоїть після дієслова.",formula:"Ich lerne oft Deutsch."},{title:"Зберігайте дієслово на другому місці",detail:"Якщо речення починається з часу, підмет і прислівник ідуть після відмінюваного дієслова.",formula:"Am Sonntag lese ich manchmal ein Buch."},{title:"Використовуйте nie без nicht",detail:"Nie уже означає заперечення «ніколи», тому в таких реченнях nicht не потрібне.",formula:"Wir essen nie Fleisch."}]},cards:frequencyCards,stages:frequencyStages},
  "time-expressions":{title:"Time expressions",label:"Time expressions",badge:"Zeit",tip:"Use um for clock times, am for days and daytime periods, im for months and seasons, and nachts for habitual night actions.",guide:{title:"Час: um, am, im, in та Nacht",intro:"Ці короткі слова показують, коли щось відбувається. Обирайте форму за типом часу: година, день, місяць, проміжок часу або ніч.",rules:[{title:"Уживайте um з точною годиною",detail:"Um відповідає на запитання «о котрій годині?»",formula:"um acht Uhr"},{title:"Уживайте am з днями, датами й частинами дня",detail:"Am — це скорочення an dem. Воно вживається з днями тижня, датами та Morgen, Vormittag, Mittag, Nachmittag, Abend.",formula:"am Montag · am ersten Mai · am Abend"},{title:"Уживайте im з місяцями та порами року",detail:"Im — це скорочення in dem.",formula:"im Mai · im Sommer"},{title:"Уживайте in для майбутнього проміжку часу",detail:"In показує, через який час щось станеться.",formula:"in zwei Wochen · in einer Stunde"},{title:"Запам’ятайте особливі форми з Nacht",detail:"Не кажемо am Nacht. Nachts означає «уночі» загалом або регулярно; in der Nacht — під час конкретної ночі. З heute, gestern, letzte не потрібен прийменник.",formula:"nachts · in der Nacht · letzte Nacht"},{title:"Використовуйте nach і vor для розмовного часу",detail:"Nach означає хвилини після поточної години, vor — хвилини до наступної. Halb vier означає 3:30, тобто половина до четвертої.",formula:"fünf nach zehn · zehn vor sechs · halb vier"}]},cards:[...timeExpressionCards,...spokenTimeCards],stages:timeExpressionStages},
  "time-worksheet-vocabulary":{title:"Time worksheet vocabulary",label:"Time worksheet vocabulary",badge:"Zeit",tip:"Learn each new word with the seasonal or daily-routine context from the worksheet.",guide:{title:"Словник: час і пори року",intro:"У цьому уроці зібрано лише нові слова з аркуша про час. Вивчайте іменники разом з артиклем і формою множини, а дієслова — у короткому реченні.",rules:["Вивчайте іменники з артиклем: der Baum, die Kirche, das Restaurant.","Форма множини наведена там, де вона є в аркуші: die Bäume, die Blätter, die Pilze, die Vögel.","Дієслова fallen, blühen, verbringen і genießen найкраще запам'ятовувати разом із сезонним контекстом."]},cards:timeWorksheetVocabularyCards,stages:timeWorksheetVocabularyStages},
  "everyday-vocabulary":{title:"Everyday vocabulary",label:"Everyday vocabulary",badge:"Alltag",tip:"Learn sequence words in pairs and nouns with their articles.",guide:{title:"Повсякденна лексика",intro:"Цей урок поєднує слова для опису послідовності дій із базовою лексикою про їжу та напої.",rules:[{title:"Zuerst і danach",detail:"Ці прислівники допомагають показати порядок дій.",formula:"Zuerst lese ich. Danach mache ich die Aufgabe."},{title:"Anfangen — відокремлюване дієслово",detail:"У простому реченні an стоїть у кінці.",formula:"Der Kurs fängt um neun Uhr an."},{title:"Вивчайте іменники з артиклем",detail:"Артикль показує рід іменника. Süßigkeiten уживається у множині.",formula:"der Kräutertee · die Süßigkeiten · der Kaugummi · der Brei"}]},cards:[...everydayVocabularyRoutineCards,...everydayVocabularyFoodCards],stages:everydayVocabularyStages},
  "travel-transport":{title:"Travel & transport",label:"Travel & transport",badge:"Bahn",tip:"Learn travel nouns with their articles, then connect route phrases and separable verbs to complete situations.",guide:{title:"Подорожі та транспорт",intro:"Цей урок охоплює транспорт, місця на станції, багаж, корисні фрази для маршруту та дії в дорозі.",rules:[{title:"Вивчайте іменники з артиклем",detail:"Артикль показує рід іменника, тому запам'ятовуйте його разом зі словом.",formula:"der Bahnhof · die Haltestelle · das Gepäck"},{title:"Mit для транспорту",detail:"Щоб сказати, чим ви подорожуєте, використовуйте mit + Dativ.",formula:"mit dem Zug · mit der S-Bahn · mit dem Flugzeug"},{title:"Nach і zu для напрямку",detail:"Nach уживається з містами без артикля, а zu - з людьми та багатьма місцями.",formula:"nach Paris · zu meiner Freundin"},{title:"Відокремлювані дієслова",detail:"У простому реченні префікс іде в кінець.",formula:"Der Zug fährt ab. · Wir steigen ein."}]},cards:[...travelTransportCards,...travelPhraseCards,...travelActionCards],stages:travelTransportStages},
  "es-gibt-leisure":{title:"Es gibt & leisure places",label:"Es gibt & leisure places",badge:"gibt",tip:"Use Es gibt to say that something exists; the noun after it is in the accusative.",guide:{title:"Es gibt і місця для дозвілля",intro:"За допомогою Es gibt можна сказати, що в місті або в певному місці щось є. Далі вивчайте назви місць разом з артиклем і вислови про дозвілля.",rules:[{title:"Es gibt означає «є»",detail:"Цей вираз уживається як в однині, так і в множині. Es не перекладається окремо.",formula:"Es gibt ein Kino. · Es gibt viele Cafés."},{title:"Після Es gibt - Akkusativ",detail:"Неозначений артикль чоловічого роду змінюється з ein на einen; жіночий і середній рід залишаються без змін.",formula:"einen Park · eine Ausstellung · ein Café"},{title:"Вивчайте місця з артиклем",detail:"Запам'ятовуйте рід і форму множини разом зі словом.",formula:"das Museum - die Museen · die Bar - die Bars"},{title:"Man для загальних дій",detail:"Man означає «людина / люди» в загальному значенні та має форму дієслова третьої особи однини.",formula:"Im Café kann man Kaffee trinken. · In der Disco tanzt man."},{title:"Denn пояснює причину",detail:"Denn означає «тому що». Після нього порядок слів у простому реченні не змінюється.",formula:"Ich gehe ins Kino, denn der Film ist interessant."}]},cards:[...esGibtPatternCards,...leisurePlaceCards,...leisureActivityCards],stages:esGibtLeisureStages},
  "word-order":{title:"Word order",label:"Word order",badge:"S",tip:"Use TE-KA-MO-LO for several adverbials: time, reason, manner, then place.",guide:{title:"Порядок слів у реченні",intro:"Німецький порядок слів суворіший, ніж український. Спочатку визначте тип речення, а потім знайдіть місце для відмінюваного дієслова й інфінітива.",rules:[{title:"TE-KA-MO-LO",detail:"Коли в середині речення є кілька обставин, їхній звичний порядок: TE (wann?) - KA (warum?) - MO (wie?) - LO (wo?/wohin?).",formula:"Ich fahre heute wegen des Regens mit dem Bus zur Arbeit."},{title:"Пряме речення з модальним дієсловом",detail:"Підмет стоїть першим, модальне дієслово - другим, а друге дієслово в інфінітиві - в кінці.",formula:"Ich mag am Morgen Kaffee trinken."},{title:"Інверсія з модальним дієсловом",detail:"Час або інша фраза може стояти першою, але модальне дієслово залишається на другому місці.",formula:"Am Morgen mag ich Kaffee trinken."},{title:"Питання ja/nein",detail:"Без питального слова модальне дієслово стоїть першим, підмет - другим, а інфінітив - у кінці.",formula:"Magst du am Morgen Kaffee trinken?"},{title:"W-Frage з модальним дієсловом",detail:"Питальне слово стоїть першим, модальне дієслово - другим, підмет - після нього, а інфінітив - у кінці.",formula:"Was magst du am Morgen trinken?"},{title:"Інші розповідні речення",detail:"Без модального дієслова відмінюване дієслово все одно стоїть на другому місці: підмет або обставина часу можуть бути першими.",formula:"Heute fahre ich mit dem Bus nach Hause."}]},cards:[...wordOrderStatementCards,...wordOrderTeKaMoLoCards,...wordOrderModalCards,...wordOrderInversionCards,...wordOrderQuestionCards],stages:wordOrderStages},
  "separable-verbs":{title:"Separable verbs",label:"Separable verbs",badge:"auf",tip:"In a main clause, conjugate the verb stem and put the separable prefix at the end.",guide:{title:"Відокремлювані дієслова",intro:"Багато німецьких дієслів мають префікс, який у головному реченні відокремлюється та переходить у кінець. Вивчайте дієслово як одну одиницю: aufstehen, anrufen, einkaufen.",rules:[{title:"У головному реченні префікс відокремлюється",detail:"Відмінюється основа, а префікс стоїть у кінці речення.",formula:"Ich stehe früh auf. · Der Zug fährt ab."},{title:"У питанні префікс теж у кінці",detail:"Відмінювана основа стоїть після W-слова або на початку питання ja/nein.",formula:"Warum rufst du mich an?"},{title:"У підрядному реченні дієслово не розділяється",detail:"Після weil, dass та інших сполучників повна відмінювана форма стоїть наприкінці.",formula:"..., weil ich früh aufstehe."},{title:"З модальним дієсловом інфінітив не розділяється",detail:"Модальне дієслово відмінюється, а повний інфінітив стоїть наприкінці.",formula:"Wir können früh aufstehen."},{title:"Не всі префіксальні дієслова відокремлюються",detail:"be-, emp-, ent-, er-, ge-, miss-, ver-, zer- зазвичай невідокремлювані.",formula:"Ich verstehe die Aufgabe. · Wir besuchen Freunde."}]},cards:[...separableVerbCards,...separableVerbPatternCards],stages:separableVerbStages}
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
  $("streak").textContent=streak;$("overview-streak").textContent=streak;$("accuracy-rate").textContent=`${activity.attempts?Math.round(activity.correct/activity.attempts*100):0}%`;$("weekly-reviewed").innerHTML=`${weeklyTotal} <small>this week</small>`;
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
  $("w-badge").textContent=activeDeck.badge;
  $("study-tip").textContent=activeDeck.tip;
  $("example").textContent=answerSentence;
  $("example-translation").textContent=answerTranslation;
  const dynamicPractice=activeStage().mode==="input";
  $("practice-portion").hidden=!dynamicPractice;
  if(dynamicPractice){
    const key=practicePortionKey(activeDeckId,activeStage()),portion=(Number(dailyPractice.portions[key])||0)+1,poolSize=practicePool(activeStage().cards).length;
    $("practice-portion-note").textContent=`Today's ${deck.length}-card set · ${poolSize} examples available${portion>1?` · portion ${portion}`:""}`;
  }
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
