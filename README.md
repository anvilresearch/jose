# JSON Object Signing and Encryption (JOSE)

## Planned Features

- [ ] Based on Webcrypto API
- [ ] JWK as first class key format
- [ ] Isomorphic (Node.js and Browser)
- [ ] KeyChain generation, rotation and (de)serialization
- [ ] JWT Header and Payload Validation with JSON Schema
- [ ] Extensible JWT/JWS/JWE classes

## Scope of implementation

- [JWA][jwa] – **RFC7518**
  - [ ] Cryptographic Algorithms for Digital Signatures and MACs
  - [ ] Cryptographic Algorithms for Key Management
  - [ ] Cryptographic Algorithms for Content Encryption
- [JWK][jwk] – **RFC7517**
  - [ ] JSON Web Key (JWK) Format
  - [ ] JWK Set Format
  - [ ] JSON Web Key (JWK) Thumbprint (RFC7638)
  - [ ] Conversion from JWK to PEM and PEM to JWK
- [JWT][jwt] – **RFC7519**
- [JWS][jws] – **RFC7515**
- [JWE][jwe] – **RFC7516**

[jwa]: https://tools.ietf.org/html/rfc7518
[jwk]: https://tools.ietf.org/html/rfc7517
[jwt]: https://tools.ietf.org/html/rfc7519
[jws]: https://tools.ietf.org/html/rfc7515
[jwe]: https://tools.ietf.org/html/rfc7516

## Running tests

### Nodejs

```bash
$ npm test
```

### Browser (karma)

```bash
$ npm run karma
```

## MIT License

Copyright (c) 2016 Anvil Research, Inc.
