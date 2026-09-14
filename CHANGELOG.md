# Changelog

All notable changes to `@devart/ui-react` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Versions are produced with [Changesets](https://github.com/changesets/changesets)
(`pnpm changeset` → `pnpm version-packages` → tag `vX.Y.Z` → CI publish).

## [1.0.0] — 2026-09-10

### Added

- Initial publishable package extracted from the Insightis monorepo.
- Subpath exports for components, `cn`, `use-mobile`, `tailwind-preset`,
  `globals.css`, and `fonts.css`.
- Peer contract: `react`/`react-dom` `^19`, `tailwindcss` `^3.4`, optional
  `@types/react` `^19`.
