import { globalConfig } from '@configs/ServerConfig';
import { MySqlInstance } from '@libraries/Database';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { createCipheriv, createDecipheriv, createHash, randomUUID } from 'node:crypto';
import { UserInfo } from 'types/user.type';

interface RequestBody {
  email: string;
  password: string;
}

export const LoginProcess = async (req: Request, res: Response) => {
  const { email, password } = req.body as RequestBody;

  try {
    const client = MySqlInstance.getInstance();

    const cipher = createCipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
    const decipher = createDecipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);

    const encodedEmail = cipher.update(email, 'utf8', 'base64') + cipher.final('base64');
    const decodedEmail = decipher.update(encodedEmail, 'base64', 'utf8') + decipher.final('utf8');

    const encodedPassword = createHash('sha256').update(password).digest('base64');

    console.log('Email Encoded: %o', { email, encodedEmail, decodedEmail, encodedPassword });

    const queryString = `
        SELECT
            user_id, user_email FROM user_table
        WHERE
            user_email = ${escape(encodedEmail)} AND 
            user_password = ${escape(encodedPassword)}
        `;

    const result = await client.query<Array<UserInfo>>(queryString);

    if (!result) return res.status(400).json({ message: 'No User Found' });

    const sessionId = randomUUID();

    const inserResult = await client.query(`
        INSERT INTO user_table_session (session_id, user_id)
        VALUES (${escape(sessionId)}, ${escape(result[0].user_id)})
        ON DUPLICATE KEY UPDATE
          session_id = VALUES(session_id),
          user_id = VALUES(user_id)
      `);

    if (!inserResult) return res.status(401).json({ message: 'User Data Session Insert Error' });

    res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 60 * 1000 * 10 });
    return res.status(200).json({ sessionId });

    // return result;
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
