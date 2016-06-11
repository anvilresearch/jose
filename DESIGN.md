# OIDC Implementation Design Notes

## Host system responsibilities

OpenID Connect makes no provisions for how a user is initially authenticated 
by the IdP. It's up to the implementer to determine whether to use passwords, 
LDAP, SAML, OAuth, or some other means. The host system is responsible for 
other dependencies of the OIDC authentication flows as well, such as 
persistence, managing user attributes, multi-factor auth and so on.

The principle challenge in designing a repurposeable OIDC implementation is 
defining the interface between OIDC Provider code and the host system. At 
various points in the auth flow, control should pass between the two. 

One way to achieve a useful separation of concerns might be to use ES6 classes 
to represent an OIDCProvider and a system Host. The latter would be made 
available as a dependency of the former by way of constructor-type dependency 
injection.

```javascript
/**
 * Host System Interface
 * 
 * This should be provided by developers using the OIDC Provider class
 * to handle out of scope implementation details
 */
class Host {
  
  /**
   * Authenticate
   * 
   * The `request` argument is an instance of an endpoint 
   * class such as `TokenRequest`. This method and other 
   * methods taking the request argument should return 
   * promises that resolve the request.
   * 
   * The request object should reference HTTPRequest and 
   * HTTPResponse instances (req and res), along with the 
   * provider.
   */
  authenticate (request) {
    // Dispatch to one or more authenticators ensuring that 
    // all required authentication methods are statisfied.
    // 
    // This could include multifactor auth, prompting for 
    // required attributes, sending verification messages, 
    // etc.
  }
  
  /**
   * Invalidate session
   */
  unauthenticate (request) {}
  
  /**
   * Callbacks for OpenID Connect and other events
   */
  beforeAuthorize (request) {}
  afterAuthorize (request) {}
  afterConsent (request) {}
  beforeToken (request) {}
  afterToken (request) {}
  
  // how to deal with things like persistence methods, etc?
  // how to minimize the amount of interface to satisfy?
  // what are the options and tradeoffs here?
  // is it feasible to use some simple generalized persistence 
  // callbacks?
  find (type, query) {}
  save (type, id, data) {}
  remove (type, id) {}

}
```

## OIDCProvider class

The concept of a "provider" should be treated as a class in order to 
encapsulate OIDC logic and make it feasible to support multitenancy. Such a 
class can be instantiated multiple times in the same process with different
OIDC configuration settings.

The OIDCProvider class should validate OIDC configuration against a JSON 
Schema. It should also be possible to treat the class as a persisted model,
where settings can be obtained from a configuration file or from a database
record.

Endpoints (Express route handlers) can be implemented as instance methods.
```javascript
/**
 * OpenID Connect Provider Class
 */
class OIDCProvider {

  /**
   * Constructor
   * 
   * Host is an object representing the non-OIDC parts
   * of the system. Configuration is OIDC configuration
   * settings such as supported response types.
   */
  constructor (host, configuration = {}) {
    this.host = host
    Object.assign(this, configuration)
  }
  
  /**
   * Schema
   * 
   * The class should define a JSON Schema for validating 
   * instances.
   */
  static get schema () {
    return {
      properties: {
        // oidc property definitions
        issuer: {
          type: 'string',
          format: 'url',
          required: true
        },
        // etc
      }
    }
  }
  
  /**
   * Endpoints
   * 
   * Each endpoint method is an Express route handler. The
   * `next` argument should be omitted and error handling 
   * should be incorporated directly into the logic for each 
   * endpoint.
   * 
   * Implementation of each endpoint should be organized 
   * into separate classes. In addition to `req` and `res` 
   * arguments, the OIDCProvider instance itself should be 
   * injected into the request handling context.
   */
  authorize (req, res) {
    AuthenticationRequest.handle(req, res, this)
  }
  
  token (req, res) {
    TokenRequest.handle(req, res, this)
  }
  
  // etc
  discover (req, res) {}
  register (req, res) {}  
  jwks (req, res) {}
  session (req, res) {}
  logout (req, res) {}  
  
  /**
   * Router
   * 
   * The instance should be able to construct an Express
   * router. Possibly support other frameworks as well.
   */
  router () {
    let router = Router()
    
    router.get('/authorize', this.authorize)
    router.post('/authorize', this.authorize)
    router.post('/authorize', this.token)
    // ...
    
    return router
  }
}
```

An OIDC-based IdP can then be created like so.

```javascript
let server = Express()

/**
 * Define the out of scope logic and various hooks.
 */
class MyHost extends Host {
  authenticate (context) {
    // return promise
  }
}

/**
 * Instantiate a provider
 */
let host = new MyHost()
let provider = new OIDCProvider(host, {
  mount: '/oidc',
  issuer: 'https://oidc.whatever.io'
})

/**
 * Mount to host
 */
server.use('/oidc', provider.router())
```

Multitenancy requires a slightly different approach, where the server 
dispatches between providers based on the request host.

```javascript
// ES6 Map-based LRU implementation
// https://gist.github.com/christiansmith/85065b04efe452f58e37
class Providers extends LRU {
  dispatch (endpoint) {
    return (req, res, next) => {
      this.get(req.host)[endpoint](req, res, next)
    }
  }
}

// new instance of Providers cache
let providers = new Providers()
providers.set('connect.foo.com', new OIDCProvider(host, settings1))
providers.set('connect.bar.com', new OIDCProvider(host, settings2))
providers.set('connect.baz.com', new OIDCProvider(host, settings3))

// mount the router with a dispatcher to providers
let router = express.Router()
router.get('/authorize', providers.dispatch('authorize'))
router.post('/authorize', providers.dispatch('authorize'))
router.post('/token', providers.dispatch('token'))
router.get('/userinfo', providers.dispatch('userinfo'))
```

## Request Handler Classes

### AuthenticationRequest

```javascript
const PARAMS = { 'GET': 'query', 'POST': 'body' }

/**
 * Encapsulates all logic for the /authorize endpoint.
 * Uses the provider's dispatcher to pass control flow out of protocol scope
 */
class AuthenticationRequest {

  /**
   * Handle
   */
  static handle (req, res, provider) {
    let {host} = provider
    let request = new AuthenticationRequest(req, res, provider)

    Promise.resolve(request) // request is resolved by each promise
      .then(request.validate)
      .then(host.verifyClient) each of these should get and resolve `request`
      .then(host.authenticateUser)
      .then(host.allowScope)
      .then(host.obtainConsent)
      .then(request.authorize)
      .catch(request.error)
  }
  
  /**
   * Constructor
   */
  constructor (req, res, provider) {
    this.req = req
    this.res = res
    this.provider = provider
    this.host = provider.host
    this.params = req[PARAMS[req.method]] || {}
  }

  /**
   * Validate
   */
  validate (request) {
    return new Promise((resolve, reject) => {
      // after performing the operation encapsulated by the function
      // resolve the request instance
      // this is not really necessary for methods on the instance, 
      // but is necessary for passing control to the dispatcher
      // and can potentially clarify intent here by not referencing "this"
      resolve(request) 
    })
  }

  /**
   * Authorize
   */
  authorize (request) {
    if (request.authorized === true) {
      // build up an appropriate response
      this.redirect(...)
    } else {
      this.redirect(...)
    }
  }

  /**
   * Redirect
   */
  redirect (uri) {
    this.res.redirect(uri)
  }

  /**
   * Error handler
   */
  error (err) {
    ErrorHandler.handle(err)
  }

}
```

### TokenRequest

```javascript
class TokenRequest {
  
  static handle (req, res, provider) {
    let {host} = provider
    let request = new TokenRequest(req, res, provider)

    Promise.resolve()
      .then(request.validate)
      .then(host.authenticateClient)        // some of these functions seem to belong inside OIDC implementation
      .then(host.verifyAuthorizationCode)   // however, persistent storage is out of scope
      .then(host.restrictClientScope)       // this challenges earlier ideas about the boundaries of the library
      .then(request.token)
      .catch(request.error)

  }

  constructor (req, res, provider) {}
  validate () {}
  token () {}
  error (err) {
    ErrorHandler.handle(err)
  }
  
}
```

## Error Handling

The implementation should provide a special error class with additional
properties and behavior to fit the OIDC spec. We also need an error handler
method to use in the catch clause of promises. Because this code may end up
embedded in other projects than a standalone auth server it should handle 
all errors internally to avoid complicating host implementations.

```javascript

class OAuth2Error extends Error {}
class OpenIDConnectError extends OAuth2Error {}
class BadRequestError extends OpenIDConnectError {}

class ErrorResponse {
  static handle (request, error) {
    let handler = new ErrorResponse(request)
    handler[error.name](error)
  }

  constructor (request) {
    this.request = request
    this.response = request.res
  }

  BadRequest (err) {}
  Unauthorized (err) {}
  Forbidden (err) {}

  // oidc specific?
  AccessDenied (err) {
    this..response.redirect(err.redirect_uri)
  }
}
```



