import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { Provider } from 'react-redux'
import { makeStore } from './store/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={makeStore()}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
