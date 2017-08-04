const crypto = require('@trust/webcrypto')
const JWA = require('../src/jose/JWA')
const base64url = require('base64url')


let key

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

    return JWA.encrypt('A128GCM', key, 'encryptthisplaintext')
  })

  // print the ciphertext
  .then(({iv, ciphertext, tag}) => {
      console.log(ciphertext)
      console.log(tag)

      return JWA.decrypt('A128GCM', key, ciphertext, iv, tag)
  })

  // get back the plaintext
  .then(console.log)

  // look at the out
  .catch(console.log)
