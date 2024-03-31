/* eslint-disable max-len */
import { MySqlInstance } from '@libraries/Database';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import loginRouter from 'routes/login.route';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'success' });
});

app.set('port', 6308);

app.use(cors);
app.use(helmet);
app.use(bodyParser);

app.use('/', loginRouter);

app.listen(6308, () => {
  console.log('Listening On 6308');
});
