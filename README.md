# JSON Object Signing and Encryption (JOSE)

## Planned Features

- [x] Based on Webcrypto API
- [ ] CryptoKey as expected key argument
- [x] Isomorphic (Node.js and Browser)
- [ ] JWT Header and Payload Validation with JSON Schema
- [ ] Extensible JWT/JWS/JWE classes

## Dependencies

This package is a work in progress, dependent on other ongoing projects. Code
contained herein will be completed when the following dependencies are ready to
release:

- [anvilresearch/webcrypto](https://github.com/anvilresearch/webcrypto)

The current contents of the repository should be considered a "sketch".

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

## Usage in Browser

If you `npm install jose` as a dependency, the Webpack'd minified bundle will be
available in the `dist/` directory as `jose.min.js`.

If you're actively developing/testing this lib, you can `npm run dist`, and the
bundle will be rebuilt.

To use in the browser, simply import the bundle in a `<script>` tag, and the lib
will be loaded into the `window.JOSE` global variable.

Example `test.html` file, to illustrate:

```html
<html>
<head>
  <script src="dist/jose.min.js"></script>
  <script>
    // You can now start using the library
    let jwt = new JOSE.JWT({
      header: { alg: 'HS256' },
      payload: { iss: 'https://forge.anvil.io' }
    })
  </script>
</head>
<body>
Sample usage of JOSE lib in a browser.
</body>
</html>
```

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
