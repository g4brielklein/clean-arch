export default class AuthorizeDecorator {
    constructor (readonly usecase: any) {}

    async execute (input: any):Promise<any> {
        console.log("Verify authorization");
        return this.usecase.execute(input);
    }
}
