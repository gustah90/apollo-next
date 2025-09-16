# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.7] - 2025-09-16

### Added

- **Scroll + A11Y utilities**:
  - ScrollToTop component applied to pages (scrolls to top on entry/query change and focuses #main-content)
  - Fallback scrolling to breadcrumb when available
- **Footer email contact**:
  - Single-click mailto: link with suggested subject ("Launch portal support request") and optional body

### Changed

- **Breadcrumb component**:
  - CustomBreadcrumb with predictable IDs for ScrollToTop usage and accessible navigation

### Fixed

- **Mobile menu (Sheet) integration**:
  - Fixed NavLink integration with onNavigateStart to properly close sheet and restore trigger functionality
- **next/image optimizations**:
  - Added proper sizes for images with fill
  - Maintained priority only on LCP image (cover) with loading="lazy" for others
- **Test stability improvements**:
  - Adjusted mocks for components and API calls specific to launches list functionality

---

## [0.1.6] - 2025-09-15

### Added

- **Launches page (CSR) with Suspense boundary**:
  - Split `/launches` into a server entry (`page.tsx`) and a client container (`LaunchesClient.tsx`) wrapped in `<Suspense>` with a loading fallback.
  - Elegant **infinite scroll** via `IntersectionObserver` (6 cards per page).
  - **Pull-to-refresh at list end** for mobile (touch) and desktop (wheel) to retry fetching when reaching the end.
- **Full-page navigation spinner**:
  - New `NavLink` client component that shows a full-screen overlay spinner while navigating using `router.push` and React transitions.
  - Accessible status (`role="status"`, `aria-live="polite"`).
- **Video-only deep link** for Launches:
  - `/?video=1` query support to show only launches with `links.video_link`.
- **Shared Launch type**:
  - Single source of truth for the `Launch` interface (nullable fields aligned with SpaceX schema).

### Changed

- **API layer**:
  - Introduced CSR/SSR/Universal fetch helpers (`getLaunchesCSR`, `getLaunches`, `getLaunchesUniversal`, etc.).
  - Centralized sorting (newest first) and safe fallbacks.
- **Caching controls**:
  - Forced dynamic rendering and disabled fetch cache where appropriate (`dynamic = 'force-dynamic'`, `fetchCache = 'force-no-store'`, and CSR client `fetch` with `cache: 'no-store'`).
- **Home cards behavior**:
  - Stats cards now link to `/launches`, and the “Video” card links to `/launches?video=1`.

### Fixed

- **Next.js 15 build error**:
  - Resolved `useSearchParams()` CSR bailout by moving it into the client component and wrapping the page in `<Suspense>`.
- **Mobile header sheet**:
  - Clicking a navigation item now closes the menu and re-enables the trigger; integrated with `NavLink` (`onNavigateStart`) to dismiss the sheet before routing.
- **Duplicate keys & image domains**:
  - De-dupe on infinite scroll to avoid React key collisions.
  - Added required `next/image` domains (`images2.imgbox.com`, `live.staticflickr.com`, `farm*.staticflickr.com`).
- **Tests stability**:
  - Ensured `@testing-library/jest-dom` is loaded for matchers.
  - Improved Jest mocks for API and UI primitives used by the launches page.

---

## [0.1.4] - 2025-09-15

### Added

- **Complete GitHub Actions CI/CD pipeline** with a comprehensive workflow:
  - Automated tests on all branches and pull requests
  - Type checking, linting, and formatting validation
  - Execution of unit tests with coverage reporting
  - Build verification for production readiness
  - Integration with Codecov for private repository coverage reports

- **Continuous Deployment (CD) to Vercel**:
  - Automatic Vercel deployment after successful CI
  - Automatic semantic versioning with Git tags
  - Automated GitHub Releases for each deployment
  - Version validation to prevent duplicate deployments

- **Secrets configuration** for secure integration:
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  - `GITHUB_TOKEN` permissions configured for tag pushing

### Fixed

- **Test coverage collection** now works properly in the CI pipeline
- **Jest configuration** optimized for both local dev and CI environments
- **403 permission error** fixed when pushing tags from GitHub Actions
- **Tag format error** fixed when creating GitHub Releases

### Changed

- **Optimized CI pipeline** with proper caching and dependency management
- **Test execution** improved with worker configuration for CI environments
- **Automated versioning flow** made consistent and reliable

---

## [0.1.1] - 2025-09-14

### Added

- **Full CD implementation** for automatic deployment to Vercel
- **Automatic versioning system** with Git tags and GitHub Releases
- **Version validation** to prevent versioning conflicts
- **Continuous integration** between CI and CD with proper dependencies

### Fixed

- **Authentication errors resolved** with Vercel and GitHub
- **Vercel CLI command fixes** in workflow
- **Permission setup** corrected for pushing tags and releases

---

## [0.1.0] - 2025-09-13

### Added

- **Next.js setup** with App Router and Turbopack enabled
- **Apollo Client** for GraphQL integration (SpaceX API)
- **Tailwind CSS v4** and **shadcn/ui** with Radix primitives
- **ESLint setup** with Next.js, TypeScript, Prettier, and Stylelint
- **TypeScript setup** with strict mode, path aliases (`@/*`), Jest typings
- **Husky + lint-staged** for pre-commit hooks (linting, formatting, type-check)
- **Jest setup** with SWC, React Testing Library, and jest-dom matchers
- **Custom mocks** for `next/image`, stylesheets, and file assets
- **Cypress setup** for E2E testing with support and fixture folders
- **Coverage collection** with exclusions for non-testable files (layouts, UI atoms, utils)
- **Basic App Router pages**:
  - `Home` (`/`) with welcome message and link to About
  - `About` (`/about`) with navigation link back to Home
- **Unit tests** for HomePage and AboutPage (RTL)
- **E2E navigation test** between `/` and `/about` (Cypress)
- `.nvmrc` file added with Node.js version `20.17.0`
- Node.js version enforcement via `engines` field in `package.json`:
  ```json
  "engines": {
    "node": "20.x",
    "npm": ">=10 <12"
  }
  ```
