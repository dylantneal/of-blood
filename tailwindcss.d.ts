declare module 'tailwindcss' {
  export type Config = {
    content?: string[];
    theme?: any;
    plugins?: any[];
    darkMode?: string | string[];
    [key: string]: any;
  };
  
  export function defineConfig(config: Config): Config;
}

