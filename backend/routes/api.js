const express = require('express')
const User = require('../models/user')
const Calendar = require('../models/calendar')
const isAuthenticated = require('../middlewares/isAuthenticated')
const router = express.Router()
let counter = 0

router.post('/create', isAuthenticated, async(req, res, next) => {
  try{
  const {name, timeStart, timeEnd, days} = req.body
  const {username} = req.session
  try{
      const response = await Calendar.create({name, timeStart, timeEnd, days: days, owner: username, times: {}})
      const response2 = await User.findOneAndUpdate({username: req.session.username}, {$addToSet: {calendars:  {id: response._id, name: name, submitted: false, _id: counter++}}})
      res.send(response) 
  } catch {
      next(new Error('cannot create new calendar'))
  }
} catch (err){
  next(err)
}
})

router.post('/calinfo', isAuthenticated, async(req, res, next) => {
  try{ 
  const {_id} = req.body
  const cal = await Calendar.find({_id: _id})
  if(cal){
    res.send(cal)
  }
} catch (err){
  console.log(err)
  next(err)
}
})

router.post('/setTimes', isAuthenticated, async(req, res, next) => {
  try {
   const {times, _id } = req.body
   const cal = await Calendar.find({_id: _id})
   console.log(cal)
   const calTimes = cal[0].times
   times.forEach((time, index) => {
     if(time in calTimes){
       const num = calTimes[time]
       calTimes[time] = num + 1
     } else {
       calTimes[time] = 1
     }
   })
   const result = await Calendar.findOneAndUpdate({_id: _id}, {times: calTimes})
   const {calendars} = await User.findOne({username: req.session.username})
   let name = ''
   calendars.forEach((calendar,index) => {if(calendar.id = _id) {
     id = calendar._id
     name = calendar.name
     console.log(id)
   } })
   const resul = await User.updateOne({username: req.session.username, 'calendars._id': id, 'calendars.name': name}, {'$set': {'calendars.$.submitted': true }})
   console.log(resul)
   res.send(result)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.post('/setCurCal', isAuthenticated, async(req, res, next) => {
  try {
  const {id} = req.body
  const res = await User.findOneAndUpdate({username: req.session.username}, {curCal: id}, {new: true})
  } catch (err){
    next(err)
  }
})

router.get('/getCurCal', isAuthenticated, async(req, res, next) => {
  try{
 const response = await User.findOne({username: req.session.username})
 console.log(response)
 res.send(response) 
  } catch (err) {
    next(err)
  }
})

router.post('/addfriends', isAuthenticated, async(req, res, next) => {
  try {
    const {friends, id, name} = req.body
    for(const friend in friends){
      const result = User.findOneAndUpdate({username: friends[friend]}, {$addToSet: {calendars:  {id, name: name}}}, {new: true}).then(result => {
      const results = Calendar.findOneAndUpdate({_id: id}, {$addToSet: {emails: result.email}}).then(results =>  console.log(results))
    })
  }} catch (err) {
    console.log(err)
    next(err)
  }
})
router.get('/getbesttimes', isAuthenticated, async(req, res, next) => {
try{
const {curCal}= await User.findOne({username: req.session.username})
const {times} = await Calendar.findOne({_id: curCal})
if (times == null || times == undefined){
  res.send([])
} else {
const timesArr = Object.keys(times).map(time => [time, times[time]])
res.send(timesArr)
}
} catch (err) {
  console.log(err)
  next(err)
}


})


module.exports = router