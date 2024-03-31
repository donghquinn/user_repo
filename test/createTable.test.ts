/* eslint-disable max-len */
import { MySqlInstance } from "@libraries/Database";
import { createHash, randomUUID } from "crypto";
import { escape } from 'mysql2';

describe('Check DB Connection and Query Data', () => {
  const mysql = MySqlInstance.getInstance();
    
    test( "Connection Test", async () => {
        const result = await mysql.start();

        expect( result ).toBe( "success" );
    } );

    test( "CREATE USER TABLE", async () => {
        const userResult = await mysql.query( `
            CREATE TABLE user_table IF NOT EXISTS (
                user_id         VARCHAR(150)     NOT NULL      PRIMARY KEY,
                user_name       VARCHAR(150)     NULL,
                user_email      VARCHAR(150)     NOT NULL      UNIQUE,
                user_password   VARCHAR(200)     NOT NULL,
                user_status     CHAR(2)          NOT NULL      DEFAULT '10',
                user_type       TINYINT(1)       NOT NULL      DEFAULT 1,
                reg_date        DATETIME         NOT NULL      DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        expect( userResult ).toBeDefined();
    } );

    test( "CREATE SESSION TABLE", async () => {
        const sessionResult = await mysql.query( `
            CREATE TABLE user_table_session IF NOT EXISTS (
                session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
                user_id         VARCHAR(150)     NOT NULL        REFERENCES  user_table(user_id),
                reg_date        DATETIME         NOT NULL        DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        expect( sessionResult ).toBeDefined();
    } );
});

describe( "Insert DataBase", () => {
  const mysql = MySqlInstance.getInstance();
    
  const encodedEmail = createHash( "sha256" ).update( "test@example.com" ).digest( "base64" );
  const encodedPassword = createHash( "sha256" ).update( "1234" ).digest( "base64" );
  const encodedName = createHash( "sha256" ).update( "test" ).digest( "base64" );

  const userId = randomUUID();

  test( 'Query', async () => {
    await mysql.query( `
        INSERT INTO user_table (user_id, user_email, user_name, user_password)
        VALUES
        (${ escape(userId) }, ${ escape( encodedEmail ) }, ${ escape( encodedName ) }, ${ escape( encodedPassword ) })`
    );
    
    const result = await mysql.query( 'SELECT COUNT(1) FROM user_table ' );

    console.log( "Count Result: %o", { result } );

    expect( result ).toBeDefined();
  } );

  test( "Test Select User Info", async () => {
    const result = await mysql.query( `
            SELECT user_name FROM user_table WHERE user_email = ${ escape( encodedEmail ) } AND user_password = ${ encodedPassword }
        `);

    console.log( "User Info Query Result: %o", { result } );

    expect( result ).toBeDefined();
  } );

} );
