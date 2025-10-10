'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { type PaymentFormData } from '@/lib/payment/schemas';

interface PaymentSummaryProps {
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  discountAmount?: number;
  className?: string;
}

export function PaymentSummary({
  orderName,
  amount,
  customerName,
  customerEmail,
  discountAmount = 0,
  className = '',
}: PaymentSummaryProps) {
  const finalAmount = amount - discountAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">결제 요약</CardTitle>
        <CardDescription>주문 정보를 확인해주세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 주문 상품 정보 */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">상품명</h4>
              <p className="text-sm text-muted-foreground">{orderName}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              상품
            </Badge>
          </div>

          <Separator />

          {/* 금액 정보 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">상품 금액</span>
              <span className="font-medium">{formatCurrency(amount)}원</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>할인 금액</span>
                <span>-{formatCurrency(discountAmount)}원</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>최종 결제 금액</span>
              <span className="text-primary">{formatCurrency(finalAmount)}원</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* 고객 정보 */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">고객 정보</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">고객명</span>
              <span>{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">이메일</span>
              <span className="text-right break-all">{customerEmail}</span>
            </div>
          </div>
        </div>

        {/* 결제 안내 */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">결제 안내</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다</li>
                <li>• 카드, 계좌이체, 간편결제 등 다양한 결제수단을 지원합니다</li>
                <li>• 결제 완료 후 이메일로 영수증이 발송됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
