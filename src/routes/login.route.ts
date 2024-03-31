import { LoginProcess } from '@controllers/LoginRoutes';
import express from 'express';

const loginRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
loginRouter.post('/login', LoginProcess);

export default loginRouter;
