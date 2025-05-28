"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Award, RotateCcw, Download, CheckCircle, XCircle, Trophy, Star, Medal } from "lucide-react"
import { useEffect } from "react"

// Cập nhật interface để bao gồm thông tin sinh viên
interface ResultsComponentProps {
  results: {
    score: number
    total: number
    answers: number[]
    questions: any[]
    timeSpent: number
    studentInfo?: {
      name: string
      studentId: string
    }
  }
  onBack: () => void
  onRetake: () => void
}

export function ResultsComponent({ results, onBack, onRetake }: ResultsComponentProps) {
  const { score, total, answers, questions, timeSpent } = results
  const percentage = Math.round((score / total) * 100)
  const passed = score >= 7
  const perfect = score === total

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
    if (percentage === 100) return "Xuất sắc tuyệt đối"
    if (percentage >= 90) return "Xuất sắc"
    if (percentage >= 80) return "Giỏi"
    if (percentage >= 70) return "Khá"
    if (percentage >= 60) return "Trung bình"
    if (percentage >= 40) return "Yếu"
    return "Cần cố gắng hơn"
  }

  // Tự động mở giấy chứng nhận khi component được render
  useEffect(() => {
    setTimeout(() => {
      generateCertificate()
    }, 500)
  }, [])

  // Cập nhật hàm generateCertificate để hiển thị thông tin sinh viên
  const generateCertificate = () => {
    // Lấy thông tin sinh viên
    const studentName = results.studentInfo?.name || "Học Viên"
    const studentId = results.studentInfo?.studentId || ""

    // Tùy chỉnh giao diện giấy chứng nhận dựa trên điểm số
    let certificateStyle = ""
    let scoreDisplay = ""
    let specialMessage = ""
    let borderColor = "#4CAF50"
    let bgGradient = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
    let badgeColor = "#4CAF50"
    let titleColor = "#4CAF50"

    if (score === 0) {
      scoreDisplay = "0/10 điểm"
      specialMessage = "Hãy tiếp tục cố gắng và thử lại!"
      borderColor = "#f44336"
      bgGradient = "linear-gradient(135deg, #f5f7fa 0%, #ffcdd2 100%)"
      badgeColor = "#f44336"
      titleColor = "#f44336"
    } else if (perfect) {
      scoreDisplay = "10đ"
      specialMessage = "Chúc mừng! Bạn đã đạt điểm tuyệt đối!"
      borderColor = "#FFD700"
      bgGradient = "linear-gradient(135deg, #fff9c4 0%, #ffecb3 100%)"
      badgeColor = "#FF9800"
      titleColor = "#FF9800"
      certificateStyle = `
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        animation: glow 2s infinite alternate;
      `
    } else {
      scoreDisplay = `${score}/${total} điểm (${percentage}%)`
      specialMessage = score >= 7 ? "Chúc mừng bạn đã hoàn thành xuất sắc!" : "Cố gắng hơn trong lần sau nhé!"
    }

    // Tạo các icon trang trí dựa trên điểm số
    let decorations = ""
    if (perfect) {
      decorations = `
        <div style="position: absolute; top: 20px; right: 20px; transform: rotate(15deg);">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div style="position: absolute; top: 30px; left: 20px; transform: rotate(-15deg);">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
        </div>
      `
    }

    const certificateHTML = `
    <div style="width: 800px; height: 600px; border: 10px solid ${borderColor}; padding: 40px; text-align: center; font-family: Arial, sans-serif; background: ${bgGradient}; margin: 20px auto; position: relative; ${certificateStyle}">
      ${decorations}
      <div style="border: 3px solid ${borderColor}; padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="color: ${titleColor}; font-size: 42px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">🏆 CHỨNG NHẬN HOÀN THÀNH</h1>
        <h2 style="color: #333; font-size: 28px; margin-bottom: 30px; font-weight: normal;">Khóa học: Giá Trị Riêng & Vector Riêng</h2>
        <p style="font-size: 20px; margin-bottom: 20px; color: #666;">Chúng tôi xin chứng nhận rằng</p>
        <h3 style="color: ${titleColor}; font-size: 32px; margin-bottom: 10px; border-bottom: 3px solid ${borderColor}; display: inline-block; padding-bottom: 10px;">${studentName}</h3>
        ${studentId ? `<p style="font-size: 18px; margin-bottom: 20px; color: #666;">MSSV: ${studentId}</p>` : ""}
        <p style="font-size: 20px; margin-bottom: 20px; color: #666;">đã hoàn thành bài kiểm tra với điểm số</p>
        <div style="background: ${badgeColor}; color: white; padding: 20px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
          <h2 style="font-size: 48px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${scoreDisplay}</h2>
          <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.9;">Xếp loại: ${getGradeText()}</p>
          <p style="font-size: 16px; margin: 10px 0 0 0; font-style: italic;">${specialMessage}</p>
        </div>
        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Thời gian hoàn thành: ${formatTime(timeSpent)}</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
          <p style="font-size: 14px; color: #888;">Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}</p>
          <p style="font-size: 12px; color: #aaa; margin-top: 10px;">Ứng dụng học tập Giá Trị Riêng & Vector Riêng</p>
        </div>
      </div>
    </div>
    <style>
      @keyframes glow {
        from {
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        to {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
        }
      }
    </style>
  `

    const newWindow = window.open("", "_blank", "width=900,height=700")
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
              <button onclick="window.print()" style="background: ${badgeColor}; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer;">🖨️ In chứng nhận</button>
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
              {perfect ? (
                <Trophy className="w-8 h-8 text-yellow-500" />
              ) : passed ? (
                <Award className="w-8 h-8 text-green-500" />
              ) : (
                <Medal className="w-8 h-8 text-blue-500" />
              )}
              Điểm Số Của Bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getGradeColor()}`}>{perfect ? "10đ" : `${score}/${total}`}</div>
            <div className={`text-2xl font-semibold ${getGradeColor()}`}>
              {percentage}% - {getGradeText()}
            </div>
            <Progress value={percentage} className={`h-4 max-w-md mx-auto ${perfect ? "bg-yellow-100" : ""}`} />

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Thời gian làm bài</div>
                <div className="font-semibold">{formatTime(timeSpent)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Trạng thái</div>
                <Badge
                  variant={perfect ? "outline" : passed ? "default" : "secondary"}
                  className={`font-semibold ${perfect ? "border-yellow-500 text-yellow-700 bg-yellow-50" : ""}`}
                >
                  {perfect ? "Xuất sắc" : passed ? "Đạt" : "Chưa đạt"}
                </Badge>
              </div>
            </div>

            {/* Luôn hiển thị nút tải chứng nhận */}
            <div className="mt-6 space-y-2">
              <div className="text-center">
                <div
                  className={`inline-flex items-center gap-2 ${
                    perfect
                      ? "bg-yellow-50 text-yellow-800"
                      : passed
                        ? "bg-green-50 text-green-800"
                        : "bg-blue-50 text-blue-800"
                  } px-4 py-2 rounded-lg mb-3`}
                >
                  {perfect ? (
                    <Star className="w-5 h-5" />
                  ) : passed ? (
                    <Award className="w-5 h-5" />
                  ) : (
                    <Medal className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {perfect
                      ? "Chúc mừng! Bạn đã đạt điểm tuyệt đối!"
                      : passed
                        ? "Chúc mừng! Bạn đã đạt chứng nhận"
                        : "Bạn đã hoàn thành bài kiểm tra"}
                  </span>
                </div>
              </div>
              <Button
                onClick={generateCertificate}
                className={`${
                  perfect
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : passed
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold`}
              >
                <Download className="w-4 h-4 mr-2" />
                {perfect ? "🏆 Tải Chứng Nhận Xuất Sắc" : "🏆 Tải Chứng Nhận"}
              </Button>
            </div>
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
                            <span
                              className={
                                userAnswer === -1 ? "text-gray-500" : isCorrect ? "text-green-600" : "text-red-600"
                              }
                            >
                              {userAnswer === -1
                                ? "Không trả lời"
                                : `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}`}
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
