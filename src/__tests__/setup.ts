import '@testing-library/jest-dom/vitest';

// What jsdom lacks and every floating part — Tooltip, DropdownMenu, Popover —
// reaches for. One place, so a test that opens a menu needs nothing of its own.

// floating-ui asks every positioned element whether it is in the top layer —
// `matches(':popover-open')`, `matches(':modal')`. nwsapi 2.2.27 answers
// `:modal` through `:fullscreen` and `:fullscreen` through the native
// `matches`, which is nwsapi again: each call recurses until the stack
// overflows, about a second apiece, and one open menu cost ~25s. jsdom has no
// top layer, so `false` is the true answer.
const TOP_LAYER = new Set([':popover-open', ':modal', ':fullscreen']);
const nativeMatches = Element.prototype.matches;
Element.prototype.matches = function (this: Element, selector: string) {
  if (TOP_LAYER.has(selector)) return false;
  return nativeMatches.call(this, selector);
};

// Popper measures the content and the tooltip arrow with a `ResizeObserver`.
// A test that needs to drive one stubs its own over this.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
