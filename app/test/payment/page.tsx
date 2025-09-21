'use client';

import { useState } from 'react';
import { PaymentFormData, PaymentMethod, ValidationErrors } from '@/lib/payment/types';
import { PaymentValidator } from '@/lib/payment/validation';
import { KCPService } from '@/lib/payment/services';
import PaymentForm from './components/PaymentForm';

export default function PaymentTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

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
    setIsLoading(true);
    setErrors({});

    try {
      // 1. 폼 검증
      const validation = PaymentValidator.validateForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // 2. KCP 스크립트 로드 확인
      if (!KCPService.isKCPScriptLoaded()) {
        await KCPService.loadKCPScript();
      }

      // 3. 결제 실행
      const result = await KCPService.executePayment(formData);
      
      if (result.success) {
        alert('결제가 완료되었습니다!');
        console.log('결제 성공:', result);
      } else {
        alert(`결제 실패: ${result.message}`);
        console.error('결제 실패:', result);
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      setErrors({ general: '결제 처리 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              결제 테스트 페이지
            </h1>
            <p className="text-gray-600">
              KCP 결제 연동 테스트를 위한 페이지입니다.
            </p>
          </div>

          <PaymentForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
          />

          {errors.general && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
