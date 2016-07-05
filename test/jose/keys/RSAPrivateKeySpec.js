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
const RSAPrivateKey = require(path.join(cwd, 'src', 'jose', 'keys', 'RSAPrivateKey'))

/**
 * Tests
 */
describe('RSAPrivateKey', () => {

  /**
   * Shema
   */
  describe('schema', () => {
    let {schema: {properties}} = RSAPrivateKey

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

    /**
     * 6.3.2.  Parameters for RSA Private Keys
     *
     *   In addition to the members used to represent RSA public keys, the
     *   following members are used to represent RSA private keys.  The
     *   parameter "d" is REQUIRED for RSA private keys.  The others enable
     *   optimizations and SHOULD be included by producers of JWKs
     *   representing RSA private keys.  If the producer includes any of the
     *   other private key parameters, then all of the others MUST be present,
     *   with the exception of "oth", which MUST only be present when more
     *   than two prime factors were used.
     *
     * 6.3.2.1.  "d" (Private Exponent) Parameter
     *
     *   The "d" (private exponent) parameter contains the private exponent
     *   value for the RSA private key.  It is represented as a Base64urlUInt-
     *   encoded value.
     */
    it('should require "d"', () => {
      properties.d.required.should.equal(true)
    })

    it('should define type of "d"', () => {
      properties.d.type.should.equal('string')
    })

    it('should define format of "d"', () => {
      properties.d.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.2.  "p" (First Prime Factor) Parameter
     *
     *   The "p" (first prime factor) parameter contains the first prime
     *   factor.  It is represented as a Base64urlUInt-encoded value.
     */
    it('should define type of "p"', () => {
      properties.p.type.should.equal('string')
    })

    it('should define format of "p"', () => {
      properties.p.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.3.  "q" (Second Prime Factor) Parameter
     *
     *   The "q" (second prime factor) parameter contains the second prime
     *   factor.  It is represented as a Base64urlUInt-encoded value.
     */
    it('should define type of "q"', () => {
      properties.q.type.should.equal('string')
    })

    it('should define format of "q"', () => {
      properties.q.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.4.  "dp" (First Factor CRT Exponent) Parameter
     *
     *   The "dp" (first factor CRT exponent) parameter contains the Chinese
     *   Remainder Theorem (CRT) exponent of the first factor.  It is
     *   represented as a Base64urlUInt-encoded value.
     */
    it('should define type of "dp"', () => {
      properties.dp.type.should.equal('string')
    })

    it('should define format of "dp"', () => {
      properties.dp.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.5.  "dq" (Second Factor CRT Exponent) Parameter
     *
     *   The "dq" (second factor CRT exponent) parameter contains the CRT
     *   exponent of the second factor.  It is represented as a Base64urlUInt-
     *   encoded value.
     */
    it('should define type of "dq"', () => {
      properties.dq.type.should.equal('string')
    })

    it('should define format of "dq"', () => {
      properties.dq.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.6.  "qi" (First CRT Coefficient) Parameter
     *
     *   The "qi" (first CRT coefficient) parameter contains the CRT
     *   coefficient of the second factor.  It is represented as a
     *   Base64urlUInt-encoded value.
     */
    it('should define type of "qi"', () => {
      properties.qi.type.should.equal('string')
    })

    it('should define format of "qi"', () => {
      properties.qi.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.7.  "oth" (Other Primes Info) Parameter
     *
     *   The "oth" (other primes info) parameter contains an array of
     *   information about any third and subsequent primes, should they exist.
     *   When only two primes have been used (the normal case), this parameter
     *   MUST be omitted.  When three or more primes have been used, the
     *   number of array elements MUST be the number of primes used minus two.
     *   For more information on this case, see the description of the
     *   OtherPrimeInfo parameters in Appendix A.1.2 of RFC 3447 [RFC3447],
     *   upon which the following parameters are modeled.  If the consumer of
     *   a JWK does not support private keys with more than two primes and it
     *   encounters a private key that includes the "oth" parameter, then it
     *   MUST NOT use the key.  Each array element MUST be an object with the
     *   following members.
     */
    it('should define type of "oth"', () => {
      properties.oth.type.should.equal('array')
    })

    it('should define items', () => {
      properties.oth.items.should.be.an.array
    })

    /**
     * 6.3.2.7.1.  "r" (Prime Factor)
     *
     *   The "r" (prime factor) parameter within an "oth" array member
     *   represents the value of a subsequent prime factor.  It is represented
     *   as a Base64urlUInt-encoded value.
     */
    it('should require "oth" items to require "r"', () => {
      properties.oth.items[0].properties.r.required.should.equal(true)
    })

    it('should require "oth" items define type of "r"', () => {
      properties.oth.items[0].properties.r.type.should.equal('string')
    })

    it('should require "oth" items define format of "r"', () => {
      properties.oth.items[0].properties.r.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.7.2.  "d" (Factor CRT Exponent)
     *
     *   The "d" (factor CRT exponent) parameter within an "oth" array member
     *   represents the CRT exponent of the corresponding prime factor.  It is
     *   represented as a Base64urlUInt-encoded value.
     */
    it('should require "oth" items to require "d"', () => {
      properties.oth.items[0].properties.d.required.should.equal(true)
    })

    it('should require "oth" items define type of "d"', () => {
      properties.oth.items[0].properties.d.type.should.equal('string')
    })

    it('should require "oth" items define format of "d"', () => {
      properties.oth.items[0].properties.d.format.should.equal('Base64urlUInt')
    })

    /**
     * 6.3.2.7.3.  "t" (Factor CRT Coefficient)
     *
     *   The "t" (factor CRT coefficient) parameter within an "oth" array
     *   member represents the CRT coefficient of the corresponding prime
     *   factor.  It is represented as a Base64urlUInt-encoded value.
     */
    it('should require "oth" items to require "t"', () => {
      properties.oth.items[0].properties.t.required.should.equal(true)
    })

    it('should require "oth" items define type of "t"', () => {
      properties.oth.items[0].properties.t.type.should.equal('string')
    })

    it('should require "oth" items define format of "t"', () => {
      properties.oth.items[0].properties.t.format.should.equal('Base64urlUInt')
    })
  })
})
