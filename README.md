# cli-social-login

```ts
import { loginOnLocalhost } from 'loginOnLocalhost'

const { profile, accessToken, provider } = await loginOnLocalhost({
    googleOptions: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scope: ['...'],
    },
    port: 3000,
})

// use your token
```
