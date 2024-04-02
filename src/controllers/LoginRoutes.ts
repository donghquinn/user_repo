import { encryptPassword, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { RequestBody } from 'types/login.type';
import { UserInfo, UserSession } from 'types/user.type';

const client = MySqlInstance.getInstance();

export const LoginProcess = async (req: Request, res: Response) => {
  const { email, password } = req.body as RequestBody;

  try {
    const encodedEmail = encryptString(email);
    const encodedPassword = encryptPassword(password);

    const [result] = await client.query<Array<UserInfo>>(`
      SELECT
          u.user_id
      FROM
          user_table u
      WHERE
          u.user_email = ${escape(encodedEmail)} AND 
          u.user_password = ${escape(encodedPassword)} AND
          u.user_status = 10
    `);

    // 유저 정보 찾기
    if (!result) return res.status(400).json({ message: 'No User Found' });

    const [sessionResult] = await client.query<Array<UserSession>>(`
      SELECT
        session_id
      FROM
        user_table_session
      WHERE
        user_id = ${escape(result.user_id)}
    `);

    // 세션 정보가 있으면 에러 리턴
    if (sessionResult) return res.status(401).json({ message: 'Already Logined User' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
        INSERT INTO user_table_session (session_id, user_id)
        VALUES (${escape(sessionId)}, ${escape(result.user_id)})
    `);

    // 데이터 입력시에 에러
    if (inserResult instanceof Error) return res.status(401).json({ message: 'User Data Session Insert Error' });

    return res.status(200).json({ sessionId: encryptString(sessionId) });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
