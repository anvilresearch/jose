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
const RSAPublicKey = require(path.join(cwd, 'src', 'keys', 'RSAPublicKey'))

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

    it('should define format of "n"', () => {
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

    it('should define format of "e"', () => {
      properties.e.format.should.equal('Base64urlUInt')
    })

  })

  /**
   * From PEM
   */
  describe('from PEM', () => {
    const PEM = 
    '-----BEGIN RSA PUBLIC KEY-----\n' +
    'MIIEowIBAAKCAQEAq/XXemqchJrxinZup0G/CbkAGUY59B1F9oWRMXZlDrD3OpRF\n' +
    'kqUNBmzyohap59LQMBNBL3JIK4PtmFkQ6zorJv3y9tRGaz3+JMpwOp1UWuV+3Jsq\n' +
    'x/3XSL3ylC0FgjCcr+RrkvNzbBU3pcF5xJ7giabb29ya4ao+NOJkFKOOoiH1iA7P\n' +
    'JH4f0j8SvzJjLOH6G9EYaDvj1Cbqc1GNYTYqhqGQvVkECMnZoOk7OMaZ+Nq0yJa8\n' +
    '0f/kI3FP85d+D/OVW4tg1Sf2oItieh5ZKKLBg6mzBmGb5GiFe4ip+aQUaupxwYi5\n' +
    '8DofmdZZvPCd1vv0Y8C3Ae0qEPpqibulwLGBrwIDAQABAoIBAEuiCJFOPONSJvTI\n' +
    'nGiyUS0ckn+LVMga6/++xZqkwVQR39uDBYq3T6BI4PsLztUo8uqCPYR51mZVU3ZT\n' +
    'jk53ui0fOvL3cLWQgax64ZvWQRjtobuz/8AQ1NSovv4PQ0H80Z3HcM0kiNq8BkrA\n' +
    'aydg3c+NdVwhjnm84DlwbaZqPbzvS8/Xxc2+fHtlbK/x1TycrL8B0PlIFYEZlxGL\n' +
    'rDofRFja46hT1kS15k/WPIlbN9gqIpwqgtnx5T0sBFpaRvRCCufbipOvTExh1RJd\n' +
    'wwcOfID0vvo1Ramem0MyAc15AGInPlArztIW5HG9TenykC2IYGTLFY7chdReB/Jz\n' +
    'l/+8npECgYEA4CKtiYZs8y+q4Xw/8Sc+8DrwJPT40jNXsYpKe/zH9cd0fji8qDuP\n' +
    'B06Mh1HQ9OER9Jalo6+9nALKb50/umBAzsCRu4zag6FFZ/ykOKbyJ1Sax/Ond2ZQ\n' +
    'WhD6U/eP4xiJ5LvNJv4YFj4Rnv34TWevW6Qja2tQRHOf1SzSJFPhYdkCgYEAxGhF\n' +
    'IXCXxod5bsTvroaKAhw3vzXUkjVPklVqc0qXO6DstvpPBBhc8V9nWRP2cUJKKRH8\n' +
    'eY2AXAwkl/hbSZnS82uyWkCRcZQ6MrBAkszUNfk6K5GVa4Zy/5ttPqV3ua6aRj6d\n' +
    'l1oQJSaku9GAMfQl2UcTJ37mP9SmOL7m+rQYwscCgYBq5790GB0BRVwxHs103a5E\n' +
    'cSg3yGyh/gE22mo6h1Bs54yl47QAXiATcSDQLnMHSg8BZZVt5JYAwsgBwrQx1lUz\n' +
    'CGC6Xy2emR58weEmcGKR5eXJt2rKJY/v1adAw5Tq0bp70iPBFHMysLpA5ow3h1v5\n' +
    'zuliBBaN/8Rdrnow/51ByQKBgDrvErdLAq/WnNBpFYZn5mdlsjCU5XkNuBevu6Zm\n' +
    'nmSNEBqDl0wiR1lCCE/JVqx7eKdEN17936M/HYfgRPwbxRm3mifMshfDo4bsLiQe\n' +
    'hBrB8vt5zr0Z9c3PBIPEwN0dkDs9tKnio2+SXeHhpjbXDLhaxFuYj1xd4ZaracGW\n' +
    'YsunAoGBALWFRQMHCRLR98uMxAm855BVNkHUKpsfotKcmkUQQHYde9CYNMDS4Glh\n' +
    'bCJFwSXa/CBiXRCqHGwOhakQED9i8RlAkVQLA9UPTQICNUoa8dspLzFic7a6aHkN\n' +
    'ruPxDI84mkD/H89FhshitQkgTTGqk9yM8PR6im9vieNsspZ+SVXn\n' +
    '-----END RSA PUBLIC KEY-----'

    const MALFORMED_PEM = 
    '-----BEGIN RSA PUBLIC KEY-----\n' +
    'Key Data\n' +
    '-----END RSA PUBLIC KEY-----'

    it('should return RSAPublicKey', () => {
      RSAPublicKey.fromPEM(PEM).should.be.instanceof(RSAPublicKey)
    })

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
        .to.throw('-----BEGIN RSA... is not a valid PEM encoded RSA Public key')
    })

  })

})
