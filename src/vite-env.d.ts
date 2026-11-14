/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_RELEASE_NOTES__: {
  version: string;
  summary: string;
  items?: string[];
  builtAt?: string;
} | null;