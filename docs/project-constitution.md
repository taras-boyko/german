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
  translation: "..."
}
```

- `recall`: meaning or communicative cue -> German word or phrase.
- `cloze`: contextual sentence with one assessable gap -> missing form.
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
- Track first-attempt correctness separately from eventual completion. This keeps
  accuracy meaningful while allowing learners to recover from mistakes.

## 3. Sequence workflow

### Learn

1. Show the chapter objective and optional collapsed rule guide.
2. Shuffle cards when the sequence starts. Keep the order stable while navigating.
3. Present the target, translation, and one natural example without requiring input.
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
  but does not erase completion.
- Keep chapters freely accessible. Recommend the pedagogical next step instead of
  hard-locking content; this supports review and experienced learners.
- Repeated mistakes stay in the current retry queue. Do not force a full restart or
  reward repeated guessing as first-attempt accuracy.

## 5. Screen responsibilities

### Library

- Derive lesson counts and status from lesson definitions and persisted state; never
  hardcode them in markup.
- Show title, concise outcome, level, chapter/sequence count, and status:
  **Not started**, **Learning**, **Ready to practice**, **Mastered**, or **Due**.
- The primary action resumes an in-progress sequence or starts the recommended next
  sequence. Preserve a direct way to open any chapter.

### Lesson

- Keep lesson, chapter, phase, objective, card position, and completion visible.
- Use one card workspace for all exercise types and one predictable keyboard flow.
- Preserve position when switching screens. Explicitly starting a new attempt is the
  only action that resets order and response state.
- Guides are optional, concise, collapsed by default, and available without leaving
  the card. They must not obscure the prompt or contain the answer during practice.

### Progress

- Separate **activity** (attempts, study days), **performance** (first-attempt
  accuracy), **mastery** (completed targets), and **retention** (recency/due status).
- Recommend the next review using due status first, then weak first-attempt accuracy,
  then unpracticed material. Do not treat lifetime 100% accuracy as permanent mastery.
- Every recommendation links directly to the relevant practice sequence. Empty states
  explain the first useful action instead of showing meaningless zero-heavy metrics.

Navigation is non-destructive across all screens. Back/forward controls, focus,
labels, status announcements, and dialogs must remain keyboard and screen-reader
usable.

## 6. Persistence contract

Use one versioned logical progress model even if local and disk adapters differ:

```js
{
  version: 4,
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
- Daily sampling state may expire; mastery, attempts, and history do not.
- Persist recent variant history long enough to enforce shuffle-bag coverage and avoid
  serving the same subset on consecutive passes.
- Switching to another sequence while a pass has responses or a retry queue requires an
  explicit discard confirmation unless per-sequence suspended sessions are persisted.

## 7. Content and change quality

- German must be natural, level-appropriate, and consistent with the stated rule.
  Ukrainian support text should clarify meaning without leaking the answer.
- Examples should vary person and context while avoiding unnecessary new vocabulary.
- A new target is incomplete without enough variants to keep successive learn and
  practice passes meaningfully different, except for documented closed-set cases.
- New lessons must use the shared sequence, shuffle, evaluation, completion, and
  persistence mechanisms rather than lesson-specific branches.
- Validate every changed lesson in both learn and practice modes, including shuffle,
  resume, wrong/correct feedback, retry behavior, completion splash, screen
  navigation, and persisted restoration.
- When implementation and The Constitution differ, treat the difference as product
  debt: do not copy the inconsistency into new code. Either align the implementation
  or update this contract deliberately in the same change.
