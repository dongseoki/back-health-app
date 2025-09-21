'use client';

import { useState } from 'react';
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
}

export default function PaymentForm({ 
  initialData, 
  onSubmit, 
  isLoading, 
  errors 
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>(initialData);

  // 폼 데이터 업데이트
  const updateFormData = (field: keyof PaymentFormData, value: string | number | PaymentMethod) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
