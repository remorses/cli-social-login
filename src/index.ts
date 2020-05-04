import express from 'express'
import firebase from 'firebase/app'
import { createHttpTerminator } from 'http-terminator'
import { AddressInfo } from 'net'
import path from 'path'
import {
    LOCALHOST_CONFIG_PATH,
    LOCALHOST_LISTENER,
    LOGIN_STATIC_SITE_DIR,
} from './constants'

const LOGIN_STATIC_SITE_PATH = path.resolve(__dirname, LOGIN_STATIC_SITE_DIR)

type ProviderName = 'github' | 'google' | 'facebook' | 'twitter'

export type ApiResult = {
    firebaseConfig: any
    providers: ProviderName[]
    scopes: Args['scopes']
}

export type LoginOnLocalhostReturnType = {
    user: firebase.User
    credentials: {
        oauthAccessToken?: string
        providerId: string
        signInMethod: string
    }
    idToken: string
}

export interface Args {
    providers?: string[]
    scopes?: Partial<{ [k in ProviderName]: string[] }>
    firebaseConfig: any
    port?: number
}

export function loginOnLocalhost(
    args: Args,
): Promise<LoginOnLocalhostReturnType> {
    const {
        firebaseConfig,
        providers = ['github', 'google', 'facebook'],
        port = 0,
        scopes,
    } = args
    return new Promise((resolve, rej) => {
        // const baseUrl = `http://127.0.0.1:${port}`

        const app = express()
        app.use(express.json())

        // app.use(passport.session())
        app.use('/', express.static(LOGIN_STATIC_SITE_PATH))

        app.post(LOCALHOST_LISTENER, async (req, res) => {
            try {
                // console.log({ body: req.body })
                if (!req.body.user) {
                    throw Error('user not found')
                }
                res.send({ ok: 1 })
                res.end()
                setTimeout(
                    () => httpTerminator.terminate().catch(console.log),
                    500,
                )
                resolve(await req.body)
            } catch (e) {
                rej(e)
            }
        })

        app.get(LOCALHOST_CONFIG_PATH, async (req, res) => {
            try {
                res.send({
                    firebaseConfig,
                    providers,
                    scopes,
                } as ApiResult)
            } catch (e) {
                rej(e)
            }
        })

        const server = app.listen(port, () => {
            const info = server.address() as AddressInfo
            const address: string = `http://localhost:${info.port}`
            console.log('login at ' + address)
            // open(address, { background: false, wait: false })
        })
        const httpTerminator = createHttpTerminator({
            server,
        })
    })
}
