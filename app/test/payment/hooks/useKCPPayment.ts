/**
 * KCP 결제 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { PaymentFormData, PaymentStatus, PaymentResponse } from '@/lib/payment/types';
import { KCPScriptLoader } from '@/lib/payment/utils/kcp-script-loader';
import { KCPFormBuilder } from '@/lib/payment/services/kcp-form-builder';
import { PaymentValidator } from '@/lib/payment/validation';

interface PaymentState {
  isLoading: boolean;
  paymentStatus: PaymentStatus;
  error: string | null;
  transactionId: string | null;
  orderId: string | null;
}

export function useKCPPayment() {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    paymentStatus: 'PENDING',
    error: null,
    transactionId: null,
    orderId: null
  });

  // KCP 콜백 함수 설정
  useEffect(() => {
    // 전역 콜백 함수 등록
    (window as any).m_Completepayment = (FormOrJson: any, closeEvent: () => void) => {
      console.log('KCP 결제 완료 콜백 호출됨:', FormOrJson);
      
      try {
        // 결제 성공 여부 확인
        if (FormOrJson.res_cd === "0000") {
          // 주문 정보 무결성 검증
          const form = document.querySelector('form[name="order_info"]') as HTMLFormElement;
          if (form) {
            const orderId = form.ordr_idxx?.value;
            const amount = form.good_mny?.value;
            const orderChk = form.ordr_chk?.value;
            
            // ordr_chk 검증 (보안)
            if (orderChk !== `${orderId}|${amount}`) {
              setState(prev => ({
                ...prev,
                paymentStatus: 'FAILED',
                error: '주문 정보 검증에 실패했습니다.',
                isLoading: false
              }));
              closeEvent();
              return;
            }
          }

          // 결제 성공 처리
          setState(prev => ({
            ...prev,
            paymentStatus: 'SUCCESS',
            transactionId: FormOrJson.tran_cd || `TXN_${Date.now()}`,
            error: null,
            isLoading: false
          }));

          console.log('결제 성공:', {
            orderId: FormOrJson.ordr_idxx,
            transactionId: FormOrJson.tran_cd,
            amount: FormOrJson.good_mny,
            paymentMethod: FormOrJson.ret_pay_method
          });
        } else {
          // 결제 실패 처리
          const errorMessage = `결제 실패: [${FormOrJson.res_cd}] ${FormOrJson.res_msg || '알 수 없는 오류'}`;
          
          setState(prev => ({
            ...prev,
            paymentStatus: 'FAILED',
            error: errorMessage,
            isLoading: false
          }));

          console.error('결제 실패:', errorMessage);
        }
      } catch (error) {
        console.error('결제 콜백 처리 중 오류:', error);
        setState(prev => ({
          ...prev,
          paymentStatus: 'FAILED',
          error: '결제 처리 중 오류가 발생했습니다.',
          isLoading: false
        }));
      } finally {
        closeEvent(); // 결제창 닫기
      }
    };

    // 컴포넌트 언마운트 시 정리
    return () => {
      delete (window as any).m_Completepayment;
    };
  }, []);

  // 결제 실행
  const executePayment = useCallback(async (formData: PaymentFormData) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      paymentStatus: 'PROCESSING'
    }));

    try {
      // 1. 폼 데이터 검증
      const validation = PaymentValidator.validateForm(formData);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        setState(prev => ({
          ...prev,
          paymentStatus: 'FAILED',
          error: errorMessage,
          isLoading: false
        }));
        return;
      }

      // 2. KCP 스크립트 로드 확인
      if (!KCPScriptLoader.isScriptLoaded()) {
        console.log('KCP 스크립트 로드 중...');
        await KCPScriptLoader.loadScript('test');
        await KCPScriptLoader.waitForKCPReady();
      }

      // 3. KCP 폼 생성 및 결제창 호출
      console.log('KCP 결제창 호출:', formData);
      KCPFormBuilder.executePayment(formData);

      // 4. 주문 ID 저장
      setState(prev => ({
        ...prev,
        orderId: formData.orderId
      }));

    } catch (error) {
      console.error('결제 실행 중 오류:', error);
      setState(prev => ({
        ...prev,
        paymentStatus: 'FAILED',
        error: error instanceof Error ? error.message : '결제 실행 중 오류가 발생했습니다.',
        isLoading: false
      }));
    }
  }, []);

  // 상태 리셋
  const resetPayment = useCallback(() => {
    setState({
      isLoading: false,
      paymentStatus: 'PENDING',
      error: null,
      transactionId: null,
      orderId: null
    });
  }, []);

  // 결제 결과 반환
  const getPaymentResult = useCallback((): PaymentResponse => {
    return {
      success: state.paymentStatus === 'SUCCESS',
      message: state.error || (state.paymentStatus === 'SUCCESS' ? '결제가 완료되었습니다.' : '결제가 진행 중입니다.'),
      transactionId: state.transactionId || undefined,
      orderId: state.orderId || undefined
    };
  }, [state]);

  return {
    // 상태
    isLoading: state.isLoading,
    paymentStatus: state.paymentStatus,
    error: state.error,
    transactionId: state.transactionId,
    orderId: state.orderId,
    
    // 액션
    executePayment,
    resetPayment,
    getPaymentResult
  };
}
