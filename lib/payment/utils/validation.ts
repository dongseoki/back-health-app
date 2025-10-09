import { z } from 'zod';
import { 
  paymentFormSchema, 
  paymentInfoSchema, 
  type PaymentFormData, 
  type PaymentInfo,
  type ValidationError 
} from '../schemas';
import { PAYMENT_ROUTES } from '../constants';

// 안전한 파싱 함수
export const safeParse = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: result.success ? [] : result.error.errors,
  };
};

// 폼 데이터를 결제 정보로 변환
export const transformFormDataToPaymentInfo = (
  formData: PaymentFormData,
  orderId: string,
  successUrl?: string,
  failUrl?: string
): PaymentInfo => {
  return {
    orderId,
    orderName: formData.orderName,
    amount: formData.amount,
    customerEmail: formData.customerEmail,
    customerName: formData.customerName,
    customerMobilePhone: formData.customerMobilePhone,
    successUrl: successUrl || `${window.location.origin}${PAYMENT_ROUTES.SUCCESS}`,
    failUrl: failUrl || `${window.location.origin}${PAYMENT_ROUTES.FAIL}`,
  };
};

// 검증 에러 메시지 포맷팅
export const formatValidationErrors = (errors: z.ZodError['errors']): ValidationError[] => {
  return errors.map(error => ({
    field: error.path[0] as keyof PaymentFormData,
    message: error.message,
    code: error.code,
  }));
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 스로틀 함수
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// 필드별 검증 함수 생성기
export const createFieldValidator = <T>(schema: z.ZodSchema<T>) => {
  return (value: unknown): { isValid: boolean; error?: string } => {
    try {
      schema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          error: error.errors[0]?.message || '유효하지 않은 값입니다.' 
        };
      }
      return { isValid: false, error: '알 수 없는 오류가 발생했습니다.' };
    }
  };
};

// 폼 데이터 검증
export const validateFormData = (data: PaymentFormData) => {
  return safeParse(paymentFormSchema, data);
};

// 결제 정보 검증
export const validatePaymentInfo = (data: PaymentInfo) => {
  return safeParse(paymentInfoSchema, data);
};

// 에러 메시지 그룹화
export const groupErrorsByField = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// 첫 번째 에러 메시지 가져오기
export const getFirstError = (errors: ValidationError[], field?: keyof PaymentFormData): string | null => {
  const targetErrors = field ? errors.filter(e => e.field === field) : errors;
  return targetErrors.length > 0 ? targetErrors[0].message : null;
};

// 에러가 있는 필드 목록 가져오기
export const getErrorFields = (errors: ValidationError[]): (keyof PaymentFormData)[] => {
  return [...new Set(errors.map(error => error.field))];
};

// 폼 유효성 상태 확인
export const isFormValid = (errors: ValidationError[]): boolean => {
  return errors.length === 0;
};

// 특정 필드 유효성 확인
export const isFieldValid = (errors: ValidationError[], field: keyof PaymentFormData): boolean => {
  return !errors.some(error => error.field === field);
};

// 검증 결과 요약
export const getValidationSummary = (errors: ValidationError[]) => {
  const fieldErrors = groupErrorsByField(errors);
  const errorFields = getErrorFields(errors);
  
  return {
    isValid: isFormValid(errors),
    errorCount: errors.length,
    errorFields,
    fieldErrors,
    hasFieldError: (field: keyof PaymentFormData) => field in fieldErrors,
    getFieldError: (field: keyof PaymentFormData) => fieldErrors[field]?.[0]?.message || null,
  };
};

// 검증 옵션 생성
export const createValidationOptions = (options: {
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all';
  debounceMs?: number;
  validateOnMount?: boolean;
}) => {
  return {
    mode: options.mode || 'onChange',
    debounceMs: options.debounceMs || 300,
    validateOnMount: options.validateOnMount || false,
  };
};

// 검증 상태 초기화
export const createInitialValidationState = () => ({
  isValid: false,
  errors: [],
  isSubmitting: false,
  isDirty: false,
  touchedFields: [],
});

// 검증 결과 병합
export const mergeValidationResults = (
  ...results: Array<{ isValid: boolean; errors: ValidationError[] }>
) => {
  const allErrors = results.flatMap(result => result.errors);
  const isValid = results.every(result => result.isValid);
  
  return {
    isValid,
    errors: allErrors,
  };
};
