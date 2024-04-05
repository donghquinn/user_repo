/* eslint-disable max-len */
import { globalConfig } from '@configs/ServerConfig';
import { decryptString, encryptPassword, encryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { SignupRequest, UserCountResult } from 'types/signup.type';

const mysql = MySqlInstance.getInstance();

export const SignupRoute = async (req: Request, res: Response) => {
  const { email, password, name, adminCode } = req.body as SignupRequest;
  try {
    const decodedEmail = decryptString(email);
    const decodedName = decryptString(name);
    const decodedPassword = decryptString(password);

    const encodedEmail = encryptString(decodedEmail);
    const encodedName = encryptString(decodedName);
    const encodedPassword = encryptPassword(decodedPassword);

    const queryString = `
        SELECT COUNT(1) as count FROM user_table WHERE user_email = ${escape(encodedEmail)}
      `;

    const [result] = await mysql.query<Array<UserCountResult>>(queryString);

    if (result.count !== '0') return res.status(400).json({ message: 'Already Got Users' });

    const userId = randomUUID();

    const userType = adminCode === globalConfig.adminCode ? 'ADMIN' : 'NORM';

    const insertString = `
        INSERT INTO user_table (user_id, user_name, user_email, user_password, user_type)
        VALUES
        ( ${escape(userId)}, ${escape(encodedName)}, ${escape(encodedEmail)}, ${escape(encodedPassword)}, ${escape(userType)} )
    `;

    const insertResult = await mysql.query(insertString);

    if (insertResult instanceof Error) return res.status(401).json({ message: 'User Insert Error' });

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
