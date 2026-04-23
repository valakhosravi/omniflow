# OmniFlow - Package Documentation

A quick reference of every dependency in the project and what it does.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **@dnd-kit/core** | `^6.3.1` | Core drag-and-drop engine used for reordering contract clauses and favorite services. |
| **@dnd-kit/sortable** | `^10.0.0` | Sortable preset for @dnd-kit, enabling sortable lists with drag-and-drop. |
| **@dnd-kit/utilities** | `^3.2.2` | CSS transform helpers for smooth drag-and-drop animations. |
| **@heroui/react** | `^2.8.0-beta.0` | Primary UI component library (buttons, inputs, modals, selects, tabs, etc.). |
| **@heroui/theme** | `^2.4.26` | Theme tokens and style utilities for @heroui/react components. |
| **@hookform/resolvers** | `^5.0.1` | Connects Yup validation schemas to react-hook-form via `yupResolver`. |
| **@internationalized/date** | `^3.9.0` | Internationalized date parsing and manipulation for Persian/Jalali date pickers. |
| **@react-aria/i18n** | `^3.12.12` | Provides `I18nProvider` with `fa-IR` locale for Persian calendar support. |
| **@reduxjs/toolkit** | `^2.8.2` | Redux store setup and slice creation for global state (auth, contracts, notifications). |
| **@tanstack/react-query** | `^5.74.3` | Server-state management — data fetching, caching, and cache invalidation for all API calls. |
| **@tanstack/react-query-devtools** | `^5.74.3` | DevTools panel for inspecting and debugging React Query state during development. |
| **axios** | `^1.8.4` | HTTP client configured with interceptors and base URL for all backend API communication. |
| **dayjs** | `^1.11.13` | Lightweight date manipulation and formatting library. |
| **dayjs-jalali** | `^0.0.2` | Jalali (Persian) calendar plugin for dayjs, enabling Persian date conversions. |
| **ejs** | `^3.1.10` | Template engine that generates HTML with dynamic data for PDF rendering via Puppeteer. |
| **exceljs** | `^4.4.0` | Generates `.xlsx` Excel files for exporting food orders and meal reports. |
| **framer-motion** | `12.23.22` | Animation library — peer dependency of @heroui/react, powers component transitions. |
| **iconsax-reactjs** | `^0.0.8` | Primary icon library used across the entire application. |
| **jodit-react** | `^5.2.38` | WYSIWYG rich-text editor for contract clauses, terms, and development descriptions. |
| **next** | `15.4.7` | Core application framework — file-based routing, API routes, SSR, and build tooling. |
| **puppeteer** | `^23.11.1` | Headless browser automation used to render HTML templates into PDF contract documents. |
| **react** | `^19.1.0` | Core UI library — components, hooks, and JSX rendering. |
| **react-dom** | `^19.1.0` | Renders the React component tree into the browser DOM. |
| **react-hook-form** | `^7.55.0` | Performant form state management, validation, and submission handling. |
| **react-icons** | `^5.5.0` | Supplementary icon library aggregating icons from multiple icon sets (FA, MD, etc.). |
| **react-multi-date-picker** | `^4.5.2` | Date picker component for selecting single or multiple dates in forms. |
| **react-redux** | `^9.2.0` | Connects React components to the Redux store via `useSelector` and `useDispatch`. |
| **redux-persist** | `^6.0.0` | Persists Redux state to localStorage so it survives page reloads. |
| **sanitize-html** | `^2.17.0` | Sanitizes HTML content to prevent XSS when rendering user-generated or notification HTML. |
| **yup** | `^1.6.1` | Schema-based form validation, integrated with react-hook-form. |
| **zustand** | `^5.0.4` | Lightweight hook-based state management for feature-specific stores (basket, tasks, etc.). |

---

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **@eslint/eslintrc** | `^3` | ESLint compatibility layer for using legacy configs in the flat config format. |
| **@tailwindcss/postcss** | `^4` | PostCSS plugin that enables Tailwind CSS processing during the build. |
| **@types/ejs** | `^3.1.5` | TypeScript type definitions for the ejs template engine. |
| **@types/node** | `^20` | TypeScript type definitions for Node.js APIs. |
| **@types/react** | `^19` | TypeScript type definitions for React. |
| **@types/react-dom** | `^19` | TypeScript type definitions for React DOM. |
| **@types/sanitize-html** | `^2.16.0` | TypeScript type definitions for sanitize-html. |
| **@typescript-eslint/eslint-plugin** | `^8.55.0` | ESLint plugin providing TypeScript-specific linting rules. |
| **@typescript-eslint/parser** | `^8.55.0` | ESLint parser that enables linting of TypeScript code. |
| **cross-env** | `^10.1.0` | Sets environment variables cross-platform in npm scripts. |
| **eslint** | `^9.35.0` | JavaScript/TypeScript linter for code quality enforcement. |
| **eslint-config-next** | `^16.1.6` | Next.js ESLint preset with Core Web Vitals and TypeScript rules. |
| **husky** | `9.1.7` | Git hooks manager for running linting and type-checking on commits. |
| **postcss** | `^8.5.6` | CSS transformation tool required by Tailwind CSS and the build pipeline. |
| **tailwindcss** | `^4` | Utility-first CSS framework used for styling the entire application. |
| **typescript** | `^5` | TypeScript compiler for static type checking and compilation. |
