/* eslint-disable max-len */

export const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS user_table (
        user_id         VARCHAR(150)     NOT NULL      PRIMARY KEY,
        user_name       VARCHAR(150)     NULL,
        user_email      VARCHAR(150)     NOT NULL      UNIQUE,
        user_password   VARCHAR(200)     NOT NULL,
        user_status     CHAR(2)          NOT NULL      DEFAULT '10' COMMENT '10: 활성유저, 20: 휴면 유저, 30: 회원 탈퇴',
        user_type       ENUM("NORM", "ADMIN")       NOT NULL      DEFAULT "NORM"    COMMENT 'NORM: 일반 유저, ADMIN: 관리자 유저',
        reg_date        DATETIME         NOT NULL      DEFAULT CURRENT_TIMESTAMP
    )
`;

export const createUserTableSessionSql = `
    CREATE TABLE IF NOT EXISTS user_table_session (
        session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
        user_id         VARCHAR(150)     NOT NULL        REFERENCES   user_table(user_id) ON DELETE CASCADE,
        reg_date        DATETIME         NOT NULL        DEFAULT      CURRENT_TIMESTAMP,
        refresh_date    DATETIME         NULL,
        expire_date     DATETIME         NULL
    )
`;
