import { dbConnectConfig } from '@configs/ServerConfig';
import { createPool, Pool } from 'mysql2/promise';
import { DbQueryResult } from 'types/database.type';

export class MySqlInstance {
  private static instance: MySqlInstance;

  private client: Pool;

  constructor() {
    this.client = createPool(dbConnectConfig);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MySqlInstance();
    }

    return this.instance;
  }

  public async start(): Promise<void> {
    try {
      await this.client.getConnection();

      console.log('Connect Success');

      await this.client.query(`
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

      await this.client.query(`
        CREATE TABLE IF NOT EXISTS user_table_session (
            session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
            user_id         VARCHAR(150)     NOT NULL        REFERENCES   user_table(user_id) ON DELETE CASCADE,
            reg_date        DATETIME         NOT NULL        DEFAULT      CURRENT_TIMESTAMP,
            refresh_date    DATETIME         NULL,
            expire_date     DATETIME         NULL
        )
      `);

      // 세션 체크 - 매 10분마다 체크하는 세팅. refresh 세션 id를 발급하고, expire 세션 id를 발급한다.
      await this.client.query(`
      CREATE EVENT IF NOT EXISTS session_cleanup
        ON SCHEDULE EVERY 10 MINUTE
        DO
        BEGIN
            DECLARE cutoff_time DATETIME;
            SET cutoff_time = NOW() - INTERVAL 10 MINUTE;

        UPDATE your_table_name
        SET 
            refresh_date = CASE
                WHEN refresh_date IS NULL THEN CURRENT_DATETIME
                ELSE refresh_date
            END,
            expire_date = CASE
                WHEN refresh_date IS NOT NULL THEN CURRENT_DATETIME + INTERVAL 10 MINUTE
                ELSE expire_date
            END
        WHERE
            refresh_date IS NULL OR refresh_date IS NOT NULL;
        END;
      `);
    } catch (error) {
      console.log('Connect Error: %o', { error });

      throw new Error('Connection Error');
    }
  }

  public async query<T>(sql: string): Promise<DbQueryResult<T>> {
    try {
      const [result] = await this.client.query<DbQueryResult<T>>(sql);

      return result;
    } catch (error) {
      console.log('Query Error: %o', { error });

      throw new Error('Query Error');
    }
  }

  public async stop() {
    try {
      const result = await this.client.end();

      console.log('Disconnect Success');

      return result;
    } catch (error) {
      console.log('Disconnect Error: %o', { error });

      throw new Error('Disconnection Error');
    }
  }
}
