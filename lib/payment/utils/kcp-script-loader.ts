/**
 * KCP 스크립트 로더
 */

export type KCPEnvironment = 'test' | 'prod';

export class KCPScriptLoader {
  private static scriptLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * KCP 스크립트 로드
   */
  static async loadScript(environment: KCPEnvironment = 'test'): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('클라이언트 환경에서만 실행 가능합니다.'));
        return;
      }

      // 이미 스크립트가 로드되어 있는지 확인
      if (this.isScriptLoaded()) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.getScriptUrl(environment);
      script.async = true;
      
      script.onload = () => {
        this.scriptLoaded = true;
        console.log('KCP 스크립트 로드 완료');
        resolve();
      };
      
      script.onerror = () => {
        console.error('KCP 스크립트 로드 실패');
        reject(new Error('KCP 스크립트 로드에 실패했습니다.'));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  /**
   * KCP 스크립트 로드 상태 확인
   */
  static isScriptLoaded(): boolean {
    if (typeof window === 'undefined') return false;
    
    // KCP 전역 함수들이 존재하는지 확인
    return !!(
      (window as any).KCP_Pay_Execute &&
      (window as any).GetField
    );
  }

  /**
   * 환경별 KCP 스크립트 URL 반환
   */
  static getScriptUrl(environment: KCPEnvironment): string {
    switch (environment) {
      case 'test':
        return 'https://testpay.kcp.co.kr/plugin/payplus_web.jsp';
      case 'prod':
        return 'https://pay.kcp.co.kr/plugin/payplus_web.jsp';
      default:
        throw new Error('지원하지 않는 환경입니다.');
    }
  }

  /**
   * KCP가 완전히 준비될 때까지 대기
   */
  static async waitForKCPReady(timeout: number = 10000): Promise<void> {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const checkReady = () => {
        if (this.isScriptLoaded()) {
          resolve();
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error('KCP 스크립트 로드 타임아웃'));
          return;
        }
        
        setTimeout(checkReady, 100);
      };
      
      checkReady();
    });
  }

  /**
   * 스크립트 로드 상태 리셋 (테스트용)
   */
  static reset(): void {
    this.scriptLoaded = false;
    this.loadingPromise = null;
  }
}
