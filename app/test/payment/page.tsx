'use client';

import { useState, useRef } from 'react';
import { PaymentFormData, PaymentMethod, ValidationErrors } from '@/lib/payment/types';
import { PaymentValidator } from '@/lib/payment/validation';
import { KCPService } from '@/lib/payment/services';
import PaymentForm from './components/PaymentForm';
import KCPPaymentHandler from './components/KCPPaymentHandler';
import { useKCPPayment } from './hooks/useKCPPayment';
import { setInputValues, clearInputValues, setTestData, BuyerInfo, UpdateFormDataFunction } from './utils/test-utils';

export default function PaymentTestPage() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const updateFormDataRef = useRef<UpdateFormDataFunction | null>(null);

  // KCP 결제 훅 사용
  const { 
    executePayment, 
    isLoading, 
    paymentStatus, 
    error: paymentError,
    transactionId,
    orderId,
    resetPayment 
  } = useKCPPayment();

  // 기본 폼 데이터
  const initialFormData: PaymentFormData = {
    orderId: `TEST_${Date.now()}`,
    productName: '테스트 상품',
    amount: 1000,
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    paymentMethod: PaymentMethod.CARD
  };

  // 폼 제출 핸들러
  const handleSubmit = async (formData: PaymentFormData) => {
    setErrors({});
    setPaymentResult(null);

    try {
      // 1. 폼 검증
      const validation = PaymentValidator.validateForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // 2. 결제 실행
      await executePayment(formData);
      
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      setErrors({ general: '결제 처리 중 오류가 발생했습니다.' });
    }
  };

  // 결제 완료 콜백
  const handlePaymentComplete = (result: any) => {
    setPaymentResult(result);
    alert('결제가 완료되었습니다!');
    console.log('결제 성공:', result);
  };

  // 결제 에러 콜백
  const handlePaymentError = (error: string) => {
    setErrors({ general: error });
    alert(`결제 실패: ${error}`);
    console.error('결제 실패:', error);
  };

  // PaymentForm에서 updateFormData 함수를 받아오는 콜백
  const handleFormDataUpdate = (updateFn: UpdateFormDataFunction) => {
    updateFormDataRef.current = updateFn;
  };

  // 테스트 데이터 설정 함수
  const handleSetTestData = () => {
    if (!updateFormDataRef.current) {
      console.log('폼 데이터 업데이트 함수가 아직 준비되지 않았습니다.');
      return;
    }
    
    const success = setTestData(updateFormDataRef.current);
    if (success) {
      console.log('테스트 데이터가 설정되었습니다.');
    } else {
      console.log('테스트 데이터 설정에 실패했습니다.');
    }
  };

  // input 값들 초기화 함수
  const handleClearValues = () => {
    if (!updateFormDataRef.current) {
      console.log('폼 데이터 업데이트 함수가 아직 준비되지 않았습니다.');
      return;
    }
    
    const success = clearInputValues(updateFormDataRef.current);
    if (success) {
      console.log('입력값들이 초기화되었습니다.');
      alert('입력값들이 초기화되었습니다.');
    } else {
      console.log('입력값 초기화에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* KCP 결제 핸들러 */}
      <KCPPaymentHandler
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              결제 테스트 페이지
            </h1>
            <p className="text-gray-600">
              KCP 결제 연동 테스트를 위한 페이지입니다.
            </p>
            
            {/* 결제 상태 표시 */}
            {paymentStatus !== 'PENDING' && (
              <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-blue-800 text-sm">
                  결제 상태: {paymentStatus} 
                  {transactionId && ` | 거래ID: ${transactionId}`}
                  {orderId && ` | 주문ID: ${orderId}`}
                </p>
              </div>
            )}

            {/* 테스트 유틸리티 버튼들 */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-gray-800 font-medium mb-3">테스트 유틸리티</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSetTestData}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  테스트 데이터 설정
                </button>
                <button
                  onClick={handleClearValues}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  입력값 초기화
                </button>
              </div>
            </div>
          </div>

          <PaymentForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
            onFormDataUpdate={handleFormDataUpdate}
          />

          {errors.general && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* 결제 결과 표시 */}
          {paymentResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-green-800 font-medium mb-2">결제 완료</h3>
              <div className="text-green-700 text-sm space-y-1">
                <p>주문번호: {paymentResult.orderId}</p>
                <p>거래번호: {paymentResult.transactionId}</p>
                <p>결제수단: {paymentResult.paymentMethod}</p>
                <p>결제금액: {paymentResult.amount?.toLocaleString()}원</p>
              </div>
              <button
                onClick={resetPayment}
                className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                새 결제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
