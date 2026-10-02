---
'@devart/ui-react': patch
---

The motion tokens get a page, and `Counter` shows both of its sizes.

`Foundations/Motion` is new. The durations, the reading window behind an undo, and the four list
movements — each one replayable, because a motion recipe shown as a number is a number: the only
way to review an exit is to watch it. They sit in Foundations rather than in each component's docs
because they are shared — a row leaving the upload plate and a row leaving a message queue are the
same event — and a consumer who re-derives the recipe gets it subtly wrong. The order of the fade
and the collapse is what makes it read as smooth, and that is not recoverable by inspection.

`Counter` had two sizes since it landed and the catalogue rendered neither of them: the control was
missing from `argTypes` and no story passed one, so it looked like a component with a single size.
The new story shows both, each beside the thing it is sized against — a size is only right relative
to its neighbour.
