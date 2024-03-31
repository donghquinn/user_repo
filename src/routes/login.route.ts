import { LoginProcess } from '@controllers/LoginRoutes';
import express from 'express';

const loginRouter = express.Router();

loginRouter.post('/login', LoginProcess);

export default loginRouter;
