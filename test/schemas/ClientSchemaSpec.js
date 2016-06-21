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
const ClientSchema = require(path.join(cwd, 'src', 'schemas', 'ClientSchema'))

/**
 * Tests
 */
describe('OpenID Connect Client Schema', () => {
  let {properties} = ClientSchema

  it('should be an instance of JSONSchema')

  /**
   * Clients have metadata associated with their unique Client Identifier at the
   * Authorization Server. These can range from human-facing display strings,
   * such as a Client name, to items that impact the security of the protocol,
   * such as the list of valid redirect URIs.
   * 
   * The Client Metadata values are used in two ways:
   * as input values to registration requests, and
   * as output values in registration responses and read responses.
   * 
   * These Client Metadata values are used by OpenID Connect:
   */
  
  /** 
   * redirect_uris
   *   REQUIRED. Array of Redirection URI values used by the Client. One of
   *   these registered Redirection URI values MUST exactly match the
   *   redirect_uri parameter value used in each Authorization Request, with the
   *   matching performed as described in Section 6.2.1 of [RFC3986]
   *   (Simple String Comparison).
   */
  it('should require "redirect_uris"', () => {
    properties.redirect_uris.required.should.equal(true)
  })

  it('should define type of "redirect_uris"', () => {
    properties.redirect_uris.type.should.equal('array')
  })

  it('should define format of "redirect_uris"', () => {
    properties.redirect_uris.format.should.equal('uri')
  })
  
  /**
   *   
   * response_types
   *   OPTIONAL. JSON array containing a list of the OAuth 2.0 response_type
   *   values that the Client is declaring that it will restrict itself to
   *   using. If omitted, the default is that the Client will use only the code
   *   Response Type.
   */
  it('should define type of "response_types"', () => {
    properties.response_types.type.should.equal('array')
  })
  
  it('should define enum of "response_types"', () => {
    properties.response_types.enum.should.eql([
      'code',
      'code token',
      'code id_token',
      'id_token',
      'id_token token',
      'code id_token token',
      'none'
    ])
  })

  it('should define default of "response_types"', () => {
    properties.response_types.default.should.eql([
      'code'
    ])
  })
  
  /**  
   * grant_types
   *   OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Types that
   *   the Client is declaring that it will restrict itself to using. The Grant
   *   Type values used by OpenID Connect are:
   *     authorization_code: The Authorization Code Grant Type described in
   *       OAuth 2.0 Section 4.1.
   *     implicit: The Implicit Grant Type described in OAuth 2.0 Section 4.2.
   *     refresh_token: The Refresh Token Grant Type described in OAuth 2.0
   *       Section 6.default
   */
  it('should define type of "grant_types"', () => {
    properties.grant_types.type.should.equal('array')
  })
  
  it('should define enum of "grant_types"', () => {
    properties.grant_types.enum.should.eql([
      'authorization_code',
      'implicit',
      'refresh_token',
      'client_credentials'
    ])
  })

  it('should define default of "grant_types"', () => {
    properties.grant_types.default.should.eql([
      'authorization_code'
    ])
  })
  
  /**
   *   The following table lists the correspondence between response_type values
   *   that the Client will use and grant_type values that MUST be included in
   *   the registered grant_types list:
   *     code: authorization_code
   *     id_token: implicit
   *     token id_token: implicit
   *     code id_token: authorization_code, implicit
   *     code token: authorization_code, implicit
   *     code token id_token: authorization_code, implicit
   * 
   *   If omitted, the default is that the Client will use only the
   *   authorization_code Grant Type.
   */
  
  /**
   * application_type
   *   OPTIONAL. Kind of the application. The default, if omitted, is web. The
   *   defined values are native or web. Web Clients using the OAuth Implicit
   *   Grant Type MUST only register URLs using the https scheme as
   *   redirect_uris; they MUST NOT use localhost as the hostname. Native
   *   Clients MUST only register redirect_uris using custom URI schemes or URLs
   *   using the http: scheme with localhost as the hostname. Authorization
   *   Servers MAY place additional constraints on Native Clients. Authorization
   *   Servers MAY reject Redirection URI values using the http scheme, other
   *   than the localhost case for Native Clients. The Authorization Server MUST
   *   verify that all the registered redirect_uris conform to these
   *   constraints. This prevents sharing a Client ID across different types of
   *   Clients.
   */
  it('should define type of "application_type"', () => {
    properties.application_type.type.should.equal('string')
  })
  
  it('should define enum of "application_type"', () => {
    properties.application_type.enum.should.eql([
      'native',
      'web'
    ])
  })

  it('should define default of "application_type"', () => {
    properties.application_type.default.should.eql('web')
  })
  
  /**
   * contacts
   *   OPTIONAL. Array of e-mail addresses of people responsible for this
   *   Client. This might be used by some providers to enable a Web user
   *   interface to modify the Client information.
   */
  it('should define type of "contacts"', () => {
    properties.contacts.type.should.equal('array')
  })

  it('should define format of "contacts"', () => {
    properties.contacts.format.should.equal('email')
  })
  
  /**
   * client_name
   *   OPTIONAL. Name of the Client to be presented to the End-User. If desired,
   *   representation of this Claim in different languages and scripts is
   *   represented as described in Section 2.1.
   */
  it('should define type of "client_name"', () => {
    properties.client_name.type.should.equal('string')
  })
  
  /**
   * logo_uri
   *   OPTIONAL. URL that references a logo for the Client application. If
   *   present, the server SHOULD display this image to the End-User during
   *   approval. The value of this field MUST point to a valid image file. If
   *   desired, representation of this Claim in different languages and scripts
   *   is represented as described in Section 2.1.
   */
  it('should define type of "logo_uri"', () => {
    properties.logo_uri.type.should.equal('string')
  })

  it('should define format of "logo_uri"', () => {
    properties.logo_uri.format.should.equal('uri')
  })
  
  /**
   * client_uri
   *   OPTIONAL. URL of the home page of the Client. The value of this field
   *   MUST point to a valid Web page. If present, the server SHOULD display
   *   this URL to the End-User in a followable fashion. If desired,
   *   representation of this Claim in different languages and scripts is
   *   represented as described in Section 2.1.
   */
  it('should define type of "client_uri"', () => {
    properties.client_uri.type.should.equal('string')
  })

  it('should define format of "client_uri"', () => {
    properties.client_uri.format.should.equal('uri')
  })
  
  /**
   * policy_uri
   *   OPTIONAL. URL that the Relying Party Client provides to the End-User to
   *   read about the how the profile data will be used. The value of this field
   *   MUST point to a valid web page. The OpenID Provider SHOULD display this
   *   URL to the End-User if it is given. If desired, representation of this
   *   Claim in different languages and scripts is represented as described in
   *   Section 2.1.
   */
  it('should define type of "policy_uri"', () => {
    properties.policy_uri.type.should.equal('string')
  })

  it('should define format of "policy_uri"', () => {
    properties.policy_uri.format.should.equal('uri')
  })
  
  /**
   * tos_uri
   *   OPTIONAL. URL that the Relying Party Client provides to the End-User to
   *   read about the Relying Party's terms of service. The value of this field
   *   MUST point to a valid web page. The OpenID Provider SHOULD display this
   *   URL to the End-User if it is given. If desired, representation of this
   *   Claim in different languages and scripts is represented as described in
   *   Section 2.1.
   */
  it('should define type of "tos_uri"', () => {
    properties.tos_uri.type.should.equal('string')
  })

  it('should define format of "tos_uri"', () => {
    properties.tos_uri.format.should.equal('uri')
  })
  
  /**
   * jwks_uri
   *   OPTIONAL. URL for the Client's JSON Web Key Set [JWK] document. If the
   *   Client signs requests to the Server, it contains the signing key(s) the
   *   Server uses to validate signatures from the Client. The JWK Set MAY also
   *   contain the Client's encryption keys(s), which are used by the Server to
   *   encrypt responses to the Client. When both signing and encryption keys
   *   are made available, a use (Key Use) parameter value is REQUIRED for all
   *   keys in the referenced JWK Set to indicate each key's intended usage.
   *   Although some algorithms allow the same key to be used for both
   *   signatures and encryption, doing so is NOT RECOMMENDED, as it is less
   *   secure. The JWK x5c parameter MAY be used to provide X.509
   *   representations of keys provided. When used, the bare key values MUST
   *   still be present and MUST match those in the certificate.
   */
  it('should define type of "jwks_uri"', () => {
    properties.jwks_uri.type.should.equal('string')
  })

  it('should define format of "jwks_uri"', () => {
    properties.jwks_uri.format.should.equal('uri')
  })
  
  /**
   * jwks
   *   OPTIONAL. Client's JSON Web Key Set [JWK] document, passed by value. The
   *   semantics of the jwks parameter are the same as the jwks_uri parameter,
   *   other than that the JWK Set is passed by value, rather than by reference.
   *   This parameter is intended only to be used by Clients that, for some
   *   reason, are unable to use the jwks_uri parameter, for instance, by native
   *   applications that might not have a location to host the contents of the
   *   JWK Set. If a Client can use jwks_uri, it MUST NOT use jwks. One
   *   significant downside of jwks is that it does not enable key rotation
   *   (which jwks_uri does, as described in Section 10 of OpenID Connect Core
   *   1.0 [OpenID.Core]). The jwks_uri and jwks parameters MUST NOT be used
   *   together.
   */
  it('should define type of "jwks"', () => {
    properties.jwks.type.should.equal('object')
  })
  
  /**
   * sector_identifier_uri
   *   OPTIONAL. URL using the https scheme to be used in calculating
   *   Pseudonymous Identifiers by the OP. The URL references a file with a
   *   single JSON array of redirect_uri values. Please see Section 5. Providers
   *   that use pairwise sub (subject) values SHOULD utilize the
   *   sector_identifier_uri value provided in the Subject Identifier
   *   calculation for pairwise identifiers.
   */
  it('should define type of "sector_identifier_uri"', () => {
    properties.sector_identifier_uri.type.should.equal('string')
  })

  it('should define format of "sector_identifier_uri"', () => {
    properties.sector_identifier_uri.format.should.equal('uri')
  })
  
  /**
   * subject_type
   *   OPTIONAL. subject_type requested for responses to this Client. The
   *   subject_types_supported Discovery parameter contains a list of the
   *   supported subject_type values for this server. Valid types include
   *   pairwise and public.
   */
  it('should define type of "subject_type"', () => {
    properties.subject_type.type.should.equal('string')
  })
  
  it('should define enum of "subject_type"', () => {
    properties.subject_type.enum.should.eql([
      'pairwise',
      'public'
    ])
  })
  
  /**
   * id_token_signed_response_alg
   *   OPTIONAL. JWS alg algorithm [JWA] REQUIRED for signing the ID Token
   *   issued to this Client. The value none MUST NOT be used as the ID Token
   *   alg value unless the Client uses only Response Types that return no ID
   *   Token from the Authorization Endpoint (such as when only using the
   *   Authorization Code Flow). The default, if omitted, is RS256. The public
   *   key for validating the signature is provided by retrieving the JWK Set
   *   referenced by the jwks_uri element from OpenID Connect Discovery 1.0
   *   [OpenID.Discovery].
   */
  it('should define type of "id_token_signed_response_alg"', () => {
    properties.id_token_signed_response_alg.type.should.equal('string')
  })

  /**
   * id_token_encrypted_response_alg
   *   OPTIONAL. JWE alg algorithm [JWA] REQUIRED for encrypting the ID Token
   *   issued to this Client. If this is requested, the response will be signed
   *   then encrypted, with the result being a Nested JWT, as defined in [JWT].
   *   The default, if omitted, is that no encryption is performed.
   */
  it('should define type of "id_token_encrypted_response_alg"', () => {
    properties.id_token_encrypted_response_alg.type.should.equal('string')
  })
  
  /**
   * id_token_encrypted_response_enc
   *   OPTIONAL. JWE enc algorithm [JWA] REQUIRED for encrypting the ID Token
   *   issued to this Client. If id_token_encrypted_response_alg is specified,
   *   the default for this value is A128CBC-HS256. When
   *   id_token_encrypted_response_enc is included,
   *   id_token_encrypted_response_alg MUST also be provided.
   */
  it('should define type of "id_token_encrypted_response_enc"', () => {
    properties.id_token_encrypted_response_enc.type.should.equal('string')
  })
  
  /**
   * userinfo_signed_response_alg
   *   OPTIONAL. JWS alg algorithm [JWA] REQUIRED for signing UserInfo
   *   Responses. If this is specified, the response will be JWT [JWT]
   *   serialized, and signed using JWS. The default, if omitted, is for the
   *   UserInfo Response to return the Claims as a UTF-8 encoded JSON object
   *   using the application/json content-type.
   */
  it('should define type of "userinfo_signed_response_alg"', () => {
    properties.userinfo_signed_response_alg.type.should.equal('string')
  })
  
  /**
   * userinfo_encrypted_response_alg
   *   OPTIONAL. JWE [JWE] alg algorithm [JWA] REQUIRED for encrypting UserInfo
   *   Responses. If both signing and encryption are requested, the response
   *   will be signed then encrypted, with the result being a Nested JWT, as
   *   defined in [JWT]. The default, if omitted, is that no encryption is
   *   performed.
   */
  it('should define type of "userinfo_encrypted_response_alg"', () => {
    properties.userinfo_encrypted_response_alg.type.should.equal('string')
  })
  
  /**
   * userinfo_encrypted_response_enc
   *   OPTIONAL. JWE enc algorithm [JWA] REQUIRED for encrypting UserInfo
   *   Responses. If userinfo_encrypted_response_alg is specified, the default
   *   for this value is A128CBC-HS256. When userinfo_encrypted_response_enc is
   *   included, userinfo_encrypted_response_alg MUST also be provided.
   */
  it('should define type of "userinfo_encrypted_response_enc"', () => {
    properties.userinfo_encrypted_response_enc.type.should.equal('string')
  })
  
  /**
   * request_object_signing_alg
   *   OPTIONAL. JWS [JWS] alg algorithm [JWA] that MUST be used for signing
   *   Request Objects sent to the OP. All Request Objects from this Client MUST
   *   be rejected, if not signed with this algorithm. Request Objects are
   *   described in Section 6.1 of OpenID Connect Core 1.0 [OpenID.Core]. This
   *   algorithm MUST be used both when the Request Object is passed by value
   *   (using the request parameter) and when it is passed by reference (using
   *   the request_uri parameter). Servers SHOULD support RS256. The value none
   *   MAY be used. The default, if omitted, is that any algorithm supported by
   *   the OP and the RP MAY be used.
   */
  it('should define type of "request_object_signing_alg"', () => {
    properties.request_object_signing_alg.type.should.equal('string')
  })
  
  /**
   * request_object_encryption_alg
   *   OPTIONAL. JWE [JWE] alg algorithm [JWA] the RP is declaring that it may
   *   use for encrypting Request Objects sent to the OP. This parameter SHOULD
   *   be included when symmetric encryption will be used, since this signals to
   *   the OP that a client_secret value needs to be returned from which the
   *   symmetric key will be derived, that might not otherwise be returned. The
   *   RP MAY still use other supported encryption algorithms or send
   *   unencrypted Request Objects, even when this parameter is present. If both
   *   signing and encryption are requested, the Request Object will be signed
   *   then encrypted, with the result being a Nested JWT, as defined in [JWT].
   *   The default, if omitted, is that the RP is not declaring whether it might
   *   encrypt any Request Objects.
   */
  it('should define type of "request_object_encryption_alg"', () => {
    properties.request_object_encryption_alg.type.should.equal('string')
  })
  
  /**
   * request_object_encryption_enc
   *   OPTIONAL. JWE enc algorithm [JWA] the RP is declaring that it may use for
   *   encrypting Request Objects sent to the OP. If
   *   request_object_encryption_alg is specified, the default for this value is
   *   A128CBC-HS256. When request_object_encryption_enc is included,
   *   request_object_encryption_alg MUST also be provided.
   */
  it('should define type of "request_object_encryption_enc"', () => {
    properties.request_object_encryption_enc.type.should.equal('string')
  })
  
  /**
   * token_endpoint_auth_method
   *   OPTIONAL. Requested Client Authentication method for the Token Endpoint.
   *   The options are client_secret_post, client_secret_basic,
   *   client_secret_jwt, private_key_jwt, and none, as described in Section 9
   *   of OpenID Connect Core 1.0 [OpenID.Core]. Other authentication methods
   *   MAY be defined by extensions. If omitted, the default is
   *   client_secret_basic -- the HTTP Basic Authentication Scheme specified in
   *   Section 2.3.1 of OAuth 2.0 [RFC6749].
   */
  it('should define type of "token_endpoint_auth_method"', () => {
    properties.token_endpoint_auth_method.type.should.equal('string')
  })
  
  it('should define enum of "token_endpoint_auth_method"', () => {
    properties.token_endpoint_auth_method.enum.should.eql([
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt',
        'none'
      ])
  })

  it('should define default of "token_endpoint_auth_method"', () => {
    properties.token_endpoint_auth_method.default.should
      .equal('client_secret_basic')
  })
  
  /**
   * token_endpoint_auth_signing_alg
   *   OPTIONAL. JWS [JWS] alg algorithm [JWA] that MUST be used for signing the
   *   JWT [JWT] used to authenticate the Client at the Token Endpoint for the
   *   private_key_jwt and client_secret_jwt authentication methods. All Token
   *   Requests using these authentication methods from this Client MUST be
   *   rejected, if the JWT is not signed with this algorithm. Servers SHOULD
   *   support RS256. The value none MUST NOT be used. The default, if omitted,
   *   is that any algorithm supported by the OP and the RP MAY be used.
   */
  it('should define type of "token_endpoint_auth_signing_alg"', () => {
    properties.token_endpoint_auth_signing_alg.type.should.equal('string')
  })
  
  /**
   * default_max_age
   *   OPTIONAL. Default Maximum Authentication Age. Specifies that the End-User
   *   MUST be actively authenticated if the End-User was authenticated longer
   *   ago than the specified number of seconds. The max_age request parameter
   *   overrides this default value. If omitted, no default Maximum
   *   Authentication Age is specified.
   */
  it('should define type of "default_max_age"', () => {
    properties.default_max_age.type.should.equal('number')
  })
  
  /**
   * require_auth_time
   *   OPTIONAL. Boolean value specifying whether the auth_time Claim in the ID
   *   Token is REQUIRED. It is REQUIRED when the value is true. (If this is
   *   false, the auth_time Claim can still be dynamically requested as an
   *   individual Claim for the ID Token using the claims request parameter
   *   described in Section 5.5.1 of OpenID Connect Core 1.0 [OpenID.Core].) If
   *   omitted, the default value is false.
   */
  it('should define type of "require_auth_time"', () => {
    properties.require_auth_time.type.should.equal('boolean')
  })
  
  /**
   * default_acr_values
   *   OPTIONAL. Default requested Authentication Context Class Reference
   *   values. Array of strings that specifies the default acr values that the
   *   OP is being requested to use for processing requests from this Client,
   *   with the values appearing in order of preference. The Authentication
   *   Context Class satisfied by the authentication performed is returned as
   *   the acr Claim Value in the issued ID Token. The acr Claim is requested as
   *   a Voluntary Claim by this parameter. The acr_values_supported discovery
   *   element contains a list of the supported acr values supported by this
   *   server. Values specified in the acr_values request parameter or an
   *   individual acr Claim request override these default values.
   */
  it('should define type of "default_acr_values"', () => {
    properties.default_acr_values.type.should.equal('array')
  })
  
  /**
   * initiate_login_uri
   *   OPTIONAL. URI using the https scheme that a third party can use to
   *   initiate a login by the RP, as specified in Section 4 of OpenID Connect
   *   Core 1.0 [OpenID.Core]. The URI MUST accept requests via both GET and
   *   POST. The Client MUST understand the login_hint and iss parameters and
   *   SHOULD support the target_link_uri parameter.
   */
  it('should define type of "initiate_login_uri"', () => {
    properties.initiate_login_uri.type.should.equal('string')
  })

  it('should define format of "initiate_login_uri"', () => {
    properties.initiate_login_uri.format.should.equal('uri')
  })
  
  /**
   * request_uris
   *   OPTIONAL. Array of request_uri values that are pre-registered by the RP
   *   for use at the OP. Servers MAY cache the contents of the files referenced
   *   by these URIs and not retrieve them at the time they are used in a
   *   request. OPs can require that request_uri values used be pre-registered
   *   with the require_request_uri_registration discovery parameter.
   */
  it('should define type of "request_uris"', () => {
    properties.request_uris.type.should.equal('array')
  })

  it('should define format of "request_uris"', () => {
    properties.request_uris.format.should.equal('uri')
  })
  
  /**
   * If the contents of the request file could ever change, these URI values
   * SHOULD include the base64url encoded SHA-256 hash value of the file
   * contents referenced by the URI as the value of the URI fragment. If the
   * fragment value used for a URI changes, that signals the server that its
   * cached value for that URI with the old fragment value is no longer valid.
   * 
   * Additional Client Metadata parameters MAY also be used. Some are defined by
   * other specifications, such as OpenID Connect Session Management 1.0
   * [OpenID.Session].
   */
})