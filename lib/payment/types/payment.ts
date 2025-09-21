/**
 * 결제 관련 기본 타입 정의
 */

// 결제 수단 열거형
export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
  POINT = 'POINT',
  PHONE = 'PHONE',
  GIFT_CARD = 'GIFT_CARD'
}

// 결제 폼 데이터 인터페이스
export interface PaymentFormData {
  orderId: string;
  productName: string;
  amount: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  paymentMethod: PaymentMethod;
}

// 구매자 정보 인터페이스
export interface BuyerInfo {
  name: string;
  phone: string;
  email: string;
  tel?: string; // 선택사항
}

// 주문 정보 인터페이스
export interface OrderInfo {
  orderId: string;
  productName: string;
  amount: number;
}

// 검증 결과 인터페이스
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// 검증 에러 인터페이스
export interface ValidationErrors {
  orderId?: string;
  productName?: string;
  amount?: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  paymentMethod?: string;
  general?: string;
}

// 결제 응답 인터페이스
export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  orderId?: string;
}

// 결제 상태 열거형
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}
