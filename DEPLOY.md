# Publicar el sitio en internet

Guía paso a paso para poner **HILO MÍO · Memoria** en línea con Vercel y una
base de datos PostgreSQL gestionada (Neon o Supabase).

Tiempo estimado: **20–30 minutos**, la mayor parte esperando confirmaciones
de correo.

---

## Lo que falta

Si ya creaste la base en Neon y ya importaste el proyecto en Vercel, quedan
tres cosas:

1. **Rotar la contraseña de la base.** Si la compartiste por chat, es
   obligatoria: Neon → tu proyecto → *Roles* → rotar la contraseña. Después
   actualiza `DATABASE_URL` en Vercel.
2. **Agregar `ADMIN_PASSWORD`** en Vercel → Settings → Environment Variables.
   Sin ella, `/admin` funciona con la contraseña de demostración
   `hilomio-admin`, que sirve para pruebas pero no para producción.
3. **Aplicar el esquema y sembrar el catálogo**, si el build no lo hizo:

   ```bash
   DATABASE_URL="postgresql://..." npm run db:migrate
   DATABASE_URL="postgresql://..." npm run db:seed
   ```

---

## Cómo funciona

```
GitHub  ──push──▶  Vercel  ──build──▶  tu sitio (hilomio-memoria.vercel.app)
                                       │
                                       └──DATABASE_URL──▶  Neon / Supabase (PostgreSQL)
```

Cada `git push` a `main` dispara un despliegue nuevo. La base de datos vive
fuera de Vercel, así que los datos sobreviven a los despliegues.

---

## Paso 1 · Publicar la base de datos

### Opción A · Neon (recomendada)

1. Entra en <https://console.neon.tech> y crea una cuenta.
2. **Create a project** → nombre `hilomio-memoria` → región **Mexico (Central)** o
   la más cercana.
3. El plan **Free** incluye suficiente para la exposición: 0.5 GB de almacenamiento
   y que se apaga sola tras 5 minutos de inactividad.
4. Cuando termine, Neon te muestra la **Connection string**. Copia algo como:

   ```
   postgresql://usuario:contraseña@ep-nombre-123.us-east-2.aws.neon.tech/hilomio-memoria?sslmode=require
   ```

> **No compartas esta cadena.** Es la contraseña de tu base de datos.

### Opción B · Supabase

1. Entra en <https://supabase.com> y crea una cuenta.
2. **New project** → nombre `hilomio-memoria` → elige una región cercana.
3. Ve a **Settings → Database → Connection string → URI** y copia el valor.
4. En el mismo panel puedes ver las tablas y los pedidos desde una interfaz
   gráfica, sin tocar la terminal.

### Verificar que funcionó

Si instalaste las dependencias del proyecto, puedes comprobar la conexión:

```bash
cd Memoria
cp .env.example .env.local
```

Abre `.env.local` y pega tu cadena de conexión:

```env
DATABASE_URL=postgresql://usuario:contraseña@ep-nombre-123.aws.neon.tech/hilomio-memoria?sslmode=require
```

Luego:

```bash
npm run db:migrate    # crea las tablas
npm run db:seed       # llena el catálogo y las reseñas
```

Si no hay errores, tu base de datos está lista.

---

## Paso 2 · Publicar en Vercel

### 2.1 Conectar el repositorio

1. Entra en <https://vercel.com/signup> y crea una cuenta (puedes usar GitHub).
2. **Add New… → Project** e importa el repositorio `Marcos-afk-hub/Web-jewerly`.
3. Cuando pregunte por el **Root Directory**, **déjalo vacío**.

   > La app de Next.js vive en `Memoria/`, pero el repositorio incluye un
   > `vercel.json` en la raíz que ya se encarga de entrar en esa carpeta:
   > el `installCommand` y el `buildCommand` empiezan con
   > `if [ -d Memoria ]; then cd Memoria && …`, y el `outputDirectory`
   > apunta a `Memoria/.next`.
   >
   > **No escribas `Memoria` en ese campo.** El *Root Directory* es un ajuste
   > del panel de Vercel, **no** una propiedad del `vercel.json`; y si lo
   > rellenas, Vercel entra en `Memoria/` y el `vercel.json` de la raíz deja
   > de leerse.

4. En **Framework Preset** deja **Next.js** y el detector automático de
   dependencias.

### 2.2 Variables de entorno

En el paso de **Environment Variables** agrega:

| Nombre | Valor |
|---|---|
| `DATABASE_URL` | La cadena de conexión de tu base de datos |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-sitio.vercel.app` (lo puedes cambiar después) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número de WhatsApp: `5215512345678` |
| `ADMIN_PASSWORD` | Una contraseña para el panel `/admin` |

> **Ojo con `NEXT_PUBLIC_*`:** esas variables se incrustan en el JavaScript que
> se envía al navegador. Nunca pongas ahí una contraseña. `ADMIN_PASSWORD` y
> `DATABASE_URL` no llevan el prefijo, así que se quedan en el servidor.

> **Las variables hay que ponerlas en los tres entornos.** En el panel de
> Vercel, arriba del editor de variables, hay un desplegable con
> *Production*, *Preview* y *Development*. Si `DATABASE_URL` solo está en
> *Production*, el despliegue de vista previa de un PR se construye sin ella.
> El sitio se publica igual (el catálogo tiene una copia en memoria), pero
> conviene tenerla en los tres para que las pruebas se parezcan a producción.

### 2.3 Desplegar

Presiona **Deploy**. Vercel:

1. Instala las dependencias.
2. Ejecuta `npm run db:migrate` (crea las tablas) y `npm run build`.
3. Publica el sitio.

Tardará unos 2–4 minutos la primera vez. Cuando termine verás:

```
https://hilomio-memoria.vercel.app
```

Ábrelo. Si aparece el catálogo con productos y fotos, **ya está en internet**.

---

## Notas sobre Neon

### La cadena de conexión

Neon entrega el formato de pooler con la contraseña entre corchetes:

```
postgresql://neondb_owner:[npg_TU_CLAVE_AQUI]@ep-xxxx-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Eso **sí** es un formato válido para `pg`. Solo asegúrate de que al copiarla
no se cuele el markdown de una tabla (el texto `](mailto:...)` que aparece
cuando copias desde una celda de GitHub o Notion): si lo lleva, la contraseña
queda mal y la conexión falla.

### Dos tipos de cadena

Neon ofrece dos hosts:

| Host | Para qué |
|---|---|
| `ep-xxx.us-east-2.aws.neon.tech` | Conexiones directas. Úsala para migraciones. |
| `ep-xxx-pooler.c-9.us-east-2.aws.neon.tech` | Pool de conexiones. Úsala para la aplicación. |

La que trae el panel (con `-pooler`) es la adecuada para `DATABASE_URL`.

### La base se llama `neondb`

Es la base que crea Neon por defecto. Funciona, pero si prefieres un nombre
propio puedes crear otra en el panel (*Databases → Create*) y apuntar ahí.

### La base se suspende

El plan gratuito apaga la base tras 5 minutos sin actividad. Dos
consecuencias:

1. **La primera visita tarda unos segundos.** Normal.
2. **Si alguien compra justo mientras está despertando**, puede fallar.

El sitio ya está preparado para esto: cuando la base no responde, sirve el
catálogo desde una copia en memoria y no se cae. El pedido, en cambio, sí
necesita la base — para eso está el plan pagado, que no se suspende.

### El cifrado TLS se negocia solo

Neon exige TLS, pero un PostgreSQL local no lo admite. Por eso el pool de
`src/db/index.ts` **sondea** el servidor al arrancar:

1. Abre una conexión de comprobación con cifrado.
2. Si el servidor la acepta, todo sigue con TLS (es el caso de Neon).
3. Si el servidor dice que no admite SSL, el mismo pool se reconfigura sin
   cifrado y el sitio continúa con normalidad.

El sondeo se hace **una sola vez** y con una conexión aparte, que se cierra
al terminar. Si alguna vez hay que forzar el modo sin cifrado:

```bash
# En .env.local o en las variables de Vercel
DISABLE_DB_SSL=1
```

También funciona añadir `sslmode=disable` al final de la `DATABASE_URL`.

> La negociación se hace **reconfigurando** el pool existente, nunca
> sustituyéndolo. Si se creara un pool nuevo, las instancias de Drizzle ya
> importadas quedarían apuntando al pool anterior y toda consulta fallaría
> con `Cannot use a pool after calling end on the pool`.

### Si el build falla al aplicar el esquema

`npm run db:migrate` no destruye datos y se puede volver a ejecutar. Si
Vercel no alcanza la base desde su red de build, el despliegue se pone rojo;
en ese caso:

```bash
# Aplica el esquema desde tu máquina, contra Neon
DATABASE_URL="postgresql://..." npm run db:migrate
DATABASE_URL="postgresql://..." npm run db:seed
```

Y vuelve a desplegar. El esquema queda aplicado y el build pasa de largo.

### Verifica que todo quedó bien

```bash
curl -s https://tu-sitio.vercel.app/api/health
```

Debe responder `{"ok":true}`.

---

## Paso 3 · Conectar un dominio propio

Si quieres una dirección como `hilomio.mx`:

1. En Vercel: **Settings → Domains → Add**.
2. Escribe tu dominio y presiona **Add**.
3. Vercel te muestra los registros DNS que debes crear en tu registrador
   (GoDaddy, Namecheap, DonDaddy…).

   Si usas los DNS de Vercel, normalmente es:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

4. Espera a que el dominio se propague (puede tardar de minutos a 24 horas).
5. Vercel emite el certificado HTTPS automáticamente. No hay que hacer nada.

Los dominios `.com.mx` se compran en Network Solutions o DonDaddy y cuestan
alrededor de 400–700 MXN al año.

---

## Paso 4 · Después del primer despliegue

### Verificar que todo funciona

```bash
curl -s https://tu-sitio.vercel.app/api/health
```

Debe responder `{"ok":true}`. Si responde `{"ok":false}`, la base de datos no
está conectada: revisa `DATABASE_URL` en Vercel.

### Cambiar el número de WhatsApp

Todo el sitio usa `NEXT_PUBLIC_WHATSAPP_NUMBER`. Al cambiarla en Vercel hay
que **re-desplegar** (Deployments → ⋯ → Redeploy) para que el valor viejo se
actualice en el navegador.

### Probar un pedido completo

1. Entra al sitio, agrega una pieza al carrito y haz un pedido.
2. Ve a Vercel → **Storage** (la base de Neon/Supabase) y confirma que
   aparece en la tabla `orders`.
3. Entra a `https://tu-sitio.vercel.app/admin`, escribe la contraseña de
   `ADMIN_PASSWORD` y verás el pedido con su bitácora de estados.
4. Compra una prenda MEMORIA para comprobar que el flujo de envío de la
   prenda y el estado `pendiente_prenda` funcionan.

---

## Mantenimiento

### Cada cambio de código

```bash
git add -A
git commit -m "Descripción del cambio"
git push origin main
```

Vercel despliega solo. Revisa el resultado en la pestaña **Deployments**.

### Cambios en el esquema de la base

Si modificas `src/db/schema.ts`:

```bash
# En local, para generar la migración
npm run db:generate

# Sube el .sql generado y el cambio del esquema
git add .
git commit -m "feat: agrega tabla de XYZ"
git push origin main
```

> `npm run db:migrate` (el que corre Vercel) solo crea tablas y índices que
> no existen. Nunca borra datos. Si agregas una columna nueva a una tabla
> existente, hay que escribir esa sentencia a mano en `scripts/migrate.mts`.

### Respaldo de la base

- **Neon:** tiene respaldos automáticos en el plan gratuito; puedes descargarlos
  desde el panel con `pg_dump`.
- **Supabase:** respaldos automáticos diarios en el plan gratuito.

Para un respaldo manual:

```bash
pg_dump "$DATABASE_URL" > respaldo-$(date +%Y-%m-%d).sql
```

---

## Problemas frecuentes

### Cómo leer el log de un build fallido en Vercel

Es el primer paso cuando el check de GitHub sale en rojo:

1. Abre el panel de Vercel → pestaña **Deployments**.
2. El deployment fallido es el de arriba. Ábrelo.
3. En la derecha, busca **Build Logs** (hay que activar **Function Logs** si
   quieres ver los logs de las funciones).
4. Copia las líneas en rojo, sobre todo las que dicen `Error:`.

Si prefieres la terminal, cada deployment da su comando exacto en la pestaña
**Checks** de GitHub:

```bash
npx vercel inspect dpl_XXXXXXXX --logs
```

### «ERR_INVALID_URL» o «Failed to collect page data for /_not-found»

La variable `NEXT_PUBLIC_SITE_URL` tiene un valor que no es una URL. Lo más
común es que en el panel de Vercel se haya copiado el texto de ejemplo tal
cual:

```
La URL que te asigne Vercel
```

El sitio ya no se rompe por eso: la URL se valida y, si no es válida, se usa
una de reserva. Pero **conviene corregirla** en
*Settings → Environment Variables*, porque de ahí salen las URLs del sitemap,
de `robots.txt` y las etiquetas para compartir en redes.

El formato correcto es el dominio completo, sin barra final:

```
https://tu-sitio.vercel.app
```

### El build falla y el log dice que no encuentra `package.json`

El **Root Directory** del proyecto en Vercel debe estar **vacío**. El
repositorio ya incluye un `vercel.json` en la raíz que entra en `Memoria/`
por su cuenta. Si en el panel escribes `Memoria`, la ruta se duplica
(`Memoria/Memoria`) y Vercel no encuentra nada.

### «should NOT have additional property 'rootDirectory'»

`rootDirectory` **no** es una propiedad válida del `vercel.json`: es un
ajuste del panel de Vercel (Settings → General → Root Directory). Escribirlo
en el archivo hace que Vercel rechace la configuración entera.

### «Invalid region selector: "mx1"»

Vercel **no tiene una región en México**. Los códigos válidos son, entre
otros: `iad1` (Washington D.C., el default), `sfo1`, `gru1` (São Paulo),
`cle1`, `cdg1`, `fra1`, `hnd1`. Este proyecto usa `iad1`, que además es la
región donde está Neon por defecto.

### Aparecen dos deployments en cada push

Es que hay **dos proyectos de Vercel** conectados al mismo repositorio
(por ejemplo `web-jewerly` y `web-jewerly-9n9g`). En
**Settings → Git** de cada proyecto puedes desconectar el que no uses, o en
**Project Settings** revisar que los dos apunten al mismo repositorio con
la misma configuración. Con un solo proyecto hay un solo deployment.

### «DATABASE_URL es obligatoria»

La variable no llegó al entorno de Vercel. Revisa que la hayas agregado en
**Settings → Environment Variables** para los tres entornos (Production,
Preview, Development), y recuerda que las variables se leen al desplegar.

> Si el mensaje sale **durante el build**, casi siempre es que la variable
> solo está en *Production* y el deployment de vista previa del PR se
> construye sin ella. Agrégala también en *Preview* y *Development*.

### «Invalid src prop … hostname is not configured»

Quedó alguna referencia a una imagen externa. Toda la fotografía debe estar
en `public/images/`. Si agregas una fuente nueva, regístrala en
`next.config.ts` → `images.remotePatterns`.

### El sitio tarda en cargar la primera visita

Neon apaga la base tras 5 minutos sin uso, y el primer visitante la despierta. Es
normal en el plan gratuito. Para evitarlo, usa el plan pagado de Neon o
configura la base para que no se suspenda.

### «Error: Dynamic server usage» durante el build

Alguna página que debería ser estática está pidiendo datos en tiempo de
compilación. Agrégale `export const dynamic = "force-dynamic";` al principio
del archivo de la página.

---

## Checklist antes de la exposición

- [ ] `npm run lint && npm run typecheck && npm run build` sin errores
- [ ] El sitio carga en menos de 3 segundos con conexión normal
- [ ] Se ve bien en celular (pruébalo en el teléfono, no solo en la laptop)
- [ ] El número de WhatsApp abre con el mensaje correcto
- [ ] El panel `/admin` responde con la contraseña
- [ ] Un pedido de prueba llega completo hasta el panel
- [ ] Hay un respaldo de la base de datos descargado
