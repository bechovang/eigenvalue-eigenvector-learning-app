"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, User, BookOpen } from "lucide-react"

interface StudentInfoFormProps {
  onSubmit: (studentInfo: { name: string; studentId: string }) => void
  onBack: () => void
}

export function StudentInfoForm({ onSubmit, onBack }: StudentInfoFormProps) {
  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [errors, setErrors] = useState({ name: "", studentId: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors = {
      name: name.trim() === "" ? "Vui lòng nhập họ tên" : "",
      studentId: studentId.trim() === "" ? "Vui lòng nhập mã số sinh viên" : "",
    }

    setErrors(newErrors)

    if (newErrors.name === "" && newErrors.studentId === "") {
      onSubmit({ name, studentId })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Thông Tin Sinh Viên</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập họ và tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Mã số sinh viên
                </Label>
                <Input
                  id="studentId"
                  placeholder="Nhập mã số sinh viên của bạn"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className={errors.studentId ? "border-red-500" : ""}
                />
                {errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>
                  Quay lại
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Bắt đầu làm bài
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
