import { Bookmark, Heart, Sparkles } from "lucide-react";

const looks = [
  {
    title: "Cool girl basics",
    pieces: ["Cream baby tee", "Dark wash jeans", "Pointed boots", "Cherry shoulder bag"],
    note: "Easy staples with a sharper shoe and a soft pop of color.",
    board: "Everyday"
  },
  {
    title: "Soft going out",
    pieces: ["Black mini skirt", "Boxy jacket", "Pointed boots", "Cherry shoulder bag"],
    note: "Balanced mini silhouette with an easy layer.",
    board: "Going Out"
  },
  {
    title: "Weekend polish",
    pieces: ["Cream baby tee", "Boxy jacket", "Dark wash jeans"],
    note: "Relaxed base with a styled outer layer.",
    board: "Saved"
  }
];

const boards = ["All Lookbook", "Everyday", "Going Out", "Class", "Vacation"];

export default function OutfitsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Lookbook</p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">Styled for you.</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          Refresh lookbook
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {boards.map((board) => (
          <button key={board} className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-2 text-sm font-bold hover:bg-muted">
            <Bookmark className="h-4 w-4 text-primary" />
            {board}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {looks.map((look) => (
          <article key={look.title} className="rounded-2xl border bg-background/70 p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {look.pieces.map((piece, index) => (
                <div
                  key={piece}
                  className={`flex aspect-[4/5] items-end rounded-xl p-3 text-xs font-black text-white ${
                    index === 0
                      ? "bg-[#8f896b]"
                      : index === 1
                        ? "bg-[#24344d]"
                        : index === 2
                          ? "bg-[#352136]"
                          : "bg-[#d8bdcd] text-[#4a3b31]"
                  }`}
                >
                  {piece}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{look.board}</p>
                <h2 className="mt-1 text-xl font-black tracking-[0]">{look.title}</h2>
              </div>
              <button className="rounded-full border bg-background p-2 hover:bg-accent" aria-label="Save look">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
