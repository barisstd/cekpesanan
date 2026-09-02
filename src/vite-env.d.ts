/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_APPS_SCRIPT_URL?: string;
  readonly VITE_CLIENT_TOKEN?: string;
  readonly VITE_ADMIN_WHATSAPP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
