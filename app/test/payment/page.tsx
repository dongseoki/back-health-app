'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentForm } from './components/PaymentForm';
import { PaymentSummary } from './components/PaymentSummary';
import { PaymentWidget } from './components/PaymentWidget';
import { PaymentButtons } from './components/PaymentButtons';
import { type PaymentFormData, type PaymentInfo, type PaymentResult } from '@/lib/payment/schemas';
import { transformFormDataToPaymentInfo } from '@/lib/payment/utils/validation';
import { PAYMENT_ROUTES } from '@/lib/payment/constants';

export default function PaymentTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PaymentFormData | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  // 폼 제출 처리
  const handleFormSubmit = (data: PaymentFormData) => {
    setFormData(data);
    
    // 결제 정보 생성
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentInfo = transformFormDataToPaymentInfo(
      data,
      orderId,
      `${window.location.origin}${PAYMENT_ROUTES.SUCCESS}`,
      `${window.location.origin}${PAYMENT_ROUTES.FAIL}`
    );
    
    setPaymentInfo(paymentInfo);
    setIsPaymentReady(true);
  };

  // 결제 성공 처리
  const handlePaymentSuccess = (result: PaymentResult) => {
    console.log('결제 성공:', result);
    setIsProcessing(false);
    // 성공 페이지로 리다이렉트 (토스페이먼츠에서 자동으로 처리됨)
  };

  // 결제 실패 처리
  const handlePaymentFail = (result: PaymentResult) => {
    console.error('결제 실패:', result);
    setIsProcessing(false);
    // 실패 페이지로 리다이렉트 (토스페이먼츠에서 자동으로 처리됨)
  };

  // 결제 요청 처리
  const handlePayment = () => {
    if (!paymentInfo) return;
    
    setIsProcessing(true);
    // PaymentWidget에서 실제 결제 요청을 처리
  };

  // 취소 처리
  const handleCancel = () => {
    setFormData(null);
    setPaymentInfo(null);
    setIsPaymentReady(false);
    setIsProcessing(false);
    setSelectedPaymentMethod('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제 테스트 페이지</h1>
          <p className="text-gray-600">
            토스페이먼츠 결제 시스템을 테스트할 수 있습니다
          </p>
        </div>

        <div className="space-y-8">
          {/* 1단계: 주문 정보 입력 */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">1단계: 주문 정보 입력</h2>
              <p className="text-gray-600 text-sm">
                결제 테스트를 위한 기본 정보를 입력해주세요
              </p>
            </div>
            <PaymentForm 
              onSubmit={handleFormSubmit}
              isLoading={isProcessing}
            />
          </section>

          {/* 2단계: 결제 요약 */}
          {formData && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">2단계: 결제 요약</h2>
                <p className="text-gray-600 text-sm">
                  입력한 정보를 확인해주세요
                </p>
              </div>
              <PaymentSummary
                orderName={formData.orderName}
                amount={formData.amount}
                customerName={formData.customerName}
                customerEmail={formData.customerEmail}
              />
            </section>
          )}

          {/* 3단계: 결제 수단 선택 */}
          {isPaymentReady && paymentInfo && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">3단계: 결제 수단 선택</h2>
                <p className="text-gray-600 text-sm">
                  원하는 결제 방법을 선택하고 약관에 동의해주세요
                </p>
              </div>
              <PaymentWidget
                paymentInfo={paymentInfo}
                onSuccess={handlePaymentSuccess}
                onFail={handlePaymentFail}
                isReady={isPaymentReady}
              />
            </section>
          )}

          {/* 4단계: 결제 버튼 */}
          {isPaymentReady && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">4단계: 결제 진행</h2>
                <p className="text-gray-600 text-sm">
                  모든 정보를 확인한 후 결제를 진행해주세요
                </p>
              </div>
              <PaymentButtons
                onPayment={handlePayment}
                onCancel={handleCancel}
                isLoading={isProcessing}
                isDisabled={!isPaymentReady}
                paymentMethod={selectedPaymentMethod}
              />
            </section>
          )}
        </div>

        {/* 개발자 안내 */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">개발자 안내</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• 이 페이지는 토스페이먼츠 결제 시스템 테스트용입니다</p>
            <p>• 실제 결제가 발생하지 않으며, 테스트 환경에서만 사용됩니다</p>
            <p>• 결제 성공/실패는 토스페이먼츠 샌드박스 환경에서 시뮬레이션됩니다</p>
            <p>• 테스트 카드 번호: 4242-4242-4242-4242 (유효기간: 12/34, CVC: 123)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
