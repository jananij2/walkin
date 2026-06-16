import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const ClosetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string(),
  tags: z.array(z.string())
});

const RequestSchema = z.object({
  closetItems: z.array(ClosetItemSchema).min(1),
  inspoTags: z.array(z.string()).default([])
});

const LookbookResponseSchema = z.object({
  looks: z.array(
    z.object({
      title: z.string(),
      styleTag: z.string(),
      topItemId: z.string().nullable(),
      bottomItemId: z.string().nullable(),
      dressItemId: z.string().nullable(),
      shoeItemId: z.string().nullable(),
      layerItemId: z.string().nullable(),
      accessoryItemIds: z.array(z.string()).max(3),
      stylingNote: z.string()
    })
  ).min(1).max(5)
});

const lookbookJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["looks"],
  properties: {
    looks: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "styleTag",
          "topItemId",
          "bottomItemId",
          "dressItemId",
          "shoeItemId",
          "layerItemId",
          "accessoryItemIds",
          "stylingNote"
        ],
        properties: {
          title: { type: "string" },
          styleTag: { type: "string" },
          topItemId: { type: ["string", "null"] },
          bottomItemId: { type: ["string", "null"] },
          dressItemId: { type: ["string", "null"] },
          shoeItemId: { type: ["string", "null"] },
          layerItemId: { type: ["string", "null"] },
          accessoryItemIds: {
            type: "array",
            maxItems: 3,
            items: { type: "string" }
          },
          stylingNote: { type: "string" }
        }
      }
    }
  }
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in .env.local." },
        { status: 503 }
      );
    }

    const body = RequestSchema.safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json({ error: "Invalid lookbook request." }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "You are Walkin, a personal stylist. Create realistic, wearable outfit recommendations using only the provided closet item ids. Do not invent clothing. Each outfit must make sense as something a person can actually wear."
        },
        {
          role: "user",
          content: JSON.stringify({
            closetItems: body.data.closetItems,
            inspoTags: body.data.inspoTags,
            instructions:
              "Generate 3 to 5 outfits. Each outfit needs either: topItemId + bottomItemId + shoeItemId, OR dressItemId + shoeItemId. Never use two tops, two bottoms, or both a dress and a top/bottom combination. layerItemId and accessoryItemIds are optional. Use only ids from closetItems. If shoes are missing from the closet, shoeItemId may be null, but mention that in the styling note. styleTag should be casual and useful, like casual brunch, going out, class fit, coffee run, or dinner."
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "walkin_lookbook",
          strict: true,
          schema: lookbookJsonSchema
        }
      }
    });

    const parsed = LookbookResponseSchema.safeParse(JSON.parse(response.output_text));

    if (!parsed.success) {
      return NextResponse.json({ error: "AI returned an invalid lookbook." }, { status: 502 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate lookbook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
