import { decryptString } from '@libraries/Crypto';
import { MySqlInstance } from '@libraries/Database';
import { Request, Response } from 'express';
import { escape } from 'mysql2';
import { JwtToken } from 'types/auth.type';
import { UserTableData } from '../types/user.type';

export const UserDataRouter = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { userId, userType } = req.body.decoded as JwtToken;

  try {
    const client = MySqlInstance.getInstance();

    const [result] = await client.query<Array<UserTableData>>(`
        SELECT 
          user_email, user_name
        FROM 
          user_table
        WHERE
          user_id = ${escape(userId)} AND
          user_type = ${escape(userType)}
    `);

    if (result instanceof Error) return res.status(404).json({ message: 'No User Data Result' });

    const isAdmin = userType === 'ADMIN';

    const { user_email: userEmail, user_name: userName } = result;

    const userDataValue = {
      userId,
      isAdmin,
      userEmail: decryptString(userEmail),
      userName: decryptString(userName),
    };

    return res.status(200).json({ userData: userDataValue });
  } catch (error) {
    throw new Error('Get User Data Error');
  }
};
