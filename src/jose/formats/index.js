
/**
 * PEM Regular Expression
 */
const PEM_REGEXP = /^-----BEGIN (.+) (PRIVATE|PUBLIC) KEY-----\s?\S[\s\S]+-----END \1 \2 KEY-----\s?/m

/**
 * Base64 Regular Expression
 */
const BASE64_REGEXP = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

/**
 * Export
 */
module.exports = {
  PEM_REGEXP,
  BASE64_REGEXP
}
