import { MySqlInstance } from '@libraries/Database';
import cors from 'cors';
import express, { Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import loginRouter from 'routes/login.route';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'success' });
});

app.set('port', 6308);

app.use(cors());
app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser());

app.use('/', loginRouter);

app.listen(6308, () => {
  console.log('Listening On 6308');
});
