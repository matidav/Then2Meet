/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-alert */
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const HomePage = () => {
  const [loggedIn, toggleLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [calendars, calendarsSetter] = useState([])
  const history = useHistory()
  let counter = 0;
  const logOut = async () => {
    try {
      const res = await axios.post('/account/logout')
      if (res.status === 200) {
        toggleLoggedIn(false)
        history.push('/')
      } else {
        alert(res.status)
      }
    } catch (err) {
      alert(err.message)
    }
  }


  useEffect(async () => {
    try {
      const userIn =  axios.get('/account/loggedin').then(userIn => {
      if (userIn.data.loggedin === true) {
        toggleLoggedIn(true)
        setUsername(` Welcome back ${userIn.data.username}`)
      const cals = axios.get('/account/getcals').then(cals => {
        console.log(cals)
      const calendars = cals.data.calendars
      console.log(calendars)
      calendarsSetter(<div>{calendars.map(cal => <div className = 'cals' onClick = {() => {
        setCurCal(cal.id)
        history.push('/cal/' + cal.id)
      }} key = {counter++}>{cal.name}</div>)}</div>)
    })
      }})
    } catch (err) {
      alert(err)
    }
  }, [])

  const setCurCal = async(id) => {
    const res = await axios.post('/api/setCurCal', {id})
  }

  useEffect(async() => {
    try {
      
    } catch (err) {
      alert(err)
    }
  }, [])
  

  return (
    <>
    <h1>Welcome to Then2Meet</h1>
      {(loggedIn) ? 
        <>
          {username}
          <button type="submit" className="btn btn-primary" onClick={() => logOut()}>
            Logout
          </button>
          <button type="submit" className="btn btn-primary" onClick ={() => history.push('/create')}>
            Create New Calendar
          </button>
          <h2>Here are your calendars:</h2>
          {calendars}
        </>: 
        <>
          <button type="submit" className="btn btn-primary" onClick={() => history.push('/login')}>
            {' '}
            Login
          </button>
          <button type="submit" className="btn btn-primary" onClick={() => history.push('/signup')}>
            Sign Up
          </button>
        </>}
    </>
  )
}

export default HomePage
