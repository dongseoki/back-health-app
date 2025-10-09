// 결제 폼에서 입력받는 데이터
export interface PaymentFormData {
  orderName: string;           // 주문명 (예: "백건강 앱 구독")
  amount: number;              // 결제 금액 (원)
  customerEmail: string;       // 고객 이메일
  customerName: string;        // 고객명
  customerMobilePhone?: string; // 휴대폰 번호 (선택사항)
}

// 토스페이먼츠 API에 전달할 결제 정보
export interface PaymentInfo {
  orderId: string;             // 주문 ID (자동 생성)
  orderName: string;           // 주문명
  amount: number;              // 결제 금액
  customerEmail: string;       // 고객 이메일
  customerName: string;        // 고객명
  customerMobilePhone?: string; // 휴대폰 번호
  successUrl: string;          // 성공 URL
  failUrl: string;             // 실패 URL
}

// 결제 금액 정보
export interface PaymentAmount {
  currency: 'KRW';
  value: number;
}

// 고객 키 타입
export type CustomerKey = string | 'ANONYMOUS';

// 결제 상태
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

// 결제 결과
export interface PaymentResult {
  status: PaymentStatus;
  orderId?: string;
  paymentKey?: string;
  amount?: number;
  errorCode?: string;
  errorMessage?: string;
}

// PaymentForm 컴포넌트 Props
export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
  errors?: ValidationError[];
}

// PaymentWidget 컴포넌트 Props
export interface PaymentWidgetProps {
  paymentInfo: PaymentInfo;
  onSuccess: (result: PaymentResult) => void;
  onFail: (result: PaymentResult) => void;
}

// PaymentValidation 컴포넌트 Props
export interface PaymentValidationProps {
  data: PaymentFormData;
  onValidationChange: (result: ValidationResult) => void;
}

// 토스페이먼츠 API 응답
export interface TossPaymentsResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: string;
  approvedAt: string;
  method: string;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
  };
  virtualAccount?: {
    accountType: string;
    accountNumber: string;
    bankCode: string;
    customerName: string;
    dueDate: string;
  };
}

// 결제 승인 API 요청
export interface PaymentApprovalRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

// 폼 검증 에러 타입
export interface ValidationError {
  field: keyof PaymentFormData;
  message: string;
  code: string;
}

// 검증 결과
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
