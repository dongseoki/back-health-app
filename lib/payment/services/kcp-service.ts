/**
 * KCP 결제 서비스
 */

import { 
  PaymentFormData, 
  PaymentResponse, 
  KCPPaymentRequest, 
  KCPPaymentResult,
  KCP_RESPONSE_CODES 
} from '../types';

export class KCPService {
  private static readonly TEST_SITE_CD = 'T0000';
  private static readonly TEST_SITE_NAME = 'TEST SITE';

  /**
   * 결제 폼 데이터를 KCP 요청 형식으로 변환
   */
  static convertToKCPRequest(formData: PaymentFormData): KCPPaymentRequest {
    return {
      site_cd: this.TEST_SITE_CD,
      site_name: this.TEST_SITE_NAME,
      ordr_idxx: formData.orderId,
      good_name: formData.productName,
      good_mny: formData.amount,
      buyr_name: formData.buyerName,
      buyr_tel2: formData.buyerPhone,
      buyr_mail: formData.buyerEmail,
      pay_method: this.getPaymentMethodCode(formData.paymentMethod),
      eng_flag: 'N' // 한국어 기본
    };
  }

  /**
   * 결제 수단을 KCP 코드로 변환
   */
  private static getPaymentMethodCode(paymentMethod: string): string {
    const methodMap: Record<string, string> = {
      'CARD': '100000000000',
      'BANK_TRANSFER': '010000000000',
      'VIRTUAL_ACCOUNT': '001000000000',
      'POINT': '000100000000',
      'PHONE': '000010000000',
      'GIFT_CARD': '000000001000'
    };
    
    return methodMap[paymentMethod] || '100000000000'; // 기본값: 신용카드
  }

  /**
   * KCP 결제창 호출
   */
  static async executePayment(formData: PaymentFormData): Promise<PaymentResponse> {
    try {
      const kcpRequest = this.convertToKCPRequest(formData);
      
      // KCP 결제창 호출 (실제 구현은 클라이언트에서)
      const result = await this.callKCPPaymentWindow(kcpRequest);
      
      return {
        success: result.success,
        message: result.success ? '결제가 완료되었습니다.' : result.responseMessage,
        transactionId: result.transactionId,
        orderId: formData.orderId
      };
    } catch (error) {
      console.error('KCP 결제 실행 중 오류:', error);
      return {
        success: false,
        message: '결제 처리 중 오류가 발생했습니다.',
        orderId: formData.orderId
      };
    }
  }

  /**
   * KCP 결제창 호출 (클라이언트에서 구현)
   */
  private static async callKCPPaymentWindow(kcpRequest: KCPPaymentRequest): Promise<KCPPaymentResult> {
    return new Promise((resolve, reject) => {
      try {
        // KCP 전역 함수가 있는지 확인
        if (typeof window !== 'undefined' && (window as any).KCP_Pay_Execute) {
          // 실제 KCP 결제창 호출 로직은 클라이언트 컴포넌트에서 구현
          // 여기서는 기본 구조만 제공
          resolve({
            success: true,
            responseCode: KCP_RESPONSE_CODES.SUCCESS,
            responseMessage: '결제 성공',
            transactionId: 'TEST_' + Date.now(),
            paymentMethod: kcpRequest.pay_method,
            amount: kcpRequest.good_mny
          });
        } else {
          reject(new Error('KCP 결제 스크립트가 로드되지 않았습니다.'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * KCP 응답 데이터 검증
   */
  static validateKCPResponse(response: any): KCPPaymentResult {
    const isSuccess = response?.res_cd === KCP_RESPONSE_CODES.SUCCESS;
    
    return {
      success: isSuccess,
      responseCode: response?.res_cd || 'UNKNOWN',
      responseMessage: response?.res_msg || '알 수 없는 오류',
      transactionId: response?.tran_cd,
      paymentMethod: response?.ret_pay_method,
      amount: response?.good_mny
    };
  }

  /**
   * 주문 정보 무결성 검증
   */
  static validateOrderIntegrity(
    originalOrderId: string,
    originalAmount: number,
    responseOrderId: string,
    responseAmount: number
  ): boolean {
    return originalOrderId === responseOrderId && originalAmount === responseAmount;
  }

  /**
   * KCP 스크립트 로드 확인
   */
  static isKCPScriptLoaded(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).KCP_Pay_Execute;
  }

  /**
   * KCP 스크립트 로드
   */
  static loadKCPScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('클라이언트 환경에서만 실행 가능합니다.'));
        return;
      }

      if (this.isKCPScriptLoaded()) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://testpay.kcp.co.kr/plugin/payplus_web.jsp';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('KCP 스크립트 로드 실패'));
      document.head.appendChild(script);
    });
  }
}
