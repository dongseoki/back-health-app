'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, X } from 'lucide-react';

interface PaymentButtonsProps {
  onPayment: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  paymentMethod?: string;
  className?: string;
}

export function PaymentButtons({
  onPayment,
  onCancel,
  isLoading = false,
  isDisabled = false,
  paymentMethod,
  className = '',
}: PaymentButtonsProps) {
  const getPaymentButtonText = () => {
    if (isLoading) return '결제 처리 중...';
    if (paymentMethod) return `${paymentMethod}로 결제하기`;
    return '결제하기';
  };

  const getPaymentButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    return <CreditCard className="h-4 w-4" />;
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 결제하기 버튼 */}
          <Button
            onClick={onPayment}
            disabled={isDisabled || isLoading}
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              {getPaymentButtonIcon()}
              <span>{getPaymentButtonText()}</span>
            </div>
          </Button>

          {/* 취소하기 버튼 */}
          <Button
            onClick={onCancel}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span>취소하기</span>
            </div>
          </Button>
        </div>

        {/* 결제 안내 메시지 */}
        {paymentMethod && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">선택된 결제 수단: {paymentMethod}</p>
                <p className="text-blue-600 mt-1">
                  결제하기 버튼을 클릭하면 {paymentMethod} 결제창이 열립니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 상태 안내 */}
        {isLoading && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
              <p className="text-sm text-yellow-800">
                결제를 처리하는 중입니다. 잠시만 기다려주세요...
              </p>
            </div>
          </div>
        )}

        {/* 비활성화 상태 안내 */}
        {isDisabled && !isLoading && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <p className="text-sm text-gray-600">
                결제 정보를 모두 입력하고 약관에 동의해주세요.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
