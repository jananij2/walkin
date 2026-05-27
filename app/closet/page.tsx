import { Plus, Shirt } from "lucide-react";

const categories = ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories"];

export default function ClosetPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0]">Closet</h1>
          <p className="mt-2 text-muted-foreground">Add the pieces Walkin can style from.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" />
          Add item
        </button>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button key={category} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">
            {category}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-background p-4">
            <div className="flex aspect-[4/5] items-center justify-center rounded-md bg-muted">
              <Shirt className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}
