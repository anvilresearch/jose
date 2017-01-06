'use strict';

var TextEncoder = global.TextEncoder ? global.TextEncoder // browser
: require('text-encoding').TextEncoder; // node shim
module.exports = TextEncoder;