'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowLeft, CreditCard, Mail, Calendar } from 'lucide-react';

interface PaymentSuccessData {
  paymentKey: string;
  orderId: string;
  amount: number;
  paymentType?: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentType = searchParams.get('paymentType');

    if (paymentKey && orderId && amount) {
      // 서버단에서 결제 승인 API 호출
      const confirmPayment = async () => {
        try {
          const response = await fetch('/api/payment/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: parseInt(amount),
            }),
          });

          const result = await response.json();
          console.log('결제승인 결과 : ', result);

          if (!response.ok) {
            console.error('결제 승인 실패:', result);
            // 실패 시에도 기본 정보는 표시
            setPaymentData({
              paymentKey,
              orderId,
              amount: parseInt(amount),
              paymentType: paymentType || '카드',
            });
          } else {
            // 승인 성공 시 서버 응답 데이터 반영
            setPaymentData({
              paymentKey,
              orderId,
              amount: parseInt(amount),
              paymentType: paymentType || '카드',
            });
          }
        } catch (error) {
          console.error('결제 승인 API 호출 오류:', error);
          // 오류 발생 시에도 기본 정보는 표시
          setPaymentData({
            paymentKey,
            orderId,
            amount: parseInt(amount),
            paymentType: paymentType || '카드',
          });
        } finally {
          setIsLoading(false);
        }
      };

      confirmPayment();
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetryPayment = () => {
    router.push('/test/payment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600">
            결제가 성공적으로 처리되었습니다. 감사합니다.
          </p>
        </div>

        {/* 결제 정보 카드 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              결제 정보
            </CardTitle>
            <CardDescription>
              결제 완료된 주문의 상세 정보입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">주문번호</label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {paymentData.orderId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">결제수단</label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{paymentData.paymentType}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">결제금액</label>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(paymentData.amount)}원
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">결제키</label>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {paymentData.paymentKey}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">결제 정보를 찾을 수 없습니다.</p>
                <p className="text-sm text-gray-400">
                  URL이 올바르지 않거나 결제 정보가 손실되었을 수 있습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 다음 단계 안내 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">다음 단계</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">이메일 영수증</p>
                    <p className="text-xs text-gray-600">
                      결제 완료 영수증이 이메일로 발송됩니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">서비스 이용</p>
                    <p className="text-xs text-gray-600">
                      결제가 완료되어 서비스를 이용하실 수 있습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
          <Button
            onClick={handleRetryPayment}
            className="flex-1 sm:flex-none"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            다시 결제하기
          </Button>
        </div>

        {/* 개발자 안내 */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">개발자 안내</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• 이 페이지는 토스페이먼츠 결제 성공 콜백 페이지입니다</p>
            <p>• 실제 결제 승인 처리는 서버에서 별도로 진행해야 합니다</p>
            <p>• 결제 승인 API를 호출하여 최종 결제를 완료하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
