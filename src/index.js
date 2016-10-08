/**
 * @module JSON Object Signing and Encryption (JOSE)
 */
const JWA = require('./jose/JWA')
const JWK = require('./jose/JWK')
const JWKSet = require('./jose/JWKSet')
const JWT = require('./jose/JWT')
const JWS = require('./jose/JWS')


/**
 * Export
 */
module.exports = {
  JWA,
  JWK,
  JWKSet,
  JWT,
  JWS
}
