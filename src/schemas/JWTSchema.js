/**
 * Dependencies
 */
const Base64URLSchema = require('./Base64URLSchema')
const JWTClaimsSetSchema = require('./JWTClaimsSetSchema')
const JOSEHeaderSchema = require('./JOSEHeaderSchema')
const {JSONSchema} = require('json-document')

/**
 * JWTSchema
 *
 * @description
 * This schema represents all the things a deserialized JWT can be, i.e.,
 * either a JWS or JWE, and any serialization of them. Validation of well-
 * formedness for a given serialization is accomplished at the time of
 * encoding.
 */
const JWTSchema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * iv
     */
    iv: Base64URLSchema,

    /**
     * aad
     */
    aad: Base64URLSchema,

    /**
     * ciphertext
     */
    ciphertext: Base64URLSchema,

    /**
     * tag
     */
    tag: Base64URLSchema,

    /**
     * recipients
     */
    recipients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          header: JOSEHeaderSchema,
          encrypted_key: Base64URLSchema
        }
      }
    },

    /**
     * payload
     */
    payload: JWTClaimsSetSchema,

    /**
     * signatures
     */
    signatures: {
      type: 'array',
      // TODO pending JSON Document fix
      // items: {
      //   type: 'object',
      //   properties: {
      //     protected: JOSEHeaderSchema,
      //     header: JOSEHeaderSchema,
      //     signature: Base64URLSchema
      //   }
      // }
    },
  }
})

/**
 * Export
 */
module.exports = JWTSchema
