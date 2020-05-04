# cli-social-login

TODO i cannot expose the clientSecret inside the api, the passport part should be deployed in a server

```ts
import { loginOnLocalhost } from 'loginOnLocalhost'

// starts a server on localhost to login the user
const { profile, accessToken, provider } = await loginOnLocalhost({
    googleOptions: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scope: ['...'],
    },
    port: 3000,
})

// use your google token
```
