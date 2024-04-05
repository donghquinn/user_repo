/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { jwtValid } from 'auth/auth';
import { NextFunction, Response, Request } from 'express';

export const jwtAuthMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request.headers.authorization?.split('Bearer ')[1];

  try {
    if (token === undefined) return response.status(500).json({ error: 'JWT Token is not included' });

    const { userId, userType } = jwtValid(token);

    request.body.decoded = { userId, userType };

    return next();
  } catch (error) {
    console.log('JWT Middleware Error: %o', { error });

    throw new Error('JWT Middleware Error');
  }
};
