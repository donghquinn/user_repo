import { MySqlInstance } from '@libraries/Database';
import { randomUUID } from 'crypto';

describe( "Insert DataBase", () =>
{
    const mysql = MySqlInstance.getInstance();
    
    const userId = randomUUID();

    test( "Insert User Data", async () => {
        const result = await mysql.query( `
            INSERT INTO table_user (user_id, user_email, user_name, user_password, user_status)
            VALUES
            (${ userId }, test@example.com, test, 1234, 10 )
            ;
        `);

        expect( result ).toBeDefined();
    } );

    test('Query', async() => {
      const result = await mysql.query( 'SELECT COUNT(1) FROM table_user ' );

    expect(result).toBeDefined();
  });
})