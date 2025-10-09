import { z } from 'zod';
import { PAYMENT_CONSTANTS } from '../constants';

// 검증 에러 스키마
export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

// 검증 결과 스키마
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(validationErrorSchema),
});

// 실시간 검증을 위한 개별 필드 스키마
export const fieldValidationSchemas = {
  orderName: z.string()
    .min(1, '주문명을 입력해주세요.')
    .max(100, '주문명은 100자 이하여야 합니다.'),
    
  amount: z.number()
    .min(PAYMENT_CONSTANTS.MIN_AMOUNT, `최소 결제 금액은 ${PAYMENT_CONSTANTS.MIN_AMOUNT.toLocaleString()}원입니다.`)
    .max(PAYMENT_CONSTANTS.MAX_AMOUNT, `최대 결제 금액은 ${PAYMENT_CONSTANTS.MAX_AMOUNT.toLocaleString()}원입니다.`),
    
  customerEmail: z.string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
    
  customerName: z.string()
    .min(1, '고객명을 입력해주세요.')
    .max(100, '고객명은 100자 이하여야 합니다.'),
    
  customerMobilePhone: z.string()
    .regex(PAYMENT_CONSTANTS.MOBILE_PHONE_PATTERN, '올바른 휴대폰 번호 형식을 입력해주세요.')
    .optional()
    .or(z.literal('')),
};

// 조건부 검증을 위한 스키마
export const conditionalValidationSchema = z.object({
  // 휴대폰 번호가 입력된 경우에만 검증
  customerMobilePhone: z.string().optional().refine(
    (val) => !val || PAYMENT_CONSTANTS.MOBILE_PHONE_PATTERN.test(val),
    '올바른 휴대폰 번호 형식을 입력해주세요.'
  ),
  
  // 이메일 도메인 검증 (선택사항)
  customerEmail: z.string().email().refine(
    (email) => !email.includes('+'),
    '이메일에는 + 기호를 사용할 수 없습니다.'
  ).optional(),
});

// 폼 단계별 검증 스키마
export const stepValidationSchemas = {
  // 1단계: 기본 정보 검증
  basicInfo: z.object({
    orderName: fieldValidationSchemas.orderName,
    amount: fieldValidationSchemas.amount,
  }),
  
  // 2단계: 고객 정보 검증
  customerInfo: z.object({
    customerEmail: fieldValidationSchemas.customerEmail,
    customerName: fieldValidationSchemas.customerName,
    customerMobilePhone: fieldValidationSchemas.customerMobilePhone,
  }),
  
  // 3단계: 최종 검증
  final: z.object({
    orderName: fieldValidationSchemas.orderName,
    amount: fieldValidationSchemas.amount,
    customerEmail: fieldValidationSchemas.customerEmail,
    customerName: fieldValidationSchemas.customerName,
    customerMobilePhone: fieldValidationSchemas.customerMobilePhone,
  }),
};

// 검증 규칙 설정 스키마
export const validationRulesSchema = z.object({
  orderName: z.object({
    required: z.boolean(),
    minLength: z.number(),
    maxLength: z.number(),
  }),
  amount: z.object({
    required: z.boolean(),
    min: z.number(),
    max: z.number(),
  }),
  customerEmail: z.object({
    required: z.boolean(),
    pattern: z.instanceof(RegExp),
  }),
  customerName: z.object({
    required: z.boolean(),
    minLength: z.number(),
    maxLength: z.number(),
  }),
  customerMobilePhone: z.object({
    required: z.boolean(),
    pattern: z.instanceof(RegExp),
  }),
});

// 검증 옵션 스키마
export const validationOptionsSchema = z.object({
  mode: z.enum(['onChange', 'onBlur', 'onSubmit', 'all']).default('onChange'),
  debounceMs: z.number().min(0).max(1000).default(300),
  validateOnMount: z.boolean().default(false),
  revalidateOnChange: z.boolean().default(true),
});

// 검증 컨텍스트 스키마
export const validationContextSchema = z.object({
  isSubmitting: z.boolean().default(false),
  isDirty: z.boolean().default(false),
  isValid: z.boolean().default(false),
  errors: z.array(validationErrorSchema).default([]),
  touchedFields: z.array(z.string()).default([]),
});
