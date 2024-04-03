import { UserDataRouter } from '@controllers/UserRoutes';
import express from 'express';
import { jwtAuthMiddleware } from 'middlewares/auth.middleware';

const userDataRoute = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
userDataRoute.post('/data', jwtAuthMiddleware, UserDataRouter);

export default userDataRoute;
