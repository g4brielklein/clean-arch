import express, { Application, Request, Response } from 'express';
import Hapi, { Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
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
                console.error(err);

                if (err.errorCode) {
                    return res.status(err.statusCode).json(err);
                }

                const error = new InternalServerError({ cause: err });
                res.status(error.statusCode).json(error);
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }
}

export class HapiAdapter implements HttpServer {
    server: Hapi.Server;

    constructor () {
        this.server = Hapi.server({});
    }

    register(method: any, url: string, callback: Function): void {
        this.server.route({
            method,
            path: url.replace(/\:/g, ""),
            async handler (request: HapiRequest, reply: ResponseToolkit) {
                try {
                    const output = await callback(request.params, request.payload);
                    return output;
                } catch (err: any) {
                    console.error(err)
                    if (err.errorCode) {
                        const errorReturn = {
                            status_code: err.statusCode,
                            error_code: err.errorCode,
                        }
                        return reply.response(errorReturn).code(err.statusCode);
                    }

                    const error = new InternalServerError({ cause: err });
                    return reply.response({
                        status_code: error.statusCode,
                    }).code(error.statusCode);
                }
            }
        });
    }

    listen(port: number) {
        this.server.settings.port = port;
        this.server.start();
    }
}
