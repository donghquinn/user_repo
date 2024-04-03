import { globalConfig } from '@configs/ServerConfig';
import jwt from 'jsonwebtoken';

export const jwtSign = (userId: string, sessionId: string, expire: string) => {
  try {
    const payloadObj = {
      userId,
      sessionId,
    };

    return jwt.sign(payloadObj, globalConfig.jwtKey, { algorithm: 'HS256', expiresIn: expire });
  } catch (error) {
    console.log('JWT Error: %o', { error });

    throw Error('JWT Signing');
  }
};

export const jwtValid = (token: string) => {
  try {
    const decoded = jwt.verify(token, globalConfig.jwtKey);

    return decoded;
  } catch (error) {
    console.log('JWT Verify Error: %o', { error });

    throw new Error('JWT Verify');
  }
};
