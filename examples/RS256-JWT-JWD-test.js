const crypto = require('webcrypto')
const { JWT, JWD } = require('../src')

let privateKey, publicKey

let payload = { iss: 'hello world!' }
let header = { typ: 'JWS', alg: 'RS256' }

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
      JWT.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'json' }),
      JWD.encode({ protected: header, cryptoKey: privateKey }, { payload }, { serialization: 'flattened-document' }),
      JWD.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'document' }),
    ])
  })

  // verify the signature
  .then(tokens => {
    let [compact, flattened, json, flatdoc, doc] = tokens
    console.log(tokens)

    return Promise.all([
      JWT.verify({ cryptoKey: publicKey, serialized: compact, result: 'instance' }),
      JWT.verify({ cryptoKey: publicKey, serialized: flattened, result: 'instance' }),
      JWT.verify({ cryptoKey: publicKey, serialized: json, result: 'instance' }),
      JWD.verify({ cryptoKey: publicKey, serialized: flatdoc, result: 'instance' }),
      JWD.verify({ cryptoKey: publicKey, serialized: doc, result: 'instance' }),
    ])
  })

  // look at the output
  .then(tokens => {
    // Test if signatures match
    let result = true
    tokens.forEach(token => {
      if (result && tokens[0].signatures[0].signature === token.signatures[0].signature) {
        result = true
      }
      result = false
    })

    console.log(result
      ? 'PASS: Signatures Match'
      : 'FAIL: Mismatched')
  })

  // look at the out
  .catch(console.log)
