# Portfolio TCG (Trading Card *Curriculum*)

> **Tu portafolio, pero como un juego de cartas.** Los visitantes crean su propia carta, arman un mazo y combaten contra *Recruiters*, *Jefes Corruptos* o la *IA*. Detrás de cada carta hay una historia (tu experiencia real), stats (tus skills) y habilidades (tus logros).

---

## 🎮 Premisa

* El “portafolio” es una **colección de cartas**. Cada carta describe una parte de tu perfil (experiencias, proyectos, skills), pero en clave lúdica.
* El visitante puede **generar una carta aleatoria**, **editar su propia carta** (nombre/avatar/skills) y **arrastrar/soltar** para **reordenar el mazo**.
* Con su mazo (hasta *N* cartas), inicia un **combate rápido 1v1** contra enemigos temáticos: *Recruiter*, *Boss Tóxico*, *IA*, etc. Cada enemigo tiene un estilo de pelea (prioriza DEF, burst de ATK, RNG alto, etc.).
* Resultado = diversión + lectura del CV encubierta: cada carta tiene **lore/biografía** con links a proyectos reales.

---

## 🧩 Mecánicas clave

* **Drag & Drop de cartas** (tocar, arrastrar, reordenar mazo). Compatible desktop + mobile (touch).
* **Constructor de cartas**: formulario simple; set de *presets* ("Fullstack", "Abogacía Tech", "Mobile", etc.); **randomize** con un click.
* **Combate express** (\~30–60s):

  * **Turnos** alternos con iniciativa según *SPD* (empates resueltos por *RNG*).
  * Daño = f(ATK, DEF, INT, RNG). Críticos con probabilidad dependiente de *RNG*.
  * Habilidades pasivas (ej.: “Refactor Zen: +SPD 1”), y activas de cooldown corto (ej.: “Argumento demoledor: aturde 1 turno”).
  * **Registro de combate** tipo log.
* **Progresión suave**: al vencer enemigos se desbloquean *skins* (marcos/rangos), títulos y sticker/emoji packs.
* **Share**: botón para compartir tu carta como imagen (canvas export) o link con parámetros.

---

## 🃏 Modelo de datos (TypeScript sugerido)

```ts
export type Rarity = 'Común' | 'Rara' | 'Épica' | 'Legendaria';
export type StatKey = 'atk' | 'def' | 'int' | 'cha' | 'hp' | 'spd' | 'rng';

export interface Card {
  id: string;
  name: string;      // p.ej. "Flecha"
  title: string;     // p.ej. "Fullstack & Derecho"
  avatar: string;    // emoji o URL
  bio: string;       // descripción/portfolio
  rarity: Rarity;
  abilities: string[];
  stats: Record<StatKey, number>; // 1..10
  links?: { label: string; url: string }[]; // a proyectos reales
}

export interface Enemy {
  id: string;
  name: string;      // Recruiter | Boss | IA
  style: 'aggro' | 'tank' | 'lucky' | 'smart';
  base: Omit<Card,'id'|'rarity'> & { rarity?: Rarity };
}
```

---

## 🏗️ Tecnologías recomendadas

* **Framework UI**: React + **TypeScript** (Vite o Next.js).
* **Styling**: TailwindCSS (rápido y consistente).
* **Estado**: Zustand o Redux Toolkit (simple store para mazo, colección, combate).
* **Drag & Drop**: [`@dnd-kit/core`](https://github.com/clauderic/dnd-kit) (touch-friendly) o `react-dnd`.
* **Render de cartas/FX**: DOM/CSS para empezar; opcional **PixiJS** o **Konva** si querés efectos/animaciones sobre canvas.
* **Sonido**: Howler.js.
* **Persistencia**: localStorage/IndexedDB (deck del visitante, settings);
* **Build/Host**: GitHub Pages (SPA) **o** despliegue serverless (Cloudflare Pages/Workers, Vercel, Netlify).
* **Server opcional** (si querés rankings o seeds firmadas): Hono/Express en **Cloudflare Workers** o Node + Docker (Fly.io/Railway) con deploy desde GitHub Actions.
* **PWA**: Instalable, offline básico (catálogo de cartas y assets cacheados).

> **Minimal viable:** Vite + React + TS + Tailwind + dnd-kit + Zustand + GitHub Pages.

---

## 🧠 IA y procedural

* **Generador de cartas**: tablas de nombres/títulos/abilities + aleatoriedad controlada → `rarity` calculada por sumatoria de stats.
* **AI Enemy Personas**: reglas simples por arquetipo ("aggro": prioriza ATK, "smart": maximiza INT/DEF y lee tu turno anterior, etc.).
* **Opcional**: prompt templates para que una IA proponga *lore*/habilidades a partir de tu CV real (fuera del runtime del juego, para generar seeds).

---

## 🔁 Loop de juego

1. **Explorar**: ver tus cartas (tu CV) y la vitrina de enemigos.
2. **Construir**: crear carta propia o random; arrastrar al mazo (máx. N=5).
3. **Pelear**: combate 1v1; log de turnos; recompensas cosméticas.
4. **Compartir**: exportar imagen de la carta/resultado; botón "Contacto" visible.

---

## 🧪 Balance inicial (reglas simples)

* Vida base = `hp * 10`.
* Orden de turno = SPD; empate resuelto por RNG.
* Daño por turno ≈ `floor(ATK/2) + floor(INT/4) + variación(RNG) - mitigación(DEF/3)` con límites \[1..25].
* Crítico: prob. ≈ `RNG / 20` (tunable).
* *Rarity* por score total: `≥62 Legendaria`, `≥55 Épica`, `≥46 Rara`, else Común.

---

## 🗂️ Estructura sugerida

```
/ (repo)
├─ apps/web              # Vite/Next (UI)
│  ├─ src/
│  │  ├─ components/     # Card, Deck, BattleLog, EnemyBadge
│  │  ├─ features/
│  │  │   ├─ deck/       # store, actions (add/remove/reorder)
│  │  │   └─ battle/     # engine, resolvers, AI
│  │  ├─ lib/            # rng, generators, utils
│  │  └─ styles/
│  └─ public/            # icons, manifest, sounds
├─ packages/core         # (opcional) motor y tipos compartidos
└─ .github/workflows     # CI/CD
```

---

## 🚀 Scripts de desarrollo

```bash
# con Vite
pnpm i
pnpm dev       # arranca en localhost
pnpm build     # build producción
pnpm preview   # sirve el build local
```

---

## 🖱️ Interacciones (UX)

* **Click/tap** selecciona carta → muestra *lore* y stats grandes.
* **Drag** para reordenar en el mazo (dnd-kit con `SortableContext`).
* **Long‑press** (mobile) para levantar carta.
* **Teclado**: flechas navegan, `Enter` inicia combate, `R` randomiza carta.
* **Accesibilidad**: roles ARIA en lista reordenable, focus visible, contraste AA+.

---

## 🔒 Persistencia y seeds

* `localStorage` para mazo del visitante y settings.
* `?seed=xyz` en URL para reproducir cartas aleatorias.
* (Servidor opcional) endpoint `/mint` que devuelve una carta firmada con hash para tableros de puntuación.

---

## 📦 Deployment con GitHub Actions

### Opción A) **GitHub Pages** (SPA estática)

**/.github/workflows/pages.yml**

```yaml
name: Deploy Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: corepack enable && corepack prepare pnpm@9.0.0 --activate
      - run: pnpm i --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> **Notas**
>
> * Vite: setea `base: '/<repo>/'` en `vite.config.ts` si el repo no es *user.github.io*.
> * Para Next.js estático, usa `next export` y publica `/out`.

### Opción B) **Server Docker** (Fly.io / Railway / VPS)

**/.github/workflows/docker-deploy.yml**

```yaml
name: Build & Deploy Docker
on: { push: { branches: [ main ] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      # Ejemplo Fly.io (requiere app configurada y secret FLY_API_TOKEN)
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --image ghcr.io/${{ github.repository }}:latest --remote-only
```

> **Notas**
>
> * Cambiá el step de deploy al proveedor que prefieras (Railway CLI, `ssh`, etc.).
> * Recomendado: servir SPA con Node/Express o estático con Nginx.

---

## 🧪 QA/CI sugerida

* **Typecheck**: `tsc --noEmit` en CI.
* **Lint/format**: ESLint + Prettier.
* **Unit tests**: Vitest (core de combate y RNG).
* **E2E**: Playwright (drag & drop, mobile viewport, accesibilidad básica).

**/.github/workflows/ci.yml**

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: corepack enable && corepack prepare pnpm@9.0.0 --activate
      - run: pnpm i --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test -- --run
```

---

## 🗺️ Roadmap (MVP → Plus)

**MVP (1–2 semanas)**

* [ ] Catálogo de cartas base + generador aleatorio.
* [ ] Constructor de cartas (form + presets).
* [ ] Mazo reordenable con dnd-kit (desktop + touch).
* [ ] Motor de combate simple con log.
* [ ] Deploy a GitHub Pages (Actions).

**PLUS (3–4 semanas)**

* [ ] Skins de marcos/rarities y animaciones.
* [ ] PWA + guardado offline.
* [ ] Exportar carta como imagen (canvas).
* [ ] Enemigos con estilos distintos y *boss rush*.
* [ ] Servidor ligero para rankings/seeds firmadas.

---

## 🧭 Guía de contribución (para Codex u otros agentes)

1. Mantener **tipos** en `packages/core` (si existe) y lógica pura del combate en funciones puras (sin UI).
2. Separar **presentación** (components) de **estado** (stores). Evitar lógica en JSX.
3. Para el drag & drop, usar `@dnd-kit/sortable` con `sensors` para *touch*. Incluir tests básicos de reorder.
4. No hardcodear rutas absolutas; usar envs y `import.meta.env`/`process.env`.
5. Mantener accesibilidad (roles, focus, teclas) y performance (memoización).

---

## 📄 Licencia

MIT — hazlo tuyo, pero menciona al autor.

---

## 📬 Contacto
juancruznavarro592@gmail.com
Agrega tu email/redes dentro del juego (en la carta principal y en el footer) y un CTA visible de “Contratar/Contactar”.
