"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Crown, Gift, TrendingUp, Users, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  // Mock subscription data - in real app this would come from payment processing
  const subscriptionData = {
    plan: "프리미엄",
    price: "9,900원",
    period: "월",
    startDate: "2024년 1월 15일",
    nextBilling: "2024년 2월 15일",
    features: [
      "무제한 습관 추적",
      "고급 분석 및 인사이트",
      "개인 맞춤 운동 프로그램",
      "전문가 상담 (월 1회)",
      "광고 없는 경험",
    ],
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4 pt-8">
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="h-20 w-20 text-primary" />
            <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1">
              <Crown className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground text-balance">구독이 성공적으로 완료되었습니다!</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            이제 프리미엄 기능으로 더 나은 허리 건강을 관리하세요
          </p>
        </div>
      </div>

      {/* Subscription Details Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm">
              <Crown className="h-4 w-4 mr-2" />
              {subscriptionData.plan} 플랜
            </Badge>
          </div>
          <CardTitle className="text-xl">구독 정보</CardTitle>
          <CardDescription>
            {subscriptionData.price}/{subscriptionData.period} 플랜이 활성화되었습니다
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">구독 시작일</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {subscriptionData.startDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">다음 결제일</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {subscriptionData.nextBilling}
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center">
              <Gift className="h-5 w-5 mr-2 text-primary" />
              이제 사용할 수 있는 기능들
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {subscriptionData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            다음 단계
          </CardTitle>
          <CardDescription>프리미엄 기능을 활용해 건강한 습관을 시작해보세요</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard" className="block">
              <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">대시보드로 이동</h4>
                    <p className="text-sm text-muted-foreground">습관 추적을 시작하세요</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/add-habit" className="block">
              <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">새 습관 추가</h4>
                    <p className="text-sm text-muted-foreground">맞춤 운동 프로그램 설정</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          <Button className="w-full mt-6" asChild>
            <Link href="/dashboard">
              <TrendingUp className="h-4 w-4 mr-2" />
              건강한 습관 여정 시작하기
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-foreground">함께하는 건강한 커뮤니티</h3>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2 text-primary">
                <Users className="h-4 w-4" />
                <span>10,000+ 사용자</span>
              </div>
              <div className="flex items-center space-x-2 text-primary">
                <Star className="h-4 w-4" />
                <span>평균 4.8점</span>
              </div>
              <div className="flex items-center space-x-2 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span>85% 습관 성공률</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">언제든지 구독을 취소하거나 플랜을 변경할 수 있습니다</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-center space-y-2 pt-4">
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">
            고객 지원
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            구독 관리
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            환불 정책
          </Link>
        </div>
      </div>
    </div>
  )
}
