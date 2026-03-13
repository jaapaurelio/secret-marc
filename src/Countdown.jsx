import { useEffect, useState } from 'react'
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
    <main className="page countdown-page" aria-label="Countdown page">
      <section className="countdown-shell">
        <img className="countdown-marc" src={marcImage} alt="" aria-hidden="true" />
        <p className="countdown-message">Be at this location.</p>
        <p className="countdown-riddle">
          Where Mass Ave hums, the Red Line runs below, and Cambridge gathers in
          the middle.
        </p>
        <div className="countdown-readout" aria-live="polite">
          <span>{formatUnit(timeLeft.hours)} hours</span>
          <span>{formatUnit(timeLeft.minutes)} min</span>
          <span>{formatUnit(timeLeft.seconds)} sec</span>
        </div>
        {timeLeft.isComplete && <p className="countdown-finished">Time.</p>}
      </section>
    </main>
  )
}

export default Countdown
