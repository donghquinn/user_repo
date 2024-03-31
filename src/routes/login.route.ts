import { LoginRoute } from '@controllers/LoginRoutes';
import express from 'express';

const loginRoute = express.Router();

loginRoute.post('/api/user/login', LoginRoute);

export default loginRoute;
