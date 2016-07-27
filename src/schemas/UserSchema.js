'use strict'

/**
 * Dependencies
 */
const {JSONSchema} = require('json-document')

/**
 * OpenID Connect User Schema
 *
 * TODO
 * - make it extensible via provider configuration/host implementation
 * - support pairwise identifier algorithm
 * - support language tags
 * - implement JSON Schema such that it doesn't completely suck
 */
const schema = new JSONSchema({
  type: 'object',

  // simple property names
  // which props belong in pattern props and which here?
  properties: {
    sub: { type: 'string' }
  },

  // NOTES:
  // Use patternProperties to support Section 5.2 Claims Languages and Scripts
  // and 5.5.2 Languages and Scripts for Individual Claims.
  //
  // See:
  //    - http://openid.net/specs/openid-connect-core-1_0.html#ClaimsLanguagesAndScripts
  //    - http://openid.net/specs/openid-connect-core-1_0.html#IndividualClaimsLanguages
  //    - https://tools.ietf.org/html/rfc5646
  //
  // Questions:
  //    - How to make language tags case-insensitive if claim names are case sensitive?
  //    - Should boolean/number values be properties rather than patternProperties?
  //    - Can we provide a simpler way of defining pattern properties via JSONSchema
  //      to make it easy on extenders of the schema?
  //
  patternProperties: {

    '^name': {
      type: 'string'
    },

    '^given_name(#-)?': {
      type: 'string'
    },

    '^middle_name': {
      type: 'string'
    },

    '^family_name': {
      type: 'string'
    },

    '^given_name': {
      type: 'string'
    },

    '^nickname': {
      type: 'string'
    },

    '^preferred_username': {
      type: 'string'
    },

    '^profile': {
      type: 'string',
      format: 'url'
    },

    '^picture': {
      type: 'string',
      format: 'url'
    },

    '^website': {
      type: 'string',
      format: 'url'
    },

    '^email': {
      type: 'string',
      format: 'email'
    },

    '^email_verified': {
      type: 'boolean'
    },

    '^gender': {
      type: 'string'
    },

    '^birthdate': {
      type: 'string',
      // MOVE THIS REGEXP TO A CONSTANT OR OBJ SOMEWHERE AND TEST THE FUCK OUT OF IT
      format: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
    },

    // TODO
    // valid values come from tz database
    // - http://www.twinsun.com/tz/tz-link.htm
    //
    // See also
    // - http://momentjs.com/timezone/docs/
    // - https://www.npmjs.com/package/timezone
    // - https://github.com/darkskyapp/tz-lookup COOL!!
    '^zoneinfo': {
      type: 'string'
    },

    //
    '^locale': {
      type: 'string',
      //format: TODO: regexp for Language Tag
    },

    '^phone_number': {
      type: 'string',
      //format: TODO: E.164 + RFC3966
    },

    '^phone_number_verified': {
      type: 'boolean'
    },

    '^address': {
      type: 'object',
      properties: {
        formatted: {
          type: 'string'
        },
        street_address: {
          type: 'string'
        },
        locality: {
          type: 'string'
        },
        region: {
          type: 'string'
        },
        postal_code: {
          type: 'string'
        },
        country: {
          type: 'string'
        }
      }
    },

    '^updated_at': {
      type: 'number'
    }
  }
})

/**
 * Export
 */
module.exports = schema
