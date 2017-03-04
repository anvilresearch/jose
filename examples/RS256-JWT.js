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
      JWT.encode(privateKey, { header, payload }, { serialization: 'compact' }),
      JWT.encode(privateKey, { protected: header, payload }, { serialization: 'flattened' }),
      JWT.encode(privateKey, { signatures: [{ protected: header }], payload }, { serialization: 'json' })
    ])
  })

  // verify the signature
  .then(tokens => {
    let [compact, flattened, json] = tokens

    return Promise.all([
      JWT.verify(publicKey, compact),
      JWT.verify(publicKey, flattened),
      JWT.verify([publicKey], json)
    ])
  })

  // look at the output
  .then(tokens => tokens.map(token => console.log(JSON.stringify(token, null, 2))))
  // .then(console.log)

  // look at the out
  .catch(console.log)
