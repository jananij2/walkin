import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, Sparkles, X } from "lucide-react";

type InspoImage = {
  id: string;
  name: string;
  src: string;
};

const initialTags = ["downtown cool", "soft layers", "butter yellow", "low-rise denim", "sleek boots"];
const storageKey = "walkin:inspo";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function InspoWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<InspoImage[]>([]);
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      setHasLoadedStorage(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as { images?: InspoImage[]; tags?: string[] };
      setImages(parsed.images ?? []);
      setTags(parsed.tags?.length ? parsed.tags : initialTags);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ images, tags }));
  }, [hasLoadedStorage, images, tags]);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const nextImages = await Promise.all(
      files.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        src: await readFileAsDataUrl(file)
      }))
    );

    setImages((current) => [...nextImages, ...current]);
    event.target.value = "";
  }

  function handleAddTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTag = tagInput.trim();

    if (!nextTag || tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setTags((current) => [nextTag, ...current]);
    setTagInput("");
  }

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
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <button
              className="mt-4 flex min-h-40 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-[#d8fafa]/70 text-sm font-bold text-primary transition hover:bg-[#d7d5e7]/70"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              Add images
            </button>
          </div>

          <div className="rounded-2xl border bg-background/70 p-5 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-lg font-black tracking-[0]">It&apos;s giving</h2>
            <form className="mt-4 flex gap-2" onSubmit={handleAddTag}>
              <input
                className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="model off duty"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
              />
              <button className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Add vibe">
                <Plus className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground"
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                >
                  {tag}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((image) => (
                <article key={image.id} className="overflow-hidden rounded-2xl border bg-background/70 shadow-sm">
                  <img src={image.src} alt={image.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 p-4">
                    <h2 className="min-w-0 truncate font-black tracking-[0]">{image.name}</h2>
                    <button
                      className="rounded-full border bg-background p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label={`Remove ${image.name}`}
                      onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-background/45 p-8 text-center">
              <p className="max-w-sm text-sm font-bold leading-6 text-muted-foreground">
                Your uploaded inspo images will show up here.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border bg-[#d8fafa]/70 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Style read</p>
            <p className="mt-3 text-lg font-black leading-7">
              {tags.length
                ? tags.slice(0, 4).join(", ")
                : "Add a few vibe tags and inspo images to start shaping your style read."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
