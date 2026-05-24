# Contributing Guide

## Objetivo

Este repositório segue um fluxo profissional para manter qualidade, previsibilidade de releases e histórico limpo.

## Branching

- `main`: produção
- `develop`: integração contínua
- `feature/*`: novas funcionalidades
- `fix/*`: correções não críticas
- `hotfix/*`: correções urgentes em produção
- `release/*`: estabilização antes de produção
- `chore/*`: manutenção técnica
- `docs/*`: documentação
- `refactor/*`: refatoração sem mudança funcional
- `test/*`: testes

Use nomes descritivos, por exemplo:

```text
feature/job-inspection-cache
fix/redis-timeout
docs/release-process
```

## Pull Requests

1. Crie a branch a partir de `develop`, exceto `hotfix/*`, que nasce de `main`.
2. Garanta `npm run verify` localmente.
3. Atualize documentação quando houver impacto de uso, arquitetura ou operação.
4. Abra PR usando o template oficial.
5. Mantenha o título do PR em Conventional Commits.

## Política de Merge

- `feature/*`, `fix/*`, `docs/*`, `refactor/*`, `test/*`, `chore/*` fazem PR para `develop`.
- `release/*` faz PR para `main` e depois merge de retorno para `develop`.
- `hotfix/*` faz PR para `main` e depois merge de retorno para `develop`.
- Merge padrão: `Squash and merge`.
- O título do PR deve ser o commit final do squash.

## Conventional Commits

Padrão:

```text
type(scope): subject
```

Tipos permitidos:

- `feat`
- `fix`
- `refactor`
- `docs`
- `style`
- `test`
- `build`
- `ci`
- `perf`
- `chore`

Exemplos:

```text
feat(queue): add delayed retry strategy
fix(api): handle invalid job identifiers
docs(release): document semantic version policy
```

Breaking changes:

```text
feat(api)!: rename job inspection response
```

Ou:

```text
BREAKING CHANGE: the inspection payload now exposes a new response contract
```

## Releases

- Releases são automatizadas com `release-please`.
- Commits em `main` determinam `major`, `minor` e `patch`.
- O changelog é atualizado automaticamente a cada release.

## Governança no GitHub

Consulte [docs/github-governance.md](docs/github-governance.md) para aplicar proteção de branches, reviews obrigatórios e políticas de segurança.

## Instalação das Ferramentas

Após liberar espaço em disco, execute:

```bash
npm install
npm run prepare
```

Isso ativa `husky`, `commitlint` e `lint-staged`.
