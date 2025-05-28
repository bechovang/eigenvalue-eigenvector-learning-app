"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Award, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { QuizComponent } from "./components/quiz-component"
import { AnimationComponent } from "./components/animation-component"
import { ResultsComponent } from "./components/results-component"
import { PCAComponent } from "./components/pca-component"

type AppState = 'home' | 'quiz' | 'animation' | 'results' | 'pca'

export default function EigenvalueLearningApp() {
  const [currentState, setCurrentState] = useState<AppState>('home')
  const [quizResults, setQuizResults] = useState<any>(null)

  const handleStartQuiz = () => {
    setCurrentState('quiz')
  }

  const handleStartAnimation = () => {
    setCurrentState('animation')
  }

  const handleStartPCA = () => {
    setCurrentState('pca')
  }

  const handleQuizComplete = (results: any) => {
    setQuizResults(results)
    setCurrentState('results')
  }

  const handleBackToHome = () => {
    setCurrentState('home')
    setQuizResults(null)
  }

  if (currentState === 'quiz') {
    return <QuizComponent onComplete={handleQuizComplete} onBack={handleBackToHome} />
  }

  if (currentState === 'animation') {
    return <AnimationComponent onBack={handleBackToHome} />
  }

  if (currentState === 'results') {
    return <ResultsComponent results={quizResults} onBack={handleBackToHome} onRetake={handleStartQuiz} />
  }

  if (currentState === 'pca') {
    return <PCAComponent onBack={handleBackToHome} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧮 Học Giá Trị Riêng & Vector Riêng
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ứng dụng học tập tương tác với animation step-by-step và hệ thống thi trắc nghiệm
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Quiz Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Bài Thi Trắc Nghiệm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Số câu hỏi:</span>
                  <Badge variant="secondary">10 câu</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thời gian:</span>
                  <Badge variant="secondary">45 phút</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Chủ đề bao gồm:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tìm đa thức đặc trưng (3 câu)</li>
                    <li>• Giải phương trình đặc trưng (3 câu)</li>
                    <li>• Tìm vector riêng (3 câu)</li>
                    <li>• Câu hỏi tổng hợp (1 câu)</li>
                  </ul>
                </div>
                <Button onClick={handleStartQuiz} className="w-full bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Bắt Đầu Làm Bài
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Animation Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Animation Step-by-Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Xem minh họa chi tiết từng bước giải bài toán tìm giá trị riêng và vector riêng
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Các bước bao gồm:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Thành lập ma trận A - λI</li>
                    <li>• Tính định thức → đa thức đặc trưng</li>
                    <li>• Giải phương trình đặc trưng</li>
                    <li>• Tìm vector riêng tương ứng</li>
                  </ul>
                </div>
                <Button onClick={handleStartAnimation} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Play className="w-4 h-4 mr-2" />
                  Xem Animation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PCA Section - thêm mới */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Ứng Dụng PCA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Tìm hiểu Phân tích Thành phần Chính với demo tương tác và xử lý ảnh
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tính năng bao gồm:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Giải thích khái niệm PCA</li>
                    <li>• Demo rút gọn chiều dữ liệu</li>
                    <li>• Nén ảnh với PCA</li>
                    <li>• Code mẫu Python & JavaScript</li>
                  </ul>
                </div>
                <Button onClick={handleStartPCA} className="w-full bg-orange-600 hover:bg-orange-700">
                  <Play className="w-4 h-4 mr-2" />
                  Khám Phá PCA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Tính Năng Nổi Bật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Hệ Thống Đếm Giờ</h3>
                <p className="text-sm text-gray-600">Đếm ngược thời gian làm bài, tự động nộp khi hết giờ</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Giải Thích Chi Tiết</h3>
                <p className="text-sm text-gray-600">Lời giải step-by-step cho mọi câu hỏi với animation minh họa</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Chứng Nhận</h3>
                <p className="text-sm text-gray-600">Nhận chứng chỉ hoàn thành khi đạt điểm {">="} 7/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
