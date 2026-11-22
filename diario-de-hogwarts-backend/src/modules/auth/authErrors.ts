export class AccountConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountConflictError';
  }
}

export class AccountInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountInputError';
  }
}
