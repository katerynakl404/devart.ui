/*
 * The package has no `@types/react-dom`: until the tour family no module
 * imported `react-dom` directly — every portal went through a Radix part. The
 * tour's layers portal on their own (they belong to no Radix root), and this
 * is the one signature they need. Adding `@types/react-dom` to devDependencies
 * makes this file redundant; the two declarations merge without conflict.
 */
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';

  export function createPortal(
    children: ReactNode,
    container: Element | DocumentFragment,
    key?: string | null
  ): ReactPortal;
}
