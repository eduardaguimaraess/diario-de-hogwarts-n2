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