# Versioning and Releases

## Semantic Versioning

This project follows `MAJOR.MINOR.PATCH`.

- `MAJOR`: breaking changes
- `MINOR`: backward-compatible features
- `PATCH`: backward-compatible fixes

## Commit Mapping

Release automation interprets commit history using Conventional Commits:

- `feat`: increments `MINOR`
- `fix`: increments `PATCH`
- `perf`: increments `PATCH`
- `feat!` or `BREAKING CHANGE`: increments `MAJOR`

Other commit types usually do not trigger a version bump unless configured otherwise.

## Release Automation

`release-please` is configured as the release manager.

On merges to `main`, it:

1. Calculates the next semantic version
2. Updates `CHANGELOG.md`
3. Creates or updates the release PR
4. Creates the Git tag after the release PR is merged
5. Publishes the GitHub Release

## Examples

Examples of next-version behavior:

- `fix(api): handle invalid payload` -> `1.0.1`
- `feat(queue): add delayed retries` -> `1.1.0`
- `feat(api)!: rename inspection response` -> `2.0.0`

## Changelog Format

Changelog entries are organized into:

- Features
- Fixes
- Refactors
- Breaking Changes

## Local Workflow

Recommended workflow:

```bash
npm install
npm run prepare
git checkout -b feature/my-change develop
git commit -m "feat(scope): concise description"
git push origin feature/my-change
```
