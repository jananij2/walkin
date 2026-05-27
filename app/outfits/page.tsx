import { Heart, Sparkles } from "lucide-react";

export default function OutfitsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0]">Outfits</h1>
          <p className="mt-2 text-muted-foreground">Generate looks from your closet and saved style.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          Generate
        </button>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {["Layered neutral day", "Casual coffee fit", "Soft tailored dinner"].map((title) => (
          <article key={title} className="rounded-lg border bg-background p-5">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="aspect-[3/4] rounded-md bg-muted" />
              ))}
            </div>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold tracking-[0]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Built from closet pieces with styling notes and occasion fit.
                </p>
              </div>
              <button className="rounded-md border p-2 hover:bg-muted" aria-label="Save outfit">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
