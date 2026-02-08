# Typescript Monorepo

This project is a full-stack TypeScript monorepo.

## Architecture

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Zustand](https://zustand.docs.pmnd.rs/) (State), [TanStack Router](https://tanstack.com/router) (Routing), [tRPC](https://trpc.io/) (API Client).
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [tRPC](https://trpc.io/) (API Server), [Drizzle ORM](https://orm.drizzle.team/) (Postgres).
- **Infrastructure**: Docker Compose managing Node containers, PostgreSQL 18.
- **Tooling**: [pnpm](https://pnpm.io/) (Workspaces), [ESLint](https://eslint.org/) (Strict Linting), [Prettier](https://prettier.io/).

## Directory Structure

```text
/
├── apps/
│   ├── client/          # Vite + React Frontend
│   │   ├── src/
│   │   │   ├── components # UI Components
│   │   │   ├── routes/    # File-Based Routes
│   │   │   ├── store/     # Zustand Stores
│   │   │   ├── main.tsx   # Entry & Providers
│   │   │   └── trpc.ts    # tRPC Client Setup
│   └── server/          # Express + tRPC Backend
│       ├── src/
│       │   ├── db/         # Drizzle Schema & Config
│       │   ├── lib/        # Shared business logic
|       |   ├── controller/ # Functions that are assigned to routes in router.ts
│       │   └── router.ts   # tRPC API Routers
├── packages/
│   └── shared/          # Shared Zod Schemas & Types
├── docker/              # Dockerfiles for apps
└── docker-compose.yml   # Local development orchestration
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (Optional, for local install)
- pnpm (Optional)

## Configuration

- **Environment**: Managed via `.env` file (copied from `.env.example`).
- **Linting**: Run `./dev.sh lint` to check code quality. Configuration in `eslint.config.js`.

### Helper Script (`dev.sh`)

We provide a helper script to manage the application without needing local Node tools.

```bash
./dev.sh help
```

Common commands:

- `./dev.sh build`: Rebuild Docker images
- `./dev.sh start`: Start the stack
- `./dev.sh stop`: Stop the stack
- `./dev.sh lint`: Run linter
- `./dev.sh db:generate`: Generate migrations
- `./dev.sh db:migrate`: Run migrations

### Running Locally

The entire stack runs in Docker with hot-reloading enabled.

```bash
./dev.sh start
```

Use `./dev.sh stop` to stop the stack and clean up.

- **Frontend**: [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Backend**: [http://localhost:4000](http://localhost:4000) (Express Server)

### Development Workflow

- **Hot Reload**: Changes to `apps/client` or `apps/server` source files will automatically trigger updates in the running containers.
- **Logs**: View logs in the terminal running Docker Compose.

## implementing New Features

### 1. Database Changes

Modify the schema in `apps/server/src/db/schema.ts`.
Run migrations (from the host or inside container):

```bash
./dev.sh db:generate
./dev.sh db:migrate
```

### 2. Shared Types

Define input validation schemas in `packages/shared/src/index.ts`.

```typescript
import { z } from 'zod';
export const newUserSchema = z.object({ ... });
```

### 3. Backend Logic (tRPC)

Add a new procedure in `apps/server/src/router.ts`.

```typescript
export const appRouter = router({
  newUser: publicProcedure
    .input(newUserSchema) // Type-safe input from shared package
    .mutation(async ({ input }) => {
      // Database logic here
    }),
});
```

### 4. Frontend Routes & UI

- **Add Route**: Create a new file in `apps/client/src/routes/`.
  - `about.tsx` -> `/about`
  - `posts/$postId.tsx` -> `/posts/123`
- **Fetch Data**: Use the tRPC hook inside the component.

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return <div>About Page</div>;
}
```

### 5. Global State (Zustand)

Define new stores in `apps/client/src/store/`.

```typescript
export const useMyStore = create((set) => ({ count: 0 }));
```

Use in components:

```tsx
const count = useMyStore((state) => state.count);
```
