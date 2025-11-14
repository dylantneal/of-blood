declare module 'next/font/google' {
  type NextFont = {
    className: string;
    style: { fontFamily: string; [key: string]: any };
  };
  
  type NextFontWithVariable = NextFont & {
    variable: string;
  };
  
  type FontOptions<T extends string | undefined = undefined> = {
    weight?: string | string[];
    style?: string | string[];
    subsets?: string[];
    display?: string;
    variable?: T;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
  };
  
  export function Inter<T extends string | undefined = undefined>(
    options?: FontOptions<T>
  ): T extends string ? NextFontWithVariable : NextFont;
  
  export function Cinzel<T extends string | undefined = undefined>(
    options?: FontOptions<T>
  ): T extends string ? NextFontWithVariable : NextFont;
}

