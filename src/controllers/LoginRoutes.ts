import { MySqlInstance } from '@libraries/Database';
import express from 'express';
import { escape } from 'mysql2';
import { createHash, randomUUID } from 'node:crypto';
import { UserInfo } from 'types/user.type';

export const LoginRoute = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const client = MySqlInstance.getInstance();

    // const userId = randomUUID();

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

    if (!result) return res.send('No User Found');

    const sessionId = randomUUID();

    const inserResult = await client.query(`
            INERT INTO user_table_session (session_id, user_id)
            VALUES (${escape(sessionId)}, ${escape(result.user_id)})`);

    if (!inserResult) return res.send('User Data Session Insert Error');

    return res.json(result);

    // return result;
  } catch (err) {
    return res.json(err);
  }
};
