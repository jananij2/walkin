export type ClosetCategory =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoe"
  | "accessory"
  | "other";

export type ClosetItem = {
  id: string;
  userId: string;
  name: string;
  category: ClosetCategory;
  imageUrl: string;
  colors: string[];
  notes?: string;
  tags: string[];
  createdAt: string;
};

export type InspirationSourceType = "pinterest_board" | "image_upload" | "manual_note";

export type InspirationSource = {
  id: string;
  userId: string;
  type: InspirationSourceType;
  sourceUrl?: string;
  imageUrl?: string;
  extractedThemes: string[];
  createdAt: string;
};

export type StyleProfile = {
  userId: string;
  themes: string[];
  preferredColors: string[];
  avoidedItems: string[];
  occasions: string[];
  notes?: string;
  updatedAt: string;
};

export type Outfit = {
  id: string;
  userId: string;
  title: string;
  closetItemIds: string[];
  stylingNotes: string;
  occasions: string[];
  saved: boolean;
  createdAt: string;
};
