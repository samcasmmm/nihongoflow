# Module-wise Feature Breakdown

MVP column: ✅ = build now, 🟡 = build if time allows, ⏳ = later phase.

---

## 1. Auth & Onboarding ✅ [DONE]

| Feature                        | MVP | Notes               |
| ------------------------------ | --- | ------------------- |
| Email register + password      | ✅  | bcrypt/argon2       |
| Email verification             | ✅  | or magic link       |
| Login / logout                 | ✅  |                     |
| Password reset                 | ✅  |                     |
| Account deletion + data export | 🟡  | privacy requirement |
| Google/Apple login             | ⏳  |                     |

**Endpoints:** `/auth/register`, `/auth/login`, `/auth/verify`, `/auth/reset`
**Entities:** `users`

## 2. Placement ✅ [DONE]

| Feature                            | MVP | Notes                                 |
| ---------------------------------- | --- | ------------------------------------- |
| 5–8 question quiz                  | ✅  | prior study, kana ability, basic MCQs |
| Set starting_lesson + level label  | ✅  |                                       |
| Manual override of suggested level | ✅  |                                       |
| Retake from Settings               | 🟡  |                                       |
| Adaptive placement test            | ⏳  |                                       |

**Endpoints:** `/placement/questions`, `/placement/submit`
**Entities:** `profiles`

## 3. Dashboard ✅ [DONE]

| Feature                                                         | MVP | Notes                  |
| --------------------------------------------------------------- | --- | ---------------------- |
| 5 entry cards (Hiragana, Vocab, Grammar, Start Learning, Tests) | ✅  |                        |
| Current lesson + progress % + Continue button                   | ✅  |                        |
| Gamification summary (XP, streak, daily goal)                   | ✅  | see design.md          |
| Active weakness/refresh missions                                | ✅  | see design.md §3.5–3.7 |

**Endpoints:** `/lessons`, `/gamification/summary`

## 4. Hiragana Flashcards ✅ [DONE]

| Feature                                         | MVP | Notes                |
| ----------------------------------------------- | --- | -------------------- |
| 46 base char deck                               | ✅  |                      |
| Dakuten/handakuten + yōon decks                 | ✅  |                      |
| Flip / next / prev / shuffle                    | ✅  |                      |
| Know it / Still learning + Leitner box tracking | ✅  |                      |
| `script` field for future Katakana/Kanji reuse  | ✅  | design for extension |
| Katakana, Kanji decks                           | ⏳  |                      |
| Audio                                           | ⏳  |                      |

**Endpoints:** `/decks/hiragana`, `/cards/:id/progress`
**Entities:** `KanaChar`, `card_progress`

## 5. Vocabulary Flashcards ✅ [DONE]

| Feature                                                             | MVP | Notes                            |
| ------------------------------------------------------------------- | --- | -------------------------------- |
| Filter by lesson / "up to lesson N"                                 | ✅  |                                  |
| Picture + Japanese word (front), reading/meaning/POS/example (back) | ✅  | image required, audio slot empty |
| Know it / Still learning (Leitner)                                  | ✅  |                                  |
| Audio                                                               | ⏳  |                                  |

**Endpoints:** `/vocab?lesson=&upTo=`, `/cards/:id/progress`
**Entities:** `VocabItem`, `card_progress`

## 6. Grammar Patterns ✅ [DONE]

| Feature                                                           | MVP | Notes                                      |
| ----------------------------------------------------------------- | --- | ------------------------------------------ |
| List grouped by lesson                                            | ✅  |                                            |
| Pattern page: formula, explanation, 2–4 examples, common mistakes | ✅  | original content only — see agents.md §5.1 |
| Interactive grammar drills                                        | ⏳  |                                            |

**Endpoints:** `/grammar?lesson=`
**Entities:** `GrammarPattern`

## 7. Lesson Flow ("Start Learning") ✅ [DONE]

| Feature                                        | MVP | Notes                    |
| ---------------------------------------------- | --- | ------------------------ |
| 3-stage stepper (Vocab → Grammar → Practice)   | ✅  | progress saved per stage |
| Resume after logout/login                      | ✅  |                          |
| Complete at ≥70% practice score or manual skip | ✅  | threshold configurable   |
| Lesson unlock rules, streak-linked pacing      | ⏳  |                          |

**Endpoints:** `/lessons/:n`, `/lessons/:n/progress`
**Entities:** `lesson_progress`

## 8. Practice & Answer Evaluation ✅ [DONE]

| Feature                                                      | MVP | Notes                              |
| ------------------------------------------------------------ | --- | ---------------------------------- |
| Curated sentence bank, cumulative-vocab-constrained          | ✅  | tag-checked, see agents.md §5.3    |
| Transformation prompts (negative/past/question/substitution) | ✅  |                                    |
| English translation prompts                                  | ✅  |                                    |
| Text input + kana helper                                     | ✅  | IME assumed on device              |
| Attempt recording (answers, correctness, error tags, time)   | ✅  |                                    |
| Keyword-slot matcher for transformation                      | ✅  | deterministic                      |
| Fuzzy/keyword-slot matcher + LLM fallback for translation    | ✅  | fallback only when inconclusive    |
| "Report my answer was right" button                          | 🟡  | reduces false-negative frustration |
| Template-based sentence generation (supplement to bank)      | ⏳  |                                    |

**Endpoints:** `/practice/start`, `/practice/answer`
**Entities:** `SentenceItem`, `practice_sessions`, `attempts`

## 9. SWOT Analysis Engine

| Feature                                     | MVP | Notes                         |
| ------------------------------------------- | --- | ----------------------------- |
| Per-skill-tag accuracy rollup from attempts | ✅  |                               |
| 4-quadrant thresholds (config-driven)       | ✅  | see PRD §11                   |
| Session SWOT + 30-day overall SWOT          | ✅  |                               |
| Actionable item text + CTA links            | ✅  |                               |
| "Not enough data yet" state                 | ✅  | avoid guessing on sparse data |
| Trend tracking over time / charts           | ⏳  |                               |

**Endpoints:** `/practice/:id/swot`
**Entities:** `swot_reports`

## 10. Tests

| Feature                                                  | MVP | Notes |
| -------------------------------------------------------- | --- | ----- |
| Lesson test (10–15 Qs)                                   | 🟡  |       |
| Cumulative test                                          | 🟡  |       |
| Hiragana test                                            | 🟡  |       |
| MCQ, fill-blank, typed transformation, translation types | 🟡  |       |
| Timed, JLPT-style mock exams                             | ⏳  |       |

**Endpoints:** `/tests`, `/tests/:id/submit`
**Entities:** `Question`, `test_results`

## 11. Gamification (cross-cutting)

| Feature                                    | MVP | Notes                |
| ------------------------------------------ | --- | -------------------- |
| XP events (flashcard/practice/lesson/test) | ✅  | server-authoritative |
| Streaks + 1 weekly freeze                  | ✅  |                      |
| Lesson-complete reward screen              | ✅  |                      |
| Small badge set (5)                        | ✅  | see design.md §3.4   |
| Weakness / refresh missions (from SWOT)    | ✅  |                      |
| Daily goal ring                            | ✅  |                      |
| Full badge library                         | ⏳  |                      |
| Opt-in cohort leaderboards                 | ⏳  |                      |
| Cosmetic shop/currency                     | ⏳  |                      |

**Endpoints:** `/gamification/summary`, `/gamification/badges`, `/missions/:id/complete`
**Entities:** `user_xp`, `xp_events`, `streaks`, `badges`, `user_badges`, `missions`

## 12. Content Management (internal/admin) ✅ [DONE]

| Feature                                                     | MVP | Notes                                                |
| ----------------------------------------------------------- | --- | ---------------------------------------------------- |
| Versioned seed pipeline for lessons/vocab/grammar/sentences | ✅  | original content seed pipeline                       |
| 5 pilot lessons seeded                                      | ✅  | 39 vocab, 10 grammar, 9 practice drills, 104 kana    |
| Full-fledged Web CMS Studio for live content editing        | ✅  | `/cms` live UI to add/edit/delete all items directly |

**Endpoints:** `/api/admin/lessons`, `/api/admin/vocab`, `/api/admin/kana`, `/api/admin/grammar`, `/api/admin/sentences`, `/api/admin/reseed`
**Entities:** `Lesson`, `VocabItem`, `KanaChar`, `GrammarPattern`, `SentenceItem`

## 13. Settings & Account

| Feature                             | MVP | Notes              |
| ----------------------------------- | --- | ------------------ |
| Manual level/starting-lesson change | ✅  |                    |
| Notification preferences            | 🟡  |                    |
| Streak freeze count display         | ✅  |                    |
| Account deletion / export           | 🟡  | GDPR/APPI-friendly |
