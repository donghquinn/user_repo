import { UserDataRouter } from '@controllers/UserRoutes';
import express from 'express';
import { jwtAuthMiddleware } from 'middlewares/auth.middleware';

const dataRoute = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
dataRoute.post('/user/data', jwtAuthMiddleware, UserDataRouter);

export default dataRoute;
