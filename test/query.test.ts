/* eslint-disable max-len */
import { encryptPassword, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { randomUUID } from 'crypto';
import { escape } from 'mysql2';
import { UserInfo } from 'types/user.type';

describe('Check DB Connection and Query Data', () => {
  const mysql = MySqlInstance.getInstance();

  test('Connection Test', async () => {
    const result = await mysql.start();

    expect(result).toBeUndefined();
  });

  test('CREATE USER TABLE', async () => {
    const userResult = await mysql.query(`
        CREATE TABLE IF NOT EXISTS user_table (
            user_id         VARCHAR(150)     NOT NULL      PRIMARY KEY,
            user_name       VARCHAR(150)     NULL,
            user_email      VARCHAR(150)     NOT NULL      UNIQUE,
            user_password   VARCHAR(200)     NOT NULL,
            user_status     CHAR(2)          NOT NULL      DEFAULT '10' COMMENT '10: 활성유저, 20: 휴면 유저, 30: 회원 탈퇴',
            user_type       TINYINT(1)       NOT NULL      DEFAULT 1    COMMENT '1: 일반 유저, 2: 관리자 유저',
            reg_date        DATETIME         NOT NULL      DEFAULT CURRENT_TIMESTAMP
        )
    `);

    expect(userResult).toBeDefined();
  });

  test('CREATE SESSION TABLE', async () => {
    const sessionResult = await mysql.query(`
        CREATE TABLE IF NOT EXISTS user_table_session (
            session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
            user_id         VARCHAR(150)     NOT NULL        REFERENCES  user_table(user_id) ON DELETE CASCADE,
            reg_date        DATETIME         NOT NULL        DEFAULT CURRENT_TIMESTAMP,
            refresh_date    DATETIME         NULL,
            expire_date     DATETIME         NULL
        )
      `);

    expect(sessionResult).toBeDefined();
  });
});

describe('Insert DataBase', () => {
  const mysql = MySqlInstance.getInstance();

  const encodedEmail = encryptString('testdong@exampel.com');
  const encodedName = encryptString('testdong');
  const encodedPassword = encryptPassword('142');

  const userId = randomUUID();

  test('INSERT Sample Data', async () => {
    await mysql.query(`
        INSERT INTO 
          user_table (user_id, user_email, user_name, user_password)
        VALUES
          (${escape(userId)}, ${escape(encodedEmail)}, ${escape(encodedName)}, ${escape(encodedPassword)})
    `);

    const [result] = await mysql.query<Array<{ count: string }>>(
      ` SELECT COUNT(1) as count 
        FROM
          user_table
        WHERE
          user_status = 10 AND
          user_id = ${escape(userId)} AND
          user_email = ${escape(encodedEmail)} AND
          user_password = ${escape(encodedPassword)}
      `,
    );

    expect(result.count).toBe('1');
  });

  test('Test Select User Info', async () => {
    const [result] = await mysql.query<Array<UserInfo>>(`
            SELECT
              user_id
            FROM 
              user_table
            WHERE
              user_email = ${escape(encodedEmail)} AND 
              user_password = ${escape(encodedPassword)} AND
              user_status = 10
        `);

    expect(result.user_id).toBe(userId);
  });
  afterAll(async () => {
    await mysql.stop();
  });
});
