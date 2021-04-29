const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String},
  calendars: { type: [Object] },
  curCal: String,
  isOwner: Boolean
})

module.exports = model('User', userSchema)