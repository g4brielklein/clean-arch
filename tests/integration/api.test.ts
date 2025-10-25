import axios from 'axios';

axios.defaults.validateStatus = () => {
    return true
};

test("Should create an user type passenger", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };
    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
})

test("Should not create an account with invalid user name", async () => {
    const input = {
        name: 'JohnDoe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };
    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-3);
})
