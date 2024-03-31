import { MySqlInstance } from '@libraries/Database';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { createHash, randomUUID } from 'node:crypto';
import { UserInfo } from 'types/user.type';

interface RequestBody {
  email: string;
  password: string;
}

export const LoginProcess = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

  const { email, password } = req.body as RequestBody;

  console.log('Email, Password: %o', { email, password });

  try {
    const client = MySqlInstance.getInstance();

    const encodedEmail = createHash('sha256').update(email).digest('base64');
    const encodedPassword = createHash('sha256').update(password).digest('base64');

    const queryString = `
        SELECT
            user_id, user_email FROM user_table
        WHERE
            user_email = ${escape(encodedEmail)} AND 
            user_password = ${escape(encodedPassword)}
        `;

    const result = await client.query<Array<UserInfo>>(queryString);

    console.log('[LOGIN] Query Result: %o', { result });

    if (!result) return res.status(400).json({ message: 'No User Found' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
            INSERT INTO user_table_session (session_id, user_id)
            VALUES (${escape(sessionId)}, ${escape(result[0].user_id)})`);

    if (!inserResult) return res.status(401).json({ message: 'User Data Session Insert Error' });

    return res.status(200).json({ result });

    // return result;
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
