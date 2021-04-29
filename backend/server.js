const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const accountRouter = require('./routes/account')
const apiRouter = require('./routes/api')

const app = express()
const MONGO_URI = 'mongodb://localhost:27017/Then2Meet'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cookieSession({
  name: 'session',
  keys: ['randomKey'],
}))
app.use(express.static('dist'))
app.use(express.json())

app.use('/account', accountRouter)

app.use('/api', apiRouter)

app.use((err, req, res, next) => {
  res.status(500)
  res.send(err.message)
})
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})