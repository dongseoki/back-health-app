- React hook form
- 기존의 form을 제어 컴포넌트 방식으로 다룰때 발생하는 문제

  - 불편함, 가독성 : 코드가 상당히 길어지고(state 선언, 유효성 체크 등)
  - 성능 : 불필요한 연산, 불필요한 렌더링, 무수한 리랜더링.

- formState: { errors } 12번째 줄에 정의된 errors는 어디서 어떻게 임포트 된거니
  - 좋은 질문이네요! `errors`는 별도로 임포트한 것이 아니라 `useForm` 훅에서 **구조 분해 할당(destructuring)**으로 가져온 것입니다.

## 구조 분해 할당 설명

```typescript
const {
  register,
  handleSubmit,
  formState: { errors }, // ← 여기서 구조 분해 할당
} = useForm<FormData>();
```

이 코드는 다음과 같이 풀어서 쓸 수 있습니다:

```typescript
const form = useForm<FormData>();
const register = form.register;
const handleSubmit = form.handleSubmit;
const errors = form.formState.errors; // ← errors는 formState 안에 있음
```

## formState 객체의 구조

`useForm`이 반환하는 `formState` 객체에는 여러 속성들이 들어있습니다:

```typescript
formState: {
    errors: {},           // 각 필드의 에러 정보
    isSubmitting: false,  // 제출 중인지 여부
    isValid: true,        // 폼이 유효한지 여부
    isDirty: false,       // 폼이 수정되었는지 여부
    isTouched: false,     // 필드가 터치되었는지 여부
    // ... 기타 많은 속성들
}
```

## 실제 사용 예시

```typescript
// 방법 1: 구조 분해 할당 (현재 코드)
const {
  formState: { errors },
} = useForm();

// 방법 2: 전체 formState 사용
const { formState } = useForm();
// 사용할 때: formState.errors

// 방법 3: 여러 속성 동시에 가져오기
const {
  formState: { errors, isSubmitting, isValid },
} = useForm();
```

따라서 `errors`는 React Hook Form 라이브러리 내부에서 제공하는 객체이며, 별도의 import 없이 `useForm` 훅을 통해 자동으로 사용할 수 있습니다!
