/**
 * Dependencies
 */
const JOSEHeaderSchema = require('./JOSEHeaderSchema')
const JWTClaimsSetSchema = require('./JWTClaimsSetSchema')
const {JSONSchema} = require('@trust/json-document')

/**
 * JWSFlattenedSerializationSchema
 *
 * JSON Web Signature (JWS)
 * https://tools.ietf.org/html/rfc7515#section-7.2.2
 *
 * 7.2.2.  Flattened JWS JSON Serialization Syntax
 *
 *   The flattened JWS JSON Serialization syntax is based upon the general
 *   syntax but flattens it, optimizing it for the single digital
 *   signature/MAC case.  It flattens it by removing the "signatures"
 *   member and instead placing those members defined for use in the
 *   "signatures" array (the "protected", "header", and "signature"
 *   members) in the top-level JSON object (at the same level as the
 *   "payload" member).
 *
 *   The "signatures" member MUST NOT be present when using this syntax.
 *   Other than this syntax difference, JWS JSON Serialization objects
 *   using the flattened syntax are processed identically to those using
 *   the general syntax.
 *
 *   In summary, the syntax of a JWS using the flattened JWS JSON
 *   Serialization is as follows:
 *
 *     {
 *       "payload":"<payload contents>",
 *       "protected":"<integrity-protected header contents>",
 *       "header":<non-integrity-protected header contents>,
 *       "signature":"<signature contents>"
 *     }
 *
 *   See Appendix A.7 for an example JWS using the flattened JWS JSON
 *   Serialization syntax.
 */
const JWSFlattenedSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    payload: JWTClaimsSetSchema,
    protected: JOSEHeaderSchema,
    header: JOSEHeaderSchema,
    signature: {
      type: 'string',
      format: 'base64url'
    }
  }
})

/**
 * Export
 */
module.exports = JWSFlattenedSerializationSchema
