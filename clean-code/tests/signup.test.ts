import axios from 'axios';

axios.defaults.validateStatus = () => true;

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
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
})

test("Should create an user type driver", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: false,
        isDriver: true,
        carPlate: 'IOG6D88'
    };

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
})

test("Should not create an user with invalid name", async () => {
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

test("Should not create an user with invalid email", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    };

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-2);
})

test("Should not create an user with invalid CPF", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321557',
        password: 'Abcd1234',
        isPassenger: true,
    };

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-1);
})

test("Should not create an user with invalid password", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd123',
        isPassenger: true,
    };

    const responseSignup = await axios.post('http://localhost:3000/signup', input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-5);
})
