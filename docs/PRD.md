# PRD — Japanese Learning Web App

**Version:** 0.1 (MVP) · **Status:** Draft

---

## 1. Product Summary

A web app that teaches Japanese to English speakers, following the *lesson order* of Minna no Nihongo (original content, see §8 licensing). Users register, take a placement quiz, then use free study tools (Hiragana/Vocabulary flashcards, Grammar reference, Tests) or a guided path ("Start Learning") that runs Vocabulary → Grammar → Practice per lesson. Practice attempts feed a SWOT report that tells the learner what to focus on next.

## 2. Problem Statement

Self-studiers using a textbook get no feedback loop — they don't know what they're actually weak at until a test fails. Existing apps (Duolingo-style) gamify vocabulary but don't map to a structured textbook syllabus or give diagnostic feedback tied to grammar/error categories.

## 3. Target Users

- Adult beginners, JLPT N5 → N4 level.
- Self-studying, or using Minna no Nihongo alongside a class and wanting extra practice + diagnostics.
- Primarily mobile-web usage (studying on phones), some desktop.

## 4. Goals

- New user signs up and starts studying in **< 3 minutes**.
- Complete guided lesson loop: Vocabulary → Grammar → Practice → Feedback.
- Cumulative vocabulary reinforcement across lessons.
- Actionable SWOT feedback, not just a score.
- (See design.md) A gamification layer that keeps users returning without gaming the SWOT signal.

## 5. Non-Goals (MVP)

Audio/pronunciation, Katakana/Kanji flashcards, speech input, social features, payments, native mobile apps, offline mode.

## 6. User Stories

| # | Story | Priority |
|---|-------|----------|
| 1 | As a new user, I can register with email and verify it, so I can access the app. | P0 |
| 2 | As a new user, I can take a placement quiz so the app suggests a starting lesson. | P0 |
| 3 | As a learner, I can study Hiragana with flashcards and mark cards as known/learning. | P0 |
| 4 | As a learner, I can browse vocabulary by lesson and see meaning, reading, example. | P0 |
| 5 | As a learner, I can read grammar patterns with explanation and examples. | P0 |
| 6 | As a learner, I can go through a full lesson (vocab → grammar → practice) and resume where I left off. | P0 |
| 7 | As a learner, I answer practice sentences (transformation + translation) and get instant correctness feedback. | P0 |
| 8 | As a learner, after a practice session I see a SWOT report explaining strengths/weaknesses with next actions. | P0 |
| 9 | As a learner, I can take lesson/cumulative/Hiragana tests. | P1 |
| 10 | As a learner, I earn XP/streaks and see progress visualized, so I stay motivated. | P1 |
| 11 | As a learner, if I disagree with a marked-wrong translation, I can report it. | P1 |
| 12 | As a user, I can change my level/starting lesson manually from Settings. | P1 |
| 13 | As a user, I can delete my account and export my data. | P1 |

## 7. Feature Prioritization

- **P0 (MVP launch-blocking):** Auth, Placement, Hiragana + Vocab flashcards, Grammar viewer, Lesson stepper, Practice + evaluation, SWOT report.
- **P1 (MVP-adjacent, ship if time allows):** Tests, basic gamification (XP, streaks, lesson-complete rewards), answer-dispute reporting, manual level override.
- **P2 (post-MVP):** Audio, Katakana/Kanji, spaced-repetition review queue, SWOT trend charts, leaderboards, JLPT mock exams, mobile apps, premium plan.

## 8. Content & Licensing (Blocking Risk)

Minna no Nihongo is copyrighted (3A Corporation). The product may use its **lesson order and grammar topic sequence only**. All vocabulary lists, example sentences, explanations, and images must be **original** or independently licensed. This must be resolved/confirmed before public launch — see agents.md for the hard rule agents must follow when generating content.

## 9. Success Metrics

- Registration → placement completed: ≥ 70%
- Users completing Lesson 1 within 7 days: ≥ 40%
- Practice accuracy trend improves across a user's first 3 lessons
- Day-7 retention: ≥ 25%
- SWOT report open rate: ≥ 60%

## 10. Assumptions & Open Questions

- Content will be written originally (not copied from the textbook) — confirm before content production starts.
- MVP ships with Lessons 1–5 as pilot content.
- Web-only for MVP; no paid plan at launch.
- Placement quiz is self-assessment + a few graded MCQs, not a full adaptive test.

## 11. Risks

| Risk | Mitigation |
|------|------------|
| Copyright exposure | Original content only; legal review before public launch |
| Content production is the biggest workload | Start with 2 pilot lessons, build tooling/seed format early |
| Translation grading false negatives | Keyword-slot + LLM fallback; "report my answer" button |
| Placement quiz inaccuracy | Always allow manual override |
| Gamification undermining SWOT honesty | See design.md — rewards must never require "gaming" an answer |

## 12. Phases / Timeline

1. **MVP:** Auth, placement, content schema + 2 pilot lessons, flashcard engine, grammar viewer, lesson stepper, practice + evaluation, SWOT engine.
2. **v1.1:** Audio, Katakana, streaks/reminders, remaining tests.
3. **v1.2:** Kanji decks, spaced-repetition queue, SWOT trend charts, fuller gamification.
4. **v2:** Speaking/listening practice, JLPT mocks, mobile apps, premium plan.

*(Full functional/technical detail lives in the original MVP tech doc, module-wise-feature.md, and design.md.)*
