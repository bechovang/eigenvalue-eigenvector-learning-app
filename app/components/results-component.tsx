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

  // Thiết kế lại giấy chứng nhận theo mẫu đẹp
  const generateCertificate = () => {
    // Lấy thông tin sinh viên
    const studentName = results.studentInfo?.name || "Học Viên"
    const studentId = results.studentInfo?.studentId || ""

    // Tùy chỉnh màu sắc và thông điệp dựa trên điểm số
    let badgeText = "ACHIEVEMENT"
    let badgeSubtext = "AWARD"
    let specialMessage = ""
    let gradeLevel = "COMPLETION"

    if (score === 0) {
      badgeText = "PARTICIPATION"
      badgeSubtext = "CERTIFICATE"
      specialMessage = "Keep trying and never give up!"
      gradeLevel = "PARTICIPATION"
    } else if (perfect) {
      badgeText = "EXCELLENCE"
      badgeSubtext = "AWARD"
      specialMessage = "Outstanding performance with perfect score!"
      gradeLevel = "EXCELLENCE"
    } else if (passed) {
      badgeText = "ACHIEVEMENT"
      badgeSubtext = "AWARD"
      specialMessage = "Congratulations on your successful completion!"
      gradeLevel = "ACHIEVEMENT"
    } else {
      badgeText = "PARTICIPATION"
      badgeSubtext = "CERTIFICATE"
      specialMessage = "Thank you for your participation and effort!"
      gradeLevel = "PARTICIPATION"
    }

    const certificateHTML = `
    <div style="width: 900px; height: 650px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); margin: 20px auto; position: relative; font-family: 'Times New Roman', serif; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
      
      <!-- Background decorative elements -->
      <div style="position: absolute; top: -50px; right: -50px; width: 300px; height: 300px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 50%; opacity: 0.1;"></div>
      <div style="position: absolute; bottom: -50px; left: -50px; width: 250px; height: 250px; background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); border-radius: 50%; opacity: 0.1;"></div>
      
      <!-- Top decorative border -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 8px; background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #dc3545 100%);"></div>
      
      <!-- Award Badge -->
      <div style="position: absolute; top: 40px; left: 50px; width: 120px; height: 120px;">
        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(255,193,7,0.4); border: 4px solid #fff;">
          <div style="text-align: center; color: #000;">
            <div style="font-size: 14px; font-weight: bold; line-height: 1;">${badgeText}</div>
            <div style="font-size: 12px; margin-top: 2px;">${badgeSubtext}</div>
            <div style="margin-top: 8px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        </div>
        <!-- Ribbon -->
        <div style="position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 40px; height: 30px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); clip-path: polygon(0 0, 100% 0, 85% 100%, 50% 80%, 15% 100%);"></div>
      </div>
      
      <!-- Main content -->
      <div style="padding: 60px 80px 40px 200px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        
        <!-- Title -->
        <h1 style="font-size: 48px; color: #2c3e50; margin: 0 0 10px 0; font-weight: normal; letter-spacing: 2px;">Certificate</h1>
        <h2 style="font-size: 20px; color: #6c757d; margin: 0 0 30px 0; font-weight: normal; letter-spacing: 1px;">OF ${gradeLevel}</h2>
        
        <!-- Subtitle -->
        <p style="font-size: 16px; color: #6c757d; margin: 0 0 25px 0; line-height: 1.4;">THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
        
        <!-- Student name -->
        <h3 style="font-size: 36px; color: #2c3e50; margin: 0 0 5px 0; font-family: 'Brush Script MT', cursive; border-bottom: 2px solid #dc3545; padding-bottom: 8px; display: inline-block;">${studentName}</h3>
        
        ${studentId ? `<p style="font-size: 14px; color: #6c757d; margin: 5px 0 25px 0;">Student ID: ${studentId}</p>` : '<div style="margin-bottom: 25px;"></div>'}
        
        <!-- Course info -->
        <p style="font-size: 16px; color: #495057; margin: 0 0 20px 0; line-height: 1.6;">
          For successfully completing the course on <strong>Eigenvalues & Eigenvectors</strong><br>
          and demonstrating proficiency in linear algebra concepts.
        </p>
        
        <!-- Score display -->
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 4px 15px rgba(220,53,69,0.3);">
          <div style="font-size: 32px; font-weight: bold; margin-bottom: 5px;">${perfect ? "10đ" : `${score}/${total} điểm`}</div>
          <div style="font-size: 16px; opacity: 0.9;">Grade: ${getGradeText()}</div>
          <div style="font-size: 14px; margin-top: 8px; font-style: italic;">${specialMessage}</div>
        </div>
        
        <!-- Bottom info -->
        <div style="display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <div style="text-align: center; flex: 1;">
            <div style="border-bottom: 1px solid #6c757d; padding-bottom: 5px; margin-bottom: 5px; width: 150px;">
              ${new Date().toLocaleDateString("vi-VN")}
            </div>
            <div style="font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px;">DATE</div>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="border-bottom: 1px solid #6c757d; padding-bottom: 5px; margin-bottom: 5px; width: 150px; margin-left: auto;">
              Digital Certificate
            </div>
            <div style="font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px;">SIGNATURE</div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 11px; color: #adb5bd; margin: 0;">Eigenvalue & Eigenvector Learning Platform</p>
          <p style="font-size: 10px; color: #adb5bd; margin: 5px 0 0 0;">Completion Time: ${formatTime(timeSpent)}</p>
        </div>
      </div>
      
      <!-- Decorative corner elements -->
      <div style="position: absolute; top: 20px; right: 20px; width: 60px; height: 60px; border: 3px solid #ffc107; border-radius: 50%; opacity: 0.3;"></div>
      <div style="position: absolute; bottom: 20px; left: 20px; width: 40px; height: 40px; background: linear-gradient(45deg, #dc3545, #ffc107); border-radius: 50%; opacity: 0.2;"></div>
      
    </div>
  `

    const newWindow = window.open("", "_blank", "width=1000,height=750")
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Certificate of ${gradeLevel} - ${studentName}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
              body { 
                margin: 0; 
                padding: 20px; 
                background: #f8f9fa;
                font-family: 'Times New Roman', serif;
              }
              @media print {
                body { background: white; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="no-print" style="text-align: center; margin-bottom: 20px;">
              <button onclick="window.print()" style="background: #dc3545; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; margin-right: 10px; box-shadow: 0 2px 8px rgba(220,53,69,0.3);">🖨️ Print Certificate</button>
              <button onclick="window.close()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; box-shadow: 0 2px 8px rgba(108,117,125,0.3);">❌ Close</button>
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
