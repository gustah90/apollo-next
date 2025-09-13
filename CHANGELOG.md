# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2025-09-13

### Added

- **Next.js setup** with App Router and Turbopack enabled
- **Apollo Client** for GraphQL integration (SpaceX API)
- **Tailwind CSS v4** and **shadcn/ui** with Radix primitives
- **ESLint** configuration with Next.js, TypeScript, Prettier and Stylelint
- **TypeScript config** with strict mode, path aliases (`@/*`), Jest typings
- **Husky + lint-staged** for pre-commit hooks (linting, formatting, type-check)
- **Jest setup** with SWC, React Testing Library and jest-dom matchers
- **Custom mocks** for `next/image`, stylesheets and file assets
- **Cypress setup** for E2E tests with support and fixtures folders
- **Coverage collection** with exclusions for non-testable files (layouts, UI atoms, utils)
- **Basic App Router pages**:
  - `Home` (`/`) with welcome message and link to About
  - `About` (`/about`) with navigation link back to Home
- **Unit tests** for HomePage and AboutPage (RTL)
- **E2E navigation test** between `/` and `/about` (Cypress)
- Added `.nvmrc` file with Node.js version `20.17.0`.
- Enforced Node.js version via `engines` field in `package.json`:
  ```json
  "engines": {
    "node": "20.x",
    "npm": ">=10 <12"
  }
  ```

### Fixed

- Jest typings issue (`toBeInTheDocument`) by adding proper setup and global types
- TextEncoder/TextDecoder polyfill for test environment
- Mock for `next/image` to avoid runtime errors during tests
- Avoided coverage noise by ignoring layout, UI components and utils

---

## [Unreleased]

- Implementation of SpaceX launches catalog with infinite scroll (CSR)
- Launch detail page with mission data, rocket info, images/videos and external links
- SSR vs CSR demonstration with Apollo Client
- Enhanced UI using shadcn/ui components
- Additional unit and E2E tests
