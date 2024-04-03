import { globalConfig } from '@configs/ServerConfig';
import { MySqlInstance } from '@libraries/Database';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import userDefaultRouter from './routes';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'success' });
});

const port = globalConfig.appPort;

app.set('port', port);

app.use(cors({ preflightContinue: false, allowedHeaders: ['Authorization', 'Content-Type'] }));
app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser());

app.use('/api/user', userDefaultRouter);

app.listen(port, () => {
  console.log(`Listening On ${port}`);
});
