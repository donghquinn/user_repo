import { encryptPassword, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { randomUUID } from 'node:crypto';
import { RequestBody } from 'types/login.type';
import { UserInfo } from 'types/user.type';

const client = MySqlInstance.getInstance();

export const LoginProcess = async (req: Request, res: Response) => {
  const { email, password } = req.body as RequestBody;

  try {
    const encodedEmail = encryptString(email);
    const encodedPassword = encryptPassword(password);

    const queryString = `
      SELECT
          user_id
      FROM
          user_table
      WHERE
          user_email = ${escape(encodedEmail)} AND 
          user_password = ${escape(encodedPassword)} AND
          user_status = 10
    `;

    // Array 탈취
    const [result] = await client.query<Array<UserInfo>>(queryString);

    if (!result) return res.status(400).json({ message: 'No User Found' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
        INSERT INTO user_table_session (session_id, user_id)
        VALUES (${escape(sessionId)}, ${escape(result.user_id)})
        ON DUPLICATE KEY UPDATE
          session_id = VALUES(session_id),
          user_id = VALUES(user_id)
    `);

    if (inserResult instanceof Error) return res.status(401).json({ message: 'User Data Session Insert Error' });

    return res.status(200).json({ sessionId: encryptString(sessionId) });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
