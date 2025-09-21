'use client';

import { PaymentFormData, ValidationErrors, PaymentMethod } from '@/lib/payment/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSectionProps {
  formData: PaymentFormData;
  onUpdate: (field: keyof PaymentFormData, value: PaymentMethod) => void;
  errors: ValidationErrors;
}

const paymentMethods = [
  { value: PaymentMethod.CARD, label: '신용카드' },
  { value: PaymentMethod.BANK_TRANSFER, label: '계좌이체' },
  { value: PaymentMethod.VIRTUAL_ACCOUNT, label: '가상계좌' },
  { value: PaymentMethod.PHONE, label: '휴대폰' },
  { value: PaymentMethod.POINT, label: '포인트' },
  { value: PaymentMethod.GIFT_CARD, label: '상품권' }
];

export default function PaymentMethodSection({ 
  formData, 
  onUpdate, 
  errors 
}: PaymentMethodSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
        결제 수단
      </h2>
      
      <div className="space-y-2">
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => onUpdate('paymentMethod', value as PaymentMethod)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={method.value} 
                id={method.value}
                className={errors.paymentMethod ? 'border-red-500' : ''}
              />
              <Label 
                htmlFor={method.value}
                className="text-sm font-medium cursor-pointer"
              >
                {method.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {errors.paymentMethod && (
          <p className="text-sm text-red-500">{errors.paymentMethod}</p>
        )}
      </div>
    </div>
  );
}
