/**
 * Initialize Formats
 */
require('../formats')

/**
 * Module Index
 */
module.exports = {
  JOSEHeaderSchema: require('./JOSEHeaderSchema'),
  JWECompactSerializationSchema: require('./JWECompactSerializationSchema'),
  JWEFlattenedSerializationSchema: require('./JWEFlattenedSerializationSchema'),
  JWEJSONSerializationSchema: require('./JWEJSONSerializationSchema'),
  JWESchema: require('./JWESchema'),
  JWSCompactSerializationSchema: require('./JWSCompactSerializationSchema'),
  JWSFlattenedSerializationSchema: require('./JWSFlattenedSerializationSchema'),
  JWSJSONSerializationSchema: require('./JWSJSONSerializationSchema'),
  JWSSchema: require('./JWSSchema'),
  JWTClaimsSetSchema: require('./JWTClaimsSetSchema'),
  JWTSchema: require('./JWTSchema'),
}
