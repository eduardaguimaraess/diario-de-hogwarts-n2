import argon2 from 'argon2';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { database } from '../database/connection.js';

type UserRole = 'student' | 'teacher';

const validHouses = [
    'Grifinória',
    'Sonserina',
    'Corvinal',
    'Lufa-Lufa'
] as const;

type HogwartsHouse = (typeof validHouses)[number];

interface NewUser {
    name: string;
    email: string;
    role: UserRole;
    house: HogwartsHouse;
}

async function collectUserData(): Promise<NewUser> {
    const prompt = createInterface({
        input: stdin,
        output: stdout
    });

    try {
        const name = (await prompt.question('Nome completo: ')).trim();
        const email = (await prompt.question('E-mail: ')).trim().toLowerCase();
        const roleInput = (await prompt.question(
            'Perfil (aluno/student ou professor/teacher): '
        ))
            .trim()
            .toLowerCase();

        if (!name) {
            throw new Error('O nome é obrigatório.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Informe um endereço de e-mail válido.');
        }

        let role: UserRole;

        if (roleInput === 'aluno' || roleInput === 'student') {
            role = 'student';
        } else if (roleInput === 'professor' || roleInput === 'teacher') {
            role = 'teacher';
        } else {
            throw new Error('O perfil deve ser aluno ou professor.');
        }

        const houseInput = (await prompt.question(
            'Casa (Grifinória, Sonserina, Corvinal ou Lufa-Lufa): '
        )).trim();

        if (!validHouses.includes(houseInput as HogwartsHouse)) {
            throw new Error('Informe uma das quatro casas válidas.');
        }

        return {
            name,
            email,
            role,
            house: houseInput as HogwartsHouse
        };
    } finally {
        prompt.close();
    }
}

function askHiddenPassword(question: string): Promise<string> {
    if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
        return Promise.reject(
            new Error('Execute este script em um terminal interativo do VS Code.')
        );
    }

    return new Promise((resolve, reject) => {
        let password = '';

        stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        const finish = (error?: Error) => {
            stdin.setRawMode(false);
            stdin.pause();
            stdin.off('data', onData);
            stdout.write('\n');

            if (error) {
                reject(error);
            } else {
                resolve(password);
            }
        };

        const onData = (chunk: string) => {
            for (const character of chunk) {
                if (character === '\u0003') {
                    finish(new Error('Cadastro cancelado.'));
                    return;
                }

                if (character === '\r' || character === '\n') {
                    finish();
                    return;
                }

                if (character === '\u007f' || character === '\b') {
                    password = password.slice(0, -1);
                    continue;
                }

                password += character;
            }
        };

        stdin.on('data', onData);
    });
}

async function createUser(): Promise<void> {
    const user = await collectUserData();

    const [existingUsers] = await database.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [user.email]
    );

    if (existingUsers.length > 0) {
        throw new Error('Já existe uma conta cadastrada com esse e-mail.');
    }

    const password = await askHiddenPassword('Senha (mínimo de 8 caracteres): ');

    if (password.length < 8) {
        throw new Error('A senha precisa ter pelo menos 8 caracteres.');
    }

    const passwordConfirmation = await askHiddenPassword('Confirme a senha: ');

    if (password !== passwordConfirmation) {
        throw new Error('As senhas informadas não coincidem.');
    }

    const passwordHash = await argon2.hash(password);

    await database.execute<ResultSetHeader>(
        `INSERT INTO users (name, email, password_hash, role, house)
         VALUES (?, ?, ?, ?, ?)`,
        [user.name, user.email, passwordHash, user.role, user.house]
    );

    console.log(
        `Conta de ${user.role === 'teacher' ? 'professor' : 'aluno'} criada com sucesso.`
    );
    console.log(`E-mail cadastrado: ${user.email}`);
    console.log(`Casa: ${user.house}`);
}

async function main(): Promise<void> {
    try {
        await createUser();
    } finally {
        await database.end();
    }
}

main().catch((error: unknown) => {
    const message =
        error instanceof Error ? error.message : 'Erro inesperado ao criar conta.';

    console.error(`Não foi possível criar a conta: ${message}`);
    process.exitCode = 1;
});