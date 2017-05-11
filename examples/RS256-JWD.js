const crypto = require('@trust/webcrypto')
const { JWD } = require('../src')

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

    return JWD.encode({ signatures: [{ protected: header, cryptoKey: privateKey }], payload }, { serialization: 'document' })
  })

  // verify the signature
  .then(doc => {
    console.log('DOCUMENT', doc)
    return JWD.verify({ cryptoKey: publicKey, serialized: doc, result: 'instance' })
  })

  // look at the output
  .then(doc => console.log(JSON.stringify(doc, null, 2)))

  // look at the out
  .catch(console.log)
