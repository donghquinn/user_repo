import express from 'express';
import loginRoute from './login.route';

const router = express.Router();

router.use('/api/user/login', loginRoute);

export default router;
