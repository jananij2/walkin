# Build Plan

## Phase 0: Foundation

- Create Next.js app shell with app routes.
- Configure Tailwind, Supabase clients, environment variables, and database migration.
- Define shared domain types.

## Phase 1: Digital Closet MVP

- Add Supabase Auth.
- Create image upload flow to Supabase Storage.
- Add closet item form with category, color, and notes.
- Render closet grid with filters.
- Add edit and delete item flows.

## Phase 2: Inspiration MVP

- Add Pinterest board URL capture.
- Add inspiration image upload.
- Store inspiration sources.
- Add AI style extraction and save extracted themes.
- Let users confirm or edit extracted themes.

## Phase 3: Outfit Generator MVP

- Create server action or API route for outfit generation.
- Pass closet items, style profile, and user constraints into the model.
- Validate structured outfit output with Zod.
- Store generated outfits.
- Add save/unsave and outfit detail views.

## Phase 4: Quality Loop

- Add feedback actions: like, dislike, too formal, too casual, not my style.
- Feed feedback into style profile updates.
- Add outfit regeneration with constraints.

## Phase 5: Post-MVP Shopping Suggestions

- Identify missing wardrobe pieces from repeated inspiration patterns.
- Rank gaps by how many existing closet items they unlock.
- Add product discovery integrations only after gap recommendations feel reliable.

## First Engineering Milestones

1. Authenticated app shell.
2. Working closet CRUD with image storage.
3. Inspiration source CRUD.
4. AI style profile extraction.
5. AI outfit generation with saved outfits.
