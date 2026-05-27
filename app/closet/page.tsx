import { ImagePlus, Plus, Shirt } from "lucide-react";
import { ClosetCategoryPicker } from "@/components/closet-category-picker";

const closetItems = [
  { name: "Cream baby tee", category: "Tops", vibe: "soft basic", color: "bg-[#d8fafa]" },
  { name: "Dark wash jeans", category: "Pants", vibe: "downtown", color: "bg-[#25364f]" },
  { name: "Black mini skirt", category: "Skirts", vibe: "going out", color: "bg-[#221520]" },
  { name: "Cherry shoulder bag", category: "Bags", vibe: "pop color", color: "bg-[#d8bdcd]" },
  { name: "Boxy jacket", category: "Outerwear", vibe: "layered", color: "bg-[#8f896b]" },
  { name: "Pointed boots", category: "Shoes", vibe: "sleek", color: "bg-[#392033]" }
];

export default function ClosetPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Closet</p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">What are we working with?</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border bg-background/70 p-5 shadow-sm">
          <Shirt className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-lg font-black tracking-[0]">New item</h2>
          <button className="mt-4 flex min-h-36 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-[#d8fafa]/70 text-sm font-bold text-primary transition hover:bg-[#d7d5e7]/70">
            <ImagePlus className="h-4 w-4" />
            Add closet item
          </button>
          <label className="mt-4 grid gap-2 text-sm font-bold">
            Category
            <ClosetCategoryPicker />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-bold">
            Tags
            <div className="flex gap-2">
              <input className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/30" placeholder="basics, fancy, vintage" />
              <button className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Add item tag">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </label>
        </aside>

        <div>
          <ClosetCategoryPicker />

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {closetItems.map((item) => (
              <article key={item.name} className="overflow-hidden rounded-2xl border bg-background/70 shadow-sm">
                <div className={`flex aspect-[4/5] items-center justify-center ${item.color}`}>
                  <Shirt className="h-10 w-10 text-white/75" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-black tracking-[0]">{item.name}</h2>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                      {item.vibe}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
