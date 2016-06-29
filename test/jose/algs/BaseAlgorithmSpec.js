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
const BaseAlgorithm = require(
  path.join(cwd, 'src', 'jose', 'algs', 'BaseAlgorithm')
)

/**
 * Tests
 */
describe('BaseAlgorithm', () => {
  describe('constructor', () => {})

  describe('sign', () => {
    it('should throw an error', () => {
      expect(() => {
        let alg = new BaseAlgorithm()
        alg.sign()
      }).to.throw('Sign is not a supported operation for BaseAlgorithm')
    })
  })

  describe('verify', () => {
    it('should throw an error', () => {
      expect(() => {
        let alg = new BaseAlgorithm()
        alg.verify()
      }).to.throw('Verify is not a supported operation for BaseAlgorithm')
    })
  })

  describe('encrypt', () => {
    it('should throw an error', () => {
      expect(() => {
        let alg = new BaseAlgorithm()
        alg.encrypt()
      }).to.throw('Encrypt is not a supported operation for BaseAlgorithm')
    })
  })

  describe('decrypt', () => {
    it('should throw an error', () => {
      expect(() => {
        let alg = new BaseAlgorithm()
        alg.decrypt()
      }).to.throw('Decrypt is not a supported operation for BaseAlgorithm')
    })
  })

  describe('isPEM', () => {
    describe('with mismatching key type', () => {
      let invalidEC = 
        '-----BEGIN EC PARAMETERS-----\n' +
        'BgUrgQQAIQ==\n' +
        '-----END EC PARAMETERS-----\n' +
        '-----BEGIN EC PUBLIC KEY-----\n' +
        'This key should be invalid\n' +
        '-----END EC PRIVATE KEY-----'

      it('should return false', () => {
        BaseAlgorithm.isPEM(invalidEC).should.equal(false)
      })
    })

    describe('with no key data', () => {
      let invalidEC = 
        '-----BEGIN EC PARAMETERS-----\n' +
        'BgUrgQQAIQ==\n' +
        '-----END EC PARAMETERS-----\n' +
        '-----BEGIN EC PRIVATE KEY-----\n' +
        '-----END EC PRIVATE KEY-----'

      it('should return false', () => {
        BaseAlgorithm.isPEM(invalidEC).should.equal(false)
      })
    })

    describe('with missing algorithm', () => {
      let invalidEC = 
        '-----BEGIN EC PARAMETERS-----\n' +
        'BgUrgQQAIQ==\n' +
        '-----END EC PARAMETERS-----\n' +
        '-----BEGIN PRIVATE KEY-----\n' +
        'This key should be invalid\n' +
        '-----END PRIVATE KEY-----'

      it('should return false', () => {
        BaseAlgorithm.isPEM(invalidEC).should.equal(false)
      })
    })

    describe('with invalid key type', () => {
      let invalidEC = 
        '-----BEGIN EC PARAMETERS-----\n' +
        'BgUrgQQAIQ==\n' +
        '-----END EC PARAMETERS-----\n' +
        '-----BEGIN EC MY KEY-----\n' +
        'This key should be invalid\n' +
        '-----END EC MY KEY-----'

      it('should return false', () => {
        BaseAlgorithm.isPEM(invalidEC).should.equal(false)
      })
    })

    describe('with invalid number of dashes', () => {
      let invalidEC = 
        '----BEGIN EC PARAMETERS----\n' +
        'BgUrgQQAIQ==\n' +
        '----END EC PARAMETERS----\n' +
        '----BEGIN EC PRIVATE KEY----\n' +
        'This key should be invalid\n' +
        '----END EC PRIVATE KEY----'

      it('should return false', () => {
        BaseAlgorithm.isPEM(invalidEC).should.equal(false)
      })
    })

    describe('with valid EC key', () => {
      let validEC = 
        '-----BEGIN EC PARAMETERS-----\n' +
        'BgUrgQQAIQ==\n' +
        '-----END EC PARAMETERS-----\n' +
        '-----BEGIN EC PRIVATE KEY-----\n' +
        'Valid key with data\n' +
        '-----END EC PRIVATE KEY-----'

      it('should return true', () => {
        BaseAlgorithm.isPEM(validEC).should.equal(true)
      })
    })

    describe('with valid RSA key', () => {
      let validRSA = 
        '-----BEGIN RSA PRIVATE KEY-----\n' +
        'Valid key with data\n' +
        '-----END RSA PRIVATE KEY-----'

      it('should return true', () => {
        BaseAlgorithm.isPEM(validRSA).should.equal(true)
      })
    })

    describe('with valid UNKNOWN key', () => {
      let validUndefinedAlg = 
        '-----BEGIN UNKNOWN PRIVATE KEY-----\n' +
        'Valid key with data\n' +
        '-----END UNKNOWN PRIVATE KEY-----'

      it('should return true', () => {
        BaseAlgorithm.isPEM(validUndefinedAlg).should.equal(true)
      })
    })
  })

  describe('toPEM', () => {
    describe('on invalid algorithm', () => {
      let key, err

      before(() => {
        key = { 
          toPEM: sinon.spy(() => {
            throw new Error()
          }) 
        }
        sinon.stub(BaseAlgorithm, 'isPEM').returns(false)

        try {
          BaseAlgorithm.toPEM(key)
        } catch (error) {
          err = error
        }
      })

      after(() => {
        BaseAlgorithm.isPEM.restore()
      })

      it('should call key.toPEM', () => {
        key.toPEM.should.have.been.called
      })

      it('should throw an error', () => {
        err.message.should.equal('This algorithm does not support PEM')
      })
    })

    describe('with PEM', () => {
      let key, result

      before(() => {
        key = 'pem key'
        sinon.stub(BaseAlgorithm, 'isPEM').returns(true)
        
        result = BaseAlgorithm.toPEM(key)
      })

      after(() => {
        BaseAlgorithm.isPEM.restore()
      })

      it('should return itself', () => {
        result.should.equal('pem key')
      })
    })

    describe('with JWK', () => {
      let key

      before(() => {
        key = { toPEM: sinon.spy() }

        sinon.stub(BaseAlgorithm, 'isPEM').returns(false)
        BaseAlgorithm.toPEM(key)
      })

      after(() => {
        BaseAlgorithm.isPEM.restore()
      })

      it('should call key.toPEM', () => {
        key.toPEM.should.have.been.called
      })
    })
      
  })
})
