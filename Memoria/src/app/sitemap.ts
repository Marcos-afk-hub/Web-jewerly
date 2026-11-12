import type { MetadataRoute } from "next";
import { categories } from "@/lib/catalog-config";
import { collections } from "@/lib/collections";
import { getCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/colecciones`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/memoria`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/memoria/personalizar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/nosotros`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/objetivos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/ayuda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contacto`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/rastrear`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/checkout`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/catalogo?categoria=${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${siteUrl}/colecciones/${collection.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const catalog = await getCatalog();
    productRoutes = catalog.map((product) => ({
      url: `${siteUrl}/producto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Si la base de datos no está disponible, el sitemap se publica sin los
    // productos en lugar de fallar por completo.
  }

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}
