import { describe, expect, it, test } from "vitest";
import { compare } from "bcryptjs";
import { InMemoUsersRepository } from "@/repositories/in-memory/users-repository";
import { RegisterUseCase } from "./register";
import { EmailAlreadyExistsError } from "./errors/user-already-exists";

describe("Register UseCase", () => {
  const userPayload = {
    email: "test@example.com",
    name: "Test User",
    password: "123456",
  };

  it("should create user", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    const { user } = await registerUseCase.execute(userPayload);

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon register", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    const { user } = await registerUseCase.execute(userPayload);

    const isPasswrdCorrectlyHashed = await compare(
      userPayload.password,
      user.password_hash,
    );

    expect(isPasswrdCorrectlyHashed).toBe(true);
  });

  it("should not be able to create the user with same email", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    await registerUseCase.execute(userPayload);

    expect(() => registerUseCase.execute(userPayload)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );
  });
});
