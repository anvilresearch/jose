'use strict';

/**
 * @module JSON Object Signing and Encryption (JOSE)
 */
var JWA = require('./jose/JWA');
var JWK = require('./jose/JWK');
var JWKSet = require('./jose/JWKSet');
var JWT = require('./jose/JWT');
var JWS = require('./jose/JWS');
var Base64URLSchema = require('./schemas/Base64URLSchema');
var JOSEHeaderSchema = require('./schemas/JOSEHeaderSchema');
var JWKSchema = require('./schemas/JWKSchema');
var JWKSetSchema = require('./schemas/JWKSetSchema');
var JWTClaimsSetSchema = require('./schemas/JWTClaimsSetSchema');
var JWTSchema = require('./schemas/JWTSchema');

/**
 * Export
 */
module.exports = {
  JWA: JWA,
  JWK: JWK,
  JWKSet: JWKSet,
  JWT: JWT,
  JWS: JWS,
  Base64URLSchema: Base64URLSchema,
  JOSEHeaderSchema: JOSEHeaderSchema,
  JWKSchema: JWKSchema,
  JWKSetSchema: JWKSetSchema,
  JWTClaimsSetSchema: JWTClaimsSetSchema,
  JWTSchema: JWTSchema
};