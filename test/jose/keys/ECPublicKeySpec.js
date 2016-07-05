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
const ECPublicKey = require(path.join(cwd, 'src', 'jose', 'keys', 'ECPublicKey'))

/**
 * Tests
 */
describe('ECPublicKey', () => {

  /**
   * Shema
   */
  describe('schema', () => {
    let {schema: {properties}} = ECPublicKey

    /**
     * 6.2.  Parameters for Elliptic Curve Keys
     * https://tools.ietf.org/html/rfc7518#section-6.2
     *
     *   JWKs can represent Elliptic Curve [DSS] keys.  In this case, the
     *   "kty" member value is "EC".
     *
     * 6.2.1.  Parameters for Elliptic Curve Public Keys
     *
     *   An Elliptic Curve public key is represented by a pair of coordinates
     *   drawn from a finite field, which together define a point on an
     *   Elliptic Curve.  The following members MUST be present for all
     *   Elliptic Curve public keys:
     *
     *   o  "crv"
     *   o  "x"
     *
     *   The following member MUST also be present for Elliptic Curve public
     *   keys for the three curves defined in the following section:
     *
     *   o  "y"
     *
     * 6.2.1.1.  "crv" (Curve) Parameter
     *
     *   The "crv" (curve) parameter identifies the cryptographic curve used
     *   with the key.  Curve values from [DSS] used by this specification
     *   are:
     *
     *   o  "P-256"
     *   o  "P-384"
     *   o  "P-521"
     *
     *   These values are registered in the IANA "JSON Web Key Elliptic Curve"
     *   registry defined in Section 7.6.  Additional "crv" values can be
     *   registered by other specifications.  Specifications registering
     *   additional curves must define what parameters are used to represent
     *   keys for the curves registered.  The "crv" value is a case-sensitive
     *   string.
     *
     *   SEC1 [SEC1] point compression is not supported for any of these three
     *   curves.
     */
    it('should require "crv"', () => {
      properties.crv.required.should.equal(true)
    })

    it('should define type of "crv"', () => {
      properties.crv.type.should.equal('string')
    })

    it('should define enum of "crv"', () => {
      properties.crv.enum.should.eql([
        'P-256',
        'P-384',
        'P-521'
      ])
    })

    /**
     * 6.2.1.2.  "x" (X Coordinate) Parameter
     *
     *   The "x" (x coordinate) parameter contains the x coordinate for the
     *   Elliptic Curve point.  It is represented as the base64url encoding of
     *   the octet string representation of the coordinate, as defined in
     *   Section 2.3.5 of SEC1 [SEC1].  The length of this octet string MUST
     *   be the full size of a coordinate for the curve specified in the "crv"
     *   parameter.  For example, if the value of "crv" is "P-521", the octet
     *   string must be 66 octets long.
     */
    it('should require "x"', () => {
      properties.x.required.should.equal(true)
    })

    it('should define type of "x"', () => {
      properties.x.type.should.equal('string')
    })

    it('should define format of "x"', () => {
      properties.x.format.should.equal('base64url')
    })

    /**
     * 6.2.1.3.  "y" (Y Coordinate) Parameter
     *
     *   The "y" (y coordinate) parameter contains the y coordinate for the
     *   Elliptic Curve point.  It is represented as the base64url encoding of
     *   the octet string representation of the coordinate, as defined in
     *   Section 2.3.5 of SEC1 [SEC1].  The length of this octet string MUST
     *   be the full size of a coordinate for the curve specified in the "crv"
     *   parameter.  For example, if the value of "crv" is "P-521", the octet
     *   string must be 66 octets long.
     */
    it('should require "y"', () => {
      properties.y.required.should.equal(true)
    })

    it('should define type of "y"', () => {
      properties.y.type.should.equal('string')
    })

    it('should define format of "y"', () => {
      properties.y.format.should.equal('base64url')
    })
  })
})
