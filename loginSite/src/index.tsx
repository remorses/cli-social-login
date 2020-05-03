import React from 'react'
import { render } from 'react-dom'
import LoginPage from './login'

render(<LoginPage />, document.getElementById('root'))

// @ts-ignore
if (module?.hot) {
    // @ts-ignore
    module?.hot.accept()
}
