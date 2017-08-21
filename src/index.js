/**
 * @module JSON Object Signing and Encryption (JOSE)
 */
const JWK = require('./jose/JWK')
const JWKSet = require('./jose/JWKSet')
const JWT = require('./jose/JWT')
const JWD = require('./jose/JWD')
const Base64URLSchema = require('./schemas/Base64URLSchema')
const JOSEHeaderSchema = require('./schemas/JOSEHeaderSchema')
const JWKSchema = require('./schemas/JWKSchema')
const JWKSetSchema = require('./schemas/JWKSetSchema')
const JWTClaimsSetSchema = require('./schemas/JWTClaimsSetSchema')
const JWTSchema = require('./schemas/JWTSchema')


/**
 * Export
 */
module.exports = {
  JWK,
  JWKSet,
  JWT,
  JWD,
  Base64URLSchema,
  JOSEHeaderSchema,
  JWKSchema,
  JWKSetSchema,
  JWTClaimsSetSchema,
  JWTSchema
}
