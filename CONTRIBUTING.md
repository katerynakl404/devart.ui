# Contributing

## Development

```bash
pnpm install
pnpm build
pnpm check-types
pnpm storybook
```

Use `pnpm` only (`packageManager` is pinned).

## Versioning (Changesets)

1. Author opens MR with code changes.
2. Before merge, run `pnpm changeset` and pick patch / minor / major.
3. After merge to the default branch, a maintainer runs:
   - `pnpm version-packages` (applies bumps + updates `CHANGELOG.md`)
   - commits the version bump
   - tags `vX.Y.Z` and pushes the tag — CI publishes to the Nexus registry

| Change | Bump |
|---|---|
| Recipe / token fix, no API change | patch |
| New component, variant, or export | minor |
| Removed / renamed export or prop, peer range change, intentional visual break | major |

CSS token changes in `globals.css` are at least **minor** — consumers that keep a local token copy must notice the drift.

### CI gate

The `version_check` job (MR pipelines only) runs `pnpm check-changeset`
(`scripts/check-changeset.mjs`). It diffs the MR against
`CI_MERGE_REQUEST_DIFF_BASE_SHA`, derives the bump the diff requires, and fails —
blocking the merge — when no changeset is present or the declared bump is lower.

| Change in the MR | Required bump |
|---|---|
| Removed / renamed public entry point, removed `export` from one, `exports` / `peerDependencies` / `engines` edited | major |
| New public entry point, new `export`, `globals.css` / `fonts.css` / `src/lib/constants.ts` / `src/lib/breakpoints.ts` touched | minor |
| Any other change under `src/`, `fonts/`, or `package.json` metadata | patch |
| Stories, tests, `.storybook/`, `scripts/`, markdown, tooling configs, `dist/` | none — no changeset needed |

Run it locally before pushing: `pnpm check-changeset` (needs the base branch
fetched). Editing `version` in `package.json` by hand only logs a warning —
`pnpm version-packages` owns that field.
