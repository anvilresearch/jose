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
const NONE = require(path.join(cwd, 'src', 'tokens', 'algs', 'None'))

/**
 * Tests
 */
describe('Using the Algorithm "none"', () => {

  /**
   * 3.6.  Using the Algorithm "none"
   *
   *   JWSs MAY also be created that do not provide integrity protection.
   *   Such a JWS is called an Unsecured JWS.  An Unsecured JWS uses the
   *   "alg" value "none" and is formatted identically to other JWSs, but
   *   MUST use the empty octet sequence as its JWS Signature value.
   *   Recipients MUST verify that the JWS Signature value is the empty
   *   octet sequence.
   *
   *   Implementations that support Unsecured JWSs MUST NOT accept such
   *   objects as valid unless the application specifies that it is
   *   acceptable for a specific object to not be integrity protected.
   *   Implementations MUST NOT accept Unsecured JWSs by default.  In order
   *   to mitigate downgrade attacks, applications MUST NOT signal
   *   acceptance of Unsecured JWSs at a global level, and SHOULD signal
   *   acceptance on a per-object basis.  See Section 8.5 for security
   *   considerations associated with using this algorithm.
   */
  describe('constructor', () => {
    it('should set bitlength')
  })

  describe('sign', () => {
    it('should return ""')
  })

  describe('verify', () => {
    it('should return true with valid input')
    it('should return false with invalid input')
  })
})
