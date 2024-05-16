import React from 'react'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { store } from './features/store'

const Root = () => {
    return (
        <Provider store={store}>
            {/* <h1 className="text-3xl font-bold">
                Hello world!
            </h1> */}
            <Outlet />
        </Provider>
    )
}

export default Root