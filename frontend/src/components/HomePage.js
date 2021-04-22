/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-alert */
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const HomePage = () => {
  let keyCounter = 0
  const [loggedIn, toggleLoggedIn] = useState(false)
  const [questions, setQuestions] = useState([])
  const [showQuestion, toggleShowQuestion] = useState(false)
  const [currentQuestion, currentQuestionSetter] = useState('')
  const [currentAuthor, currentAuthorSetter] = useState('')
  const [currentAnswer, currentAnswerSetter] = useState('')
  const [currentQuestionID, currentQuestionIDSetter] = useState('')
  const [username, setUsername] = useState('')
  const [answer, setAnswer] = useState('')
  const [questionText, setQuestionText] = useState('')
  const history = useHistory()

  const answerQuestion = async () => {
    try {
      const res = await axios.post('/question/answer', { answer, _id: currentQuestionID })
      history.push('/')
    } catch (err) {
      alert(err.message)
    }
  }

  const submitQuestion = async () => {
    try {
      const res = await axios.post('/question/add', { questionText })
    } catch (err) {
      alert(err.message)
    }
  }

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

  useEffect(() => {
    const intervalID = setInterval(async () => {
      try {
        const res = await axios.get('/question')
        setQuestions(res.data)
      } catch (err) {
        alert(err)
      }
    }, 2000)
    return () => clearInterval(intervalID)
  }, [])

  useEffect(async () => {
    try {
      const userIn = await axios.get('/account/loggedin')
      if (userIn.data.loggedin === true) {
        toggleLoggedIn(true)
        setUsername(` Welcome back ${userIn.data.username}`)
      }
    } catch (err) {
      alert(err)
    }
  }, [])

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col" id="first-col">
            { (loggedIn)
              ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      logOut()
                    }}
                  >
                    Logout
                  </button>
                  {username}
                </>
              )
              : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => history.push('/login')}
                  >
                    {' '}
                    Login
                  </button>
                </>
              )}
            {questions.map(q => (
              <div
                className="question"
                id={keyCounter++}
                key={keyCounter}
                onClick={e => {
                  const allQuestions = document.getElementsByClassName('question')
                  for (let i = 0; i < allQuestions.length; i++) {
                    allQuestions[i].style.background = 'white'
                    allQuestions[i].style.color = 'black'
                  }
                  const tar = document.getElementById(e.target.id)
                  tar.style.background = 'green'
                  tar.style.color = 'white'
                  currentQuestionSetter(q.questionText)
                  currentAuthorSetter(q.author)
                  currentAnswerSetter(q.answer)
                  currentQuestionIDSetter(q._id)
                  toggleShowQuestion(true)
                }}
              >
                {q.questionText}
              </div>
            ))}
            {(loggedIn)
              ? (
                <>
                  <button type="submit" id="addQuestionBtn" className="btn btn-info btn-lg" data-bs-toggle="modal" data-bs-target="#QuestionModal">Add Question</button>
                </>
              ) : ''}
            <div className="modal" tabIndex="-1" id="QuestionModal" aria-labelledby="QuestionLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="QuestionLabel">Add your Question here</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setQuestionText('')} />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <textarea
                        value={questionText}
                        className="form-control"
                        onChange={e => {
                          setQuestionText(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-info"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        submitQuestion()
                        setQuestionText('')
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col" id="second-col">
            {(showQuestion)
              ? (
                <div id="questionDisplay">
                  <h1>
                    Question:
                    {' '}
                    {currentQuestion}
                  </h1>
                  <h3>
                    By:
                    {' '}
                    {currentAuthor}
                  </h3>
                  <p>
                    Answer:
                    {' '}
                    {currentAnswer}
                  </p>
                  {(loggedIn)
                    ? (
                      <div className="mb-3">
                        <div className="form-label">Answer?</div>
                        <textarea value={answer} className="form-control" onChange={e => setAnswer(e.target.value)} />
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            currentAnswerSetter(answer)
                            setAnswer('')
                            answerQuestion()
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    ) : ''}
                </div>
              ) : ''}
          </div>
        </div>
      </div>
    </>

  )
}

export default HomePage
