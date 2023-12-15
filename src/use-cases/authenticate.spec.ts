import { beforeEach, describe, expect, it } from "vitest";

import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users-repository";

let inMemoryUserRepository: UsersRepository;
let sut: AuthenticateUseCase;

const userPayload = {
  email: "test@example.com",
  password: "123456",
};

describe("Authenticate UseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUserRepository);
  });

  it("should authenticate user", async () => {
    await inMemoryUserRepository.create({
      name: "test",
      email: userPayload.email,
      password_hash: await hash(userPayload.password, 6),
    });

    const { user } = await sut.execute(userPayload);

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not authenticate with wrong email", async () => {
    await expect(() => sut.execute(userPayload)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should not authenticate with wrong password", async () => {
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
