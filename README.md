# Nelson Cabinetry 3D Workspace

## Tech Stack

- **Next.js 16 + React 19 (App Router)** for routing and streaming UI.
- **three.js + @react-three/fiber + @react-three/drei** for rendering, cameras, gizmos, grids, and lighting helpers.
- **zustand** keeps camera mode, transforms, and uploaded assets in sync across the UI.
- **Tailwind CSS + shadcn/ui** power the control panel (view toggle, file inputs, sliders, cards).
- **Firebase Firestore** to store `{ position, rotation, updatedAt }` per model.
- **Tooling:** TypeScript, ESLint 9, Prettier 3, Husky + lint-staged, Commitlint, GitHub Actions CI.

## Prerequisites

- Node.js **>= 20** (see `.nvmrc`) and PNPM **>= 9**.
- Optional for now: a Firebase project with Firestore enabled so credentials are ready:

```
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## Running Locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint       # ESLint + prettier (fails on style drift)
pnpm format     # prettier --write with caching
```

Husky installs via `pnpm prepare` (run it if hooks are missing). Pre-commit runs lint-staged and `commitlint` guards every commit message.
