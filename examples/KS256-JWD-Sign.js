const crypto = require('@trust/webcrypto')
const { JWD } = require('../src')
const base64url = require('base64url')

let privateKey, publicKey

let payload = { iss: 'hello world!', exp: 123456789, iat: 123456789 }
let header = { typ: 'JWS', alg: 'KS256' }

crypto.subtle

  // use webcrypto to generate a keypair
  .generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'K-256',
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

    let serialized = JSON.stringify({ payload: base64url(JSON.stringify(payload)), protected: base64url(JSON.stringify(header)), signature: 'signaturesignaturesignature'})

    return JWD.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'document' })
  })

  // verify the signature
  .then(token => {
    return JWD.verify({ cryptoKey: publicKey, serialized: token, result: 'instance' })
  })

  // look at the output
  .then(token => {
    console.error(`TOKEN FINAL VERIFICATION RESULT:`, token.verified)
    console.error(`TOKEN`)
    console.log(JSON.stringify(token, null, 2))
  })

  // look at the out
  .catch(console.log)
