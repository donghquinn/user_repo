import { jwtSign, jwtValid } from '@auth/auth';
import { JwtToken } from 'types/auth.type';

describe('JWT Test', () => {
  const examplePayload: JwtToken = {
    userId: '1234',
    sessionId: '14233',
    userType: 'NORM',
  };

  const token = jwtSign('1234', 'NORM', '14233', '10m');

  test('JWT TOKEN', () => {
    const { userId, userType, sessionId } = jwtValid(token);

    expect({ userId, userType, sessionId }).toStrictEqual(examplePayload);
  });
});
