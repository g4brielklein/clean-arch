export class InvalidFieldError extends Error {
    errorCode: number;
    statusCode: number;

    constructor(message: string, { errorCode }) {
        super(message);

        this.name = "InvalidFieldError";
        this.errorCode = errorCode;
        this.statusCode = 422;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            error_code: this.errorCode,
            status_code: this.statusCode,
        };
    };
}

export class InternalServerError extends Error {
    statusCode: number;

    constructor() {
        super("Internal Server Error");

        this.name = "InternalServerError";
        this.statusCode = 500;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status_code: this.statusCode,
        };
    };
}

export class ResourceAlreadyExistsError extends Error {
    errorCode: number;
    statusCode: number;

    constructor(message: string, { errorCode }) {
        super(message);

        this.name = "ResourceAlreadyExistsError";
        this.errorCode = errorCode;
        this.statusCode = 409;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            error_code: this.errorCode,
            status_code: this.statusCode,
        };
    };
}

export class ResourceNotFoundError extends Error {
    errorCode?: number;
    statusCode: number;

    constructor(message: string, { errorCode }: { errorCode?: number } = {}) {
        super(message);

        this.name = "ResourceNotFoundError";
        this.statusCode = 404;
        this.errorCode = errorCode;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            error_code: this.errorCode,
            status_code: this.statusCode,
        };
    };
}
