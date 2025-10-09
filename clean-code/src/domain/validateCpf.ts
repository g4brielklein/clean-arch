const CPF_LENGTH = 11

export const validateCpf = (cpf: string) => {
	if (!cpf) return false
	cpf = clearCpf(cpf)
	if (cpf.length !== CPF_LENGTH) return false
	if (isAllSameDigits(cpf)) return false
	const digit1 = calculateDigit(cpf, 10);
	const digit2 = calculateDigit(cpf, 11);
	return extractDigit(cpf) === `${digit1}${digit2}`
}

const clearCpf = (cpf: string) => {
	return cpf.replace(/\D/g,'');
}

const isAllSameDigits = (cpf: string) => {
	const [firstDigit] = cpf;
	return [...cpf].every((digit: string) => digit === firstDigit)
}

const calculateDigit = (cpf: string, factor: number) => {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) {
			total += parseInt(digit) * factor--;
		}
	}
	const rest = total % 11;
	return (rest < 2) ? 0 : 11 - rest;
}

const extractDigit = (cpf: string) => {
	return cpf.substring(cpf.length - 2, cpf.length);
}
