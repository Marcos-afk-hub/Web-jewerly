"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, materialOptions, styleOptions } from "@/lib/catalog-config";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductGridProps = {
  products: Product[];
  mode?: "featured" | "catalog";
  initialCategory?: string;
  initialQuery?: string;
};

const MAX_PRICE = 5000;

export function ProductGrid({ products, mode = "featured", initialCategory, initialQuery }: ProductGridProps) {
  const [category, setCategory] = useState(initialCategory && categories.some((item) => item.slug === initialCategory) ? initialCategory : "todas");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [material, setMaterial] = useState("todos");
  const [style, setStyle] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState("relevancia");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
    const matching = products.filter((product) => {
      const text = `${product.name} ${product.collectionName} ${product.shortDescription} ${product.materials}`.toLocaleLowerCase("es-MX");
      return (
        (category === "todas" || product.category === category) &&
        (material === "todos" || product.materialKey === material) &&
        (style === "todos" || product.style === style) &&
        product.price <= maxPrice &&
        text.includes(normalizedQuery)
      );
    });
    return [...matching].sort((first, second) => {
      if (sort === "precio-menor") return first.price - second.price;
      if (sort === "precio-mayor") return second.price - first.price;
      if (sort === "mejor-valorados") return second.rating - first.rating || second.reviewCount - first.reviewCount;
      if (sort === "novedades") return second.id - first.id;
      return Number(second.featured) - Number(first.featured) || first.id - second.id;
    });
  }, [category, material, maxPrice, products, query, sort, style]);

  const resetFilters = () => {
    setCategory("todas");
    setQuery("");
    setMaterial("todos");
    setStyle("todos");
    setMaxPrice(MAX_PRICE);
    setSort("relevancia");
  };

  if (mode === "featured") {
    return (
      <div className="product-grid product-grid--featured">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    );
  }

  return (
    <div className="catalog-wrap">
      <div className="category-chips" role="tablist" aria-label="Categorías">
        <button type="button" role="tab" aria-selected={category === "todas"} className={category === "todas" ? "chip chip--active" : "chip"} onClick={() => setCategory("todas")}>Todo</button>
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={category === item.slug}
            className={category === item.slug ? "chip chip--active" : "chip"}
            onClick={() => setCategory(item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="catalog-layout">
        <aside className="filter-panel" aria-label="Filtros del catálogo">
          <div className="filter-panel__heading">
            <span className="eyebrow">Refina tu búsqueda</span>
            <h2>Filtros</h2>
          </div>
          <label className="filter-field">
            <span>Buscar</span>
            <span className="filter-search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4 4" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Argollas, plata, grabado…" type="search" />
            </span>
          </label>
          <label className="filter-field">
            <span>Material</span>
            <select value={material} onChange={(event) => setMaterial(event.target.value)}>
              <option value="todos">Todos los materiales</option>
              {materialOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Estilo</span>
            <select value={style} onChange={(event) => setStyle(event.target.value)}>
              <option value="todos">Todos los estilos</option>
              {styleOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="filter-field filter-field--range">
            <span className="filter-field__range-label"><span>Precio máximo</span><strong>{formatPrice(maxPrice)}</strong></span>
            <input aria-label="Precio máximo" type="range" min="400" max={MAX_PRICE} step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <span className="filter-range-labels"><span>$400</span><span>{formatPrice(MAX_PRICE)}</span></span>
          </label>
          <button className="filter-reset" type="button" onClick={resetFilters}>Limpiar filtros <span aria-hidden="true">↺</span></button>
          <div className="filter-note">
            <span aria-hidden="true">✦</span>
            Las piezas MEMORIA se diseñan con tu prenda en el personalizador.
          </div>
        </aside>

        <div className="catalog-results">
          <div className="catalog-toolbar">
            <p><strong>{visibleProducts.length}</strong> {visibleProducts.length === 1 ? "pieza" : "piezas"}{category !== "todas" ? ` en ${categories.find((item) => item.slug === category)?.name}` : ""}</p>
            <label className="sort-select">
              <span>Ordenar:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="relevancia">Relevancia</option>
                <option value="novedades">Novedades</option>
                <option value="precio-menor">Precio: menor a mayor</option>
                <option value="precio-mayor">Precio: mayor a menor</option>
                <option value="mejor-valorados">Mejor valorados</option>
              </select>
            </label>
          </div>
          {visibleProducts.length > 0 ? (
            <div className="product-grid product-grid--catalog">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty-results">
              <span aria-hidden="true">✦</span>
              <h3>No encontramos piezas con esos filtros</h3>
              <p>Prueba con otra categoría, material o amplía el rango de precio.</p>
              <button type="button" onClick={resetFilters}>Ver todo el catálogo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
