/**
 * KCP 폼 빌더
 */

import { PaymentFormData, KCPPaymentRequest, KCP_PAYMENT_METHODS } from '../types';
import { KCPService } from './kcp-service';

export class KCPFormBuilder {
  private static readonly TEST_SITE_CD = 'T0000';
  private static readonly TEST_SITE_NAME = 'TEST SITE';

  /**
   * KCP 결제 폼 생성
   */
  static createPaymentForm(formData: PaymentFormData): HTMLFormElement {
    const form = document.createElement('form');
    form.name = 'order_info';
    form.method = 'post';
    form.action = '/payments/approve.do'; // 실제 승인 URL로 변경 필요
    form.style.display = 'none'; // 숨김 처리

    // KCP 요청 데이터 생성
    const kcpData = this.convertToKCPRequest(formData);
    
    // 필수 필드 추가
    this.addRequiredFields(form, kcpData);
    
    // KCP 응답 필드 추가 (빈 값으로 초기화)
    this.addResponseFields(form);
    
    // 추가 옵션 필드 추가
    this.addOptionFields(form);

    return form;
  }

  /**
   * PaymentFormData를 KCP 요청 형식으로 변환
   */
  private static convertToKCPRequest(formData: PaymentFormData): KCPPaymentRequest {
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
      'CARD': KCP_PAYMENT_METHODS.CARD,
      'BANK_TRANSFER': KCP_PAYMENT_METHODS.BANK_TRANSFER,
      'VIRTUAL_ACCOUNT': KCP_PAYMENT_METHODS.VIRTUAL_ACCOUNT,
      'POINT': KCP_PAYMENT_METHODS.POINT,
      'PHONE': KCP_PAYMENT_METHODS.PHONE,
      'GIFT_CARD': KCP_PAYMENT_METHODS.GIFT_CARD
    };
    
    return methodMap[paymentMethod] || KCP_PAYMENT_METHODS.CARD;
  }

  /**
   * 필수 필드 추가
   */
  private static addRequiredFields(form: HTMLFormElement, kcpData: KCPPaymentRequest): void {
    const requiredFields = [
      { name: 'site_cd', value: kcpData.site_cd },
      { name: 'site_name', value: kcpData.site_name },
      { name: 'ordr_idxx', value: kcpData.ordr_idxx },
      { name: 'good_name', value: kcpData.good_name },
      { name: 'good_mny', value: kcpData.good_mny.toString() },
      { name: 'buyr_name', value: kcpData.buyr_name },
      { name: 'buyr_tel2', value: kcpData.buyr_tel2 },
      { name: 'buyr_mail', value: kcpData.buyr_mail },
      { name: 'pay_method', value: kcpData.pay_method }
    ];

    requiredFields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    // 선택적 필드 추가
    if (kcpData.buyr_tel1) {
      const telInput = document.createElement('input');
      telInput.type = 'hidden';
      telInput.name = 'buyr_tel1';
      telInput.value = kcpData.buyr_tel1;
      form.appendChild(telInput);
    }
  }

  /**
   * KCP 응답 필드 추가 (빈 값으로 초기화)
   */
  private static addResponseFields(form: HTMLFormElement): void {
    const responseFields = [
      'res_cd',
      'res_msg',
      'ordr_chk',
      'enc_info',
      'enc_data',
      'ret_pay_method',
      'tran_cd',
      'use_pay_method',
      'cash_yn',
      'cash_tr_code',
      'cash_id_info'
    ];

    responseFields.forEach(fieldName => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = fieldName;
      input.value = '';
      form.appendChild(input);
    });
  }

  /**
   * 추가 옵션 필드 추가
   */
  private static addOptionFields(form: HTMLFormElement): void {
    const optionFields = [
      { name: 'eng_flag', value: 'N' },
      { name: 'used_card_YN', value: 'N' },
      { name: 'payco_direct', value: '' },
      { name: 'sspay_direct', value: '' },
      { name: 'ssgpay_direct', value: '' },
      { name: 'lpay_direct', value: '' },
      { name: 'kakaopay_direct', value: '' },
      { name: 'naverpay_direct', value: '' },
      { name: 'naverpay_point_direct', value: '' }
    ];

    optionFields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });
  }

  /**
   * 폼을 DOM에 추가하고 KCP 결제창 호출
   */
  static executePayment(formData: PaymentFormData): void {
    // 폼 생성
    const form = this.createPaymentForm(formData);
    
    // DOM에 추가
    document.body.appendChild(form);
    
    // KCP 결제창 호출
    try {
      (window as any).KCP_Pay_Execute(form);
    } catch (error) {
      console.error('KCP 결제창 호출 중 오류:', error);
      // 폼 제거
      document.body.removeChild(form);
      throw error;
    }
  }

  /**
   * 폼 데이터 검증
   */
  static validateFormData(formData: PaymentFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.orderId || formData.orderId.trim() === '') {
      errors.push('주문번호를 입력해주세요.');
    }

    if (!formData.productName || formData.productName.trim() === '') {
      errors.push('상품명을 입력해주세요.');
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.push('결제 금액을 입력해주세요.');
    }

    if (!formData.buyerName || formData.buyerName.trim() === '') {
      errors.push('구매자명을 입력해주세요.');
    }

    if (!formData.buyerPhone || formData.buyerPhone.trim() === '') {
      errors.push('휴대폰번호를 입력해주세요.');
    }

    if (!formData.buyerEmail || formData.buyerEmail.trim() === '') {
      errors.push('이메일을 입력해주세요.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
