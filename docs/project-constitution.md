# Project Constitution

The Project Constitution, or simply **The Constitution**, is the product contract for
all lesson content, interactions, screens, and progress data. Optimize for durable
recall per minute, not time spent or cards seen.

## 1. Learning model

The content hierarchy is **course > lesson > chapter > sequence > card**.

- A lesson covers one coherent skill and belongs to one primary class:
  **vocabulary recall**, **morphology**, **grammar choice**, or **sentence
  structure**.
- A chapter isolates one teachable pattern. If card order is required to explain a
  progression, use separate prerequisite chapters rather than relying on array order.
- A sequence is one coherent curriculum step in either `learn` or `practice` mode. A
  sequence may require multiple bounded passes when its target pool is larger than one
  pass. Keep each pass at 5-9 targets; split a chapter when its pool stops representing
  one teachable pattern, not merely to satisfy an arbitrary total.
- A card is one presentation or practice variant for one target. A fixed expression
  may be one target, but unrelated answers must not be combined into one response.
- Every chapter should move from a concise rule and examples to active recall as soon
  as possible. Prefer production over recognition and examples over long exposition.

## 2. Standard card and practice contract

Practice uses one consistent interaction: **prompt > one text field > Check/Enter >
immediate feedback > Enter/Next**. Do not introduce multiple-choice or a different
input control when typed recall can assess the skill.

```js
{
  id: "stable-variant-id",
  targetId: "stable-learning-target-id",
  type: "recall" | "cloze" | "sentence-build",
  prompt: "...",
  support: "...",                // optional context, never the answer
  response: {
    mode: "text",
    scope: "word" | "phrase" | "sentence",
    accepted: ["canonical answer", "explicit alternative"],
    caseSensitive: false,
    punctuationSensitive: false
  },
  explanation: "...",
  translation: "...",

  // Optional visual metadata (see "Visual language"); always authored explicitly.
  scene: { kind: "table", motion: false },        // picture from the shared scene library
  cue: "Wo?",                                      // short question badge
  practiceSupport: { label: "...", text: "..." },  // labelled practice context, never the answer
  noun: { article: "der", word: "Bruder", gender: "masculine", exampleWord: "Bruder" },
  // Optional noun fields: plural: { article: "die", word: "Brüder", exampleWord: "Brüdern" }
  // adds a plural entry; givenInPractice: true marks a noun the practice prompt already
  // gives (for example the place in a preposition gap); exampleWord: "" omits the focus.
  answerParts: { stem: "mein", ending: "en" },     // joins to the canonical answer
  // A stem-vowel change adds vowel: { start, end } (stem indices), e.g.
  // { stem: "fähr", ending: "st", vowel: { start: 1, end: 2 } } for "fährst".
  paradigm: {                                      // full paradigm; the card shows the active row
    title: "...",
    columns: [{ label: "der", gender: "masculine" }],
    rows: [{ label: "Akk.", title: "Akkusativ", cells: [{ stem: "mein", ending: "en" }] }],
    active: { row: 0, column: 0 }                  // cell that equals the answer
    // forms: true shows whole forms per person (ich ... sie/Sie) instead of endings.
  },
  auxiliary: { verb: "sein", form: "ist" },        // Perfekt: haben or sein and its form
  structure: [                                     // word order: one list of fields per clause
    [{ role: "first", text: "Ich" }, { role: "verb", text: "stehe" },
     { role: "middle", text: "um sieben Uhr" }, { role: "end", text: "auf" }]
    // A subordinate clause uses link / middle / end: weil · ich früh · aufstehe.
    // A yes/no question starts with the verb: Kannst · du mir bitte · helfen.
  ],
  frequency: {                                     // frequency adverbs: the whole scale and this card's step
    scale: [{ word: "nie", percent: 0 }, /* … */ { word: "immer", percent: 100 }],
    active: 4                                      // index of the card's own adverb
  },
  clock: { hour: 3, minute: 15 },                  // spoken time: the time on the analog clock
  picture: "bus"                                   // concrete word: assets/icons/bus.svg above the word
}
```

`gender` is one of `masculine`, `neuter`, `feminine`, or `plural`.

- `recall`: meaning or communicative cue -> German word or phrase.
- `cloze`: contextual sentence with one assessable gap -> missing form. When the
  German sentence alone admits several valid forms (for example any possessive in
  `___ Auto ist neu.`), show its meaning as a cue so exactly one answer is correct.
- Recall cues must determine one answer. Do not rely on Ukrainian gender to select a
  German ending; cue endings with a sentence that fixes the German noun.
- When a variant shows an example sentence, accept only the alternatives that
  sentence uses (`Її сумка тут.` accepts `ihre`, not `ihr`).
- `sentence-build`: shuffled German chunks or a translation cue -> complete sentence.
- Multiple cards may share a `targetId`, but every variant has its own stable `id`.
  Completion and mastery are measured by target; variety and repeat avoidance are
  measured by variant.
- Store alternatives explicitly in `accepted`; `/` in display text is not an answer
  schema. Never infer exercise type or valid answers from labels, punctuation, or the
  presence of optional fields.
- Normalize Unicode, surrounding/repeated whitespace, and irrelevant terminal
  punctuation. Where a separator is part of an accepted answer, normalize equivalent
  separator characters and optional surrounding whitespace. Normalize equivalent
  typographic apostrophes and hyphens. Ignore case only when capitalization is not
  the learning objective. Preserve strict required words, grammatical forms, and word
  order; never infer or autocorrect missing, extra, or misspelled content.
- A wrong answer shows a compact token-level correction and explanation. It does not
  expose the answer before an attempt and does not count as correct after reveal.
- When practice asks the learner to choose a grammatical case or pattern, card labels
  and prompts must not name the correct choice before checking. Use contextual gaps
  with the person or owner cue needed for one answer; reveal the specific case in
  feedback. Focused single-case drills may name the case being practiced.
- Correct feedback states only the result and the answer; do not add generic praise.
  Wrong-answer explanations name the rule that decides this answer (case, ending, stem
  change, auxiliary, word position), not just its meaning. Plain vocabulary recall may
  fall back to a meaning association.
- In learn cards and practice feedback, show an identical Ukrainian meaning and example
  translation only once, beneath the German example or completed sentence. Keep a
  separate target meaning only when it adds distinct information.
- Track first-attempt correctness separately from eventual completion. This keeps
  accuracy meaningful while allowing learners to recover from mistakes.

## 3. Sequence workflow

### Learn

1. Show the chapter objective and optional collapsed rule guide.
2. Shuffle cards when the sequence starts. Keep the order stable while navigating.
3. Present the target, translation, one natural example, and any authored visuals
   without requiring input.
4. Persist the current position so an interrupted sequence can resume.
5. After the last card, show the completion splash with **Practice now** as the
   primary action.

### Practice

1. Shuffle cards independently from learning and from the previous attempt.
2. Require an answer before Check; disable accidental navigation past an unanswered
   card.
3. Give immediate, specific feedback. Correct answers advance; missed cards return
   after at least two other cards when possible.
4. Complete a pass when every sampled target has been answered correctly, including
   repairs. Complete the sequence when every required target has been mastered across
   its bounded passes. Report first-attempt accuracy separately from cumulative target
   mastery.
5. Use the completion splash to offer the most useful next action: retry misses,
   continue to the next chapter, or return to the library.

### Variety and pass sampling

- Each target must have a reusable pool of natural examples and practice variants.
  Provide at least three variants when the skill permits; closed sets or inherently
  fixed forms may use fewer.
- Variation must be pedagogically meaningful: vary context, person/number, statement
  or question form, polarity, register, or cue direction without introducing
  unnecessary vocabulary.
- Every learn and practice pass selects at most one variant per sampled target,
  producing a random subset of the sequence's larger item pool. A normal pass contains
  5-9 cards; seven is the default. Small closed or indivisible pattern sets may use
  every target even when they contain fewer than five.
- Select weak, due, and not-yet-seen targets first, then fill the pass randomly from
  equally eligible targets. Randomness must never prevent eventual coverage.
- Use a shuffle-bag policy for variants: do not repeat a target's variant until its
  other eligible variants have appeared, unless needed for immediate error repair.
  When the pool permits, most cards and the first card must differ from the previous
  pass.
- Learn and practice sample and shuffle independently. They should reinforce the same
  targets without presenting an identical list in an identical order.

For both modes, use an unbiased Fisher-Yates shuffle, persist the sampled card IDs and
order for resume, and do not resample or reshuffle mid-pass. Generated variants must
be deduplicated by stable variant ID. Target mastery may accumulate across completed
passes, but a pass never completes with an unrepaired miss. Sequence mastery requires
every required target, not every possible variant, to have been answered correctly;
future passes provide contextual variety and retention checks.

## 4. Completion and progression

- Every completed learn or practice sequence opens a focused completion splash. It
  must not auto-dismiss; the learner chooses the next action.
- The splash states what was completed, progress within the lesson, and the next best
  action. Practice also shows first-pass accuracy and missed-target count.
- Use celebration effects only for a newly completed sequence or mastery milestone,
  never for routine navigation. Respect reduced-motion preferences.
- A chapter is learned after every required target has appeared in its learn sequence
  and mastered after every required target has been answered correctly in its practice
  sequence. Coverage accumulates across bounded passes; re-practice updates retention
  but does not erase completion. A finished sequence stays complete; targets added to it
  later show as new work until practised and do not reopen it.
- Lesson coverage counts each practice target once, in the first practice sequence
  that contains it. A target is covered after that sequence has mastered it. Later
  sequences that repeat the target, such as a mixed review, are review only and do not
  change coverage. Coverage is shown as covered targets of the total with a rounded-down
  percent, and reaches 100% only when every target is covered. Lesson mastery still
  requires every practice sequence to be complete.
- Keep chapters freely accessible. Recommend the pedagogical next step instead of
  hard-locking content; this supports review and experienced learners.
- Repeated mistakes stay in the current retry queue. Do not force a full restart or
  reward repeated guessing as first-attempt accuracy.

## 5. Screen responsibilities

### Interface language

- Use Ukrainian for navigation, lesson names, outcomes, chapter and phase labels,
  instructions, feedback, completion, progress, and accessible control names.
  Keep German examples, exercise text, answers, and useful grammar terms in German.
- Every lesson name carries its German title as a smaller secondary line (marked
  `lang="de"`) wherever the lesson name is the heading: library, lesson header, and
  progress list.
- Use consistent terms: lesson = «урок», chapter = «розділ», sequence = «етап»,
  pass = «підхід», learn = «вивчення», practice = «практика».
- Inflect Ukrainian count labels correctly. Localization must not change lesson,
  sequence, target, or variant IDs, accepted answers, sampling, or saved progress.
- Every font must contain the letters it sets. The brand faces (Space Grotesk,
  DM Sans) have no Cyrillic, so Ukrainian text uses the system UI font; Space Grotesk
  is kept for numbers and Latin-only text.

### Library

- Derive lesson counts and status from lesson definitions and persisted state; never
  hardcode them in markup.
- Show title, concise outcome, level, chapter/sequence count, and status:
  **Not started**, **Learning**, **Ready to practice**, **Mastered**, or **Due**.
- Show each lesson's practice coverage as a percent on its card and as covered targets
  of the total in the lesson plan.
- Group lessons by lesson class (`className`) in course-path order: **Лексика**
  (words and meaning) → **Морфологія** (word forms) → **Граматика** (choosing a form
  by rule) → **Синтаксис** (word order). Each group heading names the class, gives a
  one-line summary and counts its lessons; within a group, lessons keep the course
  order. Every lesson belongs to exactly one class.
- A class is marked by a glyph shape in the accent colour, never by a colour of its
  own, because colour is reserved for gender. Each glyph is a miniature of the visual
  that class uses in its lessons. Glyphs are hidden from screen readers; the group
  heading names the class.
- The primary action resumes an in-progress sequence or starts the recommended next
  sequence. Preserve a direct way to open any chapter.

### Lesson

- Keep lesson, chapter, phase, objective, card position, and completion visible.
- Use the Focus room layout: one large centered card, a compact lesson header, and
  a direct return to the library. Hide global navigation and activity metrics while
  studying.
- The lesson header shows compact, non-interactive chapter and phase context.
  Keep the lesson plan permanently visible below the card workspace, without a
  collapse control or duplicate header switches. Its chapter rows and step switches
  (Вивчення / Практика / Частина N) let the learner open any step freely. Expose current,
  completed, and saved-attempt states visually and in accessible labels, numbering
  steps within their chapter. Keep chapter-local step position separate from
  lesson-wide completion; the completion link scrolls to the plan without hiding it.
  Keep the new-pass control in the plan.
- Leaving a step never discards its unfinished attempt: it is suspended and resumes
  exactly where it stopped when the learner returns. Switching needs no confirmation.
- Use one card workspace for all exercise types and one predictable keyboard flow.
- Preserve position when switching screens. Explicitly starting a new attempt is the
  only action that resets order and response state.
- Guides are optional, concise, collapsed by default, and available without leaving
  the card. They must not obscure the prompt or contain the answer during practice.
  A rule may add a compact formula or a `table` (`columns`, `rows` with `cells`, and
  optional `highlights` and `note`). Tables show endings, stem vowels, or short forms
  on neutral cells under gender-coloured or person column headers (or rows with an
  optional `gender` dot, for example `er`/`sie`/`es`, or an optional `title` naming
  the row's verbs), highlight only the cells listed in `highlights`, and
  use the one-line `note` to say in words what changes. A table whose cells, cells
  read with their row or column header, or note contain an accepted answer is hidden
  in practice until Check, like any other leaking guide text. Tables whose cells are
  the lesson's answers (for example a pronoun or conjugation paradigm) therefore
  appear on learn cards and after Check only.
- A guide rule may carry one illustration (`visual`) that shows the rule's own
  example with an approved card component: position boxes (`structure`), the
  haben/sein panel (`auxiliary`, marking the rule's verb or neither), the whole
  frequency bar (`frequency`), clocks (`clocks`), local-preposition scenes (`scenes`)
  or vocabulary pictures with gender dots (`pictures`). Every word it shows also
  appears in that rule's title, detail or formula. A rule without a title
  (`{detail, visual}`) reads like a plain rule. An illustration is all or nothing:
  if any of its words, or a clause read whole, would reveal an accepted answer, the
  whole figure is hidden until Check and the answer note shows. Illustrate only where
  the picture adds to the rule; never repeat the same panel down a guide.
- Every table, strip, or paradigm that lists grammatical cases (guide tables and
  card paradigms, as rows or columns) uses one fixed order: Nominativ, Akkusativ,
  Dativ. A table may leave a case out, but never reorders the rest; rows labelled by
  a question (`Wohin?` for Akkusativ, `Wo?` for Dativ) follow the case they stand for.
  Notes and details that walk through the table name the cases in the same order.

### Visual language

- Visuals serve recall, not decoration: each one encodes a meaning or a grammatical
  decision (gender, case, position, motion) that the learner has to make.
- This section states the design rules every visual follows. The options that were
  considered, their screenshots, the reasons for each choice, and the process for
  changing a choice are recorded in
  [Visual design decisions](visual-design-decisions.md). Change a component's design
  there and here in the same change.
- Gender colours follow the Menschen convention in every lesson: **der** blue,
  **das** green, **die** red, **Plural** yellow. Colour is never the only signal:
  every coloured element also shows its article, column label, or Ukrainian gender
  name, and coloured text keeps at least 4.5:1 contrast.
- Each colour has one meaning across the app. Use the tokens in `lesson-journey.css`;
  each gender colour also has a light tint (`-bg`) for filled tiles:

  | Colour | Token | Meaning |
  |---|---|---|
  | Blue `#2459b8` | `--g-m` | der (masculine) |
  | Green `#167a4c` | `--g-n` | das (neuter) |
  | Red `#b73232` | `--g-f` | die (feminine) |
  | Dark yellow `#8a6200` | `--g-pl` | Plural |
  | Purple `#6554d9` | `--lesson-accent` | The app accent, and everything without a gender: verb endings, person and pronoun strips, verb boxes, haben, class glyphs |
  | Orange `#a34d00` | `--aux-sein` | sein in the haben/sein panel |
  | Amber background `#fff2c2` | `--vowel-bg` | A changed stem vowel |

  Do not add a hue for a new meaning (per lesson, per class, per case); use shape,
  position, or a label instead.
- The active item of a set (a strip tile, a haben/sein row, a frequency step) is
  outlined and tinted and marked with `aria-current`. The other items are never
  faded: they stay on white with a light border, so their text keeps 4.5:1 contrast.
- Decorative parts (gender dots, glyphs, the frequency track) are hidden from screen
  readers. A visual whose meaning is not in the nearby text has an accessible name;
  the clock, for example, names the digital time.
- Visuals are static. Other motion (screen transitions, the completion celebration)
  stops when the system asks for reduced motion.
- A visual must not give the answer away just by appearing. In a mixed drill, a
  visual that only one kind of answer would get (a clock only on the `um` cards of an
  um / am / im drill) is left out.
- Visual metadata (`scene`, `cue`, `cueAfterCheck`, `practiceSupport`, `noun`, `answerParts`,
  `paradigm`, `auxiliary`, `structure`, `frequency`, `clock`, `picture`, guide `table`
  and guide `visual`) is
  authored explicitly in lesson data. Never derive it
  from IDs, labels, translations, or lesson names. A lesson builder may read it from
  the card's own authored German forms (the compact verb notation `f[ä]hr|st`, a
  Perfekt form `ist geblieben`) or from an explicit field such as a pronoun card's
  `person`. A card without metadata renders without visuals.
- One shared renderer draws every visual for every lesson; do not add lesson-specific
  visual branches. Add new picture kinds to the shared scene library.
- **Meaning visuals** may appear before Check because they show what the prompt
  means, not which form answers it: scene pictures, the Wo?/Wohin? cue, and the noun
  gender line (a gender-coloured dot, the article and noun, and the Ukrainian gender
  name; a noun with a plural shows both entries). They must never contain an accepted
  answer as a standalone word. In practice the noun line therefore appears only when
  no accepted answer contains the noun or its example forms, or when the prompt
  already gives the noun (`givenInPractice`); vocabulary recall of a noun shows it
  after Check. In a mixed case drill (`cueAfterCheck`) the Wo?/Wohin? cue and the
  motion arrow also wait until Check, so the scene shows only the place.
- On learn cards whose headword is exactly the article and noun (`der Bahnhof`,
  `das Kino / die Kinos`), each headword entry carries its own gender dot and the noun
  line shows only the Ukrainian gender names, so the noun is not repeated.
- **Decision visuals** contain the answer and appear only on learn cards or after
  Check: the stem/ending split of the answer (a muted stem and the ending in the
  noun's gender colour), the case strip (the endings of the answer's paradigm row in
  the order der · das · die · Plural, `—` where a form has no ending, with the
  answer's tile filled and outlined in its gender colour), and the highlighted answer
  and noun in the example sentence, where the answer's ending is also underlined as a
  second signal. Each highlighted example word uses its own gender, so a plural form
  such as `Bäumen` is highlighted in the plural colour.
- Verb forms use the same split, with the ending in the accent colour because a verb
  has no gender. A changed stem vowel (`answerParts.vowel`) is marked
  with an amber background in the headword, the strip, and the example, so the change
  is shown by both colour and shape. When the headword holds more than the form (the
  pronoun in `du fährst`, the separable prefix in `fängt an`), the other words stay
  muted. A conjugation strip (`paradigm.forms`) shows all six persons' whole forms
  in two rows of three (singular, then plural) with the answer's person
  highlighted. Its caption names the verb and, when the verb is not regular, what is
  special (`a → ä`, `додаткове e`, `du -t замість -st`,
  `du, er/sie/es без b`, `ich = er/sie/es`). The amber vowel marks only a vowel change
  (a caption `x → y`), exactly where the stem differs from the `wir` stem; other
  irregularities are named in the caption, not marked in the form.
- A personal-pronoun strip shows the card's person in Nom., Akk. and Dat. (caption
  `er (він) · Personalpronomen`) with the case the card asks for highlighted. Its
  tiles use the accent colour: the person, not a noun's gender, chooses the form.
- Perfekt cards name their auxiliary (`auxiliary`). The haben/sein panel (caption
  `Perfekt · haben чи sein`) shows both choices with an icon and a one-line rule:
  sein, in orange, is a dashed path from a dot to an arrow (`рух A → B або зміна
  стану`); haben, in the accent purple, is a box resting on a line (`дія з об’єктом /
  без руху`). It highlights the card's choice, also marked with `aria-current`. Only
  cards where the auxiliary is part of the decision carry `auxiliary` (Perfekt
  frames, haben-or-sein drills, past-verb cards); a drill of the participle alone
  does not. The auxiliary form in the example is highlighted in the
  same tone; a formula such as `haben + gemacht` highlights the infinitive. The panel
  is a decision visual: learn cards and after Check only. Past-verb cards take the
  auxiliary from their Perfekt form; a verb with both (`hat/ist geschwommen`) gets no
  panel. Only a present-tense auxiliary form in a Perfekt example is highlighted; a
  Präteritum example (`Als Kind durfte ich …`) keeps the panel and highlights
  nothing.
- Sentence structure (`structure`) is drawn as position boxes with a label under each
  box: `Поз. 1` · `Дієсл. 2` · `Середина` · `Кінець`, and `Сполучник` for a
  subordinate clause, whose verb stands in `Кінець`. A verb in the first box is
  labelled `Дієсл. 1`. `Кінець` holds verb parts only (infinitive, participle,
  separable prefix); noun parts of a verb phrase (`Ski` in `Ski fahren`) and words
  after `sein` (`da`, `groß`) stay in `Середина`. Both verb parts (the conjugated
  verb and the end) use the accent outline and tint, the middle box is dashed, and
  empty fields are left out. The middle field is always one box, never split into
  time, cause, manner and place. A question word fills `Поз. 1`. A Perfekt frame card
  shows both the haben/sein panel and the boxes.
  Clauses sit side by side and wrap on narrow screens. The boxes are a decision
  visual: learn cards and after Check only. Within a lesson, every word-order rule
  card and every sentence build in a word-order sequence carries a `structure`;
  cards that practise a single form do not.
- A frequency bar (`frequency`) places the card's adverb on a 0–100 % bar. The marker
  and the approximate percent (`≈ 40 % часу`) are a meaning visual and show before
  Check. The German adverbs along the bar are the answer set, so in practice they
  appear only after Check; learn cards show them, with the card's own word
  highlighted and marked with `aria-current`. Before Check the bar shows only the
  marker, `≈ N % часу` and its `0 %` and `100 %` ends. The values are fixed for every
  lesson (nie 0, fast nie 10, selten 25, manchmal 40, oft 60, meistens 75, fast immer
  90, immer 100); they show order, not statistics. The words sit at their percent and
  alternate above and below the bar so neighbours do not collide.
- An analog clock (`clock`) shows the card's time above the headword or prompt. The
  hands only repeat the prompt time, so they are a meaning visual and show before
  Check. The shaded span German counts (from the hour, from or to the half hour, or
  to the next hour) and its Ukrainian reading (`¼ години після 3`, `½ години до 4`,
  `10 хв до 6`) explain the answer, so they appear on learn cards and after Check.
  A full hour has no shaded span. The hour hand moves between hours, the numerals
  stay readable above the hands, and the clock's accessible name gives the digital
  time.
- A vocabulary picture (`picture`) shows a concrete word's meaning above the headword
  or prompt. It names an icon in `assets/icons/` (Microsoft Fluent Emoji Flat, MIT,
  with its `LICENSE` beside the icons); icons are stored in the repository, never
  loaded from a CDN. It is a meaning visual and shows before Check only where the
  prompt already gives the meaning. Screen readers skip it (`alt=""`) because the
  translation says the same. A word without a fitting picture gets none rather than a
  misleading one, and a phrase built on a noun reuses that noun's picture. Across all
  lessons a picture means one word or one noun (singular and plural count as the same
  noun), and a noun always shows the same picture. A card has either a scene or a
  picture, never both.
- Pilot a new visual component on one lesson and review it before extending it to
  other lessons. A new placement of an approved component (for example in the rule
  guide) reuses its design unchanged and may cover every lesson where it fits.
- Text never overflows the card or breaks inside a word. A headword, prompt or strip
  shrinks to fit its longest unbreakable run. Slash-separated alternatives
  (`das Kino / die Kinos`) and sentence-build chunks wrap only after a slash and stay
  whole; the slash stays with the word before it, and the text itself is unchanged.
  Every screen fits a 320 px phone without horizontal scrolling. On narrow screens
  spacing tightens first; text may shrink, but labels keep at least 14 px and the
  lesson title 16 px.

### Progress

- Separate **activity** (attempts, study days), **performance** (first-attempt
  accuracy), **mastery** (completed targets), and **retention** (recency/due status).
- Recommend the next review using due status first, then weak first-attempt accuracy,
  then unpracticed material. Do not treat lifetime 100% accuracy as permanent mastery.
- Show practice coverage per lesson and across the course on Progress. Coverage does
  not change pass size; passes stay at 5-9 cards.
- Every recommendation links directly to the relevant practice sequence. Empty states
  explain the first useful action instead of showing meaningless zero-heavy metrics.

Navigation is non-destructive across all screens. Back/forward controls, focus,
labels, status announcements, and dialogs must remain keyboard and screen-reader
usable.

## 6. Persistence contract

Use one versioned logical progress model even if local and disk adapters differ:

```js
{
  version: 5,
  lessons: {
    [lessonId]: {
      completedLearn: ["sequence-id"],
      masteredPractice: ["sequence-id"],
      learnedTargets: {["sequence-id"]: ["target-id"]},
      masteredTargets: {["sequence-id"]: ["target-id"]},
      attempts: 0,
      firstAttempts: 0,
      firstAttemptCorrect: 0,
      lastPracticedAt: null,
      dueAt: null
    }
  },
  activeSession: {
    lessonId: "...",
    sequenceId: "...",
    mode: "learn" | "practice",
    order: ["card-id"],
    index: 0,
    retryQueue: ["card-id"],
    answered: {}
  },
  suspendedSessions: {
    ["lessonId::sequenceId"]: {
      session: {/* same shape as activeSession */} | null,
      updatedAt: "ISO-8601 timestamp"
    }
  },
  pendingCompletions: {
    ["stable-completion-id"]: {
      lessonId: "...",
      sequenceId: "...",
      completedAt: "ISO-8601 timestamp"
    }
  },
  resolvedCompletions: {
    ["stable-completion-id"]: "ISO-8601 timestamp"
  },
  recentVariants: {
    ["sequence-id"]: ["variant-id"]
  },
  lastPasses: {
    ["sequence-id"]: {
      ids: ["variant-id"],
      updatedAt: "ISO-8601 timestamp"
    }
  },
  deviceContributions: {
    ["stable-writer-id"]: {
      lessons: {},
      activityByDate: {}
    }
  },
  activityByDate: {"YYYY-MM-DD": {attempts: 0, mastered: 0}}
}
```

- IDs are stable data keys, not titles or translated text.
- Existing pre-Constitution cards may pass through the isolated legacy adapter while
  they are migrated. Before changing one of their canonical answers, pin its current
  generated `targetId` explicitly so progress remains stable. All new or substantially
  revised cards must declare literal `id`, `targetId`, `type`, and `response` fields;
  display-text inference is never a model for new content.
- Save locally after every meaningful transition: answer, position change, sequence
  completion, or navigation away. Sync durable storage asynchronously and surface
  persistent failures without blocking study.
- Restore and merge monotonically: union completions, keep the newest active session,
  keep each pending completion until the learner resolves that same completion, and
  never let an older dialog resolve a newer completion from another writer. Never reduce
  cumulative counters. Do not use a global "larger total wins" merge: merge monotonic
  per-writer contributions independently so concurrent tabs or devices cannot erase
  activity. A writer ID combines a stable device ID with a tab/session ID.
- Date boundaries use the learner's local date; timestamps use ISO 8601 UTC.
- Schema changes require a version bump, validation, and an idempotent migration.
  Preserve unknown/newer data rather than silently resetting it.
- Completed stages without recorded targets are backfilled once with all of their
  targets. This is a data-only migration, so it needs no version bump; targets added
  later are never backfilled.
- Daily sampling state may expire; mastery, attempts, and history do not.
- Persist recent variant history long enough to enforce shuffle-bag coverage and avoid
  serving the same subset on consecutive passes.
- Switching to another sequence suspends the current pass under its sequence key when
  it has any progress. Resuming, finishing, or explicitly restarting that sequence
  replaces the entry with a `null` tombstone so an older copy cannot revive it; merge
  suspended entries per key by the newest `updatedAt`.

## 7. Content and change quality

- German must be natural, level-appropriate, and consistent with the stated rule.
  Ukrainian support text should clarify meaning without leaking the answer.
- Examples should vary person and context while avoiding unnecessary new vocabulary.
- Visual metadata must agree with the card: `answerParts` joins to the canonical
  answer, the paradigm's active cell equals it and sits in the noun's gender column
  (or, in a conjugation strip, the answer's person column; in a pronoun strip, the
  card's person row and case column), a `vowel` range lies inside the stem and covers
  the changed vowel, an `auxiliary` form is a present form of its verb and, when the
  sentence is in Perfekt, occurs exactly once in it,
  the example contains the answer, `noun.exampleWord`, and `noun.plural.exampleWord`
  exactly once each, the noun's article matches its gender, and a headword written as
  article and noun matches the authored noun entries. A `structure` lists its fields
  in sentence order (`first`, `verb`, `middle`, `end`; `verb`, `middle`, `end` for a
  yes/no question; or `link`, `middle`, `end`),
  each clause has a verb part, and the fields joined with spaces (clauses with `, `)
  equal a sentence-build answer without its final punctuation, or appear in the
  learn card's headword or example. A `frequency` scale is ordered by percent from 0
  to 100 and its active step is the card's own adverb; a `clock` time equals the
  card's digital time. A `picture` names an existing file in `assets/icons/`, every
  icon there is used, each picture belongs to one word or one noun across the course,
  and a practice card with a picture shows its meaning before Check. Guide-table rows have one cell
  per column and highlights point at existing cells. A guide `visual` has exactly one
  kind; its `structure` follows the same field order, its frequency bar is the shared
  scale, its scenes exist in the scene library with `Wo?`/`Wohin?` matching the
  motion, its pictures mean the same word or noun (with the same gender) as on the
  cards, and every sentence, time, word or noun it shows appears in the rule's text.
- A new target is incomplete without enough variants to keep successive learn and
  practice passes meaningfully different, except for documented closed-set cases.
- New lessons must use the shared sequence, shuffle, evaluation, completion, and
  persistence mechanisms rather than lesson-specific branches.
- Validate every changed lesson in both learn and practice modes, including shuffle,
  resume, wrong/correct feedback, retry behavior, completion splash, screen
  navigation, and persisted restoration. Check changed screens at 320 px, a typical
  phone (390 px) and desktop width for horizontal overflow.
- When implementation and The Constitution differ, treat the difference as product
  debt: do not copy the inconsistency into new code. Either align the implementation
  or update this contract deliberately in the same change.
