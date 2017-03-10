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
      it('should throw with a DataError', () => {
        expect(() => {
          JWD.decode(false)
        }).to.throw('JWD must be a string')
      })
    })

    describe('Document Serialization', () => {
      it('should throw with a DataError', () => {
        expect(() => {
          JWD.decode('wrong')
        }).to.throw('Invalid JWD')
      })

      it('should return a JWD instance', () => {
        JWD.decode(serializedToken)
          .should.be.instanceof(JWD)
      })

      it('should set JWD type', () => {
        JWD.decode(serializedToken).should.have.property('type')
          .that.equals('JWS')
      })

      it('should set JWD payload', () => {
        JWD.decode(serializedToken)
          .should.deep.have.property('payload')
          .that.equals(payload)
      })

      it('should set JWD serialization', () => {
        JWD.decode(serializedToken)
          .should.deep.have.property('serialization')
          .that.equals('document')
      })

      it('should set JWD signatures', () => {
        JWD.decode(serializedToken)
          .should.have.property('signatures')
          .that.deep.includes(signatureDescriptor)
      })

      describe('signatures', () => {

        it('should set JWD protected header', () => {
          JWD.decode(serializedToken).signatures[0]
            .should.have.property('protected')
            .that.deep.equals(protectedHeader)
        })

        it('should set JWD signature', () => {
          JWD.decode(serializedToken).signatures[0]
            .should.have.property('signature')
            .that.deep.equals(signature)
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
