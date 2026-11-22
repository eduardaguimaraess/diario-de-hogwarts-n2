import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { database } from '../../database/connection.js';
import type { UserRole } from './authTypes.js';

export interface UserAccount {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    house: string | null;
}

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    house: string | null;
}

export async function findUserByEmail(
    email: string
): Promise<UserAccount | null> {
    const [rows] = await database.execute<UserRow[]>(
        `SELECT id, name, email, password_hash, role, house
     FROM users
     WHERE email = ?
     LIMIT 1`,
        [email]
    );

    const user = rows[0];

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.password_hash,
        role: user.role,
        house: user.house
    };
}

export async function insertUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    house: string;
}): Promise<number> {
    const [result] = await database.execute<ResultSetHeader>(
        `INSERT INTO users (name, email, password_hash, role, house)
         VALUES (?, ?, ?, ?, ?)`,
        [
            input.name,
            input.email,
            input.passwordHash,
            input.role,
            input.house
        ]
    );

    return result.insertId;
}
