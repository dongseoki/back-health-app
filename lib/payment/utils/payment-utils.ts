/**
 * 결제 관련 유틸리티 함수
 */

import { PaymentFormData } from '../types';

export class PaymentUtils {
  /**
   * 주문번호 생성
   */
  static generateOrderId(prefix: string = 'TEST'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * 금액 포맷팅 (천 단위 콤마)
   */
  static formatAmount(amount: number): string {
    return amount.toLocaleString('ko-KR');
  }

  /**
   * 전화번호 포맷팅
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d]/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    
    return phone;
  }

  /**
   * 이메일 유효성 검사
   */
  static isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /**
   * 휴대폰번호 유효성 검사
   */
  static isValidPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/[^\d]/g, '');
    const phonePattern = /^01[016789]\d{7,8}$/;
    return phonePattern.test(cleaned);
  }

  /**
   * 폼 데이터 초기화
   */
  static createInitialFormData(): PaymentFormData {
    return {
      orderId: this.generateOrderId(),
      productName: '테스트 상품',
      amount: 1000,
      buyerName: '',
      buyerPhone: '',
      buyerEmail: '',
      paymentMethod: 'CARD' as any
    };
  }

  /**
   * 결제 수단 한글명 반환
   */
  static getPaymentMethodName(method: string): string {
    const methodMap: Record<string, string> = {
      'CARD': '신용카드',
      'BANK_TRANSFER': '계좌이체',
      'VIRTUAL_ACCOUNT': '가상계좌',
      'POINT': '포인트',
      'PHONE': '휴대폰',
      'GIFT_CARD': '상품권'
    };
    
    return methodMap[method] || method;
  }

  /**
   * KCP 응답 코드 한글 메시지
   */
  static getKCPResponseMessage(code: string): string {
    const messageMap: Record<string, string> = {
      '0000': '정상 처리',
      '0001': '사용자 취소',
      '0002': '시스템 오류',
      '0003': '네트워크 오류',
      '0004': '타임아웃'
    };
    
    return messageMap[code] || '알 수 없는 오류';
  }

  /**
   * 결제 상태 한글명
   */
  static getPaymentStatusName(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': '대기 중',
      'PROCESSING': '처리 중',
      'SUCCESS': '성공',
      'FAILED': '실패',
      'CANCELLED': '취소됨'
    };
    
    return statusMap[status] || status;
  }

  /**
   * 안전한 문자열 이스케이프 (XSS 방지)
   */
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 주문 정보 무결성 검증을 위한 체크값 생성
   */
  static generateOrderCheck(orderId: string, amount: number): string {
    return `${orderId}|${amount}`;
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
}
