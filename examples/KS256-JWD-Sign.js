const crypto = require('@trust/webcrypto')
const { JWD } = require('../src')
const base64url = require('base64url')
const keyto = require('@trust/keyto')

const privateHex = '57eba9c003d930e8233f502d8f0cc552e7ee75942b273a41c26d3bbb97b924e2'
const key = keyto.from(privateHex, 'blk')
const privateJwk = key.toJwk('private')
const publicJwk = key.toJwk('public')

let privateKey, publicKey

let payload = { iss: 'https://example.com', exp: 123456789, iat: 123456789 }
let header = { typ: 'JWS', alg: 'KS256' }


Promise.all([
  crypto.subtle.importKey('jwk', privateJwk, { name: 'ECDSA', namedCurve: 'K-256', hash: { name: 'SHA-256' } }, true, ['sign']),
  crypto.subtle.importKey('jwk', publicJwk, { name: 'ECDSA', namedCurve: 'K-256', hash: { name: 'SHA-256' } }, true, ['verify']),
])

  // use key with JWA to create a signature
  .then(keypair => {
    let [prv, pub] = keypair
    privateKey = prv
    publicKey = pub

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
