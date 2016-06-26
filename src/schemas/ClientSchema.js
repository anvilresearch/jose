'use strict'

/**
 * Dependencies
 */
//const JSONSchema = require('nv-schema')

/**
 * OpenID Client Metadata (Relying Party) Schema
 */
//const schema = new JSONSchema({
const ClientSchema = {
  type: 'object',
  properties: {

    redirect_uris: {
      type: 'array',
      required: true,
      format: 'uri'
    },

    response_types: {
      type: 'array',
      default: ['code'],
      enum: [
        'code',
        'code token',
        'code id_token',
        'id_token',
        'id_token token',
        'code id_token token',
        'none'
      ]
    },

    /**
     * TODO
     *
     * The following table lists the correspondence between response_type values
     * that the Client will use and grant_type values that MUST be included in
     * the registered grant_types list:
     *
     * code: authorization_code
     * id_token: implicit
     * token id_token: implicit
     * code id_token: authorization_code, implicit
     * code token: authorization_code, implicit
     * code token id_token: authorization_code, implicit
     */
    grant_types: {
      type: 'array',
      default: ['authorization_code'],
      enum: [
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials'
      ]
    },

    /**
     * application_typepost_logout_redirect_uris
     * OPTIONAL. Kind of the application. The default, if omitted, is web. The
     * defined values are native or web. Web Clients using the OAuth Implicit
     * Grant Type MUST only register URLs using the https scheme as
     * redirect_uris; they MUST NOT use localhost as the hostname. Native
     * Clients MUST only register redirect_uris using custom URI schemes or URLs
     * using the http: scheme with localhost as the hostname. Authorization
     * Servers MAY place additional constraints on Native Clients. Authorization
     * Servers MAY reject Redirection URI values using the http scheme, other
     * than the localhost case for Native Clients. The Authorization Server MUST
     * verify that all the registered redirect_uris conform to these
     * constraints. This prevents sharing a Client ID across different types of
     * Clients.
     */
    application_type: {
      type: 'string',
      default: 'web',
      enum: [
        'native',
        'web'
      ]
    },

    contacts: {
      type: 'array',
      format: 'email'
    },

    /**
     * TODO
     *
     * Internationalization. See JSON Schema Validation (Section 3.3)
     */
    client_name: {
      type: 'string'
    },

    logo_uri: {
      type: 'string',
      format: 'uri'
    },

    client_uri: {
      type: 'string',
      format: 'uri'
    },

    policy_uri: {
      type: 'string',
      format: 'uri'
    },

    tos_uri: {
      type: 'string',
      format: 'uri'
    },

    jwks_uri: {
      type: 'string',
      format: 'uri'
    },

    /**
     * TODO
     *
     * Reference JWK Set Schema
     */
    jwks: {
      type: 'object'
    },

    sector_identifier_uri: {
      type: 'string',
      format: 'uri'
    },

    subject_type: {
      type: 'string',
      enum: [
        'pairwise',
        'public'
      ]
    },

    id_token_signed_response_alg: {
      type: 'string'
    },

    id_token_encrypted_response_alg: {
      type: 'string'
    },

    id_token_encrypted_response_enc: {
      type: 'string'
    },

    userinfo_signed_response_alg: {
      type: 'string'
    },

    userinfo_encrypted_response_alg: {
      type: 'string'
    },

    userinfo_encrypted_response_enc: {
      type: 'string'
    },

    request_object_signing_alg: {
      type: 'string'
    },

    request_object_encryption_alg: {
      type: 'string'
    },

    request_object_encryption_enc: {
      type: 'string'
    },

    token_endpoint_auth_method: {
      type: 'string',
      enum: [
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt',
        'none'
      ],
      default: 'client_secret_basic'
    },

    token_endpoint_auth_signing_alg: {
      type: 'string'
    },

    default_max_age: {
      type: 'number'
    },

    require_auth_time: {
      type: 'boolean'
    },

    default_acr_values: {
      type: 'array'
    },

    initiate_login_uri: {
      type: 'string',
      format: 'uri'
    },

    request_uris: {
      type: 'array',
      format: 'uri'
    },

    post_logout_redirect_uris: {
      type: 'array',
      format: 'uri'
    }
  }
}
//})

/**
 * Export
 */
module.exports = ClientSchema
