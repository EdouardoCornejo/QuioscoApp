# Quiosco App

Base de una aplicación de **quiosco / cafetería para pedidos de comida** hecha con **Next.js**, **TypeScript**, **Prisma** y **PostgreSQL**. El proyecto define el modelo de datos (categorías, productos y órdenes), una **semilla con 6 categorías y 59 productos**, una **API route** que expone las categorías y un **Context de React** que las carga en el cliente. Es un proyecto **en desarrollo**: la interfaz por ahora muestra el layout con la barra lateral y el logotipo.

![Tech](https://img.shields.io/badge/Next.js-13.0.5-black)
![Tech](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Tech](https://img.shields.io/badge/TypeScript-4.9-3178C6)
![Tech](https://img.shields.io/badge/Prisma-4.7-2D3748)
![Tech](https://img.shields.io/badge/PostgreSQL-336791)
![Tech](https://img.shields.io/badge/Tailwind_CSS-3.2-38B2AC)

---

## Tabla de contenidos

- [Quiosco App](#quiosco-app)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos previos](#requisitos-previos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Base de datos](#base-de-datos)
    - [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
    - [Scripts disponibles](#scripts-disponibles)
  - [Modelo de datos y API](#modelo-de-datos-y-api)
    - [Modelos de Prisma](#modelos-de-prisma)
    - [Endpoint](#endpoint)
    - [Datos de ejemplo](#datos-de-ejemplo)
  - [Cómo funciona](#cómo-funciona)
    - [1. `prisma/`](#1-prisma)
    - [2. `pages/api/categorias.ts`](#2-pagesapicategoriasts)
    - [3. `context/QuioscoProvider.tsx` y `hooks/useQuiosco.tsx`](#3-contextquioscoprovidertsx-y-hooksusequioscotsx)
    - [4. `layout/Layout.tsx` y `components/Sidebar.tsx`](#4-layoutlayouttsx-y-componentssidebartsx)
    - [Flujo de datos](#flujo-de-datos)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Configuración](#configuración)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Esquema Prisma** con los modelos `Categoria`, `Producto` (relación N:1 con categoría) y `Orden` (con el pedido guardado como `Json`).
- **Migraciones** de PostgreSQL versionadas en `prisma/migrations/`.
- **Seed** (`prisma/seed.ts`) que inserta 6 categorías (Café, Hamburguesas, Pizzas, Donas, Pasteles, Galletas) y 59 productos con nombre, precio e imagen.
- **API route** `GET /api/categorias` que devuelve todas las categorías desde la base de datos.
- **`QuioscoProvider`** (Context API) que pide las categorías con `axios` al montar la app y las comparte con el hook `useQuiosco`.
- **Layout responsive** con Tailwind: barra lateral con el logotipo y área principal con scroll.
- **Imágenes** de cada producto e iconos SVG de cada categoría en `public/assets/img/`.

Pendiente en el código actual: el listado de categorías en la barra lateral está comentado y aún no hay vistas de productos ni de órdenes.

---

## Cómo ejecutar el proyecto

### Requisitos previos

- **Node.js** (compatible con Next.js 13) y **npm**.
- Una base de datos **PostgreSQL** accesible (local o en la nube).

### Instalación

```bash
git clone <url-del-repositorio>
cd QuioscoApp
npm install
```

### Variables de entorno

Prisma lee la conexión desde `DATABASE_URL` (`datasource db { url = env("DATABASE_URL") }` en `prisma/schema.prisma`). Copia la plantilla `.env.example` a `.env` en la raíz y completa tus datos de PostgreSQL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/quiosco"
```

El archivo `.env` está en `.gitignore`: nunca lo subas al repositorio.

| Variable       | Uso                                       |
| -------------- | ----------------------------------------- |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL (Prisma) |

### Base de datos

```bash
npx prisma migrate dev     # aplica las migraciones y genera Prisma Client
npx prisma db seed         # carga categorías y productos (ts-node prisma/seed.ts)
npx prisma studio          # opcional: explorar los datos en el navegador
```

El comando de seed está configurado en `package.json` (`"prisma": { "seed": "ts-node ... prisma/seed.ts" }`).

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`. Las categorías también pueden consultarse en `http://localhost:3000/api/categorias`.

### Scripts disponibles

| Script          | Comando      | Descripción                           |
| --------------- | ------------ | ------------------------------------- |
| `npm run dev`   | `next dev`   | Servidor de desarrollo                |
| `npm run build` | `next build` | Compilación de producción             |
| `npm start`     | `next start` | Sirve la compilación de producción    |
| `npm run lint`  | `next lint`  | Revisa el código con ESLint           |

---

## Modelo de datos y API

### Modelos de Prisma

| Modelo      | Campos                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| `Categoria` | `id` (autoincremental), `nombre`, `icono`, `productos` (`Producto[]`)  |
| `Producto`  | `id`, `nombre`, `precio` (`Float`), `imagen`, `categoriaId` → `Categoria` |
| `Orden`     | `id`, `nombre`, `fecha` (`String`), `total` (`Float`), `pedido` (`Json`) |

### Endpoint

| Método | Ruta              | Respuesta                                         |
| ------ | ----------------- | ------------------------------------------------- |
| `GET`  | `/api/categorias` | `200` con el arreglo de categorías (`id`, `nombre`, `icono`) |

### Datos de ejemplo

| Categoría (`icono`)     | Productos |
| ----------------------- | --------- |
| Café (`cafe`)           | 14        |
| Hamburguesas (`hamburguesa`) | 8    |
| Pizzas (`pizza`)        | 11        |
| Donas (`dona`)          | 14        |
| Pasteles (`pastel`)     | 6         |
| Galletas (`galletas`)   | 6         |

El campo `icono` corresponde a `public/assets/img/icono_<icono>.svg` y el campo `imagen` del producto a `public/assets/img/<imagen>.jpg` (por ejemplo, `cafe_01`).

---

## Cómo funciona

### 1. `prisma/`

- `schema.prisma` — `datasource db` con `provider = "postgresql"` y los tres modelos.
- `migrations/` — tres migraciones: creación de categorías y productos, creación de órdenes y cambio de los `id` a `SERIAL`.
- `seed.ts` — función `main` que ejecuta `prisma.categoria.createMany` y `prisma.producto.createMany` con los datos de `data/categorias.ts` y `data/productos.ts`, y desconecta el cliente al terminar.

### 2. `pages/api/categorias.ts`

`handler` crea un `PrismaClient`, llama a `prisma.categoria.findMany()` y responde con `res.status(200).json(categorias)`.

### 3. `context/QuioscoProvider.tsx` y `hooks/useQuiosco.tsx`

- `QuioscoProvider` guarda `categorias` en estado; `obtenerCategorias` hace `axios('/api/categorias')` dentro de un `useEffect` de montaje.
- `useQuiosco` es un atajo a `useContext(QuioscoContext)`.
- `pages/_app.tsx` envuelve toda la app con el provider e importa `styles/globals.css` (Tailwind).
- `pages/_document.tsx` fija `lang="es"`, el favicon, el `apple-touch-icon` y el `theme-color`.

### 4. `layout/Layout.tsx` y `components/Sidebar.tsx`

- `Layout` define el `<title>` ("Quiosco Café | {pagina}"), la meta descripción y un diseño de dos columnas (`aside` + `main`) con breakpoints `md`, `xl` y `2xl`.
- `Sidebar` muestra el logotipo con `next/image` y lee las categorías con `useQuiosco` (el renderizado de la lista está pendiente).

### Flujo de datos

```
PostgreSQL
   ↑  npx prisma migrate dev / npx prisma db seed
Prisma Client
   ↓
GET /api/categorias  (pages/api/categorias.ts → prisma.categoria.findMany())
   ↓  JSON
QuioscoProvider (useEffect → axios('/api/categorias') → setCategorias)
   ↓  Context
useQuiosco() → Sidebar (dentro de Layout) → pages/index.tsx
```

---

## Tecnologías

- **Next.js 13** (Pages Router) — páginas y API routes.
- **React 18** + **Context API** — estado global de categorías.
- **TypeScript** — tipos en `utils/types.ts` (`Categoria`, `Producto`, `Orden`).
- **Prisma 4** + **PostgreSQL** — ORM, migraciones y seed.
- **Axios** — petición a la API desde el cliente.
- **Tailwind CSS 3** (con PostCSS y Autoprefixer) — estilos.
- **ts-node** — ejecución del seed en TypeScript.

---

## Estructura del proyecto

```
QuioscoApp/
├── components/
│   └── Sidebar.tsx                # Logotipo y navegación de categorías
├── context/
│   └── QuioscoProvider.tsx        # Context con las categorías
├── hooks/
│   └── useQuiosco.tsx             # useContext(QuioscoContext)
├── layout/
│   └── Layout.tsx                 # <Head> + aside/main
├── pages/
│   ├── _app.tsx                   # Provider global + estilos
│   ├── _document.tsx              # lang, favicon y theme-color
│   ├── index.tsx                  # Página de inicio
│   └── api/
│       └── categorias.ts          # GET /api/categorias
├── prisma/
│   ├── schema.prisma              # Modelos Categoria, Producto, Orden
│   ├── seed.ts                    # Carga de datos iniciales
│   ├── data/
│   │   ├── categorias.ts          # 6 categorías
│   │   └── productos.ts           # 59 productos
│   └── migrations/                # Migraciones de PostgreSQL
├── public/
│   ├── assets/img/                # Fotos de productos, iconos y logo
│   ├── favicon.svg                # Favicon (+ favicon.ico de respaldo)
│   ├── favicon.ico
│   └── apple-touch-icon.png       # Icono de inicio en iOS
├── styles/
│   └── globals.css                # Directivas de Tailwind
├── utils/
│   └── types.ts                   # Interfaces TypeScript
├── .env.example                   # Plantilla de DATABASE_URL
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Configuración

| Dónde                          | Qué                                     | Valor actual                         |
| ------------------------------ | --------------------------------------- | ------------------------------------ |
| `.env` → `DATABASE_URL`        | Conexión a la base de datos             | Cadena de PostgreSQL (ver `.env.example`) |
| `prisma/schema.prisma`         | Proveedor de base de datos              | `postgresql`                         |
| `prisma/data/*.ts`             | Datos que carga el seed                 | 6 categorías, 59 productos           |
| `next.config.js`               | Opciones de Next.js                     | `reactStrictMode: true`, `swcMinify: true` |
| `tailwind.config.js` → `content` | Carpetas escaneadas por Tailwind      | `pages/`, `layout/`, `components/`   |

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
