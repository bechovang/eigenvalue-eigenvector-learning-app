"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Award, RotateCcw, Download, CheckCircle, XCircle } from 'lucide-react'

interface ResultsComponentProps {
  results: {
    score: number
    total: number
    answers: number[]
    questions: any[]
    timeSpent: number
  }
  onBack: () => void
  onRetake: () => void
}

export function ResultsComponent({ results, onBack, onRetake }: ResultsComponentProps) {
  const { score, total, answers, questions, timeSpent } = results
  const percentage = Math.round((score / total) * 100)
  const passed = score >= 7
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeText = () => {
    if (percentage >= 90) return "Xuất sắc"
    if (percentage >= 80) return "Giỏi"
    if (percentage >= 70) return "Khá"
    if (percentage >= 60) return "Trung bình"
    return "Cần cải thiện"
  }

  const generateCertificate = () => {
    const certificateHTML = `
    <div style="width: 800px; height: 600px; border: 10px solid #4CAF50; padding: 40px; text-align: center; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); margin: 20px auto;">
      <div style="border: 3px solid #4CAF50; padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="color: #4CAF50; font-size: 42px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">🏆 CHỨNG NHẬN HOÀN THÀNH</h1>
        <h2 style="color: #333; font-size: 28px; margin-bottom: 30px; font-weight: normal;">Khóa học: Giá Trị Riêng & Vector Riêng</h2>
        <p style="font-size: 20px; margin-bottom: 20px; color: #666;">Chúng tôi xin chứng nhận rằng</p>
        <h3 style="color: #4CAF50; font-size: 32px; margin-bottom: 30px; border-bottom: 3px solid #4CAF50; display: inline-block; padding-bottom: 10px;">HỌC VIÊN</h3>
        <p style="font-size: 20px; margin-bottom: 20px; color: #666;">đã hoàn thành xuất sắc bài kiểm tra với điểm số</p>
        <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
          <h2 style="font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${score}/${total} điểm (${percentage}%)</h2>
          <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.9;">Xếp loại: ${getGradeText()}</p>
        </div>
        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Thời gian hoàn thành: ${formatTime(timeSpent)}</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
          <p style="font-size: 14px; color: #888;">Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}</p>
          <p style="font-size: 12px; color: #aaa; margin-top: 10px;">Ứng dụng học tập Giá Trị Riêng & Vector Riêng</p>
        </div>
      </div>
    </div>
  `
  
  const newWindow = window.open('', '_blank', 'width=900,height=700')
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Chứng nhận hoàn thành - ${score}/${total} điểm</title>
          <style>
            body { margin: 0; padding: 20px; background: #f0f0f0; }
            @media print {
              body { background: white; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer;">🖨️ In chứng nhận</button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer; margin-left: 10px;">❌ Đóng</button>
          </div>
          ${certificateHTML}
        </body>
      </html>
    `)
    newWindow.document.close()
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Kết Quả Bài Thi</h1>
          <div className="w-32" />
        </div>

        {/* Score Summary */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              {passed ? (
                <Award className="w-8 h-8 text-yellow-500" />
              ) : (
                <RotateCcw className="w-8 h-8 text-gray-500" />
              )}
              Điểm Số Của Bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getGradeColor()}`}>
              {score}/{total}
            </div>
            <div className={`text-2xl font-semibold ${getGradeColor()}`}>
              {percentage}% - {getGradeText()}
            </div>
            <Progress value={percentage} className="h-4 max-w-md mx-auto" />
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Thời gian làm bài</div>
                <div className="font-semibold">{formatTime(timeSpent)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Trạng thái</div>
                <Badge variant={passed ? "default" : "destructive"} className="font-semibold">
                  {passed ? "Đạt" : "Chưa đạt"}
                </Badge>
              </div>
            </div>

            {score >= 7 && (
              <div className="mt-6 space-y-2">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg mb-3">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Chúc mừng! Bạn đã đạt chứng nhận</span>
                  </div>
                </div>
                <Button onClick={generateCertificate} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  🏆 Tải Chứng Nhận
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chi Tiết Kết Quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correct
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Câu {index + 1}:</span>
                          <Badge variant="outline" className="text-xs">
                            {question.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{question.question}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Bạn chọn: </span>
                            <span className={userAnswer === -1 ? "text-gray-500" : isCorrect ? "text-green-600" : "text-red-600"}>
                              {userAnswer === -1 ? "Không trả lời" : `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}`}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Đáp án đúng: </span>
                            <span className="text-green-600">
                              {String.fromCharCode(65 + question.correct)}) {question.options[question.correct]}
                            </span>
                          </div>
                        </div>

                        {!isCorrect && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Giải thích:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={onRetake} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm Lại Bài Thi
          </Button>
          <Button variant="outline" onClick={onBack}>
            Về Trang Chủ
          </Button>
        </div>
      </div>
    </div>
  )
}
