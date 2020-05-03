import { strict as assert } from 'assert'
import { newAuthServer } from '../src/'

it('github', async () => {
    const res = await newAuthServer({
        githubOptions: {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        port: 3000,
    })
    console.log(res)
})
it('google', async () => {
    const res = await newAuthServer({
        googleOptions: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        port: 3000,
    })
    console.log(res)
})
