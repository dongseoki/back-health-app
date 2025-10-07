// 구매자 정보 타입 정의
export interface BuyerInfo {
  name: string;
  phone: string;
  email: string;
}

// React state 업데이트 함수 타입 정의
export type UpdateFormDataFunction = (field: string, value: string | number) => void;

// React state를 통한 input 값 설정 함수
export function setInputValues(
  buyerInfo: BuyerInfo, 
  updateFormData: UpdateFormDataFunction
): boolean {
  try {
    updateFormData('buyerName', buyerInfo.name);
    updateFormData('buyerPhone', buyerInfo.phone);
    updateFormData('buyerEmail', buyerInfo.email);
    return true;
  } catch (error) {
    console.error('input 값 설정 중 오류 발생:', error);
    return false;
  }
}

// React state를 통한 input 값 초기화 함수
export function clearInputValues(updateFormData: UpdateFormDataFunction): boolean {
  try {
    updateFormData('buyerName', '');
    updateFormData('buyerPhone', '');
    updateFormData('buyerEmail', '');
    return true;
  } catch (error) {
    console.error('input 값 초기화 중 오류 발생:', error);
    return false;
  }
}

// 테스트용 기본 데이터 설정 함수
export function setTestData(updateFormData: UpdateFormDataFunction): boolean {
  const testData: BuyerInfo = {
    name: "이동석",
    phone: "010-1234-2342",
    email: "dongseok.lee.log@gmail.com"
  };

  return setInputValues(testData, updateFormData);
}
