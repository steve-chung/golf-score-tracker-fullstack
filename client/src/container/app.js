import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './main'
import Navbar from '../container/navbar'

const App = () => (

  <Router>
    <div className="onboarding">
      <Navbar/>
      <Main />
    </div>
  </Router>

)

export default App
