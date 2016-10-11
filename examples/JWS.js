require('../src/formats')
const crypto = require('webcrypto')
const JWT = require('../src/jose/JWT')

let key, jwt

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
  .then(result => {
    key = result

    let token = new JWT({
      header: { alg: 'HS256' },
      payload: { iss: 'https://forge.anvil.io' },
      key
    })

    return token.encode()
  })
  .then(token => {
    console.log('Signed JWS Compact Serialization', token)

    jwt = JWT.decode(token)
    jwt.key = key
    console.log('Decoded JWT', jwt)
    return jwt.verify()
  })
  .then(verified => {
    console.log('VERIFIED', verified)
  })
  .catch(console.log)
