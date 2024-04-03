import { globalConfig } from '@configs/ServerConfig';
import jwt from 'jsonwebtoken';
import { JwtToken } from 'types/auth.type';

export const jwtSign = (userId: string, userType: string, sessionId: string, expire: string) => {
  try {
    const payloadObj: JwtToken = {
      userId,
      userType,
      sessionId,
    };

    return jwt.sign(payloadObj, globalConfig.jwtKey, { algorithm: 'HS256', expiresIn: expire });
  } catch (error) {
    console.log('JWT Error: %o', { error });

    throw Error('JWT Signing');
  }
};

export const jwtValid = (token: string): JwtToken => {
  try {
    const decoded = jwt.verify(token, globalConfig.jwtKey);

    console.log('Decoded: %o', { decoded });

    return decoded as JwtToken;
  } catch (error) {
    console.log('JWT Verify Error: %o', { error });

    throw new Error('JWT Verify');
  }
};

export const jwtRefresh = (token: string, expire: string) => {
  try {
    const decoded = jwtValid(token);

    const newPayload: JwtToken = {
      userId: decoded.userId,
      userType: decoded.userType,
      sessionId: decoded.sessionId,
    };

    return jwt.sign(newPayload, globalConfig.jwtKey, { algorithm: 'HS256', expiresIn: expire });
  } catch (error) {
    throw new Error('JWT Middleware Refresh');
  }
};
