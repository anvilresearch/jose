require('../src/formats')
const crypto = require('webcrypto')
const JWS = require('../src/jose/JWS')

crypto.subtle
  .generateKey({
    name: 'HMAC',
      hash: {
        name: 'SHA-256'
      }
    },
    true,
    ['sign', 'verify']
  )
  .then(key => JWS.encode({ alg: 'HS256' }, { iss: 'https://anvil.io' }, key))
  .then(console.log).catch(console.log)
