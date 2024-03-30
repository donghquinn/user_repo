CREATE TABLE table_user (
    user_id         VARCHAR(50)     NOT NULL,
    user_name       VARCHAR(50)     NULL,
    user_email      VARCHAR(50)     NOT NULL,
    user_password   VARCHAR(50)     NOT NULL,
    user_status     VARCHAR(10)     NOT NULL,

    PRIMARY KEY user_id
);

CREATE TABLE table_user_session (
    session_id      VARCHAR(50)     NOT NULL,
    user_id         VARCHAR(50)     NOT NULL        REFERENCES  table_user(user_id),

    PRIMARY KEY session_id
);
