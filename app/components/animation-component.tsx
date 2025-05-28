"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, Calculator } from "lucide-react"

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) {
    return num.toString()
  }
  return num.toFixed(2)
}

interface AnimationComponentProps {
  onBack: () => void
}

export function AnimationComponent({ onBack }: AnimationComponentProps) {
  const [matrix, setMatrix] = useState<number[][]>([
    [2, 1],
    [1, 2],
  ])
  const [matrixSize, setMatrixSize] = useState(2)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationState, setAnimationState] = useState<any>({})
  const [showInput, setShowInput] = useState(true)

  // Animation steps data - expanded with detailed vector calculation steps
  const steps = [
    { title: "Ma trận gốc A", description: "Đây là ma trận A mà chúng ta sẽ tìm giá trị riêng và vector riêng" },
    { title: "Tạo ma trận A - λI", description: "Trừ λ từ đường chéo chính của ma trận A" },
    { title: "Tính định thức", description: "Tính định thức của ma trận A - λI để có đa thức đặc trưng" },
    { title: "Đa thức đặc trưng", description: "Kết quả là một đa thức theo λ" },
    { title: "Giải phương trình", description: "Tìm nghiệm của đa thức đặc trưng để có giá trị riêng" },
    {
      title: "Thiết lập hệ phương trình cho λ₁",
      description: "Thiết lập hệ phương trình (A - λ₁I)v = 0 để tìm vector riêng",
    },
    {
      title: "Giải hệ phương trình cho λ₁",
      description: "Giải hệ phương trình tuyến tính thuần nhất để tìm vector riêng",
    },
    { title: "Vector riêng cho λ₁", description: "Xác định vector riêng tương ứng với giá trị riêng λ₁" },
    {
      title: "Thiết lập hệ phương trình cho λ₂",
      description: "Thiết lập hệ phương trình (A - λ₂I)v = 0 để tìm vector riêng",
    },
    {
      title: "Giải hệ phương trình cho λ₂",
      description: "Giải hệ phương trình tuyến tính thuần nhất để tìm vector riêng",
    },
    { title: "Vector riêng cho λ₂", description: "Xác định vector riêng tương ứng với giá trị riêng λ₂" },
    { title: "Kết quả cuối cùng", description: "Tổng hợp các giá trị riêng và vector riêng tìm được" },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep])

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[row][col] = Number.parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  const handleSizeChange = (size: number) => {
    setMatrixSize(size)
    const newMatrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0))
    // Copy existing values if possible
    for (let i = 0; i < Math.min(size, matrix.length); i++) {
      for (let j = 0; j < Math.min(size, matrix[0].length); j++) {
        newMatrix[i][j] = matrix[i][j]
      }
    }
    setMatrix(newMatrix)
  }

  const startAnimation = () => {
    setShowInput(false)
    setCurrentStep(0)
    calculateAnimationData()
  }

  const calculateAnimationData = () => {
    // Calculate eigenvalues and animation data
    const det = calculateCharacteristicPolynomial()
    const eigenvalues = solveQuadratic(det.coefficients)

    // Calculate eigenvectors for each eigenvalue
    const eigenvectors = []
    for (const eigenvalue of eigenvalues) {
      const eigenvector = calculateEigenvector(eigenvalue)
      eigenvectors.push(eigenvector)
    }

    setAnimationState({
      characteristicPoly: det,
      eigenvalues: eigenvalues,
      eigenvectors: eigenvectors,
      currentMatrix: [...matrix],
    })
  }

  const calculateCharacteristicPolynomial = () => {
    if (matrixSize === 2) {
      // For 2x2 matrix: det(A - λI) = (a-λ)(d-λ) - bc
      const a = matrix[0][0],
        b = matrix[0][1]
      const c = matrix[1][0],
        d = matrix[1][1]

      // λ² - (a+d)λ + (ad-bc)
      const coefficients = [1, -(a + d), a * d - b * c]
      const expression = `λ² ${coefficients[1] >= 0 ? "-" : "+"} ${Math.abs(coefficients[1])}λ ${coefficients[2] >= 0 ? "+" : "-"} ${Math.abs(coefficients[2])}`

      return { coefficients, expression }
    }
    return { coefficients: [1, 0, 0], expression: "λ²" }
  }

  const solveQuadratic = (coeffs: number[]) => {
    if (coeffs.length === 3) {
      const [a, b, c] = coeffs
      const discriminant = b * b - 4 * a * c
      if (discriminant >= 0) {
        const sqrt = Math.sqrt(discriminant)
        return [(-b + sqrt) / (2 * a), (-b - sqrt) / (2 * a)]
      }
    }
    return [0, 0]
  }

  const calculateEigenvector = (eigenvalue: number) => {
    // For 2x2 matrix
    if (matrixSize === 2) {
      const a = matrix[0][0],
        b = matrix[0][1]
      const c = matrix[1][0],
        d = matrix[1][1]

      // Create the matrix A - λI
      const matrixMinusLambda = [
        [a - eigenvalue, b],
        [c, d - eigenvalue],
      ]

      // Solve the system (A - λI)v = 0
      // For 2x2, we can use a simple approach

      // If first row is all zeros, use second row
      if (Math.abs(matrixMinusLambda[0][0]) < 1e-10 && Math.abs(matrixMinusLambda[0][1]) < 1e-10) {
        if (Math.abs(matrixMinusLambda[1][0]) > 1e-10) {
          return [0, 1] // v = [0, 1]
        } else {
          return [1, 0] // v = [1, 0]
        }
      }

      // If second row is all zeros, use first row
      if (Math.abs(matrixMinusLambda[1][0]) < 1e-10 && Math.abs(matrixMinusLambda[1][1]) < 1e-10) {
        if (Math.abs(matrixMinusLambda[0][0]) > 1e-10) {
          return [0, 1] // v = [0, 1]
        } else {
          return [1, 0] // v = [1, 0]
        }
      }

      // If first element of first row is non-zero
      if (Math.abs(matrixMinusLambda[0][0]) > 1e-10) {
        // v₂ can be any value, let's set it to 1
        const v2 = 1
        // From first equation: a₁₁v₁ + a₁₂v₂ = 0
        const v1 = (-matrixMinusLambda[0][1] * v2) / matrixMinusLambda[0][0]
        return [v1, v2]
      }

      // If second element of first row is non-zero
      if (Math.abs(matrixMinusLambda[0][1]) > 1e-10) {
        // v₁ can be any value, let's set it to 1
        const v1 = 1
        // From first equation: a₁₁v₁ + a₁₂v₂ = 0
        const v2 = (-matrixMinusLambda[0][0] * v1) / matrixMinusLambda[0][1]
        return [v1, v2]
      }

      // Default case
      return [1, 0]
    }

    // Default for other sizes
    return [1, 0]
  }

  const renderMatrix = (mat: number[][], highlight?: { row?: number; col?: number; diagonal?: boolean }) => {
    const matrixHeight = mat.length * 50 // Height per row

    return (
      <div className="flex justify-center items-center">
        {/* Left bracket */}
        <div className="relative mr-3">
          <div
            className="border-l-4 border-t-4 border-b-4 border-gray-600 rounded-l-lg"
            style={{ height: `${matrixHeight}px`, width: "10px" }}
          />
        </div>

        {/* Matrix content */}
        <div className="flex flex-col justify-center">
          {mat.map((row, i) => (
            <div key={i} className="flex justify-center">
              {row.map((cell, j) => {
                let cellClass =
                  "w-16 h-12 flex items-center justify-center text-lg font-mono transition-all duration-500"

                if (highlight?.diagonal && i === j) {
                  cellClass += " bg-yellow-200 text-yellow-800 font-bold rounded animate-pulse"
                } else if (highlight?.row === i || highlight?.col === j) {
                  cellClass += " bg-blue-100 text-blue-800 rounded"
                }

                return (
                  <div key={j} className={cellClass}>
                    {currentStep === 1 && i === j ? `${cell}-λ` : cell}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Right bracket */}
        <div className="relative ml-3">
          <div
            className="border-r-4 border-t-4 border-b-4 border-gray-600 rounded-r-lg"
            style={{ height: `${matrixHeight}px`, width: "10px" }}
          />
        </div>
      </div>
    )
  }

  const renderVector = (vector: number[], label?: string) => {
    const vectorHeight = vector.length * 50 // Height per element

    return (
      <div className="flex justify-center items-center">
        {/* Left bracket */}
        <div className="relative mr-2">
          <div
            className="border-l-4 border-t-4 border-b-4 border-gray-600 rounded-l-lg"
            style={{ height: `${vectorHeight}px`, width: "8px" }}
          />
        </div>

        {/* Vector content */}
        <div className="flex flex-col justify-center">
          {vector.map((value, i) => (
            <div key={i} className="w-16 h-12 flex items-center justify-center text-lg font-mono">
              {typeof value === "number" ? formatNumber(value) : value}
            </div>
          ))}
        </div>

        {/* Right bracket */}
        <div className="relative ml-2">
          <div
            className="border-r-4 border-t-4 border-b-4 border-gray-600 rounded-r-lg"
            style={{ height: `${vectorHeight}px`, width: "8px" }}
          />
        </div>

        {/* Label if provided */}
        {label && <div className="ml-2 text-lg font-medium">{label}</div>}
      </div>
    )
  }

  const renderMatrixWithLambda = (mat: number[][], lambda: number) => {
    const matrixHeight = mat.length * 50 // Height per row

    return (
      <div className="flex justify-center items-center">
        {/* Left bracket */}
        <div className="relative mr-3">
          <div
            className="border-l-4 border-t-4 border-b-4 border-gray-600 rounded-l-lg"
            style={{ height: `${matrixHeight}px`, width: "10px" }}
          />
        </div>

        {/* Matrix content */}
        <div className="flex flex-col justify-center">
          {mat.map((row, i) => (
            <div key={i} className="flex justify-center">
              {row.map((cell, j) => {
                let displayValue = cell
                if (i === j) {
                  displayValue = cell - lambda
                }

                let cellClass = "w-16 h-12 flex items-center justify-center text-lg font-mono"
                if (i === j) {
                  cellClass += " bg-yellow-100"
                }

                return (
                  <div key={j} className={cellClass}>
                    {typeof displayValue === "number" ? formatNumber(displayValue) : displayValue}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Right bracket */}
        <div className="relative ml-3">
          <div
            className="border-r-4 border-t-4 border-b-4 border-gray-600 rounded-r-lg"
            style={{ height: `${matrixHeight}px`, width: "10px" }}
          />
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    if (!animationState.eigenvalues) {
      return <div>Đang tính toán...</div>
    }

    const lambda1 = animationState.eigenvalues[0]
    const lambda2 = animationState.eigenvalues[1]
    const eigenvector1 = animationState.eigenvectors?.[0] || [1, 0]
    const eigenvector2 = animationState.eigenvectors?.[1] || [1, 0]

    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ma trận A</h3>
            {renderMatrix(matrix)}
          </div>
        )

      case 1:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ma trận A - λI</h3>
            {renderMatrix(matrix, { diagonal: true })}
            <p className="text-sm text-gray-600 animate-fade-in">Trừ λ từ các phần tử trên đường chéo chính</p>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Tính định thức</h3>
            {renderMatrix(matrix, { diagonal: true })}
            <div className="bg-blue-50 p-4 rounded-lg animate-fade-in">
              <p className="font-mono text-lg">
                det(A - λI) = ({matrix[0][0]}-λ)({matrix[1][1]}-λ) - ({matrix[0][1]})({matrix[1][0]})
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Đa thức đặc trưng</h3>
            <div className="bg-green-50 p-6 rounded-lg animate-fade-in">
              <p className="font-mono text-2xl text-green-800">
                {animationState.characteristicPoly?.expression || "Đang tính..."}
              </p>
            </div>
            <p className="text-sm text-gray-600">Kết quả sau khi triển khai và rút gọn</p>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Giá trị riêng</h3>
            <div className="bg-purple-50 p-6 rounded-lg animate-fade-in">
              <p className="font-mono text-xl text-purple-800">λ₁ = {formatNumber(lambda1)}</p>
              <p className="font-mono text-xl text-purple-800">λ₂ = {formatNumber(lambda2)}</p>
            </div>
            <p className="text-sm text-gray-600">Nghiệm của phương trình đặc trưng det(A - λI) = 0</p>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Thiết lập hệ phương trình cho λ₁</h3>
            <div className="bg-orange-50 p-4 rounded-lg animate-fade-in">
              <p className="font-medium mb-2">Với λ₁ = {formatNumber(lambda1)}, ta lập ma trận A - λ₁I:</p>
              {renderMatrixWithLambda(matrix, lambda1)}
            </div>
            <p className="text-sm text-gray-600">Thay λ₁ = {formatNumber(lambda1)} vào ma trận A - λI</p>
          </div>
        )

      case 6:
        const a1 = matrix[0][0] - lambda1
        const b1 = matrix[0][1]
        const c1 = matrix[1][0]
        const d1 = matrix[1][1] - lambda1

        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Giải hệ phương trình cho λ₁</h3>
            <div className="bg-blue-50 p-4 rounded-lg animate-fade-in">
              <p className="font-medium mb-3">Giải hệ phương trình (A - λ₁I)v = 0:</p>
              <div className="font-mono text-lg space-y-2">
                <p>
                  {formatNumber(a1)}v₁ + {formatNumber(b1)}v₂ = 0
                </p>
                <p>
                  {formatNumber(c1)}v₁ + {formatNumber(d1)}v₂ = 0
                </p>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg animate-fade-in mt-2">
              <p className="text-sm">Từ phương trình đầu tiên: v₁ = {formatNumber(-b1 / a1)}v₂</p>
              <p className="text-sm mt-1">Chọn v₂ = 1, ta có v₁ = {formatNumber(-b1 / a1)}</p>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Vector riêng cho λ₁</h3>
            <div className="bg-green-50 p-6 rounded-lg animate-fade-in">
              <p className="font-medium mb-3">Vector riêng tương ứng với λ₁ = {formatNumber(lambda1)}:</p>
              <div className="flex justify-center">{renderVector(eigenvector1, "v₁")}</div>
              <p className="text-sm mt-3 text-green-700">Kiểm tra: A·v₁ = λ₁·v₁</p>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Thiết lập hệ phương trình cho λ₂</h3>
            <div className="bg-orange-50 p-4 rounded-lg animate-fade-in">
              <p className="font-medium mb-2">Với λ₂ = {formatNumber(lambda2)}, ta lập ma trận A - λ₂I:</p>
              {renderMatrixWithLambda(matrix, lambda2)}
            </div>
            <p className="text-sm text-gray-600">Thay λ₂ = {formatNumber(lambda2)} vào ma trận A - λI</p>
          </div>
        )

      case 9:
        const a2 = matrix[0][0] - lambda2
        const b2 = matrix[0][1]
        const c2 = matrix[1][0]
        const d2 = matrix[1][1] - lambda2

        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Giải hệ phương trình cho λ₂</h3>
            <div className="bg-blue-50 p-4 rounded-lg animate-fade-in">
              <p className="font-medium mb-3">Giải hệ phương trình (A - λ₂I)v = 0:</p>
              <div className="font-mono text-lg space-y-2">
                <p>
                  {formatNumber(a2)}v₁ + {formatNumber(b2)}v₂ = 0
                </p>
                <p>
                  {formatNumber(c2)}v₁ + {formatNumber(d2)}v₂ = 0
                </p>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg animate-fade-in mt-2">
              <p className="text-sm">Từ phương trình đầu tiên: v₁ = {formatNumber(-b2 / a2)}v₂</p>
              <p className="text-sm mt-1">Chọn v₂ = 1, ta có v₁ = {formatNumber(-b2 / a2)}</p>
            </div>
          </div>
        )

      case 10:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Vector riêng cho λ₂</h3>
            <div className="bg-green-50 p-6 rounded-lg animate-fade-in">
              <p className="font-medium mb-3">Vector riêng tương ứng với λ₂ = {formatNumber(lambda2)}:</p>
              <div className="flex justify-center">{renderVector(eigenvector2, "v₂")}</div>
              <p className="text-sm mt-3 text-green-700">Kiểm tra: A·v₂ = λ₂·v₂</p>
            </div>
          </div>
        )

      case 11:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Kết quả cuối cùng</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg animate-fade-in">
                <p className="font-medium mb-2">Giá trị riêng thứ nhất:</p>
                <p className="text-xl font-bold text-purple-800">λ₁ = {formatNumber(lambda1)}</p>
                <div className="mt-3">
                  <p className="font-medium mb-1">Vector riêng tương ứng:</p>
                  <div className="flex justify-center">{renderVector(eigenvector1)}</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg animate-fade-in">
                <p className="font-medium mb-2">Giá trị riêng thứ hai:</p>
                <p className="text-xl font-bold text-purple-800">λ₂ = {formatNumber(lambda2)}</p>
                <div className="mt-3">
                  <p className="font-medium mb-1">Vector riêng tương ứng:</p>
                  <div className="flex justify-center">{renderVector(eigenvector2)}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg mt-4">
              <p className="font-medium text-green-800">
                Vậy ma trận A có {matrix.length} giá trị riêng và {matrix.length} vector riêng tương ứng.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về Trang Chủ
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Nhập Ma Trận</h1>
            <div className="w-32" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Thiết Lập Ma Trận
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Matrix Size Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Kích thước ma trận:</label>
                <div className="flex gap-2">
                  {[2, 3].map((size) => (
                    <Button
                      key={size}
                      variant={matrixSize === size ? "default" : "outline"}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}×{size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Matrix Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Nhập các phần tử ma trận:</label>
                <div className="flex justify-center">
                  <div className="flex items-center">
                    {/* Left bracket */}
                    <div className="relative mr-3">
                      <div
                        className="border-l-4 border-t-4 border-b-4 border-gray-400 rounded-l-lg"
                        style={{ height: `${matrix.length * 60}px`, width: "8px" }}
                      />
                    </div>

                    {/* Matrix inputs */}
                    <div className="flex flex-col">
                      {matrix.map((row, i) => (
                        <div key={i} className="flex justify-center gap-2 mb-2">
                          {row.map((cell, j) => (
                            <Input
                              key={j}
                              type="number"
                              value={cell}
                              onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                              className="w-16 h-12 text-center font-mono"
                              step="0.1"
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Right bracket */}
                    <div className="relative ml-3">
                      <div
                        className="border-r-4 border-t-4 border-b-4 border-gray-400 rounded-r-lg"
                        style={{ height: `${matrix.length * 60}px`, width: "8px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Xem trước ma trận A:</p>
                <div className="bg-gray-50 p-4 rounded-lg">{renderMatrix(matrix)}</div>
              </div>

              {/* Quick Examples */}
              <div>
                <p className="text-sm font-medium mb-2">Ví dụ nhanh:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMatrix([
                        [2, 1],
                        [1, 2],
                      ])
                    }
                  >
                    Ma trận đối xứng
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMatrix([
                        [3, 1],
                        [0, 2],
                      ])
                    }
                  >
                    Ma trận tam giác
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMatrix([
                        [1, 2],
                        [3, 4],
                      ])
                    }
                  >
                    Ma trận tổng quát
                  </Button>
                </div>
              </div>

              <Button onClick={startAnimation} className="w-full bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Bắt Đầu Animation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setShowInput(true)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Đổi Ma Trận
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Animation Step-by-Step</h1>
          <Button variant="outline" onClick={onBack}>
            Về Trang Chủ
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Bước {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm text-gray-600">{steps[currentStep]?.title}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(0)
              setIsPlaying(false)
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsPlaying(!isPlaying)} className="px-6">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Tạm dừng" : "Tự động"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Animation Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg text-purple-700">{steps[currentStep]?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] flex items-center justify-center">{renderCurrentStep()}</div>
            </CardContent>
          </Card>

          {/* Explanation Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Giải Thích Chi Tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{steps[currentStep]?.description}</p>

                {currentStep === 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm">
                      💡 <strong>Bắt đầu:</strong> Đây là ma trận A mà bạn đã nhập. Chúng ta sẽ tìm các giá trị λ sao
                      cho Av = λv với v ≠ 0.
                    </p>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      🔍 <strong>Quan trọng:</strong> Ma trận A - λI được tạo bằng cách trừ λ từ đường chéo chính. Đây
                      là bước chuẩn bị để tính định thức.
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      📐 <strong>Công thức:</strong> Với ma trận 2×2, định thức = (a₁₁-λ)(a₂₂-λ) - a₁₂×a₂₁
                    </p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 text-sm">
                      🧮 <strong>Giá trị riêng:</strong> Là các giá trị λ thỏa mãn phương trình det(A - λI) = 0. Mỗi giá
                      trị riêng sẽ có một vector riêng tương ứng.
                    </p>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-orange-800 text-sm">
                      🔢 <strong>Bước tiếp theo:</strong> Với mỗi giá trị riêng λ, chúng ta cần giải hệ phương trình (A
                      - λI)v = 0 để tìm vector riêng tương ứng.
                    </p>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      🧩 <strong>Hệ phương trình:</strong> Đây là hệ phương trình tuyến tính thuần nhất. Nếu det(A - λI)
                      = 0, hệ sẽ có vô số nghiệm, và mỗi nghiệm là một vector riêng.
                    </p>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✅ <strong>Vector riêng:</strong> Vector riêng v₁ tương ứng với giá trị riêng λ₁ thỏa mãn Av₁ =
                      λ₁v₁. Mọi số nhân của vector riêng cũng là vector riêng.
                    </p>
                  </div>
                )}

                {currentStep === 11 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 text-sm">
                      🎉 <strong>Hoàn thành!</strong> Bạn đã xem qua toàn bộ quá trình tìm giá trị riêng và vector
                      riêng. Mỗi giá trị riêng có một vector riêng tương ứng.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
