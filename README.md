# JSON Object Signing and Encryption (JOSE)

## Planned Features

- [ ] Based on Webcrypto API
- [ ] CryptoKey as expected key argument
- [ ] Isomorphic (Node.js and Browser)
- [ ] JWT Header and Payload Validation with JSON Schema
- [ ] Extensible JWT/JWS/JWE classes

## Dependencies

This package is a work in progress, dependent on other ongoing projects. Code
contained herein will be completed when the following dependencies are ready to
release:

- [anvilresearch/webcrypto](https://github.com/anvilresearch/webcrypto)

The current contents of the respository should be considered a "sketch".

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
