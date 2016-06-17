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
const ProviderSchema = require(path.join(cwd, 'src', 'ProviderSchema'))

/**
 * Tests
 */
describe('OpenID Connect Provider Schema', () => {
  let {properties} = ProviderSchema

  /*
   *  3.  OpenID Provider Metadata
   *  http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
   *
   *  OpenID Providers have metadata describing their configuration. These OpenID
   *  Provider Metadata values are used by OpenID Connect:
   */
  it('should be an instance of JSONSchema')

  /**
   *  issuer
   *    REQUIRED. URL using the https scheme with no query or fragment component
   *    that the OP asserts as its Issuer Identifier. If Issuer discovery is
   *    supported (see Section 2), this value MUST be identical to the issuer value
   *    returned by WebFinger. This also MUST be identical to the iss Claim value
   *    in ID Tokens issued from this Issuer.
   */
  it('should require "issuer"', () => {
    properties.issuer.required.should.equal(true)
  })

  it('should define type of "issuer"', () => {
    properties.issuer.type.should.equal('string')
  })

  it('should define format of "issuer"', () => {
    properties.issuer.format.should.equal('url')
  })

  /**
   * authorization_endpoint
   *    REQUIRED. URL of the OP's OAuth 2.0 Authorization Endpoint [OpenID.Core].
   */
  it('should require "authorization_endpoint"', () => {
    properties.authorization_endpoint.required.should.equal(true)
  })

  it('should define type of "authorization_endpoint"', () => {
    properties.authorization_endpoint.type.should.equal('string')
  })

  it('should define format of "authorization_endpoint"', () => {
    properties.authorization_endpoint.format.should.equal('url')
  })

  /**
   *  token_endpoint
   *    URL of the OP's OAuth 2.0 Token Endpoint [OpenID.Core]. This is REQUIRED
   *    unless only the Implicit Flow is used.
   */
  it('should require "token_endpoint"', () => {
    properties.token_endpoint.required.should.equal(true)
  })

  it('should define type of "token_endpoint"', () => {
    properties.token_endpoint.type.should.equal('string')
  })

  it('should define format of "token_endpoint"', () => {
    properties.token_endpoint.format.should.equal('url')
  })

  /**
   *  userinfo_endpoint
   *    RECOMMENDED. URL of the OP's UserInfo Endpoint [OpenID.Core]. This URL MUST
   *    use the https scheme and MAY contain port, path, and query parameter
   *    components.
   */
  it('should require "userinfo_endpoint"', () => {
    properties.userinfo_endpoint.required.should.equal(true)
  })

  it('should define type of "userinfo_endpoint"', () => {
    properties.userinfo_endpoint.type.should.equal('string')
  })

  it('should define format of "userinfo_endpoint"', () => {
    properties.userinfo_endpoint.format.should.equal('url')
  })

  /**
   *  jwks_uri
   *    REQUIRED. URL of the OP's JSON Web Key Set [JWK] document. This contains the
   *    signing key(s) the RP uses to validate signatures from the OP. The JWK Set
   *    MAY also contain the Server's encryption key(s), which are used by RPs to
   *    encrypt requests to the Server. When both signing and encryption keys are
   *    made available, a use (Key Use) parameter value is REQUIRED for all keys in
   *    the referenced JWK Set to indicate each key's intended usage. Although some
   *    algorithms allow the same key to be used for both signatures and encryption,
   *    doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY
   *    be used to provide X.509 representations of keys provided. When used, the
   *    bare key values MUST still be present and MUST match those in the
   *    certificate.
   */
  it('should require "jwks_uri"', () => {
    properties.jwks_uri.required.should.equal(true)
  })

  it('should define type of "jwks_uri"', () => {
    properties.jwks_uri.type.should.equal('string')
  })

  it('should define format of "jwks_uri"', () => {
    properties.jwks_uri.format.should.equal('url')
  })

  /**
   *  registration_endpoint
   *    RECOMMENDED. URL of the OP's Dynamic Client Registration Endpoint
   *    [OpenID.Registration].
   */
  it('should require "registration_endpoint"', () => {
    properties.registration_endpoint.required.should.equal(true)
  })

  it('should define type of "registration_endpoint"', () => {
    properties.registration_endpoint.type.should.equal('string')
  })

  it('should define format of "registration_endpoint"', () => {
    properties.registration_endpoint.format.should.equal('url')
  })

  /**
   *  scopes_supported
   *    RECOMMENDED. JSON array containing a list of the OAuth 2.0 [RFC6749] scope
   *    values that this server supports. The server MUST support the openid scope
   *    value. Servers MAY choose not to advertise some supported scope values even
   *    when this parameter is used, although those defined in [OpenID.Core] SHOULD
   *    be listed, if supported.
   */
  it('should define type of "scopes_supported"', () => {
    properties.scopes_supported.type.should.equal('array')
  })

  /**
   *  response_types_supported
   *    REQUIRED. JSON array containing a list of the OAuth 2.0 response_type values
   *    that this OP supports. Dynamic OpenID Providers MUST support the code,
   *    id_token, and the token id_token Response Type values.
   */
  it('should define type of "response_types_supported"', () => {
    properties.response_types_supported.type.should.equal('array')
  })

  it('should require "response_types_supported"', () => {
    properties.response_types_supported.required.should.equal(true)
  })

  it('should define enum of "response_types_supported"', () => {
    properties.response_types_supported.enum.should.eql([
      'code',
      'code token',
      'code id_token',
      'id_token',
      'id_token token',
      'code id_token token',
      'none'
    ])
  })

  it('should define default of "response_types_supported"', () => {
    properties.response_types_supported.default.should.eql([
      'code',
      'code token',
      'code id_token',
      'id_token',
      'id_token token',
      'code id_token token',
      'none'
    ])
  })

  /**
   *  response_modes_supported
   *    OPTIONAL. JSON array containing a list of the OAuth 2.0 response_mode values
   *    that this OP supports, as specified in OAuth 2.0 Multiple Response Type
   *    Encoding Practices [OAuth.Responses]. If omitted, the default for Dynamic
   *    OpenID Providers is ["query", "fragment"].
   */
  it('should define type of "response_modes_supported"', () => {
    properties.response_modes_supported.type.should.equal('array')
  })

  it('should define default of "response_modes_supported"', () => {
    properties.response_modes_supported.default.should.eql([
      'query',
      'fragment'
    ])
  })

  it('should define enum of "response_modes_supported"', () => {
    properties.response_modes_supported.enum.should.eql([
      'query',
      'fragment'
    ])
  })

  /**
   *  grant_types_supported
   *    OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Type values
   *    that this OP supports. Dynamic OpenID Providers MUST support the
   *    authorization_code and implicit Grant Type values and MAY support other
   *    Grant Types. If omitted, the default value is ["authorization_code",
   *    "implicit"].
   */
  it('should define type of "grant_types_supported"', () => {
    properties.grant_types_supported.type.should.equal('array')
  })

  it('should define default of "grant_types_supported"', () => {
    properties.grant_types_supported.default.should.eql([
      'authorization_code',
      'implicit',
      'refresh_token',
      'client_credentials'
    ])
  })

  it('should define enum of "grant_types_supported"', () => {
    properties.grant_types_supported.enum.should.eql([
      'authorization_code',
      'implicit',
      'refresh_token',
      'client_credentials'
    ])
  })

  /**
   *  acr_values_supported
   *    OPTIONAL. JSON array containing a list of the Authentication Context Class
   *    References that this OP supports.
   */
  it('should define type of "acr_values_supported"', () => {
    properties.acr_values_supported.type.should.equal('array')
  })

  /**
   *  subject_types_supported
   *    REQUIRED. JSON array containing a list of the Subject Identifier types that
   *    this OP supports. Valid types include pairwise and public.
   */
  it('should define type of "subject_types_supported"', () => {
    properties.subject_types_supported.type.should.equal('array')
  })

  it('should require "subject_types_supported"', () => {
    properties.subject_types_supported.required.should.equal(true)
  })

  it('should define default of "subject_types_supported"', () => {
    properties.subject_types_supported.default.should.eql([
      'public'
    ])
  })

  it('should define enum of "subject_types_supported"', () => {
    properties.subject_types_supported.enum.should.eql([
      'pairwise',
      'public'
    ])
  })

  /**
   *  id_token_signing_alg_values_supported
   *    REQUIRED. JSON array containing a list of the JWS signing algorithms (alg
   *    values) supported by the OP for the ID Token to encode the Claims in a JWT
   *    [JWT]. The algorithm RS256 MUST be included. The value none MAY be supported,
   *    but MUST NOT be used unless the Response Type used returns no ID Token from
   *    the Authorization Endpoint (such as when using the Authorization Code Flow).
   */
  it('should define type of "id_token_signing_alg_values_supported"', () => {
    properties.id_token_signing_alg_values_supported.type.should.equal('array')
  })

  it('should require "id_token_signing_alg_values_supported"', () => {
    properties.id_token_signing_alg_values_supported.required.should.equal(true)
  })

  it('should define default of "id_token_signing_alg_values_supported"', () => {
    properties.id_token_signing_alg_values_supported.default.should.eql([
      'RS256',
      'none'
    ])
  })

  it('should define enum of "id_token_signing_alg_values_supported"', () => {
    properties.id_token_signing_alg_values_supported.enum.should.eql([
      'RS256',
      'none'
    ])
  })


  /**
   *  id_token_encryption_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms (alg
   *    values) supported by the OP for the ID Token to encode the Claims in a JWT
   *    [JWT].
   */
  it('should define type of "id_token_encryption_alg_values_supported"', () => {
    properties.id_token_encryption_alg_values_supported.type.should.equal('array')
  })

  it('should define enum of "id_token_encryption_alg_values_supported"')

  /**
   *  id_token_encryption_enc_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc
   *    values) supported by the OP for the ID Token to encode the Claims in a JWT
   *    [JWT].
   */
  it('should define type of "id_token_encryption_enc_values_supported"', () => {
    properties.id_token_encryption_enc_values_supported.type.should.equal('array')
  })

  it('should define enum of "id_token_encryption_enc_values_supported"')

  /**
   *  userinfo_signing_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWS [JWS] signing algorithms
   *    (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims in
   *    a JWT [JWT]. The value none MAY be included.
   */
  it('should define type of "userinfo_signing_alg_values_supported"', () => {
    properties.userinfo_signing_alg_values_supported.type.should.equal('array')
  })

  it('should define enum of "userinfo_signing_alg_values_supported"')

  /**
   *  userinfo_encryption_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE [JWE] encryption algorithms
   *    (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims in
   *    a JWT [JWT].
   */
  it('should define type of "userinfo_encryption_alg_values_supported"', () => {
    properties.userinfo_encryption_alg_values_supported.type.should.equal('array')
  })

  it('should define enum of "userinfo_encryption_alg_values_supported"')

  /**
   *  userinfo_encryption_enc_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc
   *    values) [JWA] supported by the UserInfo Endpoint to encode the Claims in a
   *    JWT [JWT].
   */
  it('should define type of "userinfo_encryption_enc_values_supported"', () => {
    properties.userinfo_encryption_enc_values_supported.type.should.equal('array')
  })

  it('should define default of "userinfo_encryption_enc_values_supported"')

  /**
   *  request_object_signing_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg
   *    values) supported by the OP for Request Objects, which are described in
   *    Section 6.1 of OpenID Connect Core 1.0 [OpenID.Core]. These algorithms are
   *    used both when the Request Object is passed by value (using the requesth
   *    parameter) and when it is passed by reference (using the request_uri
   *    parameter). Servers SHOULD support none and RS256.
   */
  it('should define type of "request_object_signing_alg_values_supported"', () => {
    properties.request_object_signing_alg_values_supported.type.should.equal('array')
  })

  it('should define enum of "request_object_signing_alg_values_supported"', () => {
    properties.request_object_signing_alg_values_supported.enum.should.eql([
      'RS256',
      'none'
    ])
  })

  /**
   *  request_object_encryption_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms (alg
   *    values) supported by the OP for Request Objects. These algorithms are used
   *    both when the Request Object is passed by value and when it is passed by
   *    reference.
   */
  it('should define type of "request_object_encryption_alg_values_supported"', () => {
    properties.request_object_encryption_alg_values_supported.type
      .should.equal('array')
  })

  it('should define enum of "request_object_encryption_alg_values_supported"')

  /**
   *  request_object_encryption_enc_values_supported
   *    OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc
   *    values) supported by the OP for Request Objects. These algorithms are used
   *    both when the Request Object is passed by value and when it is passed by
   *    reference.
   */
  it('should define type of "request_object_encryption_enc_values_supported"', () => {
    properties.request_object_encryption_enc_values_supported.type
      .should.equal('array')
  })

  it('should define enum of "request_object_encryption_enc_values_supported"')

  /**
   *  token_endpoint_auth_methods_supported
   *    OPTIONAL. JSON array containing a list of Client Authentication methods
   *    supported by this Token Endpoint. The options are client_secret_post,
   *    client_secret_basic, client_secret_jwt, and private_key_jwt, as described in
   *    Section 9 of OpenID Connect Core 1.0 [OpenID.Core]. Other authentication
   *    methods MAY be defined by extensions. If omitted, the default is
   *    client_secret_basic -- the HTTP Basic Authentication Scheme specified in
   *    Section 2.3.1 of OAuth 2.0 [RFC6749].
   */
  it('should define type of "token_endpoint_auth_methods_supported"', () => {
    properties.token_endpoint_auth_methods_supported.type.should.equal('array')
  })

  it('should define default of "token_endpoint_auth_methods_supported"', () => {
    properties.token_endpoint_auth_methods_supported.default.should.eql([
      'client_secret_basic'
    ])
  })

  it('should define enum of "token_endpoint_auth_methods_supported"', () => {
    properties.token_endpoint_auth_methods_supported.enum
      .should.eql([
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt'
      ])
  })

  /**
   *  token_endpoint_auth_signing_alg_values_supported
   *    OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg
   *    values) supported by the Token Endpoint for the signature on the JWT [JWT]
   *    used to authenticate the Client at the Token Endpoint for the private_key_jwt
   *    and client_secret_jwt authentication methods. Servers SHOULD support RS256.
   *    The value none MUST NOT be used.
   */
  it('should define type of "token_endpoint_auth_signing_alg_values_supported"', () => {
    properties.token_endpoint_auth_signing_alg_values_supported.type.should.equal('array')
  })


  it('should define default of "token_endpoint_auth_signing_alg_values_supported"', () => {
    properties.token_endpoint_auth_signing_alg_values_supported.enum.should.eql([
      'RS256'
    ])
  })

  it('should define enum of "token_endpoint_auth_signing_alg_values_supported"', () => {
    properties.token_endpoint_auth_signing_alg_values_supported.enum.should.eql([
      'RS256'
    ])
  })

  /**
   *  display_values_supported
   *    OPTIONAL. JSON array containing a list of the display parameter values that
   *    the OpenID Provider supports. These values are described in Section 3.1.2.1
   *    of OpenID Connect Core 1.0 [OpenID.Core].
   */
  it('should define type of "display_values_supported"', () => {
    properties.display_values_supported.type.should.equal('array')
  })

  it('should define default of "display_values_supported"')
  it('should define enum of "display_values_supported"')

  /**
   *  claim_types_supported
   *    OPTIONAL. JSON array containing a list of the Claim Types that the OpenID
   *    Provider supports. These Claim Types are described in Section 5.6 of OpenID
   *    Connect Core 1.0 [OpenID.Core]. Values defined by this specification are
   *    normal, aggregated, and distributed. If omitted, the implementation supports
   *    only normal Claims.
   */
  it('should define type of "claim_types_supported"', () => {
    properties.claim_types_supported.type.should.equal('array')
  })

  it('should define default of "claim_types_supported"')
  it('should define enum of "claim_types_supported"')

  /**
   *  claims_supported
   *    RECOMMENDED. JSON array containing a list of the Claim Names of the Claims
   *    that the OpenID Provider MAY be able to supply values for. Note that for
   *    privacy or other reasons, this might not be an exhaustive list.
   */
  it('should define type of "claims_supported"', () => {
    properties.claims_supported.type.should.equal('array')
  })

  it('should define default of "claims_supported"')
  it('should define enum of "claims_supported"')

  /**
   *  service_documentation
   *    OPTIONAL. URL of a page containing human-readable information that developers
   *    might want or need to know when using the OpenID Provider. In particular, if
   *    the OpenID Provider does not support Dynamic Client Registration, then
   *    information on how to register Clients needs to be provided in this
   *    documentation.
   */
  it('should define type of "service_documentation"')
  it('should define format of "service_documentation"')
  it('should define default of "service_documentation"')
  it('should define enum of "service_documentation"')

  /**
   *  claims_locales_supported
   *    OPTIONAL. Languages and scripts supported for values in Claims being
   *    returned, represented as a JSON array of BCP47 [RFC5646] language tag
   *    values. Not all languages and scripts are necessarily supported for all
   *    Claim values.
   */
  it('should define type of "claims_locales_supported"', () => {
    properties.claims_locales_supported.type.should.equal('array')
  })

  it('should define format of "claims_locales_supported"')

  /**
   *  ui_locales_supported
   *    OPTIONAL. Languages and scripts supported for the user interface, represented
   *    as a JSON array of BCP47 [RFC5646] language tag values.
   */
  it('should define type of "ui_locales_supported"', () => {
    properties.ui_locales_supported.type.should.equal('array')
  })

  it('should define format of "ui_locales_supported"')

  /**
   *  claims_parameter_supported
   *    OPTIONAL. Boolean value specifying whether the OP supports use of the claims
   *    parameter, with true indicating support. If omitted, the default value is
   *    false.
   */
  it('should define type of "claims_parameter_supported"', () => {
    properties.claims_parameter_supported.type.should.equal('boolean')
  })

  it('should define default of "claims_parameter_supported"', () => {
    properties.claims_parameter_supported.default.should.equal(false)
  })

  /**
   *  request_parameter_supported
   *    OPTIONAL. Boolean value specifying whether the OP supports use of the request
   *    parameter, with true indicating support. If omitted, the default value is
   *    false.
   */
  it('should define type of "request_parameter_supported"', () => {
    properties.request_parameter_supported.type.should.equal('boolean')
  })

  it('should define default of "request_parameter_supported"', () => {
    properties.request_parameter_supported.default.should.equal(false)
  })

  /**
   *  request_uri_parameter_supported
   *    OPTIONAL. Boolean value specifying whether the OP supports use of the
   *    request_uri parameter, with true indicating support. If omitted, the default
   *    value is true.
   */
  it('should define type of "request_uri_parameter_supported"', () => {
    properties.request_uri_parameter_supported.type.should.equal('boolean')
  })

  it('should define default of "request_uri_parameter_supported"', () => {
    properties.request_uri_parameter_supported.default.should.equal(true)
  })

  /**
   *  require_request_uri_registration
   *    OPTIONAL. Boolean value specifying whether the OP requires any request_uri
   *    values used to be pre-registered using the request_uris registration
   *    parameter. Pre-registration is REQUIRED when the value is true. If omitted,
   *    the default value is false.
   */
  it('should define type of "require_request_uri_registration"', () => {
    properties.require_request_uri_registration.type.should.equal('boolean')
  })

  it('should define default of "require_request_uri_registration"', () => {
    properties.require_request_uri_registration.default.should.equal(false)
  })

  /**
   *  op_policy_uri
   *    OPTIONAL. URL that the OpenID Provider provides to the person registering the
   *    Client to read about the OP's requirements on how the Relying Party can use
   *    the data provided by the OP. The registration process SHOULD display this URL
   *    to the person registering the Client if it is given.
   */
  it('should define type of "op_policy_uri"', () => {
    properties.op_policy_uri.type.should.equal('string')
  })

  it('should define format of "op_policy_uri"', () => {
    properties.op_policy_uri.format.should.equal('url')
  })

  /**
   *  op_tos_uri
   *    OPTIONAL. URL that the OpenID Provider provides to the person registering the
   *    Client to read about OpenID Provider's terms of service. The registration
   *    process SHOULD display this URL to the person registering the Client if it is
   *    given.
   */
  it('should define type of "op_tos_uri"', () => {
    properties.op_tos_uri.type.should.equal('string')
  })

  it('should define format of "op_tos_uri"', () => {
    properties.op_tos_uri.format.should.equal('url')
  })

  /**
   *  Additional OpenID Provider Metadata parameters MAY also be used. Some are
   *  defined by other specifications, such as OpenID Connect Session Management 1.0
   *  [OpenID.Session].
   */

  // TODO SESSION SPEC ENDPOINTS (check_session_iframe, end_session_endpoint)

})
