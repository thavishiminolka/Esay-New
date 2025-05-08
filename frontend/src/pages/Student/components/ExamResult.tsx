
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Question } from "../types/exam"

interface ExamResultProps {
  questions: Question[]
  userAnswers: { [key: string]: string }
  examId: string | null
}

const ExamResult: React.FC<ExamResultProps> = ({ questions, userAnswers }) => {
  const [activeTab, setActiveTab] = useState<"all" | "correct" | "incorrect">("all")
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (isPrinting) {
      const allIds = questions.map((q) => q._id!)
      setExpandedQuestions(new Set(allIds))
    }
  }, [isPrinting, questions])

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true)
    }

    const afterPrint = () => {
      setIsPrinting(false)
    }

    window.addEventListener("beforeprint", beforePrint)
    window.addEventListener("afterprint", afterPrint)

    return () => {
      window.removeEventListener("beforeprint", beforePrint)
      window.removeEventListener("afterprint", afterPrint)
    }
  }, [])

  const calculateScore = () => {
    let score = 0
    const marksPerQuestion = 5

    questions.forEach((question) => {
      const userAnswer = userAnswers[question._id!]
      const correctAnswer = question.answers.find((ans) => ans.isCorrect)
      const correctAnswerValue = correctAnswer ? (correctAnswer.text || correctAnswer.photo || "") : ""

      if (!userAnswer || !correctAnswerValue) {
        return
      }

      const normalizedUserAnswer = userAnswer.trim().toLowerCase()
      const normalizedCorrectAnswer = correctAnswerValue.trim().toLowerCase()

      if (normalizedUserAnswer === normalizedCorrectAnswer) {
        score += marksPerQuestion
      }
    })

    return score
  }

  const toggleQuestion = (questionId: string) => {
    const newExpandedQuestions = new Set(expandedQuestions)
    if (newExpandedQuestions.has(questionId)) {
      newExpandedQuestions.delete(questionId)
    } else {
      newExpandedQuestions.add(questionId)
    }
    setExpandedQuestions(newExpandedQuestions)
  }

  const expandAll = () => {
    const allIds = questions.map((q) => q._id!)
    setExpandedQuestions(new Set(allIds))
  }

  const collapseAll = () => {
    setExpandedQuestions(new Set())
  }

  const totalScore = calculateScore()
  const totalQuestions = questions.length
  const totalPossibleMarks = totalQuestions * 5
  const percentageScore = Math.round((totalScore / totalPossibleMarks) * 100)

  const correctQuestions = questions.filter((question) => {
    const userAnswer = userAnswers[question._id!]
    const correctAnswer = question.answers.find((ans) => ans.isCorrect)
    const correctAnswerValue = correctAnswer ? (correctAnswer.text || correctAnswer.photo || "") : ""

    if (!userAnswer || !correctAnswerValue) {
      return false
    }

    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = correctAnswerValue.trim().toLowerCase()
    return normalizedUserAnswer === normalizedCorrectAnswer
  })

  const incorrectQuestions = questions.filter((question) => {
    const userAnswer = userAnswers[question._id!]
    const correctAnswer = question.answers.find((ans) => ans.isCorrect)
    const correctAnswerValue = correctAnswer ? (correctAnswer.text || correctAnswer.photo || "") : ""

    if (!userAnswer || !correctAnswerValue) {
      return true
    }

    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = correctAnswerValue.trim().toLowerCase()
    return normalizedUserAnswer !== normalizedCorrectAnswer
  })

  let displayedQuestions = questions
  if (activeTab === "correct") {
    displayedQuestions = correctQuestions
  } else if (activeTab === "incorrect") {
    displayedQuestions = incorrectQuestions
  }

  if (isPrinting) {
    displayedQuestions = questions
  }

  let resultMessage = ""
  let resultColor = ""

  if (totalScore > 180) {
    resultMessage = "Congratulations!"
    resultColor = "text-green-600"
  } else if (totalScore > 150) {
    resultMessage = "Well done!"
    resultColor = "text-yellow-500"
  } else {
    resultMessage = "Try again"
    resultColor = "text-red-500"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" ref={printRef}>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .question-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          @page {
            margin: 0.5in;
            counter-increment: page;
            @bottom-right {
              content: "Page " counter(page) " of " counter(pages);
            }
          }
          
          .print-bg-green {
            background-color: #d1fae5 !important;
          }
          
          .print-bg-red {
            background-color: #fee2e2 !important;
          }
          
          .print-header {
            background: linear-gradient(to right, #3b82f6, #2563eb) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: white !important;
          }
          
          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>

      <div className="bg-gradient-to-b from-[#CCDEE4] to-[#488DB4] text-white p-8 text-center print-header">
        <h2 className="text-3xl text-custom-blue1 font-bold mb-2 ubuntu">Exam Results</h2>

        <div className="hidden print-only text-sm mb-2">
          Printed on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <div className="relative w-48 h-48 mb-4">
            <div className="w-full h-full rounded-full bg-custom-blue2 bg-opacity-30 flex items-center justify-center">
              <div className="text-6xl font-bold">{percentageScore}%</div>
            </div>
            <svg className="absolute top-0 left-0" width="192" height="192" viewBox="0 0 192 192">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#ccc"
                strokeWidth="12"
                strokeDasharray="553"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="white"
                strokeWidth="12"
                strokeDasharray="553"
                strokeDashoffset={553 - (553 * percentageScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 96 96)"
              />
            </svg>
          </div>

          <div className="text-2xl font-bold mb-1">
            {totalScore} / {totalPossibleMarks} marks
          </div>
          <div className={`text-xl font-semibold ${resultColor} bg-white px-4 py-1 rounded-full`}>{resultMessage}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6 no-print">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "all" ? "bg-custom-blue2 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setActiveTab("correct")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "correct" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Correct ({correctQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab("incorrect")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "incorrect" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Incorrect ({incorrectQuestions.length})
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="hidden print-only mb-4">
          <h3 className="text-xl font-bold">Question Review</h3>
        </div>

        <div className="space-y-4">
          {displayedQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 no-print">No questions to display in this category</div>
          ) : (
            displayedQuestions.map((question) => {
              const userAnswer = userAnswers[question._id!]
              const correctAnswer = question.answers.find((ans) => ans.isCorrect)
              const correctAnswerValue = correctAnswer ? (correctAnswer.text || correctAnswer.photo || "") : ""
              const isCorrect = userAnswer && correctAnswerValue
                ? userAnswer.trim().toLowerCase() === correctAnswerValue.trim().toLowerCase()
                : false
              const isExpanded = expandedQuestions.has(question._id!) || isPrinting

              return (
                <div
                  key={question._id}
                  className={`border rounded-lg overflow-hidden question-item ${
                    isCorrect ? "border-green-200 print-bg-green" : "border-red-200 print-bg-red"
                  }`}
                >
                  <div
                    className={`p-4 flex justify-between items-center cursor-pointer ${
                      isCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                    onClick={() => toggleQuestion(question._id!)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        Question {question.questionNumber} ({question.type === "reading" ? "Reading" : "Listening"}):{" "}
                        {question.questionText || "Image-based question"}
                      </h3>
                    </div>
                    <div className="text-gray-500 no-print">{isExpanded ? "▲" : "▼"}</div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      {question.questionPhoto && (
                        <div className="mb-3">
                          <img
                            src={`${apiUrl}${question.questionPhoto}`}
                            alt={`Question ${question.questionNumber} image`}
                            className="max-w-full h-auto rounded-md border border-gray-200"
                            onError={(e) => console.error("Error loading question image:", e)}
                          />
                        </div>
                      )}
                      {question.questionText && (
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">Question: </span>
                          <span className="text-gray-800">{question.questionText}</span>
                        </div>
                      )}
                      <div className="mb-3">
                        <span className="font-medium text-gray-700">Your answer: </span>
                        <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswer || "No answer provided"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">Correct answer: </span>
                          <span className="text-green-600">{correctAnswerValue || "Not specified"}</span>
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="font-medium text-gray-700 mb-2">All options:</div>
                        <ul className="space-y-2">
                          {question.answers.map((answer, index) => {
                            const answerValue = answer.text || answer.photo || `Answer ${index + 1}`
                            const isUserAnswer = userAnswer && answerValue
                              ? userAnswer.trim().toLowerCase() === answerValue.trim().toLowerCase()
                              : false
                            return (
                              <li
                                key={answer._id || index}
                                className={`p-2 rounded flex items-center gap-2 ${
                                  answer.isCorrect
                                    ? "bg-green-100 border-l-4 border-green-500"
                                    : isUserAnswer
                                      ? "bg-red-100 border-l-4 border-red-500"
                                      : "bg-gray-50"
                                }`}
                              >
                                {answer.isCorrect && <span className="text-green-600 mr-2">✓</span>}
                                {isUserAnswer && !answer.isCorrect && <span className="text-red-600 mr-2">✗</span>}
                                {answer.photo ? (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={`${apiUrl}${answer.photo}`}
                                      alt={`Answer ${index + 1}`}
                                      className="h-16 w-16 object-cover rounded-md border border-gray-200"
                                      onError={(e) => console.error("Error loading answer image:", e)}
                                    />
                                    {answer.text && <span className="text-gray-700">{answer.text}</span>}
                                  </div>
                                ) : (
                                  <span className="text-gray-700">{answer.text}</span>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ExamResult