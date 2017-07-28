/**
 * Local dependencies
 */
const HMAC = require('./HMAC')
const ECDSA = require('./ECDSA')
const RSASSA_PKCS1_v1_5 = require('./RSASSA-PKCS1-v1_5')
const AES_GCM = require('./AES-GCM')
const AES_CBC = require('./AES-CBC')
const SupportedAlgorithms = require('./SupportedAlgorithms')

/**
 * Register Supported Algorithms
 */
const supportedAlgorithms = new SupportedAlgorithms

/**
 * Encrypt
 */
supportedAlgorithms.define('A128GCM', 'encrypt', new AES_GCM({
  name: 'AES-GCM',
  length: 128,
  tagLength: 128
}))

supportedAlgorithms.define('A192GCM', 'encrypt', new AES_GCM({
  name: 'AES-GCM',
  length: 192,
  tagLength: 128
}))

supportedAlgorithms.define('A256GCM', 'encrypt', new AES_GCM({
  name: 'AES-GCM',
  length: 256,
  tagLength: 128
}))

// supportedAlgorithms.define('A128CBC-HS256', 'encrypt', new AES_CBC({
//   name: 'AES_128_CBC_HMAC_SHA_256',
//   hash: {
//     name: 'HS256'
//   }
// }))

/**
 * Decrypt
 */
 supportedAlgorithms.define('A128GCM', 'decrypt', new AES_GCM({
   name: 'AES-GCM',
   length: 128,
   tagLength: 128
 }))

 supportedAlgorithms.define('A192GCM', 'decrypt', new AES_GCM({
   name: 'AES-GCM',
   length: 192,
   tagLength: 128
 }))
 
 supportedAlgorithms.define('A256GCM', 'decrypt', new AES_GCM({
   name: 'AES-GCM',
   length: 256,
   tagLength: 128
 }))

/**
 * Sign
 */
supportedAlgorithms.define('HS256', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('HS384', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('HS512', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-512'
  }
}))

supportedAlgorithms.define('RS256', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('RS384', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('RS512', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}))

supportedAlgorithms.define('KS256', 'sign', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'K-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES256', 'sign', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES384', 'sign', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('ES512', 'sign', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-512'
  }
}))

//supportedAlgorithms.define('PS256', 'sign', {})
//supportedAlgorithms.define('PS384', 'sign', {})
//supportedAlgorithms.define('PS512', 'sign', {})
supportedAlgorithms.define('none', 'sign', {})

/**
 * Verify
 */
supportedAlgorithms.define('HS256', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('HS384', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('HS512', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-512'
  }
}))

supportedAlgorithms.define('RS256', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('RS384', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('RS512', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}))

supportedAlgorithms.define('KS256', 'verify', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'K-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES256', 'verify', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES384', 'verify', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('ES512', 'verify', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-512'
  }
}))

//supportedAlgorithms.define('PS256', 'verify', {})
//supportedAlgorithms.define('PS384', 'verify', {})
//supportedAlgorithms.define('PS512', 'verify', {})
supportedAlgorithms.define('none', 'verify', {})

supportedAlgorithms.define('RS256', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('RS384', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('RS512', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}))

supportedAlgorithms.define('KS256', 'importKey', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'K-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES256', 'importKey', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-256'
  }
}))

supportedAlgorithms.define('ES384', 'importKey', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-384'
  }
}))

supportedAlgorithms.define('ES512', 'importKey', new ECDSA({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: {
    name: 'SHA-512'
  }
}))

// supportedAlgorithms.define('A128CBC-HS256', 'importKey', new AES_CBC({
//   name: 'AES_128_CBC_HMAC_SHA_256',
//   hash: {
//     name: 'HS256'
//   }
// }))

/**
 * Export
 */
module.exports = supportedAlgorithms
