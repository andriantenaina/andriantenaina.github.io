interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_KEY?: string;
  readonly PUBLIC_UMAMI_SRC?: string;
  readonly PUBLIC_UMAMI_ID?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly PUBLIC_BING_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
