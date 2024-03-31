import { dbConnectConfig } from 'configs/ServerConfig';
import { createPool, FieldPacket, Pool, QueryResult } from 'mysql2/promise';

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

    public async start(): Promise<string> {
    try {
        await this.client.getConnection();

        console.log( "Connect Success" );

        return "success";
    } catch (error) {
      console.log('Connect Error: %o', { error });

        throw new Error("Connection Error");
    }
  }

  public async query(sql: string): Promise<[QueryResult, FieldPacket[]]> {
    try {
      const result = await this.client.query(sql);

      return result;
    } catch (error) {
      console.log('Query Error: %o', { error });

        throw new Error("Query Error");
    }
  }
    
public async stop() {
    try {
      const result = await this.client.end();

        console.log( "Disconnect Success" );
        
      return result;
    } catch (error) {
      console.log('Disconnect Error: %o', { error });

        throw new Error("Disconnection Error");
    }
  }
}
