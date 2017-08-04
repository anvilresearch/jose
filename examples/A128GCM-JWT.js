const crypto = require('@trust/webcrypto')
const { JWT } = require('../src')
const base64url = require('base64url')


let key
let plaintext = "The true sign of intelligence is not knowledge but imagination."
let protectedHeader = {alg: "dir", enc: "A256GCM"}

crypto.subtle

  // use webcrypto to generate a keypair
  .generateKey(
    {
      name: 'AES-GCM',
      length: 128
    },
    false,
    ['encrypt', 'decrypt']
  )

  // use key with JWA to encrypt
  .then(result => {
    key = result
    console.log(key)
    // this should give me back a JWE
    return JWT.encrypt({
      protected: protectedHeader,
      key,
      plaintext,
      serialization: 'compact'
    })
  })

  // print the ciphertext
  .then(jwe => {
    console.log(jwe)
    // JWT.decrypt('A128GCM', key, ciphertext, iv),
    return JWT.decrypt({key, serialized: jwe })
  })

  .then(console.log)
