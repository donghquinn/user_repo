# User Service

유저 서비스 전용 레포

* 본 레포는 express와 SQL 연습용으로 시작한 레포입니다.
* 더불어 유저 로그인 / 회원가입 로직 구현 연습용으로도 사용하려고 합니다.

## Dependencies

0. package manager: pnpm
1. express
2. mysql2

### controller

1. LoginRoutes: 로그인 로직
2. SignupRoutes: 회원가입 로직

### routes

1. login: 로그인 라우트
2. signup: 회원가입 라우트

### Example Env

```file
    APP_PORT=
    
    MARIADB_HOST=
    MARIADB_USER=
    MARIADB_PASSWORD=
    MARIADB_PORT=
    MARIADB_DATABASE=

    SECRET_KEY=

    AES_SECRET=32바이트
    AES_IV=16바이트

    ADMIN_CODE=관리자 계정 코드

    JWT_KEY=16바이트
```
