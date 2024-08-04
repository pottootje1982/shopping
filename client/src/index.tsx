import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { RecipeProvider } from './Components/collection/RecipeProvider'
import { Authorized, Authorize } from './authorize'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ServerProvider } from './server-context'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <GoogleOAuthProvider clientId="525923155725-8k5ukoaer4isj73bl6jpi887v2r70ic8.apps.googleusercontent.com">
      <RecipeProvider>
        <ServerProvider>
          <Router>
            <Routes>
              <Route path="/authorized" element={<Authorized />}></Route>
              <Route path={'/'} element={<Authorize />}></Route>
              <Route path={'/login'} element={<Authorize />}></Route>
              <Route path={'/recipes/*'} element={<App />} />∏
            </Routes>
          </Router>
        </ServerProvider>
      </RecipeProvider>
    </GoogleOAuthProvider>
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
