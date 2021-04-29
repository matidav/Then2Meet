import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Calendar = () => {
  var gapi = window.gapi
  const CLIENT_ID = "141586272587-39frbjr09e9etuk7chs3rnq1n5fsp8v1.apps.googleusercontent.com"
  const API_KEY = "AIzaSyDhlZim8Wy2rG1LU47CaH42OeXpRK8vOMo"
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events"
  let counter = 0
  const [days, daysSetter] = useState([])
  const [times, timesSetter] = useState([])
  const [inviteFriends, inviteFriendsSetter] = useState('')
  const [isOwner, isOwnerSetter] = useState(false)
  const [emails, emailsSetter] = useState([])
  const  [_id, _idSetter] = useState('') 
  const [submitted, submittedSetter] = useState(false)
  const [calendarName, calendarNameSetter] = useState('')
  const [finalizedTimes, finalizedTimesSetter] = useState([])
  let timesChosen = {}
  const history = useHistory()

  const submitTimes = async arr => {
    const res = await axios.post('/api/setTimes', {_id, times: arr})
  }

  const setTimes = (startTime, endTime) => {
    const et = parseInt(endTime)
    const st = parseInt(startTime)
    const answer = []
    for(let i = st; i <= et; i++){
      answer.push(i)
    }
    return answer
    }

  const dayConverter = str => {
    const dayArray = [['Sunday', 0], ['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], 
      ['Thursday', 4], ['Friday', 5], ['Saturday', 6]]
    let answer = 0
    dayArray.forEach(day => {
      if(str === day[0]){
        answer = day[1]         
      }
    })
    return answer
  }

  const timeConverter = (int) => {
    if(int > 12){
      const newInt = int - 12
      return newInt + ":00 PM"
    } else if (int < 12 && int > 0) {
      return int + ":00 AM"
    } else if (int == 12){
      return "12:00 PM"
    } else if (int == 0){
      return "12:00 AM"
    }
  }


  const getBestTime = async() => {
    const res = await axios.get('/api/getbesttimes').then(res => {
      const sortedArray = res.data.sort((a, b) => {
        return b[1] - a[1];
      })
      finalizedTimesSetter(sortedArray)
    })
  }

  useEffect(async () => {
    try {
      const result = axios.get('/api/getCurCal').then(result => {
        _idSetter(result.data.curCal)
        const id = result.data.curCal
        const cals = result.data.calendars
        let submittedAlready = false
        cals.map(cal => {if(cal.id == id){
          submittedAlready = cal.submitted
        }})
        submittedSetter(submittedAlready)
        const res = axios.post('/api/calinfo', {_id: id}).then(res => {
          daysSetter(res.data[0].days)
          timesSetter(setTimes(res.data[0].timeStart, res.data[0].timeEnd))
          emailsSetter(res.data[0].emails)
          calendarNameSetter(res.data[0].name)
          const ans = axios.get('/account/loggedin').then(ans => {
            const calOwner = res.data[0].owner.trim()
            const curUser =  ans.data.username.trim()     
            if(calOwner === curUser) {
              isOwnerSetter(true)
            }
          })
        })
      })
    } catch (err){
      alert(err)
    }
  }, [])

  const submitFriends = async (string) => {
    try {
    const str = string.split(',').map(name => {return name.trim()})
    const ans = await axios.post('/api/addfriends', {friends: str, id: _id, name: calendarName}) 
    } catch (err){
      alert(err)
    }
  }

  const putOnGoogleCal = (d, t) => {
    const date = new Date()
    const dateToSet = new Date().getDay()
    let dist = dayConverter(d) - dateToSet
    if (dist < 0) {
      dist = dist + 7
    }
    date.setDate(date.getDate() + dist)
    const newDate = new Date(date)
    const newNewDate = new Date (new Date(new Date(newDate.setHours(t)).setMinutes(0)).setSeconds(0,0))
    const a = new Date(newNewDate)
    const endDate = new Date(a.setHours(a.getHours() + 1))
    const newNewDateISO = newNewDate.toISOString()
    const endDateISO = endDate.toISOString()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let emailsArray = []
    emails.map(email => emailsArray.push({'email': email}))
    gapi.load('client:auth2', () => {
      console.log('loaded client')
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }) 
      gapi.client.load('calendar', 'v3', () =>  console.log('bam!'))
      gapi.auth2.getAuthInstance().signIn().then(() => {
        var event = {
          'summary': calendarName,
          'start': {
            'dateTime': newNewDateISO,
            'timeZone': timezone
          },
          'end': {
            'dateTime': endDateISO,
            'timeZone': timezone
          },
          'recurrence': [
            'RRULE:FREQ=WEEKLY;COUNT=52'
          ],
          'attendees': emailsArray,
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }
        const request = gapi.client.calendar.events.insert({
          'calendarId':'primary',
          'resource':event
        })
        request.execute(event => {
          window.open(event.htmlLink)
        })
      })
    })
  }

return (
  <>
    <h1>{calendarName}</h1>
    {(!submitted) ?
      <>
        <table>
          <thead>
            <tr>
              {days.map(day => {
                return <th key = {counter++}>{day}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {times.map(time => { 
              return<tr key = {counter++}>{days.map(day => {
                const newTime =  day+time + ""
                return <td className = 'time' id = {newTime} key = {counter++} iscolored = 'false' onClick = {e => {
                  if(e.target.attributes[2].value == 'true') {
                    document.getElementById(newTime).style.color = "black"
                    e.target.attributes[2].value='false'
                  } else {
                    document.getElementById(newTime).style.color = "green"
                    e.target.attributes[2].value='true'
                  }
                  if(newTime in timesChosen){
                    delete timesChosen[newTime]
                  } else {
                    timesChosen[newTime] = newTime
                  }   
                }}>{timeConverter(parseInt(time))}</td>
              })}</tr>
            })}
          </tbody>
        </table>
        <button onClick ={() => {
          submittedSetter(true)
          const timesArray = Object.values(timesChosen)
          submitTimes(timesArray)
        }}>submit times</button>
      </>: <> <p>Thank you for submitting!</p></>}
      <div>
        {(isOwner) ? 
          <>
            <button type="submit" id="addQuestionBtn" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#QuestionModal">Invite Friends</button>
            <button onClick = {() => getBestTime()}>Finalize Time</button>
            {finalizedTimes.map(arr => {
              const regex = /(\w+?)(\d+)/
              const array = arr[0].match(regex)
              return <div className = 'finaltimes'onClick = {() => putOnGoogleCal(array[1], array[2])} key = {counter++}>{array[1] + ' at ' + timeConverter(array[2]) + ': '+arr[1] + ' can make it'}</div>
            })}
          </>:''}
      </div>
      <div className="modal" tabIndex="-1" id="QuestionModal" aria-labelledby="QuestionLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="QuestionLabel">Add your Friends' usernames, separated by commas</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => inviteFriendsSetter('')} />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <textarea
                  value={inviteFriends}
                  className="form-control"
                  onChange={e => {
                    inviteFriendsSetter(e.target.value)
                }}/>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-info"
                data-bs-dismiss="modal"
                onClick={() => {
                  submitFriends(inviteFriends)
                  inviteFriendsSetter('')
              }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    <button onClick = {() => history.push('/')}>Home Page</button>
  </>
)

}

export default Calendar