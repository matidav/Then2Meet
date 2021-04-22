/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import { useHistory, Link } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const signup = async () => {
    try {
      const { status } = await axios.post('/account/signup', { username, password })
      if (status === 200) {
        history.push('/')
      }
    } catch (err) {
      alert('Signup has gone wrong')
    }
  }
  return (
    <>
      <h1>SIGN UP</h1>
      <div className="mb-3">
        <label className="form-label">Username:</label>
        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        <label className="form-label">Password:</label>
        <input className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        <button
          className="btn btn-success"
          type="submit"
          onClick={() => {
            setPassword('')
            setUsername('')
            signup()
          }}
        >
          Register
        </button>
        <div>
          {' '}
          Already have an account?
          <Link to="/login"> Login here!</Link>
        </div>
      </div>
    </>
  )
}
export default SignUp
