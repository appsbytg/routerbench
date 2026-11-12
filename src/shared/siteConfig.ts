/**
 * Site settings, injected at build time from the SITE block in vite.config.ts.
 * Edit them there, not here.
 */
export interface SiteConfig {
  appName: string
  apiUrl: string
  posthogKey: string
  posthogHost: string
  posthogRecordSessions: boolean
}

export const site: SiteConfig = __SITE__

/** True once apiUrl has been changed from the placeholder. */
export const apiConfigured = !!site.apiUrl && !/your-domain|example\.com/.test(site.apiUrl)
export const api = (path: string) => `${site.apiUrl.replace(/\/+$/, '')}${path}`
