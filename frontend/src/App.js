/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-filename-extension */

import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import HomePage from './components/HomePage'
import Create from './components/Create'
import Calendar from './components/Calendar'

const App = () => {

return (



  <Router>
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route path='/create'>
          <Create />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route path='/login'>
        <Login />
        </Route>
        <Route path='/cal/*'>
        <Calendar />
        </Route>
    </Switch>
  </Router>
)
}
export default App