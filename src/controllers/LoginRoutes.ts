import { MySqlInstance } from '@libraries/Database';
import express from 'express';
import { escape } from 'mysql2';
import { createHash, randomUUID } from 'node:crypto';
import { UserInfo } from 'types/user.type';

export const LoginProcess = async (req: express.Request, res: express.Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const request = JSON.parse(req.body) as { email: string; password: string };

  const { email, password } = request;

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

    const result = await client.query<UserInfo>(queryString);

    console.log('[LOGIN] Query Result: %o', { result });

    if (!result) return res.json({ message: 'No User Found' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
            INERT INTO user_table_session (session_id, user_id)
            VALUES (${escape(sessionId)}, ${escape(result.user_id)})`);

    if (!inserResult) return res.json({ message: 'User Data Session Insert Error' });

    return res.json({ result });

    // return result;
  } catch (err) {
    return res.json({ err });
  }
};
