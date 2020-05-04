# cli-social-login

TODO i cannot expose the clientSecret inside the api, the passport part should be deployed in a server

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
