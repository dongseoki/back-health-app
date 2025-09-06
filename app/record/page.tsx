"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  Circle,
  ArrowLeft,
  Clock,
  Target,
  Award,
  Plus,
  Minus,
  Calendar,
  MessageSquare,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const todayHabits = [
  {
    id: 1,
    name: "아침 허리 스트레칭",
    description: "기상 후 5분간 허리 근육 이완",
    completed: true,
    targetValue: 5,
    currentValue: 5,
    unit: "분",
    category: "스트레칭",
    timeOfDay: "아침",
    streak: 7,
  },
  {
    id: 2,
    name: "점심시간 걷기",
    description: "점심 후 15분간 가벼운 산책",
    completed: false,
    targetValue: 15,
    currentValue: 8,
    unit: "분",
    category: "운동",
    timeOfDay: "점심",
    streak: 5,
  },
  {
    id: 3,
    name: "코어 강화 운동",
    description: "플랭크 30초 x 3세트",
    completed: false,
    targetValue: 3,
    currentValue: 0,
    unit: "세트",
    category: "운동",
    timeOfDay: "저녁",
    streak: 3,
  },
  {
    id: 4,
    name: "물 마시기",
    description: "하루 8잔의 물 섭취",
    completed: false,
    targetValue: 8,
    currentValue: 4,
    unit: "잔",
    category: "건강",
    timeOfDay: "하루종일",
    streak: 4,
  },
]

export default function HabitRecordPage() {
  const [habits, setHabits] = useState(todayHabits)
  const [notes, setNotes] = useState("")
  const [selectedHabit, setSelectedHabit] = useState<number | null>(null)

  const updateHabitValue = (habitId: number, newValue: number) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const updatedValue = Math.max(0, Math.min(newValue, habit.targetValue))
          return {
            ...habit,
            currentValue: updatedValue,
            completed: updatedValue >= habit.targetValue,
          }
        }
        return habit
      }),
    )
  }

  const toggleHabitCompletion = (habitId: number) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completed: !habit.completed,
            currentValue: !habit.completed ? habit.targetValue : 0,
          }
        }
        return habit
      }),
    )
  }

  const completedHabits = habits.filter((h) => h.completed).length
  const totalProgress = Math.round((completedHabits / habits.length) * 100)

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">습관 기록하기</h1>
            <p className="text-muted-foreground">오늘의 건강 습관을 기록해보세요</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
        </Badge>
      </div>

      {/* Today's Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">오늘의 진행률</h3>
              <p className="text-sm text-muted-foreground">
                {completedHabits}/{habits.length} 습관 완료
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{totalProgress}%</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                목표 달성률
              </div>
            </div>
          </div>
          <Progress value={totalProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Habit Recording List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">오늘의 습관 목록</h2>

        {habits.map((habit) => (
          <Card
            key={habit.id}
            className={`transition-all duration-200 ${
              habit.completed
                ? "bg-primary/5 border-primary/30"
                : selectedHabit === habit.id
                  ? "border-accent/50 shadow-md"
                  : "hover:border-primary/30"
            }`}
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Habit Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button onClick={() => toggleHabitCompletion(habit.id)} className="mt-1 flex-shrink-0">
                      {habit.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <h3 className={`font-medium ${habit.completed ? "text-primary" : "text-foreground"}`}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {habit.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {habit.timeOfDay}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {habit.streak}일 연속
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">진행률</Label>
                    <span className="text-sm text-muted-foreground">
                      {habit.currentValue}/{habit.targetValue} {habit.unit}
                    </span>
                  </div>

                  <Progress value={(habit.currentValue / habit.targetValue) * 100} className="h-2" />

                  {/* Value Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateHabitValue(habit.id, habit.currentValue - 1)}
                      disabled={habit.currentValue <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={habit.currentValue}
                        onChange={(e) => updateHabitValue(habit.id, Number.parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                        min="0"
                        max={habit.targetValue}
                      />
                      <span className="text-sm text-muted-foreground">{habit.unit}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateHabitValue(habit.id, habit.currentValue + 1)}
                      disabled={habit.currentValue >= habit.targetValue}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Complete Button */}
                  {!habit.completed && (
                    <Button onClick={() => updateHabitValue(habit.id, habit.targetValue)} className="w-full" size="sm">
                      <Target className="h-4 w-4 mr-2" />
                      목표 달성 완료
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            오늘의 메모
          </CardTitle>
          <CardDescription>오늘의 컨디션이나 특별한 사항을 기록해보세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="예: 오늘은 허리가 조금 아팠지만 스트레칭 후 많이 나아졌다..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <Button className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            메모 저장하기
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            대시보드로 돌아가기
          </Button>
        </Link>
        <Link href="/add-habit" className="flex-1">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />새 습관 추가
          </Button>
        </Link>
      </div>
    </div>
  )
}
