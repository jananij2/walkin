# App Routes

## MVP Routes

- `/`: product workflow overview and entry points.
- `/closet`: closet grid, filters, item creation.
- `/closet/[itemId]`: item detail and edit flow.
- `/inspiration`: Pinterest URL and image upload.
- `/outfits`: generate and browse outfits.
- `/outfits/[outfitId]`: outfit detail, save, feedback.
- `/profile`: style profile, preferences, account settings.

## API / Server Actions

- `createClosetItem`
- `updateClosetItem`
- `deleteClosetItem`
- `createInspirationSource`
- `analyzeInspiration`
- `generateOutfits`
- `saveOutfit`
- `submitOutfitFeedback`

Prefer server actions for authenticated mutations that are tightly coupled to the UI. Use route handlers for webhook-like integrations, long-running AI jobs, and external callbacks.
