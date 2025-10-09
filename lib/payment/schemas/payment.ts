import { z } from 'zod';
import { PAYMENT_CONSTANTS } from '../constants';

// 결제 폼 데이터 스키마
export const paymentFormSchema = z.object({
  orderName: z
    .string()
    .min(1, '주문명을 입력해주세요.')
    .max(100, '주문명은 100자 이하여야 합니다.')
    .trim(),
    
  amount: z
    .number()
    .min(PAYMENT_CONSTANTS.MIN_AMOUNT, `최소 결제 금액은 ${PAYMENT_CONSTANTS.MIN_AMOUNT.toLocaleString()}원입니다.`)
    .max(PAYMENT_CONSTANTS.MAX_AMOUNT, `최대 결제 금액은 ${PAYMENT_CONSTANTS.MAX_AMOUNT.toLocaleString()}원입니다.`)
    .int('결제 금액은 정수여야 합니다.'),
    
  customerEmail: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .max(100, '이메일은 100자 이하여야 합니다.')
    .email('올바른 이메일 형식을 입력해주세요.')
    .trim(),
    
  customerName: z
    .string()
    .min(1, '고객명을 입력해주세요.')
    .max(100, '고객명은 100자 이하여야 합니다.')
    .trim(),
    
  customerMobilePhone: z
    .string()
    .regex(PAYMENT_CONSTANTS.MOBILE_PHONE_PATTERN, '올바른 휴대폰 번호 형식을 입력해주세요. (8-15자리 숫자)')
    .optional()
    .or(z.literal('')),
});

// 결제 정보 스키마 (API 전달용)
export const paymentInfoSchema = z.object({
  orderId: z.string().min(6, '주문 ID는 6자 이상이어야 합니다.'),
  orderName: z.string().min(1).max(100),
  amount: z.number().min(100).max(10000000),
  customerEmail: z.string().email(),
  customerName: z.string().min(1).max(100),
  customerMobilePhone: z.string().optional(),
  successUrl: z.string().url('올바른 URL 형식이어야 합니다.'),
  failUrl: z.string().url('올바른 URL 형식이어야 합니다.'),
});

// 결제 금액 스키마
export const paymentAmountSchema = z.object({
  currency: z.literal('KRW'),
  value: z.number().min(100).max(10000000),
});

// 고객 키 스키마
export const customerKeySchema = z.union([
  z.string().min(2).max(50),
  z.literal('ANONYMOUS')
]);

// 결제 상태 스키마
export const paymentStatusSchema = z.enum(['pending', 'success', 'failed', 'cancelled']);

// 결제 결과 스키마
export const paymentResultSchema = z.object({
  status: paymentStatusSchema,
  orderId: z.string().optional(),
  paymentKey: z.string().optional(),
  amount: z.number().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
});

// 토스페이먼츠 API 응답 스키마
export const tossPaymentsResponseSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.number(),
  status: z.string(),
  approvedAt: z.string(),
  method: z.string(),
  card: z.object({
    company: z.string(),
    number: z.string(),
    installmentPlanMonths: z.number(),
    isInterestFree: z.boolean(),
  }).optional(),
  virtualAccount: z.object({
    accountType: z.string(),
    accountNumber: z.string(),
    bankCode: z.string(),
    customerName: z.string(),
    dueDate: z.string(),
  }).optional(),
});

// 결제 승인 API 요청 스키마
export const paymentApprovalRequestSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.number(),
});
