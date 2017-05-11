const crypto = require('@trust/webcrypto')
const { JWT } = require('../src')
const base64url = require('base64url')

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

    let serialized = JSON.stringify({ payload: base64url(JSON.stringify(payload)), protected: base64url(JSON.stringify(header)), signature: 'signaturesignaturesignature'})

    return Promise.all([
      JWT.sign({ header, payload }, { serialization: 'compact', cryptoKey: privateKey }),
      JWT.sign({ protected: header, payload }, { serialization: 'flattened', cryptoKey: privateKey }),
      JWT.sign({ signatures: [{ protected: header, cryptoKey: privateKey }, { protected: header, cryptoKey: privateKey }], payload }, { serialization: 'json' }),
      JWT.sign({ serialized }, { signatures: [{ protected: header, cryptoKey: privateKey }] }, { serialization: 'json' }),
    ])
  })

  // verify the signature
  .then(tokens => {
    let promises = tokens.map(token => {
      return JWT.verify({ cryptoKey: publicKey, serialized: token, result: 'instance' })
    })

    return Promise.all(promises)
  })

  // look at the output
  .then(tokens => {
    tokens.map((token, index) => {
      console.log(`TOKEN ${index+1} FINAL VERIFICATION RESULT:`, token.verified, `\nTOKEN ${index+1}`, JSON.stringify(token, null, 2))
      token.signatures.map((signature, sigindex) => {
        console.log(`TOKEN ${index+1} SIGNATURE ${sigindex+1} VERIFICATION RESULT:`, `${signature.verified !== undefined ? signature.verified : 'ignored'}`)
      })
      console.log()
    })
  })

  // look at the out
  .catch(console.log)
