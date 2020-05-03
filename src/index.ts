import express, { Response } from 'express'
import { createHttpTerminator } from 'http-terminator'
import { AddressInfo } from 'net'
import open from 'open'
import path from 'path'
import { Strategy as GitHubStrategy, StrategyOptions } from 'passport-github2'
import {
    OAuth2Strategy as GoogleStrategy,
    IOAuth2StrategyOption,
} from 'passport-google-oauth'
import passport, { Profile } from 'passport'

import { LOCALHOST_LISTENER, LOGIN_STATIC_SITE_DIR, URLS } from './constants'

const LOGIN_STATIC_SITE_PATH = path.resolve(__dirname, LOGIN_STATIC_SITE_DIR)

type OptionsOverwrites = {
    callbackURL?: string
    scope?: string[]
}

export type LoginOnLocalhostReturnType = {
    profile: Profile
    accessToken: string
    provider: string
}

export interface Args {
    githubOptions?: Omit<StrategyOptions, 'callbackURL'> & OptionsOverwrites
    googleOptions?: Omit<IOAuth2StrategyOption, 'callbackURL'> &
        OptionsOverwrites
    port?: number
}

export function loginOnLocalhost(
    args: Args,
): Promise<LoginOnLocalhostReturnType> {
    const { githubOptions = null, googleOptions = null, port = 7043 } = args
    return new Promise((resolve, rej) => {
        const baseUrl = `http://127.0.0.1:${port}`
        function finish(req, res) {
            res.redirect(`/?username=${req.user.username}`)
            res.end()
            setTimeout(() => httpTerminator.terminate().catch(console.log), 500)
            resolve(req.user)
        }
        passport.serializeUser(function (user, done) {
            done(null, user)
        })

        passport.deserializeUser(function (user, done) {
            done(null, user)
        })
        const app = express()
        app.use(express.json())
        app.use(passport.initialize())
        // app.use(passport.session())
        app.use('/', express.static(LOGIN_STATIC_SITE_PATH))

        if (githubOptions) {
            passport.use(
                new GitHubStrategy(
                    {
                        callbackURL: baseUrl + URLS.github.callback,
                        ...githubOptions,
                    },
                    function (accessToken, refreshToken, profile, done) {
                        return done(null, {
                            profile,
                            accessToken,
                            provider: profile.provider,
                            refreshToken,
                        } as LoginOnLocalhostReturnType) // TODO add access tokens here
                    },
                ),
            )
            app.get(
                URLS.github.login,
                passport.authenticate('github', {
                    scope: githubOptions.scope || ['user:email'],
                }),
            )

            app.get(
                URLS.github.callback,
                passport.authenticate('github', { failureRedirect: '/' }),
                finish,
            )
        }
        if (googleOptions) {
            const scope = googleOptions.scope || ['openid', 'email', 'profile'] // 'https://www.googleapis.com/auth/userinfo.email'
            passport.use(
                new GoogleStrategy(
                    {
                        callbackURL: baseUrl + URLS.google.callback,
                        ...googleOptions,
                    },
                    function (accessToken, tokenSecret, profile, done) {
                        // TODO tokenSecret and refreshToken are undefined
                        return done(null, {
                            profile,
                            accessToken,
                            provider: profile.provider,
                        } as LoginOnLocalhostReturnType)
                    },
                ),
            )
            app.get(
                URLS.google.login,
                passport.authenticate('google', {
                    scope,
                }),
            )

            app.get(
                URLS.google.callback,
                passport.authenticate('google', {
                    failureRedirect: '/',
                    scope,
                }),
                finish,
            )
        }

        const server = app.listen(port, () => {
            const info = server.address() as AddressInfo
            const providers = getProviders(args)
            const address: string =
                `http://localhost:${port}/?` +
                (providers ? `providers=${providers}` : '')
            console.log('login at ' + address)
            // open(address, { background: false, wait: false })
        })
        const httpTerminator = createHttpTerminator({
            server,
        })
    })
}

function getProviders(args: Args): string {
    let providers = []
    if (args.githubOptions) {
        providers.push('github')
    }
    if (args.googleOptions) {
        providers.push('google')
    }

    return providers.join(',')
}
