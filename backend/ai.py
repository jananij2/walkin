"""Walkin — Anthropic AI integration."""

import json
import os
from typing import Any

import anthropic

MODEL = "claude-sonnet-4-6"

# Preserved verbatim from lib/ai/prompts.ts
STYLE_PROFILE_PROMPT = """
You are Walkin, a personal styling assistant. Analyze the user's inspiration sources and return
concise style themes, preferred silhouettes, colors, recurring pieces, occasions, and avoided assumptions.
Keep the output practical enough to generate outfits from an existing closet.
"""

OUTFIT_GENERATOR_PROMPT = """
Generate wearable outfit options using only the provided closet items unless a section explicitly asks
for future shopping gaps. Prioritize realism, comfort, and repeatability over perfect aesthetic matching.
For each outfit, include title, item ids, styling notes, occasion tags, and why it matches the style profile.
"""

# JSON schema for the generate_lookbook tool — matches the shape the frontend expects exactly.
_LOOKBOOK_TOOL_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "looks": {
            "type": "array",
            "description": "Between 1 and 5 outfit looks.",
            "items": {
                "type": "object",
                "properties": {
                    "title":           {"type": "string"},
                    "styleTag":        {"type": "string"},
                    "topItemId":       {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "bottomItemId":    {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "dressItemId":     {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "shoeItemId":      {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "layerItemId":     {"anyOf": [{"type": "string"}, {"type": "null"}]},
                    "accessoryItemIds": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Up to 3 accessory item ids."
                    },
                    "stylingNote": {"type": "string"}
                },
                "required": [
                    "title", "styleTag",
                    "topItemId", "bottomItemId", "dressItemId",
                    "shoeItemId", "layerItemId",
                    "accessoryItemIds", "stylingNote"
                ]
            }
        }
    },
    "required": ["looks"]
}


def _get_client() -> anthropic.Anthropic | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    return anthropic.Anthropic(api_key=api_key)


def generate_lookbook(closet_items: list[dict], inspo_tags: list[str]) -> dict[str, Any]:
    """
    Generate outfit looks from closet items and inspo tags.

    Returns {"looks": [...]} matching the frontend's expected shape.
    Raises RuntimeError if the API key is missing.
    Raises anthropic.APIError (or subclass) on API failures.
    """
    client = _get_client()
    if client is None:
        raise RuntimeError("Missing ANTHROPIC_API_KEY.")

    system_message = (
        "You are Walkin, a personal stylist. Create realistic, wearable outfit recommendations "
        "using only the provided closet item ids. Do not invent clothing. "
        "Each outfit must make sense as something a person can actually wear."
    )

    user_content = json.dumps({
        "closetItems": closet_items,
        "inspoTags": inspo_tags,
        "instructions": (
            "Generate 3 to 5 outfits. Each outfit needs either: "
            "topItemId + bottomItemId + shoeItemId, OR dressItemId + shoeItemId. "
            "Never use two tops, two bottoms, or both a dress and a top/bottom combination. "
            "layerItemId and accessoryItemIds are optional. "
            "Use only ids from closetItems. "
            "If shoes are missing from the closet, shoeItemId may be null, "
            "but mention that in the styling note. "
            "styleTag should be casual and useful, like casual brunch, going out, "
            "class fit, coffee run, or dinner."
        )
    })

    response = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=system_message,
        messages=[{"role": "user", "content": user_content}],
        tools=[{
            "name": "generate_lookbook",
            "description": "Return outfit look recommendations as structured JSON.",
            "input_schema": _LOOKBOOK_TOOL_SCHEMA
        }],
        tool_choice={"type": "tool", "name": "generate_lookbook"}
    )

    tool_block = next((b for b in response.content if b.type == "tool_use"), None)
    if tool_block is None:
        raise RuntimeError("AI did not return a structured response.")

    return tool_block.input
