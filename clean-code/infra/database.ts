import pgp from "pg-promise";
import 'dotenv/config';

interface QueryData {
    query: string, 
    values?: any[],
}

export const query = async (queryData: QueryData) => {
    const { query, values } = queryData;
    let connection:any;
    let db:any;

    const client = {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    }
    
    try {
        connection = pgp({})
        db = connection(client)
        return db.query(query, values);
    } catch(err) {
        throw err;
    } finally {
        await db.$pool.end();
    }
}
