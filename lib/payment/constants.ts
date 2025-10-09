// 결제 관련 상수
export const PAYMENT_CONSTANTS = {
  // 금액 제한
  MIN_AMOUNT: 100,              // 최소 결제 금액 (100원)
  MAX_AMOUNT: 10000000,         // 최대 결제 금액 (1천만원)
  
  // 문자열 길이 제한
  ORDER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  CUSTOMER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  CUSTOMER_EMAIL: {
    MAX_LENGTH: 100,
  },
  CUSTOMER_MOBILE_PHONE: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 15,
  },
  
  // 정규식 패턴
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MOBILE_PHONE_PATTERN: /^[0-9]{8,15}$/,
  
  // 통화
  CURRENCY: 'KRW' as const,
  
  // 에러 코드
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PAYMENT_ERROR: 'PAYMENT_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  },
} as const;

// URL 경로
export const PAYMENT_ROUTES = {
  MAIN: '/test/payment',
  SUCCESS: '/test/payment/success',
  FAIL: '/test/payment/fail',
} as const;

// 토스페이먼츠 설정
export const TOSS_PAYMENTS_CONFIG = {
  CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
  CUSTOMER_KEY_PREFIX: 'back-health-app',
} as const;

// 결제 상태 메시지
export const PAYMENT_STATUS_MESSAGES = {
  pending: '결제 진행 중...',
  success: '결제가 완료되었습니다.',
  failed: '결제에 실패했습니다.',
  cancelled: '결제가 취소되었습니다.',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다.',
  INVALID_EMAIL: '올바른 이메일 형식을 입력해주세요.',
  INVALID_PHONE: '올바른 휴대폰 번호 형식을 입력해주세요.',
  MIN_AMOUNT: `최소 결제 금액은 ${PAYMENT_CONSTANTS.MIN_AMOUNT.toLocaleString()}원입니다.`,
  MAX_AMOUNT: `최대 결제 금액은 ${PAYMENT_CONSTANTS.MAX_AMOUNT.toLocaleString()}원입니다.`,
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  PAYMENT_ERROR: '결제 처리 중 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

// 폼 기본값
export const DEFAULT_PAYMENT_FORM_DATA = {
  orderName: '백건강 앱 구독',
  amount: 50000,
  customerEmail: '',
  customerName: '',
  customerMobilePhone: '',
} as const;

// 결제 수단 타입
export const PAYMENT_METHODS = {
  CARD: '카드',
  TRANSFER: '계좌이체',
  VIRTUAL_ACCOUNT: '가상계좌',
  MOBILE: '휴대폰',
  CULTURE_VOUCHER: '문화바우처',
} as const;

// 결제 위젯 설정
export const WIDGET_CONFIG = {
  VARIANT_KEY: 'DEFAULT',
  AGREEMENT_VARIANT_KEY: 'AGREEMENT',
} as const;
