'use strict';

/**
 * Package dependencies
 */
var _require = require('json-document'),
    Formats = _require.Formats;

/**
 * Format extensions
 */


Formats.register('StringOrURI', new RegExp());
Formats.register('NumericDate', new RegExp());
Formats.register('URI', new RegExp());
Formats.register('url', new RegExp());
Formats.register('base64', new RegExp());
Formats.register('base64url', new RegExp());
Formats.register('MediaType', new RegExp());