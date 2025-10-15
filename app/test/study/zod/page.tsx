"use client";
import { z } from 'zod';
import { useEffect } from 'react';  // 이 줄 추가

// 나머지 코드는 동일...
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
  age: -2,
  email: "hong@example.com"
};


export default function Zod() {
    useEffect(() => {
        const result  = UserSchema.safeParse(userData);
        if (result.success) {
        console.log(result.data); // 타입 안전한 데이터
        } else {
        console.log(result.error); // 검증 에러
        }
        console.log(result);
    }, []);
  return (
    <div>
      <h1>Zod Test</h1>
    </div>
  )
}