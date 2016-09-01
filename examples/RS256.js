const crypto = require('webcrypto')
const JWA = require('../src/jose/JWA')

let privateKey, publicKey

crypto.subtle

  // use webcrypto to generate a keypair
  .generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: {
        name: 'SHA-256'
      }
    },
    true,
    ['sign', 'verify']
  )

  // use key with JWA to create a signature
  .then(keypair => {
    privateKey = keypair.privateKey
    publicKey = keypair.publicKey

    return JWA.sign('RS256', privateKey, 'header.payload')
  })

  // verify the signature
  .then(signature => {
    return Promise.all([
      Promise.resolve(signature),
      JWA.verify('RS256', publicKey, signature, 'header.payload'),
      JWA.verify('RS256', publicKey, signature, 'wrong'),
    ])
  })

  // look at the output
  .then(console.log)

  // look at the out
  .catch(console.log)
