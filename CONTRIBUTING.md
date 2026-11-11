# Guía de trabajo

Este repositorio usa **una rama por tema**. La idea es poder integrar (o
descartar) cada cambio por separado, sin bloquear al resto del equipo.

---

## Reglas

1. **Una rama, un tema.** Si el cambio crece demasiado, divídelo en varias.
2. **`main` siempre compila.** Antes de integrar:
   ```bash
   npm run lint && npm run typecheck && npm run build
   ```
3. **Rama desde `main` actualizado**, nunca desde otra rama de trabajo.
4. **Los cambios de esquema** necesitan una migración versionada:
   ```bash
   npm run db:generate      # genera drizzle/000N_*.sql
   ```
   Sube el `.sql` generado junto con el cambio de `src/db/schema.ts`.
5. **Nada de secretos.** Las variables van en `.env.local` (ignorado por git).
   `.env.example` documenta las que la app entiende.

---

## Flujo

```bash
# 1. Actualiza tu base local y la de tu rama base
git checkout main
git pull origin main

# 2. Crea tu rama
git checkout -b feature/mi-cambio

# 3. Trabaja, comprobando con frecuencia
npm run dev
npm run typecheck

# 4. Antes de abrir el PR
npm run lint && npm run typecheck && npm run build

# 5. Publica
git add -A
git commit -m "Descripción clara de lo que cambió"
git push -u origin feature/mi-cambio
```

---

## Nombres de rama

| Prefijo | Para qué |
|---|---|
| `feature/` | Funcionalidad nueva (páginas, checkout, personalizador). |
| `fix/` | Corrección de un error. |
| `refactor/` | Reestructuración sin cambiar el comportamiento. |
| `chore/` | Herramientas, configuración, dependencias. |
| `docs/` | Documentación. |
| `qa/` | Pruebas automatizadas. |

---

## Dónde tocar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Colores, tipografías, espaciados | `src/app/globals.css` (bloque `:root`) |
| Textos de marca y propuesta | `src/lib/objectives.ts`, `src/lib/catalog-config.ts` |
| Catálogo de productos | `src/lib/catalog.ts` (array `productSeeds`) |
| Opciones del personalizador | `src/lib/memoria-options.ts` |
| Envíos, pagos y estados | `src/lib/fulfillment.ts` |
| Esquema de la base de datos | `src/db/schema.ts` + migración en `drizzle/` |
| Navegación y pie de página | `src/components/site-header.tsx`, `src/components/site-footer.tsx` |

---

## Agregar una página nueva

```bash
mkdir -p src/app/mi-ruta
```

`src/app/mi-ruta/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Título de la página",
  description: "Descripción para buscadores.",
};

export default function MiPagina() {
  return (
    <main className="container section">
      <h1>Contenido</h1>
    </main>
  );
}
```

Después:
1. Añade el enlace en `src/components/site-header.tsx` (navegación) y/o
   `src/components/site-footer.tsx`.
2. Si necesita estilos propios, agrégalos al final de `src/app/globals.css`
   dentro de una sección comentada, con su bloque `@media` responsivo.

---

## Base de datos local

Si no tienes PostgreSQL instalado:

```bash
npm run db:local        # levanta el servidor embebido
```

En otra terminal:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Para detenerlo: `npm run db:local:stop`

Para inspeccionar los datos: `npm run db:studio`

---

## Antes de abrir un PR

```bash
npm run lint        # 0 errores
npm run typecheck   # 0 errores
npm run build       # compila
```

Si tocaste el esquema:

```bash
npm run db:generate # y sube el .sql resultante
```

---

## Qué NO va en este repositorio

- `.env.local` ni cualquier clave real.
- La carpeta `.pgdata/` (base de datos embebida).
- `node_modules/`, `.next/`, `*.tsbuildinfo`.
- Capturas de pantalla pesadas; usa enlaces.
