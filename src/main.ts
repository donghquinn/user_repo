import { MySqlInstance } from '@libraries/Database';
import cors from 'cors';
import express, { Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import loginRouter from 'routes/login.route';
import signupRouter from 'routes/signup.route';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'success' });
});

const port = process.env.APP_PORT === undefined ? 3000 : Number(process.env.APP_PORT);

app.set('port', port);

app.use(cors());
app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser());

app.use('/', loginRouter);
app.use('/', signupRouter);

app.listen(port, () => {
  console.log('Listening On 6308');
});
