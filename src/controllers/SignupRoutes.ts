import { encryptPassword, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { escape } from 'mysql2';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface UserCountResult {
  count: string;
}

export const SignupRoute = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as SignupRequest;
  try {
    const mysql = MySqlInstance.getInstance();

    const encodedEmail = encryptString(email);
    const encodedName = encryptString(name);
    const encodedPassword = encryptPassword(password);

    const queryString = `
        SELECT COUNT(1) as count FROM user_table WHERE user_email = ${escape(encodedEmail)}
      `;

    const result = await mysql.query<Array<UserCountResult>>(queryString);

    console.log('Count Result: %o', { result });

    if (result[0].count !== '0') return res.status(400).json({ message: 'Already Got Users' });

    const userId = randomUUID();

    const insertString = `
        INSERT INTO user_table (user_id, user_name, user_email, user_password)
        VALUES
        ( ${escape(userId)}, ${escape(encodedName)}, ${escape(encodedEmail)}, ${escape(encodedPassword)} )
    `;

    const insertResult = await mysql.query(insertString);

    console.log('Insert Finished');

    if (!insertResult) return res.status(401).json({ message: 'User Insert Error' });

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('Error: %o', { error });
    return res.status(500).json({ error });
  }
};
