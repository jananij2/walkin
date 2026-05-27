# Architecture

## Product Boundary

Walkin should feel like a stylist first and a closet database second. The MVP keeps data entry lightweight, makes the closet visible quickly, and uses AI only where it reduces cognitive load.

## Core Domains

### Closet

Stores the user's owned items. MVP fields are intentionally simple: image, name, category, colors, notes, and tags. Future automation can enrich the same records with recognition, background removal, color extraction, season, occasion, and style metadata.

### Inspiration

Stores sources that represent taste: Pinterest board links, screenshots, uploaded reference images, and later connected Pinterest API data. Each source can produce extracted themes and a short AI summary.

### Style Profile

The normalized taste layer derived from inspiration and explicit preferences. It should be stable enough to reuse across outfit generation instead of re-analyzing every image on every request.

### Outfits

Generated combinations of closet items. Each outfit stores item ids, notes, occasions, save state, and an optional rationale so users can understand why it works.

## Data Flow

1. User adds closet items.
2. Images are stored in Supabase Storage.
3. Item metadata is stored in `closet_items`.
4. User adds inspiration sources.
5. AI extracts themes into `inspiration_sources` and updates `style_profiles`.
6. Outfit generation reads `closet_items` and `style_profiles`.
7. Generated outfits are stored in `outfits` and can be saved.

## AI Boundaries

Keep AI calls behind narrow server-side functions:

- `analyzeClosetItem(image, manualFields)`: returns category, colors, tags, confidence.
- `analyzeInspirationSource(source)`: returns themes, silhouettes, colors, motifs, occasions.
- `generateOutfits(closetItems, styleProfile, constraints)`: returns structured outfit candidates.
- `identifyWardrobeGaps(closetItems, styleProfile)`: post-MVP shopping suggestions.

All AI outputs should be parsed with schemas before being written to the database.
