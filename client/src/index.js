import React from 'react'
import ReactDOM from 'react-dom'
import App from './container/app'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true
ReactDOM.render(
  <App/>,
  document.querySelector('#root')
)
