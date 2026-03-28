/**
 * Server middleware: adds security headers to every response.
 * Covers XSS, clickjacking, MIME-sniffing, referrer policy.
 */
export default defineEventHandler((event) => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  for (const [key, value] of Object.entries(headers)) {
    setResponseHeader(event, key, value)
  }
})
