import { PaymentFormData, ValidationError, ValidationResult } from './types';

// 필드별 검증 규칙
export interface ValidationRules {
  orderName: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  amount: {
    required: boolean;
    min: number;
    max: number;
  };
  customerEmail: {
    required: boolean;
    pattern: RegExp;
  };
  customerName: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  customerMobilePhone: {
    required: boolean;
    pattern: RegExp;
  };
}

// 검증 함수 타입
export type ValidationFunction<T> = (value: T) => ValidationError | null;

// 기본 검증 규칙
export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  orderName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  amount: {
    required: true,
    min: 100,
    max: 10000000,
  },
  customerEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  customerName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  customerMobilePhone: {
    required: false,
    pattern: /^[0-9]{8,15}$/,
  },
};

// 개별 필드 검증 함수들
export const validateOrderName: ValidationFunction<string> = (value: string): ValidationError | null => {
  const rules = DEFAULT_VALIDATION_RULES.orderName;
  
  if (rules.required && (!value || value.trim().length === 0)) {
    return {
      field: 'orderName',
      message: '주문명을 입력해주세요.',
      code: 'REQUIRED',
    };
  }
  
  if (value && value.length < rules.minLength) {
    return {
      field: 'orderName',
      message: `주문명은 최소 ${rules.minLength}자 이상이어야 합니다.`,
      code: 'MIN_LENGTH',
    };
  }
  
  if (value && value.length > rules.maxLength) {
    return {
      field: 'orderName',
      message: `주문명은 최대 ${rules.maxLength}자 이하여야 합니다.`,
      code: 'MAX_LENGTH',
    };
  }
  
  return null;
};

export const validateAmount: ValidationFunction<number> = (value: number): ValidationError | null => {
  const rules = DEFAULT_VALIDATION_RULES.amount;
  
  if (rules.required && (!value || value <= 0)) {
    return {
      field: 'amount',
      message: '결제 금액을 입력해주세요.',
      code: 'REQUIRED',
    };
  }
  
  if (value && value < rules.min) {
    return {
      field: 'amount',
      message: `결제 금액은 최소 ${rules.min.toLocaleString()}원 이상이어야 합니다.`,
      code: 'MIN_VALUE',
    };
  }
  
  if (value && value > rules.max) {
    return {
      field: 'amount',
      message: `결제 금액은 최대 ${rules.max.toLocaleString()}원 이하여야 합니다.`,
      code: 'MAX_VALUE',
    };
  }
  
  return null;
};

export const validateCustomerEmail: ValidationFunction<string> = (value: string): ValidationError | null => {
  const rules = DEFAULT_VALIDATION_RULES.customerEmail;
  
  if (rules.required && (!value || value.trim().length === 0)) {
    return {
      field: 'customerEmail',
      message: '이메일을 입력해주세요.',
      code: 'REQUIRED',
    };
  }
  
  if (value && !rules.pattern.test(value)) {
    return {
      field: 'customerEmail',
      message: '올바른 이메일 형식을 입력해주세요.',
      code: 'INVALID_FORMAT',
    };
  }
  
  return null;
};

export const validateCustomerName: ValidationFunction<string> = (value: string): ValidationError | null => {
  const rules = DEFAULT_VALIDATION_RULES.customerName;
  
  if (rules.required && (!value || value.trim().length === 0)) {
    return {
      field: 'customerName',
      message: '고객명을 입력해주세요.',
      code: 'REQUIRED',
    };
  }
  
  if (value && value.length < rules.minLength) {
    return {
      field: 'customerName',
      message: `고객명은 최소 ${rules.minLength}자 이상이어야 합니다.`,
      code: 'MIN_LENGTH',
    };
  }
  
  if (value && value.length > rules.maxLength) {
    return {
      field: 'customerName',
      message: `고객명은 최대 ${rules.maxLength}자 이하여야 합니다.`,
      code: 'MAX_LENGTH',
    };
  }
  
  return null;
};

export const validateCustomerMobilePhone: ValidationFunction<string> = (value: string): ValidationError | null => {
  const rules = DEFAULT_VALIDATION_RULES.customerMobilePhone;
  
  // 선택사항이므로 빈 값은 허용
  if (!value || value.trim().length === 0) {
    return null;
  }
  
  if (!rules.pattern.test(value)) {
    return {
      field: 'customerMobilePhone',
      message: '올바른 휴대폰 번호 형식을 입력해주세요. (8-15자리 숫자)',
      code: 'INVALID_FORMAT',
    };
  }
  
  return null;
};

// 전체 폼 데이터 검증
export const validatePaymentForm = (data: PaymentFormData): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // 각 필드별 검증
  const orderNameError = validateOrderName(data.orderName);
  if (orderNameError) errors.push(orderNameError);
  
  const amountError = validateAmount(data.amount);
  if (amountError) errors.push(amountError);
  
  const emailError = validateCustomerEmail(data.customerEmail);
  if (emailError) errors.push(emailError);
  
  const nameError = validateCustomerName(data.customerName);
  if (nameError) errors.push(nameError);
  
  const phoneError = validateCustomerMobilePhone(data.customerMobilePhone || '');
  if (phoneError) errors.push(phoneError);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 특정 필드만 검증
export const validateField = (field: keyof PaymentFormData, value: any): ValidationError | null => {
  switch (field) {
    case 'orderName':
      return validateOrderName(value);
    case 'amount':
      return validateAmount(value);
    case 'customerEmail':
      return validateCustomerEmail(value);
    case 'customerName':
      return validateCustomerName(value);
    case 'customerMobilePhone':
      return validateCustomerMobilePhone(value);
    default:
      return null;
  }
};
