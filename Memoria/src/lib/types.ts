import type { MemoriaDesignRecord, ProductCustomization, ProductVariantGroup } from "@/db/schema";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  line: "clasica" | "memoria";
  collectionName: string;
  shortDescription: string;
  description: string;
  story: string;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  badge: string | null;
  materials: string;
  materialKey: string;
  style: string;
  features: string[];
  variants: ProductVariantGroup[];
  customization: ProductCustomization | null;
  stock: number;
  leadTime: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
};

export type Review = {
  id: number;
  customerName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type MemoriaDesign = MemoriaDesignRecord;

export type CartLine = {
  lineId: string;
  kind: "producto" | "memoria";
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  category: string;
  variant?: string;
  engraving?: string;
  design?: MemoriaDesign;
  summary?: string;
};
