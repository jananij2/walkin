# AI Workflows

## Closet Item Enrichment

MVP starts manual. Add AI enrichment after upload once the basic CRUD flow is reliable.

Input:

- Clothing image
- Optional user category, color, notes

Output:

- Category suggestion
- Color palette
- Style tags
- Occasion tags
- Confidence score

## Inspiration Analysis

Input:

- Pinterest board URL metadata when available
- Uploaded screenshots or reference images
- Optional user notes

Output:

- Aesthetic themes
- Common colors
- Silhouettes
- Styling patterns
- Occasions
- Items the user repeatedly saves

## Outfit Generation

Input:

- Closet item list
- Style profile
- Occasion or weather constraints when available
- User feedback history

Output:

- 3 to 6 outfits
- Item ids for each outfit
- Styling notes
- Occasion tags
- Rationale

Guardrail: generated outfits must use only owned closet item ids unless explicitly generating shopping gaps.
