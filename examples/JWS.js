require('../src/formats')
const crypto = require('webcrypto')
const JWT = require('../src/jose/JWT')

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
  .then(key => {
    let token = new JWT({
      header: { alg: 'HS256' },
      payload: { iss: 'https://forge.anvil.io' },
      key
    })

    return token.encode()
  })
  .then(console.log).catch(console.log)
