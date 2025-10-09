import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  paymentFormSchema, 
  fieldValidationSchemas,
  type PaymentFormData, 
  type ValidationResult,
  type ValidationError,
  type PaymentFormField 
} from '../schemas';
import { DEFAULT_PAYMENT_FORM_DATA } from '../constants';

interface UsePaymentValidationOptions {
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all';
  debounceMs?: number;
  validateOnMount?: boolean;
}

export const usePaymentValidation = (options: UsePaymentValidationOptions = {}) => {
  const {
    mode = 'onChange',
    debounceMs = 300,
    validateOnMount = false,
  } = options;

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
  });

  const [isValidating, setIsValidating] = useState(false);

  // React Hook Form 설정
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    mode,
    defaultValues: DEFAULT_PAYMENT_FORM_DATA,
  });

  // 실시간 검증 함수
  const validateField = useCallback(async (field: PaymentFormField, value: any): Promise<ValidationError | null> => {
    try {
      const schema = fieldValidationSchemas[field];
      if (!schema) return null;
      
      await schema.parseAsync(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          field,
          message: error.errors[0].message,
          code: error.errors[0].code,
        };
      }
      return null;
    }
  }, []);

  // 전체 폼 검증
  const validateForm = useCallback(async (data: PaymentFormData): Promise<boolean> => {
    setIsValidating(true);
    try {
      await paymentFormSchema.parseAsync(data);
      setValidationResult({ isValid: true, errors: [] });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path[0] as PaymentFormField,
          message: err.message,
          code: err.code,
        }));
        setValidationResult({ isValid: false, errors });
        return false;
      }
      setValidationResult({ 
        isValid: false, 
        errors: [{ field: 'orderName', message: '알 수 없는 오류가 발생했습니다.', code: 'UNKNOWN_ERROR' }] 
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  // 디바운스된 검증 함수
  const debouncedValidateField = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (field: PaymentFormField, value: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          validateField(field, value);
        }, debounceMs);
      };
    })(),
    [validateField, debounceMs]
  );

  // 폼 값 변경 시 실시간 검증
  useEffect(() => {
    const subscription = form.watch((data, { name, type }) => {
      if (type === 'change' && name && data) {
        debouncedValidateField(name as PaymentFormField, data[name as keyof PaymentFormData]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedValidateField]);

  // 마운트 시 검증
  useEffect(() => {
    if (validateOnMount) {
      const currentData = form.getValues();
      validateForm(currentData);
    }
  }, [validateOnMount, validateForm, form]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async (onValid: (data: PaymentFormData) => void, onInvalid?: (errors: ValidationError[]) => void) => {
    const data = form.getValues();
    const isValid = await validateForm(data);
    
    if (isValid) {
      onValid(data);
    } else {
      onInvalid?.(validationResult.errors);
    }
  }, [form, validateForm, validationResult.errors]);

  // 특정 필드 에러 가져오기
  const getFieldError = useCallback((field: PaymentFormField): ValidationError | undefined => {
    return validationResult.errors.find(error => error.field === field);
  }, [validationResult.errors]);

  // 모든 에러 지우기
  const clearErrors = useCallback(() => {
    setValidationResult({ isValid: false, errors: [] });
    form.clearErrors();
  }, [form]);

  // 특정 필드 에러 지우기
  const clearFieldError = useCallback((field: PaymentFormField) => {
    setValidationResult(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.field !== field),
    }));
    form.clearErrors(field);
  }, [form]);

  // 폼 리셋
  const resetForm = useCallback((values?: Partial<PaymentFormData>) => {
    form.reset(values || DEFAULT_PAYMENT_FORM_DATA);
    clearErrors();
  }, [form, clearErrors]);

  return {
    // 폼 관련
    form,
    handleSubmit,
    resetForm,
    
    // 검증 관련
    validationResult,
    isValidating,
    validateField,
    validateForm,
    getFieldError,
    clearErrors,
    clearFieldError,
    
    // 상태
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
};
