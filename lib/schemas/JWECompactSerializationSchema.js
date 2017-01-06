'use strict';

/**
 * Dependencies
 */
var JOSEHeaderSchema = require('./JOSEHeaderSchema');

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWECompactSerializationSchema
 *
 * JSON Web Encryption (JWE)
 * https://tools.ietf.org/html/rfc7516#section-7.1
 *
 * 7.1.  JWE Compact Serialization
 *
 *   The JWE Compact Serialization represents encrypted content as a
 *   compact, URL-safe string.  This string is:
 *
 *     BASE64URL(UTF8(JWE Protected Header)) || '.' ||
 *     BASE64URL(JWE Encrypted Key) || '.' ||
 *     BASE64URL(JWE Initialization Vector) || '.' ||
 *     BASE64URL(JWE Ciphertext) || '.' ||
 *     BASE64URL(JWE Authentication Tag)
 *
 *   Only one recipient is supported by the JWE Compact Serialization and
 *   it provides no syntax to represent JWE Shared Unprotected Header, JWE
 *   Per-Recipient Unprotected Header, or JWE AAD values.
 */


var JWECompactSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    protected: JOSEHeaderSchema,
    encrypted_key: { type: 'string', format: 'base64url' },
    iv: { type: 'string', format: 'base64url' },
    ciphertext: { type: 'string', format: 'base64url' },
    tag: { type: 'string', format: 'base64url' }
  }
});

/**
 * Export
 */
module.exports = JWECompactSerializationSchema;