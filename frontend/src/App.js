/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import HomePage from './components/HomePage'
import CalendarPage from './components/CalendarPage'

const App = () => (
  <Router>
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route path='new'>
          <CalendarPage/>
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
    </Switch>
  </Router>
)

export default App