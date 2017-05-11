const crypto = require('@trust/webcrypto')
const JWA = require('../src/jose/JWA')

let key

crypto.subtle

  // use webcrypto to generate a keypair
  .generateKey(
    {
      name: 'HMAC',
      hash: {
        name: 'SHA-256'
      }
    },
    true,
    ['sign', 'verify']
  )

  // use key with JWA to create a signature
  .then(result => {
    key = result

    return JWA.sign('HS256', key, 'header.payload')
  })

  // verify the signature
  .then(signature => {
    return Promise.all([
      Promise.resolve(signature),
      JWA.verify('HS256', key, signature, 'header.payload'),
      JWA.verify('HS256', key, signature, 'wrong'),
    ])
  })

  // look at the output
  .then(console.log)

  // look at the out
  .catch(console.log)
