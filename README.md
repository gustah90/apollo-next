<div align="center">

# apollo-next

A web application built with **Next.js** that serves as a portal for **SpaceX** launches, powered by the official SpaceX GraphQL API.

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg?style=flat&logo=semver&logoColor=white)](#changelog)
[![Node.js](https://img.shields.io/badge/node.js-20.x-339933.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19-61dafb.svg?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/next.js-15-black.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind%20css-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Apollo Client](https://img.shields.io/badge/apollo%20client-4.0.5-311C87.svg?style=flat&logo=apollo-graphql&logoColor=white)](https://www.apollographql.com/docs/react/)
[![Apollo Next.js Integration](https://img.shields.io/badge/apollo%20next.js%20integration-0.13.1-311C87.svg?style=flat&logo=apollo-graphql&logoColor=white)](https://www.apollographql.com/blog/apollo-client-integration-nextjs-officially-released)
[![GraphQL](https://img.shields.io/badge/graphql-16.11.0-E10098.svg?style=flat&logo=graphql&logoColor=white)](https://graphql.org/learn/)
[![Apollo Studio Docs](https://img.shields.io/badge/apollo%20studio-docs-311C87.svg?style=flat&logo=apollo-graphql&logoColor=white)](https://studio.apollographql.com/public/SpaceX-pxxbxen/variant/current/home)

[![License](https://img.shields.io/badge/license-MIT-green.svg?url=https%3A%2F%2Fapollo-next-alpha.vercel.app/privacy%2F)](https://apollo-next-alpha.vercel.app/privacy)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fapollo-next-alpha.vercel.app%2F)](https://apollo-next-alpha.vercel.app/)

</div>

<p align="center">
  <a href="#english">English</a> -
  <a href="#portugues">Português</a>
</p>

---

<a id="english"></a>

## Demo

Production deployment: https://apollo-next-alpha.vercel.app/

## Overview

apollo-next is a Next.js App Router project that lists SpaceX launches with details such as mission, date, rocket, media gallery, and external references. It focuses on performance, accessibility, and developer experience.

## Highlights

- 🚀 SpaceX launches catalog with details and media

- ♿ Accessible navigation (keyboard, screen readers, ARIA landmarks)

- ⚡ Image & CLS optimizations for better Lighthouse scores

- 🔄 CSR/SSR-friendly data layer with safe fallbacks

- 🧪 Solid unit tests (React Testing Library + Jest)

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript

- **GraphQL**: graphql, graphql-request, Apollo Client (helpers)

- **UI**: Tailwind CSS v4, shadcn/ui (Radix primitives), lucide-react

- **Testing**: Jest, @testing-library/react, Cypress (E2E optional)

## Architecture

- `app/*`: App Router pages and layouts

- `components/*`: UI primitives and layout components (shadcn)

- `lib/api.ts`: GraphQL client & helpers

- `types/*`: Shared TypeScript types (e.g., Launch)

- `tests/*`: Unit/integration tests and mocks

### Git Hooks with Husky

The project uses **Husky** to enforce code quality standards with pre-commit hooks:

- **Pre-commit validation:** Automatically runs linting, formatting, and type checking on staged files
- **Smart execution:** Skips hooks during merge operations, pull requests, and CI environments
- **Error prevention:** Prevents commits with linting errors or TypeScript issues
- **Consistent codebase:** Ensures all code follows the project's standards before being committed

```
# prerequisites
node -v   # 20.x
npm -v    # >=10 <12

# install deps
npm install

# run dev server
npm run dev  # http://localhost:3000

# type-check, lint, tests
npm run type-check
npm run lint
npm run test
```

## Scripts

- `dev` – start dev server

- `build` – production build

- `start` – run production server

- `lint` / `lint:fix` – ESLint checks

- `format` – Prettier formatting

- `test` / `test:watch` – Jest unit tests

- `coverage` – Jest coverage

- `type-check` – TypeScript noEmit

- `e2e` / `e2e:headless` – Cypress

## Testing

- **Unit/Integration**: Jest + React Testing Library

- **E2E**: Cypress

- Deterministic tests via mocks for Next.js (next/link, next/image, navigation) and UI components.

## CI/CD & Deployment

- Ready for GitHub Actions (tests, lint, type-check, build).

- Deployable on Vercel.

- Production URL: https://apollo-next-alpha.vercel.app/

## Contributing

- Fork the repo

- Create a branch: feat/your-change

- Commit with Conventional Commits

- Open a PR with a clear description

---

---

<a id="portugues"></a>

## Demo

Deploy de produção: https://apollo-next-alpha.vercel.app/

## Visão Geral

apollo-next é um projeto com App Router do Next.js que lista lançamentos da SpaceX com informações de missão, data, foguete, galeria de mídia e links externos. O foco é performance, acessibilidade e experiência do desenvolvedor.

## Destaques

- 🚀 Catálogo de lançamentos da SpaceX com detalhes e mídia

- ♿ Navegação acessível (teclado, leitores de tela, marcos ARIA)

- ⚡ Otimizações de imagem & CLS para melhores notas no Lighthouse

- 🔄 Camada de dados compatível com CSR/SSR e fallbacks seguros

- 🧪 Testes unitários sólidos (React Testing Library + Jest)

## Stack Tecnológica

- **Framework**: Next.js 15, React 19, TypeScript

- **GraphQL**: graphql, graphql-request, Apollo Client (helpers)

- **UI**: Tailwind CSS v4, shadcn/ui (Radix), lucide-react

- **Testes**: Jest, @testing-library/react, Cypress

## Arquitetura

- `app/*`: Páginas e layouts (App Router)

- `components/*`: Componentes de UI e layout (shadcn)

- `lib/api.ts`: Cliente GraphQL e helpers

- `types/*`: Tipos TypeScript compartilhados (ex.: Launch)

- `tests/*`: Testes unitários/integração e mocks

## Git Hooks com Husky

O projeto utiliza **Husky** para impor padrões de qualidade de código com hooks pre-commit:

- **Validação pre-commit**: Executa automaticamente linting, formatação e verificação de tipos nos arquivos staged

- **Execução inteligente**: Ignora hooks durante operações de merge, pull requests e ambientes de CI

- **Prevenção de erros**: Impede commits com erros de linting ou problemas TypeScript

- **Codebase consistente**: Garante que todo código siga os padrões do projeto antes de ser commitado

```
# pré-requisitos
node -v   # 20.x
npm -v    # >=10 <12

# instalar dependências
npm install

# rodar o servidor de desenvolvimento
npm run dev  # http://localhost:3000

# type-check, lint, testes
npm run type-check
npm run lint
npm run test
```

## Scripts

- `dev` – servidor de desenvolvimento

- `build` – build de produção

- `start` – servidor de produção

- `lint` / `lint:fix` – verificações com ESLint

- `format` – formatação com Prettier

- `test` / `test:watch` – testes com Jest

- `coverage` – cobertura do Jest

- `type-check` – TypeScript noEmit

- `e2e` / `e2e:headless` – Cypress

## Testes

- **Unitário/Integração**: Jest + React Testing Library

- **E2E**: Cypress

- Testes determinísticos com mocks do Next.js (next/link, next/image, navigation) e componentes de UI.

## CI/CD & Deploy

- Pronto para GitHub Actions (testes, lint, type-check, build).

- Deploy na Vercel.

- URL de produção: https://apollo-next-alpha.vercel.app/

## Contribuição

- Faça fork do repositório

- Crie uma branch: feat/sua-mudanca

- Faça commits seguindo Conventional Commits

- Abra um PR com descrição clara
