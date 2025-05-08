"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ExamTimerProps {
  examId: string
  examPhase: "reading" | "listening" | "finished"
  initialTime: number // Initial time in seconds
  onTimeUp: () => void
}

const ExamTimer: React.FC<ExamTimerProps> = ({ examId, examPhase, initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedStartTime = localStorage.getItem(`exam-${examId}-${examPhase}-startTime`)
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10)
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const remaining = initialTime - elapsedSeconds
      console.log(
        `Timer for exam ${examId}, phase ${examPhase}: ` +
        `StartTime=${startTime}, Elapsed=${elapsedSeconds}, Remaining=${remaining}`
      )
      return remaining > 0 ? remaining : 0
    }
    console.log(
      `Timer for exam ${examId}, phase ${examPhase}: ` +
      `No saved start time, using initial time=${initialTime}`
    )
    return initialTime
  })

  useEffect(() => {
    if (examPhase === "finished" || timeLeft <= 0) {
      if (timeLeft <= 0) {
        console.log(`Timer for exam ${examId}, phase ${examPhase}: Time is up`)
        onTimeUp()
      }
      return
    }

    const storageKey = `exam-${examId}-${examPhase}-startTime`
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, Date.now().toString())
      console.log(`Timer for exam ${examId}, phase ${examPhase}: Saved new start time=${Date.now()}`)
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          console.log(`Timer for exam ${examId}, phase ${examPhase}: Time is up`)
          onTimeUp()
          localStorage.removeItem(storageKey)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [examId, examPhase, initialTime, onTimeUp])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="text-gray-700 border-2 flex justify-center items-center p-2 rounded">
      {examPhase.charAt(0).toUpperCase() + examPhase.slice(1)} Time: {formatTime(timeLeft)}
    </div>
  )
}

export default ExamTimer