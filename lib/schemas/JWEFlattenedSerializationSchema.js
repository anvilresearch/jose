'use strict';

/**
 * Dependencies
 */
var JOSEHeaderSchema = require('./JOSEHeaderSchema');

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWEFlattenedSerializationSchema
 *
 * JSON Web Encryption (JWE)
 * https://tools.ietf.org/html/rfc7516#section-7.2
 *
 * 7.2.2.  Flattened JWE JSON Serialization Syntax
 *
 *   The flattened JWE JSON Serialization syntax is based upon the general
 *   syntax, but flattens it, optimizing it for the single-recipient case.
 *   It flattens it by removing the "recipients" member and instead
 *   placing those members defined for use in the "recipients" array (the
 *   "header" and "encrypted_key" members) in the top-level JSON object
 *   (at the same level as the "ciphertext" member).
 *
 *   The "recipients" member MUST NOT be present when using this syntax.
 *   Other than this syntax difference, JWE JSON Serialization objects
 *   using the flattened syntax are processed identically to those using
 *   the general syntax.
 *
 *   In summary, the syntax of a JWE using the flattened JWE JSON
 *   Serialization is as follows:
 *
 *     {
 *       "protected":"<integrity-protected header contents>",
 *       "unprotected":<non-integrity-protected header contents>,
 *       "header":<more non-integrity-protected header contents>,
 *       "encrypted_key":"<encrypted key contents>",
 *       "aad":"<additional authenticated data contents>",
 *       "iv":"<initialization vector contents>",
 *       "ciphertext":"<ciphertext contents>",
 *       "tag":"<authentication tag contents>"
 *     }
 *
 *   Note that when using the flattened syntax, just as when using the
 *   general syntax, any unprotected Header Parameter values can reside in
 *   either the "unprotected" member or the "header" member, or in both.
 *
 *   See Appendix A.5 for an example JWE using the flattened JWE JSON
 *   Serialization syntax.
 */


var JWEFlattenedSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    protected: JOSEHeaderSchema,
    unprotected: JOSEHeaderSchema,
    header: JOSEHeaderSchema,
    encrypted_key: { type: 'string', format: 'base64url' },
    iv: { type: 'string', format: 'base64url' },
    aad: { type: 'string', format: 'base64url' },
    ciphertext: { type: 'string', format: 'base64url' },
    tag: { type: 'string', format: 'base64url' }
  }
});

/**
 * Export
 */
module.exports = JWEFlattenedSerializationSchema;