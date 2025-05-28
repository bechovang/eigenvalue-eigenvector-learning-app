"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft, ArrowRight, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Question {
  id: number
  question: string
  matrix?: number[][]
  matrixA?: number[][]
  matrixB?: number[][]
  vectorU?: number[]
  vectorV?: number[]
  options: string[]
  correct: number
  explanation: string
  wrongExplanations: string[]
  category: string
}

interface QuizComponentProps {
  onComplete: (results: any) => void
  onBack: () => void
}

export function QuizComponent({ onComplete, onBack }: QuizComponentProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
  const [showExplanation, setShowExplanation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/quizbank.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(-1))
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading questions:", error)
        // Fallback to hardcoded questions if JSON fails to load
        const fallbackQuestions = [
          {
            id: 1,
            question: "Cho ma trận A. Tìm đa thức đặc trưng của A.",
            matrix: [
              [2, 1],
              [1, 2],
            ],
            options: ["λ² - 4λ + 3", "λ² - 4λ + 4", "λ² - 4λ + 5", "λ² - 4λ"],
            correct: 0,
            explanation:
              "Ta lập ma trận A - λI = [[2-λ, 1], [1, 2-λ]]. Tính định thức: det(A - λI) = (2-λ)(2-λ) - 1×1 = λ² - 4λ + 4 - 1 = λ² - 4λ + 3",
            wrongExplanations: [
              "Bạn đã quên trừ đi tích của các phần tử ngoài đường chéo chính",
              "Bạn có thể đã nhầm lẫn các hằng số khi triển khai biểu thức",
              "Bạn chưa tính đầy đủ biểu thức và bỏ sót số hạng tự do",
            ],
            category: "Đa thức đặc trưng",
          },
          {
            id: 2,
            question: "Giải phương trình đặc trưng λ² - 5λ + 6 = 0 để tìm giá trị riêng.",
            options: ["λ₁ = 2, λ₂ = 3", "λ₁ = 1, λ₂ = 6", "λ₁ = -2, λ₂ = -3", "λ₁ = 0, λ₂ = 5"],
            correct: 0,
            explanation: "Sử dụng công thức nghiệm: λ = (5 ± √(25-24))/2 = (5 ± 1)/2. Vậy λ₁ = 2, λ₂ = 3",
            wrongExplanations: [
              "Bạn đã nhầm lẫn trong việc áp dụng công thức nghiệm",
              "Bạn đã đổi dấu sai khi tính nghiệm",
              "Bạn đã sử dụng sai hệ số trong công thức",
            ],
            category: "Phương trình đặc trưng",
          },
          {
            id: 3,
            question: "Cho ma trận A và giá trị riêng λ = 1. Tìm vector riêng tương ứng.",
            matrix: [
              [3, 1],
              [0, 1],
            ],
            options: [
              "v = t[1, 0] với t ≠ 0",
              "v = t[0, 1] với t ≠ 0",
              "v = t[1, 1] với t ≠ 0",
              "v = t[-1, 1] với t ≠ 0",
            ],
            correct: 0,
            explanation:
              "Giải hệ (A - λI)v = 0 với λ = 1: [[2, 1], [0, 0]][v₁, v₂]ᵀ = [0, 0]ᵀ. Ta có 2v₁ + v₂ = 0, suy ra v₂ = -2v₁. Chọn v₁ = 1 thì v₂ = 0, nên v = t[1, 0]",
            wrongExplanations: [
              "Bạn đã nhầm lẫn trong việc thiết lập hệ phương trình",
              "Bạn đã giải sai hệ phương trình tuyến tính",
              "Bạn đã chọn sai tham số tự do",
            ],
            category: "Vector riêng",
          },
        ]
        setQuestions(fallbackQuestions)
        setAnswers(new Array(fallbackQuestions.length).fill(-1))
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  useEffect(() => {
    if (questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [questions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correct ? 1 : 0)
    }, 0)

    const results = {
      score,
      total: questions.length,
      answers,
      questions,
      timeSpent: 45 * 60 - timeLeft,
    }

    onComplete(results)
  }

  const renderMatrix = (matrix: number[][], label = "Ma trận") => {
    const matrixHeight = matrix.length * 40 // Approximate height per row

    return (
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium mb-2">{label}:</p>
        <div className="font-mono text-center flex justify-center items-center">
          {/* Left bracket */}
          <div className="relative mr-2">
            <div
              className="border-l-4 border-t-4 border-b-4 border-gray-700 rounded-l-lg"
              style={{ height: `${matrixHeight}px`, width: "8px" }}
            />
          </div>

          {/* Matrix content */}
          <div className="flex flex-col justify-center">
            {matrix.map((row, i) => (
              <div key={i} className="flex justify-center">
                {row.map((cell, j) => (
                  <span key={j} className="mx-4 my-2 min-w-[2rem] text-center text-lg">
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Right bracket */}
          <div className="relative ml-2">
            <div
              className="border-r-4 border-t-4 border-b-4 border-gray-700 rounded-r-lg"
              style={{ height: `${matrixHeight}px`, width: "8px" }}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderVector = (vector: number[], label: string) => {
    const vectorHeight = vector.length * 35 // Approximate height per element

    return (
      <div className="mb-2 p-2 bg-gray-50 rounded">
        <p className="text-sm font-medium mb-1">{label}:</p>
        <div className="font-mono text-center flex justify-center items-center">
          {/* Left bracket */}
          <div className="relative mr-2">
            <div
              className="border-l-4 border-t-4 border-b-4 border-gray-700 rounded-l-lg"
              style={{ height: `${vectorHeight}px`, width: "6px" }}
            />
          </div>

          {/* Vector content */}
          <div className="flex flex-col justify-center">
            {vector.map((val, i) => (
              <div key={i} className="text-center py-1 px-3 text-lg">
                {val}
              </div>
            ))}
          </div>

          {/* Right bracket */}
          <div className="relative ml-2">
            <div
              className="border-r-4 border-t-4 border-b-4 border-gray-700 rounded-r-lg"
              style={{ height: `${vectorHeight}px`, width: "6px" }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Không thể tải câu hỏi. Vui lòng thử lại.</p>
          <Button onClick={onBack} className="mt-4">
            Về Trang Chủ
          </Button>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Câu {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">{question.category}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Câu {currentQuestion + 1}: {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Render single matrix */}
            {question.matrix && renderMatrix(question.matrix, "Ma trận A")}

            {/* Render multiple matrices and vectors for advanced questions */}
            {question.matrixA && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>{renderMatrix(question.matrixA, "Ma trận A")}</div>
                <div>{renderMatrix(question.matrixB!, "Ma trận B")}</div>
              </div>
            )}

            {question.vectorU && question.vectorV && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>{renderVector(question.vectorU, "Vector u")}</div>
                <div>{renderVector(question.vectorV, "Vector v")}</div>
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)})</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem Lời Giải
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Lời Giải Chi Tiết - Câu {currentQuestion + 1}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Show matrices and vectors in explanation */}
                    {question.matrixA && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>{renderMatrix(question.matrixA, "Ma trận A")}</div>
                        <div>{renderMatrix(question.matrixB!, "Ma trận B")}</div>
                      </div>
                    )}

                    {question.vectorU && question.vectorV && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>{renderVector(question.vectorU, "Vector u")}</div>
                        <div>{renderVector(question.vectorV, "Vector v")}</div>
                      </div>
                    )}

                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800 mb-2">
                        Đáp án đúng: {String.fromCharCode(65 + question.correct)}
                      </p>
                      <p className="text-green-700">{question.explanation}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Giải thích các đáp án sai:</p>
                      {question.wrongExplanations.map((exp, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg">
                          <p className="text-red-700 text-sm">
                            <span className="font-medium">{String.fromCharCode(66 + index)}:</span> {exp}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Trước
                </Button>
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                    Sau
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    Nộp Bài
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
