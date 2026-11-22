export const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        additionalProperties: false,
        properties: {
            email: {
                type: 'string',
                minLength: 5,
                maxLength: 190,
                pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
            },
            password: {
                type: 'string',
                minLength: 8,
                maxLength: 128
            }
        }
    }
} as const;

export const registerUserSchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password', 'role', 'house'],
        additionalProperties: false,
        properties: {
            name: {
                type: 'string',
                minLength: 2,
                maxLength: 100
            },
            email: {
                type: 'string',
                minLength: 5,
                maxLength: 190,
                pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
            },
            password: {
                type: 'string',
                minLength: 8,
                maxLength: 128
            },
            role: {
                type: 'string',
                enum: ['student', 'teacher']
            },
            house: {
                type: 'string',
                enum: ['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa']
            }
        }
    }
} as const;
