japanese-learning-app/
├── app/
│ ├── (auth)/
│ │ ├── login/page.tsx
│ │ ├── register/page.tsx
│ │ └── verify/page.tsx
│ ├── (app)/ # authenticated shell
│ │ ├── layout.tsx
│ │ ├── dashboard/page.tsx
│ │ ├── placement/page.tsx
│ │ ├── flashcards/
│ │ │ ├── hiragana/page.tsx
│ │ │ └── vocabulary/page.tsx
│ │ ├── grammar/page.tsx
│ │ ├── lessons/[lessonId]/page.tsx
│ │ ├── practice/[sessionId]/page.tsx
│ │ ├── tests/page.tsx
│ │ └── settings/page.tsx
│ └── api/
│ ├── auth/{register,login,verify,reset}/route.ts
│ ├── placement/{questions,submit}/route.ts
│ ├── decks/hiragana/route.ts
│ ├── vocab/route.ts
│ ├── cards/[id]/progress/route.ts
│ ├── grammar/route.ts
│ ├── lessons/route.ts
│ ├── lessons/[n]/route.ts
│ ├── lessons/[n]/progress/route.ts
│ ├── practice/start/route.ts
│ ├── practice/answer/route.ts
│ ├── practice/[id]/swot/route.ts
│ ├── tests/route.ts
│ ├── tests/[id]/submit/route.ts
│ ├── gamification/summary/route.ts
│ ├── gamification/badges/route.ts
│ └── missions/[id]/complete/route.ts
│
├── modules/
│ ├── auth/ {components,repositories,services,types,validations,utils}
│ ├── placement/ {components,repositories,services,types,validations}
│ ├── hiragana/ {components,repositories,services,types}
│ ├── vocabulary/ {components,repositories,services,types}
│ ├── grammar/ {components,repositories,services,types}
│ ├── lessons/ {components,repositories,services,types}
│ ├── practice/
│ │ ├── components/
│ │ ├── repositories/
│ │ ├── services/
│ │ │ ├── sentence-selector.ts
│ │ │ ├── transformation-evaluator.ts
│ │ │ └── translation-evaluator.ts # keyword-slot + LLM fallback
│ │ ├── types/
│ │ └── validations/
│ ├── swot/
│ │ ├── services/swot-calculator.ts
│ │ ├── repositories/
│ │ └── types/
│ ├── tests/ {components,repositories,services,types}
│ ├── gamification/
│ │ ├── components/
│ │ ├── repositories/
│ │ ├── services/
│ │ │ ├── xp-service.ts
│ │ │ ├── streak-service.ts
│ │ │ ├── badge-service.ts
│ │ │ └── mission-service.ts
│ │ ├── types/
│ │ └── validations/
│ ├── dashboard/ {components,services}
│ └── content/ # admin/seed tooling, no UI routes
│ ├── repositories/
│ ├── services/
│ └── seed/
│
├── db/
│ ├── schema/
│ │ ├── users.ts
│ │ ├── content.ts # lessons, vocab, kana, grammar, sentences, questions
│ │ ├── progress.ts # card_progress, lesson_progress
│ │ ├── practice.ts # practice_sessions, attempts
│ │ ├── swot.ts
│ │ ├── gamification.ts # user_xp, xp_events, streaks, badges, missions
│ │ └── index.ts
│ ├── migrations/
│ ├── client.ts # drizzle client
│ └── seed-data/ # versioned JSON, original content only
│ └── lessons/lesson-1/{vocab.json,grammar.json,sentences.json}
│
├── core/ # cross-module infra, no business logic
│ ├── auth/session.ts
│ ├── config/ # env, feature flags, SWOT thresholds
│ ├── email/
│ ├── storage/ # S3 client
│ ├── errors/
│ └── api-response.ts # shared { data, error } envelope
│
├── components/ # global/shared UI only
├── hooks/
├── lib/ # date/format/cn() etc.
├── types/ # global shared types
├── styles/
├── public/
├── tests/
│ ├── unit/
│ └── integration/
├── docs/
│ ├── PRD.md
│ ├── design.md
│ ├── agents.md
│ └── module-wise-feature.md
├── drizzle.config.ts
├── .env.example
├── package.json
└── tsconfig.json
