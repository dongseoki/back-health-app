"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Crown, Shield, TrendingUp, Users, CreditCard, Lock } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "basic",
    name: "베이직",
    price: "무료",
    period: "",
    description: "기본적인 습관 추적 기능",
    features: ["최대 3개 습관 추적", "기본 통계 보기", "일일 체크인", "기본 알림"],
    limitations: ["제한된 분석 기능", "광고 포함", "기본 지원만"],
    popular: false,
    current: true,
  },
  {
    id: "premium",
    name: "프리미엄",
    price: "9,900",
    period: "/월",
    description: "완전한 허리 건강 관리 솔루션",
    features: [
      "무제한 습관 추적",
      "고급 분석 및 인사이트",
      "개인 맞춤 운동 프로그램",
      "전문가 상담 (월 1회)",
      "상세한 진행률 리포트",
      "우선 고객 지원",
      "광고 없는 경험",
      "데이터 백업 및 동기화",
    ],
    limitations: [],
    popular: true,
    current: false,
  },
  {
    id: "family",
    name: "패밀리",
    price: "16,900",
    period: "/월",
    description: "가족 모두의 건강한 습관 관리",
    features: [
      "최대 4명 계정",
      "프리미엄 모든 기능",
      "가족 대시보드",
      "그룹 챌린지",
      "가족 건강 리포트",
      "전문가 상담 (월 2회)",
      "우선 고객 지원",
    ],
    limitations: [],
    popular: false,
    current: false,
  },
]

const paymentMethods = [
  { id: "card", name: "신용카드", icon: CreditCard },
  { id: "bank", name: "계좌이체", icon: Shield },
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [selectedPayment, setSelectedPayment] = useState("card")
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
  })

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    if (planId !== "basic") {
      setShowPaymentForm(true)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = "/success"
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

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
          <h1 className="text-2xl font-bold text-foreground">프리미엄 플랜 선택</h1>
          <p className="text-muted-foreground">더 나은 허리 건강을 위한 투자를 시작하세요</p>
        </div>
      </div>

      {/* Trust Badge */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Shield className="h-4 w-4" />
              <span>안전한 결제</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <Users className="h-4 w-4" />
              <span>10,000+ 사용자</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>평균 85% 습관 성공률</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPlan === plan.id ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50"
            } ${plan.popular ? "ring-2 ring-accent/20" : ""}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground px-3 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  인기
                </Badge>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-3 right-4">
                <Badge variant="outline" className="bg-background">
                  현재 플랜
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground font-medium">제한사항:</p>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-muted-foreground rounded-full flex-shrink-0 mt-2" />
                      <span className="text-xs text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className={`w-full mt-4 ${
                  selectedPlan === plan.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "현재 사용 중" : selectedPlan === plan.id ? "선택됨" : "선택하기"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Form */}
      {showPaymentForm && selectedPlanData && selectedPlan !== "basic" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" />
              결제 정보
            </CardTitle>
            <CardDescription>
              {selectedPlanData.name} 플랜 ({selectedPlanData.price}
              {selectedPlanData.period})을 결제합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">결제 방법</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {selectedPayment === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">카드 번호</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">유효기간</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holderName">카드 소유자명</Label>
                    <Input
                      id="holderName"
                      placeholder="홍길동"
                      value={paymentData.holderName}
                      onChange={(e) => setPaymentData((prev) => ({ ...prev, holderName: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  모든 결제 정보는 SSL로 암호화되어 안전하게 처리됩니다
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowPaymentForm(false)}
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  {selectedPlanData.price} 결제하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center space-y-2 pt-6">
        <p className="text-xs text-muted-foreground">언제든지 플랜을 변경하거나 취소할 수 있습니다</p>
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary">
            이용약관
          </Link>
          <Link href="#" className="hover:text-primary">
            개인정보처리방침
          </Link>
          <Link href="#" className="hover:text-primary">
            환불정책
          </Link>
        </div>
      </div>
    </div>
  )
}
