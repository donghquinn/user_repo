import express from 'express';
import loginRouter from './login.route';
import signupRouter from './signup.route';
import userDataRoute from './user.route';

const userDefaultRouter = express.Router();

userDefaultRouter.use('/', loginRouter);
userDefaultRouter.use('/', signupRouter);
userDefaultRouter.use('/', userDataRoute);

export default userDefaultRouter;
