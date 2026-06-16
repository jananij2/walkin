import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCcw, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";

type ClosetItem = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  tags: string[];
  imageSrc: string;
};

type Look = {
  title: string;
  styleTag: string;
  topItemId: string | null;
  bottomItemId: string | null;
  dressItemId: string | null;
  shoeItemId: string | null;
  layerItemId: string | null;
  accessoryItemIds: string[];
  stylingNote: string;
};

type SavedLook = Look & {
  notes?: string;
  savedAt?: string;
};

type InspoStorage = {
  tags?: string[];
};

type GenerationSnapshot = {
  closetSignature: string;
  lookKeys: string[];
};

const fallbackLooks: Look[] = [
  {
    title: "Cool girl basics",
    styleTag: "casual brunch",
    topItemId: null,
    bottomItemId: null,
    dressItemId: null,
    shoeItemId: null,
    layerItemId: null,
    accessoryItemIds: [],
    stylingNote: "Add closet items and generate a personalized lookbook."
  },
  {
    title: "Soft going out",
    styleTag: "going out",
    topItemId: null,
    bottomItemId: null,
    dressItemId: null,
    shoeItemId: null,
    layerItemId: null,
    accessoryItemIds: [],
    stylingNote: "Walkin will style this from your own uploaded pieces."
  },
  {
    title: "Weekend polish",
    styleTag: "weekend",
    topItemId: null,
    bottomItemId: null,
    dressItemId: null,
    shoeItemId: null,
    layerItemId: null,
    accessoryItemIds: [],
    stylingNote: "Your saved inspo tags will guide the outfit direction."
  }
];

const likedStorageKey = "walkin:liked-outfits";
const passedStorageKey = "walkin:passed-outfits";
const snapshotStorageKey = "walkin:last-lookbook-snapshot";

function findByCategory(items: ClosetItem[], categories: string[]) {
  return items.filter((item) => categories.includes(item.category) || categories.includes(item.subcategory));
}

function findAccessories(items: ClosetItem[]) {
  return items
    .filter((item) => ["Accessories", "Jewelry", "Bags", "Belts", "Hats", "Sunglasses"].includes(item.category) || ["Bags", "Belts", "Hats", "Sunglasses", "Necklaces", "Earrings", "Rings"].includes(item.subcategory))
    .slice(0, 2);
}

function generateFallbackLooks(items: ClosetItem[], inspoTags: string[]): Look[] {
  const tops = findByCategory(items, ["Tops", "T-shirts", "Tanks", "Blouses", "Button-downs", "Sweaters", "Hoodies", "Cardigans", "Bodysuits"]);
  const bottoms = findByCategory(items, ["Bottoms", "Jeans", "Pants", "Trousers", "Shorts", "Skirts", "Leggings"]);
  const dresses = findByCategory(items, ["One-pieces", "Dresses", "Jumpsuits", "Rompers", "Matching sets"]);
  const shoes = findByCategory(items, ["Shoes", "Sneakers", "Boots", "Heels", "Flats", "Loafers", "Sandals", "Slides"]);
  const layers = findByCategory(items, ["Outerwear", "Jackets", "Coats", "Blazers", "Vests", "Trench coats"]);
  const accessories = findAccessories(items);
  const vibe = inspoTags[0] ?? "everyday";
  const styleTags = [vibe, "casual brunch", "coffee run", "going out", "class fit", "dinner"];

  const looks: Look[] = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      if (looks.length >= 5) {
        break;
      }

      const index = looks.length;
      looks.push({
        title: index === 0 ? "Closet combo" : `${top.name} + ${bottom.name}`,
        styleTag: styleTags[index % styleTags.length],
        topItemId: top.id,
        bottomItemId: bottom.id,
        dressItemId: null,
        shoeItemId: shoes[index % Math.max(shoes.length, 1)]?.id ?? null,
        layerItemId: layers[index % Math.max(layers.length, 1)]?.id ?? null,
        accessoryItemIds: accessories.map((item) => item.id),
        stylingNote: shoes.length
          ? "A complete outfit formula from your closet: top, bottom, shoes, then optional finishing pieces."
          : "This works as a top and bottom pairing; add shoes to your closet for a more complete recommendation."
      });
    }
  }

  for (const dress of dresses) {
    if (looks.length >= 5) {
      break;
    }

    const index = looks.length;
    looks.push({
      title: index === 0 ? "One-piece moment" : `${dress.name} moment`,
      styleTag: styleTags[index % styleTags.length],
      topItemId: null,
      bottomItemId: null,
      dressItemId: dress.id,
      shoeItemId: shoes[index % Math.max(shoes.length, 1)]?.id ?? null,
      layerItemId: layers[index % Math.max(layers.length, 1)]?.id ?? null,
      accessoryItemIds: accessories.map((item) => item.id),
      stylingNote: shoes.length
        ? "A dress or one-piece keeps the outfit simple, while shoes and accessories make it feel styled."
        : "This one-piece can anchor the look; add shoes to your closet to complete it."
    });
  }

  if (!looks.length && items.length) {
    looks.push({
      title: "Start here",
      styleTag: "closet base",
      topItemId: items[0]?.id ?? null,
      bottomItemId: null,
      dressItemId: null,
      shoeItemId: null,
      layerItemId: items[1]?.id ?? null,
      accessoryItemIds: items.slice(2, 4).map((item) => item.id),
      stylingNote: "Add at least a top, bottom, and shoes so Walkin can build complete outfit recommendations."
    });
  }

  return looks;
}

function lookKey(look: Look) {
  return [
    look.title,
    look.styleTag,
    look.topItemId,
    look.bottomItemId,
    look.dressItemId,
    look.shoeItemId,
    look.layerItemId,
    ...look.accessoryItemIds
  ].join("|");
}

export function LookbookWorkspace() {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [inspoTags, setInspoTags] = useState<string[]>([]);
  const [looks, setLooks] = useState<Look[]>(fallbackLooks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedLooks, setLikedLooks] = useState<SavedLook[]>([]);
  const [passedLooks, setPassedLooks] = useState<Look[]>([]);
  const [selectedLikedKey, setSelectedLikedKey] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [isReviewingPassed, setIsReviewingPassed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generationMode, setGenerationMode] = useState<"ai" | "fallback" | null>(null);
  const [lastGenerationSnapshot, setLastGenerationSnapshot] = useState<GenerationSnapshot | null>(null);

  useEffect(() => {
    const closet = window.localStorage.getItem("walkin:closet");
    const inspo = window.localStorage.getItem("walkin:inspo");
    const liked = window.localStorage.getItem(likedStorageKey);
    const passed = window.localStorage.getItem(passedStorageKey);
    const snapshot = window.localStorage.getItem(snapshotStorageKey);

    if (closet) {
      try {
        setClosetItems(JSON.parse(closet) as ClosetItem[]);
      } catch {
        setClosetItems([]);
      }
    }

    if (inspo) {
      try {
        const parsed = JSON.parse(inspo) as InspoStorage;
        setInspoTags(parsed.tags ?? []);
      } catch {
        setInspoTags([]);
      }
    }

    if (liked) {
      try {
        setLikedLooks(JSON.parse(liked) as SavedLook[]);
      } catch {
        setLikedLooks([]);
      }
    }

    if (passed) {
      try {
        setPassedLooks(JSON.parse(passed) as Look[]);
      } catch {
        setPassedLooks([]);
      }
    }

    if (snapshot) {
      try {
        setLastGenerationSnapshot(JSON.parse(snapshot) as GenerationSnapshot);
      } catch {
        setLastGenerationSnapshot(null);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(likedStorageKey, JSON.stringify(likedLooks));
  }, [likedLooks]);

  useEffect(() => {
    window.localStorage.setItem(passedStorageKey, JSON.stringify(passedLooks));
  }, [passedLooks]);

  useEffect(() => {
    if (!lastGenerationSnapshot) {
      return;
    }

    window.localStorage.setItem(snapshotStorageKey, JSON.stringify(lastGenerationSnapshot));
  }, [lastGenerationSnapshot]);

  const closetById = useMemo(
    () => new Map(closetItems.map((item) => [item.id, item])),
    [closetItems]
  );

  const closetSignature = useMemo(
    () =>
      closetItems
        .map((item) => `${item.id}:${item.name}:${item.category}:${item.subcategory}:${item.tags.join(",")}`)
        .sort()
        .join("|"),
    [closetItems]
  );

  async function generateLookbook() {
    setError("");

    if (!closetItems.length) {
      setError("Add a few closet items before generating your Lookbook.");
      return;
    }

    const hasSeenEveryCurrentLook =
      lastGenerationSnapshot?.closetSignature === closetSignature &&
      lastGenerationSnapshot.lookKeys.length > 0 &&
      lastGenerationSnapshot.lookKeys.every((key) => actedLookKeys.has(key));

    if (hasSeenEveryCurrentLook) {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 650));
      setLooks([]);
      setCurrentIndex(0);
      setIsReviewingPassed(false);
      setError("No new outfits yet. Upload more closet items and refresh Lookbook or review passed looks.");
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/lookbook/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          closetItems: closetItems.map(({ imageSrc, ...item }) => item),
          inspoTags
        })
      });

      const rawResponse = await response.text();
      const data = rawResponse ? JSON.parse(rawResponse) : {};

      if (!response.ok) {
        throw new Error(data.error ?? "Could not generate lookbook.");
      }

      setLooks(data.looks as Look[]);
      setLastGenerationSnapshot({
        closetSignature,
        lookKeys: (data.looks as Look[]).map(lookKey)
      });
      setCurrentIndex(0);
      setIsReviewingPassed(false);
      setGenerationMode("ai");
    } catch (err) {
      const fallback = generateFallbackLooks(closetItems, inspoTags);
      setLooks(fallback);
      setLastGenerationSnapshot({
        closetSignature,
        lookKeys: fallback.map(lookKey)
      });
      setCurrentIndex(0);
      setIsReviewingPassed(false);
      setGenerationMode("fallback");
      setError(
        err instanceof Error
          ? `AI is unavailable right now, so this is a local fallback. ${err.message}`
          : "AI is unavailable right now, so this is a local fallback."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const actedLookKeys = useMemo(
    () => new Set([...likedLooks.map(lookKey), ...passedLooks.map(lookKey)]),
    [likedLooks, passedLooks]
  );
  const recommendationLooks = useMemo(
    () => looks.filter((look) => !actedLookKeys.has(lookKey(look))),
    [actedLookKeys, looks]
  );
  const activeLooks = isReviewingPassed ? passedLooks : recommendationLooks;
  const currentLook = activeLooks[currentIndex];

  function getLookPieces(look: Look) {
    return [
      look.dressItemId ? { label: "Dress", item: closetById.get(look.dressItemId) } : null,
      look.topItemId ? { label: "Top", item: closetById.get(look.topItemId) } : null,
      look.bottomItemId ? { label: "Bottom", item: closetById.get(look.bottomItemId) } : null,
      look.shoeItemId ? { label: "Shoes", item: closetById.get(look.shoeItemId) } : null,
      look.layerItemId ? { label: "Layer", item: closetById.get(look.layerItemId) } : null,
      ...look.accessoryItemIds.map((id) => ({ label: "Accessory", item: closetById.get(id) }))
    ].filter((entry): entry is { label: string; item: ClosetItem } => Boolean(entry?.item));
  }

  function skipLook() {
    if (!currentLook) {
      return;
    }

    if (isReviewingPassed) {
      if (currentIndex >= activeLooks.length - 1) {
        setIsReviewingPassed(false);
        setCurrentIndex(0);
        setLooks([]);
        return;
      }

      setCurrentIndex((current) => current + 1);
      return;
    }

    setPassedLooks((current) => {
      const alreadySaved = current.some((look) => lookKey(look) === lookKey(currentLook));
      return alreadySaved ? current : [currentLook, ...current];
    });
    setCurrentIndex(0);
  }

  function likeLook() {
    if (currentLook) {
      setLikedLooks((current) => {
        const alreadySaved = current.some((look) => lookKey(look) === lookKey(currentLook));
        return alreadySaved ? current : [{ ...currentLook, notes: "", savedAt: new Date().toISOString() }, ...current];
      });
      setPassedLooks((current) => current.filter((look) => lookKey(look) !== lookKey(currentLook)));
    }

    setCurrentIndex(0);
    if (isReviewingPassed && passedLooks.length <= 1) {
      setIsReviewingPassed(false);
    }
  }

  const selectedLikedLook = likedLooks.find((look) => lookKey(look) === selectedLikedKey) ?? null;

  function openLikedLook(look: SavedLook) {
    setSelectedLikedKey(lookKey(look));
    setSelectedNotes(look.notes ?? "");
  }

  function saveLikedNotes() {
    if (!selectedLikedLook) {
      return;
    }

    setLikedLooks((current) =>
      current.map((look) =>
        lookKey(look) === lookKey(selectedLikedLook) ? { ...look, notes: selectedNotes } : look
      )
    );
    setSelectedLikedKey(null);
    setSelectedNotes("");
  }

  function removeLikedLook() {
    if (!selectedLikedLook) {
      return;
    }

    setLikedLooks((current) => current.filter((look) => lookKey(look) !== lookKey(selectedLikedLook)));
    setSelectedLikedKey(null);
    setSelectedNotes("");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Lookbook</p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">Styled for you.</h1>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isGenerating}
          onClick={generateLookbook}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Styling..." : "Refresh lookbook"}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border bg-background/55 p-4">
        <p className="text-sm font-bold text-muted-foreground">
          Using {closetItems.length} closet item{closetItems.length === 1 ? "" : "s"}
          {inspoTags.length ? ` and vibes like ${inspoTags.slice(0, 3).join(", ")}` : ""}.
        </p>
        {error ? <p className="mt-2 text-sm font-bold text-primary">{error}</p> : null}
        {generationMode === "ai" ? (
          <p className="mt-2 text-sm font-bold text-primary">Generated with AI.</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="rounded-3xl border bg-background/70 p-5 shadow-sm">
          {currentLook ? (
            <>
          <div className="grid gap-3 sm:grid-cols-2">
            {getLookPieces(currentLook).length ? (
              getLookPieces(currentLook).map(({ label, item }) => (
                <div key={`${label}-${item.id}`} className="overflow-hidden rounded-2xl bg-muted">
                  <img src={item.imageSrc} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{label}</p>
                    <p className="mt-1 truncate text-sm font-black">{item.name}</p>
                  </div>
                </div>
              ))
            ) : (
              ["Top", "Bottom", "Shoes", "Optional"].map((slot, index) => (
                <div
                  key={slot}
                  className={`flex aspect-[4/5] items-end rounded-2xl p-4 text-sm font-black text-white ${
                    index === 0
                      ? "bg-[#8f896b]"
                      : index === 1
                        ? "bg-[#24344d]"
                        : index === 2
                          ? "bg-[#352136]"
                          : "bg-[#d8bdcd] text-[#4a3b31]"
                  }`}
                >
                  {slot}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground">
                {currentLook.styleTag}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[0]">{currentLook.title}</h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-muted-foreground">
                {currentLook.stylingNote}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-3 text-sm font-bold hover:bg-muted"
                onClick={skipLook}
              >
                <ThumbsDown className="h-4 w-4" />
                Pass
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                onClick={likeLook}
              >
                <ThumbsUp className="h-4 w-4" />
                Like
              </button>
            </div>
          </div>
            </>
          ) : (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-background/45 p-8 text-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-3xl font-black tracking-[0]">
                {isReviewingPassed ? "No passed looks to review." : "No more outfits for now."}
              </h2>
              <p className="mt-3 max-w-md text-sm font-bold leading-6 text-muted-foreground">
                {isReviewingPassed
                  ? "Passed looks will show up here after you say no to a recommendation."
                  : "Upload more closet items and refresh Lookbook or review passed looks."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {passedLooks.length > 0 && !isReviewingPassed ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-3 text-sm font-bold hover:bg-muted"
                    onClick={() => {
                      setIsReviewingPassed(true);
                      setCurrentIndex(0);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Review passed looks
                  </button>
                ) : null}
                {isReviewingPassed ? (
                  <button
                    className="rounded-full border bg-background px-4 py-3 text-sm font-bold hover:bg-muted"
                    onClick={() => {
                      setIsReviewingPassed(false);
                      setCurrentIndex(0);
                    }}
                  >
                    Back to recommendations
                  </button>
                ) : null}
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                  onClick={generateLookbook}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4" />
                  Refresh lookbook
                </button>
              </div>
            </div>
          )}
        </article>

        <aside className="rounded-3xl border bg-background/60 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black tracking-[0]">Liked outfits</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {likedLooks.length ? (
              likedLooks.map((look) => (
                <button
                  key={`${look.title}-${look.stylingNote}`}
                  className="grid grid-cols-[72px_1fr] items-center gap-3 rounded-2xl border bg-background/70 p-2 text-left transition hover:bg-muted"
                  onClick={() => openLikedLook(look)}
                >
                  <div className="grid h-20 grid-cols-2 gap-1 overflow-hidden rounded-xl bg-muted">
                    {getLookPieces(look).slice(0, 4).length ? (
                      getLookPieces(look).slice(0, 4).map(({ label, item }) => (
                        <img key={`${label}-${item.id}`} src={item.imageSrc} alt={item.name} className="h-full w-full object-cover" />
                      ))
                    ) : (
                      ["Top", "Bottom", "Shoes", "Fit"].map((slot) => (
                        <div
                          key={slot}
                          className="flex items-center justify-center bg-accent text-[9px] font-black uppercase tracking-[0.08em] text-accent-foreground"
                        >
                          {slot}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{look.styleTag}</p>
                    <h3 className="mt-1 truncate font-black">{look.title}</h3>
                    {look.notes ? (
                      <p className="mt-1 max-h-10 overflow-hidden text-xs font-bold leading-5 text-muted-foreground">{look.notes}</p>
                    ) : null}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm font-bold leading-6 text-muted-foreground">
                Like an outfit to save it here.
              </p>
            )}
          </div>
          {passedLooks.length ? (
            <button
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border bg-background/60 px-3 py-2 text-sm font-bold hover:bg-muted"
              onClick={() => {
                setIsReviewingPassed((current) => !current);
                setCurrentIndex(0);
              }}
            >
              <RotateCcw className="h-4 w-4 text-primary" />
              {isReviewingPassed ? "Back to recommendations" : `Review passed looks (${passedLooks.length})`}
            </button>
          ) : null}
        </aside>
      </div>

      {selectedLikedLook ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c241f]/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border bg-background p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-foreground">
                  {selectedLikedLook.styleTag}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[0]">{selectedLikedLook.title}</h2>
              </div>
              <button
                className="rounded-full border bg-background p-2 hover:bg-muted"
                aria-label="Close liked outfit"
                onClick={() => setSelectedLikedKey(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {getLookPieces(selectedLikedLook).map(({ label, item }) => (
                <div key={`${label}-${item.id}`} className="overflow-hidden rounded-2xl bg-muted">
                  <img src={item.imageSrc} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{label}</p>
                    <p className="mt-1 truncate text-sm font-black">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm font-medium leading-6 text-muted-foreground">
              {selectedLikedLook.stylingNote}
            </p>

            <label className="mt-5 grid gap-2 text-sm font-bold">
              Notes
              <textarea
                className="min-h-28 rounded-2xl border bg-background px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Add styling notes, where you'd wear it, or what you'd swap..."
                value={selectedNotes}
                onChange={(event) => setSelectedNotes(event.target.value)}
              />
            </label>

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <button
                className="rounded-full border border-primary/40 bg-background px-4 py-2 text-sm font-bold text-primary hover:bg-muted"
                onClick={removeLikedLook}
              >
                Remove from liked
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-full border bg-background px-4 py-2 text-sm font-bold hover:bg-muted"
                  onClick={() => setSelectedLikedKey(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                  onClick={saveLikedNotes}
                >
                  Save notes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
