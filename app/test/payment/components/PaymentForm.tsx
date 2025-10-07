'use client';

import React, { useState, useCallback } from 'react';
import { PaymentFormData, ValidationErrors, PaymentMethod } from '@/lib/payment/types';
import OrderInfoSection from './OrderInfoSection';
import BuyerInfoSection from './BuyerInfoSection';
import PaymentMethodSection from './PaymentMethodSection';
import PaymentButton from './PaymentButton';

interface PaymentFormProps {
  initialData: PaymentFormData;
  onSubmit: (data: PaymentFormData) => void;
  isLoading: boolean;
  errors: ValidationErrors;
  onFormDataUpdate?: (updateFn: (field: string, value: string | number) => void) => void;
}

export default function PaymentForm({ 
  initialData, 
  onSubmit, 
  isLoading, 
  errors,
  onFormDataUpdate
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>(initialData);

  // 폼 데이터 업데이트 (useCallback으로 메모이제이션)
  const updateFormData = useCallback((field: keyof PaymentFormData, value: string | number | PaymentMethod) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 외부에서 updateFormData 함수에 접근할 수 있도록 제공
  React.useEffect(() => {
    if (onFormDataUpdate) {
      // 타입을 맞추기 위해 래퍼 함수 생성
      const wrapperUpdateFn = (field: string, value: string | number) => {
        updateFormData(field as keyof PaymentFormData, value as string | number | PaymentMethod);
      };
      onFormDataUpdate(wrapperUpdateFn);
    }
  }, [onFormDataUpdate, updateFormData]);

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 주문 정보 섹션 */}
      <OrderInfoSection
        formData={formData}
        onUpdate={updateFormData}
        errors={errors}
      />

      {/* 구매자 정보 섹션 */}
      <BuyerInfoSection
        formData={formData}
        onUpdate={updateFormData}
        errors={errors}
      />

      {/* 결제 수단 섹션 */}
      <PaymentMethodSection
        formData={formData}
        onUpdate={updateFormData}
        errors={errors}
      />

      {/* 결제 버튼 */}
      <PaymentButton isLoading={isLoading} />
    </form>
  );
}
