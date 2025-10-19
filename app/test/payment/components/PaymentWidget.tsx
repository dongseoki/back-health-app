'use client';

import { useEffect, useState, useRef } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { type PaymentInfo, type PaymentResult } from '@/lib/payment/schemas';
import { TOSS_PAYMENTS_CONFIG, WIDGET_CONFIG } from '@/lib/payment/constants';

interface PaymentWidgetProps {
  paymentInfo: PaymentInfo;
  onSuccess: (result: PaymentResult) => void;
  onFail: (result: PaymentResult) => void;
  isReady?: boolean;
}

export function PaymentWidget({ 
  paymentInfo, 
  onSuccess, 
  onFail, 
  isReady = false 
}: PaymentWidgetProps) {
  const [widgets, setWidgets] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  // 토스페이먼츠 SDK 초기화
  useEffect(() => {
    const initializeTossPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tossPayments = await loadTossPayments(TOSS_PAYMENTS_CONFIG.CLIENT_KEY);
        
        // 회원 결제용 위젯 생성
        const widgets = tossPayments.widgets({
          customerKey: `${TOSS_PAYMENTS_CONFIG.CUSTOMER_KEY_PREFIX}_${Date.now()}`,
        });

        setWidgets(widgets);
      } catch (err) {
        console.error('토스페이먼츠 초기화 실패:', err);
        setError('결제 시스템을 초기화하는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTossPayments();
  }, []);

  // 위젯 렌더링
  useEffect(() => {
    const renderWidgets = async () => {
      if (!widgets || !isReady || !paymentMethodRef.current || !agreementRef.current) {
        return;
      }

      try {
        // 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: paymentInfo.amount,
        });

        // 결제 UI 렌더링
        await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: WIDGET_CONFIG.VARIANT_KEY,
        });

        // 약관 UI 렌더링
        await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: WIDGET_CONFIG.AGREEMENT_VARIANT_KEY,
        });

        setIsWidgetReady(true);
      } catch (err) {
        console.error('위젯 렌더링 실패:', err);
        setError('결제 위젯을 불러오는 중 오류가 발생했습니다.');
      }
    };

    renderWidgets();
  }, [widgets, isReady, paymentInfo.amount]);

  // 결제 요청
  const handlePayment = async () => {
    if (!widgets || !isWidgetReady) {
      setError('결제 시스템이 준비되지 않았습니다.');
      return;
    }

    try {
      setError(null);
      
      await widgets.requestPayment({
        orderId: paymentInfo.orderId,
        orderName: paymentInfo.orderName,
        successUrl: paymentInfo.successUrl,
        failUrl: paymentInfo.failUrl,
        customerEmail: paymentInfo.customerEmail,
        customerName: paymentInfo.customerName,
        customerMobilePhone: paymentInfo.customerMobilePhone,
      });
    } catch (err) {
      console.error('결제 요청 실패:', err);
      onFail({
        status: 'failed',
        errorCode: 'PAYMENT_REQUEST_FAILED',
        errorMessage: '결제 요청 중 오류가 발생했습니다.',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">결제 시스템을 초기화하는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">결제 수단 선택</CardTitle>
        <CardDescription>
          원하는 결제 방법을 선택하고 이용약관에 동의해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 결제 수단 선택 UI */}
        <div className="space-y-4">
          <div 
            id="payment-method" 
            ref={paymentMethodRef}
            className="min-h-[200px] border rounded-lg p-4"
          >
            {!isWidgetReady && (
              <div className="flex items-center justify-center h-32">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">결제 수단을 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 이용약관 UI */}
        <div className="space-y-4">
          <div 
            id="agreement" 
            ref={agreementRef}
            className="min-h-[100px] border rounded-lg p-4"
          >
            {!isWidgetReady && (
              <div className="flex items-center justify-center h-20">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">약관을 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 결제 안내 */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">결제 안내</h4>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• 카드, 계좌이체, 간편결제 등 다양한 결제수단을 지원합니다</li>
              <li>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다</li>
              <li>• 결제 완료 후 이메일로 영수증이 발송됩니다</li>
              <li>• 이용약관에 동의해야 결제를 진행할 수 있습니다</li>
            </ul>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="pt-4">
          <button
            onClick={handlePayment}
            disabled={!isWidgetReady}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isWidgetReady ? '결제하기' : '결제 시스템 준비 중...'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
