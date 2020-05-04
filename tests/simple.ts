import { strict as assert } from 'assert'
import { expect } from 'chai'
import { Octokit } from '@octokit/rest'
import { loginOnLocalhost } from '../src/'

const firebaseConfig = {
    apiKey: 'AIzaSyD0ll629FiyH5SJ903ZeDdYpahfGPOqzxQ',
    authDomain: 'molten-enigma-261612.firebaseapp.com',
    databaseURL: 'https://molten-enigma-261612.firebaseio.com',
    projectId: 'molten-enigma-261612',
    storageBucket: 'molten-enigma-261612.appspot.com',
    messagingSenderId: '794182721870',
    appId: '1:794182721870:web:945e67c12addaa0cd43e1f',
    measurementId: 'G-YL40MBMZ0L',
}

it('all', async () => {
    const res = await loginOnLocalhost({
        firebaseConfig,
        // providers: ['google'],
        port: 3000,
    })
    console.log(res)
    expect(res.credentials.oauthAccessToken).to.be.ok('no token got')
})
it('github scopes work', async () => {
    const res = await loginOnLocalhost({
        firebaseConfig,
        // providers: ['google'],
        providers: ['github'],
        scopes: {
            github: ['repo'],
        },
        port: 3000,
    })
    const githubToken = res.credentials.oauthAccessToken
    console.log('token', githubToken)
    // const octokit = new Octokit({ auth: res.credentials.oauthAccessToken })
    const scopes = await getGithubScopes({ githubToken })
    expect(scopes.includes('repo')).to.be.ok
    console.log(scopes)
})

export async function getGithubScopes({ githubToken }) {
    const client = new Octokit({
        auth: githubToken,
    })
    const res = await client.users.getAuthenticated()
    const scopes =
        res.headers['X-OAuth-Scopes'] ||
        res.headers['X-OAuth-Scopes'.toLowerCase()]
    if (!scopes || !(typeof scopes === 'string')) {
        return []
    }
    return scopes.split(',').map((x) => x.trim())
}
