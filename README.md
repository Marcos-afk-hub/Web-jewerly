# HILO MÍO · Memoria

**Joyería con historia.** Catálogo y e-commerce de joyería mexicana con una
línea propia —**MEMORIA**— que convierte fragmentos de prendas significativas en
piezas que se usan todos los días.

> *Lo que te importa, siempre contigo.*

---

## Qué es este proyecto

Una tienda en línea completa para una marca de joyería con taller en Metepec,
Estado de México. Incluye:

- **Catálogo** con filtros por categoría, material, estilo y precio.
- **Fichas de producto** con variantes, stock, fichas técnicas y reseñas.
- **Personalizador MEMORIA**: el cliente diseña su pieza (tipo, material, tono,
  cadena, forma, piedra, dije, acabado) con el precio calculado en vivo.
- **Carrito y checkout** con cálculo de envío, métodos de entrega y envío de la
  prenda a Taller.
- **Panel administrativo** (`/admin`) para consultar y actualizar pedidos.
- **Rastreo de pedidos** (`/rastrear`) por número de orden y correo.
- **Sitio institucional**: quiénes somos, objetivos del proyecto, contacto y
  políticas de compra, envíos, cambios, cuidados y proceso MEMORIA.

### Las dos marcas

| | |
|---|---|
| **HILO MÍO** | La marca de la casa: joyería clásica (plata .925, oro laminado, acero). |
| **MEMORIA** | La línea de producto diferenciada: joyería con fragmentos textiles. |

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Lenguaje | TypeScript 5.9 (modo estricto) |
| Estilos | Tailwind CSS 4 + CSS puro en `src/app/globals.css` |
| Datos | PostgreSQL + Drizzle ORM |
| Validación | Zod-free: validación propia en `src/lib/` |
| Pruebas | — (pendiente: Playwright + Vitest) |

---

## Arranque rápido

### Requisitos

- Node.js 22 o superior
- npm 10 o superior

### 1. Instalar dependencias

```bash
cd Memoria
npm install
```

### 2. Levantar la base de datos

Hay dos caminos.

**Opción A · PostgreSQL embebido (sin instalar nada)**

El script `npm run db:local` levanta un PostgreSQL real dentro del proyecto, en
`.pgdata/`. No requiere Docker ni instalación del sistema.

```bash
npm run db:local          # terminal 1 — deja el servidor corriendo
```

**Opción B · Tu propio PostgreSQL**

```bash
docker run -d --name memoria-pg \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db \
  -p 5432:5432 postgres:16
```

### 3. Configurar las variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y define `DATABASE_URL`:

```bash
# Opción A (embebido)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db

# Opción B (Docker o local)
DATABASE_URL=postgresql://usuario:clave@127.0.0.1:5432/app_db
```

### 4. Crear el esquema y sembrar el catálogo

```bash
npm run db:push    # aplica drizzle/0000_init.sql
npm run db:seed    # inserta productos y reseñas (también se hace al vuelo)
```

### 5. Arrancar el sitio

```bash
npm run dev        # http://localhost:3000
```

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 3000. |
| `npm run build` | Build de producción. |
| `npm run start` | Sirve el build de producción. |
| `npm run lint` | ESLint (configuración de Next.js). |
| `npm run typecheck` | TypeScript en modo estricto, sin emitir archivos. |
| `npm run db:local` | Levanta PostgreSQL embebido. |
| `npm run db:local:stop` | Detiene PostgreSQL embebido. |
| `npm run db:push` | Aplica el esquema a la base de datos. |
| `npm run db:generate` | Genera una migración nueva a partir del esquema. |
| `npm run db:studio` | Abre Drizzle Studio para inspeccionar los datos. |
| `npm run db:seed` | Siembra el catálogo de productos y reseñas. |
| `npm run db:migrate` | Aplica el esquema sin destructividad. Es el que corre Vercel. |
| `npm run db:migrate:images` | Reescribe las URLs de imagen guardadas a las rutas locales. |

---

## Estructura del proyecto

```
vercel.json                 Configuración de despliegue (rootDirectory: Memoria)
.vercelignore               Lo que no se sube al build
Memoria/
├─ drizzle/                 Migraciones SQL y metadatos de drizzle-kit
├─ public/images/           Fotografía editorial de la marca
├─ scripts/
│  ├─ local-db.mts          PostgreSQL embebido para desarrollo
│  ├─ migrate.mts           Aplica el esquema en producción (idempotente)
│  └─ seed.mts              Siembra del catálogo
├─ src/
│  ├─ app/                  Rutas (App Router)
│  │  ├─ api/
│  │  │  ├─ health/         Sonda de salud
│  │  │  └─ orders/         API de creación de pedidos
│  │  ├─ admin/             Panel administrativo
│  │  ├─ ayuda/             Preguntas frecuentes y políticas
│  │  ├─ catalogo/          Catálogo con filtros
│  │  ├─ checkout/          Carrito y checkout
│  │  ├─ contacto/          Formulario de contacto
│  │  ├─ memoria/           Línea MEMORIA
│  │  │  └─ personalizar/   Personalizador de piezas
│  │  ├─ nosotros/          Quiénes somos
│  │  ├─ objetivos/         Objetivos y propuesta de valor
│  │  ├─ producto/[slug]/   Ficha de producto
│  │  ├─ rastrear/          Seguimiento de pedido
│  │  ├─ globals.css        Sistema de diseño completo
│  │  └─ layout.tsx         Layout raíz, metadata y providers
│  ├─ components/           Componentes de interfaz
│  ├─ db/
│  │  ├─ index.ts           Pool y cliente de Drizzle
│  │  └─ schema.ts          Esquema de las 6 tablas
│  └─ lib/
│     ├─ catalog.ts         Consulta y siembra del catálogo
│     ├─ catalog-config.ts  Configuración de marca y categorías
│     ├─ fulfillment.ts     Envíos, pagos y estados de pedido
│     ├─ format.ts          Formato de precios y fechas
│     ├─ memoria-options.ts Opciones y precios del personalizador
│     ├─ notifications.ts   Correos y avisos
│     ├─ objectives.ts      Contenido de objetivos del proyecto
│     └─ types.ts           Tipos compartidos
├─ .env.example             Plantilla de variables de entorno
└─ package.json
```

### Base de datos

| Tabla | Contenido |
|---|---|
| `products` | Catálogo: precio, variantes, imágenes, stock, línea. |
| `reviews` | Reseñas por producto con nota y ubicación. |
| `customers` | Clientes registrados con su consentimiento de WhatsApp. |
| `orders` | Pedidos con importes, método de entrega y estado. |
| `order_items` | Líneas de pedido con variante, grabado y diseño MEMORIA. |
| `order_events` | Historial de estados de cada pedido. |

---

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | **Sí** | Cadena de conexión a PostgreSQL. |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | Número de WhatsApp, solo dígitos con clave de país. |
| `ADMIN_PASSWORD` | No | Acceso a `/admin`. Sin ella, el panel es de solo lectura. |
| `TRACKING_SECRET` | No | Clave para firmar enlaces de consulta de pedidos. |
| `STRIPE_SECRET_KEY` | No | Pasarela de pagos. |
| `RESEND_API_KEY` | No | Correos transaccionales. |
| `FEDEX_CLIENT_ID` / `FEDEX_CLIENT_SECRET` | No | Guías de paquetería FedEx. |

---

## Accesos

| Ruta | Qué hay |
|---|---|
| `/` | Portada: categorías, MEMORIA, destacados, reseñas. |
| `/catalogo` | Catálogo completo con filtros. |
| `/catalogo?categoria=aretes` | Catálogo filtrado. |
| `/producto/collar-prisma` | Ficha de producto. |
| `/memoria` | Línea MEMORIA: proceso, materiales, envío de la prenda. |
| `/memoria/personalizar` | Personalizador de piezas. |
| `/nosotros` | Historia, valores y resumen de objetivos. |
| `/objetivos` | Objetivos generales y específicos, propuesta, público e impacto. |
| `/ayuda` | Preguntas frecuentes y políticas. |
| `/contacto` | Datos de contacto y formulario. |
| `/checkout` | Carrito y checkout. |
| `/rastrear` | Seguimiento de pedido. |
| `/admin` | Panel administrativo. |
| `/api/health` | Sonda de salud. |

---

## Plan de trabajo por ramas

La base está lista. Los siguientes cambios van en ramas independientes para
poder integrarlos (o descartarlos) por separado.

| Rama | Alcance | Depende de |
|---|---|---|
| `feature/objetivos` | Sección de objetivos amplification: diagramas, métricas del proyecto y presentación para exposición. | — |
| `feature/memoria-ampliar` | Más piezas MEMORIA: anillos, dijes extra y variantes de tono por pieza. | — |
| `feature/checkout-pago` | Pasarela de pago real (Stripe o Mercado Pago) y comprobantes. | — |
| `feature/notificaciones` | Correos transaccionales y avisos por WhatsApp en cada etapa del pedido. | — |
| `feature/envios-fedex` | Integración con FedEx: guías, rastreo y costo real de envío. | — |
| `feature/admin-completo` | Gestión de stock, edición de productos y reportes de venta por línea. | — |
| `refactor/tienda-abstracta` | Extraer la capa de datos para soportar un backend alternativo sin tocar la UI. | — |
| `qa/pruebas` | Playwright (recorrido de compra) + Vitest (lógica de precio y validación). | — |
| `chore/deploy` | Despliegue (Vercel o contenedor), CI y variables de producción. | — |

Reglas:

1. Una rama, un tema. Si el cambio crece, se divide.
2. `main` siempre compila: `npm run lint && npm run typecheck && npm run build`.
3. Toda rama arranca con `git checkout -b feature/...` desde `main` actualizado.
4. Los cambios de esquema requieren `npm run db:generate` y su `.sql` versionada en `drizzle/`.

---

## Convenciones

- **Rutas en español**, código en inglés. Se sigue la convención del proyecto
  original: `src/app/catalogo/`, `src/lib/catalog-config.ts`.
- **Alias `@/`** apunta a `src/` (ver `tsconfig.json`).
- **Contenido editorial** (textos de marca, objetivos, políticas) vive en
  `src/lib/*.ts` como datos, no embebido en las páginas.
- **CSS**: las variables de diseño viven en `:root` en `src/app/globals.css`.
  Los nombres de clase son `kebab-case` y siguen el patrón `bloque__elemento`.
- **Imágenes**: la fotografía editorial vive en `public/images/`; las fotos de
  stock de producto se referencian por URL desde `src/lib/catalog-config.ts`.

---

## Publicar en internet

La guía completa, paso a paso, está en **[`DEPLOY.md`](DEPLOY.md)**.

Resumen: la base de datos en Neon o Supabase (plan gratuito) + el despliegue
automático en Vercel. Cada `git push` a `main` publica el sitio.

```
GitHub ──push──▶ Vercel ──build──▶ hilomio-memoria.vercel.app
                                     │
                                     └──DATABASE_URL──▶ Neon / Supabase
```

Lo único que hay que tener listo antes del primer despliegue:

| Variable | Dónde se saca |
|---|---|
| `DATABASE_URL` | Panel de Neon o Supabase → *Connection string* |
| `NEXT_PUBLIC_SITE_URL` | La URL que te asigne Vercel |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número, solo dígitos con clave de país |
| `ADMIN_PASSWORD` | La que tú elijas para entrar a `/admin` |

---

## Licencia

Proyecto académico · HILO MÍO · 2026
