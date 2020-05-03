import { strict as assert } from 'assert'
import { loginOnLocalhost } from '../src/'

it('github', async () => {
    const res = await loginOnLocalhost({
        githubOptions: {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        port: 3000,
    })
    console.log(res)
})

it('google', async () => {
    const res = await loginOnLocalhost({
        googleOptions: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        port: 3000,
    })
    console.log(res)
})
