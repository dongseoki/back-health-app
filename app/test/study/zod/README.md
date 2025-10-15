# zod?

Zod는 TypeScript를 위한 스키마 검증 라이브러리입니다. 주요 특징들을 설명드리겠습니다:

## Zod란?

**Zod**는 TypeScript-first 스키마 선언 및 검증 라이브러리로, 런타임에서 데이터의 유효성을 검사하고 TypeScript 타입을 자동으로 추론해주는 도구입니다.

## 주요 특징

1. **타입 안전성**: 스키마를 정의하면 TypeScript 타입이 자동으로 추론됩니다
2. **런타임 검증**: 실제 데이터가 스키마와 일치하는지 런타임에서 검증합니다
3. **간단한 API**: 직관적이고 읽기 쉬운 문법을 제공합니다
4. **에러 처리**: 상세한 검증 에러 메시지를 제공합니다

## 기본 사용법

```typescript
import { z } from "zod";

// 스키마 정의
const UserSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
  email: z.string().email(),
});

// TypeScript 타입 자동 추론
type User = z.infer<typeof UserSchema>;

// 데이터 검증
const userData = {
  name: "홍길동",
  age: 25,
  email: "hong@example.com",
};

const result = UserSchema.safeParse(userData);
if (result.success) {
  console.log(result.data); // 타입 안전한 데이터
} else {
  console.log(result.error); // 검증 에러
}
```

## 주요 스키마 타입

- `z.string()` - 문자열
- `z.number()` - 숫자
- `z.boolean()` - 불린
- `z.array()` - 배열
- `z.object()` - 객체
- `z.optional()` - 선택적 필드
- `z.nullable()` - null 허용

## 장점

1. **개발자 경험**: IDE에서 자동완성과 타입 체크 지원
2. **런타임 안전성**: API 응답, 폼 데이터 등 외부 데이터 검증
3. **코드 간소화**: 타입 정의와 검증 로직을 한 곳에서 관리
4. **에러 메시지**: 사용자 친화적인 검증 에러 제공

Zod는 특히 API 통신, 폼 검증, 설정 파일 검증 등에서 매우 유용한 라이브러리입니다.

# Zod를 사용했을 때와 사용하지 않았을 때의 차이점을 비교해보겠습니다:

## 1. **런타임 검증**

### Zod 사용 시:

```typescript
const result = UserSchema.safeParse(userData);
if (result.success) {
  console.log(result.data); // 검증된 안전한 데이터
} else {
  console.log(result.error); // 상세한 에러 정보
}
```

### Zod 없이:

```typescript
// 검증 없이 바로 사용
console.log(userData); // 런타임 에러 가능성
```

## 2. **타입 안전성**

### Zod 사용 시:

- **컴파일 타임**: TypeScript 타입 체크
- **런타임**: 실제 데이터 검증
- **이중 보호**: 타입과 실제 데이터가 일치하는지 확인

### Zod 없이:

```typescript
// 타입만 정의 (런타임 검증 없음)
interface User {
  name: string;
  age: number;
  email: string;
}

const userData: User = {
  name: "홍길동",
  age: -2, // 타입은 맞지만 비즈니스 로직상 잘못된 값
  email: "invalid-email", // 타입은 맞지만 형식이 잘못됨
};
```

## 3. **에러 처리**

### Zod 사용 시:

```typescript
// 상세한 에러 메시지
{
  "success": false,
  "error": {
    "issues": [
      {
        "code": "too_small",
        "minimum": 0,
        "type": "number",
        "inclusive": true,
        "exact": false,
        "message": "Number must be greater than or equal to 0",
        "path": ["age"]
      }
    ]
  }
}
```

### Zod 없이:

```typescript
// 에러가 발생해도 원인을 파악하기 어려움
// 런타임 에러나 예상치 못한 동작 발생
```

## 4. **코드 예시로 비교**

### Zod 없이 (기존 방식):

```typescript
// 수동 검증
function validateUser(data: any) {
  if (typeof data.name !== "string") {
    throw new Error("Name must be string");
  }
  if (typeof data.age !== "number" || data.age < 0) {
    throw new Error("Age must be positive number");
  }
  if (typeof data.email !== "string" || !data.email.includes("@")) {
    throw new Error("Invalid email");
  }
  return data;
}

// 타입 정의도 별도로 필요
interface User {
  name: string;
  age: number;
  email: string;
}
```

### Zod 사용 시:

```typescript
// 스키마 정의 (타입 + 검증 규칙)
const UserSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
  email: z.string().email(),
});

// 타입 자동 추론
type User = z.infer<typeof UserSchema>;

// 간단한 검증
const result = UserSchema.safeParse(data);
```

## 5. **실제 효과**

### Zod의 장점:

1. **개발 생산성**: 타입 정의와 검증 로직을 한 번에 작성
2. **유지보수성**: 스키마 변경 시 타입과 검증이 자동으로 동기화
3. **에러 디버깅**: 명확한 에러 메시지로 문제 파악 용이
4. **런타임 안전성**: API 응답, 폼 데이터 등 외부 데이터 검증
5. **코드 간소화**: 반복적인 검증 코드 제거

### Zod 없이:

1. **수동 작업**: 타입 정의와 검증 로직을 별도로 작성
2. **동기화 문제**: 타입과 검증 로직이 따로 관리되어 불일치 가능
3. **에러 처리**: 직접 에러 메시지 작성 필요
4. **런타임 위험**: 검증하지 않은 데이터로 인한 예상치 못한 에러

현재 코드에서 `age: -2`는 Zod가 검증해서 에러를 발생시키지만, Zod 없이는 그냥 통과되어 나중에 문제가 될 수 있습니다.
