import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Pencil, Plus, Shirt, SlidersHorizontal, X } from "lucide-react";
import { ClosetCategoryPicker, categoryGroups } from "@/components/closet-category-picker";

type ClosetItem = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  tags: string[];
  imageSrc: string;
};

const storageKey = "walkin:closet";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ClosetWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [name, setName] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [category, setCategory] = useState(categoryGroups[0].name);
  const [subcategory, setSubcategory] = useState(categoryGroups[0].subcategories[0]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<{ category: string; subcategory: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editCategory, setEditCategory] = useState(categoryGroups[0].name);
  const [editSubcategory, setEditSubcategory] = useState(categoryGroups[0].subcategories[0]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      setHasLoadedStorage(true);
      return;
    }

    try {
      setItems(JSON.parse(saved) as ClosetItem[]);
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

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hasLoadedStorage, items]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageSrc(await readFileAsDataUrl(file));
    setName((current) => current || file.name.replace(/\.[^/.]+$/, ""));
    event.target.value = "";
  }

  function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageSrc) {
      fileInputRef.current?.click();
      return;
    }

    const cleanTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setItems((current) => [
      {
        id: crypto.randomUUID(),
        name: name.trim() || subcategory,
        category,
        subcategory,
        tags: cleanTags,
        imageSrc
      },
      ...current
    ]);
    setName("");
    setTagsInput("");
    setImageSrc("");
  }

  const visibleItems = filter
    ? items.filter((item) => item.category === filter.category && item.subcategory === filter.subcategory)
    : items;

  function startEdit(item: ClosetItem) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditTagsInput(item.tags.join(", "));
    setEditCategory(item.category);
    setEditSubcategory(item.subcategory);
  }

  function saveEdit(itemId: string) {
    const cleanTags = editTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              name: editName.trim() || editSubcategory,
              category: editCategory,
              subcategory: editSubcategory,
              tags: cleanTags
            }
          : item
      )
    );
    setEditingId(null);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Closet</p>
          <h1 className="mt-2 text-4xl font-black tracking-[0]">What are we working with?</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
        <form className="rounded-2xl border bg-background/70 p-5 shadow-sm" onSubmit={handleAddItem}>
          <Shirt className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-lg font-black tracking-[0]">New item</h2>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            className="mt-4 flex min-h-36 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-[#d8fafa]/70 text-sm font-bold text-primary transition hover:bg-[#d7d5e7]/70"
            onClick={() => fileInputRef.current?.click()}
          >
            {imageSrc ? <img src={imageSrc} alt="" className="h-full max-h-44 w-full object-cover" /> : <><ImagePlus className="h-4 w-4" /> Add closet item</>}
          </button>
          <label className="mt-4 grid gap-2 text-sm font-bold">
            Item name
            <input
              className="rounded-full border bg-background px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="black mini skirt"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <div className="mt-4 grid gap-2 text-sm font-bold">
            <span>Category</span>
            <ClosetCategoryPicker
              onChange={(selection) => {
                setCategory(selection.group);
                setSubcategory(selection.subcategory);
              }}
            />
          </div>
          <label className="mt-4 grid gap-2 text-sm font-bold">
            Tags
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="basics, fancy, vintage"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
              />
              <button className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Add item">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </label>
        </form>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-[0]">All items</h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {filter ? `${filter.category} / ${filter.subcategory}` : `${items.length} closet item${items.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filter ? (
                <button
                  className="rounded-full border bg-background/60 px-3 py-2 text-sm font-bold hover:bg-muted"
                  onClick={() => setFilter(null)}
                >
                  Show all
                </button>
              ) : null}
              <button
                className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-2 text-sm font-bold hover:bg-muted"
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filter by category
              </button>
            </div>
          </div>

          {filtersOpen ? (
            <div className="mt-4 rounded-2xl border bg-background/55 p-4">
              <ClosetCategoryPicker
                onChange={(selection) => {
                  setFilter({ category: selection.group, subcategory: selection.subcategory });
                }}
              />
            </div>
          ) : null}

          {visibleItems.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border bg-background/70 shadow-sm">
                  <img src={item.imageSrc} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  <div className="p-4">
                    {editingId === item.id ? (
                      <div className="grid gap-4">
                        <label className="grid gap-2 text-sm font-bold">
                          Item name
                          <input
                            className="rounded-full border bg-background px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/30"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                          />
                        </label>
                        <div className="grid gap-2 text-sm font-bold">
                          <span>Category</span>
                          <ClosetCategoryPicker
                            initialGroup={editCategory}
                            initialSubcategory={editSubcategory}
                            onChange={(selection) => {
                              setEditCategory(selection.group);
                              setEditSubcategory(selection.subcategory);
                            }}
                          />
                        </div>
                        <label className="grid gap-2 text-sm font-bold">
                          Tags
                          <input
                            className="rounded-full border bg-background px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-primary/30"
                            value={editTagsInput}
                            onChange={(event) => setEditTagsInput(event.target.value)}
                          />
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
                            onClick={() => saveEdit(item.id)}
                          >
                            <Check className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            className="rounded-full border bg-background/60 px-3 py-2 text-sm font-bold hover:bg-muted"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate font-black tracking-[0]">{item.name}</h2>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                              {item.category} / {item.subcategory}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="rounded-full border bg-background p-1.5 text-muted-foreground hover:bg-muted"
                              aria-label={`Edit ${item.name}`}
                              onClick={() => startEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded-full border bg-background p-1.5 text-muted-foreground hover:bg-muted"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => setItems((current) => current.filter((closetItem) => closetItem.id !== item.id))}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {item.tags.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-background/45 p-8 text-center">
              <p className="max-w-sm text-sm font-bold leading-6 text-muted-foreground">
                {items.length
                  ? `No ${filter?.subcategory.toLowerCase()} yet.`
                  : "Your closet items will show up here once you add photos."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
