/* eslint-disable max-len */
import { MySqlInstance } from '@libraries/Database';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import router from 'routes';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'success' });
});

app.use(cors);
app.use(helmet);
app.use(bodyParser);

app.use('/', router);

app.listen(6308, () => {
  console.log('Listening On 6308');
});
