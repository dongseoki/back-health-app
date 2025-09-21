/**
 * 결제 폼 전체 검증 클래스
 */

import { PaymentFormData, ValidationResult, ValidationErrors } from '../types';
import {
  validateOrderId,
  validateProductName,
  validateAmount,
  validateBuyerName,
  validateBuyerPhone,
  validateBuyerEmail,
  validateBuyerTel
} from './field-validators';

export class PaymentValidator {
  /**
   * 전체 결제 폼 검증
   */
  static validateForm(formData: PaymentFormData): ValidationResult {
    // debugger;
    console.debug("formData:::", formData);
    const errors: ValidationErrors = {};
    let isValid = true;

    // 주문번호 검증
    const orderIdResult = validateOrderId(formData.orderId);
    if (!orderIdResult.isValid) {
      Object.assign(errors, orderIdResult.errors);
      isValid = false;
    }

    // 상품명 검증
    const productNameResult = validateProductName(formData.productName);
    if (!productNameResult.isValid) {
      Object.assign(errors, productNameResult.errors);
      isValid = false;
    }

    // 금액 검증
    const amountResult = validateAmount(formData.amount);
    if (!amountResult.isValid) {
      Object.assign(errors, amountResult.errors);
      isValid = false;
    }

    // 구매자명 검증
    const buyerNameResult = validateBuyerName(formData.buyerName);
    if (!buyerNameResult.isValid) {
      Object.assign(errors, buyerNameResult.errors);
      isValid = false;
    }

    // 휴대폰번호 검증
    const buyerPhoneResult = validateBuyerPhone(formData.buyerPhone);
    if (!buyerPhoneResult.isValid) {
      Object.assign(errors, buyerPhoneResult.errors);
      isValid = false;
    }

    // 이메일 검증
    const buyerEmailResult = validateBuyerEmail(formData.buyerEmail);
    if (!buyerEmailResult.isValid) {
      Object.assign(errors, buyerEmailResult.errors);
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }

  /**
   * KCP 결제 요청 데이터 검증
   */
  static validateKCPRequest(kcpData: any): ValidationResult {
    const errors: ValidationErrors = {};
    let isValid = true;

    // 필수 필드 검증
    const requiredFields = [
      'site_cd', 'site_name', 'ordr_idxx', 'good_name', 'good_mny',
      'buyr_name', 'buyr_tel2', 'buyr_mail', 'pay_method'
    ];

    for (const field of requiredFields) {
      if (!kcpData[field] || kcpData[field].toString().trim() === '') {
        errors.general = `필수 필드가 누락되었습니다: ${field}`;
        isValid = false;
        break;
      }
    }

    // 금액 검증
    if (kcpData.good_mny) {
      const amount = Number(kcpData.good_mny);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = '올바른 금액을 입력해주세요.';
        isValid = false;
      }
    }

    // 이메일 형식 검증
    if (kcpData.buyr_mail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(kcpData.buyr_mail)) {
        errors.buyerEmail = '올바른 이메일 형식이 아닙니다.';
        isValid = false;
      }
    }

    return {
      isValid,
      errors
    };
  }

  /**
   * KCP 응답 데이터 검증
   */
  static validateKCPResponse(response: any): ValidationResult {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!response) {
      errors.general = '결제 응답 데이터가 없습니다.';
      return { isValid: false, errors };
    }

    if (response.res_cd !== '0000') {
      errors.general = `결제 실패: [${response.res_cd}] ${response.res_msg || '알 수 없는 오류'}`;
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }

  /**
   * 주문 정보 무결성 검증 (보안)
   */
  static validateOrderIntegrity(
    originalOrderId: string,
    originalAmount: number,
    responseOrderId: string,
    responseAmount: number
  ): ValidationResult {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (originalOrderId !== responseOrderId) {
      errors.general = '주문번호가 일치하지 않습니다.';
      isValid = false;
    }

    if (originalAmount !== responseAmount) {
      errors.general = '결제 금액이 일치하지 않습니다.';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }
}
