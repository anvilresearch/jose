'use strict'

/**
 * Dependencies
 */
//const JSONSchema = require('nv-schema')

/**
 * OpenID Provider Schema
 */
//const schema = new JSONSchema({
const ProviderSchema = {
  type: 'object',
  properties: {

    issuer: {
      type: 'string',
      format: 'uri',
      required: true
    },

    authorization_endpoint: {
      type: 'string',
      format: 'uri',
      required: true
    },

    token_endpoint: {
      type: 'string',
      format: 'uri',
      required: true
    },

    userinfo_endpoint: {
      type: 'string',
      format: 'uri',
      required: true
    },

    jwks_uri: {
      type: 'string',
      format: 'uri',
      required: true
    },

    registration_endpoint: {
      type: 'string',
      format: 'uri',
      required: true
    },

    scopes_supported: {
      type: 'array'
    },

    response_types_supported: {
      type: 'array',
      enum: [
        'code',
        'code token',
        'code id_token',
        'id_token',
        'id_token token',
        'code id_token token',
        'none'
      ],
      default: [
        'code',
        'code token',
        'code id_token',
        'id_token',
        'id_token token',
        'code id_token token',
        'none'
      ],
      required: true
    },

    response_modes_supported: {
      type: 'array',
      enum: [
        'query',
        'fragment'
      ],
      default: [
        'query',
        'fragment'
      ]
    },

    grant_types_supported: {
      type: 'array',
      default: [
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials'
      ],
      enum: [
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials'
      ]
    },

    acr_values_supported: {
      type: 'array'
    },

    subject_types_supported: {
      type: 'array',
      default: [
        'public'
      ],
      enum: [
        'pairwise',
        'public'
      ],
      required: true
    },

    id_token_signing_alg_values_supported: {
      type: 'array',
      default: [
        'RS256',
        'none'
      ],
      enum: [
        'RS256',
        'none'
      ],
      required: true
    },

    id_token_encryption_alg_values_supported: {
      type: 'array',
      enum: []
    },

    id_token_encryption_enc_values_supported: {
      type: 'array',
      enum: []
    },

    userinfo_signing_alg_values_supported: {
      type: 'array',
      enum: []
    },

    userinfo_encryption_alg_values_supported: {
      type: 'array',
      enum: []
    },

    userinfo_encryption_enc_values_supported: {
      type: 'array',
      enum: []
    },

    request_object_signing_alg_values_supported: {
      type: 'array',
      enum: [
        'RS256',
        'none'
      ]
    },

    request_object_encryption_alg_values_supported: {
      type: 'array',
      enum: []
    },

    request_object_encryption_enc_values_supported: {
      type: 'array',
      enum: []
    },

    token_endpoint_auth_methods_supported: {
      type: 'array',
      default: [
        'client_secret_basic'
      ],
      enum: [
        'client_secret_basic',
        'client_secret_post',
        'client_secret_jwt',
        'private_key_jwt'
      ]
    },

    token_endpoint_auth_signing_alg_values_supported: {
      type: 'array',
      default: [
        'RS256'
      ],
      enum: [
        'RS256'
      ],
    },

    display_values_supported: {
      type: 'array',
      default: [],
      enum: []
    },

    claim_types_supported: {
      type: 'array',
      default: [
        'normal'
      ],
      enum: [
        'normal',
        'aggregated',
        'distributed'
      ],
    },

    claims_supported: {
      type: 'array',
      default: '',
      enum: []
    },

    service_documentation: {
      type: 'string',
      format: 'uri'
    },

    claims_locales_supported: {
      type: 'array',
      //format: new RegExp(TODO)
    },

    ui_locales_supported: {
      type: 'array',
      //format: new RegExp(TODO)
    },

    claims_parameter_supported: {
      type: 'boolean',
      default: false
    },

    request_parameter_supported: {
      type: 'boolean',
      default: false
    },

    request_uri_parameter_supported: {
      type: 'boolean',
      default: true
    },

    require_request_uri_registration: {
      type: 'boolean',
      default: false
    },

    op_policy_uri: {
      type: 'string',
      format: 'uri'
    },

    op_tos_uri: {
      type: 'string',
      format: 'uri'
    },

    check_session_iframe: {
      type: 'string',
      format: 'uri',
      required: true
    },

    end_session_endpoint: {
      type: 'string',
      format: 'uri',
      required: true
    },

    //: {
    //  type: '',
    //  format: '',
    //  default: '',
    //  enum: [],
    //  required: true
    //},
  }
}
//})

/**
 * Export
 */
module.exports = ProviderSchema
