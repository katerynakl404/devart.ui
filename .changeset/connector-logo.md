---
'@devart/ui-react': minor
---

Add `ConnectorLogo` — the brand mark for a data-source connector, at four tile
sizes.

Marks are inlined in the package as data URIs, so nothing is fetched at render
time and a logo cannot arrive as a broken image in a consumer's build, in
Storybook, or on a design canvas. A connector the pack does not carry falls back
to a monogram tile rather than an empty box, and names resolve loosely
(`PostgreSQL`, `postgresql`, `Postgres` and `Amazon S3` all find their mark), so
a page does not have to know the slug.

The pack ships small on purpose — it is generated from the app's connector SVG
folder by `scripts/gen-connector-logos.mjs`, so widening it is a re-run of that
script, not a code change.
