'use client';

import { PaymentFormData, ValidationErrors } from '@/lib/payment/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderInfoSectionProps {
  formData: PaymentFormData;
  onUpdate: (field: keyof PaymentFormData, value: string | number) => void;
  errors: ValidationErrors;
}

export default function OrderInfoSection({ 
  formData, 
  onUpdate, 
  errors 
}: OrderInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
        주문 정보
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 주문번호 */}
        <div className="space-y-2">
          <Label htmlFor="orderId" className="text-sm font-medium">
            주문번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="orderId"
            type="text"
            value={formData.orderId}
            onChange={(e) => onUpdate('orderId', e.target.value)}
            placeholder="주문번호를 입력하세요"
            className={errors.orderId ? 'border-red-500' : ''}
          />
          {errors.orderId && (
            <p className="text-sm text-red-500">{errors.orderId}</p>
          )}
        </div>

        {/* 상품명 */}
        <div className="space-y-2">
          <Label htmlFor="productName" className="text-sm font-medium">
            상품명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="productName"
            type="text"
            value={formData.productName}
            onChange={(e) => onUpdate('productName', e.target.value)}
            placeholder="상품명을 입력하세요"
            className={errors.productName ? 'border-red-500' : ''}
          />
          {errors.productName && (
            <p className="text-sm text-red-500">{errors.productName}</p>
          )}
        </div>
      </div>

      {/* 금액 */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          결제 금액 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => onUpdate('amount', parseInt(e.target.value) || 0)}
            placeholder="결제 금액을 입력하세요"
            className={`pr-8 ${errors.amount ? 'border-red-500' : ''}`}
            min="100"
            max="999999999"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            원
          </span>
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>
    </div>
  );
}
