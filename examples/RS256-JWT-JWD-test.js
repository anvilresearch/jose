const crypto = require('webcrypto')
const { JWT, JWD } = require('../src')

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
      JWT.encode(privateKey, { signatures: [{ protected: header }], payload }, { serialization: 'json' }),
      JWD.encode(privateKey, { signatures: [{ protected: header }], payload })
    ])
  })

  // verify the signature
  .then(tokens => {
    console.log('TOKENS', tokens)
    let [compact, flattened, json, doc] = tokens

    return Promise.all([
      JWT.verify(publicKey, compact),
      JWT.verify(publicKey, flattened),
      JWT.verify([publicKey], json),
      JWD.verify([publicKey], doc)
    ])
  })

  // look at the output
  .then(tokens => {
    // Print out tokens
    tokens.map(token => console.log(JSON.stringify(token, null, 2)))

    // Test if signatures match
    console.log(tokens.reduce((prev, curr) => {
      if (prev === false) {
        return prev
      }

      let { signature, signatures } = curr

      if (prev === true) {
        if (signatures) {
          return signatures[0].signature
        } else {
          return signature
        }
      } else {
        if (prev === signature || (signatures && signatures[0].signature === prev)) {
          return prev
        } else {
          return false
        }
      }
    }, true) ? 'PASS: Signatures Match' : 'FAIL: Mismatched')
  })

  // look at the out
  .catch(console.log)
