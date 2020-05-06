import { render } from 'react-dom'
import React, { useEffect } from 'react'
import { ApiResult, LoginOnLocalhostReturnType } from '../../src'
import { usePromise } from 'react-extra-hooks'
import {
    FacebookLoginButton,
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons'
import { URLS, LOCALHOST_CONFIG_PATH } from '../../src/constants'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import {
    GoogleButton,
    GithubButton,
    AuthProvider,
    FacebookButton,
} from 'firebase-react-components/'
import { LOCALHOST_LISTENER } from '../../src/constants'
import { useState } from 'react'

let analytics: firebase.analytics.Analytics

export async function onLogin(
    user: firebase.User,
    creds: firebase.auth.OAuthCredential,
) {
    const idToken = await user.getIdToken()
    console.log(JSON.stringify(user, null, 4))
    console.log('githubToken', creds.accessToken)
    await fetch(LOCALHOST_LISTENER, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // provider: user.providerId,
            user,
            idToken,
            credentials: creds.toJSON(),
        } as LoginOnLocalhostReturnType),
    })
    analytics.setUserId(idToken)
    analytics.logEvent('cli_logged_in')
    window.close()
}

function setupFirebase(config) {
    if (!firebase.apps.length) {
        firebase.initializeApp(config)
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    }
    analytics = firebase.analytics()
}

const LoginPage = () => {
    const { result, loading } = usePromise<ApiResult>(() =>
        fetch(LOCALHOST_CONFIG_PATH, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((x) => x.json()),
    )
    
    useEffect(() => {
        analytics && analytics.logEvent('cli_begin_login')
    }, [analytics])

    const [loggedIn, setLoggedIn] = useState(false)
    if (!result) {
        return null
    }

    setupFirebase(result.firebaseConfig)

    if (loggedIn) {
        return (
            <Container>
                Welcome back!🥳
                <div style={{ opacity: 0.5, fontSize: '24px' }}>
                    Return to the terminal to continue
                </div>
            </Container>
        )
    }
    return (
        <Container>
            {/* <GoogleButton text='Start With Google' onLogin={onLogin} /> */}
            <AuthProvider
                onLogin={(x, creds) =>
                    onLogin(x, creds as any).then(() => setLoggedIn(true))
                }
                noPersistence
            >
                {result.providers.map((provider, i) => {
                    const props = {
                        key: i,
                        scopes: result?.scopes?.[provider],
                    }
                    if (provider === 'github') {
                        return (
                            <GithubButton text='Login With Github' {...props} />
                        )
                    }
                    if (provider === 'google') {
                        return (
                            <GoogleButton text='Login With Google' {...props} />
                        )
                    }
                    if (provider === 'facebook') {
                        return (
                            <FacebookButton
                                text='Login With Facebook'
                                {...props}
                            />
                        )
                    }
                    return null
                })}
            </AuthProvider>
        </Container>
    )
}

const Container = (p) => (
    <div
        style={{
            fontFamily: 'monospace',
            fontWeight: 600,
            fontSize: '48px',
            maxWidth: '500px',
            textAlign: 'center',
            margin: '100px auto',
        }}
        {...p}
    />
)

render(<LoginPage />, document.getElementById('root'))
