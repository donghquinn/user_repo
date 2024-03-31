/* eslint-disable max-len */
import { MySqlInstance } from "@libraries/Database";
import express from 'express';
import { createHash } from "node:crypto";
import { escape } from 'mysql2';
import { randomUUID } from "crypto";

const mysql = MySqlInstance.getInstance();

await mysql.start();


const encodedEmail = createHash( "sha256" ).update( "test@example.com" ).digest( "base64" );
const encodedPassword = createHash( "sha256" ).update( "1234" ).digest( "base64" );

const userId = randomUUID();

await mysql.query( `
INSERT INTO user_table (user_id, user_email, user_name, user_password, user_status, user_type)
VALUES
("${ userId }", ${ escape( encodedEmail ) }, "test", ${ escape( encodedPassword ) }, "10", 1 )` );


const queryString =
    `SELECT * FROM user_table WHERE user_email = ${ escape(encodedEmail) } AND user_password = ${ escape(encodedPassword) }`;

const [result] = await mysql.query( queryString );

console.log( "Result: %o", { result } );

const app = express();

app.get( "/", ( req, res ) => {
    res.json( { message: "success" } );
} );

app.listen( 6308, () => {
    console.log( "Listening On 6308" );
} );
