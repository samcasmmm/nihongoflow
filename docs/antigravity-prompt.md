# Prompt for Antigravity

Paste the block below into Antigravity as your first message, with `PRD.md`, `design.md`, `agents.md`, and `module-wise-feature.md` attached/added to the workspace context.

---

```
You are building a Japanese Learning Web App MVP. Before writing any code, read
these project docs in full and follow them as the source of truth:

- agents.md               → hard rules, tech stack, repo structure, conventions
- PRD.md                  → product scope, priorities, success metrics
- module-wise-feature.md  → feature list per module with MVP/later scope
- design.md               → gamification system spec

Hard constraints (do not violate, even if it seems more convenient):
1. Do not copy any content (vocabulary, sentences, grammar explanations,
   images) from Minna no Nihongo or any other copyrighted textbook. Only its
   lesson-order/grammar-topic sequence may be used as a syllabus outline.
   Write all seed content originally.
2. XP, streaks, and mission completion must be computed and stored
   server-side from underlying events — never trust a client-supplied value.
3. Practice sentences must only draw vocabulary from Lessons 1..N and grammar
   from Lesson N, enforced by a tag check.
4. SWOT thresholds must be configuration values, not hardcoded constants.

Build order (stop and confirm with me before moving to the next numbered step):
1. Scaffold the repo per agents.md's structure (apps/web, apps/api or Next API
   routes, packages/db, packages/content, packages/shared) with the tech
   stack specified (Next.js + TypeScript + Tailwind, Node backend,
   PostgreSQL). Set up lint, typecheck, and test scripts.
2. Implement the content schema (Lesson, VocabItem, KanaChar, GrammarPattern,
   SentenceItem, Question) and gamification schema (user_xp, xp_events,
   streaks, badges, user_badges, missions) as migrations.
3. Seed 2 pilot lessons of ORIGINAL content (vocab, grammar, kana progress
   already covered, and a small cumulative sentence bank) — ask me for
   review before generating more.
4. Build Auth + email verification + placement quiz (module 1–2).
5. Build Hiragana + Vocabulary flashcard engines with Leitner-box progress
   tracking (module 4–5).
6. Build the Grammar pattern viewer (module 6).
7. Build the Lesson stepper (Vocabulary → Grammar → Practice) with per-stage
   progress persistence and resume (module 7).
8. Build Practice: sentence delivery, transformation + translation input,
   keyword-slot evaluation with LLM fallback for translation, attempt
   recording with error tags (module 8).
9. Build the SWOT engine: per-tag accuracy rollup, 4-quadrant thresholds from
   config, session + 30-day reports, "not enough data yet" state (module 9).
10. Wire in MVP gamification: XP events, streaks with weekly freeze,
    lesson-complete reward screen, 5-badge set, weakness/refresh missions,
    daily goal ring (module 11, per design.md).
11. Build Dashboard tying all of the above together (module 3).
12. Add Tests module (lesson/cumulative/Hiragana tests) if time allows.

After each step: run lint + tests, summarize what was built, list any
assumptions you made, and flag anything in PRD.md's open questions (§10)
that blocks the next step. Do not silently make a product decision that
PRD.md leaves open — ask me instead.
```
