/**
 * Dependencies
 */
const JOSEHeaderSchema = require('./JOSEHeaderSchema')
const JWTClaimsSetSchema = require('./JWTClaimsSetSchema')
const {JSONSchema} = require('@trust/json-document')

/**
 * JWSJSONSerializationSchema
 *
 * JSON Web Signature (JWS)
 * https://tools.ietf.org/html/rfc7515#section-7.2.1
 *
 * 7.2.1.  General JWS JSON Serialization Syntax
 *
 *   The following members are defined for use in top-level JSON objects
 *   used for the fully general JWS JSON Serialization syntax:
 *
 *   payload
 *     The "payload" member MUST be present and contain the value
 *     BASE64URL(JWS Payload).
 *
 *   signatures
 *     The "signatures" member value MUST be an array of JSON objects.
 *     Each object represents a signature or MAC over the JWS Payload and
 *     the JWS Protected Header.
 *
 *   The following members are defined for use in the JSON objects that
 *   are elements of the "signatures" array:
 *
 *   protected
 *     The "protected" member MUST be present and contain the value
 *     BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
 *     Header value is non-empty; otherwise, it MUST be absent.  These
 *     Header Parameter values are integrity protected.
 *
 *   header
 *     The "header" member MUST be present and contain the value JWS
 *     Unprotected Header when the JWS Unprotected Header value is non-
 *     empty; otherwise, it MUST be absent.  This value is represented as
 *     an unencoded JSON object, rather than as a string.  These Header
 *     Parameter values are not integrity protected.
 *
 *   signature
 *     The "signature" member MUST be present and contain the value
 *     BASE64URL(JWS Signature).
 *
 *   At least one of the "protected" and "header" members MUST be present
 *   for each signature/MAC computation so that an "alg" Header Parameter
 *   value is conveyed.
 *
 *   Additional members can be present in both the JSON objects defined
 *   above; if not understood by implementations encountering them, they
 *   MUST be ignored.
 *
 *   The Header Parameter values used when creating or validating
 *   individual signature or MAC values are the union of the two sets of
 *   Header Parameter values that may be present: (1) the JWS Protected
 *   Header represented in the "protected" member of the signature/MAC's
 *   array element, and (2) the JWS Unprotected Header in the "header"
 *   member of the signature/MAC's array element.  The union of these sets
 *   of Header Parameters comprises the JOSE Header.  The Header Parameter
 *   names in the two locations MUST be disjoint.
 *
 *   Each JWS Signature value is computed using the parameters of the
 *   corresponding JOSE Header value in the same manner as for the JWS
 *   Compact Serialization.  This has the desirable property that each JWS
 *   Signature value represented in the "signatures" array is identical to
 *   the value that would have been computed for the same parameter in the
 *   JWS Compact Serialization, provided that the JWS Protected Header
 *   value for that signature/MAC computation (which represents the
 *   integrity-protected Header Parameter values) matches that used in the
 *   JWS Compact Serialization.
 *
 *   In summary, the syntax of a JWS using the general JWS JSON
 *   Serialization is as follows:
 *
 *     {
 *       "payload":"<payload contents>",
 *       "signatures":[
 *         {"protected":"<integrity-protected header 1 contents>",
 *          "header":<non-integrity-protected header 1 contents>,
 *          "signature":"<signature 1 contents>"},
 *          ...
 *         {"protected":"<integrity-protected header N contents>",
 *          "header":<non-integrity-protected header N contents>,
 *          "signature":"<signature N contents>"}]
 *     }
 *
 *   See Appendix A.6 for an example JWS using the general JWS JSON
 *   Serialization syntax.
 */
const JWSJSONSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    payload: JWTClaimsSetSchema,
    signatures: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            protected: JOSEHeaderSchema,
            header: JOSEHeaderSchema,
            signature: {
              type: 'string',
              format: 'base64url'
            }
          }
        }
      ]
    }
  }
})

/**
 * Export
 */
module.exports = JWSJSONSerializationSchema
