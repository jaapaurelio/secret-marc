import { useEffect, useState } from 'react'
import DestinationCard from './DestinationCard.jsx'
import marcImage from './assets/marc.png'

const TARGET_DATE = new Date('2026-03-13T19:00:00-04:00')

function getTimeLeft() {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: totalSeconds === 0,
  }
}

function formatUnit(value) {
  return String(value).padStart(2, '0')
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <DestinationCard
      image={marcImage}
      message="Be at this location."
      body="Where Mass Ave hums, the Red Line runs below, and Cambridge gathers in the middle."
      countdown={{
        hours: formatUnit(timeLeft.hours),
        minutes: formatUnit(timeLeft.minutes),
        seconds: formatUnit(timeLeft.seconds),
      }}
      isComplete={timeLeft.isComplete}
    />
  )
}

export default Countdown
