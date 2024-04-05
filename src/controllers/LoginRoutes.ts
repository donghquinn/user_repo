import { comparePassword, decryptString, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { jwtSign } from 'auth/auth';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { RequestBody } from 'types/login.type';
import { UserInfo, UserSession } from 'types/user.type';

const client = MySqlInstance.getInstance();

export const LoginProcess = async (req: Request, res: Response) => {
  const { email, password } = req.body as RequestBody;

  try {
    const decodedEmail = decryptString(email);
    const decodedPassword = decryptString(password);

    const encodedEmail = encryptString(decodedEmail);

    const [userResult] = await client.query<Array<UserInfo>>(`
      SELECT
          user_id, user_type, user_password
      FROM
          user_table
      WHERE
          user_email = ${escape(encodedEmail)} AND 
          user_status = 10
    `);

    // 유저 정보 찾기
    if (!userResult) return res.status(400).json({ message: 'No User Found' });

    const { user_id: dbId, user_type: userType, user_password: dbPassword } = userResult;

    const isValidPassword = await comparePassword(decodedPassword, dbPassword);

    if (!isValidPassword) return res.status(401).json({ message: 'Password Is Not Correct' });

    const [sessionResult] = await client.query<Array<UserSession>>(`
      SELECT
        session_id
      FROM
        user_table_session
      WHERE
        user_id = ${escape(dbId)}
    `);

    // 세션 정보가 있으면 에러 리턴
    if (sessionResult) return res.status(401).json({ message: 'Already Logined User' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
        INSERT INTO user_table_session (session_id, user_id)
        VALUES (${escape(sessionId)}, ${escape(dbId)})
    `);

    // 데이터 입력시에 에러
    if (inserResult instanceof Error) return res.status(401).json({ message: 'User Data Session Insert Error' });

    const token = jwtSign(dbId, userType, sessionId, '10m');

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
