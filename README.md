# cli-social-login

Uses firebase and a local server to login the user and get an oauth access token from github, facebook, twitter, ...

## Usage

```
npm i cli-social-login
```

Use in your cli to get an auth token via the browser login
The function will pause until the user logins in the printed localhost url

```ts
import { loginOnLocalhost } from 'cli-social-login'

// starts a server on localhost to login the user
const { credentials, user } = await loginOnLocalhost({
    firebaseConfig,
    providers: ['github'],
    scopes: {
        github: ['repo'],
    },
    port: 3000, // default sto random port
})
const githubToken = credentials.oauthAccessToken
// use your github token
```
