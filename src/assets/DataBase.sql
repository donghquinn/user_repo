CREATE TABLE IF NOT EXISTS user_table (
    user_id         VARCHAR(150)     NOT NULL      PRIMARY KEY,
    user_name       VARCHAR(150)     NULL,
    user_email      VARCHAR(150)     NOT NULL      UNIQUE,
    user_password   VARCHAR(200)     NOT NULL,
    user_status     CHAR(2)          NOT NULL      DEFAULT '10',
    user_type       TINYINT(1)       NOT NULL      DEFAULT 1,
    reg_date        DATETIME         NOT NULL      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_table_session (
    session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
    user_id         VARCHAR(150)     NOT NULL        REFERENCES  user_table(user_id),
    reg_date        DATETIME         NOT NULL        DEFAULT CURRENT_TIMESTAMP,
    refresh_date    DATETIME         NULL,
    expire_date     DATETIME         NULL
);
