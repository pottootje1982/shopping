import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

it.skip('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.createRoot(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
