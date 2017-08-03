const { JWT } = require('../src')

let header = { alg: 'none' }
let payload =  { hello: 'world' }

JWT.encode(header, payload)
  .then(token => {
    console.log(token)

    return JWT.verify(undefined, token)  // key == undefined
  })
  .then(console.log)
  .catch(console.log)
