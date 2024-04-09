import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { EmailAlreadyExistsError } from "./errors/user-already-exists";
import { RegisterUseCase } from "./register";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UsersRepository } from "@/repositories/users-repository";

let inMemoryUserRepository: UsersRepository;
let sut: RegisterUseCase;

const userPayload = {
  email: "test@example.com",
  name: "Test User",
  password: "123456",
};

describe("Register UseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(inMemoryUserRepository);
  });

  it("should create user", async () => {
    const { user } = await sut.execute(userPayload);

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon register", async () => {
    const { user } = await sut.execute(userPayload);

    const isPasswrdCorrectlyHashed = await compare(
      userPayload.password,
      user.password_hash,
    );

    expect(isPasswrdCorrectlyHashed).toBe(true);
  });

  it("should not be able to create the user with same email", async () => {
    await sut.execute(userPayload);

    await expect(() => sut.execute(userPayload)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );
  });
});
