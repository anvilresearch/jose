const crypto = require('webcrypto')
const { JWT } = require('../src')

let privateKey, publicKey

let payload = { iss: 'hello world!' }
let header = { alg: 'RS256', typ: 'JWS' }

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

    return Promise.all([
      JWT.encode({ header, payload }, { serialization: 'compact', cryptoKey: privateKey }),
      JWT.encode({ protected: header, payload }, { serialization: 'flattened', cryptoKey: privateKey }),
      JWT.encode({ signatures: [{ protected: header, cryptoKey: privateKey }, { protected: header, cryptoKey: privateKey }], payload }, { serialization: 'json' }),
    ])
  })

  // verify the signature
  .then(tokens => {
    console.log('TOKENS', tokens)
    let promises = tokens.map(token => {
      return JWT.verify({ cryptoKey: publicKey, jwt: token, result: 'instance' })
    })

    return Promise.all(promises)
  })

  // look at the output
  .then(tokens => tokens.map(token => console.log(JSON.stringify(token, null, 2))))
  // .then(console.log)

  // look at the out
  .catch(console.log)
