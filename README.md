# cli-social-login

Uses firebase and a local server to login the user via firebase and get an oauth access token

## Usage

```
npm i cli-social-login
```

```ts
import { loginOnLocalhost } from 'loginOnLocalhost'

// starts a server on localhost to login the user
const { credentials, user } = await loginOnLocalhost({
    firebaseConfig,
    providers: ['github'],
    providers: ['github'],
    scopes: {
        github: ['repo'],
    },
    port: 3000, // default sto random port
})
const githubToken = credentials.oauthAccessToken
// use your github token
```
