# Data Model

## `profiles`

User display information linked to Supabase Auth.

## `closet_items`

Owned clothing items.

- `name`
- `category`
- `image_path`
- `colors`
- `notes`
- `tags`
- `ai_metadata`

## `inspiration_sources`

Taste inputs from Pinterest, screenshots, or notes.

- `type`
- `source_url`
- `image_path`
- `extracted_themes`
- `ai_summary`

## `style_profiles`

The user's consolidated aesthetic and preference layer.

- `themes`
- `preferred_colors`
- `avoided_items`
- `occasions`
- `notes`

## `outfits`

Generated and saved outfit ideas.

- `title`
- `closet_item_ids`
- `styling_notes`
- `occasions`
- `saved`
- `ai_rationale`

## Storage Buckets

- `closet-items`: private user clothing images.
- `inspiration`: private inspiration uploads.

Use signed URLs for display. Keep Pinterest external URLs as source references, but cache only metadata or user-uploaded screenshots unless the integration terms allow more.
