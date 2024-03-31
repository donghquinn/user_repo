import { MySqlInstance } from "@libraries/Database";

describe('Check DB Connection and Query Data', () => {
  const mysql = MySqlInstance.getInstance();
    
    test( "Connection Test", async () => {
        const result = await mysql.start();

        expect( result ).toBe( "success" );
    } );

    // test( "CREATE USER TABLE", async () => {
    //     const userResult = await mysql.query( `
    //         CREATE TABLE user_table (
    //             user_id         VARCHAR(150)     NOT NULL     PRIMARY KEY,
    //             user_name       VARCHAR(150)     NULL,
    //             user_email      VARCHAR(150)     NOT NULL,
    //             user_password   VARCHAR(200)     NOT NULL,
    //             user_status     VARCHAR(10)     NOT NULL,
    //             user_type       TINYINT(1)      NOT NULL      DEFAULT 1,
    //             reg_date        DATETIME        NOT NULL      DEFAULT CURRENT_TIMESTAMP
    //         )
    //     `);
        
    //     expect( userResult ).toBeDefined();
    // } );

    // test( "CREATE SESSION TABLE", async () => {
    //     const sessionResult = await mysql.query( `
    //         CREATE TABLE user_table_session (
    //             session_id      VARCHAR(150)     NOT NULL        PRIMARY KEY,
    //             user_id         VARCHAR(150)     NOT NULL        REFERENCES  user_table(user_id),
    //             reg_date        DATETIME         NOT NULL        DEFAULT CURRENT_TIMESTAMP
    //         )
    //     `);
        
    //     expect( sessionResult ).toBeDefined();
    // } );
});
