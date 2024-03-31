import { MySqlInstance } from "@libraries/Database";
import express from "express";
import { escape } from "mysql2";
import { createHash, randomUUID } from "node:crypto";

const router = express.Router();

const LoginRoute = async ( req: express.Request, res: express.Response ) =>
{
    const { email, password } = req.body as {email: string, password: string};
    try
    {
        
        const client = MySqlInstance.getInstance();

        // const userId = randomUUID();

        const encodedEmail = createHash( "sha256" ).update( email ).digest( "base64" );
        const encodedPassword = createHash( "sha256" ).update( password ).digest( "base64" );

        const queryString =
            `SELECT * FROM user_table 
            WHERE
                user_email = ${ escape( encodedEmail ) } AND 
                user_password = ${ escape( encodedPassword ) }
            `;

        const [ result ] = await client.query( queryString );
        
        console.log( "[LOGIN] Query Result: %o", { result } );

        if ( !result ) return res.send( "No User Found" );

        const sessionId = randomUUID();

        const inserResult = await client.query( `
        INERT INTO user_table_session (session_id, user_id)
        VALUES (${ escape( sessionId ) }, ${ escape( result.user_id ) })` );

        if ( !inserResult ) return res.send( "User Data Session Insert Error" );

        res.send( result );

        return result;
     } catch ( err ) {
        throw new Error;
    }
};

router.post( "/api/signup", LoginRoute );