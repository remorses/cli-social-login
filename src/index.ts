import express, { Response } from 'express'
import { createHttpTerminator } from 'http-terminator'
import { AddressInfo } from 'net'
import open from 'open'
import path from 'path'
import { Strategy as GitHubStrategy, StrategyOptions } from 'passport-github2'
import passport from 'passport'

import { LOCALHOST_LISTENER, LOGIN_STATIC_SITE_DIR, URLS } from './constants'

const LOGIN_STATIC_SITE_PATH = path.resolve(__dirname, LOGIN_STATIC_SITE_DIR)

export interface Args {
    githubOptions?: Omit<StrategyOptions, 'callbackURL'> & {
        callbackURL?: string
    }
    port?: number
}

export function newAuthServer({
    githubOptions = null,
    port = 7043,
}: Args): Promise<{
    user: { uid; displayName; email }
    idToken: string
    githubToken: string
}> {
    return new Promise((resolve, rej) => {
        const baseUrl = `http://127.0.0.1:${port}`
        function finish(req, res) {
            res.redirect(`/?username=${req.user.username}`)
            res.end()
            setTimeout(() => httpTerminator.terminate().catch(console.log), 500)
            // server.close((err) => {
            //     if (err) {
            //         console.log('ERROR CLOSING', err)
            //     }
            //     console.log('closed server')
            // })

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
                        return done(null, profile)
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

        const server = app.listen(port, () => {
            const info = server.address() as AddressInfo
            const address: string = info.port
                ? 'http://localhost:' + info.port
                : (info as any)
            console.log('login at ' + address)
            // open(address, { background: false, wait: false })
        })
        const httpTerminator = createHttpTerminator({
            server,
        })
    })
}
