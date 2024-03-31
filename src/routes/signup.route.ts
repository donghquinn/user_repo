/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignupRoute } from '@controllers/SignupRoutes';
import express from 'express';

const signupRouter = express.Router();

signupRouter.post('/signup', SignupRoute);

export default signupRouter;
