import { MySqlInstance } from '@libraries/Database';
import cors from 'cors';
import express, { Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
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
// app.use(bodyParser());

app.use('/', loginRouter);

app.post('/api', (req: Request, res: Response) => {
  // const body = JSON.parse(req.body) as RequestBody;
  console.log('Bdoy: %o', req.body);
  res.json({ message: 'success' });
});
app.listen(6308, () => {
  console.log('Listening On 6308');
});
