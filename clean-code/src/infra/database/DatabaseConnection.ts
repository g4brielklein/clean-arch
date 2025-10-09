import pgp from "pg-promise";
import 'dotenv/config';

interface QueryData {
    query: string, 
    values?: any[],
}

export default interface DatabaseConnection {
    query (queryData: QueryData): Promise<any>;
    close (): Promise<any>;
}

export class PgPromiseAdapter implements DatabaseConnection {
    db: any;
    connection: any;

    constructor () {
        const client = {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            database: process.env.PG_DATABASE,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
        };

        this.db = pgp({});
        this.connection = this.db(client);
    }

    query(queryData: QueryData): Promise<any> {
        const { query, values } = queryData;

        return this.connection.query(query, values);
    }

    close(): Promise<any> {
        return this.connection.$pool.end();
    }
}
