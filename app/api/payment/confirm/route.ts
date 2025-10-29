import { NextRequest, NextResponse } from 'next/server';

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const getEncryptedSecretKey = (secretKey: string): string => {
  return 'Basic ' + Buffer.from(secretKey + ':').toString('base64');
};

// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
// TODO 시크릿 키들 환경 변수와 gitignore 추가 필요.
// 다음은 MVP 테스트라 중요성은 낮음.
// @docs https://docs.tosspayments.com/reference/using-api/api-keys
const apiSecretKey = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';
const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 요청 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      console.error('[결제 승인 API] 필수 파라미터 누락:', { paymentKey, orderId, amount });
      return NextResponse.json(
        { 
          error: '필수 파라미터가 누락되었습니다.',
          code: 'MISSING_PARAMETER'
        },
        { status: 400 }
      );
    }

    // 요청 파라미터 로그
    console.log('[결제 승인 API] 요청 파라미터:', {
      paymentKey,
      orderId,
      amount,
      timestamp: new Date().toISOString()
    });

    const encryptedApiSecretKey = getEncryptedSecretKey(apiSecretKey);
    const encryptedWidgetSecretKey = getEncryptedSecretKey(widgetSecretKey);

    // 토스페이먼츠 API 호출용 headers
    const headers = {
      // Authorization: encryptedApiSecretKey,
      Authorization: encryptedWidgetSecretKey,
      'Content-Type': 'application/json',
    };

    // 결제 승인 API 호출 전 로그 (headers 정보 포함)
    console.log('[결제 승인 API] 토스페이먼츠 API 호출 시작:', {
      url: 'https://api.tosspayments.com/v1/payments/confirm',
      method: 'POST',
      headers: {
        // Authorization: encryptedApiSecretKey.substring(0, 20) + '...',
        Authorization: encryptedWidgetSecretKey.substring(0, 20) + '...',
        'Content-Type': headers['Content-Type'],
      },
      orderId,
      timestamp: new Date().toISOString()
    });

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      }),
    });

    const result = await response.json();

    // API 응답 로그
    console.log('[결제 승인 API] 토스페이먼츠 API 응답:', {
      status: response.status,
      statusText: response.statusText,
      result,
      timestamp: new Date().toISOString()
    });

    if (!response.ok) {
      // 결제 승인 실패 로그
      console.error('[결제 승인 API] 결제 승인 실패:', {
        status: response.status,
        error: result,
        orderId,
        paymentKey,
        timestamp: new Date().toISOString()
      });

      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
      return NextResponse.json(result, { status: response.status });
    }

    // 결제 승인 성공 로그
    console.log('[결제 승인 API] 결제 승인 성공:', {
      orderId,
      paymentKey,
      amount: result.totalAmount,
      method: result.method,
      timestamp: new Date().toISOString()
    });

    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    // 예외 처리 로그
    console.error('[결제 승인 API] 예외 발생:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        error: '결제 승인 처리 중 오류가 발생했습니다.',
        message: error instanceof Error ? error.message : String(error),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

