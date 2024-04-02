import { Options } from 'express-mysql-session';

export const dbConnectConfig = {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  port: Number(process.env.MARIADB_PORT),
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
  supportBigNumbers: true,
  bigNumberStrings: true,
};

export const sessionConfig: Options = {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  port: Number(process.env.MARIADB_PORT),
  charset: 'utf8mb4_bin',
  clearExpired: true,
  checkExpirationInterval: 1000 * 60,
  expiration: 1000 * 60 * 10,
  schema: {
    tableName: 'user_table_session',
    columnNames: {
      session_id: 'session_id',
      expires: 'expire_date',
      data: 'user_id',
    },
  },
};

export const globalConfig = {
  appPort: Number(process.env.APP_PORT!),
  aesSecretKey: process.env.AES_SECRET!,
  aesInitialVector: process.env.AES_IV!,
  jwtKey: process.env.JWT_KEY,
};
