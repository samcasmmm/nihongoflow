# design.md — Visual Design System + Gamification Layer

Two parts: **Part 1** is the visual language ("Kitsune" brand) established by the landing page. **Part 2** is the gamification mechanics spec (XP/streaks/missions) that the product runs on. Both apply across web app + marketing site.

---

# Part 1 — Visual Design System

## 1. Brand

- **Name:** Kitsune (🦊) — fox mascot, ties to Japanese folklore.
- **Personality:** Duolingo's playful confidence + a modern dark-glow SaaS aesthetic (Aceternity-style). Chunky, tactile, a little irreverent — never corporate-flat.

## 2. Color Tokens

| Token      | Dark (default)          | Light             | Use                    |
| ---------- | ----------------------- | ----------------- | ---------------------- |
| `--bg`     | `#0a0a0f`               | `#fdfdfb`         | page background        |
| `--bg2`    | `#0f0f17`               | `#f6f6f2`         | section alt background |
| `--panel`  | `#14141f`               | `#ffffff`         | cards                  |
| `--panel2` | `#181826`               | `#f8f8f5`         | chips                  |
| `--text`   | `#f5f5f7`               | `#16161f`         | body text              |
| `--muted`  | `#9a9aa8`               | `#6b6b76`         | secondary text         |
| `--border` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.08)` | hairlines              |

Accents (fixed across themes):
`--green #58cc02` (primary/CTA), `--green-dk #46a302` (button shadow), `--blue #1cb0f6`, `--purple #ce82ff`, `--orange #ff9600`, `--red #ff4b4b`.

Theme resolution: `prefers-color-scheme` by default, overridable via `data-theme="dark"|"light"` on `:root` (matches the artifact authoring convention already used in the landing page).

## 3. Typography

- **Display/headings:** `Baloo 2` (700/800) — rounded, playful, high-legibility at large sizes. Used for `h1–h3`, nav brand, buttons.
- **Body/UI:** `Inter` (400–700) — everything else.
- Headline sizing: `text-4xl md:text-6xl` hero, `text-3xl md:text-4xl` section headers, `font-extrabold`.
- Gradient headline treatment (`glow-text`): 90° gradient green → blue → purple, `background-clip: text`, reserved for **one** phrase per page max — overuse kills the effect.

## 4. Core Components

### Chunky button (Duolingo signature)

Flat fill + solid bottom "shadow" that collapses on press:

```css
.chunky-btn {
  box-shadow: 0 4px 0 var(--green-dk);
  transition:
    transform 0.08s,
    box-shadow 0.08s;
}
.chunky-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--green-dk);
}
```

Primary = green fill/white text. Outline variant uses `--border` as the shadow color and `--panel` fill. Always `rounded-xl`/`rounded-2xl`, never sharp corners.

### Bento card (Aceternity signature)

`rounded-1.25rem` panel, 1px border, radial glow layer that fades in on hover (`--card-glow` set per-card to an accent color) and a `translateY(-4px)` lift:

```css
.bento {
  border-radius: 1.25rem;
  transition:
    transform 0.2s,
    border-color 0.2s;
}
.bento:hover {
  transform: translateY(-4px);
  border-color: var(--card-glow);
}
```

Used for feature grids, stat cards, CTA panels. One accent color per card, cycled across green/blue/purple/orange/red — never repeat adjacent cards.

### Meteors + grid-fade hero background

Decorative only, hero sections exclusively: a faint dot/line grid masked to a radial ellipse, plus 2–3 diagonal streak elements on independent `animation-delay`s so they don't sync. Keep to ≤3 meteors — more reads as noisy, not premium.

### Chips

Small pill, `--panel2` fill + `--border` outline, used for stat callouts and nav badges ("🔥 12-day streak" style).

### Floating stat card

`animation: float 5s ease-in-out infinite` (±10px translateY) — used sparingly (one per hero) to hint at product state (XP bar, streak) without a screenshot.

## 5. Spacing & Layout

- Max content width `max-w-6xl` (marketing), `max-w-5xl` (content-dense sections).
- Section vertical rhythm: `py-24` desktop sections, `py-16` mobile-dense ones.
- Grid: 3-column bento on desktop, 1-column stack on mobile (`grid md:grid-cols-3`).

## 6. Motion Rules

- Hover/press transitions: `.08s–.3s` ease only — nothing slower on interactive elements (keeps the "snappy" Duolingo feel).
- Ambient motion (float, meteors) is the only thing allowed to run continuously; everything else is trigger-based (hover/click).
- Respect `prefers-reduced-motion` in the real app build (not yet wired into the static landing page — add when porting to Next.js).

## 7. From Static Page → Next.js/shadcn/Aceternity

The landing page is a static, dependency-free HTML file (Tailwind Play CDN + hand-rolled CSS) because published artifacts can't run npm installs. When this gets built into the actual Next.js app:

- Swap chunky buttons → shadcn `Button` with a custom `chunky` variant (the `box-shadow`/`:active` rule above ports directly into a CVA variant).
- Swap bento cards → shadcn `Card` + Aceternity's `CardSpotlight` / `GlowingStarsBackgroundCard` for the real hover-glow (mouse-tracked, not just CSS `:hover`).
- Swap the CSS meteor streaks → Aceternity's `Meteors` component (same visual idea, properly randomized + reduced-motion aware).
- Keep the color tokens, font pairing, and spacing scale as-is — define them once in `tailwind.config.ts` so shadcn/Aceternity components inherit the Kitsune theme automatically instead of their stock defaults.

---

# Part 2 — Gamification Layer

**Scope:** How gamification wraps around the lesson/practice/SWOT loop without corrupting the SWOT signal (SWOT must stay an honest diagnostic, not a game stat to farm).

## 8. Design Principle

> Reward _effort and consistency_, not _correctness inflation_.

XP and streaks track behavior (showed up, practiced); SWOT tracks skill (is it actually improving). Never let a gamification mechanic change what counts as a correct answer, hide a weakness, or let users buy/skip past a diagnosed weak area.

## 9. Core Loop

```
Open app → Continue lesson / Practice → Earn XP + streak tick
   → Session ends → SWOT updates → "Missions" generated from Weaknesses
   → Dashboard shows next best action
```

## 10. Mechanics (M = MVP, L = Later)

- **XP & Levels (M):** flashcard reviewed (1), practice item (2–5 by difficulty), lesson stage (10), lesson complete (25), test (15). Capped per unique item/day to block farming. Level = cosmetic (`floor(sqrt(XP/50))`).
- **Streaks (M):** 1 tick/day with ≥1 completed practice item or flashcard session. One free weekly freeze. No shame copy on break.
- **Lesson-Complete Rewards (M):** reward screen at ≥70% practice score — XP total, badge if unlocked, top SWOT weakness + "Practice 5 more" CTA.
- **Badges (M small set / L full set):** First Steps, Kana Master, Lesson 1 Clear, 5-Day Streak, Comeback (positive framing on returning after a gap).
- **Weakness Missions (M):** auto-generated from SWOT Weaknesses quadrant; self-clears when the tag exits Weaknesses.
- **Daily Goal (M):** soft target (e.g. 10 XP), progress ring, no penalty for missing it.
- **Decay/Refresh Nudges (M):** gentle mission when SWOT's Threats quadrant flags decaying old material.
- **Leaderboards (L):** opt-in, cohort-based, ranked by _consistency_ not raw accuracy — no public shaming.
- **Currency/Shop (L):** cosmetic-only, never pay-to-skip-practice.

## 11. Data Model Additions

| Table         | Fields                                                                       |
| ------------- | ---------------------------------------------------------------------------- |
| `user_xp`     | user_id, total_xp, level, updated_at                                         |
| `xp_events`   | id, user_id, source_type, source_id, amount, created_at                      |
| `streaks`     | user_id, current_streak, longest_streak, last_active_date, freezes_available |
| `badges`      | id, code, name, description, icon                                            |
| `user_badges` | user_id, badge_id, earned_at                                                 |
| `missions`    | id, user_id, type (weakness/refresh), tag, status, created_at, cleared_at    |

## 12. API Additions

| Method | Endpoint                  | Purpose                                                |
| ------ | ------------------------- | ------------------------------------------------------ |
| GET    | `/gamification/summary`   | XP, level, streak, active missions for dashboard       |
| POST   | `/gamification/xp-events` | Internal only — services call it, not client-writable  |
| GET    | `/gamification/badges`    | All badges + earned state                              |
| POST   | `/missions/:id/complete`  | Server re-validates against SWOT, never client-trusted |

**Security:** XP/streak/mission state is server-authoritative. Never accept an XP amount from the client.

## 13. UI Touchpoints (mapped to Part 1 components)

- Dashboard header: streak chip + XP bar (bento card style).
- Lesson-complete screen: XP earned + badge (chunky-button CTA to weakness mission).
- Flashcard session end: small XP toast, no interruption.
- Settings: streak freeze count, notification preferences.

## 14. Anti-Patterns to Avoid

- No timers on practice by default (protects SWOT data quality).
- No content gated behind gamification currency.
- No public accuracy leaderboards — consistency-based, opt-in only.
- No shaming copy or scare-tactic re-engagement on a broken streak.

## 15. Rollout

- MVP ships §10's "M" items (XP, streaks, lesson rewards, small badge set, weakness/refresh missions, daily goal).
- v1.1+: full badge set, richer streak mechanics.
- v2: opt-in cohort leaderboards, cosmetic shop.
