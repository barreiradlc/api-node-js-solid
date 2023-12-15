class EmailAlreadyExistsError extends Error {
  constructor() {
    super("User already exists!");
  }
}

export { EmailAlreadyExistsError };
