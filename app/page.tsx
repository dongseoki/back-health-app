"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Activity, Heart } from "lucide-react"

const dummyUsers = [
  {
    id: 1,
    name: "김건강",
    age: 28,
    description: "직장인, 하루 8시간 앉아서 근무",
    habits: ["스트레칭", "걷기"],
    streak: 7,
    avatar: "👨‍💼",
  },
  {
    id: 2,
    name: "이운동",
    age: 35,
    description: "프리랜서, 집에서 근무하며 운동 좋아함",
    habits: ["요가", "플랭크", "스쿼트"],
    streak: 14,
    avatar: "🧘‍♀️",
  },
  {
    id: 3,
    name: "박신입",
    age: 24,
    description: "대학생, 허리 건강 관리 시작하는 단계",
    habits: ["기본 스트레칭"],
    streak: 3,
    avatar: "👩‍🎓",
  },
]

export default function LoginAlternative() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId)
    // 실제 앱에서는 여기서 사용자 상태를 설정하고 대시보드로 이동
    setTimeout(() => {
      alert(`${dummyUsers.find((u) => u.id === userId)?.name}님으로 로그인되었습니다!`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">허리 건강습관 트래커</h1>
          <p className="text-muted-foreground text-lg text-pretty">데모 사용자를 선택하여 앱을 체험해보세요</p>
        </div>

        {/* User Selection Cards */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {dummyUsers.map((user) => (
            <Card
              key={user.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedUser === user.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {user.age}세 • {user.description}
                      </CardDescription>
                    </div>
                  </div>
                  {selectedUser === user.id && <CheckCircle2 className="h-6 w-6 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">현재 습관:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.habits.map((habit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {habit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">연속 기록:</span>
                    <Badge variant="outline" className="text-xs">
                      {user.streak}일
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-base font-semibold"
            disabled={!selectedUser}
            onClick={() => selectedUser && handleUserSelect(selectedUser)}
          >
            {selectedUser ? "선택한 사용자로 시작하기" : "사용자를 선택해주세요"}
          </Button>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <a href="/dashboard">대시보드 미리보기</a>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>MVP 데모 버전 • 실제 로그인 기능은 추후 구현 예정</p>
        </div>
      </div>
    </div>
  )
}
