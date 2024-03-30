import { MySqlInstance } from "@libraries/Database";

describe('Check DB Connection and Query Data', () => {
  const mysql = MySqlInstance.getInstance();

    test( "Connection Test", async () =>
    {
        await mysql.start();
        
    } );

    test( "CREATE USER", async () => {
        const userResult = await mysql.query( `
            CREATE TABLE table_user (
                user_id         VARCHAR(50)     NOT NULL,
                user_name       VARCHAR(50)     NULL,
                user_email      VARCHAR(50)     NOT NULL,
                user_password   VARCHAR(50)     NOT NULL,
                user_status     VARCHAR(10)     NOT NULL,

                PRIMARY KEY user_id
            );
        `);
        
        expect( userResult ).toBeDefined();
    } );

    test( "CREATE SESSION", async () => {
        const sessionResult = await mysql.query( `
            CREATE TABLE table_user_session (
                session_id      VARCHAR(50)     NOT NULL,
                user_id         VARCHAR(50)     NOT NULL        REFERENCES  table_user(user_id),

                PRIMARY KEY session_id
            );
        `);
        
        expect( sessionResult ).toBeDefined();
    } );
});
