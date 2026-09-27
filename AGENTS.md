# AGENTS.md

Instructions for AI coding agents (Antigravity, Claude Code, Cursor, Copilot, etc.) working in this repository. Read this fully before making changes. Also read `PRD.md`, `design.md`, and `module-wise-feature.md` for product context.

## 1. Project

Japanese Learning Web App — teaches Japanese to English speakers using a Minna-no-Nihongo-style lesson sequence (original content, see §5). Guided lesson loop: Vocabulary → Grammar → Practice → SWOT feedback, plus free-study flashcards/grammar/tests and a gamification layer.

## 2. Tech Stack

- **Frontend:** React (Next.js), TypeScript, Tailwind CSS. Mobile-first, responsive.
- **Backend:** Node.js — NestJS or Express (pick one and stay consistent; do not mix).
- **Database:** PostgreSQL.
- **Auth:** Email + password (bcrypt/argon2) + email verification, or a managed provider (Supabase Auth/Auth0) — do not build a custom auth system from scratch if a managed option is already wired in.
- **File storage:** S3-compatible bucket + CDN for vocabulary images.
- **Email:** Transactional provider (SES/Postmark/Resend).
- **Hosting:** Vercel (frontend) + managed Postgres, or equivalent.

## 3. Repo Structure (target)

```
/apps
  /web            # Next.js app
  /api            # backend service (if separate from Next API routes)
/packages
  /db             # schema, migrations, seed scripts
  /content        # lesson/vocab/grammar/sentence-bank seed data (JSON/CSV)
  /shared         # shared TS types (content model, API contracts)
/docs
  PRD.md
  design.md
  agents.md
  module-wise-feature.md
```

## 4. Commands

Define and keep these working at all times (fill in real scripts as the project scaffolds):

```
pnpm install          # install deps
pnpm dev              # run web + api locally
pnpm db:migrate       # run migrations
pnpm db:seed          # seed lessons/vocab/grammar/kana + 2 pilot lessons
pnpm test             # unit + integration tests
pnpm lint             # eslint + typecheck
```

An agent must run lint + test before considering a task done. If a command doesn't exist yet, create it rather than skipping verification.

## 5. Hard Rules (non-negotiable)

1. **Copyright.** Never copy vocabulary lists, example sentences, grammar explanations, or images from *Minna no Nihongo* or any other copyrighted textbook into seed content, code comments, or docs. Only the **lesson-order / grammar-topic sequence** may be referenced as a syllabus outline. All actual content (words, sentences, explanations) must be written originally. If asked to "port" or "digitize" textbook content, refuse and write original content covering the same grammar point instead.
2. **XP/streak/mission state is server-authoritative.** Never accept a client-supplied XP amount, streak count, or "mission complete" flag without server-side recomputation from the underlying event (see `design.md` §5).
3. **Practice sentences are cumulative-vocabulary-constrained.** Any sentence in `SentenceItem` must only use vocabulary from Lessons 1..N and grammar from Lesson N — enforce this with a tag check, not by convention.
4. **SWOT thresholds live in config, not hardcoded.** Accuracy thresholds (80%/60%/etc.) must be adjustable without a code change.
5. **No dark patterns.** No shaming copy on broken streaks, no pay-to-skip-practice, no public accuracy leaderboards (see `design.md` §7).
6. **Follow the content schema** in `module-wise-feature.md` / the original MVP doc's §7–8 exactly (Lesson, VocabItem, KanaChar, GrammarPattern, SentenceItem, Question) — don't invent parallel schemas.

## 6. Conventions

- TypeScript strict mode everywhere.
- One module = one directory with its own components/hooks/services/types; don't spread one feature across unrelated folders.
- API responses: JSON, consistent envelope (`{ data, error }` or equivalent — pick one at project start and don't deviate).
- Migrations: additive and reversible; never edit a migration that has already been applied to a shared environment.
- Commit messages: `<module>: <what changed>` (e.g., `practice: add error-tag capture on submit`).

## 7. Testing Expectations

- Unit tests for: answer evaluation logic (transformation matcher, keyword-slot translation matcher), SWOT threshold calculations, XP/streak calculations.
- Integration test for the full lesson flow: vocab → grammar → practice → lesson marked complete.
- Do not merge answer-evaluation changes without a test covering at least one accepted-variant case and one rejected case per error category.

## 8. When Unsure

If a task requires a product decision not covered in `PRD.md` (e.g., new feature scope, pricing, licensing terms), stop and flag it rather than guessing — these are listed as open questions in `PRD.md` §10.
