export const dbConnectConfig = {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  port: Number( process.env.MARIADB_PORT ),
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0,
  supportBigNumbers: true,
  bigNumberStrings: true,
};
