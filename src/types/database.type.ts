import {  ResultSetHeader, RowDataPacket } from "mysql2";

export type DbQueryDefault = RowDataPacket[] | RowDataPacket[][] | ResultSetHeader[] | ResultSetHeader;

export type DbQueryResult<T> = T & DbQueryDefault;
// export type DbQueryResult=  DbDefaults;