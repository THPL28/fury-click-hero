# Branching Strategy

## Base Model

This repository uses a simplified Git Flow:

- `main`: production-ready code only
- `develop`: main integration branch

Supporting branches:

- `feature/*`
- `fix/*`
- `hotfix/*`
- `release/*`
- `chore/*`
- `docs/*`
- `refactor/*`
- `test/*`

## When to Use Each Branch

- `feature/*`: new behavior or capabilities
- `fix/*`: non-urgent bug fixes under active development
- `hotfix/*`: urgent production fixes
- `release/*`: final hardening before release
- `chore/*`: tooling, dependencies, maintenance
- `docs/*`: documentation only
- `refactor/*`: structural improvements without behavior changes
- `test/*`: tests or coverage improvements

## Pull Request Flow

1. Branch from `develop` unless working on `hotfix/*`.
2. Keep commits small and descriptive.
3. Run `npm run verify`.
4. Open a PR with a Conventional Commit title.
5. Request at least one review.
6. Resolve feedback and ensure CI is green.
7. Use `Squash and merge`.

## Merge Policy

- No direct pushes to `main`
- No direct pushes to `develop`
- Required checks must pass
- At least one approval required
- Dismiss stale reviews on new commits

## Release Strategy

1. Ongoing work lands in `develop`.
2. A `release/*` branch is created when a release window starts.
3. Only stabilization, docs, and release fixes are merged into `release/*`.
4. The release PR goes from `release/*` to `main`.
5. After merging to `main`, `release-please` creates the version tag and GitHub Release.
6. The release branch is merged back into `develop`.

## Hotfix Strategy

1. Create `hotfix/*` from `main`.
2. Apply the urgent fix.
3. Open PR to `main`.
4. After merge, back-merge to `develop`.
