'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

interface PaymentFailData {
  code: string;
  message: string;
  orderId?: string;
}

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failData, setFailData] = useState<PaymentFailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 에러 정보 추출
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    if (code && message) {
      setFailData({
        code,
        message: decodeURIComponent(message),
        orderId: orderId || undefined,
      });
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const getErrorMessage = (code: string) => {
    const errorMessages: Record<string, string> = {
      'PAY_PROCESS_CANCELED': '결제가 취소되었습니다.',
      'PAY_PROCESS_ABORTED': '결제 처리 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드 정보를 확인해주세요.',
      'INVALID_CARD_NUMBER': '유효하지 않은 카드 번호입니다.',
      'INVALID_EXPIRY_DATE': '유효하지 않은 만료일입니다.',
      'INVALID_CVC': '유효하지 않은 CVC입니다.',
      'INSUFFICIENT_FUNDS': '잔액이 부족합니다.',
      'CARD_EXPIRED': '만료된 카드입니다.',
      'CARD_LOST': '분실된 카드입니다.',
      'CARD_STOLEN': '도난된 카드입니다.',
      'UNKNOWN_ERROR': '알 수 없는 오류가 발생했습니다.',
    };

    return errorMessages[code] || '결제 처리 중 오류가 발생했습니다.';
  };

  const getErrorDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다. 다시 시도해주세요.',
      'PAY_PROCESS_ABORTED': '결제 시스템에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거부했습니다. 카드 정보를 확인하거나 다른 카드를 사용해주세요.',
      'INVALID_CARD_NUMBER': '카드 번호가 올바르지 않습니다. 16자리 숫자를 정확히 입력해주세요.',
      'INVALID_EXPIRY_DATE': '카드 만료일이 올바르지 않습니다. MM/YY 형식으로 입력해주세요.',
      'INVALID_CVC': 'CVC 번호가 올바르지 않습니다. 카드 뒷면의 3자리 숫자를 입력해주세요.',
      'INSUFFICIENT_FUNDS': '카드 잔액이 부족합니다. 다른 카드를 사용하거나 잔액을 확인해주세요.',
      'CARD_EXPIRED': '카드가 만료되었습니다. 유효한 카드를 사용해주세요.',
      'CARD_LOST': '분실 신고된 카드입니다. 다른 카드를 사용해주세요.',
      'CARD_STOLEN': '도난 신고된 카드입니다. 다른 카드를 사용해주세요.',
      'UNKNOWN_ERROR': '시스템 오류가 발생했습니다. 고객센터에 문의해주세요.',
    };

    return descriptions[code] || '결제 처리 중 예상치 못한 오류가 발생했습니다.';
  };

  const handleRetryPayment = () => {
    router.push('/test/payment');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">오류 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 실패 메시지 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
          <p className="text-gray-600">
            결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>

        {/* 에러 정보 카드 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              오류 정보
            </CardTitle>
            <CardDescription>
              결제 실패 원인과 해결 방법을 확인해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {failData ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">오류 코드</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {failData.code}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">오류 메시지</label>
                  <p className="text-sm text-gray-900">
                    {getErrorMessage(failData.code)}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">상세 설명</label>
                  <p className="text-sm text-gray-700">
                    {getErrorDescription(failData.code)}
                  </p>
                </div>

                {failData.orderId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">주문번호</label>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {failData.orderId}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">오류 정보를 찾을 수 없습니다.</p>
                <p className="text-sm text-gray-400">
                  URL이 올바르지 않거나 오류 정보가 손실되었을 수 있습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 해결 방법 안내 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">해결 방법</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">카드 정보 확인</p>
                    <p className="text-xs text-gray-600">
                      카드 번호, 만료일, CVC를 정확히 입력했는지 확인해주세요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">다른 카드 사용</p>
                    <p className="text-xs text-gray-600">
                      다른 카드나 결제 수단을 사용해보세요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">잠시 후 재시도</p>
                    <p className="text-xs text-gray-600">
                      일시적인 오류일 수 있으니 잠시 후 다시 시도해주세요
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
            onClick={handleRetryPayment}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 결제하기
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </div>

        {/* 고객센터 안내 */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">문제가 지속되나요?</h3>
          <div className="text-xs text-yellow-800 space-y-1">
            <p>• 고객센터: 1588-0000 (평일 09:00-18:00)</p>
            <p>• 이메일: support@example.com</p>
            <p>• 카카오톡: @example_support</p>
          </div>
        </div>

        {/* 개발자 안내 */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">개발자 안내</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• 이 페이지는 토스페이먼츠 결제 실패 콜백 페이지입니다</p>
            <p>• 실제 에러 처리는 서버에서 별도로 구현해야 합니다</p>
            <p>• 에러 로그를 수집하여 결제 실패 원인을 분석하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
