/**
 * Dependencies
 */
const JWKSchema = require('./JWKSchema')
const {JSONSchema} = require('@trust/json-document')

/**
 * JOSEHeaderSchema
 *
 * JSON Web Token (JWT)
 * https://tools.ietf.org/html/rfc7519#section-5
 *
 * 5.  JOSE Header
 *
 *   For a JWT object, the members of the JSON object represented by the
 *   JOSE Header describe the cryptographic operations applied to the JWT
 *   and optionally, additional properties of the JWT.  Depending upon
 *   whether the JWT is a JWS or JWE, the corresponding rules for the JOSE
 *   Header values apply.
 */
const JOSEHeaderSchema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * typ
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-5.1
     *
     * 5.1.  "typ" (Type) Header Parameter
     *
     *   The "typ" (type) Header Parameter defined by [JWS] and [JWE] is used
     *   by JWT applications to declare the media type [IANA.MediaTypes] of
     *   this complete JWT.  This is intended for use by the JWT application
     *   when values that are not JWTs could also be present in an application
     *   data structure that can contain a JWT object; the application can use
     *   this value to disambiguate among the different kinds of objects that
     *   might be present.  It will typically not be used by applications when
     *   it is already known that the object is a JWT.  This parameter is
     *   ignored by JWT implementations; any processing of this parameter is
     *   performed by the JWT application.  If present, it is RECOMMENDED that
     *   its value be "JWT" to indicate that this object is a JWT.  While
     *   media type names are not case sensitive, it is RECOMMENDED that "JWT"
     *   always be spelled using uppercase characters for compatibility with
     *   legacy implementations.  Use of this Header Parameter is OPTIONAL.
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.9
     *
     * 4.1.9.  "typ" (Type) Header Parameter
     *
     *   The "typ" (type) Header Parameter is used by JWS applications to
     *   declare the media type [IANA.MediaTypes] of this complete JWS.  This
     *   is intended for use by the application when more than one kind of
     *   object could be present in an application data structure that can
     *   contain a JWS; the application can use this value to disambiguate
     *   among the different kinds of objects that might be present.  It will
     *   typically not be used by applications when the kind of object is
     *   already known.  This parameter is ignored by JWS implementations; any
     *   processing of this parameter is performed by the JWS application.
     *   Use of this Header Parameter is OPTIONAL.
     *
     *   Per RFC 2045 [RFC2045], all media type values, subtype values, and
     *   parameter names are case insensitive.  However, parameter values are
     *   case sensitive unless otherwise specified for the specific parameter.
     *
     *   To keep messages compact in common situations, it is RECOMMENDED that
     *   producers omit an "application/" prefix of a media type value in a
     *   "typ" Header Parameter when no other '/' appears in the media type
     *   value.  A recipient using the media type value MUST treat it as if
     *   "application/" were prepended to any "typ" value not containing a
     *   '/'.  For instance, a "typ" value of "example" SHOULD be used to
     *   represent the "application/example" media type, whereas the media
     *   type "application/example;part="1/2"" cannot be shortened to
     *   "example;part="1/2"".
     *
     *   The "typ" value "JOSE" can be used by applications to indicate that
     *   this object is a JWS or JWE using the JWS Compact Serialization or
     *   the JWE Compact Serialization.  The "typ" value "JOSE+JSON" can be
     *   used by applications to indicate that this object is a JWS or JWE
     *   using the JWS JSON Serialization or the JWE JSON Serialization.
     *   Other type values can also be used by applications.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.11
     *
     * 4.1.11.  "typ" (Type) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "typ" Header Parameter defined in Section 4.1.9 of [JWS], except
     *   that the type is that of this complete JWE.
     */
    typ: {
      type: 'string'
    },

    /**
     * cty
     *
     * JSON Web Token (JWT)
     * https://tools.ietf.org/html/rfc7519#section-5.2
     *
     * 5.2.  "cty" (Content Type) Header Parameter
     *
     *   The "cty" (content type) Header Parameter defined by [JWS] and [JWE]
     *   is used by this specification to convey structural information about
     *   the JWT.
     *
     *   In the normal case in which nested signing or encryption operations
     *   are not employed, the use of this Header Parameter is NOT
     *   RECOMMENDED.  In the case that nested signing or encryption is
     *   employed, this Header Parameter MUST be present; in this case, the
     *   value MUST be "JWT", to indicate that a Nested JWT is carried in this
     *   JWT.  While media type names are not case sensitive, it is
     *   RECOMMENDED that "JWT" always be spelled using uppercase characters
     *   for compatibility with legacy implementations.  See Appendix A.2 for
     *   an example of a Nested JWT.
     *
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.10
     *
     * 4.1.10.  "cty" (Content Type) Header Parameter
     *
     *   The "cty" (content type) Header Parameter is used by JWS applications
     *   to declare the media type [IANA.MediaTypes] of the secured content
     *   (the payload).  This is intended for use by the application when more
     *   than one kind of object could be present in the JWS Payload; the
     *   application can use this value to disambiguate among the different
     *   kinds of objects that might be present.  It will typically not be
     *   used by applications when the kind of object is already known.  This
     *   parameter is ignored by JWS implementations; any processing of this
     *   parameter is performed by the JWS application.  Use of this Header
     *   Parameter is OPTIONAL.
     *
     *   Per RFC 2045 [RFC2045], all media type values, subtype values, and
     *   parameter names are case insensitive.  However, parameter values are
     *   case sensitive unless otherwise specified for the specific parameter.
     *
     *   To keep messages compact in common situations, it is RECOMMENDED that
     *   producers omit an "application/" prefix of a media type value in a
     *   "cty" Header Parameter when no other '/' appears in the media type
     *   value.  A recipient using the media type value MUST treat it as if
     *   "application/" were prepended to any "cty" value not containing a
     *   '/'.  For instance, a "cty" value of "example" SHOULD be used to
     *   represent the "application/example" media type, whereas the media
     *   type "application/example;part="1/2"" cannot be shortened to
     *   "example;part="1/2"".
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.12
     *
     * 4.1.12.  "cty" (Content Type) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "cty" Header Parameter defined in Section 4.1.10 of [JWS], except
     *   that the type is that of the secured content (the plaintext).
     */
    cty: {
      type: 'string',
      enum: ['JWT', 'JWD']
    },

    /**
     * alg
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.1
     *
     * 4.1.1.  "alg" (Algorithm) Header Parameter
     *
     *   The "alg" (algorithm) Header Parameter identifies the cryptographic
     *   algorithm used to secure the JWS.  The JWS Signature value is not
     *   valid if the "alg" value does not represent a supported algorithm or
     *   if there is not a key for use with that algorithm associated with the
     *   party that digitally signed or MACed the content.  "alg" values
     *   should either be registered in the IANA "JSON Web Signature and
     *   Encryption Algorithms" registry established by [JWA] or be a value
     *   that contains a Collision-Resistant Name.  The "alg" value is a case-
     *   sensitive ASCII string containing a StringOrURI value.  This Header
     *   Parameter MUST be present and MUST be understood and processed by
     *   implementations.
     *
     *   A list of defined "alg" values for this use can be found in the IANA
     *   "JSON Web Signature and Encryption Algorithms" registry established
     *   by [JWA]; the initial contents of this registry are the values
     *   defined in Section 3.1 of [JWA].
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.1
     *
     * 4.1.1.  "alg" (Algorithm) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "alg" Header Parameter defined in Section 4.1.1 of [JWS], except
     *   that the Header Parameter identifies the cryptographic algorithm used
     *   to encrypt or determine the value of the CEK.  The encrypted content
     *   is not usable if the "alg" value does not represent a supported
     *   algorithm, or if the recipient does not have a key that can be used
     *   with that algorithm.
     *
     *   A list of defined "alg" values for this use can be found in the IANA
     *   "JSON Web Signature and Encryption Algorithms" registry established
     *   by [JWA]; the initial contents of this registry are the values
     *   defined in Section 4.1 of [JWA].
     */
    alg: {
      type: 'string',
      format: 'StringOrURI'
    },

    /**
     * jku
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.2
     *
     * 4.1.2.  "jku" (JWK Set URL) Header Parameter (JWS)
     *
     *   The "jku" (JWK Set URL) Header Parameter is a URI [RFC3986] that
     *   refers to a resource for a set of JSON-encoded public keys, one of
     *   which corresponds to the key used to digitally sign the JWS.  The
     *   keys MUST be encoded as a JWK Set [JWK].  The protocol used to
     *   acquire the resource MUST provide integrity protection; an HTTP GET
     *   request to retrieve the JWK Set MUST use Transport Layer Security
     *   (TLS) [RFC2818] [RFC5246]; and the identity of the server MUST be
     *   validated, as per Section 6 of RFC 6125 [RFC6125].  Also, see
     *   Section 8 on TLS requirements.  Use of this Header Parameter is
     *   OPTIONAL.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.4
     *
     * 4.1.4.  "jku" (JWK Set URL) Header Parameter (JWE)
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "jku" Header Parameter defined in Section 4.1.2 of [JWS], except
     *   that the JWK Set resource contains the public key to which the JWE
     *   was encrypted; this can be used to determine the private key needed
     *   to decrypt the JWE.
     */
    jku: {
      type: 'string',
      format: 'URI'
    },

    /**
     * jwk
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.3
     *
     * 4.1.3.  "jwk" (JSON Web Key) Header Parameter
     *
     *   The "jwk" (JSON Web Key) Header Parameter is the public key that
     *   corresponds to the key used to digitally sign the JWS.  This key is
     *   represented as a JSON Web Key [JWK].  Use of this Header Parameter is
     *   OPTIONAL.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.5
     *
     * 4.1.5.  "jwk" (JSON Web Key) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "jwk" Header Parameter defined in Section 4.1.3 of [JWS], except
     *   that the key is the public key to which the JWE was encrypted; this
     *   can be used to determine the private key needed to decrypt the JWE.
     */
    //jwk: JWKSchema,

    /**
     * kid
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.4
     *
     * 4.1.4.  "kid" (Key ID) Header Parameter
     *
     *   The "kid" (key ID) Header Parameter is a hint indicating which key
     *   was used to secure the JWS.  This parameter allows originators to
     *   explicitly signal a change of key to recipients.  The structure of
     *   the "kid" value is unspecified.  Its value MUST be a case-sensitive
     *   string.  Use of this Header Parameter is OPTIONAL.
     *
     *   When used with a JWK, the "kid" value is used to match a JWK "kid"
     *   parameter value.
     *
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.6
     *
     * 4.1.6.  "kid" (Key ID) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "kid" Header Parameter defined in Section 4.1.4 of [JWS], except
     *   that the key hint references the public key to which the JWE was
     *   encrypted; this can be used to determine the private key needed to
     *   decrypt the JWE.  This parameter allows originators to explicitly
     *   signal a change of key to JWE recipients.
     */
    kid: {
      type: 'string'
    },

    /**
     * x5u
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.5
     *
     * 4.1.5.  "x5u" (X.509 URL) Header Parameter
     *
     *   The "x5u" (X.509 URL) Header Parameter is a URI [RFC3986] that refers
     *   to a resource for the X.509 public key certificate or certificate
     *   chain [RFC5280] corresponding to the key used to digitally sign the
     *   JWS.  The identified resource MUST provide a representation of the
     *   certificate or certificate chain that conforms to RFC 5280 [RFC5280]
     *   in PEM-encoded form, with each certificate delimited as specified in
     *   Section 6.1 of RFC 4945 [RFC4945].  The certificate containing the
     *   public key corresponding to the key used to digitally sign the JWS
     *   MUST be the first certificate.  This MAY be followed by additional
     *   certificates, with each subsequent certificate being the one used to
     *   certify the previous one.  The protocol used to acquire the resource
     *   MUST provide integrity protection; an HTTP GET request to retrieve
     *   the certificate MUST use TLS [RFC2818] [RFC5246]; and the identity of
     *   the server MUST be validated, as per Section 6 of RFC 6125 [RFC6125].
     *   Also, see Section 8 on TLS requirements.  Use of this Header
     *   Parameter is OPTIONAL.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.7
     *
     * 4.1.7.  "x5u" (X.509 URL) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "x5u" Header Parameter defined in Section 4.1.5 of [JWS], except
     *   that the X.509 public key certificate or certificate chain [RFC5280]
     *   contains the public key to which the JWE was encrypted; this can be
     *   used to determine the private key needed to decrypt the JWE.
     */
    x5u: {
      type: 'string',
      format: 'URI'
    },

    /**
     * x5c
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.6
     *
     * 4.1.6.  "x5c" (X.509 Certificate Chain) Header Parameter
     *
     *   The "x5c" (X.509 certificate chain) Header Parameter contains the
     *   X.509 public key certificate or certificate chain [RFC5280]
     *   corresponding to the key used to digitally sign the JWS.  The
     *   certificate or certificate chain is represented as a JSON array of
     *   certificate value strings.  Each string in the array is a
     *   base64-encoded (Section 4 of [RFC4648] -- not base64url-encoded) DER
     *   [ITU.X690.2008] PKIX certificate value.  The certificate containing
     *   the public key corresponding to the key used to digitally sign the
     *   JWS MUST be the first certificate.  This MAY be followed by
     *   additional certificates, with each subsequent certificate being the
     *   one used to certify the previous one.  The recipient MUST validate
     *   the certificate chain according to RFC 5280 [RFC5280] and consider
     *   the certificate or certificate chain to be invalid if any validation
     *   failure occurs.  Use of this Header Parameter is OPTIONAL.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.8
     *
     * 4.1.8.  "x5c" (X.509 Certificate Chain) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "x5c" Header Parameter defined in Section 4.1.6 of [JWS], except
     *   that the X.509 public key certificate or certificate chain [RFC5280]
     *   contains the public key to which the JWE was encrypted; this can be
     *   used to determine the private key needed to decrypt the JWE.
     */
    x5c: {
      type: 'array',
      items: {
        type: 'string',
        format: 'base64'
      }
    },

    /**
     * x5t
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.7
     *
     * 4.1.7.  "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter
     *
     *   The "x5t" (X.509 certificate SHA-1 thumbprint) Header Parameter is a
     *   base64url-encoded SHA-1 thumbprint (a.k.a. digest) of the DER
     *   encoding of the X.509 certificate [RFC5280] corresponding to the key
     *   used to digitally sign the JWS.  Note that certificate thumbprints
     *   are also sometimes known as certificate fingerprints.  Use of this
     *   Header Parameter is OPTIONAL.
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.9
     *
     * 4.1.9.  "x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "x5t" Header Parameter defined in Section 4.1.7 of [JWS], except
     *   that the certificate referenced by the thumbprint contains the public
     *   key to which the JWE was encrypted; this can be used to determine the
     *   private key needed to decrypt the JWE.  Note that certificate
     *   thumbprints are also sometimes known as certificate fingerprints.
     */
    x5t: {
      type: 'string',
      format: 'base64url'
    },

    /**
     * x5t#S256
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.8
     *
     * 4.1.8.  "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Header
     *         Parameter
     *
     *   The "x5t#S256" (X.509 certificate SHA-256 thumbprint) Header
     *   Parameter is a base64url-encoded SHA-256 thumbprint (a.k.a. digest)
     *   of the DER encoding of the X.509 certificate [RFC5280] corresponding
     *   to the key used to digitally sign the JWS.  Note that certificate
     *   thumbprints are also sometimes known as certificate fingerprints.
     *   Use of this Header Parameter is OPTIONAL.
     *
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.10
     *
     * 4.1.10.  "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Header
     *          Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "x5t#S256" Header Parameter defined in Section 4.1.8 of [JWS],
     *   except that the certificate referenced by the thumbprint contains the
     *   public key to which the JWE was encrypted; this can be used to
     *   determine the private key needed to decrypt the JWE.  Note that
     *   certificate thumbprints are also sometimes known as certificate
     *   fingerprints.
     */
    //'x5t#S256': {
    //  type: 'string',
    //  format: 'base64url'
    //},

    /**
     * crit
     *
     * JSON Web Signature (JWS)
     * https://tools.ietf.org/html/rfc7515#section-4.1.11
     *
     * 4.1.11.  "crit" (Critical) Header Parameter
     *
     *   The "crit" (critical) Header Parameter indicates that extensions to
     *   this specification and/or [JWA] are being used that MUST be
     *   understood and processed.  Its value is an array listing the Header
     *   Parameter names present in the JOSE Header that use those extensions.
     *   If any of the listed extension Header Parameters are not understood
     *   and supported by the recipient, then the JWS is invalid.  Producers
     *   MUST NOT include Header Parameter names defined by this specification
     *   or [JWA] for use with JWS, duplicate names, or names that do not
     *   occur as Header Parameter names within the JOSE Header in the "crit"
     *   list.  Producers MUST NOT use the empty list "[]" as the "crit"
     *   value.  Recipients MAY consider the JWS to be invalid if the critical
     *   list contains any Header Parameter names defined by this
     *   specification or [JWA] for use with JWS or if any other constraints
     *   on its use are violated.  When used, this Header Parameter MUST be
     *   integrity protected; therefore, it MUST occur only within the JWS
     *   Protected Header.  Use of this Header Parameter is OPTIONAL.  This
     *   Header Parameter MUST be understood and processed by implementations.
     *
     *   An example use, along with a hypothetical "exp" (expiration time)
     *   field is:
     *
     *     {"alg":"ES256",
     *     "crit":["exp"],
     *     "exp":1363284000
     *     }
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.13
     *
     *   4.1.13.  "crit" (Critical) Header Parameter
     *
     *   This parameter has the same meaning, syntax, and processing rules as
     *   the "crit" Header Parameter defined in Section 4.1.11 of [JWS],
     *   except that Header Parameters for a JWE are being referred to, rather
     *   than Header Parameters for a JWS.
     */
    crit: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1
    },

    /**
     * enc
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.2
     *
     * 4.1.2.  "enc" (Encryption Algorithm) Header Parameter
     *
     *   The "enc" (encryption algorithm) Header Parameter identifies the
     *   content encryption algorithm used to perform authenticated encryption
     *   on the plaintext to produce the ciphertext and the Authentication
     *   Tag.  This algorithm MUST be an AEAD algorithm with a specified key
     *   length.  The encrypted content is not usable if the "enc" value does
     *   not represent a supported algorithm.  "enc" values should either be
     *   registered in the IANA "JSON Web Signature and Encryption Algorithms"
     *   registry established by [JWA] or be a value that contains a
     *   Collision-Resistant Name.  The "enc" value is a case-sensitive ASCII
     *   string containing a StringOrURI value.  This Header Parameter MUST be
     *   present and MUST be understood and processed by implementations.
     *
     *   A list of defined "enc" values for this use can be found in the IANA
     *   "JSON Web Signature and Encryption Algorithms" registry established
     *   by [JWA]; the initial contents of this registry are the values
     *   defined in Section 5.1 of [JWA].
     */
    enc: {
      type: 'string',
      format: 'StringOrURI'
    },

    /**
     * zip
     *
     * JSON Web Encryption (JWE)
     * https://tools.ietf.org/html/rfc7516#section-4.1.3
     *
     * 4.1.3.  "zip" (Compression Algorithm) Header Parameter
     *
     *   The "zip" (compression algorithm) applied to the plaintext before
     *   encryption, if any.  The "zip" value defined by this specification
     *   is:
     *
     *   o  "DEF" - Compression with the DEFLATE [RFC1951] algorithm
     *
     *   Other values MAY be used.  Compression algorithm values can be
     *   registered in the IANA "JSON Web Encryption Compression Algorithms"
     *   registry established by [JWA].  The "zip" value is a case-sensitive
     *   string.  If no "zip" parameter is present, no compression is applied
     *   to the plaintext before encryption.  When used, this Header Parameter
     *   MUST be integrity protected; therefore, it MUST occur only within the
     *   JWE Protected Header.  Use of this Header Parameter is OPTIONAL.
     *   This Header Parameter MUST be understood and processed by
     *   implementations.
     */
    zip: {
      type: 'string'
    }
  }
})

/**
 * Export
 */
module.exports = JOSEHeaderSchema
