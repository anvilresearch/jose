'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

/**
 * Assertions
 */
chai.use(chaiAsPromised)
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const crypto = require('webcrypto')
const { JWD } = require('../../src')
const JWDSchema = require('../../src/schemas/JWDSchema')
const { RsaPrivateCryptoKey, RsaPublicCryptoKey } = require('../keys')

/**
 * Test data
 */
const doc = {
  payload: {
    iss: "hello world!"
  },
  signatures: [
    {
      protected: {
        alg: "RS256",
        typ: "JWS"
      },
      signature: "hOKzfFHDXWfrOoJEj5LAB6LYgiu4jebRoUbsJFn7sNKgDh3aTMKE2t-oZAV9QxjfEiHzpQIrMSEa-Kl8sytkhSzi7m01zp178VhcIglL7JGLZVPDdpq7cBQ1wuAk5tPrRRfZxaU97bhA9g110BVP4fmQi4PDBhAroIUXizwIrSJ5Vpi74yEpJjHYB4_iZc576Eajqw3cZdLgFCGeDKEJ-Rzir6l7HrNm1SaOGjgMEmSE9KxRBvQcIo5OdjH0nX0mErCjbhJrvvBkYqy5mHfWbtnr_mfE9PRp6NLqVH99IKDeReoXHw6118x_27YsqnrGDQ4wMGzodVaonwRSW8Yanw"
    }
  ]
}
const { payload, signatures: [ signatureDescriptor ] } = doc
const { protected: protectedHeader, signature } = signatureDescriptor
const serializedToken = JSON.stringify(doc)

/**
 * Tests
 */
describe('JWD', () => {

  /**
   * schema
   */
  describe('schema', () => {
    it('should return JWDSchema', () => {
      JWD.schema.should.equal(JWDSchema)
    })
  })

  /**
   * static decode
   */
  describe('static decode', () => {
    describe('non-string argument', () => {
      it('should reject with a DataError', (done) => {
        JWD.decode(false)
          .should.be.rejectedWith('JWD must be a string').and.notify(done)
      })
    })

    describe('Document Serialization', () => {
      it('should reject with a DataError', (done) => {
        JWD.decode('wrong')
          .should.be.rejectedWith('Invalid JWD').and.notify(done)
      })

      it('should return a JWD instance', (done) => {
        JWD.decode(serializedToken)
          .should.eventually.be.instanceof(JWD).and.notify(done)
      })

      it('should set JWD type', (done) => {
        JWD.decode(serializedToken).should.eventually.have.property('type')
          .that.equals('JWS').and.notify(done)
      })

      it('should set JWD payload', (done) => {
        JWD.decode(serializedToken)
          .should.eventually.deep.have.property('payload')
          .that.equals(payload).and.notify(done)
      })

      it('should set JWD serialization', (done) => {
        JWD.decode(serializedToken)
          .should.eventually.deep.have.property('serialization')
          .that.equals('document').and.notify(done)
      })

      it('should set JWD signatures', (done) => {
        JWD.decode(serializedToken)
          .should.eventually.have.property('signatures')
          .that.deep.includes(signatureDescriptor).and.notify(done)
      })

      describe('signatures', () => {

        it('should set JWD protected header', (done) => {
          JWD.decode(serializedToken).then(token => token.signatures[0])
            .should.eventually.have.property('protected')
            .that.deep.equals(protectedHeader).and.notify(done)
        })

        it('should set JWD signature', (done) => {
          JWD.decode(serializedToken).then(token => token.signatures[0])
            .should.eventually.have.property('signature')
            .that.deep.equals(signature).and.notify(done)
        })
      })
    })
  })

  describe('static encode', () => {})
  describe('static sign', () => {})
  describe('static verify', () => {})

  describe('isJWE', () => {
    it('should return true with "recipients" field')
  })

  /**
   * resolveKeys
   */
  describe('resolveKeys', () => {
    it('should throw with invalid argument')
    it('should return true with match')
    it('should return false with no match')
    it('should match JWK by `kid`')
    it('should match JWK by `use`')
  })

  /**
   * encode
   */
  describe('encode', () => {
    it('should reject invalid JWD', (done) => {
      let jwd = new JWD({
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: null },
        key: RsaPrivateCryptoKey
      })

      jwd.encode().should.be.rejected.and.notify(done)
    })

    it('should resolve a stringified JWD', (done) => {
      JWD.encode(RsaPrivateCryptoKey, {
        payload: { iss: 'hello world!' },
        signatures: [{ protected: { alg: 'RS256', typ: 'JWS' } }],
      }).should.eventually.equal(serializedToken).and.notify(done)
    })
  })

  /**
   * verify
   */
  describe('verify', () => {
    it('should reject invalid JWD', (done) => {
      let jwd = new JWD({
        header: { alg: 'RS256', kid: 'r4nd0mbyt3s' },
        payload: { iss: null },
        key: RsaPrivateCryptoKey
      })

      jwd.verify().should.be.rejected.and.notify(done)
    })

    it('should resolve a boolean', (done) => {
      JWD.verify(RsaPublicCryptoKey, serializedToken)
        .then(jwd => {
          jwd.verify().should.eventually.equal(true).and.notify(done)
        })
    })
  })
})
