/**
 * KCP 결제 핸들러 컴포넌트
 * 전역 함수 설정 및 KCP 스크립트 로드를 담당
 */

'use client';

import { useEffect } from 'react';
import { KCPScriptLoader } from '@/lib/payment/utils/kcp-script-loader';

interface KCPPaymentHandlerProps {
  onPaymentComplete?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

export default function KCPPaymentHandler({ 
  onPaymentComplete, 
  onPaymentError 
}: KCPPaymentHandlerProps) {
  
  useEffect(() => {
    // KCP 스크립트 로드
    const loadKCPScript = async () => {
      try {
        if (!KCPScriptLoader.isScriptLoaded()) {
          console.log('KCP 스크립트 로드 중...');
          await KCPScriptLoader.loadScript('test');
          console.log('KCP 스크립트 로드 완료');
        }
      } catch (error) {
        console.error('KCP 스크립트 로드 실패:', error);
        onPaymentError?.('KCP 결제 시스템을 불러올 수 없습니다.');
      }
    };

    loadKCPScript();

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
              const errorMsg = '주문 정보 검증에 실패했습니다.';
              console.error(errorMsg);
              onPaymentError?.(errorMsg);
              closeEvent();
              return;
            }
          }

          // 결제 성공 처리
          const result = {
            success: true,
            orderId: FormOrJson.ordr_idxx,
            transactionId: FormOrJson.tran_cd,
            amount: FormOrJson.good_mny,
            paymentMethod: FormOrJson.ret_pay_method,
            responseCode: FormOrJson.res_cd,
            responseMessage: FormOrJson.res_msg
          };

          console.log('결제 성공:', result);
          onPaymentComplete?.(result);
        } else {
          // 결제 실패 처리
          const errorMsg = `결제 실패: [${FormOrJson.res_cd}] ${FormOrJson.res_msg || '알 수 없는 오류'}`;
          console.error('결제 실패:', errorMsg);
          onPaymentError?.(errorMsg);
        }
      } catch (error) {
        console.error('결제 콜백 처리 중 오류:', error);
        onPaymentError?.('결제 처리 중 오류가 발생했습니다.');
      } finally {
        closeEvent(); // 결제창 닫기
      }
    };

    // 컴포넌트 언마운트 시 정리
    return () => {
      delete (window as any).m_Completepayment;
    };
  }, [onPaymentComplete, onPaymentError]);

  // UI는 렌더링하지 않음 (전역 함수 설정만 담당)
  return null;
}
