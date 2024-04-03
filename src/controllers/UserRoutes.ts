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

    const { userId, userType } = req.body as JwtToken;

    const [result] = await client.query<Array<UserTableData>>(`
        SELECT 
          user_email, user_name
        FROM 
          user_table
        WHERE
          user_id = ${escape(userId)} AND
          user_type = ${escape(userType)}
    `);

    const isAdmin = userType === 'ADMIN';

    const userDataValue = {
      userId,
      isAdmin,
      userEmail: decryptString(result.user_email),
      userName: decryptString(result.user_name),
    };

    if (result instanceof Error) return res.status(404).json({ message: 'No User Data Result' });

    return res.status(200).json({ userData: userDataValue, token: jwtRefresh(token, '10m') });
  } catch (error) {
    throw new Error('Get User Data Error');
  }
};
