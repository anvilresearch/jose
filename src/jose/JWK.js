'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JSONSchema,JSONDocument} = require('json-document')
const {BASE64_REGEXP} = require('../formats')

/**
 * JWK Schema
 */
const schema = new JSONSchema({
  type: 'object',
  properties: {

    kty: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'RSA',
        'EC',
        'oct'
      ] // other values MAY be used
    },

    use: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'sig',
        'enc'
      ] // other values MAY be used
    },

    key_ops: {
      type: 'array',
      //format: 'case-sensitive',
      enum: [
        'sign',
        'verify',
        'encrypt',
        'decrypt',
        'wrapKey',
        'unwrapKey',
        'deriveKey',
        'deriveBits'
      ] // other values MAY be used
    },

    alg: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
        'none'
      ] // other values MAY be used
    },

    kid: {
      type: 'string'
    },

    x5u: {
      type: 'string',
      //format: 'url'
    },

    x5c: {
      type: 'array',
      //format: BASE64_REGEXP
    },

    x5t: {
      type: 'string',
      //format: BASE64_REGEXP
    },

    //'x5t#S256': {
    //  type: 'string',
    //  //format: BASE64_REGEXP
    //}
  }
})

/**
 * JWK Class
 *
 * @class
 * JWK is a base class that represents a JSON Web Key. It is extended by
 * ECPublicKey, RSAPublicKey, EncryptedJWK, and indirectly by ECPrivateKey and
 * RSAPrivateKey, through EncryptedJWK.
 */
class JWK extends JSONDocument {

  /**
   * Schema
   */
  static get schema () {
    return schema
  }

  /**
   * From PEM
   *
   * @param  {string} pem PEM
   * @throws {Error} This class method must be implemented by the subclass.
   */
  static fromPEM(pem) {
    throw new Error('This key type does not support PEM')
  }

  /**
   * To PEM
   *
   * @throws {Error} This method must be implemented by the subclass.
   */
  toPEM () {
    throw new Error('This key type does not support PEM')
  }
}

/**
 * Export
 */
module.exports = JWK
