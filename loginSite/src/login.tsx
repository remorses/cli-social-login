import React from 'react'
import {
    FacebookLoginButton,
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons'
import { URLS } from '../../src/constants'
import { useState } from 'react'

const Button = ({ provider }) => {
    const onClick = () => navigate(URLS[provider].login)
    if (provider == 'facebook') {
        return <FacebookLoginButton onClick={onClick} />
    }
    if (provider == 'github') {
        return <GithubLoginButton onClick={onClick} />
    }
    if (provider == 'google') {
        return <GoogleLoginButton onClick={onClick} />
    }
    return null
}

function navigate(url) {
    window.location.href = url
}

const LoginPage = () => {
    const search = new URL(window.location.href).searchParams
    const username = search.get('username')
    const providers = search.get('providers')?.split(',') || Object.keys(URLS)
    // console.log(providers)
    const loggedIn = !!username
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
            {providers.map((prov) => {
                return <Button provider={prov} />
            })}
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

export default LoginPage
