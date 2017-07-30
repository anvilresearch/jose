const crypto = require('@trust/webcrypto')
const { JWT } = require('../src')
const base64url = require('base64url')


JWT.sign({
  header: { alg: 'none' },
  payload: { hello: 'world' }
})
.then(token => {
  console.log(token)
  return JWT.verify({ serialized: token })
})
.then(console.log)
.catch(console.log)
