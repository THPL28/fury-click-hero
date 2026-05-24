# GitHub Governance Setup

## Branch Protection

Apply these rules to `main`:

- Require a pull request before merging
- Require at least 1 approval
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict direct pushes
- Restrict force pushes
- Restrict branch deletion

Required checks for `main`:

- `Lint, test and build`
- `Conventional PR title`
- `Commit message validation`
- `Secret scanning`

Apply these rules to `develop`:

- Require a pull request before merging
- Require at least 1 approval
- Require status checks to pass before merging
- Restrict direct pushes

## Reviews

- Use `CODEOWNERS` to request default review ownership.
- Prefer squash merge to keep the mainline history clean.
- Enforce Conventional Commit titles on PRs.

## Secrets and Security

- Enable GitHub secret scanning
- Enable Dependabot alerts
- Enable Dependabot security updates
- Use environment-scoped secrets for deployment

## Recommended Repository Settings

- Default branch: `main`
- Protect `develop` as integration branch
- Enable automatic deletion of merged branches
- Enable auto-merge only after required checks pass
