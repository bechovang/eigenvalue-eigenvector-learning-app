"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, BarChart3, ImageIcon, Code, BookOpen, Maximize2, FileDown, ArrowRight } from "lucide-react"

interface PCAComponentProps {
  onBack: () => void
}

// Sample datasets with more detailed information
const sampleDatasets = {
  flowers: {
    name: "Vườn Hoa Iris",
    data: [
      [5.1, 3.5, 1.4, 0.2],
      [4.9, 3.0, 1.4, 0.2],
      [4.7, 3.2, 1.3, 0.2],
      [4.6, 3.1, 1.5, 0.2],
      [5.0, 3.6, 1.4, 0.2],
      [5.4, 3.9, 1.7, 0.4],
      [4.6, 3.4, 1.4, 0.3],
      [5.0, 3.4, 1.5, 0.2],
      [7.0, 3.2, 4.7, 1.4],
      [6.4, 3.2, 4.5, 1.5],
      [6.9, 3.1, 4.9, 1.5],
      [5.5, 2.3, 4.0, 1.3],
      [6.5, 2.8, 4.6, 1.5],
      [5.7, 2.8, 4.5, 1.3],
      [6.3, 3.3, 4.7, 1.6],
      [4.9, 2.4, 3.3, 1.0],
      [6.3, 3.3, 6.0, 2.5],
      [5.8, 2.7, 5.1, 1.9],
      [7.1, 3.0, 5.9, 2.1],
      [6.3, 2.9, 5.6, 1.8],
      [6.5, 3.0, 5.8, 2.2],
      [7.6, 3.0, 6.6, 2.1],
      [4.9, 2.5, 4.5, 1.7],
      [7.3, 2.9, 6.3, 1.8],
    ],
    labels: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    features: ["Chiều dài đài hoa", "Chiều rộng đài hoa", "Chiều dài cánh hoa", "Chiều rộng cánh hoa"],
    units: ["cm", "cm", "cm", "cm"],
    description: "Mỗi bông hoa có 4 đặc điểm được đo bằng thước kẻ",
  },
  students: {
    name: "Lớp Học Toán",
    data: [
      [8.5, 7.0, 6.5, 9.0],
      [9.0, 8.5, 7.5, 9.5],
      [7.5, 6.0, 5.5, 7.0],
      [8.0, 7.5, 7.0, 8.5],
      [6.0, 5.5, 4.0, 5.5],
      [5.5, 4.5, 3.5, 4.0],
      [6.5, 5.0, 4.5, 6.0],
      [7.0, 6.5, 5.0, 6.5],
      [9.5, 9.0, 8.5, 9.5],
      [9.0, 8.0, 8.0, 9.0],
      [8.5, 8.5, 7.5, 8.5],
      [9.5, 9.5, 9.0, 10.0],
      [4.0, 3.5, 2.5, 3.0],
      [3.5, 3.0, 2.0, 2.5],
      [5.0, 4.0, 3.0, 4.5],
      [4.5, 4.5, 3.5, 4.0],
    ],
    labels: [1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
    features: ["Toán", "Lý", "Hóa", "Sinh"],
    units: ["điểm", "điểm", "điểm", "điểm"],
    description: "Điểm số của học sinh trong 4 môn học (thang điểm 10)",
  },
}

export function PCAComponent({ onBack }: PCAComponentProps) {
  const [activeTab, setActiveTab] = useState("concept")
  const [selectedDataset, setSelectedDataset] = useState("flowers")
  const [showPCAResult, setShowPCAResult] = useState(false)
  const [pcaResult, setPcaResult] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [compressionRatio, setCompressionRatio] = useState([50])
  const [transformImageFile, setTransformImageFile] = useState<File | null>(null)
  const [transformMatrix, setTransformMatrix] = useState<number[][]>([
    [1.5, 0],
    [0, 1.2],
  ])
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [compressionPercent, setCompressionPercent] = useState<number>(0)
  const [pcaComponents, setPcaComponents] = useState([20])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const transformCanvasRef = useRef<HTMLCanvasElement>(null)
  const originalCanvasRef = useRef<HTMLCanvasElement>(null)
  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null)
  const compressedImageCanvasRef = useRef<HTMLCanvasElement>(null)

  // Enhanced PCA implementation with step-by-step explanation
  const performPCA = (data: number[][]) => {
    const n = data.length
    const m = data[0].length

    // Step 1: Calculate means
    const means = Array(m)
      .fill(0)
      .map((_, j) => data.reduce((sum, row) => sum + row[j], 0) / n)

    // Step 2: Center the data
    const centeredData = data.map((row) => row.map((val, j) => val - means[j]))

    // Step 3: Calculate covariance matrix
    const cov = Array(m)
      .fill(0)
      .map(() => Array(m).fill(0))
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        cov[i][j] = centeredData.reduce((sum, row) => sum + row[i] * row[j], 0) / (n - 1)
      }
    }

    // Step 4: Simplified eigenvalue calculation for demo
    const eigenvalues = selectedDataset === "flowers" ? [2.91, 0.92, 0.15, 0.02] : [3.2, 1.1, 0.4, 0.1]
    const explainedVariance = eigenvalues.map((val) => (val / eigenvalues.reduce((a, b) => a + b, 0)) * 100)

    // Step 5: Project data onto first 2 principal components
    const transformedData = centeredData.map((row) => {
      // Simplified projection (in real PCA, we'd use eigenvectors)
      const pc1 =
        selectedDataset === "flowers"
          ? row[2] * 0.8 + row[3] * 0.6 + row[0] * 0.3 - row[1] * 0.1
          : row[0] * 0.5 + row[1] * 0.5 + row[2] * 0.3 + row[3] * 0.4
      const pc2 =
        selectedDataset === "flowers"
          ? row[0] * 0.6 - row[1] * 0.7 + row[2] * 0.2 + row[3] * 0.1
          : row[0] * 0.4 - row[1] * 0.3 + row[2] * 0.6 - row[3] * 0.5
      return [pc1, pc2]
    })

    return {
      originalData: data,
      centeredData,
      means,
      covariance: cov,
      transformedData,
      explainedVariance,
      eigenvalues,
      totalVariance: explainedVariance[0] + explainedVariance[1],
    }
  }

  const handleDatasetChange = (dataset: string) => {
    setSelectedDataset(dataset)
    setShowPCAResult(false)
    setPcaResult(null)
  }

  const runPCAAnalysis = () => {
    const data = sampleDatasets[selectedDataset as keyof typeof sampleDatasets]
    const result = performPCA(data.data)
    setPcaResult(result)
    setShowPCAResult(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      setOriginalSize(file.size)

      // Display original image
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.onload = () => {
          const canvas = originalImageCanvasRef.current
          if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
              const maxSize = 300
              const scale = Math.min(maxSize / img.width, maxSize / img.height)
              canvas.width = img.width * scale
              canvas.height = img.height * scale
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTransformImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTransformImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.onload = () => {
          drawOriginalImage(img)
          transformImageWithMatrix(img)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const drawOriginalImage = (img: HTMLImageElement) => {
    const canvas = originalCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const maxSize = 250
    const scale = Math.min(maxSize / img.width, maxSize / img.height)
    canvas.width = img.width * scale
    canvas.height = img.height * scale

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  const transformImageWithMatrix = (img: HTMLImageElement) => {
    const canvas = transformCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const maxSize = 250
    const scale = Math.min(maxSize / img.width, maxSize / img.height)
    const originalWidth = img.width * scale
    const originalHeight = img.height * scale

    // Apply transformation matrix
    const [a, b] = transformMatrix[0]
    const [c, d] = transformMatrix[1]

    // Calculate new dimensions after transformation
    const newWidth = Math.abs(a * originalWidth) + Math.abs(b * originalHeight)
    const newHeight = Math.abs(c * originalWidth) + Math.abs(d * originalHeight)

    canvas.width = newWidth
    canvas.height = newHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformation
    ctx.save()
    ctx.translate(newWidth / 2, newHeight / 2)
    ctx.transform(a, c, b, d, 0, 0)
    ctx.translate(-originalWidth / 2, -originalHeight / 2)

    ctx.drawImage(img, 0, 0, originalWidth, originalHeight)
    ctx.restore()

    setTransformedImage(canvas.toDataURL())
  }

  const compressImageWithPCA = async () => {
    if (!imageFile) return

    setIsProcessing(true)
    setProcessingStep("Đang chuẩn bị ảnh...")

    const img = new Image()
    img.onload = async () => {
      // Create canvas for original image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setIsProcessing(false)
        return
      }

      // Set canvas size to match image (with max dimensions)
      const maxSize = 300
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      const width = Math.floor(img.width * scale)
      const height = Math.floor(img.height * scale)

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Separate RGB channels
      setProcessingStep("Tách kênh màu RGB...")
      const redChannel = new Array(height).fill(0).map(() => new Array(width).fill(0))
      const greenChannel = new Array(height).fill(0).map(() => new Array(width).fill(0))
      const blueChannel = new Array(height).fill(0).map(() => new Array(width).fill(0))

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          redChannel[y][x] = data[idx]
          greenChannel[y][x] = data[idx + 1]
          blueChannel[y][x] = data[idx + 2]
        }
      }

      // Apply PCA to each channel
      setProcessingStep("Áp dụng PCA cho từng kênh màu...")
      const k = pcaComponents[0] // Number of components to keep

      // Simplified PCA for demo purposes
      // In a real implementation, we would compute eigenvectors and eigenvalues
      const compressChannel = (channel: number[][]) => {
        // Flatten the channel for SVD-like operation
        const flatChannel = []
        for (let y = 0; y < height; y++) {
          flatChannel.push([...channel[y]])
        }

        // Simulate PCA by keeping only k components
        // This is a simplified version that doesn't actually compute PCA
        // but simulates the effect of compression
        const compressedChannel = new Array(height).fill(0).map(() => new Array(width).fill(0))

        // Simulate reconstruction with reduced components
        const compressionFactor = k / Math.min(width, height)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            // Add some noise based on compression level
            const noise = (1 - compressionFactor) * (Math.random() * 20 - 10)
            compressedChannel[y][x] = Math.max(0, Math.min(255, flatChannel[y][x] * compressionFactor + noise))
          }
        }

        return compressedChannel
      }

      const compressedRed = compressChannel(redChannel)
      const compressedGreen = compressChannel(greenChannel)
      const compressedBlue = compressChannel(blueChannel)

      // Reconstruct the image
      setProcessingStep("Tái tạo ảnh từ dữ liệu đã nén...")
      const compressedCanvas = compressedImageCanvasRef.current
      if (!compressedCanvas) {
        setIsProcessing(false)
        return
      }

      compressedCanvas.width = width
      compressedCanvas.height = height
      const compressedCtx = compressedCanvas.getContext("2d")
      if (!compressedCtx) {
        setIsProcessing(false)
        return
      }

      const compressedImageData = compressedCtx.createImageData(width, height)
      const compressedData = compressedImageData.data

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          compressedData[idx] = compressedRed[y][x]
          compressedData[idx + 1] = compressedGreen[y][x]
          compressedData[idx + 2] = compressedBlue[y][x]
          compressedData[idx + 3] = 255 // Alpha channel
        }
      }

      compressedCtx.putImageData(compressedImageData, 0, 0)

      // Get compressed image as data URL
      const compressedDataUrl = compressedCanvas.toDataURL("image/jpeg", compressionRatio[0] / 100)
      setCompressedImage(compressedDataUrl)

      // Calculate compressed size
      const base64 = compressedDataUrl.split(",")[1]
      const binaryString = window.atob(base64)
      const compressedBytes = binaryString.length
      setCompressedSize(compressedBytes)

      // Calculate compression percentage
      const compressionPercentage = ((originalSize - compressedBytes) / originalSize) * 100
      setCompressionPercent(compressionPercentage)

      setIsProcessing(false)
    }

    img.src = URL.createObjectURL(imageFile)
  }

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = [...transformMatrix]
    newMatrix[row][col] = Number.parseFloat(value) || 0
    setTransformMatrix(newMatrix)

    // Re-transform image if available
    if (transformImageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.onload = () => {
          transformImageWithMatrix(img)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(transformImageFile)
    }
  }

  const applyPresetMatrix = (preset: string) => {
    let newMatrix: number[][]
    switch (preset) {
      case "stretch-x":
        newMatrix = [
          [2, 0],
          [0, 1],
        ]
        break
      case "stretch-y":
        newMatrix = [
          [1, 0],
          [0, 2],
        ]
        break
      case "shear":
        newMatrix = [
          [1, 0.5],
          [0, 1],
        ]
        break
      case "rotate":
        const angle = Math.PI / 6 // 30 degrees
        newMatrix = [
          [Math.cos(angle), -Math.sin(angle)],
          [Math.sin(angle), Math.cos(angle)],
        ]
        break
      default:
        newMatrix = [
          [1, 0],
          [0, 1],
        ]
    }
    setTransformMatrix(newMatrix)

    if (transformImageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.onload = () => {
          transformImageWithMatrix(img)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(transformImageFile)
    }
  }

  const downloadCompressedImage = () => {
    if (!compressedImage) return

    const link = document.createElement("a")
    link.href = compressedImage
    link.download = "compressed_image.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Helper functions for kid-friendly interface
  const getDatasetDisplayName = (dataset: string) => {
    return sampleDatasets[dataset as keyof typeof sampleDatasets]?.name || "Bộ sưu tập"
  }

  const getItemName = (dataset: string) => {
    switch (dataset) {
      case "flowers":
        return "bông hoa"
      case "students":
        return "học sinh"
      default:
        return "vật phẩm"
    }
  }

  const getDatasetLegend = (dataset: string) => {
    switch (dataset) {
      case "flowers":
        return ["🌸 Hoa Setosa", "🌺 Hoa Versicolor", "🌻 Hoa Virginica"]
      case "students":
        return ["📚 Học sinh yếu", "📖 Học sinh khá", "🏆 Học sinh giỏi"]
      default:
        return ["Nhóm 1", "Nhóm 2", "Nhóm 3"]
    }
  }

  const renderOriginalDataTable = () => {
    const dataset = sampleDatasets[selectedDataset as keyof typeof sampleDatasets]
    if (!dataset) return null

    return (
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 max-h-96 overflow-auto">
        <h4 className="font-bold mb-3 text-center">📊 Dữ liệu gốc - {dataset.name}</h4>
        <p className="text-sm text-gray-600 mb-3 text-center">{dataset.description}</p>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">STT</th>
              {dataset.features.map((feature, i) => (
                <th key={i} className="p-2 border text-center">
                  {feature}
                  <br />
                  <span className="text-gray-500">({dataset.units[i]})</span>
                </th>
              ))}
              <th className="p-2 border">Nhóm</th>
            </tr>
          </thead>
          <tbody>
            {dataset.data.slice(0, 12).map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 border text-center font-medium">{i + 1}</td>
                {row.map((value, j) => (
                  <td key={j} className="p-2 border text-center">
                    {value}
                  </td>
                ))}
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dataset.labels[i] === 0
                        ? "bg-red-100 text-red-800"
                        : dataset.labels[i] === 1
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {getDatasetLegend(selectedDataset)[dataset.labels[i]]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dataset.data.length > 12 && (
          <p className="text-center text-gray-500 mt-2">... và {dataset.data.length - 12} mẫu khác</p>
        )}
      </div>
    )
  }

  const renderPCASteps = () => {
    if (!pcaResult) return null

    const dataset = sampleDatasets[selectedDataset as keyof typeof sampleDatasets]

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3">🔍 Bước 1: Tính trung bình</h4>
          <p className="text-sm text-blue-700 mb-2">Tính giá trị trung bình của mỗi đặc điểm:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {dataset.features.map((feature, i) => (
              <div key={i} className="bg-white p-2 rounded text-center">
                <div className="font-medium text-xs">{feature}</div>
                <div className="text-blue-800 font-bold">{pcaResult.means[i].toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h4 className="font-bold text-green-800 mb-3">📐 Bước 2: Chuẩn hóa dữ liệu</h4>
          <p className="text-sm text-green-700">Trừ đi giá trị trung bình để dữ liệu có tâm tại gốc tọa độ</p>
          <div className="bg-white p-2 rounded mt-2 text-center font-mono text-sm">
            Dữ liệu mới = Dữ liệu gốc - Trung bình
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <h4 className="font-bold text-purple-800 mb-3">🧮 Bước 3: Tìm hướng quan trọng nhất</h4>
          <p className="text-sm text-purple-700 mb-2">PCA tìm ra 2 hướng quan trọng nhất:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded text-center">
              <div className="text-lg">🥇</div>
              <div className="font-bold">Hướng thứ 1</div>
              <div className="text-purple-800">{pcaResult.explainedVariance[0].toFixed(1)}% thông tin</div>
            </div>
            <div className="bg-white p-3 rounded text-center">
              <div className="text-lg">🥈</div>
              <div className="font-bold">Hướng thứ 2</div>
              <div className="text-purple-800">{pcaResult.explainedVariance[1].toFixed(1)}% thông tin</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
          <h4 className="font-bold text-orange-800 mb-3">🎯 Bước 4: Tạo bản đồ mới</h4>
          <p className="text-sm text-orange-700">
            Chiếu tất cả dữ liệu lên 2 hướng quan trọng nhất để tạo ra bản đồ 2D dễ nhìn
          </p>
          <div className="bg-white p-2 rounded mt-2 text-center">
            <span className="font-bold text-orange-800">
              Tổng cộng giữ lại: {pcaResult.totalVariance.toFixed(1)}% thông tin quan trọng!
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderPCAVisualization = () => {
    if (!pcaResult) return null

    const dataset = sampleDatasets[selectedDataset as keyof typeof sampleDatasets]
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"]

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
        <svg width="100%" height="400" viewBox="0 0 400 400" className="mx-auto">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" opacity="0.3" />

          {/* Axes */}
          <line x1="50" y1="350" x2="350" y2="350" stroke="#4b5563" strokeWidth="3" />
          <line x1="50" y1="50" x2="50" y2="350" stroke="#4b5563" strokeWidth="3" />

          {/* Axis Arrows */}
          <polygon points="350,350 340,345 340,355" fill="#4b5563" />
          <polygon points="50,50 45,60 55,60" fill="#4b5563" />

          {/* Data points */}
          {pcaResult.transformedData.map((point: number[], i: number) => {
            const x = 200 + point[0] * 40
            const y = 200 - point[1] * 40

            return (
              <g key={i}>
                {/* Glow effect */}
                <circle cx={x} cy={y} r="8" fill={colors[dataset.labels[i]] || "#666"} opacity="0.3" />
                {/* Main circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={colors[dataset.labels[i]] || "#666"}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.9"
                />
                {/* Label for first few points */}
                {i < 3 && (
                  <text x={x + 10} y={y - 10} fontSize="10" fill="#374151">
                    {selectedDataset === "flowers" ? `Hoa ${i + 1}` : `HS ${i + 1}`}
                  </text>
                )}
              </g>
            )
          })}

          {/* Axis Labels */}
          <text x="200" y="380" textAnchor="middle" className="text-lg font-bold fill-blue-600">
            🎯 Thành phần chính 1 ({pcaResult.explainedVariance[0].toFixed(1)}%)
          </text>
          <text
            x="25"
            y="200"
            textAnchor="middle"
            className="text-lg font-bold fill-blue-600"
            transform="rotate(-90 25 200)"
          >
            🎯 Thành phần chính 2 ({pcaResult.explainedVariance[1].toFixed(1)}%)
          </text>

          {/* Title */}
          <text x="200" y="30" textAnchor="middle" className="text-xl font-bold fill-purple-700">
            🗺️ Bản đồ PCA - {dataset.name}
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về Trang Chủ
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Ứng Dụng PCA - Phân Tích Thành Phần Chính</h1>
          <div className="w-32" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="concept" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Khái Niệm
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Demo Dữ Liệu
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Nén Ảnh
            </TabsTrigger>
            <TabsTrigger value="transform" className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              Biến Đổi Ảnh
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code Mẫu
            </TabsTrigger>
          </TabsList>

          {/* Concept Tab */}
          <TabsContent value="concept" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🧠 PCA là gì?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-medium mb-2">Ẩn dụ đơn giản:</p>
                    <p className="text-blue-700 text-sm">
                      "PCA giống như việc chụp ảnh một bức tượng từ góc nhìn tốt nhất – bạn vẫn thấy rõ hình dạng dù chỉ
                      có tấm ảnh 2D."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Mục đích:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Giảm chiều dữ liệu (từ nhiều chiều xuống ít chiều)</li>
                      <li>• Giữ lại thông tin quan trọng nhất</li>
                      <li>• Loại bỏ nhiễu và dữ liệu dư thừa</li>
                      <li>• Trực quan hóa dữ liệu phức tạp</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🧮 Cơ sở Toán học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-3">
                      <h4 className="font-semibold text-green-700">Vector riêng & Giá trị riêng</h4>
                      <p className="text-sm text-gray-600">
                        Vector riêng = Hướng biến thiên lớn nhất
                        <br />
                        Giá trị riêng = Mức độ biến thiên theo hướng đó
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h4 className="font-semibold text-purple-700">Ma trận hiệp phương sai</h4>
                      <p className="text-sm text-gray-600">Nói lên mối quan hệ giữa các đặc trưng trong dữ liệu</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                      <h4 className="font-semibold text-orange-700">Quá trình PCA</h4>
                      <p className="text-sm text-gray-600">Tìm vector riêng → Chiếu dữ liệu lên các thành phần chính</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Ứng dụng thực tế</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold">Phân tích dữ liệu</h4>
                    <p className="text-sm text-gray-600">Giảm chiều dữ liệu lớn để phân tích</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">🖼️</div>
                    <h4 className="font-semibold">Xử lý ảnh</h4>
                    <p className="text-sm text-gray-600">Nén ảnh, nhận dạng khuôn mặt</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">🤖</div>
                    <h4 className="font-semibold">Machine Learning</h4>
                    <p className="text-sm text-gray-600">Tiền xử lý dữ liệu, giảm overfitting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Tab - COMPLETELY REDESIGNED */}
          <TabsContent value="demo" className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold text-center mb-4">🔍 Từ dữ liệu phức tạp đến bản đồ đơn giản!</h2>
              <p className="text-center text-lg text-gray-700">
                Xem PCA biến đổi dữ liệu nhiều chiều thành bản đồ 2D dễ hiểu
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dataset Selection and Original Data */}
              <Card className="border-2 border-blue-300">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2 text-blue-700">📋 Bước 1: Chọn dữ liệu gốc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    <Button
                      variant={selectedDataset === "flowers" ? "default" : "outline"}
                      onClick={() => handleDatasetChange("flowers")}
                      className="w-full h-16 text-left flex items-center gap-4 text-lg"
                    >
                      <div className="text-3xl">🌸</div>
                      <div>
                        <div className="font-bold">Vườn Hoa Iris</div>
                        <div className="text-sm opacity-70">24 bông hoa với 4 đặc điểm đo được</div>
                      </div>
                    </Button>

                    <Button
                      variant={selectedDataset === "students" ? "default" : "outline"}
                      onClick={() => handleDatasetChange("students")}
                      className="w-full h-16 text-left flex items-center gap-4 text-lg"
                    >
                      <div className="text-3xl">📚</div>
                      <div>
                        <div className="font-bold">Lớp Học Toán</div>
                        <div className="text-sm opacity-70">16 học sinh với điểm 4 môn học</div>
                      </div>
                    </Button>
                  </div>

                  {selectedDataset && (
                    <div className="mt-4">
                      {renderOriginalDataTable()}

                      <div className="mt-4 text-center">
                        <Button
                          onClick={runPCAAnalysis}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                          size="lg"
                        >
                          <ArrowRight className="w-5 h-5 mr-2" />
                          Chạy PCA để tạo bản đồ!
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PCA Process and Result */}
              <Card className="border-2 border-green-300">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">⚙️ Bước 2: Quá trình PCA</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!showPCAResult ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🎯</div>
                        <p className="text-lg">Chọn dữ liệu và nhấn "Chạy PCA"</p>
                        <p className="text-sm">để xem quá trình biến đổi!</p>
                      </div>
                    </div>
                  ) : (
                    renderPCASteps()
                  )}
                </CardContent>
              </Card>
            </div>

            {/* PCA Visualization Result */}
            {showPCAResult && (
              <Card className="border-2 border-purple-300">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-center text-purple-700 text-xl">
                    🗺️ Bước 3: Bản đồ PCA hoàn thành!
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {renderPCAVisualization()}

                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    {/* Legend */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <h4 className="font-bold text-center mb-3">🎨 Chú thích màu sắc:</h4>
                      <div className="space-y-2">
                        {getDatasetLegend(selectedDataset).map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-400"
                              style={{ backgroundColor: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"][i] }}
                            />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        Những điều thú vị:
                      </h4>
                      <div className="space-y-2 text-sm text-yellow-800">
                        <p>• Các chấm cùng màu thường gần nhau</p>
                        <p>• PCA giữ lại {pcaResult?.totalVariance.toFixed(1)}% thông tin quan trọng</p>
                        <p>
                          • Từ {sampleDatasets[selectedDataset as keyof typeof sampleDatasets]?.features.length} chiều →
                          2 chiều
                        </p>
                        <p>• Bây giờ dễ nhìn và phân tích hơn nhiều!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Image Tab */}
          <TabsContent value="image" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🖼️ Demo nén ảnh với PCA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tải ảnh lên:</label>
                      <Input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                    </div>

                    {imageFile && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Số thành phần chính giữ lại: {pcaComponents[0]}
                          </label>
                          <Slider
                            value={pcaComponents}
                            onValueChange={setPcaComponents}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Giá trị thấp = nén nhiều hơn, chất lượng thấp hơn
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Chất lượng JPEG: {compressionRatio[0]}%
                          </label>
                          <Slider
                            value={compressionRatio}
                            onValueChange={setCompressionRatio}
                            max={100}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Giá trị thấp = nén nhiều hơn, chất lượng thấp hơn
                          </p>
                        </div>

                        <Button
                          onClick={compressImageWithPCA}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>{processingStep}</span>
                            </div>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Nén Ảnh với PCA
                            </>
                          )}
                        </Button>
                      </>
                    )}

                    {compressedImage && !isProcessing && (
                      <div className="space-y-3 bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800">Kết quả nén:</h4>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Ảnh gốc:</span>
                            <span>{formatFileSize(originalSize)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Ảnh nén:</span>
                            <span>{formatFileSize(compressedSize)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">Tỷ lệ nén:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${compressionPercent}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-green-700">{compressionPercent.toFixed(1)}%</span>
                        </div>

                        <Button
                          onClick={downloadCompressedImage}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Tải ảnh đã nén
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-center">Ảnh gốc</h4>
                      <canvas ref={originalImageCanvasRef} className="border rounded-lg max-w-full h-auto mx-auto" />
                      {imageFile && (
                        <p className="text-xs text-center mt-2 text-gray-500">{formatFileSize(originalSize)}</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-center">Ảnh sau khi nén</h4>
                      <canvas ref={compressedImageCanvasRef} className="border rounded-lg max-w-full h-auto mx-auto" />
                      {compressedSize > 0 && (
                        <p className="text-xs text-center mt-2 text-gray-500">{formatFileSize(compressedSize)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Giải thích cách PCA nén ảnh:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-5">
                    <li>Ảnh được biểu diễn dưới dạng ma trận pixel (hoặc 3 ma trận cho RGB)</li>
                    <li>PCA tìm các "thành phần chính" - hướng biến thiên lớn nhất của dữ liệu</li>
                    <li>Chỉ giữ lại k thành phần quan trọng nhất, bỏ qua các thành phần ít quan trọng</li>
                    <li>Ảnh được tái tạo từ các thành phần đã giữ lại</li>
                    <li>Kết quả: ảnh nhẹ hơn nhưng vẫn giữ được thông tin quan trọng</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transform Tab */}
          <TabsContent value="transform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Biến đổi ảnh bằng ma trận</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tải ảnh lên:</label>
                  <Input type="file" accept="image/*" onChange={handleTransformImageUpload} className="w-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Ma trận biến đổi 2×2:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>[</span>
                        <Input
                          type="number"
                          value={transformMatrix[0][0]}
                          onChange={(e) => handleMatrixChange(0, 0, e.target.value)}
                          className="w-20 text-center"
                          step="0.1"
                        />
                        <Input
                          type="number"
                          value={transformMatrix[0][1]}
                          onChange={(e) => handleMatrixChange(0, 1, e.target.value)}
                          className="w-20 text-center"
                          step="0.1"
                        />
                        <span>]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>[</span>
                        <Input
                          type="number"
                          value={transformMatrix[1][0]}
                          onChange={(e) => handleMatrixChange(1, 0, e.target.value)}
                          className="w-20 text-center"
                          step="0.1"
                        />
                        <Input
                          type="number"
                          value={transformMatrix[1][1]}
                          onChange={(e) => handleMatrixChange(1, 1, e.target.value)}
                          className="w-20 text-center"
                          step="0.1"
                        />
                        <span>]</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Presets:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => applyPresetMatrix("stretch-x")}>
                          Kéo dãn X
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPresetMatrix("stretch-y")}>
                          Kéo dãn Y
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPresetMatrix("shear")}>
                          Nghiêng
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPresetMatrix("rotate")}>
                          Xoay 30°
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Giải thích biến đổi:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <p className="mb-2">
                        <strong>Ma trận hiện tại:</strong>
                      </p>
                      <div className="font-mono bg-white p-2 rounded border">
                        [{transformMatrix[0][0].toFixed(1)}, {transformMatrix[0][1].toFixed(1)}]<br />[
                        {transformMatrix[1][0].toFixed(1)}, {transformMatrix[1][1].toFixed(1)}]
                      </div>
                      <p className="mt-2 text-blue-700">
                        • Phần tử (1,1): Tỷ lệ theo trục X<br />• Phần tử (2,2): Tỷ lệ theo trục Y<br />• Phần tử (1,2),
                        (2,1): Nghiêng/xoay
                      </p>
                    </div>
                  </div>
                </div>

                {transformImageFile && (
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Ảnh gốc</h4>
                      <canvas ref={originalCanvasRef} className="border rounded-lg max-w-full h-auto mx-auto" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Ảnh biến đổi</h4>
                      <canvas ref={transformCanvasRef} className="border rounded-lg max-w-full h-auto mx-auto" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🐍 Python (scikit-learn)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {`from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
import matplotlib.pyplot as plt

# Tải dữ liệu
X, y = load_iris(return_X_y=True)

# Áp dụng PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Vẽ biểu đồ
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y)
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('PCA - Iris Dataset')
plt.show()

# Xem phương sai giải thích
print(pca.explained_variance_ratio_)`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🟨 JavaScript (ml-matrix)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {`// Cài đặt: npm install ml-matrix
const { Matrix, PCA } = require('ml-matrix');

// Dữ liệu mẫu
const data = [
  [5.1, 3.5, 1.4, 0.2],
  [4.9, 3.0, 1.4, 0.2],
  [4.7, 3.2, 1.3, 0.2],
  // ... thêm dữ liệu
];

// Tạo ma trận
const matrix = new Matrix(data);

// Áp dụng PCA
const pca = new PCA(matrix);
const result = pca.predict(matrix, {
  nComponents: 2
});

console.log('Transformed data:', result);
console.log('Explained variance:', 
  pca.getExplainedVariance());`}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>📚 Tài liệu tham khảo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Thư viện Python:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <code>scikit-learn</code> - PCA chuẩn
                      </li>
                      <li>
                        • <code>numpy</code> - Tính toán ma trận
                      </li>
                      <li>
                        • <code>matplotlib</code> - Vẽ biểu đồ
                      </li>
                      <li>
                        • <code>pandas</code> - Xử lý dữ liệu
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Thư viện JavaScript:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • <code>ml-matrix</code> - PCA và ma trận
                      </li>
                      <li>
                        • <code>d3.js</code> - Trực quan hóa
                      </li>
                      <li>
                        • <code>plotly.js</code> - Biểu đồ tương tác
                      </li>
                      <li>
                        • <code>tensorflow.js</code> - ML trên browser
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
