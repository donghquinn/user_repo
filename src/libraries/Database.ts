import { dbConnectConfig } from '@configs/ServerConfig';
import { createUserTableSessionSql, createUserTableSql } from '@configs/SqlConfig';
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

      await this.client.query(createUserTableSql);

      await this.client.query(createUserTableSessionSql);
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
      await this.client.end();

      console.log('Disconnect Success');
    } catch (error) {
      console.log('Disconnect Error: %o', { error });

      throw new Error('Disconnection Error');
    }
  }
}
