---
'@devart/ui-react': minor
---

Six new components — a question's answers, a flow's progress, and a guided tour over the real interface — plus `CardFooter sticky`. All **draft** (DESIGN-SYSTEM-CHANGES.md §117–§123).

- **`StepProgress`** — a bar per step and "Step N of M": `steps`, `current`, `isStepDone`, `counter`, `showStepLabel`, `fill`, `size` (`md` | `sm`), and with `onStepSelect` every bar a button with a tooltip. The current step's label is a caption at both sizes.
- **`ChoiceGroup` · `ChoiceCard`** — a card-sized answer with the chosen state (brand border over a 5% wash). A single group is a radiogroup — roving tab stop, arrow keys move and choose — whose cards show the choice themselves; `onPick` reports a deliberate pick (click, Enter, Space) and not an arrow key. A multiple group is checkbox cards. Standalone, a toggle button; with `children`, an expandable card.
- **`Spotlight`** and **`useTargetRect`** — the page dimmed and blurred around one or more targets: one scrim layer with a rounded hole (`clip-path`), the cutout live, a brand ring concentric with what it lights that pulses and glides between targets; while it is in the page, toasts sit one step under the scrim and tooltips, menus and popovers one step over it. `useTargetRect` → `{ rect, bounds, radius, vw, vh }` is exported from the same entry.
- **`Coachmark`** — a popover-surface card with an arrow, placed on the first preferred side where it fits whole; a bottom sheet at 640px and below.
- **`AnnotationGroup` · `Annotation`** — labels on one line with curved arrows to dashed rings around specific controls.
- **`Tour`** — Spotlight + Coachmark (+ annotations) per step, the step held by the caller; → ← Esc, focus to the card on every step, a 300ms fade on close.

**`CardFooter`** — `sticky`: a card taller than the window keeps its actions in reach (`sticky bottom-0 z-10 bg-surface-card`). `cardFooterVariants` is now exported from `@devart/ui-react/Card`.

**Tokens** (`globals.css`, `:root`; the colour-mix ones mirrored in `.dark` for scoped themes): `--spotlight-blur`, `--spotlight-halo`, `--spotlight-glow`, `--shadow-spotlight`, `--spotlight-move`, `--spotlight-z`. The scrim reads `--overlay-scrim`. Exposed as `spotlight.halo` / `spotlight.glow` colours, `shadow-spotlight`, `backdrop-blur-spotlight`, and the `spotlight-in/out`, `annotation-in`, `spotlight-ring`, `coachmark-in/nudge/out` animations.
