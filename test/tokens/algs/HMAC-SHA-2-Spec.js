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
const HS = require(path.join(cwd, 'src', 'tokens', 'algs', 'HMAC-SHA-2'))

/**
 * Tests
 */
describe('HMAC with SHA-2 Functions', () => {
  /**
   * 3.2.  HMAC with SHA-2 Functions
   *
   *   Hash-based Message Authentication Codes (HMACs) enable one to use a
   *   secret plus a cryptographic hash function to generate a MAC.  This
   *   can be used to demonstrate that whoever generated the MAC was in
   *   possession of the MAC key.  The algorithm for implementing and
   *   validating HMACs is provided in RFC 2104 [RFC2104].
   *
   *   A key of the same size as the hash output (for instance, 256 bits for
   *   "HS256") or larger MUST be used with this algorithm.  (This
   *   requirement is based on Section 5.3.4 (Security Effect of the HMAC
   *   Key) of NIST SP 800-117 [NIST.800-107], which states that the
   *   effective security strength is the minimum of the security strength
   *   of the key and two times the size of the internal hash value.)
   *
   *   The HMAC SHA-256 MAC is generated per RFC 2104, using SHA-256 as the
   *   hash algorithm "H", using the JWS Signing Input as the "text" value,
   *   and using the shared key.  The HMAC output value is the JWS
   *   Signature.
   *
   *   The following "alg" (algorithm) Header Parameter values are used to
   *   indicate that the JWS Signature is an HMAC value computed using the
   *   corresponding algorithm:
   *
   *                +-------------------+--------------------+
   *                | "alg" Param Value | MAC Algorithm      |
   *                +-------------------+--------------------+
   *                | HS256             | HMAC using SHA-256 |
   *                | HS384             | HMAC using SHA-384 |
   *                | HS512             | HMAC using SHA-512 |
   *                +-------------------+--------------------+
   *
   *   The HMAC SHA-256 MAC for a JWS is validated by computing an HMAC
   *   value per RFC 2104, using SHA-256 as the hash algorithm "H", using
   *   the received JWS Signing Input as the "text" value, and using the
   *   shared key.  This computed HMAC value is then compared to the result
   *   of base64url decoding the received encoded JWS Signature value.  The
   *   comparison of the computed HMAC value to the JWS Signature value MUST
   *   be done in a constant-time manner to thwart timing attacks.
   *   Alternatively, the computed HMAC value can be base64url encoded and
   *   compared to the received encoded JWS Signature value (also in a
   *   constant-time manner), as this comparison produces the same result as
   *   comparing the unencoded values.  In either case, if the values match,
   *   the HMAC has been validated.
   *
   *   Securing content and validation with the HMAC SHA-384 and HMAC
   *   SHA-512 algorithms is performed identically to the procedure for HMAC
   *   SHA-256 -- just using the corresponding hash algorithms with
   *   correspondingly larger minimum key sizes and result values: 384 bits
   *   each for HMAC SHA-384 and 512 bits each for HMAC SHA-512.
   *
   *   An example using this algorithm is shown in Appendix A.1 of [JWS].
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
