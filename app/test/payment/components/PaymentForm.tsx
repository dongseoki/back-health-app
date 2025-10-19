'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { paymentFormSchema, type PaymentFormData } from '@/lib/payment/schemas';
import { usePaymentValidation } from '@/lib/payment/hooks/usePaymentValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

export function PaymentForm({ onSubmit, isLoading = false }: PaymentFormProps) {
  const {
    form,
    validationResult,
    getFieldError,
    clearFieldError,
  } = usePaymentValidation({
    mode: 'onChange',
    debounceMs: 300,
    validateOnMount: false,
  });

  const { register, handleSubmit, formState: { errors, isDirty, isValid } } = form;

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  const handleFieldChange = (field: keyof PaymentFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      clearFieldError(field);
    };
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">주문 정보 입력</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          결제 테스트를 위한 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* 주문명 */}
          <div className="space-y-2">
            <Label htmlFor="orderName" className="text-sm font-medium">
              주문명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="orderName"
              type="text"
              placeholder="예: 백건강 앱 구독"
              {...register('orderName')}
              onChange={(e) => {
                register('orderName').onChange(e);
                handleFieldChange('orderName')(e);
              }}
              className={getFieldError('orderName') ? 'border-red-500' : ''}
            />
            {getFieldError('orderName') && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('orderName')?.message}</span>
              </div>
            )}
          </div>

          {/* 결제 금액 */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              결제 금액 <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                {...register('amount', { valueAsNumber: true })}
                onChange={(e) => {
                  register('amount').onChange(e);
                  handleFieldChange('amount')(e);
                }}
                className={`pr-8 ${getFieldError('amount') ? 'border-red-500' : ''}`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            {getFieldError('amount') && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('amount')?.message}</span>
              </div>
            )}
          </div>

          {/* 고객 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="customerEmail" className="text-sm font-medium">
              고객 이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="customer@example.com"
              {...register('customerEmail')}
              onChange={(e) => {
                register('customerEmail').onChange(e);
                handleFieldChange('customerEmail')(e);
              }}
              className={getFieldError('customerEmail') ? 'border-red-500' : ''}
            />
            {getFieldError('customerEmail') && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('customerEmail')?.message}</span>
              </div>
            )}
          </div>

          {/* 고객명 */}
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-sm font-medium">
              고객명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              type="text"
              placeholder="김토스"
              {...register('customerName')}
              onChange={(e) => {
                register('customerName').onChange(e);
                handleFieldChange('customerName')(e);
              }}
              className={getFieldError('customerName') ? 'border-red-500' : ''}
            />
            {getFieldError('customerName') && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('customerName')?.message}</span>
              </div>
            )}
          </div>

          {/* 휴대폰 번호 (선택사항) */}
          <div className="space-y-2">
            <Label htmlFor="customerMobilePhone" className="text-sm font-medium">
              휴대폰 번호 <span className="text-muted-foreground">(선택사항)</span>
            </Label>
            <Input
              id="customerMobilePhone"
              type="tel"
              placeholder="01012345678"
              {...register('customerMobilePhone')}
              onChange={(e) => {
                register('customerMobilePhone').onChange(e);
                handleFieldChange('customerMobilePhone')(e);
              }}
              className={getFieldError('customerMobilePhone') ? 'border-red-500' : ''}
            />
            {getFieldError('customerMobilePhone') && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{getFieldError('customerMobilePhone')?.message}</span>
              </div>
            )}
          </div>

          {/* 폼 상태 표시 */}
          {validationResult.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                입력한 정보를 확인해주세요. {validationResult.errors.length}개의 오류가 있습니다.
              </AlertDescription>
            </Alert>
          )}

          {isValid && isDirty && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                모든 정보가 올바르게 입력되었습니다.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '다음 단계로'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
