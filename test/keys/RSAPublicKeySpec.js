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
const RSAPublicKey = require(path.join(cwd, 'src', 'keys', 'RSAPublicKey'))

/**
 * Tests
 */
describe('RSAPublicKey', () => {

  /**
   * Shema
   */
  describe('schema', () => {
    let {schema: {properties}} = RSAPublicKey

    /*
     * 6.3.  Parameters for RSA Keys
     * https://tools.ietf.org/html/rfc7518#section-6.3
     *
     *   JWKs can represent RSA [RFC3447] keys.  In this case, the "kty"
     *   member value is "RSA".  The semantics of the parameters defined below
     *   are the same as those defined in Sections 3.1 and 3.2 of RFC 3447.
     */

    /**
     * 6.3.1.  Parameters for RSA Public Keys
     *
     *   The following members MUST be present for RSA public keys.
     */

    /**
     * 6.3.1.1.  "n" (Modulus) Parameter
     *
     *   The "n" (modulus) parameter contains the modulus value for the RSA
     *   public key.  It is represented as a Base64urlUInt-encoded value.
     *
     *   Note that implementers have found that some cryptographic libraries
     *   prefix an extra zero-valued octet to the modulus representations they
     *   return, for instance, returning 257 octets for a 2048-bit key, rather
     *   than 256.  Implementations using such libraries will need to take
     *   care to omit the extra octet from the base64url-encoded
     *   representation.
     */
    it('should require "n"', () => {
      properties.n.required.should.equal(true)
    })

    it('should define type of "n"', () => {
      properties.n.type.should.equal('string')
    })

    it('should define format of "n"', () => {
      properties.n.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.1.2.  "e" (Exponent) Parameter
     *
     *   The "e" (exponent) parameter contains the exponent value for the RSA
     *   public key.  It is represented as a Base64urlUInt-encoded value.
     *
     *   For instance, when representing the value 65537, the octet sequence
     *   to be base64url-encoded MUST consist of the three octets [1, 0, 1];
     *   the resulting representation for this value is "AQAB".
     */
    it('should require "e"', () => {
      properties.e.required.should.equal(true)
    })

    it('should define type of "e"', () => {
      properties.e.type.should.equal('string')
    })

    it('should define format of "e"', () => {
      properties.e.format.should.equal('Base64urlUInt')
    })

  })
})
