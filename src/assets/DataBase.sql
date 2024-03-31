CREATE TABLE uesr_table (
    user_id         VARCHAR(50)     NOT NULL,
    user_name       VARCHAR(50)     NULL,
    user_email      VARCHAR(50)     NOT NULL,
    user_password   VARCHAR(50)     NOT NULL,
    user_status     VARCHAR(10)     NOT NULL    DEFAULT "10",
    user_type       TINYINT         NOT NULL    DEFAULT 1,

    PRIMARY KEY user_id
);

CREATE TABLE user_table__session (
    session_id      VARCHAR(50)     NOT NULL,
    user_id         VARCHAR(50)     NOT NULL        REFERENCES  table_user(user_id),

    PRIMARY KEY session_id
);
