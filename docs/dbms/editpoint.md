1. habit : 습관 입력 타입 어떻게?
2. habit_log : 문제 없어 보임.
3. user : 문제 없어보임.
4. 공통 : 공통컬럼 정의 및 일괄 적용(del_yn, create_at, create_by, update_at, update_by) : 나중에 API 개발이 일반적이게 되었을 때 적용. 보류
5. subscription : table comment 결제 정책 이라고 추가.
6. 공통 : 한국어 comment 컬럼별로 추가.
7. 참고 : UI상으로 보일 BASIC, PRO, FAMILY 각각 정책은 DB로 관리안함.- > 변경. 상품으로 관리.
8. 결제 관련 : 회사 프로젝트에서 작업했던 table로 진행.(tb_goods(이건 선택으로 보임.), tb_orders, tb_orders_goods, tb_orders, tb_orders_payment)
9. user : user에 current_plan 정보를 추가.
10. habit: start_date(습관 시작일)추가, unit 제거, times 제거, repeatsType(day, week, month, year), repeatEveryValue(1~100 가능. ex)매주 3회 일경우 3), repeatDetailInfo(varchar, repeat과 관련된 jsonString정보. 정형화 불가능. 고도화시 사용), tags(tag컴마연결문자열 ex)stretch,important) 추가.
11. habit_log : 수정할거 없음.
