/* eslint-disable max-len */
import { MySqlInstance } from "@libraries/Database";
import express from 'express';

const mysql = MySqlInstance.getInstance();

await mysql.start();


// const encodedEmail = createHash( "sha256" ).update( "test@example.com" ).digest( "base64" );
// const encodedPassword = createHash( "sha256" ).update( "1234" ).digest( "base64" );
// const encodedName = createHash( "sha256" ).update( "test" ).digest( "base64" );

// const userId = randomUUID();

// await mysql.query( `
//     INSERT INTO user_table (user_id, user_email, user_name, user_password)
//     VALUES
//     ("${ userId }", ${ escape( encodedEmail ) }, ${escape(encodedName) }, ${ escape( encodedPassword ) })`
// );


// const queryString =
//     `SELECT * FROM user_table WHERE user_email = ${ escape(encodedEmail) } AND user_password = ${ escape(encodedPassword) }`;

// const [result] = await mysql.query( queryString );

// console.log( "Result: %o", { result } );

const app = express();

app.get( "/", ( req, res ) => {
    res.json( { message: "success" } );
} );

app.listen( 6308, () => {
    console.log( "Listening On 6308" );
} );
