/**
 * KCP 결제 연동 전용 타입 정의
 */

// KCP 결제 요청 데이터 인터페이스
export interface KCPPaymentRequest {
  // 기본 정보 (필수)
  site_cd: string;
  site_name: string;
  ordr_idxx: string;
  good_name: string;
  good_mny: number;
  
  // 구매자 정보 (필수)
  buyr_name: string;
  buyr_tel2: string;
  buyr_mail: string;
  
  // 구매자 정보 (선택)
  buyr_tel1?: string;
  
  // 결제 수단
  pay_method: string;
  
  // KCP 응답 필드 (읽기 전용)
  res_cd?: string;
  res_msg?: string;
  ordr_chk?: string;
  enc_info?: string;
  enc_data?: string;
  ret_pay_method?: string;
  tran_cd?: string;
  use_pay_method?: string;
  
  // 현금영수증 관련 (선택)
  cash_yn?: string;
  cash_tr_code?: string;
  cash_id_info?: string;
  
  // 추가 옵션
  eng_flag?: string; // 영문 표시 여부
  skin_indx?: string; // 스킨 인덱스
}

// KCP 결제 수단 코드 매핑
export const KCP_PAYMENT_METHODS = {
  CARD: '100000000000',
  BANK_TRANSFER: '010000000000',
  VIRTUAL_ACCOUNT: '001000000000',
  POINT: '000100000000',
  PHONE: '000010000000',
  GIFT_CARD: '000000001000',
  COMBINED: '111000000000' // 신용카드+계좌이체+가상계좌
} as const;

// KCP 응답 코드
export const KCP_RESPONSE_CODES = {
  SUCCESS: '0000',
  USER_CANCELLED: '0001',
  SYSTEM_ERROR: '0002',
  NETWORK_ERROR: '0003',
  TIMEOUT: '0004'
} as const;

// KCP 결제 완료 콜백 함수 타입
export type KCPCompletePaymentCallback = (
  FormOrJson: any,
  closeEvent: () => void
) => void;

// KCP 결제창 호출 함수 타입
export type KCPPayExecuteFunction = (form: HTMLFormElement) => void;

// KCP 전역 객체 타입
export interface KCPGlobal {
  Pay_Execute: KCPPayExecuteFunction;
}

// KCP 결제 결과 인터페이스
export interface KCPPaymentResult {
  success: boolean;
  responseCode: string;
  responseMessage: string;
  orderId?: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
}
