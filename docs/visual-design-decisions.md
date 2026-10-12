# Visual design decisions

This is the living record of how DeutschDrill turns grammar and vocabulary into
visual associations. Each component below was shown as two or three mocked options
(A, B, C) using real cards from the lessons. One option was chosen per component.

Use this page to review the choices after practising with them, and to change them.
Every option stays documented, with its screenshot, so a decision can be reversed
without redesigning from scratch.

The product rules that apply to every component (Menschen gender colours, colour
never the only signal, when a visual may appear, explicit metadata, one shared
renderer, and piloting on one lesson first) live in the
[Project Constitution](project-constitution.md#visual-language). This page records
*which design* implements those rules.

## Current choices

Chosen by the learner on 2026-10-12: **1A, 2A, 3C, 4C, 5A, 6A, 7A, 8A, 9A, 10C**.

| # | Component | Choice | Visible | Status |
|---|---|---|---|---|
| 1 | [Gender colour](#1-gender-colour) | **A** — Menschen dot | Learn; practice before Check when the noun is not the answer | Rolled out (Phase 1) |
| 2 | [Stem + ending](#2-stem--ending-split) | **A** — muted stem, coloured ending | Learn; after Check | Rolled out (Phases 1–2) |
| 3 | [Paradigm mini-map](#3-paradigm-mini-map) | **C** — one-row strip for the current case | Learn; after Check | Rolled out (Phases 1–2) |
| 4 | [Example focus](#4-focus-inside-the-example) | **C** — gender-linked colour + underlined ending | Learn; after Check | Rolled out (Phase 1) |
| 5 | [Sentence structure](#5-sentence-structure) | **A** — position boxes | Learn; after Check | Rolled out (Phase 3) |
| 6 | [Vocabulary picture](#6-pictures-for-concrete-words) | **A** — picture above the word | Learn; practice before Check | Planned, Phase 5 |
| 7 | [Frequency](#7-frequency-scale) | **A** — 0–100 % bar | Learn; practice before Check | Planned, Phase 4 |
| 8 | [Clock](#8-clock-for-time-expressions) | **A** — analog clock | Learn; practice before Check | Planned, Phase 4 |
| 9 | [haben / sein](#9-haben-vs-sein-in-perfekt) | **A** — movement vs action icon | Learn; after Check | Rolled out (Phase 2) |
| 10 | [Guide tables](#10-rule-tables-in-the-guide) | **C** — "what changes" table | Guide panel | Rolled out (Phases 1–2) |

"Rolled out" means the design was approved after its pilot and now runs in every
lesson listed under [Phase 1 coverage](#phase-1-coverage),
[Phase 2 coverage](#phase-2-coverage) and
[Phase 3 coverage](#phase-3-coverage). "Piloted" means the
design runs in one pilot lesson and waits for the learner's review. "Planned" means
nothing is built yet; the phase and pilot lesson are listed in [Rollout](#rollout).

## How to change a decision

1. Practise with the pilot and note what helps or gets in the way in
   [Review notes](#review-notes).
2. Pick a different option (or a mix) for the component and update its
   **Decision** line and the [Current choices](#current-choices) table.
3. Add a row to the [Decision log](#decision-log) with the date and the reason.
4. If the change affects a product rule (for example, *when* a visual may appear),
   update the Constitution's "Visual language" section in the same change.
5. Re-pilot on one lesson, check it in learn and practice on desktop and phone, and
   roll it out only after review.

Most switches are renderer-only: the lesson data already stores the complete
information (for example, every card keeps its full paradigm), so changing how it
is drawn does not require editing card data.

---

## 1. Gender colour

**Encodes:** the noun's gender — **der** blue, **das** green, **die** red,
**Plural** yellow (Menschen).
**Applies to:** the noun a card is about, including noun headwords and plurals in
travel, es gibt, time, everyday and directions lessons and the place noun in local
prepositions.
**Visible:** learn cards; practice before Check only when gender is not the answer
being practised; always after Check.

![Gender colour options](visual-design-options/01-gender-color.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Menschen dot: a coloured dot before the article and noun (`● das Taxi`) | Identical to the textbook; quiet | Small; easy to ignore on dense cards |
| B | Article chip: the article sits in a coloured chip | Strongest article ↔ colour link | Heavier look |
| C | Coloured article + underlined noun + gender tag | Colour travels with the noun into sentences | Underlines can read as links |

**Decision:** A — Menschen dot.

**In the app:** a decorative dot (hidden from screen readers), then the article and
noun in dark text (`der Bruder`), then the Ukrainian gender name
(`чоловічий рід`). The gender name stays because *die* is both feminine and plural,
so the colour is never the only signal. A noun with a plural shows both entries
(`● der Baum чоловічий рід / ● die Bäume множина`).
When the learn headword already is the article and noun (`der Bahnhof`,
`das Kino / die Kinos`), each headword entry gets its own dot and the line under the
translation shows only the gender names, so the noun is not printed twice.
In practice the line is a meaning hint: it appears before Check when the answer
does not contain the noun (possessive, `es gibt` and preposition gaps) and waits
until Check when it would give the answer away (recalling `der Bahnhof` from
`вокзал`).
**Data:** `noun: { article, word, gender, exampleWord, plural?, givenInPractice? }`,
built with `nounMeta()` in `script.js`.
**Switching:** renderer-only (`renderNounGender`, `renderStudyHeadword` in `app.js`
and their CSS).

## 2. Stem + ending split

**Encodes:** which part of a form changes — the ending, and later the changed stem
vowel (`a → ä`).
**Applies to:** possessives, possessive cases, pronoun cases, conjugation, strong
verbs, sein.
**Visible:** learn cards; after Check in practice.

![Stem and ending options](visual-design-options/02-stem-ending.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Muted stem, coloured ending (`mein`**`en`**; `f`**`ä`**`hr`**`st`**) | Minimal; the eye jumps to what changes | Stem looks "disabled" |
| B | Building blocks: stem block + ending block | Very concrete "assembly" picture | Takes more width on phones |
| C | Bracket with a label (`Akk · m`) | Names why the ending is there | The label reveals the case |

**Decision:** A — muted stem, coloured ending.

**In the app:** the learn headword shows the stem in grey and the ending in the
noun's gender colour. After Check in practice, the case strip (3C) shows the ending.

**Phase 2 pilot (strong-verbs):** the changed stem vowel gets an amber background
(`f`**`ä`**`hr`**`st`**), in the headword, the strip and the example sentence. The
background is the second signal besides colour. The pronoun and a separable prefix
stay muted grey around the form (`du fährst`, `er / sie / es fängt an`). Verbs have
no gender, so their ending uses the app accent (purple). `ich weiß` has a changed
vowel and no ending.

**Rolled out (Phase 2):** every verb card with a person strip (3C) splits its form the
same way: sein, conjugation (`arbeit`**`est`**), haben / bekommen / brauchen
(`ha`**`st`**) and können / mögen / möchten (`k`**`a`**`nn`). Only a vowel change gets
the amber background (`ö → a` in können and mögen); other irregularities are named in
the strip caption instead. Personal-pronoun cards show the whole pronoun as the
answer (`ihn`), with no ending.
**Data:** `answerParts: { stem, ending }`, which must join to the canonical answer;
a vowel change adds `vowel: { start, end }` (indices in the stem). In `script.js`
the strong-verb forms are written compactly as `f[ä]hr|st` (`[…]` the vowel, `|` the
ending).

## 3. Paradigm mini-map

**Encodes:** where the answer lives in its paradigm (case × gender for articles and
pronouns; person × form for verbs).
**Applies to:** possessive cases, pronoun cases, conjugation.
**Visible:** learn cards; after Check in practice (it contains the answer).

![Paradigm mini-map options](visual-design-options/03-paradigm.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| A | Dot grid: case × gender dots with the answer's dot lit | Spatial memory; compact | Doesn't show neighbouring endings |
| B | Mini table with the active cell lit | Full context every time | Busier feedback area |
| **C ✅** | One-row strip: the current case's four endings, the answer's tile lit | Focused; shows "only masculine changes in Akk" | Loses the case-to-case picture |

**Decision:** C — one-row strip for the current case.

**In the app:** a caption such as `Akkusativ · mein + закінчення`, then four tiles
(`-en DER`, `— DAS`, `-e DIE`, `-e PLURAL`). The answer's tile is filled and
outlined in its gender colour and marked as current for screen readers. Unlike the
mock-up, the other tiles are not faded: fading would drop text contrast below
4.5:1, so they stay on white with a light border instead.
The case-to-case picture this option loses is available in the guide table (10C).
**Data:** `paradigm` keeps every row; `active` points at the answer's cell.
**Switching:** renderer-only (`renderCardParadigm`). Going back to B or A needs no
card-data changes.

**Phase 2 pilot (strong-verbs):** the strip becomes a person strip: caption
`Präsens · fahren · a → ä`, then six tiles in two rows of three (`fahre ich`,
`fährst du`, `fährt er/sie/es`, `fahren wir`, `fahrt ihr`, `fahren sie/Sie`). Each
tile shows the whole form with its ending in purple and, where the stem changes, the
vowel marked as in 2A. The answer's person is outlined. The strip thus shows at a
glance that only `du` and `er/sie/es` change (and also `ich` for `wissen`).
**Data:** `paradigm.forms: true`, one `Präs.` row whose cells are the six forms.

**Rolled out (Phase 2):**
- *Verb person strips* in sein, conjugation, haben (haben, bekommen, brauchen) and
  können (können, mögen, möchten). The caption names the verb and what is special:
  `Präsens · arbeiten · додаткове e`, `Präsens · heißen · du -t замість -st`,
  `Präsens · haben · du, er/sie/es без b`, `Präsens · können · ö → a`,
  `Präsens · möchten · ich = er/sie/es`. A regular verb shows only its name
  (`Präsens · machen`).
- *Pronoun strips* in personal-pronoun cases: caption `er (він) · Personalpronomen`
  and three tiles `er Nom.`, `ihn Akk.`, `ihm Dat.`; the case the card asks for is
  outlined. Tiles use the accent colour, not gender colours, because the person
  (not a noun) chooses the form.

## 4. Focus inside the example

**Encodes:** the answer and its noun inside the example sentence, and that they
agree in gender.
**Applies to:** learn examples and "Приклад у контексті" in all lessons.
**Visible:** learn cards; after Check in practice.

![Example focus options](visual-design-options/04-example-focus.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| A | Highlighter marker behind the target | Calm, textbook-like | No grammar information in the colour |
| B | Accent underline | Subtle, matches the app accent | Weakest visual cue |
| **C ✅** | Gender-linked colour on the answer and its noun, ending underlined | Shows agreement: word and noun share a colour | Needs explicit gender data on each card |

**Decision:** C — gender-linked colour + underlined ending.

**In the app:** `Ich besuche` **`meinen Bruder`**`.` — both words take the noun's
gender colour, and the ending `-en` is underlined. Each highlighted word keeps its
own gender, so in `von den Bäumen` the plural form is highlighted in yellow even
though the headword starts with `der Baum`.
**Data:** `noun.exampleWord`, `noun.plural.exampleWord` and `answerParts`; each must
appear exactly once in the example.

## 5. Sentence structure

**Encodes:** German word order — position 1, the verb in position 2, the middle
field, and the end of the sentence (separable prefix, infinitive, participle).
**Applies to:** word order, separable verbs, modal verbs, Perfekt sentence builds.
**Visible:** learn (rule cards); after Check on sentence-build cards.

![Sentence structure options](visual-design-options/05-sentence-structure.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Position boxes: `Поз. 1` · `Дієсл. 2` · `Середина` · `Кінець` | One clear "slot 2 / end" template for every sentence | Long sentences wrap to two lines |
| B | Verb-bracket arc (Satzklammer) joining the two verb parts | One strong shape for separable, modal and Perfekt | Less explicit about position 1 |
| C | Split-and-move: `auf\|stehen` with arrows to position 2 and the end | Shows where each piece of the verb goes | Separable verbs only; A or B still needed elsewhere |

**Decision:** A — position boxes.
The earlier provisional pick added C for separable verbs; that was not adopted.
If the boxes don't make the separable prefix obvious enough, C or B can be added
later for separable verbs only.

**Status:** rolled out (Phase 3) to the lessons in
[Phase 3 coverage](#phase-3-coverage).

**Phase 3 pilot.** Every separable-verbs card shows the boxes: the 10 vocabulary
cards and 4 pattern cards on the learn card (for the example or the rule sentence),
and the 14 sentence builds after Check. Details:

- Each card stores its fields explicitly (`structure`), one list per clause, so the
  boxes always rebuild the sentence word for word.
- The conjugated verb and the end of the sentence share one style (accent outline and
  tint): together they form the verb bracket. The middle box is dashed. Each box has
  its label underneath, so colour is not the only signal.
- Labels: `Поз. 1` · `Дієсл. 2` · `Середина` · `Кінець`; a subordinate clause starts
  with `Сполучник` and ends with the whole verb (`weil` · `ich früh` · `aufstehe`).
  Empty fields are left out, so `Ich verstehe die Aufgabe.` has no `Кінець` box.
- **Changed from the mock-up:** the verb boxes use the accent purple that every other
  verb visual uses (person strips, haben), not orange. Orange already means `sein` in
  the haben / sein panel, and Perfekt sentences will show both. Switch to orange if
  the purple makes the bracket too quiet.

**Phase 3 rollout.** The pilot was approved and the boxes now also run in word-order,
können and Perfekt. Rules used for the new cards:

- A yes/no question starts with the verb, so its first box is `Дієсл. 1`
  (`Kannst` · `du mir bitte` · `helfen`). A question word fills `Поз. 1` as usual
  (`Wohin` · `kannst` · `du mit dem Auto` · `fahren`).
- `Кінець` holds verb parts only: an infinitive, a participle or a separable prefix.
  `spazieren gehen` stays together at the end. Noun parts of a verb phrase stay in
  the middle (`im Winter oft Ski` · `fahren`; `gut Gitarre` · `spielen`), and so do
  words after `sein` (`Der Mann` · `ist` · `da`).
- The whole middle field is one box, even in long TE-KA-MO-LO sentences, where it
  wraps to two lines on a phone. Splitting it into TE / KA / MO / LO boxes is a
  possible later addition.
- Perfekt frame cards show the haben / sein panel and the boxes together; the
  auxiliary sits in `Дієсл. 2` and the participle in `Кінець`.
## 6. Pictures for concrete words

**Encodes:** the meaning of concrete nouns and verbs (transport, places, food,
seasons, landmarks).
**Applies to:** travel, everyday, es gibt / leisure, directions.
**Visible:** learn cards; in practice before Check, because a picture shows meaning,
not the German answer.

![Vocabulary picture options](visual-design-options/06-vocabulary-picture.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Picture above the word | Picture first gives the strongest image memory | Card gets taller; pushes the example down on phones |
| B | Small icon inline with the word | Compact; layout unchanged | Smaller image, weaker association |
| C | Word and picture side by side | Flashcard feel | Left-aligned headword differs from other lessons |

**Decision:** A — picture above the word.

**Source:** Microsoft Fluent Emoji Flat SVGs (MIT licence), stored in the repository
with their licence file, never loaded from a CDN. If no picture fits a word, show
none rather than a misleading one.
**Status:** planned for Phase 5, piloted on travel-transport.

## 7. Frequency scale

**Encodes:** how often (`immer … nie`) as a position on a scale.
**Applies to:** the frequency lesson; reused for frequency words in other lessons.
**Visible:** learn cards; practice before Check (it shows meaning).

![Frequency options](visual-design-options/07-frequency.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | 0–100 % bar with all adverbs in order, the current one marked | Shows all eight words in order at once | Labels get tight on phones |
| B | Week calendar (`≈ 3 з 7 днів`) | Concrete, life-like | `fast immer` vs `meistens` hard to tell apart |
| C | Vertical ladder | Ranking is easy to remember | Repeats the whole list on every card |

**Decision:** A — 0–100 % bar.
**Status:** planned for Phase 4, piloted on frequency. Check label crowding on
phones during the pilot.

## 8. Clock for time expressions

**Encodes:** clock time as Germans say it (`Viertel nach drei`, `halb vier`).
**Applies to:** time expressions and the time worksheet.
**Visible:** learn cards; practice before Check (the clock shows the prompt time,
not the phrase).

![Clock options](visual-design-options/08-clock.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Analog clock face | How Germans actually "see" Viertel and halb | Takes vertical space |
| B | Hour ruler marking `nach` / `vor` / `halb` | Explains `halb vier = 3:30` | Abstract; reveals nach/vor, so after Check only |
| C | Digital time + word-by-word phrase map | Exact mapping; day/night icon | Less of a picture |

**Decision:** A — analog clock.
**Status:** planned for Phase 4, piloted on time-expressions.

## 9. haben vs sein in Perfekt

**Encodes:** why a verb takes *sein* (movement from A to B, or a change of state) or
*haben* (an action, with or without an object, and no movement).
**Applies to:** Perfekt and past-verb lessons.
**Visible:** learn cards; after Check in practice (the auxiliary is the decision).

![haben/sein options](visual-design-options/09-haben-sein.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| **A ✅** | Movement vs action icon: a path icon for *sein*, a hand icon for *haben* | The rule becomes a picture: path = sein | Two rows of feedback |
| B | Colour-coded auxiliary (sein orange, haben purple) everywhere | Lightest; works in every sentence | Colour alone doesn't explain the rule |
| C | Route mini-scene per verb | Most visual; memorable | Needs a scene for each verb type |

**Decision:** A — movement vs action icon.

**In the app (perfekt pilot):** under the translation, a caption
`Perfekt · haben чи sein` and two rows. *sein* has a dashed path from a dot to an
arrow and the rule *рух A → B або зміна стану*. *haben* has a box resting on a line
and the rule *дія з об’єктом / без руху*. The box on a line is taken from the
mock-up; the option table's "hand icon" describes the same idea. The card's choice is
outlined and tinted (sein orange `#a34d00`, haben violet `#6554d9`) and marked as
current for screen readers. Unlike the mock-up, the other row is not faded, so its
text keeps 4.5:1 contrast. The auxiliary in the example sentence takes the same
colour (`Er `**`ist`**` nach Berlin gefahren.`). In the frame-learn formulas
(`haben + gemacht`) the infinitive is highlighted.
**Where:** the frame and the haben-or-sein stages (learn cards; practice after Check).
The Partizip II stages do not show it, because there the auxiliary is not the decision.
**Data:** `auxiliary: { verb: "haben" | "sein", form }`, where `form` occurs once in
the sentence.

**Rolled out (Phase 2):** every card in past-verbs (A1), past-verbs-a2 and
past-verbs-b1 whose Perfekt form starts with `hat` or `ist` shows the panel on learn
cards and after Check. The auxiliary is read from the card's Perfekt form, so it never
disagrees with the answer. When the example sentence is in Perfekt, its present-tense
auxiliary is coloured (`Ich `**`bin`**` zu Hause geblieben.`). When the example is in
Präteritum (`Als Kind durfte ich lange aufbleiben.`), the panel still shows the
auxiliary but nothing in the sentence is coloured. Verbs that take both
(`schwimmen`, `brechen`, `frieren`, `reiten`, `scheiden`, `schießen`, `treten`:
`hat/ist …`) show no panel, because the choice depends on the meaning.

## 10. Rule tables in the guide

**Encodes:** the whole paradigm as a pattern, and what changes from one case to
the next.
**Applies to:** the "Правила" panel of every lesson that teaches a paradigm.
**Visible:** guide panel. During practice, a table or note that contains an accepted
answer is hidden until Check.

![Guide table options](visual-design-options/10-guide-tables.png)

| Option | Design | Strength | Weakness |
|---|---|---|---|
| A | Gender-coloured grid of full forms | Columns become colour zones | Lots of colour |
| B | One card per case, with its question word (`Wen?`, `Wem?`) | Mobile-friendly; adds the question | Harder to compare cases |
| **C ✅** | "What changes" table: endings only, neutral cells, coloured column headers, changed cells highlighted, plus a one-line note | Shows the pattern | Less colourful; you add the stem mentally |

**Decision:** C — "what changes" table.

**In the app (possessive-cases, rule 2):** rows Nom., Akk., Dat.; columns der, das,
die, Plural with gender-coloured header chips; `—` in muted grey; the Akk. × der
cell (`-en`) highlighted in lavender. The note reads:
*"Від Nominativ до Akkusativ змінюється лише der: додається -en. Das, die і Plural
не змінюються."* The note describes the change in words, so the highlight is not the
only signal. Unlike the mock-up, it avoids full word forms such as *meinen*, so it
stays visible during practice. The mock-up's Genitiv row is left out because the
lesson covers Nominativ, Akkusativ and Dativ.
**Data:** a guide rule's `table: { columns, rows, highlights, note }`. Highlighted
cells are listed explicitly (`highlights: [{ row, column }]`). A row may carry a
`gender` (shown as a dot before its label) for person rows such as `er`, `sie`, `es`.

**Rolled out to:** possessives (Nominativ endings), es gibt (ein → einen), local
prepositions (Nom. vs Wo? vs Wohin? articles), travel (`mit` + Dativ articles),
dative verbs (Nom. vs Dat. articles), personal-pronoun cases (Akkusativ and Dativ by
person) and conjugation (`mach-` vs `arbeit-` endings). The pronoun and conjugation
tables list the forms the lesson asks for, so they show on learn cards and after
Check only.

**Phase 2 pilot (strong-verbs, rule 5):** the stem vowel by person: rows `e → i`,
`e → ie`, `a → ä`, `i → ei` (hover shows the verbs), columns `ich`, `du`,
`er/sie/es`, `wir/ihr/sie`, changed vowels highlighted. The note names the verbs of
each row. The cells hold only vowels, so the table stays visible during practice.

**Rolled out (Phase 2):**
- *sein:* `Однина` / `Множина` by person (`ich bin` … `sie/Sie sind`), with both
  `sind` cells highlighted.
- *haben:* the six forms of haben, bekommen and brauchen side by side; `hast` and
  `hat` (the forms without b) are highlighted.
- *können:* the six forms of können, mögen and möchten side by side; the singular of
  können and mögen (`ö → a`, no ending in ich and er/sie/es) is highlighted. The rule
  also names the three meanings.

These tables hold the answers, so they show on learn cards and after Check only.

---

## Colour tokens

The gallery used brighter colours. The app uses darker shades so coloured text keeps
at least 4.5:1 contrast on white and on its tint.

| Gender | Text / dot | Tint | Gallery original |
|---|---|---|---|
| der (masculine) | `#2459b8` | `#e7f0ff` | `#2f6fd6` |
| das (neuter) | `#167a4c` | `#e3f6ec` | `#1f9a62` |
| die (feminine) | `#b73232` | `#fdeaea` | `#d64545` |
| Plural | `#8a6200` | `#fff6d6` | `#b8860b` |

Defined in `lesson-journey.css` as `--g-m`, `--g-n`, `--g-f`, `--g-pl` and their
`-bg` tints.

## Rollout

Each phase is piloted on one lesson and reviewed before it reaches other lessons.

| Phase | Scope | Components | Pilot lesson | Status |
|---|---|---|---|---|
| 0 | Shared foundation: metadata, renderer, reveal rules | — | local-prepositions (parity) | Done |
| 1 | Gender colours, example focus, guide tables | 1, 4, 10 (+ 2, 3 for possessives) | possessive-cases | Rolled out |
| 2 | Morphology: stem/ending, vowel change, paradigms, haben/sein | 2, 3, 9 (+ 10 for verbs) | strong-verbs; perfekt for 9 | Rolled out |
| 3 | Sentence structure | 5 | separable-verbs | Rolled out |
| 4 | Concept visuals | 7, 8 | frequency; time-expressions | Planned |
| 5 | Vocabulary pictures | 6 | travel-transport | Planned |

### Phase 1 coverage

| Lesson | Gender line and example focus (1, 4) | Stem + ending, case strip (2, 3) | Guide table (10) |
|---|---|---|---|
| possessive-cases | Every card | Every card | Nom. / Akk. / Dat. endings |
| possessives | Nominativ possessive cards (`mein Bruder`, `deine Freunde`, `ihre Tasche` …) | Nominativ possessive cards | Nominativ endings |
| local-prepositions | Every card; shown in practice because the gap gives the noun | — | Nom. / Wo? / Wohin? articles |
| es-gibt-leisure | Places with singular and plural, pattern cards | — | ein → einen |
| travel-transport | Transport, places and phrases with a noun | — | `mit` + Dativ |
| time-worksheet-vocabulary | Season, weather and nature nouns | — | — |
| everyday-vocabulary | Food nouns | — | — |
| giving-directions | Landmarks | — | — |
| dative-verbs | — | — | Nom. vs Dat. articles |
| personal-pronoun-cases | — | — | Akkusativ / Dativ by person |
| conjugation | — | — | `mach-` vs `arbeit-` |

### Phase 2 coverage

| Lesson | Stem + ending, person strip (2, 3) | haben / sein panel (9) | Guide table (10) |
|---|---|---|---|
| strong-verbs | Every card; vowel change marked | — | Stem vowel by person |
| sein | Every card | — | Forms by person and number |
| conjugation | Every card; caption names extra e or du -t | — | `mach-` vs `arbeit-` (Phase 1) |
| haben | Every card (haben, bekommen, brauchen) | — | haben vs bekommen vs brauchen |
| koennen | Form cards (können, mögen, möchten); `ö → a` marked | — | können vs mögen vs möchten |
| personal-pronoun-cases | Every card; Nom. / Akk. / Dat. pronoun strip | — | Akkusativ / Dativ by person (Phase 1) |
| perfekt | — | Frame and haben-or-sein stages | — |
| past-verbs, past-verbs-a2, past-verbs-b1 | — | Every card except `hat/ist` verbs | — |

### Phase 3 coverage

Position boxes (5) appear on learn cards and after Check on sentence builds.

| Lesson | Learn cards | Sentence builds |
|---|---|---|
| separable-verbs | All 14 (vocabulary and pattern cards) | All 14 |
| word-order | All 15 rule cards | All 22 |
| koennen | 4 word-order rule cards | 21 (word-order practice stage) |
| perfekt | 6 frame cards | The same 6 frames in practice |

Other können cards (forms and gap fills) and the other Perfekt cards (haben or sein,
participle forms) have no boxes: they practise a single form, not the sentence order.

Lessons not listed keep their current look until a later phase reaches them.

## Decision log

| Date | By | Choices | Notes |
|---|---|---|---|
| 2026-10-12 | Provisional (learner unavailable) | 1B 2A 3B 4C 5A+5C 6A 7A 8A 9A 10A | Used to build the Phase 1 pilot |
| 2026-10-12 | Learner | 1A 2A 3C 4C 5A 6A 7A 8A 9A 10C | Pilot updated: 1B → 1A, 3B → 3C, 10A → 10C; 5C dropped |
| 2026-10-12 | Learner | Pilot approved | Phase 1 rolled out to the lessons in [Phase 1 coverage](#phase-1-coverage); Phase 2 pilot started |
| 2026-10-12 | — | Phase 2 piloted | Vowel change (2A), person strip (3C) and guide table (10C) on strong-verbs; haben/sein panel (9A) on perfekt. Awaiting review |
| 2026-10-12 | Learner | Phase 2 pilot approved | Phase 2 rolled out to the lessons in [Phase 2 coverage](#phase-2-coverage) |
| 2026-10-12 | — | Phase 3 piloted | Position boxes (5A) on separable-verbs, verb boxes in the accent purple instead of the mock-up's orange. Awaiting review |
| 2026-10-12 | Learner | Phase 3 pilot approved | Phase 3 rolled out to the lessons in [Phase 3 coverage](#phase-3-coverage) |

## Review notes

Record what you notice while practising, then use it to revisit a decision.

| Date | Component | What helped or got in the way | Change to try |
|---|---|---|---|
| | | | |

---

Screenshots show mock-ups from the design gallery, not the live app. Pictures in
option 6 are Microsoft Fluent Emoji (MIT licence).
