import { MySqlInstance } from "@libraries/Database";
import { randomUUID } from "crypto";
import sql from 'mysql2';
import express from 'express';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const userId = randomUUID();

await mysql.query( `
    CREATE TABLE table_user (
        user_id         VARCHAR(50)     NOT NULL,
        user_name       VARCHAR(50)     NULL,
        user_email      VARCHAR(150)     NOT NULL,
        user_password   VARCHAR(200)     NOT NULL,
        user_status     VARCHAR(10)     NOT NULL,

        PRIMARY KEY user_id
    )
`);

await mysql.query( `
    INSERT INTO table_user (user_id, user_email, user_name, user_password, user_status)
    VALUES
    (
        ${sql.escape( userId ) }, 
        ${ sql.escape( "test@example.com" ) }, 
        ${ sql.escape( "test" ) }, 
        ${ sql.escape( "1234" ) }, 
        ${ sql.escape( "10" )} 
        )
    ;
`);

const app = express();

app.get( "/", ( req, res ) => {
    res.json( { message: "success" } );
} );

app.listen( 6308, () => {
    console.log( "Listening On 6308" );
} );
