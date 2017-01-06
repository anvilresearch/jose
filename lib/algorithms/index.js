'use strict';

/**
 * Local dependencies
 */
var HMAC = require('./HMAC');
var RSASSA_PKCS1_v1_5 = require('./RSASSA-PKCS1-v1_5');
var SupportedAlgorithms = require('./SupportedAlgorithms');

/**
 * Register Supported Algorithms
 */
var supportedAlgorithms = new SupportedAlgorithms();

/**
 * Sign
 */
supportedAlgorithms.define('HS256', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-256'
  }
}));

supportedAlgorithms.define('HS384', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-384'
  }
}));

supportedAlgorithms.define('HS512', 'sign', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-512'
  }
}));

supportedAlgorithms.define('RS256', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}));

supportedAlgorithms.define('RS384', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}));

supportedAlgorithms.define('RS512', 'sign', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}));
//supportedAlgorithms.define('ES256', 'sign', {})
//supportedAlgorithms.define('ES384', 'sign', {})
//supportedAlgorithms.define('ES512', 'sign', {})
//supportedAlgorithms.define('PS256', 'sign', {})
//supportedAlgorithms.define('PS384', 'sign', {})
//supportedAlgorithms.define('PS512', 'sign', {})
supportedAlgorithms.define('none', 'sign', {});

/**
 * Verify
 */
supportedAlgorithms.define('HS256', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-256'
  }
}));

supportedAlgorithms.define('HS384', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-384'
  }
}));

supportedAlgorithms.define('HS512', 'verify', new HMAC({
  name: 'HMAC',
  hash: {
    name: 'SHA-512'
  }
}));

supportedAlgorithms.define('RS256', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}));

supportedAlgorithms.define('RS384', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}));

supportedAlgorithms.define('RS512', 'verify', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}));
//supportedAlgorithms.define('ES256', 'verify', {})
//supportedAlgorithms.define('ES384', 'verify', {})
//supportedAlgorithms.define('ES512', 'verify', {})
//supportedAlgorithms.define('PS256', 'verify', {})
//supportedAlgorithms.define('PS384', 'verify', {})
//supportedAlgorithms.define('PS512', 'verify', {})
supportedAlgorithms.define('none', 'verify', {});

supportedAlgorithms.define('RS256', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256'
  }
}));

supportedAlgorithms.define('RS384', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-384'
  }
}));

supportedAlgorithms.define('RS512', 'importKey', new RSASSA_PKCS1_v1_5({
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-512'
  }
}));

/**
 * Export
 */
module.exports = supportedAlgorithms;