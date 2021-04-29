const express = require('express')
const User = require('../models/user')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  const { username, password, email} = req.body
  try {
    await User.create({ username, password, email, curCal: '' })
    res.send('account is created')
  } catch {
    next(new Error('could not sign-up'))
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  User.findOne({ username, password }, (err, user) => {
    if (user) {
      req.session.username = username
      req.session.password = password
      res.send('you are logged in')
    } else if (err) {
      next(err)
    } else {
      next(new Error('could not find it'))
    }
  })
})

router.post('/logout', isAuthenticated, async (req, res, next) => {
  try {
    req.session = {}
    res.send('user logged out')
  } catch {
    next(new Error('Could not logout'))
  }
})

router.get('/loggedin', async (req, res, next) => {
  try {
    const answer = {}
    if (req.session.username === undefined || req.session.password === undefined) {
      answer.loggedin = false
      res.send(answer)
    } else {
      answer.loggedin = true
      answer.username = req.session.username
      res.send(answer)
    }
  } catch (err) {
    next(new Error(err.message))
  }
})

router.get('/getcals', isAuthenticated, async(req, res, next) => {
  try{
    User.findOne({username: req.session.username}, (err, user) => {
      if(user){
        const calendars = user.calendars
        res.send(user)
      } else {
        next(err)
      }
   })

  } catch (err){
    next(new Error('cannot get calendars'))
  }



})

module.exports = router