import axios from 'axios';

test("Should create an user", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input, {
        validateStatus: (status) => true
    });
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined()

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
    expect(responseGetAccount.data.name).toBe(input.name)
    expect(responseGetAccount.data.email).toBe(input.email)
    expect(responseGetAccount.data.cpf).toBe(input.cpf)
})

test("Should not create an user with invalid name", async () => {
    const input = {
        name: 'JohnDoe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input, {
        validateStatus: (status) => true
    });
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-3)
})

test("Should not create an user with invalid email", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}gmail.com`,
        cpf: '97456321558',
        password: 'Abcd1234',
        isPassenger: true,
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input, {
        validateStatus: (status) => true
    });
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-2)
})

test("Should not create an user with invalid CPF", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321557',
        password: 'Abcd1234',
        isPassenger: true,
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input, {
        validateStatus: (status) => true
    });
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-1)
})

test("Should not create an user with invalid password", async () => {
    const input = {
        name: 'John Doe',
        email: `johndoe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        password: 'Abcd123',
        isPassenger: true,
    }

    const responseSignup = await axios.post('http://localhost:3000/signup', input, {
        validateStatus: (status) => true
    });
    const outputSignup = responseSignup.data;
    expect(outputSignup.error_code).toBe(-5);
})
