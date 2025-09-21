'use client';

import { PaymentFormData, ValidationErrors } from '@/lib/payment/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BuyerInfoSectionProps {
  formData: PaymentFormData;
  onUpdate: (field: keyof PaymentFormData, value: string) => void;
  errors: ValidationErrors;
}

export default function BuyerInfoSection({ 
  formData, 
  onUpdate, 
  errors 
}: BuyerInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
        구매자 정보
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 구매자명 */}
        <div className="space-y-2">
          <Label htmlFor="buyerName" className="text-sm font-medium">
            구매자명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="buyerName"
            type="text"
            value={formData.buyerName}
            onChange={(e) => onUpdate('buyerName', e.target.value)}
            placeholder="구매자명을 입력하세요"
            className={errors.buyerName ? 'border-red-500' : ''}
          />
          {errors.buyerName && (
            <p className="text-sm text-red-500">{errors.buyerName}</p>
          )}
        </div>

        {/* 휴대폰번호 */}
        <div className="space-y-2">
          <Label htmlFor="buyerPhone" className="text-sm font-medium">
            휴대폰번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="buyerPhone"
            type="tel"
            value={formData.buyerPhone}
            onChange={(e) => onUpdate('buyerPhone', e.target.value)}
            placeholder="010-1234-5678"
            className={errors.buyerPhone ? 'border-red-500' : ''}
          />
          {errors.buyerPhone && (
            <p className="text-sm text-red-500">{errors.buyerPhone}</p>
          )}
        </div>
      </div>

      {/* 이메일 */}
      <div className="space-y-2">
        <Label htmlFor="buyerEmail" className="text-sm font-medium">
          이메일 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="buyerEmail"
          type="email"
          value={formData.buyerEmail}
          onChange={(e) => onUpdate('buyerEmail', e.target.value)}
          placeholder="example@email.com"
          className={errors.buyerEmail ? 'border-red-500' : ''}
        />
        {errors.buyerEmail && (
          <p className="text-sm text-red-500">{errors.buyerEmail}</p>
        )}
      </div>
    </div>
  );
}
