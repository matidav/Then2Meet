const mongoose = require('mongoose')

const { Schema, model } = mongoose

const calendarSchema = new Schema({
    name: String,
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    days: {type: [String], required: true},
    owner: String,
    emails: {type: [String]},
    times: Object
  }, { minimize: false })

  module.exports = model('Calendar', calendarSchema)