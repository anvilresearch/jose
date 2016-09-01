/**
 * Local dependencies
 */
const SupportedAlgorithms = require('./SupportedAlgorithms')

/**
 * Register Supported Algorithms
 */
const supportedAlgorithms = new SupportedAlgorithms

/**
 * Sign
 */
supportedAlgorithms.define('HS256', 'sign', { name: 'HMAC', hash: { name: 'SHA-256' } })
supportedAlgorithms.define('HS384', 'sign', { name: 'HMAC', hash: { name: 'SHA-384' } })
supportedAlgorithms.define('HS512', 'sign', { name: 'HMAC', hash: { name: 'SHA-512' } })
supportedAlgorithms.define('RS256', 'sign', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } })
supportedAlgorithms.define('RS384', 'sign', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-384' } })
supportedAlgorithms.define('RS512', 'sign', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-512' } })
//supportedAlgorithms.define('ES256', 'sign', {})
//supportedAlgorithms.define('ES384', 'sign', {})
//supportedAlgorithms.define('ES512', 'sign', {})
//supportedAlgorithms.define('PS256', 'sign', {})
//supportedAlgorithms.define('PS384', 'sign', {})
//supportedAlgorithms.define('PS512', 'sign', {})
supportedAlgorithms.define('none', 'sign', {})

/**
 * Verify
 */
supportedAlgorithms.define('HS256', 'verify', { name: 'HMAC', hash: { name: 'SHA-256' } })
supportedAlgorithms.define('HS384', 'verify', { name: 'HMAC', hash: { name: 'SHA-384' } })
supportedAlgorithms.define('HS512', 'verify', { name: 'HMAC', hash: { name: 'SHA-512' } })
supportedAlgorithms.define('RS256', 'verify', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } })
supportedAlgorithms.define('RS384', 'verify', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-384' } })
supportedAlgorithms.define('RS512', 'verify', { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-512' } })
//supportedAlgorithms.define('ES256', 'verify', {})
//supportedAlgorithms.define('ES384', 'verify', {})
//supportedAlgorithms.define('ES512', 'verify', {})
//supportedAlgorithms.define('PS256', 'verify', {})
//supportedAlgorithms.define('PS384', 'verify', {})
//supportedAlgorithms.define('PS512', 'verify', {})
supportedAlgorithms.define('none', 'verify', {})

/**
 * Export
 */
module.exports = supportedAlgorithms


