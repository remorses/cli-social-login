# cli-social-login

Function to login the user and get an oauth access token from github, facebook, twitter, ... using firebase and a local server

It also emits the events `cli_begin_login` and `cli_logeed_in` so you can discover how many users try to login and then churn away.

## Usage

```
npm i cli-social-login
```

Use inside your cli application to get an oauth provider token via the browser.

The function will pause until the user logins in the printed localhost url

Currently used in [actions-cli](https://github.com/remorses/actions-cli) to get the github token

```ts
import { loginOnLocalhost } from 'cli-social-login'

// starts a server on localhost to login the user
const { credentials, user } = await loginOnLocalhost({
    firebaseConfig,
    providers: ['github'],
    scopes: {
        github: ['repo'],
    },
    port: 3000, // default is a random available port
})
const githubToken = credentials.oauthAccessToken
// use your github token
```
