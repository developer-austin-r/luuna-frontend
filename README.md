# Luuna Frontend

Production-ready Next.js frontend built with the App Router, React, TypeScript,
Tailwind CSS, Redux Toolkit, ESLint, Prettier, Husky, and lint-staged.

## Versions

This project was generated and configured for Node.js v24 and npm.

| Package       | Version   |
| ------------- | --------- |
| Next.js       | `16.2.10` |
| React         | `19.2.4`  |
| React DOM     | `19.2.4`  |
| TypeScript    | `^5`      |
| Tailwind CSS  | `^4`      |
| Redux Toolkit | `^2.12.0` |
| React Redux   | `^9.3.0`  |

Node requirements are enforced in `package.json`:

```json
{
  "node": ">=24.0.0",
  "npm": ">=11.0.0"
}
```

## Commands Used

The project was scaffolded with:

```bash
npx create-next-app@latest luuna-frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Redux packages:

```bash
npm install @reduxjs/toolkit react-redux
```

Development tooling:

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-import eslint-import-resolver-typescript eslint-plugin-unused-imports eslint-plugin-simple-import-sort husky lint-staged
```

Husky setup:

```bash
npm run prepare
chmod +x .husky/pre-commit
```

## Getting Started

Install dependencies:

```bash
npm ci
```

Create a local env file:

```bash
cp .env.example .env.development
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Script                 | Purpose                                |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the Next.js development server   |
| `npm run build`        | Create a production build              |
| `npm run start`        | Run the production server              |
| `npm run lint`         | Run ESLint with zero warnings allowed  |
| `npm run lint:fix`     | Auto-fix ESLint issues where possible  |
| `npm run lint-staged`  | Run lint-staged on staged files        |
| `npm run format`       | Format the project with Prettier       |
| `npm run format:check` | Check formatting without writing files |
| `npm run type-check`   | Run TypeScript with `noEmit`           |
| `npm run prepare`      | Install Husky Git hooks                |

## Environment Variables

Files included:

- `.env.example`
- `.env.development`
- `.env.production`

Current variables:

```env
APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Next.js environment rules:

- Variables without `NEXT_PUBLIC_` are server-only.
- Variables with `NEXT_PUBLIC_` are bundled for browser/client code.
- Use `NEXT_PUBLIC_` only for values that are safe to expose publicly.
- Secrets, tokens, and private backend credentials must never use
  `NEXT_PUBLIC_`.

The app reads environment values from `src/config/env.ts`.

## Project Structure

```text
src/
  app/                 App Router routes, layouts, loading, error UI
  components/          Shared reusable UI components
  config/              App and environment configuration
  constants/           Shared application constants
  features/            Feature-based modules
    counter/           Sample Redux Toolkit counter feature
  hooks/               Shared React hooks
  lib/                 Framework or third-party library setup
  providers/           App-level providers for the App Router
  redux/               Store, typed hooks, and slices
    slices/            Redux Toolkit slices
  services/            API clients and external service access
  styles/              Shared style documentation or CSS modules
  types/               Shared TypeScript types
  utils/               Shared utilities
```

## Redux Toolkit

Redux is configured in `src/redux/store.ts`.

Typed hooks live in `src/redux/hooks.ts`:

- `useAppDispatch`
- `useAppSelector`

The provider lives in `src/providers/redux-provider.tsx` and is mounted in the
App Router through `src/providers/index.tsx`, then used by `src/app/layout.tsx`.

The sample feature is:

```text
src/features/counter/
  counter-card.tsx
  index.ts
src/redux/slices/counter-slice.ts
```

`counter-card.tsx` is a client component because it uses Redux hooks and browser
events.

## TypeScript

TypeScript is configured with strict mode and extra safety options:

- `strict`
- `exactOptionalPropertyTypes`
- `noUncheckedIndexedAccess`
- `noImplicitOverride`
- `noFallthroughCasesInSwitch`
- `forceConsistentCasingInFileNames`
- `moduleResolution: "bundler"`
- `paths` alias for `@/*`

The `@/*` alias points to `src/*`.

## ESLint

ESLint uses the flat config format in `eslint.config.mjs`.

Included rules and plugins:

- Next.js Core Web Vitals rules
- Next.js TypeScript rules
- `@typescript-eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-import`
- `eslint-plugin-unused-imports`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-prettier`

Lint runs with `--max-warnings=0` so warnings fail CI and local checks.

## Prettier

Prettier is configured with:

- `.prettierrc`
- `.prettierignore`

`eslint-config-prettier` prevents formatting conflicts with ESLint.
`eslint-plugin-prettier` reports Prettier issues through ESLint.

## Husky and lint-staged

The pre-commit hook runs:

```bash
npm run lint-staged
npm run type-check
```

`lint-staged` formats and fixes staged files. `type-check` runs across the full
project so TypeScript can validate the complete program graph.

## Best Practices Included

- App Router with `src/app`
- Server-first page structure
- Client components only where browser state/events are needed
- Global layout and metadata
- Offline-safe font optimization with `next/font/local`
- Loading UI with `src/app/loading.tsx`
- Error boundary with `src/app/error.tsx`
- Not-found UI with `src/app/not-found.tsx`
- Absolute imports through `@/*`
- Feature-based Redux architecture
- Barrel exports for stable module boundaries
- Strict TypeScript
- Import sorting and unused import detection
- Pre-commit lint, format, and type-check workflow

## Package Purpose

| Package                             | Why it is installed                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `next`                              | React framework with App Router, server components, routing, bundling, and production build tooling |
| `react`                             | Core UI library                                                                                     |
| `react-dom`                         | DOM renderer for React                                                                              |
| `@reduxjs/toolkit`                  | Standard Redux setup with slices, immutable updates, and typed store configuration                  |
| `react-redux`                       | React bindings for Redux state and dispatch                                                         |
| `typescript`                        | Static typing for maintainable application code                                                     |
| `tailwindcss`                       | Utility-first styling                                                                               |
| `@tailwindcss/postcss`              | Tailwind 4 PostCSS integration used by Next                                                         |
| `eslint`                            | Static analysis and code-quality checks                                                             |
| `eslint-config-next`                | Official Next.js ESLint rules                                                                       |
| `@typescript-eslint/parser`         | Parses TypeScript for ESLint                                                                        |
| `@typescript-eslint/eslint-plugin`  | TypeScript-specific lint rules                                                                      |
| `eslint-plugin-react-hooks`         | Enforces React Hooks rules                                                                          |
| `eslint-plugin-react-refresh`       | Guards component export patterns for refresh-compatible code                                        |
| `eslint-plugin-import`              | Import hygiene checks                                                                               |
| `eslint-import-resolver-typescript` | Lets ESLint understand TypeScript paths such as `@/*`                                               |
| `eslint-plugin-unused-imports`      | Removes and reports unused imports                                                                  |
| `eslint-plugin-simple-import-sort`  | Stable import and export ordering                                                                   |
| `prettier`                          | Consistent formatting                                                                               |
| `eslint-config-prettier`            | Disables ESLint rules that conflict with Prettier                                                   |
| `eslint-plugin-prettier`            | Surfaces Prettier issues in ESLint                                                                  |
| `husky`                             | Git hook management                                                                                 |
| `lint-staged`                       | Runs checks only against staged files before commit                                                 |

## Production Notes

- Replace `NEXT_PUBLIC_API_BASE_URL` in `.env.production` with the real API URL.
- Keep private secrets on the server and never expose them with `NEXT_PUBLIC_`.
- Run `npm run build` before deployment.
- Use `npm ci` in CI for reproducible installs.
