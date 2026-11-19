---
'@devart/ui-react': patch
---

`TableHead` cuts its label with an ellipsis under `layout="fixed"`, as `TableCell` cuts its text — a head narrower than its word no longer runs over the next column. New story `WidthLadder`; the Table examples and the cheat sheet take `width` instead of raw width classes (§53).
