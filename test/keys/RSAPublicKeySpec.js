'use strict'

/**
 * Test dependencies
 */
const cwd = process.cwd()
const path = require('path')
const chai = require('chai')

/**
 * Test PEM
 */
//const publicKey = fs.readFileSync(
//  path.join(cwd, 'test', 'lib', 'public.pem'),
//  'ascii'
//)

const MALFORMED_PEM =
`-----BEGIN PUBLIC KEY-----
Malformed Key Data
-----END PUBLIC KEY-----`

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RSAPublicKey = require('../../src/keys/RSAPublicKey')
const PEM = require('../../src/keys/PEM')
const {PEM_REGEXP} = require('../../src/formats')

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

    it.skip('should define format of "n"', () => {
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

    it.skip('should define format of "e"', () => {
      properties.e.format.should.equal('Base64urlUInt')
    })

  })

  /**
   * From PEM
   */
  describe('fromPEM', () => {

    it('should return RSAPublicKey')
    //it('should return RSAPublicKey', () => {
    //  RSAPublicKey.fromPEM(publicKey).should.be.instanceof(RSAPublicKey)
    //})

    it('should throw with "undefined" arg', () => {
      expect(() => { RSAPublicKey.fromPEM(undefined) })
        .to.throw('undefined is not a valid PEM encoded RSA Public key')
    })

    it('should throw with "null" arg', () => {
      expect(() => { RSAPublicKey.fromPEM(null) })
        .to.throw('null is not a valid PEM encoded RSA Public key')
    })

    it('should throw with "false" arg', () => {
      expect(() => { RSAPublicKey.fromPEM(false) })
        .to.throw('false is not a valid PEM encoded RSA Public key')
    })

    it('should throw with "true" arg', () => {
      expect(() => { RSAPublicKey.fromPEM(true) })
        .to.throw('true is not a valid PEM encoded RSA Public key')
    })

    it('should throw with "object" arg', () => {
      expect(() => { RSAPublicKey.fromPEM({}) })
        .to.throw('{} is not a valid PEM encoded RSA Public key')
    })

    it('should throw with "array" arg', () => {
      expect(() => { RSAPublicKey.fromPEM([]) })
        .to.throw('[] is not a valid PEM encoded RSA Public key')
    })

    it('should throw with empty string arg', () => {
      expect(() => { RSAPublicKey.fromPEM("") })
        .to.throw('"" is not a valid PEM encoded RSA Public key')
    })

    it('should throw with malformed PEM', () => {
      expect(() => { RSAPublicKey.fromPEM(MALFORMED_PEM) })
        .to.throw('-----BEGIN PUB... is not a valid PEM encoded RSA Public key')
    })

  })

  /**
   * To PEM
   */
  describe('toPEM', () => {

    describe('with cached value', () => {
      //let pem, match

      //before(() => {
      //  sinon.spy(PEM, 'fromJWK')

      //  pem = RSAPublicKey.fromPEM(publicKey).toPEM()
      //  match = pem.match(PEM_REGEXP)
      //})

      //after(() => {
      //  PEM.fromJWK.restore()
      //})

      it('should return the cached PEM')
      //it('should return the cached PEM', () => {
      //  PEM.fromJWK.should.not.have.been.called
      //})

      it('should return a PEM encoded string')
      //it('should return a PEM encoded string', () => {
      //  pem.should.be.a.string
      //  expect(match).to.not.be.null
      //})
    })

    describe('without cached value', () => {
      //let jwk, pem, match

      //before(() => {
      //  sinon.spy(PEM, 'fromJWK')
      //  let jwk = PEM.toJWK(publicKey)

      //  pem = new RSAPublicKey(jwk).toPEM()
      //  match = pem.match(PEM_REGEXP)
      //})

      //after(() => {
      //  PEM.fromJWK.restore()
      //})

      it('should assemble the PEM')
      //it('should assemble the PEM', () => {
      //  PEM.fromJWK.should.have.been.called
      //})

      it('should return a PEM encoded string')
      //it('should return a PEM encoded string', () => {
      //  pem.should.be.a.string
      //  expect(match).to.not.be.null
      //})
    })
  })
})
