"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Activity, TrendingUp, Calendar, Target, Award, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

const weeklyHabits = [
  {
    id: 1,
    name: "아침 허리 스트레칭",
    description: "기상 후 5분간 허리 근육 이완",
    completed: true,
    streak: 7,
    category: "스트레칭",
    timeOfDay: "아침",
  },
  {
    id: 2,
    name: "점심시간 걷기",
    description: "점심 후 15분간 가벼운 산책",
    completed: true,
    streak: 5,
    category: "운동",
    timeOfDay: "점심",
  },
  {
    id: 3,
    name: "코어 강화 운동",
    description: "플랭크 30초 x 3세트",
    completed: false,
    streak: 3,
    category: "운동",
    timeOfDay: "저녁",
  },
  {
    id: 4,
    name: "바른 자세 체크",
    description: "1시간마다 자세 점검 및 교정",
    completed: true,
    streak: 4,
    category: "자세",
    timeOfDay: "하루종일",
  },
  {
    id: 5,
    name: "취침 전 요가",
    description: "잠들기 전 10분간 이완 요가",
    completed: false,
    streak: 2,
    category: "스트레칭",
    timeOfDay: "저녁",
  },
]

const weeklyStats = {
  completedHabits: 18,
  totalHabits: 25,
  currentStreak: 7,
  weeklyGoal: 20,
  averageCompletion: 72,
}

const weeklyProgress = [
  { day: "월", completed: 4, total: 5 },
  { day: "화", completed: 3, total: 5 },
  { day: "수", completed: 5, total: 5 },
  { day: "목", completed: 2, total: 5 },
  { day: "금", completed: 4, total: 5 },
  { day: "토", completed: 0, total: 5 },
  { day: "일", completed: 0, total: 5 },
]

export default function HabitDashboard() {
  const [habits, setHabits] = useState(weeklyHabits)

  const toggleHabit = (habitId: number) => {
    setHabits(habits.map((habit) => (habit.id === habitId ? { ...habit, completed: !habit.completed } : habit)))
  }

  const completionRate = Math.round((weeklyStats.completedHabits / weeklyStats.totalHabits) * 100)

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">허리 건강 대시보드</h1>
            <p className="text-muted-foreground">오늘도 건강한 하루를 만들어가세요</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/subscription">
            <Button
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              프리미엄 업그레이드
            </Button>
          </Link>
          <Badge variant="secondary" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            이번 주
          </Badge>
        </div>
      </div>

      {/* Weekly Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              완료율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {weeklyStats.completedHabits}/{weeklyStats.totalHabits} 완료
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-secondary" />
              연속 기록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{weeklyStats.currentStreak}일</div>
            <p className="text-xs text-muted-foreground">현재 연속</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-accent" />
              주간 목표
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{weeklyStats.weeklyGoal}</div>
            <p className="text-xs text-muted-foreground">목표 습관 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-chart-4" />
              평균 달성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{weeklyStats.averageCompletion}%</div>
            <p className="text-xs text-muted-foreground">지난 4주</p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Teaser Card */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">🚀 더 많은 기능을 원하시나요?</h3>
              <p className="text-sm text-muted-foreground">
                프리미엄으로 업그레이드하고 무제한 습관 추적, 전문가 상담, 개인 맞춤 프로그램을 이용하세요
              </p>
            </div>
            <Link href="/subscription">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">자세히 보기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">주간 진행 상황</CardTitle>
          <CardDescription>이번 주 일별 습관 완료 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between space-x-2 h-32">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="w-full bg-muted rounded-sm overflow-hidden h-20 flex flex-col justify-end">
                  <div
                    className="bg-primary rounded-sm transition-all duration-300"
                    style={{
                      height: `${(day.completed / day.total) * 100}%`,
                      minHeight: day.completed > 0 ? "8px" : "0px",
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium">{day.day}</div>
                  <div className="text-xs text-muted-foreground">
                    {day.completed}/{day.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">오늘의 습관</CardTitle>
          <CardDescription>체크하여 습관을 완료하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                habit.completed ? "bg-primary/5 border-primary/20" : "bg-card border-border hover:border-primary/30"
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex-shrink-0">
                {habit.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${habit.completed ? "text-primary" : "text-foreground"}`}>
                    {habit.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {habit.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {habit.timeOfDay}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{habit.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    {habit.streak}일 연속
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">이번 주 목표 달성률</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>주간 목표 진행률</span>
              <span className="font-medium">
                {weeklyStats.completedHabits}/{weeklyStats.weeklyGoal}
              </span>
            </div>
            <Progress value={(weeklyStats.completedHabits / weeklyStats.weeklyGoal) * 100} className="h-2" />
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {weeklyStats.weeklyGoal - weeklyStats.completedHabits > 0
                ? `목표까지 ${weeklyStats.weeklyGoal - weeklyStats.completedHabits}개 남았어요!`
                : "이번 주 목표를 달성했어요! 🎉"}
            </p>
            <Link href="/add-habit">
              <Button size="sm" className="mt-2">
                새 습관 추가하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
