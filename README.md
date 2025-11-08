# Nelson Cabinetry Task 1

## Tech Stack

- **Next.js 16 + React 19 (App Router)** for the UI and route handlers.
- **three.js + @react-three/fiber** for the 3D + top-down scenes.
- **Firebase Firestore** for storing model positions/rotations (`models/{id}` with `position`, `rotation`, `updatedAt`).
- **Tailwind CSS + shadcn/ui** for the toggle, drop areas, and other controls.
- **TypeScript, ESLint 9, Prettier 3, Husky + lint-staged, Commitlint** for dev experience and CI parity.

## Prerequisites

- Node.js **>= 20** (see `.nvmrc`) and PNPM **>= 9**.
- Firebase project with Firestore enabled.
- Configure `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## Local Development

```bash
pnpm install
pnpm dev        # starts Next.js on http://localhost:3000
pnpm lint       # ESLint + Prettier (errors fail CI)
pnpm format     # Prettier --write with caching
```

Husky hooks block commits that fail lint-staged or Commitlint. Run `pnpm prepare` after cloning if hooks are missing.
