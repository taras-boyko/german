---
name: check-german-grammar
description: Check German grammar and return color-coded HTML corrections. Use when the user asks to check, correct, or proofread German text.
---

Check the German grammar in the text provided by the user.

- Preserve correct words exactly as written.
- Mark each incorrect word or phrase with `<del class="wrong">...</del>`.
- Put its replacement immediately after it in `<ins class="right">...</ins>`.
- Use `<ins class="right">...</ins>` by itself for missing words.
- Use `<del class="wrong">...</del>` by itself for unnecessary words.
- Keep punctuation with its related word whenever possible.
- Translate every fully corrected German line into natural Ukrainian.
- Do not wrap the result in Markdown fences or add explanations unless the user asks.

Return only this HTML fragment:

<section class="grammar-result">
  <div class="correction-row">
    <span class="correction-text">...</span>
    <p class="translation">...</p>
  </div>
</section>

Create one `.correction-row` for every input line so the corrected German and Ukrainian translation stay aligned.

After producing the correction and translation, display them in the built-in browser. Create a temporary HTML preview that includes the result fragment and styles `.grammar-result` as a vertical list, `.correction-row` as a two-column grid (corrected German left, Ukrainian right), `.wrong` with a red line-through, `.right` with green emphasized text, and `.translation` as muted Ukrainian text. Stack each row into one column on narrow screens, then open the preview in the browser.
