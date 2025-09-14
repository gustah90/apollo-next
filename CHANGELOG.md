# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
