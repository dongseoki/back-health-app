"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Target, Clock, Calendar, Activity, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "stretching", name: "스트레칭", icon: "🧘", color: "bg-blue-100 text-blue-800" },
  { id: "exercise", name: "운동", icon: "💪", color: "bg-green-100 text-green-800" },
  { id: "posture", name: "자세", icon: "🏃", color: "bg-purple-100 text-purple-800" },
  { id: "lifestyle", name: "생활습관", icon: "🌱", color: "bg-orange-100 text-orange-800" },
]

const timeOptions = [
  { value: "morning", label: "아침 (6-12시)" },
  { value: "afternoon", label: "점심 (12-18시)" },
  { value: "evening", label: "저녁 (18-24시)" },
  { value: "anytime", label: "하루종일" },
]

const frequencyOptions = [
  { value: "daily", label: "매일" },
  { value: "weekdays", label: "평일만" },
  { value: "weekends", label: "주말만" },
  { value: "custom", label: "사용자 정의" },
]

const predefinedHabits = [
  {
    name: "아침 허리 스트레칭",
    description: "기상 후 5분간 허리 근육 이완",
    category: "stretching",
    time: "morning",
    frequency: "daily",
  },
  {
    name: "점심시간 걷기",
    description: "점심 후 15분간 가벼운 산책",
    category: "exercise",
    time: "afternoon",
    frequency: "weekdays",
  },
  {
    name: "바른 자세 체크",
    description: "1시간마다 자세 점검 및 교정",
    category: "posture",
    time: "anytime",
    frequency: "daily",
  },
]

export default function AddHabitPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    time: "",
    frequency: "",
    goal: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredefinedHabit = (habit: (typeof predefinedHabits)[0]) => {
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      time: habit.time,
      frequency: habit.frequency,
      goal: "1",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // Reset form or redirect
      setFormData({
        name: "",
        description: "",
        category: "",
        time: "",
        frequency: "",
        goal: "",
      })
    }, 2000)
  }

  const isFormValid = formData.name && formData.category && formData.time && formData.frequency

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">새 습관 추가</h1>
          <p className="text-muted-foreground">건강한 허리를 위한 새로운 습관을 만들어보세요</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">습관이 성공적으로 추가되었습니다!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Add Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-accent" />
            추천 습관
          </CardTitle>
          <CardDescription>자주 선택되는 허리 건강 습관들을 빠르게 추가해보세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {predefinedHabits.map((habit, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => handlePredefinedHabit(habit)}
            >
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">{habit.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find((c) => c.id === habit.category)?.name}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {timeOptions.find((t) => t.value === habit.time)?.label}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Custom Habit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            사용자 정의 습관
          </CardTitle>
          <CardDescription>나만의 특별한 허리 건강 습관을 만들어보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                습관 이름 *
              </Label>
              <Input
                id="name"
                placeholder="예: 아침 허리 스트레칭"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                설명
              </Label>
              <Textarea
                id="description"
                placeholder="습관에 대한 자세한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full min-h-[80px]"
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">카테고리 *</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.category === category.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => handleInputChange("category", category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-foreground">{category.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time and Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  시간대 *
                </Label>
                <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="시간대를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  빈도 *
                </Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="빈도를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goal Setting */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                목표 (선택사항)
              </Label>
              <Input
                id="goal"
                placeholder="예: 5분, 10회, 3세트"
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  취소
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={!isFormValid}>
                습관 추가하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium text-foreground">💡 습관 형성 팁</h3>
            <p className="text-sm text-muted-foreground">
              작은 습관부터 시작하세요. 매일 5분이라도 꾸준히 하는 것이 한 번에 1시간 하는 것보다 효과적입니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
