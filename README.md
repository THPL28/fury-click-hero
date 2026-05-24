# Fury Click Hero API

[![CI](https://github.com/THPL28/fury-click-hero/actions/workflows/ci.yml/badge.svg)](https://github.com/THPL28/fury-click-hero/actions/workflows/ci.yml)
[![Release](https://github.com/THPL28/fury-click-hero/actions/workflows/release.yml/badge.svg)](https://github.com/THPL28/fury-click-hero/actions/workflows/release.yml)
[![Security](https://github.com/THPL28/fury-click-hero/actions/workflows/security.yml/badge.svg)](https://github.com/THPL28/fury-click-hero/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

API assíncrona em TypeScript para processamento de jobs e violações com `Express`, `BullMQ`, `Redis`, `Zod` e princípios de Clean Architecture.

## Visão Geral

O projeto expõe endpoints HTTP para enfileirar jobs, inspecionar processamento e receber violações externas. A aplicação separa domínio, casos de uso, adapters e infraestrutura para facilitar manutenção, evolução e operação em produção.

## Stack

- `Node.js` 20+
- `TypeScript`
- `Express`
- `BullMQ`
- `Redis`
- `Zod`
- `tsyringe`
- `Winston`
- `Docker Compose`

## Arquitetura

Estrutura principal:

```text
src/
  application/
  domain/
  infrastructure/
  interface-adapters/
```

Fluxo resumido:

1. Requisição entra em `controllers`.
2. Validação acontece com `Zod`.
3. `use-cases` e `services` executam regras de negócio.
4. `BullMQ` persiste e processa jobs via Redis.
5. `workers` executam tarefas em background.

## Instalação

Pré-requisitos:

- `Node.js` 20 ou superior
- `npm` 10 ou superior
- `Docker` + `Docker Compose`
- `Redis` local ou via compose

Passos:

```bash
cp .env.example .env
docker compose up -d
npm install
```

## Execução

Desenvolvimento:

```bash
npm run dev
```

Worker:

```bash
npm run worker
```

Build e execução:

```bash
npm run build
npm start
```

## Scripts

- `npm run build`: compila o projeto
- `npm run clean`: remove `dist`
- `npm run dev`: sobe a API em modo desenvolvimento
- `npm run worker`: sobe o worker BullMQ
- `npm run worker:start`: sobe o worker a partir de `dist`
- `npm run typecheck`: valida tipagem TypeScript
- `npm run lint`: executa lint
- `npm run test`: executa smoke tests
- `npm run verify`: executa `typecheck`, `lint` e `test`
- `npm run commitlint`: valida Conventional Commits

## Endpoints

- `GET /api/health`
- `POST /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/violations`

## Git e Versionamento

- Branches: `main`, `develop`, `feature/*`, `fix/*`, `hotfix/*`, `release/*`, `chore/*`, `docs/*`, `refactor/*`, `test/*`
- Commits: Conventional Commits
- Releases: `release-please` com SemVer
- Changelog: gerado automaticamente em `CHANGELOG.md`

Detalhes completos:

- [docs/branching-strategy.md](docs/branching-strategy.md)
- [docs/versioning.md](docs/versioning.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## CI/CD

Pipelines GitHub Actions incluídas:

- lint
- testes
- build
- validação de commits e PRs
- secret scanning
- releases automáticas

## Deploy

Fluxo recomendado:

1. Desenvolvimento contínuo em `develop`.
2. Estabilização opcional em `release/*`.
3. Merge em `main` com PR aprovado.
4. `release-please` cria tag, GitHub Release e atualiza changelog.

## Roadmap

- Adicionar suíte completa de testes unitários e integração
- Adicionar cobertura de observabilidade e métricas
- Externalizar persistência além de memória para violações
- Evoluir para infraestrutura containerizada por ambiente

## Monorepo

No estado atual, o projeto está melhor como repositório simples de uma única API. Se surgirem frontend, SDK, workers independentes ou pacotes compartilhados, a evolução natural é um monorepo com `apps/` e `packages/`.

## Governança

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [LICENSE](LICENSE)
