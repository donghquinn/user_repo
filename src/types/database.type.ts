import {  ResultSetHeader, RowDataPacket } from "mysql2";

export type DbQueryResult = RowDataPacket[] | RowDataPacket[][] | ResultSetHeader[] | ResultSetHeader;

// export type DbQueryResult=  DbDefaults;