import { useEffect, useState } from "react";

export const categoryGroups = [
  {
    name: "Tops",
    subcategories: ["T-shirts", "Tanks", "Blouses", "Button-downs", "Sweaters", "Hoodies", "Cardigans", "Bodysuits"]
  },
  {
    name: "Bottoms",
    subcategories: ["Jeans", "Pants", "Trousers", "Shorts", "Skirts", "Leggings"]
  },
  {
    name: "One-pieces",
    subcategories: ["Dresses", "Jumpsuits", "Rompers", "Matching sets"]
  },
  {
    name: "Outerwear",
    subcategories: ["Jackets", "Coats", "Blazers", "Vests", "Trench coats"]
  },
  {
    name: "Shoes",
    subcategories: ["Sneakers", "Boots", "Heels", "Flats", "Loafers", "Sandals", "Slides"]
  },
  {
    name: "Accessories",
    subcategories: ["Bags", "Belts", "Hats", "Scarves", "Sunglasses", "Hair accessories"]
  },
  {
    name: "Jewelry",
    subcategories: ["Necklaces", "Earrings", "Rings", "Bracelets", "Watches"]
  },
  {
    name: "Intimates",
    subcategories: ["Bras", "Underwear", "Socks", "Tights", "Shapewear", "Sleepwear"]
  },
  {
    name: "Lifestyle",
    subcategories: ["Activewear", "Loungewear", "Swimwear", "Costumes", "Other"]
  }
];

type ClosetCategoryPickerProps = {
  initialGroup?: string;
  initialSubcategory?: string;
  onChange?: (selection: { group: string; subcategory: string }) => void;
};

export function ClosetCategoryPicker({ initialGroup, initialSubcategory, onChange }: ClosetCategoryPickerProps) {
  const [selectedGroup, setSelectedGroup] = useState(initialGroup ?? categoryGroups[0].name);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    initialSubcategory ?? categoryGroups[0].subcategories[0]
  );

  const activeGroup = categoryGroups.find((group) => group.name === selectedGroup) ?? categoryGroups[0];

  useEffect(() => {
    if (!initialGroup) {
      return;
    }

    const group = categoryGroups.find((item) => item.name === initialGroup) ?? categoryGroups[0];
    setSelectedGroup(group.name);
    setSelectedSubcategory(initialSubcategory ?? group.subcategories[0]);
  }, [initialGroup, initialSubcategory]);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {categoryGroups.map((group) => {
          const isSelected = group.name === selectedGroup;

          return (
            <button
              key={group.name}
              type="button"
              className={`rounded-full border px-3 py-2 text-sm font-bold transition ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-background/60 hover:bg-muted"
              }`}
              onClick={() => {
                const nextSubcategory = group.subcategories[0];
                setSelectedGroup(group.name);
                setSelectedSubcategory(nextSubcategory);
                onChange?.({ group: group.name, subcategory: nextSubcategory });
              }}
            >
              {group.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-background/55 p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {activeGroup.name}
        </p>
        <div className="flex flex-wrap gap-2">
          {activeGroup.subcategories.map((subcategory) => {
            const isSelected = subcategory === selectedSubcategory;

            return (
              <button
                key={subcategory}
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  isSelected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-accent/60"
                }`}
                onClick={() => {
                  setSelectedSubcategory(subcategory);
                  onChange?.({ group: activeGroup.name, subcategory });
                }}
              >
                {subcategory}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
