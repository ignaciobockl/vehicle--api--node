import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let port: any = process.env.PORT_POSTGRESQL;
const portPostgreSql: number = parseInt( port ); 


export const pool = new Pool({
    user: process.env.USER_POSTGRESQL,
    host: process.env.HOST_POSTGRESQL,
    password: process.env.PASS_POSTGRESQL,
    database: process.env.DATABASE_POSTGRESQL,
    port: portPostgreSql
});