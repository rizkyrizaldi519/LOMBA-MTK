# Lomba Matematika — Rebuilt Public Site (Phase 1)

A full front-end rebuild of the public marketing site, replacing the single
duel-game page with a complete premium site plus a rebuilt version of the
duel game itself. **This phase is static HTML/CSS/JS — no backend, no
database, no accounts, no payments yet.** See "What's next" below.

## What's in this folder

```
lomba-matematika/
├── index.html          All 25 requested sections (hero, countdown, why-us,
│                        categories, timeline, steps, prizes, benefits, demo,
│                        hall of fame, achievements, testimonials, teachers,
│                        committee, gallery, video, news, blog, sponsors,
│                        partners, FAQ, newsletter, contact, footer)
├── quiz.html            The rebuilt 2-player local duel game (same format
│                        as the original site: Player 1 uses the keyboard,
│                        Player 2 uses the on-screen keypad)
├── css/
│   ├── main.css          Design tokens + all marketing-site section styles
│   └── quiz.css          Game-specific styles
├── js/
│   ├── main.js            Theme switcher, scroll reveal, counters, countdown,
│   │                      FAQ accordion, testimonial slider, nav, forms
│   ├── i18n.js             ID/EN language switcher (top-right nav button)
│   └── quiz.js             Duel game engine (question generation, scoring,
│                          history, results)
└── README.md
```

## How to preview it

Just open `index.html` in a browser — everything is static, no build step,
no dependencies to install. To deploy, drag the whole folder into Netlify
(or push it to the repo backing your existing
`lombamatematika.netlify.app` site).

## What's real vs. what's a placeholder

**Real and working:** theme switcher (light/dark, persisted), language
switcher (ID/EN, persisted), scroll animations, animated counters, live
countdown timer, FAQ accordion, testimonial carousel, mobile navigation,
the full duel game (question generation, scoring, per-question history,
win/tie screen).

**Placeholders you'll want to replace:** all copy about specific dates,
prize amounts, committee names, testimonials, sponsor names, and news posts
is realistic sample content, not real data. Newsletter/contact forms show a
success toast but don't send anywhere yet — no backend is wired up. Gallery
tiles and news/blog thumbnails are gradient placeholders — swap in real
photos.

## What's next (not built in this phase)

The original brief also asked for participant/jury/admin dashboards,
authentication, payments, and a live database. That's a genuinely separate
build — here's what you'd need before I can make it real rather than mocked:

| Piece | What you need | Why |
|---|---|---|
| **Database** (users, registrations, scores, certificates) | A Supabase or Firebase project (free tier is fine to start) | Static HTML can't store data — everything needs a real backend project |
| **Authentication** (participant/jury/admin login, Google login) | Firebase Auth (or Supabase Auth) enabled on that project | Handles password hashing, sessions, JWTs securely — don't roll this by hand |
| **File uploads** (photos, student cards, payment proof) | A Cloudinary account (free tier available) | Static hosting has nowhere to durably store uploaded files |
| **Payments** (QRIS, manual transfer, invoices) | A Midtrans or Xendit merchant account (business verification required) | Real payment processing needs a licensed payment gateway — this can't be simulated |
| **Certificates/notifications** | Same Supabase/Firebase project, plus an email provider (e.g. Resend or SendGrid) | For sending verification emails, receipts, certificate links |

Once you have (or want help setting up) any of these, I can build the
matching piece — e.g. the Express API + SQL schema, the Firebase Auth flow,
or the participant dashboard against mock data first so the UI is ready
before the backend is wired in. Given the size of the full brief, I'd
suggest tackling it in this order: **auth + participant registration →
payments → admin dashboard → jury/scoring system** — each is independently
useful and deployable on its own.
