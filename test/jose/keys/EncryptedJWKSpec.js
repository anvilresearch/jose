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
const EncryptedJWK = require(path.join(cwd, 'src', 'jose', 'keys', 'EncryptedJWK'))

/**
 * Tests
 */
describe('EncryptedJWK', () => {

  /**
   * 7.  Encrypted JWK and Encrypted JWK Set Formats
   * https://tools.ietf.org/html/rfc7517#section-7
   *
   *   Access to JWKs containing non-public key material by parties without
   *   legitimate access to the non-public information MUST be prevented.
   *   This can be accomplished by encrypting the JWK when potentially
   *   observable by such parties to prevent the disclosure of private or
   *   symmetric key values.  The use of an Encrypted JWK, which is a JWE
   *   with the UTF-8 encoding of a JWK as its plaintext value, is
   *   recommended for this purpose.  The processing of Encrypted JWKs is
   *   identical to the processing of other JWEs.  A "cty" (content type)
   *   Header Parameter value of "jwk+json" MUST be used to indicate that
   *   the content of the JWE is a JWK, unless the application knows that
   *   the encrypted content is a JWK by another means or convention, in
   *   which case the "cty" value would typically be omitted.
   *
   *   JWK Sets containing non-public key material will also need to be
   *   encrypted under these circumstances.  The use of an Encrypted JWK
   *   Set, which is a JWE with the UTF-8 encoding of a JWK Set as its
   *   plaintext value, is recommended for this purpose.  The processing of
   *   Encrypted JWK Sets is identical to the processing of other JWEs.  A
   *   "cty" (content type) Header Parameter value of "jwk-set+json" MUST be
   *   used to indicate that the content of the JWE is a JWK Set, unless the
   *   application knows that the encrypted content is a JWK Set by another
   *   means or convention, in which case the "cty" value would typically be
   *   omitted.
   *
   *   See Appendix C for an example encrypted JWK.
   */

})
