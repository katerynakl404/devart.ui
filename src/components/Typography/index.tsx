'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  PropsWithChildren,
  ReactNode,
  Ref,
} from 'react';
import { cn } from '../../lib/utils';

const typographyVariants = cva(null, {
  variants: {
    variant: {
      h1: 'scroll-m-20 font-medium text-3xl md:text-4xl',
      h2: 'scroll-m-20 font-medium text-2xl md:text-3xl',
      h3: 'scroll-m-20 font-medium text-xl md:text-2xl',
      h4: 'scroll-m-20 font-medium text-lg md:text-xl',
      h5: 'scroll-m-20 font-medium text-base md:text-lg',
      h6: 'scroll-m-20 font-medium text-sm md:text-base',
      p: 'font-normal text-sm',
      div: 'font-normal text-base',
      span: 'font-medium text-sm',
      blockquote: 'font-medium italic',
      code: 'font-mono font-semibold',
      lead: 'font-semibold text-xl',
      large: 'font-semibold text-lg',
    },
    /**
     * The named type scale: size + weight + line-height decided together, so
     * no call site re-decides them. Nineteen styles on eight size rungs —
     * Heading carries 500 and Title carries 600 across the same rungs, so a
     * heading and a title at 20px differ by weight, not size.
     *
     * Prefer this over `variant`. Choose the semantic element separately with
     * `element` — the level comes from content hierarchy, the size from here.
     */
    textStyle: {
      // Display — standalone numerals that are the page (the 404 code).
      display: 'font-medium text-display tracking-display',

      // Heading · 500
      heading36: 'font-medium text-4xl',
      heading30: 'font-medium text-3xl',
      heading24: 'font-medium text-2xl',
      heading20: 'font-medium text-xl',
      heading16: 'font-medium text-base',

      // Title · 600
      title30: 'font-semibold text-3xl',
      title24: 'font-semibold text-2xl',
      title20: 'font-semibold text-xl',
      title16: 'font-semibold text-base',
      title14: 'font-semibold text-sm',
      title12: 'font-semibold text-xs',

      // Body · 400
      body16: 'font-normal text-base',
      body14: 'font-normal text-sm',
      body12: 'font-normal text-xs',

      // Label · 500. xxs carries no paired line-height, so it is set here.
      label14: 'font-medium text-sm',
      label12: 'font-medium text-xs',
      label10: 'font-medium text-xxs leading-4',

      // Overline · 600, uppercase, +.08em
      overline: 'font-semibold text-xxs uppercase leading-4 tracking-caps',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    textColor: {
      primary: 'text-ink-primary',
      secondary: 'text-ink-secondary',
      light: 'text-ink-inactive',
      body: 'text-ink-body',
      accent: 'text-brand-primary',
      success: 'text-fb-green',
      destructive: 'text-fb-red-text',
      warning: 'text-fb-attention',
      white: 'text-content-on-solid',
      inherit: 'text-inherit',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    noWrap: {
      true: 'whitespace-nowrap',
      false: null,
    },
    weight: {
      light: 'font-light', //300
      normal: 'font-normal', //400
      medium: 'font-medium', //500
      semibold: 'font-semibold', //600
      bold: 'font-bold', //700
      extrabold: 'font-extrabold', //800
      black: 'font-black', //900
    },
    underline: {
      true: 'underline',
      false: null,
    },
    lineThrough: {
      true: 'line-through',
      false: null,
    },
    overline: {
      true: 'overline',
      false: null,
    },
  },
  defaultVariants: {
    variant: 'p',
    textColor: 'primary',
    align: 'left',
    noWrap: false,
  },
});

type TypographyElementVariants = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>;

/**
 * Maps variant keys to their standard HTML semantic tags.
 */
const variantElementMap: Record<TypographyElementVariants, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  span: 'span',
  div: 'div',
  blockquote: 'blockquote',
  code: 'code',
  lead: 'p',
  large: 'div',
};

type TypographyStyleProps = VariantProps<typeof typographyVariants>;

export type TypographyProps<E extends ElementType = 'p'> =
  TypographyStyleProps & {
    element?: E;
    ref?: Ref<ComponentRef<E>>;
    children?: ReactNode;
  } & Omit<ComponentPropsWithoutRef<E>, 'children' | 'color' | 'ref'>;

/*
 * A flexible typography component that supports semantic HTML tags and
 * consistent design system styles for text, headings, and specialized blocks.
 * It allows overriding the semantic element independently of the visual variant.
 */
export function Typography<E extends ElementType = 'p'>({
  className,
  variant,
  textStyle,
  align,
  noWrap,
  textColor,
  element,
  underline,
  overline,
  lineThrough,
  leading,
  weight,
  ref,
  ...props
}: PropsWithChildren<TypographyProps<E>>) {
  const Component = element || (variant ? variantElementMap[variant] : 'p');

  return (
    <Component
      ref={ref}
      className={cn(
        typographyVariants({
          variant,
          textStyle,
          align,
          noWrap,
          textColor,
          weight,
          lineThrough,
          underline,
          overline,
          leading,
          className,
        })
      )}
      {...(props as ComponentPropsWithoutRef<E>)}
    />
  );
}
