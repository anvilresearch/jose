'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RS = require('../../src/algs/RSASSA-PKCS1-v1_5')

/**
 * Tests
 */
describe('Digital Signature with RSASSA-PKCS1-v1_5', () => {

  /**
   * 3.3.  Digital Signature with RSASSA-PKCS1-v1_5
   *
   *   This section defines the use of the RSASSA-PKCS1-v1_5 digital
   *   signature algorithm as defined in Section 8.2 of RFC 3447 [RFC3447]
   *   (commonly known as PKCS #1), using SHA-2 [SHS] hash functions.
   *
   *   A key of size 2048 bits or larger MUST be used with these algorithms.
   *
   *   The RSASSA-PKCS1-v1_5 SHA-256 digital signature is generated as
   *   follows: generate a digital signature of the JWS Signing Input using
   *   RSASSA-PKCS1-v1_5-SIGN and the SHA-256 hash function with the desired
   *   private key.  This is the JWS Signature value.
   *
   *   The following "alg" (algorithm) Header Parameter values are used to
   *   indicate that the JWS Signature is a digital signature value computed
   *   using the corresponding algorithm:
   *
   *          +-------------------+---------------------------------+
   *          | "alg" Param Value | Digital Signature Algorithm     |
   *          +-------------------+---------------------------------+
   *          | RS256             | RSASSA-PKCS1-v1_5 using SHA-256 |
   *          | RS384             | RSASSA-PKCS1-v1_5 using SHA-384 |
   *          | RS512             | RSASSA-PKCS1-v1_5 using SHA-512 |
   *          +-------------------+---------------------------------+
   *
   *   The RSASSA-PKCS1-v1_5 SHA-256 digital signature for a JWS is
   *   validated as follows: submit the JWS Signing Input, the JWS
   *   Signature, and the public key corresponding to the private key used
   *   by the signer to the RSASSA-PKCS1-v1_5-VERIFY algorithm using SHA-256
   *   as the hash function.
   *
   *   Signing and validation with the RSASSA-PKCS1-v1_5 SHA-384 and RSASSA-
   *   PKCS1-v1_5 SHA-512 algorithms is performed identically to the
   *   procedure for RSASSA-PKCS1-v1_5 SHA-256 -- just using the
   *   corresponding hash algorithms instead of SHA-256.
   *
   *   An example using this algorithm is shown in Appendix A.2 of [JWS].
   */
  describe('constructor', () => {
    it('should set bitlength')
  })

  describe('sign', () => {
    it('should enforce minimum key size')
    it('should return a base64url-encoded hash-based message authentication code')
  })

  describe('verify', () => {
    it('should return true with valid input')
    it('should return false with invalid input')
  })

  describe('assertSufficientKeySize', () => {
    it('should not throw an error with a sufficient key length')
    it('should throw an error with insufficient key length')
  })
})
