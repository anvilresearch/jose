'use strict';

/**
 * Dependencies
 */
var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWTClaimsSetSchema
 *
 * JSON Web Token (JWT)
 * https://tools.ietf.org/html/rfc7519#section-4
 *
 * 4.  JWT Claims
 *
 *   The JWT Claims Set represents a JSON object whose members are the
 *   claims conveyed by the JWT.  The Claim Names within a JWT Claims Set
 *   MUST be unique; JWT parsers MUST either reject JWTs with duplicate
 *   Claim Names or use a JSON parser that returns only the lexically last
 *   duplicate member name, as specified in Section 15.12 ("The JSON
 *   Object") of ECMAScript 5.1 [ECMAScript].
 *
 *   The set of claims that a JWT must contain to be considered valid is
 *   context dependent and is outside the scope of this specification.
 *   Specific applications of JWTs will require implementations to
 *   understand and process some claims in particular ways.  However, in
 *   the absence of such requirements, all claims that are not understood
 *   by implementations MUST be ignored.
 *
 *   There are three classes of JWT Claim Names: Registered Claim Names,
 *   Public Claim Names, and Private Claim Names.
 */


var JWTClaimsSetSchema = new JSONSchema({
  // additionalProperties: true,
  properties: {

    /**
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1
     *
     * 4.1.  Registered Claim Names
     *
     *   The following Claim Names are registered in the IANA "JSON Web Token
     *   Claims" registry established by Section 10.1.  None of the claims
     *   defined below are intended to be mandatory to use or implement in all
     *   cases, but rather they provide a starting point for a set of useful,
     *   interoperable claims.  Applications using JWTs should define which
     *   specific claims they use and when they are required or optional.  All
     *   the names are short because a core goal of JWTs is for the
     *   representation to be compact.
     */

    /**
     * iss
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.1
     *
     * 4.1.1.  "iss" (Issuer) Claim
     *
     *   The "iss" (issuer) claim identifies the principal that issued the
     *   JWT.  The processing of this claim is generally application specific.
     *   The "iss" value is a case-sensitive string containing a StringOrURI
     *   value.  Use of this claim is OPTIONAL.
     */
    iss: {
      type: 'string',
      format: 'StringOrURI'
    },

    /**
     * sub
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.2
     *
     * 4.1.2.  "sub" (Subject) Claim
     *
     *   The "sub" (subject) claim identifies the principal that is the
     *   subject of the JWT.  The claims in a JWT are normally statements
     *   about the subject.  The subject value MUST either be scoped to be
     *   locally unique in the context of the issuer or be globally unique.
     *   The processing of this claim is generally application specific.  The
     *   "sub" value is a case-sensitive string containing a StringOrURI
     *   value.  Use of this claim is OPTIONAL.
     */
    sub: {
      type: 'string',
      format: 'StringOrURI'
    },

    /**
     * aud
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.3
     *
     * 4.1.3.  "aud" (Audience) Claim
     *
     *   The "aud" (audience) claim identifies the recipients that the JWT is
     *   intended for.  Each principal intended to process the JWT MUST
     *   identify itself with a value in the audience claim.  If the principal
     *   processing the claim does not identify itself with a value in the
     *   "aud" claim when this claim is present, then the JWT MUST be
     *   rejected.  In the general case, the "aud" value is an array of case-
     *   sensitive strings, each containing a StringOrURI value.  In the
     *   special case when the JWT has one audience, the "aud" value MAY be a
     *   single case-sensitive string containing a StringOrURI value.  The
     *   interpretation of audience values is generally application specific.
     *   Use of this claim is OPTIONAL.
     */
    aud: {
      type: ['array', 'string'],
      format: 'StringOrURI',
      items: {
        format: 'StringOrURI'
      }
    },

    /**
     * exp
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.4
     *
     * 4.1.4.  "exp" (Expiration Time) Claim
     *
     *   The "exp" (expiration time) claim identifies the expiration time on
     *   or after which the JWT MUST NOT be accepted for processing.  The
     *   processing of the "exp" claim requires that the current date/time
     *   MUST be before the expiration date/time listed in the "exp" claim.
     *
     *   Implementers MAY provide for some small leeway, usually no more than
     *   a few minutes, to account for clock skew.  Its value MUST be a number
     *   containing a NumericDate value.  Use of this claim is OPTIONAL.
     *
     */
    exp: {
      type: 'number',
      format: 'NumericDate'
    },

    /**
     * nbf
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.5
     *
     * 4.1.5.  "nbf" (Not Before) Claim
     *
     *   The "nbf" (not before) claim identifies the time before which the JWT
     *   MUST NOT be accepted for processing.  The processing of the "nbf"
     *   claim requires that the current date/time MUST be after or equal to
     *   the not-before date/time listed in the "nbf" claim.  Implementers MAY
     *   provide for some small leeway, usually no more than a few minutes, to
     *   account for clock skew.  Its value MUST be a number containing a
     *   NumericDate value.  Use of this claim is OPTIONAL.
     */
    nbf: {
      type: 'number',
      format: 'NumericDate'
    },

    /**
     * iat
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.6
     *
     * 4.1.6.  "iat" (Issued At) Claim
     *
     *   The "iat" (issued at) claim identifies the time at which the JWT was
     *   issued.  This claim can be used to determine the age of the JWT.  Its
     *   value MUST be a number containing a NumericDate value.  Use of this
     *   claim is OPTIONAL.
     */
    iat: {
      type: 'number',
      format: 'NumericDate'
    },

    /**
     * jti
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-4.1.7
     *
     * 4.1.7.  "jti" (JWT ID) Claim
     *
     *   The "jti" (JWT ID) claim provides a unique identifier for the JWT.
     *   The identifier value MUST be assigned in a manner that ensures that
     *   there is a negligible probability that the same value will be
     *   accidentally assigned to a different data object; if the application
     *   uses multiple issuers, collisions MUST be prevented among values
     *   produced by different issuers as well.  The "jti" claim can be used
     *   to prevent the JWT from being replayed.  The "jti" value is a case-
     *   sensitive string.  Use of this claim is OPTIONAL.
     */
    jti: {
      type: 'string'
    }
  }
});

/**
 * Export
 */
module.exports = JWTClaimsSetSchema;