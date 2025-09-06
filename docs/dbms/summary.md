테이블 설계 요약

user

기본 사용자 정보, 이메일 유니크

habit

사용자별 습관 정의 (목표 유형: 횟수/시간), 활성/삭제 플래그

habit_log

습관 기록 (날짜별 값/메모). 1일 N회 기록 가능(중복 허용), 조회 인덱스 최적화

subscription

구독 상태/기간(현재 사이클) 관리, 취소/만료/체험(trial) 타임스탬프

payment

결제 트랜잭션(구독 결제/단발 모두), 상태/부분환불/PG 트랜잭션 ID/메타(JSON)

관계

user (1) — (N) habit

habit (1) — (N) habit_log

user (1) — (N) subscription

subscription (1) — (N) payment (단, payment.subscription_id는 NULL 가능: 단건 결제)

user (1) — (N) payment
