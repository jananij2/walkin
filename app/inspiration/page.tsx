import { ImagePlus, Plus, Sparkles } from "lucide-react";

const vibeTags = ["downtown cool", "soft layers", "butter yellow", "low-rise denim", "sleek boots"];

const inspoCards = [
  { title: "Oversized layers", color: "bg-[#8f896b]", tags: ["relaxed", "street"] },
  { title: "Soft going out", color: "bg-[#d8bdcd]", tags: ["feminine", "warm"] },
  { title: "Clean contrast", color: "bg-[#4a3b31]", tags: ["minimal", "sharp"] },
  { title: "Weekend polish", color: "bg-[#b8a195]", tags: ["casual", "styled"] }
];

export default function InspirationPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Inspo</p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">What are the vibes?</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl border bg-background/70 p-5 shadow-sm">
            <ImagePlus className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-lg font-black tracking-[0]">Upload inspo</h2>
            <button className="mt-4 flex min-h-40 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-[#d8fafa]/70 text-sm font-bold text-primary transition hover:bg-[#d7d5e7]/70">
              <ImagePlus className="h-4 w-4" />
              Add images
            </button>
          </div>

          <div className="rounded-2xl border bg-background/70 p-5 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-lg font-black tracking-[0]">It&apos;s giving</h2>
            <div className="mt-4 flex gap-2">
            <input
                className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="model off duty"
            />
              <button className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Add vibe">
                <Plus className="h-4 w-4" />
            </button>
          </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {vibeTags.map((tag) => (
                <span key={tag} className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  {tag}
                </span>
              ))}
            </div>
        </div>
        </aside>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {inspoCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-2xl border bg-background/70 shadow-sm">
                <div className={`photo-swatch aspect-[4/5] ${card.color}`} />
                <div className="p-4">
                  <h2 className="font-black tracking-[0]">{card.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border bg-[#d8fafa]/70 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Style read</p>
            <p className="mt-3 text-lg font-black leading-7">
              Soft color, sharp contrast, relaxed layers, and a little going-out energy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
