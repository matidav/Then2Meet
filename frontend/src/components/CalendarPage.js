import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CalendarPage = () => {
    return(
        <>
        <Calendar />
        <button>Submit Times</button>
        </>
    )

}


export default CalendarPage