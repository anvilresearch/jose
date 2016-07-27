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
const ES = require(path.join(cwd, 'src', 'algs', 'ECDSA'))

/**
 * Tests
 */
describe('Digital Signature with ECDSA', () => {

  /**
   * 3.4.  Digital Signature with ECDSA
   *
   *   The Elliptic Curve Digital Signature Algorithm (ECDSA) [DSS] provides
   *   for the use of Elliptic Curve Cryptography, which is able to provide
   *   equivalent security to RSA cryptography but using shorter key sizes
   *   and with greater processing speed for many operations.  This means
   *   that ECDSA digital signatures will be substantially smaller in terms
   *   of length than equivalently strong RSA digital signatures.
   *
   *   This specification defines the use of ECDSA with the P-256 curve and
   *   the SHA-256 cryptographic hash function, ECDSA with the P-384 curve
   *   and the SHA-384 hash function, and ECDSA with the P-521 curve and the
   *   SHA-512 hash function.  The P-256, P-384, and P-521 curves are
   *   defined in [DSS].
   *
   *   The ECDSA P-256 SHA-256 digital signature is generated as follows:
   *
   *   1.  Generate a digital signature of the JWS Signing Input using ECDSA
   *       P-256 SHA-256 with the desired private key.  The output will be
   *       the pair (R, S), where R and S are 256-bit unsigned integers.
   *
   *   2.  Turn R and S into octet sequences in big-endian order, with each
   *       array being be 32 octets long.  The octet sequence
   *       representations MUST NOT be shortened to omit any leading zero
   *       octets contained in the values.
   *
   *   3.  Concatenate the two octet sequences in the order R and then S.
   *       (Note that many ECDSA implementations will directly produce this
   *       concatenation as their output.)
   *
   *   4.  The resulting 64-octet sequence is the JWS Signature value.
   *
   *   The following "alg" (algorithm) Header Parameter values are used to
   *   indicate that the JWS Signature is a digital signature value computed
   *   using the corresponding algorithm:
   *
   *           +-------------------+-------------------------------+
   *           | "alg" Param Value | Digital Signature Algorithm   |
   *           +-------------------+-------------------------------+
   *           | ES256             | ECDSA using P-256 and SHA-256 |
   *           | ES384             | ECDSA using P-384 and SHA-384 |
   *           | ES512             | ECDSA using P-521 and SHA-512 |
   *           +-------------------+-------------------------------+
   *
   *   The ECDSA P-256 SHA-256 digital signature for a JWS is validated as
   *   follows:
   *
   *   1.  The JWS Signature value MUST be a 64-octet sequence.  If it is
   *       not a 64-octet sequence, the validation has failed.
   *
   *   2.  Split the 64-octet sequence into two 32-octet sequences.  The
   *       first octet sequence represents R and the second S.  The values R
   *       and S are represented as octet sequences using the Integer-to-
   *       OctetString Conversion defined in Section 2.3.7 of SEC1 [SEC1]
   *       (in big-endian octet order).
   *
   *   3.  Submit the JWS Signing Input, R, S, and the public key (x, y) to
   *       the ECDSA P-256 SHA-256 validator.
   *
   *   Signing and validation with the ECDSA P-384 SHA-384 and ECDSA P-521
   *   SHA-512 algorithms is performed identically to the procedure for
   *   ECDSA P-256 SHA-256 -- just using the corresponding hash algorithms
   *   with correspondingly larger result values.  For ECDSA P-384 SHA-384,
   *   R and S will be 384 bits each, resulting in a 96-octet sequence.  For
   *   ECDSA P-521 SHA-512, R and S will be 521 bits each, resulting in a
   *   132-octet sequence.  (Note that the Integer-to-OctetString Conversion
   *   defined in Section 2.3.7 of SEC1 [SEC1] used to represent R and S as
   *   octet sequences adds zero-valued high-order padding bits when needed
   *   to round the size up to a multiple of 8 bits; thus, each 521-bit
   *   integer is represented using 528 bits in 66 octets.)
   *
   *   Examples using these algorithms are shown in Appendices A.3 and A.4
   *   of [JWS].
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
