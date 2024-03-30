import { MySqlInstance } from '@libraries/Database';
import { randomUUID } from 'crypto';

describe( "Insert DataBase", () =>
{
    const mysql = MySqlInstance.getInstance();
    
    const userId = randomUUID();

    test( "Insert User Data", async () =>
    {
        mysql.query( `
            INSERT INTO table_user (user_id, user_email, user_name, user_password, user_status)
            VALUES
            (${userId}, test@example.com, test, 1234, 10 )
            ;
        `)
    })
})