import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Create = () => {
  const[name, nameSetter] = useState('')
  const [dayBank, dayBankSetter] = useState({Monday: false, Tuesday:false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false})
  const days = []
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const[timeStart, timeStartSetter] = useState('')
  const[timeEnd, timeEndSetter] = useState('')
  const history = useHistory()
  let counter = 0

  const toggleDay = day => {
      const bool = dayBank[day]
      dayBank[day] = !bool
      dayBankSetter(dayBank)
      console.log(dayBank)     
  }

const test = () => {
    const result = Object.keys(dayBank).map(key => [key, dayBank[key]])
    console.log(result)
}
const condenseDays = () => {
    for(const day in dayBank){
        if(dayBank[day] == true){
            days.push(day)
        }
}


}
  const createCal = async() => {
      try{
        const response = await axios.post('/api/create', { name, days: days, timeStart, timeEnd })
        const {_id} = JSON.parse(response.request.response)  
        history.push('/cal/'+ _id)
        const res = await axios.post('/api/setCurCal', {id: _id})
        
        } catch (err){
          alert(err.message)
      }
  }

  return(
      <>
      <label>Name:</label>
      <input onChange = {e => nameSetter(e.target.value)}/>
      <div>
      {daysOfWeek.map(day => {
          return <div className = 'day' id = {day} iscolored = 'false' key = {counter++} onClick = {e => {
              console.log(e)
            if(e.target.attributes[2].value == 'true') {
                document.getElementById(day).style.color = "black"
                e.target.attributes[2].value='false'
               } else {
                document.getElementById(day).style.color = "green"
                e.target.attributes[2].value='true'
               }
               toggleDay(day)
          }}>{day}</div>
      })}
      </div>
      <label>Start Time</label>
      <input onChange = {e => timeStartSetter(e.target.value)}/>
      <label>End Time</label>
      <input onChange = {e => timeEndSetter(e.target.value)}/>
      <button onClick = {() => {
        condenseDays()
        if(days.length == 0){
            alert('You have to choose a day')
        } else if(isNaN(timeStart) || isNaN(timeEnd) || timeStart < 0 || timeStart > 23 || timeEnd < 0 || timeEnd > 23){
            alert('You must put in a number between 0 and 23')
        } else if(timeStart >= timeEnd) {
            alert('Your start time cannot be after your endtime')
        }else {
        createCal()}}}>Create new calendar</button>
        <button onClick ={() => test()}>test</button>
        
      </>

  )
}

export default Create