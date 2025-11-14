declare module 'class-variance-authority' {
  import * as React from 'react';
  
  export type VariantProps<T> = T extends (...args: any[]) => any
    ? Parameters<T>[0] extends { variants: infer V }
      ? V extends Record<string, any>
        ? {
            [K in keyof V]?: V[K] extends Record<string, any>
              ? keyof V[K] | Array<keyof V[K]>
              : never;
          }
        : never
      : never
    : never;
  
  export function cva(
    base?: string,
    config?: {
      variants?: Record<string, Record<string, string>>;
      defaultVariants?: Record<string, any>;
      compoundVariants?: Array<Record<string, any>>;
    }
  ): (props?: Record<string, any>) => string;
}

