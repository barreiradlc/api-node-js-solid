class InvalidCredentialsError extends Error {
  constructor() {
    super("Credentials does not match");
  }
}

export { InvalidCredentialsError };
