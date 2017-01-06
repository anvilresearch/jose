'use strict';

/**
 * Initialize Formats
 */
require('../formats');

/**
 * Module Index
 */
module.exports = {
  JOSEHeaderSchema: require('./JOSEHeaderSchema'),
  JWECompactSerializationSchema: require('./JWECompactSerializationSchema'),
  JWEFlattenedSerializationSchema: require('./JWEFlattenedSerializationSchema'),
  JWEJSONSerializationSchema: require('./JWEJSONSerializationSchema'),
  JWSCompactSerializationSchema: require('./JWSCompactSerializationSchema'),
  JWSFlattenedSerializationSchema: require('./JWSFlattenedSerializationSchema'),
  JWSJSONSerializationSchema: require('./JWSJSONSerializationSchema'),
  JWTClaimsSetSchema: require('./JWTClaimsSetSchema'),
  JWTSchema: require('./JWTSchema')
};