# 📱 페이지별 API 호출 매핑 테이블

## 📋 개요

각 페이지에서 호출되어야 하는 API와 현재 API 명세를 매핑한 테이블입니다.

---

## 🔗 API 명세 요약

- **습관/기록**: 6개 API
- **결제/구독**: 4개 API
- **총 10개 API**

---

## 📊 페이지별 API 호출 매핑

| **페이지**      | **경로**        | **필요한 API**                                              | **API 명세**                                                                              | **우선순위** | **비고**                                 |
| --------------- | --------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------ | ---------------------------------------- |
| **로그인 대체** | `/`             | -                                                           | -                                                                                         | -            | 더미 사용자 선택, API 호출 없음          |
| **대시보드**    | `/dashboard`    | 1. 습관 목록 조회<br>2. 주간 통계 조회<br>3. 구독 상태 조회 | 1. `GET /api/habits`<br>2. `GET /api/stats/weekly`<br>3. `GET /api/subscription`          | 높음         | 현재 하드코딩된 데이터를 API로 대체 필요 |
| **습관 추가**   | `/add-habit`    | 1. 습관 추가                                                | 1. `POST /api/habits`                                                                     | 높음         | 폼 제출 시 API 호출 필요                 |
| **습관 기록**   | `/record`       | 1. 습관 목록 조회<br>2. 습관 기록 추가<br>3. 습관 기록 조회 | 1. `GET /api/habits`<br>2. `POST /api/habits/{id}/logs`<br>3. `GET /api/habits/{id}/logs` | 높음         | 기록 업데이트 시 API 호출 필요           |
| **구독/결제**   | `/subscription` | 1. 구독 상태 조회<br>2. 결제 요청                           | 1. `GET /api/subscription`<br>2. `POST /api/payments/checkout`                            | 높음         | 현재 플랜 표시 및 결제 처리              |
| **결제 완료**   | `/success`      | 1. 결제 상태 조회<br>2. 구독 상태 조회                      | 1. `GET /api/payments/{id}`<br>2. `GET /api/subscription`                                 | 높음         | 결제 완료 확인 및 구독 활성화 상태 표시  |

---

## ⚠️ 누락된 API 및 추가 필요사항

### 1. **대시보드 페이지** (`/dashboard`)

**현재 하드코딩된 데이터:**

- `weeklyHabits` (습관 목록)
- `weeklyStats` (주간 통계)
- `weeklyProgress` (주간 진행률)

**필요한 추가 API:**

- ✅ `GET /api/habits` - 습관 목록 조회
- ✅ `GET /api/stats/weekly` - 주간 통계 조회
- ✅ `GET /api/subscription` - 구독 상태 조회

### 2. **습관 기록 페이지** (`/record`)

**현재 하드코딩된 데이터:**

- `todayHabits` (오늘의 습관 목록)

**필요한 추가 API:**

- ✅ `GET /api/habits` - 습관 목록 조회
- ✅ `POST /api/habits/{id}/logs` - 습관 기록 추가
- ✅ `GET /api/habits/{id}/logs` - 습관 기록 조회

### 3. **구독 페이지** (`/subscription`)

**현재 하드코딩된 데이터:**

- `plans` (구독 플랜 목록)

**필요한 추가 API:**

- ✅ `GET /api/subscription` - 현재 구독 상태 조회
- ✅ `POST /api/payments/checkout` - 결제 요청

### 4. **결제 완료 페이지** (`/success`)

**현재 하드코딩된 데이터:**

- `subscriptionData` (구독 정보)

**필요한 추가 API:**

- ✅ `GET /api/payments/{id}` - 결제 상태 조회
- ✅ `GET /api/subscription` - 구독 상태 조회

---

## 🚨 추가로 필요한 API (현재 명세에 없음)

### 1. **사용자 관련 API**

- `GET /api/users/me` - 현재 사용자 정보 조회
- `PUT /api/users/me` - 사용자 정보 업데이트
- `GET /api/users` - 사용자 선택용 API(실전에선 필요없지만, 데모에서는 필요. 또는 하드코딩 해둘것.)

### 2. **습관 관리 API**

- `PUT /api/habits/{id}` - 습관 정보 수정
- `GET /api/habits/{id}` - 특정 습관 상세 조회

### 3. **기록 관리 API**

- `PUT /api/habits/{id}/logs/{logId}` - 습관 기록 수정
- `DELETE /api/habits/{id}/logs/{logId}` - 습관 기록 삭제

### 4. **통계 API**

- [보류]`GET /api/stats/daily` - 일일 통계 조회
- [보류]`GET /api/stats/monthly` - 월간 통계 조회
- [보류]`GET /api/stats/streak` - 연속 기록 통계

### 5. **알림/메모 API**

- [보류]`POST /api/notes` - 일일 메모 저장
- [보류]`GET /api/notes` - 메모 조회

---

## 📝 구현 우선순위

### **1단계 (높음)**

- [ ] `GET /api/habits` - 습관 목록 조회
- [ ] `POST /api/habits` - 습관 추가
- [ ] `GET /api/stats/weekly` - 주간 통계 조회
- [ ] `GET /api/subscription` - 구독 상태 조회

### **2단계 (중간)**

- [ ] `POST /api/habits/{id}/logs` - 습관 기록 추가
- [ ] `GET /api/habits/{id}/logs` - 습관 기록 조회
- [ ] `POST /api/payments/checkout` - 결제 요청
- [ ] `GET /api/payments/{id}` - 결제 상태 조회

### **3단계 (낮음)**

- [ ] `DELETE /api/habits/{id}` - 습관 삭제
- [ ] `POST /api/payments/{id}/complete` - 결제 완료 처리

---

## 🔧 현재 상태 요약

- **총 페이지**: 6개
- **API 호출 필요한 페이지**: 5개 (로그인 대체 제외)
- **현재 하드코딩된 데이터**: 모든 페이지
- **API 연동 필요**: 100% (모든 페이지)

**다음 단계**: API 명세에 맞춰 각 페이지의 하드코딩된 데이터를 실제 API 호출로 대체해야 합니다.
