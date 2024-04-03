import { jwtValid } from 'auth/auth';
import { NextFunction, Response, Request } from 'express';

export const jwtAuthMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request.headers.authorization?.split('Bearer ')[1];

  try {
    if (token === undefined) return response.status(500).json({ error: 'JWT Token is not included' });

    const decoded = jwtValid(token);

    console.log('Decoded JWT: %o', { decoded });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.body.userId = decoded.userId;

    return next();
  } catch (error) {
    console.log('JWT Middleware Error: %o', { error });
    throw new Error('JWT Middleware Error');
  }
};
