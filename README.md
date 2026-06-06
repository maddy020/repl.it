# Repl.it

A cloud-based online code execution and development platform — built as a Turborepo monorepo — that lets developers spin up isolated environments, write and run code, and deploy directly from the browser with zero local setup.

🎬 **[Watch Demo Video](https://www.loom.com/share/a1502d37c9844334ae8ea1c0152bba85)**

🌐 **[Live App](https://repl-it-web-pfo6.vercel.app)**

---

## What is Repl.it?

Repl.it is a browser-based development environment inspired by [Replit](https://replit.com). It provides:

- **Zero Setup Required** — Start coding instantly without installing or configuring local environments.
- **Persistent Workspaces** — Files and dependencies stay saved across sessions automatically.
- **Multi-Language Support** — Run code in multiple programming languages from a single platform.
- **Cloud-Powered Infrastructure** — Servers, runtimes, and scaling are handled for you.

---

## Monorepo Structure

This project uses [Turborepo](https://turborepo.com) and is organized as follows:

### Apps

- `apps/web` — The main [Next.js](https://nextjs.org/) frontend (landing page, dashboard, auth)
- `apps/docs` — Documentation [Next.js](https://nextjs.org/) app

### Packages

- `packages/@repo/ui` — Shared React component library used across apps
- `packages/@repo/eslint-config` — Shared ESLint configurations (`eslint-config-next`, `eslint-config-prettier`)
- `packages/@repo/typescript-config` — Shared `tsconfig.json` configurations

### Infrastructure

- `Docker/` — Dockerfiles for containerized deployment of the execution environment
- `helm/` — Helm charts for Kubernetes deployment
- `baseCode/` — Base runner/sandbox code for isolated code execution
- `.github/workflows/` — CI/CD pipelines

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Monorepo Tooling:** Turborepo
- **Infrastructure:** Docker, Kubernetes (Helm), Vercel
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint, Prettier

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Install dependencies

```bash
npm install
```

### Development

Run all apps and packages in development mode:

```bash
# With global turbo installed
turbo dev

# Or via npm
npx turbo dev
```

Run a specific app:

```bash
turbo dev --filter=web
```

### Build

Build all apps and packages:

```bash
turbo build
```

Build a specific app:

```bash
turbo build --filter=web
```

---

## Deployment

### Vercel (Frontend)

The `apps/web` frontend is deployed on [Vercel](https://vercel.com). Push to `main` triggers an automatic deployment via the GitHub Actions workflow.

### Docker & Kubernetes (Execution Backend)

The code execution backend is containerized with Docker and deployed via Helm on Kubernetes.

```bash
# Build Docker image
cd Docker
docker build -t repl-it .
```

Helm charts are in the `helm/` directory for Kubernetes cluster deployment.
