import { globalConfig } from '@configs/ServerConfig';
import { MySqlInstance } from '@libraries/Database';
import loginRouter from '@routers/login.route';
import signupRouter from '@routers/signup.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'success' });
});

const port = globalConfig.appPort;

app.set('port', port);

app.use(cors({ preflightContinue: false }));
app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser());

app.use('/', loginRouter);
app.use('/', signupRouter);

app.listen(port, () => {
  console.log(`Listening On ${port}`);
});
