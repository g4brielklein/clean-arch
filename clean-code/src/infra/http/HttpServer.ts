import express, { Application, Request, Response } from 'express';
import { InternalServerError } from '../errors';

export default interface HttpServer {
    register (method: string, url: string, callback: Function): void;
    listen (port: number): void;
}

export class ExpressAdapter implements HttpServer {
    app: Application;

    constructor () {
        this.app = express();
        this.app.use(express.json());
    }

    register(method: string, url: string, callback: Function): void {
        this.app[method as keyof Application](url.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (err: any) {
                if (err.errorCode) {
                    console.error(err);
                    return res.status(err.statusCode).json(err);
                }

                const error = new InternalServerError({ cause: err });
                console.error(error);
                res.status(error.statusCode).json(error);
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }
}
