/**
 * 개별 필드 검증 함수들
 */

import { ValidationResult, ValidationErrors } from '../types';

// 주문번호 검증
export const validateOrderId = (orderId: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!orderId || orderId.trim() === '') {
    errors.orderId = '주문번호를 입력해주세요.';
    return { isValid: false, errors };
  }
  
  if (orderId.length > 40) {
    errors.orderId = '주문번호는 40자 이내로 입력해주세요.';
    return { isValid: false, errors };
  }
  
  // 영문, 숫자, 하이픈, 언더스코어만 허용
  const orderIdPattern = /^[A-Za-z0-9_-]+$/;
  if (!orderIdPattern.test(orderId)) {
    errors.orderId = '주문번호는 영문, 숫자, 하이픈, 언더스코어만 사용 가능합니다.';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 상품명 검증
export const validateProductName = (productName: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!productName || productName.trim() === '') {
    errors.productName = '상품명을 입력해주세요.';
    return { isValid: false, errors };
  }
  
  if (productName.length > 100) {
    errors.productName = '상품명은 100자 이내로 입력해주세요.';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 금액 검증
export const validateAmount = (amount: number): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!amount || amount <= 0) {
    errors.amount = '금액을 입력해주세요.';
    return { isValid: false, errors };
  }
  
  if (amount < 100) {
    errors.amount = '최소 결제 금액은 100원입니다.';
    return { isValid: false, errors };
  }
  
  if (amount > 999999999) {
    errors.amount = '최대 결제 금액은 999,999,999원입니다.';
    return { isValid: false, errors };
  }
  
  if (!Number.isInteger(amount)) {
    errors.amount = '금액은 정수로 입력해주세요.';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 구매자명 검증
export const validateBuyerName = (buyerName: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!buyerName || buyerName.trim() === '') {
    errors.buyerName = '구매자명을 입력해주세요.';
    return { isValid: false, errors };
  }
  
  if (buyerName.length > 50) {
    errors.buyerName = '구매자명은 50자 이내로 입력해주세요.';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 휴대폰번호 검증
export const validateBuyerPhone = (phone: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!phone || phone.trim() === '') {
    errors.buyerPhone = '휴대폰번호를 입력해주세요.';
    return { isValid: false, errors };
  }
  
  // 하이픈 제거 후 숫자만 검증
  const cleanPhone = phone.replace(/[-\s]/g, '');
  const phonePattern = /^01[016789]\d{7,8}$/;
  
  if (!phonePattern.test(cleanPhone)) {
    errors.buyerPhone = '올바른 휴대폰번호 형식이 아닙니다. (예: 010-1234-5678)';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 이메일 검증
export const validateBuyerEmail = (email: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!email || email.trim() === '') {
    errors.buyerEmail = '이메일을 입력해주세요.';
    return { isValid: false, errors };
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.buyerEmail = '올바른 이메일 형식이 아닙니다.';
    return { isValid: false, errors };
  }
  
  if (email.length > 100) {
    errors.buyerEmail = '이메일은 100자 이내로 입력해주세요.';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};

// 전화번호 검증 (선택사항)
export const validateBuyerTel = (tel: string): ValidationResult => {
  const errors: ValidationErrors = {};
  
  if (!tel || tel.trim() === '') {
    return { isValid: true, errors }; // 선택사항이므로 빈 값도 유효
  }
  
  // 하이픈 제거 후 숫자만 검증
  const cleanTel = tel.replace(/[-\s]/g, '');
  const telPattern = /^0\d{1,2}\d{7,8}$/;
  
  if (!telPattern.test(cleanTel)) {
    errors.general = '올바른 전화번호 형식이 아닙니다. (예: 02-1234-5678)';
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors };
};
