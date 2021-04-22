/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import { useHistory, Link } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const signup = async () => {
    try {
      const { status } = await axios.post('/account/login', { username, password })
      if (status === 200) {
        history.push('/')
      } else {
        throw new Error('Cannot login')
      }
    } catch (err) {
      alert(err.message)
    }
  }
  return (
    <>
      <h1>LOGIN</h1>
      <div className="mb-3">
        <label className="form-label">Username:</label>
        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        <label className="form-label">Password:</label>
        <input className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        <button
          type="submit"
          className="btn btn-success"
          onClick={() => {
            setPassword('')
            setUsername('')
            signup()
          }}
        >
          Login
        </button>
        <div>
          {' '}
          Do not have an account?
          <Link to="/signup"> Sign up here!</Link>
        </div>
      </div>
    </>
  )
}
export default Login
