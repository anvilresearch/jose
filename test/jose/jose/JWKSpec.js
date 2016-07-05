'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const JWK = require(path.join(cwd, 'src', 'jose', 'jose', 'JWK'))

/**
 * Tests
 */
describe('JWK', () => {
  describe('schema', () => {
    let {schema: {properties}} = JWK

    /**
     * 4.  JSON Web Key (JWK) Format
     * https://tools.ietf.org/html/rfc7517#section-4
     *
     *   A JWK is a JSON object that represents a cryptographic key.  The
     *   members of the object represent properties of the key, including its
     *   value.  This JSON object MAY contain whitespace and/or line breaks
     *   before or after any JSON values or structural characters, in
     *   accordance with Section 2 of RFC 7159 [RFC7159].  This document
     *   defines the key parameters that are not algorithm specific and, thus,
     *   common to many keys.
     *
     *   In addition to the common parameters, each JWK will have members that
     *   are key type specific.  These members represent the parameters of the
     *   key.  Section 6 of the JSON Web Algorithms (JWA) [JWA] specification
     *   defines multiple kinds of cryptographic keys and their associated
     *   members.
     *
     *   The member names within a JWK MUST be unique; JWK parsers MUST either
     *   reject JWKs with duplicate member names or use a JSON parser that
     *   returns only the lexically last duplicate member name, as specified
     *   in Section 15.12 (The JSON Object) of ECMAScript 5.1 [ECMAScript].
     *
     *   Additional members can be present in the JWK; if not understood by
     *   implementations encountering them, they MUST be ignored.  Member
     *   names used for representing key parameters for different keys types
     *   need not be distinct.  Any new member name should either be
     *   registered in the IANA "JSON Web Key Parameters" registry established
     *   by Section 8.1 or be a value that contains a Collision-Resistant
     *   Name.
     */

    /**
     * 4.1.  "kty" (Key Type) Parameter
     *
     *   The "kty" (key type) parameter identifies the cryptographic algorithm
     *   family used with the key, such as "RSA" or "EC".  "kty" values should
     *   either be registered in the IANA "JSON Web Key Types" registry
     *   established by [JWA] or be a value that contains a Collision-
     *   Resistant Name.  The "kty" value is a case-sensitive string.  This
     *   member MUST be present in a JWK.
     *
     *   A list of defined "kty" values can be found in the IANA "JSON Web Key
     *   Types" registry established by [JWA]; the initial contents of this
     *   registry are the values defined in Section 6.1 of [JWA].
     *
     *   The key type definitions include specification of the members to be
     *   used for those key types.  Members used with specific "kty" values
     *   can be found in the IANA "JSON Web Key Parameters" registry
     *   established by Section 8.1.
     */
    it('should define type of "kty"', () => {
      properties.kty.type.should.equal('string')
    })

    it('should define format of "kty"', () => {
      properties.kty.format.should.equal('case-sensitive')
    })

    it('should define enum of "kty"', () => {
      properties.kty.enum.should.eql([
        'RSA',
        'EC',
        'oct'
      ])
    })

    /**
     * 4.2.  "use" (Public Key Use) Parameter
     *
     *   The "use" (public key use) parameter identifies the intended use of
     *   the public key.  The "use" parameter is employed to indicate whether
     *   a public key is used for encrypting data or verifying the signature
     *   on data.
     *
     *   Values defined by this specification are:
     *
     *   o  "sig" (signature)
     *   o  "enc" (encryption)
     *
     *   Other values MAY be used.  The "use" value is a case-sensitive
     *   string.  Use of the "use" member is OPTIONAL, unless the application
     *   requires its presence.
     *
     *   When a key is used to wrap another key and a public key use
     *   designation for the first key is desired, the "enc" (encryption) key
     *   use value is used, since key wrapping is a kind of encryption.  The
     *   "enc" value is also to be used for public keys used for key agreement
     *   operations.
     *
     *   Additional "use" (public key use) values can be registered in the
     *   IANA "JSON Web Key Use" registry established by Section 8.2.
     *   Registering any extension values used is highly recommended when this
     *   specification is used in open environments, in which multiple
     *   organizations need to have a common understanding of any extensions
     *   used.  However, unregistered extension values can be used in closed
     *   environments, in which the producing and consuming organization will
     *   always be the same.
     */
    it('should define type of "use"', () => {
      properties.use.type.should.equal('string')
    })

    it('should define format of "use"', () => {
      properties.use.format.should.equal('case-sensitive')
    })

    it('should define enum of "use"', () => {
      properties.use.enum.should.eql([
        'sig',
        'enc'
      ])
    })

    /**
     * 4.3.  "key_ops" (Key Operations) Parameter
     *
     *   The "key_ops" (key operations) parameter identifies the operation(s)
     *   for which the key is intended to be used.  The "key_ops" parameter is
     *   intended for use cases in which public, private, or symmetric keys
     *   may be present.
     *
     *   Its value is an array of key operation values.  Values defined by
     *   this specification are:
     *
     *   o  "sign" (compute digital signature or MAC)
     *   o  "verify" (verify digital signature or MAC)
     *   o  "encrypt" (encrypt content)
     *   o  "decrypt" (decrypt content and validate decryption, if applicable)
     *   o  "wrapKey" (encrypt key)
     *   o  "unwrapKey" (decrypt key and validate decryption, if applicable)
     *   o  "deriveKey" (derive key)
     *   o  "deriveBits" (derive bits not to be used as a key)
     *
     *   (Note that the "key_ops" values intentionally match the "KeyUsage"
     *   values defined in the Web Cryptography API
     *   [W3C.CR-WebCryptoAPI-20141211] specification.)
     *
     *   Other values MAY be used.  The key operation values are case-
     *   sensitive strings.  Duplicate key operation values MUST NOT be
     *   present in the array.  Use of the "key_ops" member is OPTIONAL,
     *   unless the application requires its presence.
     *
     *   Multiple unrelated key operations SHOULD NOT be specified for a key
     *   because of the potential vulnerabilities associated with using the
     *   same key with multiple algorithms.  Thus, the combinations "sign"
     *   with "verify", "encrypt" with "decrypt", and "wrapKey" with
     *   "unwrapKey" are permitted, but other combinations SHOULD NOT be used.
     *
     *   Additional "key_ops" (key operations) values can be registered in the
     *   IANA "JSON Web Key Operations" registry established by Section 8.3.
     *   The same considerations about registering extension values apply to
     *   the "key_ops" member as do for the "use" member.
     *
     *   The "use" and "key_ops" JWK members SHOULD NOT be used together;
     *   however, if both are used, the information they convey MUST be
     *   consistent.  Applications should specify which of these members they
     *   use, if either is to be used by the application.
     */
    it('should define type of "key_ops"', () => {
      properties.key_ops.type.should.equal('array')
    })

    it('should define format of "key_ops"', () => {
      properties.key_ops.format.should.equal('case-sensitive')
    })

    it('should define enum of "key_ops"', () => {
      properties.key_ops.enum.should.eql([
        'sign',
        'verify',
        'encrypt',
        'decrypt',
        'wrapKey',
        'unwrapKey',
        'deriveKey',
        'deriveBits'
      ])
    })

    /**
     * 4.4.  "alg" (Algorithm) Parameter
     *
     *   The "alg" (algorithm) parameter identifies the algorithm intended for
     *   use with the key.  The values used should either be registered in the
     *   IANA "JSON Web Signature and Encryption Algorithms" registry
     *   established by [JWA] or be a value that contains a Collision-
     *   Resistant Name.  The "alg" value is a case-sensitive ASCII string.
     *   Use of this member is OPTIONAL.
     */
    it('should define type of "alg"', () => {
      properties.alg.type.should.equal('string')
    })

    it('should define format of "alg"', () => {
      properties.alg.format.should.equal('case-sensitive')
    })

    it('should define enum of "alg"', () => {
      properties.alg.enum.should.eql([
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
      ])
    })

    /**
     * 4.5.  "kid" (Key ID) Parameter
     *
     *   The "kid" (key ID) parameter is used to match a specific key.  This
     *   is used, for instance, to choose among a set of keys within a JWK Set
     *   during key rollover.  The structure of the "kid" value is
     *   unspecified.  When "kid" values are used within a JWK Set, different
     *   keys within the JWK Set SHOULD use distinct "kid" values.  (One
     *   example in which different keys might use the same "kid" value is if
     *   they have different "kty" (key type) values but are considered to be
     *   equivalent alternatives by the application using them.)  The "kid"
     *   value is a case-sensitive string.  Use of this member is OPTIONAL.
     *   When used with JWS or JWE, the "kid" value is used to match a JWS or
     *   JWE "kid" Header Parameter value.
     */
    it('should define type of "kid"', () => {
      properties.kid.type.should.equal('string')
    })


    /**
     * 4.6.  "x5u" (X.509 URL) Parameter
     *
     *   The "x5u" (X.509 URL) parameter is a URI [RFC3986] that refers to a
     *   resource for an X.509 public key certificate or certificate chain
     *   [RFC5280].  The identified resource MUST provide a representation of
     *   the certificate or certificate chain that conforms to RFC 5280
     *   [RFC5280] in PEM-encoded form, with each certificate delimited as
     *   specified in Section 6.1 of RFC 4945 [RFC4945].  The key in the first
     *   certificate MUST match the public key represented by other members of
     *   the JWK.  The protocol used to acquire the resource MUST provide
     *   integrity protection; an HTTP GET request to retrieve the certificate
     *   MUST use TLS [RFC2818] [RFC5246]; the identity of the server MUST be
     *   validated, as per Section 6 of RFC 6125 [RFC6125].  Use of this
     *   member is OPTIONAL.
     *
     *   While there is no requirement that optional JWK members providing key
     *   usage, algorithm, or other information be present when the "x5u"
     *   member is used, doing so may improve interoperability for
     *   applications that do not handle PKIX certificates [RFC5280].  If
     *   other members are present, the contents of those members MUST be
     *   semantically consistent with the related fields in the first
     *   certificate.  For instance, if the "use" member is present, then it
     *   MUST correspond to the usage that is specified in the certificate,
     *   when it includes this information.  Similarly, if the "alg" member is
     *   present, it MUST correspond to the algorithm specified in the
     *   certificate.
     */
    it('should define type of "x5u"', () => {
      properties.x5u.type.should.equal('string')
    })

    it('should define format of "x5u"', () => {
      properties.x5u.format.should.equal('url')
    })

    /**
     * 4.7.  "x5c" (X.509 Certificate Chain) Parameter
     *
     *   The "x5c" (X.509 certificate chain) parameter contains a chain of one
     *   or more PKIX certificates [RFC5280].  The certificate chain is
     *   represented as a JSON array of certificate value strings.  Each
     *   string in the array is a base64-encoded (Section 4 of [RFC4648] --
     *   not base64url-encoded) DER [ITU.X690.1994] PKIX certificate value.
     *   The PKIX certificate containing the key value MUST be the first
     *   certificate.  This MAY be followed by additional certificates, with
     *   each subsequent certificate being the one used to certify the
     *   previous one.  The key in the first certificate MUST match the public
     *   key represented by other members of the JWK.  Use of this member is
     *   OPTIONAL.
     *
     *   As with the "x5u" member, optional JWK members providing key usage,
     *   algorithm, or other information MAY also be present when the "x5c"
     *   member is used.  If other members are present, the contents of those
     *   members MUST be semantically consistent with the related fields in
     *   the first certificate.  See the last paragraph of Section 4.6 for
     *   additional guidance on this.
     */
    it('should define type of "x5c"', () => {
      properties.x5c.type.should.equal('array')
    })

    it('should define format of "x5c"', () => {
      properties.x5c.format.should.be.instanceof(RegExp)
    })

    /**
     * 4.8.  "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter
     *
     *   The "x5t" (X.509 certificate SHA-1 thumbprint) parameter is a
     *   base64url-encoded SHA-1 thumbprint (a.k.a. digest) of the DER
     *   encoding of an X.509 certificate [RFC5280].  Note that certificate
     *   thumbprints are also sometimes known as certificate fingerprints.
     *   The key in the certificate MUST match the public key represented by
     *   other members of the JWK.  Use of this member is OPTIONAL.
     *
     *   As with the "x5u" member, optional JWK members providing key usage,
     *   algorithm, or other information MAY also be present when the "x5t"
     *   member is used.  If other members are present, the contents of those
     *   members MUST be semantically consistent with the related fields in
     *   the referenced certificate.  See the last paragraph of Section 4.6
     *   for additional guidance on this.
     */
    it('should define type of "x5t"', () => {
      properties.x5t.type.should.equal('string')
    })

    it('should define format of "x5t"', () => {
      properties.x5t.format.should.be.instanceof(RegExp)
    })

    /**
     * 4.9.  "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter
     *
     *   The "x5t#S256" (X.509 certificate SHA-256 thumbprint) parameter is a
     *   base64url-encoded SHA-256 thumbprint (a.k.a. digest) of the DER
     *   encoding of an X.509 certificate [RFC5280].  Note that certificate
     *   thumbprints are also sometimes known as certificate fingerprints.
     *   The key in the certificate MUST match the public key represented by
     *   other members of the JWK.  Use of this member is OPTIONAL.
     *
     *   As with the "x5u" member, optional JWK members providing key usage,
     *   algorithm, or other information MAY also be present when the
     *   "x5t#S256" member is used.  If other members are present, the
     *   contents of those members MUST be semantically consistent with the
     *   related fields in the referenced certificate.  See the last paragraph
     *   of Section 4.6 for additional guidance on this.
     */
    it('should define type of "x5t#S256"', () => {
      properties['x5t#S256'].type.should.equal('string')
    })

    it('should define format of "x5t#S256"', () => {
      properties['x5t#S256'].format.should.be.instanceof(RegExp)
    })
  })
})
