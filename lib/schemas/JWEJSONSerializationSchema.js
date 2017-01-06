'use strict';

/**
 * Dependencies
 */
var JOSEHeaderSchema = require('./JOSEHeaderSchema');

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWEJSONSerializationSchema
 *
 * JSON Web Encryption (JWE)
 * https://tools.ietf.org/html/rfc7516#section-7.2
 *
 * 7.2.  JWE JSON Serialization
 *
 *   The JWE JSON Serialization represents encrypted content as a JSON
 *   object.  This representation is neither optimized for compactness nor
 *   URL safe.
 *
 *   Two closely related syntaxes are defined for the JWE JSON
 *   Serialization: a fully general syntax, with which content can be
 *   encrypted to more than one recipient, and a flattened syntax, which
 *   is optimized for the single-recipient case.
 *
 * 7.2.1.  General JWE JSON Serialization Syntax
 *
 *   The following members are defined for use in top-level JSON objects
 *   used for the fully general JWE JSON Serialization syntax:
 *
 *   protected
 *     The "protected" member MUST be present and contain the value
 *     BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
 *     Header value is non-empty; otherwise, it MUST be absent.  These
 *     Header Parameter values are integrity protected.
 *
 *   unprotected
 *     The "unprotected" member MUST be present and contain the value JWE
 *     Shared Unprotected Header when the JWE Shared Unprotected Header
 *     value is non-empty; otherwise, it MUST be absent.  This value is
 *     represented as an unencoded JSON object, rather than as a string.
 *     These Header Parameter values are not integrity protected.
 *
 *   iv
 *     The "iv" member MUST be present and contain the value
 *     BASE64URL(JWE Initialization Vector) when the JWE Initialization
 *     Vector value is non-empty; otherwise, it MUST be absent.
 *
 *   aad
 *     The "aad" member MUST be present and contain the value
 *     BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
 *     otherwise, it MUST be absent.  A JWE AAD value can be included to
 *     supply a base64url-encoded value to be integrity protected but not
 *     encrypted.
 *
 *   ciphertext
 *     The "ciphertext" member MUST be present and contain the value
 *     BASE64URL(JWE Ciphertext).
 *
 *   tag
 *     The "tag" member MUST be present and contain the value
 *     BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
 *     value is non-empty; otherwise, it MUST be absent.
 *
 *   recipients
 *     The "recipients" member value MUST be an array of JSON objects.
 *     Each object contains information specific to a single recipient.
 *     This member MUST be present with exactly one array element per
 *     recipient, even if some or all of the array element values are the
 *     empty JSON object "{}" (which can happen when all Header Parameter
 *     values are shared between all recipients and when no encrypted key
 *     is used, such as when doing Direct Encryption).
 *
 *     The following members are defined for use in the JSON objects that
 *     are elements of the "recipients" array:
 *
 *     header
 *       The "header" member MUST be present and contain the value JWE Per-
 *       Recipient Unprotected Header when the JWE Per-Recipient
 *       Unprotected Header value is non-empty; otherwise, it MUST be
 *       absent.  This value is represented as an unencoded JSON object,
 *       rather than as a string.  These Header Parameter values are not
 *       integrity protected.
 *
 *     encrypted_key
 *       The "encrypted_key" member MUST be present and contain the value
 *       BASE64URL(JWE Encrypted Key) when the JWE Encrypted Key value is
 *       non-empty; otherwise, it MUST be absent.
 *
 *     At least one of the "header", "protected", and "unprotected" members
 *     MUST be present so that "alg" and "enc" Header Parameter values are
 *     conveyed for each recipient computation.
 *
 *     Additional members can be present in both the JSON objects defined
 *     above; if not understood by implementations encountering them, they
 *     MUST be ignored.
 *
 *     Some Header Parameters, including the "alg" parameter, can be shared
 *     among all recipient computations.  Header Parameters in the JWE
 *     Protected Header and JWE Shared Unprotected Header values are shared
 *     among all recipients.
 *
 *     The Header Parameter values used when creating or validating per-
 *     recipient ciphertext and Authentication Tag values are the union of
 *     the three sets of Header Parameter values that may be present: (1)
 *     the JWE Protected Header represented in the "protected" member, (2)
 *     the JWE Shared Unprotected Header represented in the "unprotected"
 *     member, and (3) the JWE Per-Recipient Unprotected Header represented
 *     in the "header" member of the recipient's array element.  The union
 *     of these sets of Header Parameters comprises the JOSE Header.  The
 *     Header Parameter names in the three locations MUST be disjoint.
 *
 *     Each JWE Encrypted Key value is computed using the parameters of the
 *     corresponding JOSE Header value in the same manner as for the JWE
 *     Compact Serialization.  This has the desirable property that each JWE
 *     Encrypted Key value in the "recipients" array is identical to the
 *     value that would have been computed for the same parameter in the JWE
 *     Compact Serialization.  Likewise, the JWE Ciphertext and JWE
 *     Authentication Tag values match those produced for the JWE Compact
 *     Serialization, provided that the JWE Protected Header value (which
 *     represents the integrity-protected Header Parameter values) matches
 *     that used in the JWE Compact Serialization.
 *
 *     All recipients use the same JWE Protected Header, JWE Initialization
 *     Vector, JWE Ciphertext, and JWE Authentication Tag values, when
 *     present, resulting in potentially significant space savings if the
 *     message is large.  Therefore, all Header Parameters that specify the
 *     treatment of the plaintext value MUST be the same for all recipients.
 *     This primarily means that the "enc" (encryption algorithm) Header
 *     Parameter value in the JOSE Header for each recipient and any
 *     parameters of that algorithm MUST be the same.
 *
 *     In summary, the syntax of a JWE using the general JWE JSON
 *     Serialization is as follows:
 *
 *       {
 *         "protected":"<integrity-protected shared header contents>",
 *         "unprotected":<non-integrity-protected shared header contents>,
 *         "recipients":[
 *          {"header":<per-recipient unprotected header 1 contents>,
 *           "encrypted_key":"<encrypted key 1 contents>"},
 *          ...
 *          {"header":<per-recipient unprotected header N contents>,
 *           "encrypted_key":"<encrypted key N contents>"}],
 *         "aad":"<additional authenticated data contents>",
 *         "iv":"<initialization vector contents>",
 *         "ciphertext":"<ciphertext contents>",
 *         "tag":"<authentication tag contents>"
 *       }
 *
 *     See Appendix A.4 for an example JWE using the general JWE JSON
 *     Serialization syntax.
 */


var JWEJSONSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    protected: JOSEHeaderSchema,
    unprotected: JOSEHeaderSchema,
    iv: { type: 'string', format: 'base64url' },
    aad: { type: 'string', format: 'base64url' },
    ciphertext: { type: 'string', format: 'base64url' },
    tag: { type: 'string', format: 'base64url' },
    recipients: {
      type: 'array',
      items: [{
        type: 'object',
        properties: {
          header: JOSEHeaderSchema,
          encrypted_key: { type: 'string', format: 'base64url' }
        }
      }]
    }
  }
});

/**
 * Export
 */
//module.exports = JWEJSONSerializationSchema