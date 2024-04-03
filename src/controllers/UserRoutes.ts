import { decryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { jwtRefresh } from 'auth/auth';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { JwtToken } from 'types/auth.type';
import { UserTableData } from '../types/user.type';

export const UserDataRouter = async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (token === undefined) return res.status(500).json({ message: 'JWT Token is not Valid' });

  try {
    const client = MySqlInstance.getInstance();

    const { userId } = req.body as JwtToken;

    console.log('User ID: %o', { userId });

    const [result] = await client.query<Array<UserTableData>>(`
        SELECT * FROM user_table WHERE user_id = ${escape(userId)}
      `);

    const userDataValue = {
      userId,
      userEmail: decryptString(result.user_email),
      userName: decryptString(result.user_name),
      userPassword: decryptString(result.user_password),
    };

    if (result instanceof Error) return res.status(404).json({ message: 'No User Data Result' });

    const refreshToken = jwtRefresh(token, '10m');
    return res.status(200).json({ userData: userDataValue, token: refreshToken });
  } catch (error) {
    throw new Error('Get User Data Error');
  }
};
