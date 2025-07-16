/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_REDIRECT_URL: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
