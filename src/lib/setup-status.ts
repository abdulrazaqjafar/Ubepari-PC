/** True once both env vars needed by the admin portal are set. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET);
}

export const ADMIN_NOT_CONFIGURED_MESSAGE =
  "Admin portal bado haijawekwa: weka DATABASE_URL na AUTH_SECRET kwenye Netlify environment variables. (Admin portal is not configured yet.)";
