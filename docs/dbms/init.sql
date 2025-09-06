-- V1__init_habit_subscription_payment.sql
-- MySQL 8.x / InnoDB / utf8mb4
-- 모든 DATETIME은 UTC로 저장/해석한다고 가정

-- 안전 설정
-- SET NAMES utf8mb4;
-- SET time_zone = '+00:00';

-- -- id 자동증가 기본 옵션 (필요시)
-- SET SESSION sql_require_primary_key=0;

-- 1) user
CREATE TABLE IF NOT EXISTS `user` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '사용자 ID',
  `email`         VARCHAR(255) NOT NULL COMMENT '이메일',
  `password_hash` VARCHAR(255) NULL COMMENT '비밀번호 해시',
  `name`          VARCHAR(100) NULL COMMENT '사용자명',
  `phone`         VARCHAR(30)  NULL COMMENT '전화번호',
  `current_plan`  VARCHAR(50)  NULL COMMENT '현재 구독 플랜 (BASIC, PRO, FAMILY)',
  `created_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_user` PRIMARY KEY (`id`),
--   CONSTRAINT `uk_user_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='사용자 정보';

-- 2) habit
CREATE TABLE IF NOT EXISTS `habit` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '습관 ID',
  `user_id`           BIGINT UNSIGNED NOT NULL COMMENT '사용자 ID',
  `title`             VARCHAR(120) NOT NULL COMMENT '습관 제목 (예: 허리 스트레칭)',
  `description`       VARCHAR(500) NULL COMMENT '습관 설명',
  `goal_type`         ENUM('COUNT','DURATION') NOT NULL COMMENT '목표 유형 (횟수/시간)',
  `goal_value`        INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '목표값 (COUNT = 회수, DURATION = 분 단위 등)',
  `start_date`        DATE NOT NULL COMMENT '습관 시작일',
  `repeats_type`      ENUM('DAY','WEEK','MONTH','YEAR') NOT NULL DEFAULT 'DAY' COMMENT '반복 유형 (일, 주, 월, 년)',
  `repeat_every_value` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '반복 주기 값 (1~100, 예: 매주 3회일 경우 3)',
  `repeat_detail_info` VARCHAR(1000) NULL COMMENT '반복 상세 정보 (JSON 문자열)',
  `tags`              VARCHAR(500) NULL COMMENT '태그 (컴마 연결 문자열, 예: stretch,important)',
  `is_active`         TINYINT(1) NOT NULL DEFAULT 1 COMMENT '활성 상태',
  `deleted_at`        DATETIME(3) NULL COMMENT '삭제일시',
  `created_at`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_habit` PRIMARY KEY (`id`),
  CONSTRAINT `fk_habit_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_habit_goal_value_nonzero` CHECK (`goal_value` > 0),
  CONSTRAINT `ck_habit_repeat_every_value_range` CHECK (`repeat_every_value` >= 1 AND `repeat_every_value` <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='습관 정보';

-- 사용자 내 동일 제목 중복 방지(소프트 삭제 제외 원하면 부분 수정)
CREATE UNIQUE INDEX `uk_habit_user_title_active`
  ON `habit` (`user_id`, `title`, `is_active`)
  WHERE `deleted_at` IS NULL;

CREATE INDEX `ix_habit_user` ON `habit` (`user_id`);

-- 3) habit_log
CREATE TABLE IF NOT EXISTS `habit_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '습관 기록 ID',
  `habit_id`    BIGINT UNSIGNED NOT NULL COMMENT '습관 ID',
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '사용자 ID (조인 최적화용 중복 컬럼)',
  `log_date`    DATE NOT NULL COMMENT '기록 날짜 (로컬이 아닌 UTC 날짜 기준 권장)',
  `value`       INT UNSIGNED NOT NULL COMMENT '기록값 (COUNT: 횟수, DURATION: 분 등)',
  `note`        VARCHAR(500) NULL COMMENT '메모',
  `created_at`  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',

  CONSTRAINT `pk_habit_log` PRIMARY KEY (`id`),
  CONSTRAINT `fk_habit_log_habit` FOREIGN KEY (`habit_id`) REFERENCES `habit`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_habit_log_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_habit_log_value_positive` CHECK (`value` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='습관 기록';

-- 조회/통계 최적화 인덱스
CREATE INDEX `ix_habit_log_habit_date` ON `habit_log` (`habit_id`, `log_date`);
CREATE INDEX `ix_habit_log_user_date`  ON `habit_log` (`user_id`, `log_date`);

-- (옵션) 동일 habit/날짜/메모 중복을 막고 싶다면 아래 유니크 사용
-- CREATE UNIQUE INDEX `uk_habit_log_one_per_day`
--   ON `habit_log` (`habit_id`, `log_date`);

-- 4) subscription (결제 정책 테이블)
CREATE TABLE IF NOT EXISTS `subscription` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '구독 ID',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '사용자 ID',
  `plan_type`       VARCHAR(50) NOT NULL COMMENT '플랜 유형 (BASIC, PRO, FAMILY)',
  `status`          ENUM('ACTIVE','CANCELLED','EXPIRED','TRIAL') NOT NULL DEFAULT 'TRIAL' COMMENT '구독 상태',
  `start_date`      DATETIME(3) NOT NULL COMMENT '구독 시작일',
  `end_date`        DATETIME(3) NULL COMMENT '구독 종료일',
  `trial_end_date`  DATETIME(3) NULL COMMENT '체험 종료일',
  `cancelled_at`    DATETIME(3) NULL COMMENT '취소일시',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_subscription` PRIMARY KEY (`id`),
  CONSTRAINT `fk_subscription_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='구독 정보';

CREATE INDEX `ix_subscription_user` ON `subscription` (`user_id`);
CREATE INDEX `ix_subscription_status` ON `subscription` (`status`);

-- 5) tb_goods (상품 정보)
CREATE TABLE IF NOT EXISTS `tb_goods` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '상품 ID',
  `goods_name`      VARCHAR(200) NOT NULL COMMENT '상품명',
  `goods_type`      VARCHAR(50) NOT NULL COMMENT '상품 유형 (SUBSCRIPTION, ONE_TIME)',
  `price`           DECIMAL(10,2) NOT NULL COMMENT '가격',
  `description`     TEXT NULL COMMENT '상품 설명',
  `is_active`       TINYINT(1) NOT NULL DEFAULT 1 COMMENT '활성 상태',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_tb_goods` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='상품 정보';

-- 6) tb_orders (주문 정보)
CREATE TABLE IF NOT EXISTS `tb_orders` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '주문 ID',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '사용자 ID',
  `order_number`    VARCHAR(100) NOT NULL COMMENT '주문번호',
  `order_status`    ENUM('PENDING','PAID','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING' COMMENT '주문 상태',
  `total_amount`    DECIMAL(10,2) NOT NULL COMMENT '총 금액',
  `payment_method`  VARCHAR(50) NULL COMMENT '결제 방법',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_tb_orders` PRIMARY KEY (`id`),
  CONSTRAINT `fk_tb_orders_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  CONSTRAINT `uk_tb_orders_number` UNIQUE (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='주문 정보';

CREATE INDEX `ix_tb_orders_user` ON `tb_orders` (`user_id`);
CREATE INDEX `ix_tb_orders_status` ON `tb_orders` (`order_status`);

-- 7) tb_orders_goods (주문 상품 정보)
CREATE TABLE IF NOT EXISTS `tb_orders_goods` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '주문상품 ID',
  `order_id`        BIGINT UNSIGNED NOT NULL COMMENT '주문 ID',
  `goods_id`        BIGINT UNSIGNED NOT NULL COMMENT '상품 ID',
  `quantity`        INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '수량',
  `unit_price`      DECIMAL(10,2) NOT NULL COMMENT '단가',
  `total_price`     DECIMAL(10,2) NOT NULL COMMENT '총 가격',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',

  CONSTRAINT `pk_tb_orders_goods` PRIMARY KEY (`id`),
  CONSTRAINT `fk_tb_orders_goods_order` FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tb_orders_goods_goods` FOREIGN KEY (`goods_id`) REFERENCES `tb_goods`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='주문 상품 정보';

CREATE INDEX `ix_tb_orders_goods_order` ON `tb_orders_goods` (`order_id`);
CREATE INDEX `ix_tb_orders_goods_goods` ON `tb_orders_goods` (`goods_id`);

-- 8) tb_orders_payment (주문 결제 정보)
CREATE TABLE IF NOT EXISTS `tb_orders_payment` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '결제 ID',
  `order_id`        BIGINT UNSIGNED NOT NULL COMMENT '주문 ID',
  `subscription_id` BIGINT UNSIGNED NULL COMMENT '구독 ID (구독 결제인 경우)',
  `payment_method`  VARCHAR(50) NOT NULL COMMENT '결제 방법',
  `payment_status`  ENUM('PENDING','SUCCESS','FAILED','CANCELLED','REFUNDED','PARTIAL_REFUND') NOT NULL DEFAULT 'PENDING' COMMENT '결제 상태',
  `amount`          DECIMAL(10,2) NOT NULL COMMENT '결제 금액',
  `refund_amount`   DECIMAL(10,2) NULL DEFAULT 0 COMMENT '환불 금액',
  `pg_transaction_id` VARCHAR(200) NULL COMMENT 'PG사 트랜잭션 ID',
  `pg_response`     JSON NULL COMMENT 'PG사 응답 메타데이터',
  `paid_at`         DATETIME(3) NULL COMMENT '결제 완료일시',
  `refunded_at`     DATETIME(3) NULL COMMENT '환불일시',
  `created_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '생성일시',
  `updated_at`      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '수정일시',

  CONSTRAINT `pk_tb_orders_payment` PRIMARY KEY (`id`),
  CONSTRAINT `fk_tb_orders_payment_order` FOREIGN KEY (`order_id`) REFERENCES `tb_orders`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tb_orders_payment_subscription` FOREIGN KEY (`subscription_id`) REFERENCES `subscription`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='주문 결제 정보';

CREATE INDEX `ix_tb_orders_payment_order` ON `tb_orders_payment` (`order_id`);
CREATE INDEX `ix_tb_orders_payment_subscription` ON `tb_orders_payment` (`subscription_id`);
CREATE INDEX `ix_tb_orders_payment_status` ON `tb_orders_payment` (`payment_status`);
