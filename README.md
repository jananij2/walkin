# Walkin

Walkin is an AI-powered personal styling assistant that turns a user's real closet into outfit ideas inspired by the styles they save.

## MVP Shape

- Digital closet: upload clothing photos, manually categorize items, add optional colors and notes.
- Inspiration capture: paste Pinterest board links or upload inspiration screenshots.
- Style profile: extract aesthetic themes from inspiration sources.
- Outfit generator: combine closet items and style profile into realistic outfit options.
- Saved outfits: keep favorite generated looks.

## Stack

- Next.js, React, TypeScript
- Tailwind CSS with shadcn/ui-compatible conventions
- Supabase Auth, Postgres, Storage
- OpenAI vision and language models
- Pinterest board links for MVP, Pinterest API later

## Project Map

- `app/`: Next.js App Router pages and workflows.
- `components/`: shared UI and feature components.
- `lib/types/`: domain types for closet items, inspiration, style profiles, and outfits.
- `lib/supabase/`: browser and server Supabase clients.
- `lib/ai/`: prompt boundaries and future OpenAI orchestration.
- `supabase/migrations/`: database schema and row-level security policies.
- `docs/`: product, architecture, and build planning notes.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add Supabase and OpenAI keys to `.env.local`.

4. Run the app:

```bash
npm run dev
```
