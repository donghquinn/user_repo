import { MySqlInstance } from "@libraries/Database";
import { createHash } from "node:crypto";

export const LoginRoute = async (email: string, password: string) =>
{
    try
    {
        const client = MySqlInstance.getInstance();

        // const userId = randomUUID();

        const encodedEmail = createHash( "sha256" ).update( email ).digest( "base64" );
        const encodedPassword = createHash( "sha256" ).update( password ).digest( "base64" );

        const queryString =
            `SELECT * FROM user_table WHERE user_email = ${ encodedEmail } AND user_password = ${ encodedPassword }`;

        const result = await client.query( queryString );

        return result;
     } catch ( err )
    {
        throw new Error;
    }
}