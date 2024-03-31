/* eslint-disable max-len */
import { MySqlInstance } from "@libraries/Database";
import express from 'express';

const mysql = MySqlInstance.getInstance();

await mysql.start();

const app = express();

app.get( "/", ( req, res ) => {
    res.json( { message: "success" } );
} );

app.post( "/api/signup" );
app.post( "/api/login" );

app.listen( 6308, () => {
    console.log( "Listening On 6308" );
} );
