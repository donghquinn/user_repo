export const dbConnectConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number( process.env.DB_PORT ),
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
  supportBigNumbers: true,
  bigNumberStrings: true,
};
