import { describe, expect, it } from "vitest";
import { InMemoUsersRepository } from "@/repositories/in-memory/users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { RegisterUseCase } from "./register";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate UseCase", () => {
  const userPayload = {
    email: "test@example.com",
    password: "123456",
  };

  it("should authenticate user", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUserRepository);

    await inMemoryUserRepository.create({
      name: "test",
      email: userPayload.email,
      password_hash: await hash(userPayload.password, 6),
    });

    const { user } = await sut.execute(userPayload);

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not authenticate with wrong email", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUserRepository);

    await expect(() => sut.execute(userPayload)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should not authenticate with wrong password", async () => {
    const inMemoryUserRepository = new InMemoUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUserRepository);

    await inMemoryUserRepository.create({
      name: "test",
      email: userPayload.email,
      password_hash: await hash(userPayload.password, 6),
    });

    await expect(() =>
      sut.execute({
        email: userPayload.email,
        password: "other-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
