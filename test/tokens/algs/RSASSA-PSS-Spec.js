'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

/**
 * Assertions
 */
chai.use(sinonChai)
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const ES = require(path.join(cwd, 'src', 'tokens', 'algs', 'ECDSA'))

/**
 * Tests
 */
describe('Digital Signature with RSASSA-PSS', () => {

  /**
   * 3.5.  Digital Signature with RSASSA-PSS
   *
   *   This section defines the use of the RSASSA-PSS digital signature
   *   algorithm as defined in Section 8.1 of RFC 3447 [RFC3447] with the
   *   MGF1 mask generation function and SHA-2 hash functions, always using
   *   the same hash function for both the RSASSA-PSS hash function and the
   *   MGF1 hash function.  The size of the salt value is the same size as
   *   the hash function output.  All other algorithm parameters use the
   *   defaults specified in Appendix A.2.3 of RFC 3447.
   *
   *   A key of size 2048 bits or larger MUST be used with this algorithm.
   *
   *   The RSASSA-PSS SHA-256 digital signature is generated as follows:
   *   generate a digital signature of the JWS Signing Input using RSASSA-
   *   PSS-SIGN, the SHA-256 hash function, and the MGF1 mask generation
   *   function with SHA-256 with the desired private key.  This is the JWS
   *   Signature value.
   *
   *   The following "alg" (algorithm) Header Parameter values are used to
   *   indicate that the JWS Signature is a digital signature value computed
   *   using the corresponding algorithm:
   *
   *   +-------------------+-----------------------------------------------+
   *   | "alg" Param Value | Digital Signature Algorithm                   |
   *   +-------------------+-----------------------------------------------+
   *   | PS256             | RSASSA-PSS using SHA-256 and MGF1 with        |
   *   |                   | SHA-256                                       |
   *   | PS384             | RSASSA-PSS using SHA-384 and MGF1 with        |
   *   |                   | SHA-384                                       |
   *   | PS512             | RSASSA-PSS using SHA-512 and MGF1 with        |
   *   |                   | SHA-512                                       |
   *   +-------------------+-----------------------------------------------+
   *
   *   The RSASSA-PSS SHA-256 digital signature for a JWS is validated as
   *   follows: submit the JWS Signing Input, the JWS Signature, and the
   *   public key corresponding to the private key used by the signer to the
   *   RSASSA-PSS-VERIFY algorithm using SHA-256 as the hash function and
   *   using MGF1 as the mask generation function with SHA-256.
   *
   *   Signing and validation with the RSASSA-PSS SHA-384 and RSASSA-PSS
   *   SHA-512 algorithms is performed identically to the procedure for
   *   RSASSA-PSS SHA-256 -- just using the alternative hash algorithm in
   *   both roles.
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

  describe('assertSufficientKeyLength', () => {
    it('should not throw an error with a sufficient key length')
    it('should throw an error with insufficient key length')
  })
})
