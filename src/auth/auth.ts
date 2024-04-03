import { globalConfig } from '@configs/ServerConfig';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtToken } from 'types/auth.type';

export const jwtSign = (userId: string, userType: string, sessionId: string, expire: string) => {
  try {
    const payloadObj: JwtPayload = {
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

    return decoded as JwtToken;
  } catch (error) {
    console.log('JWT Verify Error: %o', { error });

    throw new Error('JWT Verify');
  }
};

// TODO 만료 시점 체크 해서 갱신하기
export const jwtRefresh = (token: string, expire: string) => {
  try {
    const { userId, userType, sessionId, iat, exp } = jwtValid(token);

    // 초
    const remaining = exp - iat;

    console.log('Reaming: %o', { remaining });
    const newPayload: JwtPayload = {
      userId,
      userType,
      sessionId,
    };

    return jwt.sign(newPayload, globalConfig.jwtKey, { algorithm: 'HS256', expiresIn: expire });
  } catch (error) {
    throw new Error('JWT Middleware Refresh');
  }
};
