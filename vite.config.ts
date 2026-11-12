import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  UPDATE THESE BEFORE DEPLOYING                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
const SITE = {
  /** Name of this site in the backend and in PostHog. Keep it stable once live. */
  appName: 'routebench',
  /** Public URL of your landing-backend, without a trailing slash. */
  apiUrl: 'https://sitemtrics.runtrminimal.com',
  /** PostHog project API key (starts with "phc_"). Leave empty to switch PostHog off. */
  posthogKey: '',
  /** PostHog host: https://us.i.posthog.com, https://eu.i.posthog.com, or your self-hosted URL. */
  posthogHost: 'https://us.i.posthog.com',
  /** Record session replays in PostHog. Form inputs are always masked. */
  posthogRecordSessions: false,
}

/** GitHub Pages path. Must match the repository name exactly, capitals included. */
const PAGES_BASE = '/routerbench/'
// ════════════════════════════════════════════════════════════════════════════

// `npm run build`        -> dist/ for GitHub Pages, served from PAGES_BASE
// `npm run build:single` -> one self-contained dist-single/index.html
// Any value above can also be overridden at build time with VITE_API_URL, VITE_POSTHOG_KEY, VITE_POSTHOG_HOST.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const site = {
    ...SITE,
    apiUrl: env.VITE_API_URL || SITE.apiUrl,
    posthogKey: env.VITE_POSTHOG_KEY ?? SITE.posthogKey,
    posthogHost: env.VITE_POSTHOG_HOST || SITE.posthogHost,
  }

  return {
    base: mode === 'single' ? './' : PAGES_BASE,

    define: { __SITE__: JSON.stringify(site) },

    plugins: mode === 'single'
      ? [react(), viteSingleFile()]
      : [react()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    build: mode === 'single'
      ? { outDir: 'dist-single', emptyOutDir: true }
      : undefined,
  }
})
