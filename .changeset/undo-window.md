---
'@devart/ui-react': minor
---

One source for how long an undo stays on screen, and the `row-in` counterpart to `row-out`.

`--undo-window` (4000ms) joins the motion tokens in `globals.css`. It is not a motion step —
nothing animates for four seconds — it is a reading window: long enough to notice what happened
and reach the way back, short enough that it does not become part of the layout. Toast now reads
it at call time rather than holding its own number, so an undo that floats past and an undo that
sits in a list cannot drift apart. `TOAST_DEFAULT_DURATION` stays as the fallback for server
rendering and for tests with no stylesheet, and `getUndoWindow()` is exported beside it.

`row-in` is `row-out` reversed, and reversed in order too: the height opens first and the text
fades in only once there is room for it. It exists because a row that can leave a list can also
come back — an undo putting it back, or a row inserted into a list the reader is already looking
at — and the arrival was being improvised by consumers.
