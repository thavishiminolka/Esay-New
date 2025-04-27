// "use client"

// import type React from "react"
// import { useRef, useState, useEffect } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(() => {
//     const saved = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     return saved ? parseInt(saved, 10) : 0
//   })
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)

//   useEffect(() => {
//     if (examPhase === "listening" && question.type === "listening" && audioPlayCount < maxAudioPlays) {
//       const audio = audioRef.current
//       if (audio) {
//         audio
//           .play()
//           .then(() => {
//             console.log(`Audio play #${audioPlayCount + 1} started for question:`, question._id || questionIndex)
//           })
//           .catch((e) => console.error("Error auto-playing audio:", e))
//       }
//     }
//   }, [examPhase, question.type, audioPlayCount, maxAudioPlays, question._id, questionIndex])

//   useEffect(() => {
//     if (answeringTime) {
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question")
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete])

//   const handlePlay = () => {
//     if (question.type === "listening" && audioPlayCount < maxAudioPlays) {
//       setAudioPlayCount((prev) => {
//         const newCount = prev + 1
//         localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//         console.log(`Audio play #${newCount} initiated for question:`, question._id || questionIndex)
//         if (newCount >= maxAudioPlays) {
//           setAnsweringTime(true)
//         }
//         return newCount
//       })
//       setIsPlaying(true)
//     }
//   }

//   const handleEnded = () => {
//     console.log("Audio finished playing for question:", question._id || questionIndex)
//     setIsPlaying(false)
//     if (audioRef.current && audioPlayCount < maxAudioPlays - 1) {
//       audioRef.current.currentTime = 0
//       audioRef.current
//         .play()
//         .then(() => {
//           console.log(`Audio replay #${audioPlayCount + 2} started for question:`, question._id || questionIndex)
//         })
//         .catch((e) => console.error("Error replaying audio:", e))
//     }
//   }

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4">
//           <audio
//             ref={audioRef}
//             src={audioPlayCount < maxAudioPlays ? `http://localhost:5000${question.audio}` : ""}
//             style={{ display: "none" }}
//             onError={(e) => console.error("Error playing audio:", e)}
//             onPlay={handlePlay}
//             onEnded={handleEnded}
//           />
//           {isPlaying && audioPlayCount < maxAudioPlays && (
//             <p className="text-gray-600 text-sm mt-1">Playing audio…</p>
//           )}
//           {answeringTime && (
//             <p className="text-yellow-600 text-sm mt-1">Please answer the question (5 seconds remaining).</p>
//           )}
//           {audioPlayCount >= maxAudioPlays && !answeringTime && (
//             <p className="text-gray-600 text-sm mt-1">Audio plays completed. Please answer.</p>
//           )}
//         </div>
//       )}
//       {question.type === "reading" && examPhase === "reading" ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt="Question"
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : (
//         question.questionText &&
//         examPhase === "listening" && (
//           <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//         )
//       )}
//       <div className="space-y-3">
//         {question.answers.map((answer, index) => {
//           const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//           const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//           return (
//             <label
//               key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//               className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                 selectedAnswer === answerValue
//                   ? "bg-blue-50 border border-blue-200"
//                   : "hover:bg-gray-50 border border-transparent"
//               }`}
//               onClick={(e) => {
//                 e.preventDefault()
//                 onAnswer(answerValue)
//               }}
//             >
//               <input
//                 type="radio"
//                 name={radioGroupName}
//                 value={answerValue}
//                 checked={selectedAnswer === answerValue}
//                 onChange={() => onAnswer(answerValue)}
//                 className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//               />
//               {answer.photo ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700 font-medium">{index + 1}.</span>
//                   <img
//                     src={`http://localhost:5000${answer.photo}`}
//                     alt={`Answer ${index + 1}`}
//                     className="h-16 w-16 object-cover rounded-md border border-gray-200"
//                     onError={(e) => console.error("Error loading answer image:", e)}
//                   />
//                   {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                 </div>
//               ) : (
//                 <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                   {index + 1}. {answer.text}
//                 </span>
//               )}
//             </label>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ExamQuestion







// "use client"

// import type React from "react"
// import { useRef, useState, useEffect } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(() => {
//     const saved = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     return saved ? parseInt(saved, 10) : 0
//   })
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)

//   useEffect(() => {
//     if (examPhase === "listening" && question.type === "listening" && audioPlayCount < maxAudioPlays) {
//       const audio = audioRef.current
//       if (audio && audio.src) {
//         audio
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             console.log(`Audio play #${audioPlayCount + 1} started for question:`, question._id || questionIndex)
//             setAudioPlayCount((prev) => {
//               const newCount = prev + 1
//               localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//               return newCount
//             })
//           })
//           .catch((e) => console.error("Error auto-playing audio:", e))
//       }
//     }
//   }, [examPhase, question.type, audioPlayCount, maxAudioPlays, question._id, questionIndex])

//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleEnded = () => {
//         console.log("Audio finished playing for question:", question._id || questionIndex)
//         setIsPlaying(false)
//         if (audioPlayCount < maxAudioPlays - 1) {
//           audio.currentTime = 0
//           audio
//             .play()
//             .then(() => {
//               setIsPlaying(true)
//               console.log(`Audio play #${audioPlayCount + 2} started for question:`, question._id || questionIndex)
//               setAudioPlayCount((prev) => {
//                 const newCount = prev + 1
//                 localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//                 return newCount
//               })
//             })
//             .catch((e) => console.error("Error replaying audio:", e))
//         } else if (audioPlayCount === maxAudioPlays - 1) {
//           setAnsweringTime(true)
//         }
//       }
//       audio.addEventListener("ended", handleEnded)
//       return () => {
//         audio.removeEventListener("ended", handleEnded)
//       }
//     }
//   }, [audioPlayCount, maxAudioPlays, question._id, questionIndex, examPhase, question.type])

//   useEffect(() => {
//     if (answeringTime) {
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question")
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete])

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4">
//           <audio
//             ref={audioRef}
//             src={audioPlayCount < maxAudioPlays ? `http://localhost:5000${question.audio}` : ""}
//             style={{ display: "none" }}
//             onError={(e) => console.error("Error loading audio:", e)}
//           />
//           {isPlaying && audioPlayCount < maxAudioPlays && (
//             <p className="text-gray-600 text-sm mt-1">Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…</p>
//           )}
//           {answeringTime && (
//             <p className="text-yellow-600 text-sm mt-1">Please answer the question (5 seconds remaining).</p>
//           )}
//           {audioPlayCount >= maxAudioPlays && !answeringTime && (
//             <p className="text-gray-600 text-sm mt-1">Audio plays completed. Please answer.</p>
//           )}
//         </div>
//       )}
//       {question.type === "reading" && examPhase === "reading" ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt="Question"
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : (
//         question.questionText &&
//         examPhase === "listening" && (
//           <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//         )
//       )}
//       <div className="space-y-3">
//         {question.answers.map((answer, index) => {
//           const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//           const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//           return (
//             <label
//               key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//               className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                 selectedAnswer === answerValue
//                   ? "bg-blue-50 border border-blue-200"
//                   : "hover:bg-gray-50 border border-transparent"
//               }`}
//               onClick={(e) => {
//                 e.preventDefault()
//                 onAnswer(answerValue)
//               }}
//             >
//               <input
//                 type="radio"
//                 name={radioGroupName}
//                 value={answerValue}
//                 checked={selectedAnswer === answerValue}
//                 onChange={() => onAnswer(answerValue)}
//                 className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//               />
//               {answer.photo ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700 font-medium">{index + 1}.</span>
//                   <img
//                     src={`http://localhost:5000${answer.photo}`}
//                     alt={`Answer ${index + 1}`}
//                     className="h-16 w-16 object-cover rounded-md border border-gray-200"
//                     onError={(e) => console.error("Error loading answer image:", e)}
//                   />
//                   {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                 </div>
//               ) : (
//                 <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                   {index + 1}. {answer.text}
//                 </span>
//               )}
//             </label>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ExamQuestion






// "use client"

// import type React from "react"
// import { useRef, useState, useEffect } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(0)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)

//   // Start audio playback for listening questions
//   useEffect(() => {
//     if (examPhase === "listening" && question.type === "listening" && audioPlayCount < maxAudioPlays && !isPlaying && !answeringTime) {
//       const audio = audioRef.current
//       if (audio && audio.src) {
//         audio.currentTime = 0 // Reset to start
//         audio
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             console.log(`Audio play #${audioPlayCount + 1} started for question:`, question._id || questionIndex)
//           })
//           .catch((e) => console.error("Error auto-playing audio:", e))
//       }
//     }
//   }, [audioPlayCount, examPhase, question.type, question._id, questionIndex, isPlaying, maxAudioPlays, answeringTime])

//   // Handle audio end event
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleEnded = () => {
//         setIsPlaying(false)
//         setAudioPlayCount((prev) => {
//           const newCount = prev + 1
//           console.log(`Audio play #${prev + 1} ended for question:`, question._id || questionIndex)
//           localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//           if (newCount >= maxAudioPlays) {
//             setAnsweringTime(true)
//           }
//           return newCount
//         })
//       }
//       audio.addEventListener("ended", handleEnded)
//       return () => {
//         audio.removeEventListener("ended", handleEnded)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex, maxAudioPlays])

//   // Handle 5-second answering period
//   useEffect(() => {
//     if (answeringTime) {
//       console.log("Starting 5-second answering period for question:", question._id || questionIndex)
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question:", question._id || questionIndex)
//         setAudioPlayCount(0) // Reset for next question
//         localStorage.removeItem(`question-${question._id || questionIndex}-playCount`)
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete, question._id, questionIndex])

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4">
//           <audio
//             ref={audioRef}
//             src={`http://localhost:5000${question.audio}`}
//             style={{ display: "none" }}
//             onError={(e) => console.error("Error loading audio:", e)}
//           />
//           {isPlaying && audioPlayCount < maxAudioPlays && (
//             <p className="text-gray-600 text-sm mt-1">Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…</p>
//           )}
//           {answeringTime && (
//             <p className="text-yellow-600 text-sm mt-1">Please answer the question (5 seconds remaining).</p>
//           )}
//           {audioPlayCount >= maxAudioPlays && !answeringTime && (
//             <p className="text-gray-600 text-sm mt-1">Audio plays completed. Please answer.</p>
//           )}
//         </div>
//       )}
//       {question.type === "reading" && examPhase === "reading" ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt="Question"
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : (
//         question.questionText &&
//         examPhase === "listening" && (
//           <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//         )
//       )}
//       <div className="space-y-3">
//         {question.answers.map((answer, index) => {
//           const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//           const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//           return (
//             <label
//               key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//               className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                 selectedAnswer === answerValue
//                   ? "bg-blue-50 border border-blue-200"
//                   : "hover:bg-gray-50 border border-transparent"
//               }`}
//               onClick={(e) => {
//                 e.preventDefault()
//                 onAnswer(answerValue)
//               }}
//             >
//               <input
//                 type="radio"
//                 name={radioGroupName}
//                 value={answerValue}
//                 checked={selectedAnswer === answerValue}
//                 onChange={() => onAnswer(answerValue)}
//                 className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//               />
//               {answer.photo ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700 font-medium">{index + 1}.</span>
//                   <img
//                     src={`http://localhost:5000${answer.photo}`}
//                     alt={`Answer ${index + 1}`}
//                     className="h-16 w-16 object-cover rounded-md border border-gray-200"
//                     onError={(e) => console.error("Error loading answer image:", e)}
//                   />
//                   {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                 </div>
//               ) : (
//                 <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                   {index + 1}. {answer.text}
//                 </span>
//               )}
//             </label>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ExamQuestion







// "use client"

// import type React from "react"
// import { useRef, useState, useEffect } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(0)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)

//   // Start audio playback for listening questions
//   useEffect(() => {
//     if (examPhase === "listening" && question.type === "listening" && audioPlayCount < maxAudioPlays && !isPlaying && !answeringTime) {
//       const audio = audioRef.current
//       if (audio && audio.src) {
//         audio.currentTime = 0 // Reset to start
//         audio
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             console.log(`Audio play #${audioPlayCount + 1} started for question:`, question._id || questionIndex)
//           })
//           .catch((e) => console.error("Error auto-playing audio:", e))
//       }
//     }
//   }, [audioPlayCount, examPhase, question.type, question._id, questionIndex, isPlaying, maxAudioPlays, answeringTime])

//   // Handle audio end event
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleEnded = () => {
//         setIsPlaying(false)
//         setAudioPlayCount((prev) => {
//           const newCount = prev + 1
//           console.log(`Audio play #${prev + 1} ended for question:`, question._id || questionIndex)
//           localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//           if (newCount >= maxAudioPlays) {
//             setAnsweringTime(true)
//           }
//           return newCount
//         })
//       }
//       audio.addEventListener("ended", handleEnded)
//       return () => {
//         audio.removeEventListener("ended", handleEnded)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex, maxAudioPlays])

//   // Handle 5-second answering period
//   useEffect(() => {
//     if (answeringTime) {
//       console.log("Starting 5-second answering period for question:", question._id || questionIndex)
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question:", question._id || questionIndex)
//         setAudioPlayCount(0) // Reset for next question
//         localStorage.removeItem(`question-${question._id || questionIndex}-playCount`)
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete, question._id, questionIndex])

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4">
//           <audio
//             ref={audioRef}
//             src={`http://localhost:5000${question.audio}`}
//             style={{ display: "none" }}
//             onError={(e) => console.error("Error loading audio:", e)}
//           />
//           {isPlaying && audioPlayCount < maxAudioPlays && (
//             <p className="text-gray-600 text-sm mt-1">Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…</p>
//           )}
//           {answeringTime && (
//             <p className="text-yellow-600 text-sm mt-1">Please answer the question (5 seconds remaining).</p>
//           )}
//           {audioPlayCount >= maxAudioPlays && !answeringTime && (
//             <p className="text-gray-600 text-sm mt-1">Audio plays completed. Please answer.</p>
//           )}
//         </div>
//       )}
//       {(question.type === "reading" && examPhase === "reading") || 
//        (question.type === "listening" && examPhase === "listening" && (answeringTime || audioPlayCount >= maxAudioPlays)) ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt="Question"
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : null}
//       <div className="space-y-3">
//         {question.answers.map((answer, index) => {
//           const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//           const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//           return (
//             <label
//               key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//               className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                 selectedAnswer === answerValue
//                   ? "bg-blue-50 border border-blue-200"
//                   : "hover:bg-gray-50 border border-transparent"
//               }`}
//               onClick={(e) => {
//                 e.preventDefault()
//                 onAnswer(answerValue)
//               }}
//             >
//               <input
//                 type="radio"
//                 name={radioGroupName}
//                 value={answerValue}
//                 checked={selectedAnswer === answerValue}
//                 onChange={() => onAnswer(answerValue)}
//                 className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//               />
//               {answer.photo ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700 font-medium">{index + 1}.</span>
//                   <img
//                     src={`http://localhost:5000${answer.photo}`}
//                     alt={`Answer ${index + 1}`}
//                     className="h-16 w-16 object-cover rounded-md border border-gray-200"
//                     onError={(e) => console.error("Error loading answer image:", e)}
//                   />
//                   {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                 </div>
//               ) : (
//                 <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                   {index + 1}. {answer.text}
//                 </span>
//               )}
//             </label>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ExamQuestion



// "use client"

// import type React from "react"
// import { useRef, useState, useEffect } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(() => {
//     const saved = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     return saved ? Number.parseInt(saved, 10) : 0
//   })
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)
//   const [audioError, setAudioError] = useState<string | null>(null)

//   // Initialize audio play count from localStorage
//   useEffect(() => {
//     const savedCount = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     if (savedCount) {
//       const count = Number.parseInt(savedCount, 10)
//       setAudioPlayCount(count)
//       if (count >= maxAudioPlays) {
//         setAnsweringTime(true)
//       }
//     }
//   }, [question._id, questionIndex, maxAudioPlays])

//   // Start audio playback for listening questions
//   useEffect(() => {
//     if (
//       examPhase === "listening" &&
//       question.type === "listening" &&
//       audioPlayCount < maxAudioPlays &&
//       !isPlaying &&
//       !answeringTime &&
//       !audioError
//     ) {
//       const audio = audioRef.current
//       if (audio && audio.src) {
//         audio.currentTime = 0 // Reset to start
//         audio
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             console.log(
//               `Audio play #${audioPlayCount + 1} started for question:`,
//               question._id || questionIndex,
//               `Audio src: ${audio.src}`
//             )
//           })
//           .catch((e) => {
//             console.error("Error auto-playing audio:", e)
//             setAudioError("Failed to play audio")
//             setAnsweringTime(true) // Allow answering if audio fails
//           })
//       } else {
//         console.error("Audio element or src not available for question:", question._id || questionIndex)
//         setAudioError("Audio file not available")
//         setAnsweringTime(true) // Allow answering if audio is missing
//       }
//     }
//   }, [audioPlayCount, examPhase, question.type, question._id, questionIndex, isPlaying, maxAudioPlays, answeringTime, audioError])

//   // Handle audio end event
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleEnded = () => {
//         setIsPlaying(false)
//         setAudioPlayCount((prev) => {
//           const newCount = prev + 1
//           console.log(
//             `Audio play #${prev + 1} ended for question:`,
//             question._id || questionIndex,
//             `New play count: ${newCount}`
//           )
//           localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//           if (newCount >= maxAudioPlays) {
//             setAnsweringTime(true)
//             console.log("Max audio plays reached, enabling answering time for question:", question._id || questionIndex)
//           }
//           return newCount
//         })
//       }
//       audio.addEventListener("ended", handleEnded)
//       return () => {
//         audio.removeEventListener("ended", handleEnded)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex, maxAudioPlays])

//   // Handle audio errors
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleError = () => {
//         console.error("Audio loading error for question:", question._id || questionIndex)
//         setAudioError("Audio file failed to load")
//         setAnsweringTime(true) // Allow answering on error
//       }
//       audio.addEventListener("error", handleError)
//       return () => {
//         audio.removeEventListener("error", handleError)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex])

//   // Handle 5-second answering period
//   useEffect(() => {
//     if (answeringTime) {
//       console.log("Starting 5-second answering period for question:", question._id || questionIndex)
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question:", question._id || questionIndex)
//         setAudioPlayCount(0) // Reset for next question
//         localStorage.removeItem(`question-${question._id || questionIndex}-playCount`)
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete, question._id, questionIndex])

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4">
//           <audio
//             ref={audioRef}
//             src={`http://localhost:5000${question.audio}`}
//             style={{ display: "none" }}
//             onError={(e) => console.error("Error loading audio:", e)}
//           />
//           {audioError && (
//             <p className="text-red-600 text-sm mt-1">{audioError}. Please select an answer.</p>
//           )}
//           {isPlaying && audioPlayCount < maxAudioPlays && !audioError && (
//             <p className="text-gray-600 text-sm mt-1">Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…</p>
//           )}
//           {answeringTime && !audioError && (
//             <p className="text-yellow-600 text-sm mt-1">Please answer the question (5 seconds remaining).</p>
//           )}
//           {audioPlayCount >= maxAudioPlays && !answeringTime && !audioError && (
//             <p className="text-gray-600 text-sm mt-1">Audio plays completed. Please answer.</p>
//           )}
//         </div>
//       )}
//       {(question.type === "reading" && examPhase === "reading") || 
//        (question.type === "listening" && examPhase === "listening") ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt={`Question ${question.questionNumber || questionIndex + 1} image`}
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : null}
//       {(question.type === "reading" && examPhase === "reading") || 
//        (question.type === "listening" && examPhase === "listening") ? (
//         <div className="space-y-3">
//           {question.answers.map((answer, index) => {
//             const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//             const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//             return (
//               <label
//                 key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//                 className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                   selectedAnswer === answerValue
//                     ? "bg-blue-50 border border-blue-200"
//                     : "hover:bg-gray-50 border border-transparent"
//                 }`}
//                 onClick={(e) => {
//                   e.preventDefault()
//                   onAnswer(answerValue)
//                 }}
//               >
//                 <input
//                   type="radio"
//                   name={radioGroupName}
//                   value={answerValue}
//                   checked={selectedAnswer === answerValue}
//                   onChange={() => onAnswer(answerValue)}
//                   className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//                 />
//                 {answer.photo ? (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-700 font-medium">{index + 1}.</span>
//                     <img
//                       src={`http://localhost:5000${answer.photo}`}
//                       alt={`Answer ${index + 1} image`}
//                       className="h-16 w-16 object-cover rounded-md border border-gray-200"
//                       onError={(e) => console.error("Error loading answer image:", e)}
//                     />
//                     {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                   </div>
//                 ) : (
//                   <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                     {index + 1}. {answer.text}
//                   </span>
//                 )}
//               </label>
//             )
//           })}
//         </div>
//       ) : null}
//     </div>
//   )
// }

// export default ExamQuestion



















// "use client"

// import type React from "react"
// import { useRef, useState, useEffect, memo } from "react"
// import type { Question } from "../types/exam"

// interface ExamQuestionProps {
//   question: Question
//   onAnswer: (answer: string) => void
//   selectedAnswer: string | null
//   questionIndex: number
//   onAudioComplete: () => void
//   maxAudioPlays: number
//   examPhase: "reading" | "listening" | "finished"
// }

// const ExamQuestion: React.FC<ExamQuestionProps> = ({
//   question,
//   onAnswer,
//   selectedAnswer,
//   questionIndex,
//   onAudioComplete,
//   maxAudioPlays,
//   examPhase,
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [audioPlayCount, setAudioPlayCount] = useState(() => {
//     const saved = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     return saved ? Number.parseInt(saved, 10) : 0
//   })
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [answeringTime, setAnsweringTime] = useState(false)
//   const [audioError, setAudioError] = useState<string | null>(null)

//   // Debug re-renders and prop changes
//   useEffect(() => {
//     console.log("ExamQuestion re-rendered:", {
//       questionId: question._id || questionIndex,
//       audioPlayCount,
//       isPlaying,
//       answeringTime,
//       audioError,
//       examPhase,
//       selectedAnswer,
//     })
//   })

//   // Log prop changes
//   useEffect(() => {
//     console.log("ExamQuestion props changed:", {
//       questionId: question._id || questionIndex,
//       questionIndex,
//       examPhase,
//     })
//   }, [question._id, questionIndex, examPhase])

//   // Initialize audio play count from localStorage
//   useEffect(() => {
//     const savedCount = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
//     if (savedCount) {
//       const count = Number.parseInt(savedCount, 10)
//       setAudioPlayCount(count)
//       if (count >= maxAudioPlays) {
//         setAnsweringTime(true)
//       }
//     }
//   }, [question._id, questionIndex, maxAudioPlays])

//   // Preload audio to avoid resets
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening" && !audio.src) {
//       audio.src = `http://localhost:5000${question.audio}`
//       audio.load()
//       console.log("Audio preloaded for question:", question._id || questionIndex)
//     }
//   }, [examPhase, question.type, question._id, questionIndex, question.audio])

//   // Start audio playback for listening questions
//   useEffect(() => {
//     if (
//       examPhase === "listening" &&
//       question.type === "listening" &&
//       audioPlayCount < maxAudioPlays &&
//       !isPlaying &&
//       !answeringTime &&
//       !audioError
//     ) {
//       const audio = audioRef.current
//       if (audio) {
//         audio.currentTime = 0 // Reset to start
//         audio
//           .play()
//           .then(() => {
//             setIsPlaying(true)
//             console.log(
//               `Audio play #${audioPlayCount + 1} started for question:`,
//               question._id || questionIndex,
//               `Audio src: ${audio.src}`
//             )
//           })
//           .catch((e) => {
//             console.error("Error auto-playing audio:", e)
//             setAudioError("Failed to play audio")
//             setAnsweringTime(true) // Allow answering if audio fails
//           })
//       } else {
//         console.error("Audio element not available for question:", question._id || questionIndex)
//         setAudioError("Audio file not available")
//         setAnsweringTime(true) // Allow answering if audio is missing
//       }
//     }
//   }, [audioPlayCount, examPhase, question.type, question._id, questionIndex, isPlaying, maxAudioPlays, answeringTime, audioError])

//   // Handle audio end event with combined state update
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleEnded = () => {
//         // Combine state updates to reduce re-renders
//         setAudioPlayCount((prev) => {
//           const newCount = prev + 1
//           console.log(
//             `Audio play #${prev + 1} ended for question:`,
//             question._id || questionIndex,
//             `New play count: ${newCount}`
//           )
//           localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
//           if (newCount >= maxAudioPlays) {
//             setAnsweringTime(true)
//             setIsPlaying(false)
//             console.log("Max audio plays reached, enabling answering time for question:", question._id || questionIndex)
//           } else {
//             setIsPlaying(false)
//           }
//           return newCount
//         })
//       }
//       audio.addEventListener("ended", handleEnded)
//       return () => {
//         audio.removeEventListener("ended", handleEnded)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex, maxAudioPlays])

//   // Handle audio errors
//   useEffect(() => {
//     const audio = audioRef.current
//     if (audio && examPhase === "listening" && question.type === "listening") {
//       const handleError = () => {
//         console.error("Audio loading error for question:", question._id || questionIndex)
//         setAudioError("Audio file failed to load")
//         setAnsweringTime(true) // Allow answering on error
//       }
//       audio.addEventListener("error", handleError)
//       return () => {
//         audio.removeEventListener("error", handleError)
//       }
//     }
//   }, [examPhase, question.type, question._id, questionIndex])

//   // Handle 5-second answering period
//   useEffect(() => {
//     if (answeringTime) {
//       console.log("Starting 5-second answering period for question:", question._id || questionIndex)
//       const timer = setTimeout(() => {
//         setAnsweringTime(false)
//         console.log("5-second answering period ended, navigating to next question:", question._id || questionIndex)
//         setAudioPlayCount(0) // Reset for next question
//         localStorage.removeItem(`question-${question._id || questionIndex}-playCount`)
//         onAudioComplete()
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [answeringTime, onAudioComplete, question._id, questionIndex])

//   const radioGroupName = `question-${question._id || `q${questionIndex}`}`

//   // Compute status message with fixed height
//   const getStatusMessage = () => {
//     if (audioError) {
//       return <p className="text-red-600 text-sm mt-1 min-h-[24px]">{audioError}. Please select an answer.</p>
//     }
//     if (isPlaying && audioPlayCount < maxAudioPlays) {
//       return (
//         <p className="text-gray-600 text-sm mt-1 min-h-[24px]">
//           Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…
//         </p>
//       )
//     }
//     if (answeringTime) {
//       return <p className="text-yellow-600 text-sm mt-1 min-h-[24px]">Please answer the question (5 seconds remaining).</p>
//     }
//     if (audioPlayCount >= maxAudioPlays && !answeringTime) {
//       return <p className="text-gray-600 text-sm mt-1 min-h-[24px]">Audio plays completed. Please answer.</p>
//     }
//     return <p className="text-gray-600 text-sm mt-1 min-h-[24px]"></p> // Placeholder for consistent height
//   }

//   return (
//     <div className="space-y-4">
//       {question.type === "listening" && question.audio && examPhase === "listening" && (
//         <div className="mb-4 min-h-[48px]" aria-live="polite">
//           <audio ref={audioRef} style={{ display: "none" }} />
//           {getStatusMessage()}
//         </div>
//       )}
//       {(question.type === "reading" && examPhase === "reading") || 
//        (question.type === "listening" && examPhase === "listening") ? (
//         <div className="mb-4">
//           {question.questionPhoto && (
//             <img
//               src={`http://localhost:5000${question.questionPhoto}`}
//               alt={`Question ${question.questionNumber || questionIndex + 1} image`}
//               className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
//               loading="lazy"
//               onError={(e) => console.error("Error loading question image:", e)}
//             />
//           )}
//           {question.questionText && (
//             <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
//           )}
//         </div>
//       ) : null}
//       {(question.type === "reading" && examPhase === "reading") || 
//        (question.type === "listening" && examPhase === "listening") ? (
//         <div className="space-y-3">
//           {question.answers.map((answer, index) => {
//             const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
//             const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

//             return (
//               <label
//                 key={`${question._id || questionIndex}-${uniqueAnswerId}`}
//                 className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
//                   selectedAnswer === answerValue
//                     ? "bg-blue-50 border border-blue-200"
//                     : "hover:bg-gray-50 border border-transparent"
//                 }`}
//                 onClick={(e) => {
//                   e.preventDefault()
//                   onAnswer(answerValue)
//                 }}
//               >
//                 <input
//                   type="radio"
//                   name={radioGroupName}
//                   value={answerValue}
//                   checked={selectedAnswer === answerValue}
//                   onChange={() => onAnswer(answerValue)}
//                   className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
//                 />
//                 {answer.photo ? (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-700 font-medium">{index + 1}.</span>
//                     <img
//                       src={`http://localhost:5000${answer.photo}`}
//                       alt={`Answer ${index + 1} image`}
//                       className="h-30 w-30 object-cover rounded-md border border-gray-200"
//                       loading="lazy"
//                       onError={(e) => console.error("Error loading answer image:", e)}
//                     />
//                     {answer.text && <span className="text-gray-700">{answer.text}</span>}
//                   </div>
//                 ) : (
//                   <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
//                     {index + 1}. {answer.text}
//                   </span>
//                 )}
//               </label>
//             )
//           })}
//         </div>
//       ) : null}
//     </div>
//   )
// }

// export default memo(ExamQuestion)











"use client"

import type React from "react"
import { useRef, useState, useEffect, memo } from "react"
import type { Question } from "../types/exam"

interface ExamQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  selectedAnswer: string | null
  questionIndex: number
  onAudioComplete: () => void
  maxAudioPlays: number
  examPhase: "reading" | "listening" | "finished"
}

const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  questionIndex,
  onAudioComplete,
  maxAudioPlays,
  examPhase,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioPlayCount, setAudioPlayCount] = useState(() => {
    const saved = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
    return saved ? Number.parseInt(saved, 10) : 0
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [answeringTime, setAnsweringTime] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Debug re-renders and prop changes
  useEffect(() => {
    console.log("ExamQuestion re-rendered:", {
      questionId: question._id || questionIndex,
      audioPlayCount,
      isPlaying,
      answeringTime,
      audioError,
      examPhase,
      selectedAnswer,
    })
  })

  // Log prop changes
  useEffect(() => {
    console.log("ExamQuestion props changed:", {
      questionId: question._id || questionIndex,
      questionIndex,
      examPhase,
    })
  }, [question._id, questionIndex, examPhase])

  // Initialize audio play count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem(`question-${question._id || questionIndex}-playCount`)
    if (savedCount) {
      const count = Number.parseInt(savedCount, 10)
      setAudioPlayCount(count)
      if (count >= maxAudioPlays) {
        setAnsweringTime(true)
      }
    }
  }, [question._id, questionIndex, maxAudioPlays])

  // Preload audio to avoid resets
  useEffect(() => {
    const audio = audioRef.current
    if (audio && examPhase === "listening" && question.type === "listening" && !audio.src) {
      audio.src = `http://localhost:5000${question.audio}`
      audio.load()
      console.log("Audio preloaded for question:", question._id || questionIndex)
    }
  }, [examPhase, question.type, question._id, questionIndex, question.audio])

  // Start audio playback for listening questions
  useEffect(() => {
    if (
      examPhase === "listening" &&
      question.type === "listening" &&
      audioPlayCount < maxAudioPlays &&
      !isPlaying &&
      !answeringTime &&
      !audioError
    ) {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0 // Reset to start
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
            console.log(
              `Audio play #${audioPlayCount + 1} started for question:`,
              question._id || questionIndex,
              `Audio src: ${audio.src}`
            )
          })
          .catch((e) => {
            console.error("Error auto-playing audio:", e)
            setAudioError("Failed to play audio")
            setAnsweringTime(true) // Allow answering if audio fails
          })
      } else {
        console.error("Audio element not available for question:", question._id || questionIndex)
        setAudioError("Audio file not available")
        setAnsweringTime(true) // Allow answering if audio is missing
      }
    }
  }, [audioPlayCount, examPhase, question.type, question._id, questionIndex, isPlaying, maxAudioPlays, answeringTime, audioError])

  // Handle audio end event with combined state update
  useEffect(() => {
    const audio = audioRef.current
    if (audio && examPhase === "listening" && question.type === "listening") {
      const handleEnded = () => {
        // Combine state updates to reduce re-renders
        setAudioPlayCount((prev) => {
          const newCount = prev + 1
          console.log(
            `Audio play #${prev + 1} ended for question:`,
            question._id || questionIndex,
            `New play count: ${newCount}`
          )
          localStorage.setItem(`question-${question._id || questionIndex}-playCount`, newCount.toString())
          if (newCount >= maxAudioPlays) {
            setAnsweringTime(true)
            setIsPlaying(false)
            console.log("Max audio plays reached, enabling answering time for question:", question._id || questionIndex)
          } else {
            setIsPlaying(false)
          }
          return newCount
        })
      }
      audio.addEventListener("ended", handleEnded)
      return () => {
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [examPhase, question.type, question._id, questionIndex, maxAudioPlays])

  // Handle audio errors
  useEffect(() => {
    const audio = audioRef.current
    if (audio && examPhase === "listening" && question.type === "listening") {
      const handleError = () => {
        console.error("Audio loading error for question:", question._id || questionIndex)
        setAudioError("Audio file failed to load")
        setAnsweringTime(true) // Allow answering on error
      }
      audio.addEventListener("error", handleError)
      return () => {
        audio.removeEventListener("error", handleError)
      }
    }
  }, [examPhase, question.type, question._id, questionIndex])

  // Handle 5-second answering period
  useEffect(() => {
    if (answeringTime) {
      console.log("Starting 5-second answering period for question:", question._id || questionIndex)
      const timer = setTimeout(() => {
        try {
          setAnsweringTime(false)
          console.log("5-second answering period ended, navigating to next question:", question._id || questionIndex)
          setAudioPlayCount(0) // Reset for next question
          localStorage.removeItem(`question-${question._id || questionIndex}-playCount`)
          onAudioComplete()
        } catch (error) {
          console.error("Error during answering period completion for question:", question._id || questionIndex, error)
        }
      }, 5000)
      return () => {
        console.log("Clearing answering timer for question:", question._id || questionIndex)
        clearTimeout(timer)
      }
    }
  }, [answeringTime, onAudioComplete, question._id, questionIndex])

  const radioGroupName = `question-${question._id || `q${questionIndex}`}`

  // Compute status message with fixed height
  const getStatusMessage = () => {
    if (audioError) {
      return <p className="text-red-600 text-sm mt-1 min-h-[24px]">{audioError}. Please select an answer.</p>
    }
    if (isPlaying && audioPlayCount < maxAudioPlays) {
      return (
        <p className="text-gray-600 text-sm mt-1 min-h-[24px]">
          Playing audio (Play {audioPlayCount + 1} of {maxAudioPlays})…
        </p>
      )
    }
    if (answeringTime) {
      return <p className="text-yellow-600 text-sm mt-1 min-h-[24px]">Please answer the question (5 seconds remaining).</p>
    }
    if (audioPlayCount >= maxAudioPlays && !answeringTime) {
      return <p className="text-gray-600 text-sm mt-1 min-h-[24px]">Audio plays completed. Please answer.</p>
    }
    return <p className="text-gray-600 text-sm mt-1 min-h-[24px]"></p> // Placeholder for consistent height
  }

  return (
    <div className="space-y-4">
      {question.type === "listening" && question.audio && examPhase === "listening" && (
        <div className="mb-4 min-h-[48px]" aria-live="polite">
          <audio ref={audioRef} style={{ display: "none" }} />
          {getStatusMessage()}
        </div>
      )}
      {(question.type === "reading" && examPhase === "reading") || 
       (question.type === "listening" && examPhase === "listening") ? (
        <div className="mb-4">
          {question.questionPhoto && (
            <img
              src={`http://localhost:5000${question.questionPhoto}`}
              alt={`Question ${question.questionNumber || questionIndex + 1} image`}
              className="max-w-full h-auto rounded-lg border border-gray-200 mb-2"
              loading="lazy"
              onError={(e) => console.error("Error loading question image:", e)}
            />
          )}
          {question.questionText && (
            <p className="text-base lg:text-lg font-medium text-gray-800">{question.questionText}</p>
          )}
        </div>
      ) : null}
      {(question.type === "reading" && examPhase === "reading") || 
       (question.type === "listening" && examPhase === "listening") ? (
        <div className="space-y-3">
          {question.answers.map((answer, index) => {
            const uniqueAnswerId = `answer-${index}-${answer.text || answer.photo || 'img'}`
            const answerValue = answer.text || answer.photo || `Answer ${index + 1}`

            return (
              <label
                key={`${question._id || questionIndex}-${uniqueAnswerId}`}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  selectedAnswer === answerValue
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  onAnswer(answerValue)
                }}
              >
                <input
                  type="radio"
                  name={radioGroupName}
                  value={answerValue}
                  checked={selectedAnswer === answerValue}
                  onChange={() => onAnswer(answerValue)}
                  className="h-5 w-5 text-custom-blue2 focus:ring-[#2d4373] border-gray-300"
                />
                {answer.photo ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">{index + 1}.</span>
                    <img
                      src={`http://localhost:5000${answer.photo}`}
                      alt={`Answer ${index + 1} image`}
                      className="h-30 w-30 object-cover rounded-md border border-gray-200"
                      loading="lazy"
                      onError={(e) => console.error("Error loading answer image:", e)}
                    />
                    {answer.text && <span className="text-gray-700">{answer.text}</span>}
                  </div>
                ) : (
                  <span className={`text-gray-700 ${selectedAnswer === answerValue ? "font-medium" : ""}`}>
                    {index + 1}. {answer.text}
                  </span>
                )}
              </label>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default memo(ExamQuestion)
