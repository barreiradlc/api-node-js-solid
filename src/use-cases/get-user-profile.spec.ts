import { beforeEach, describe, expect, it } from "vitest";

import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { UsersRepository } from "@/repositories/users-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let inMemoryUserRepository: UsersRepository;
let sut: GetUserProfileUseCase;

const userPayload = {
  email: "test@example.com",
  password: "123456",
};

describe("getProfile UseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryUserRepository);
  });

  it("should get user profile", async () => {
    const createdUser = await inMemoryUserRepository.create({
      name: "test",
      email: userPayload.email,
      password_hash: await hash(userPayload.password, 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual("test");
  });

  it("should not get profile with wrong id", async () => {
    await expect(() =>
      sut.execute({ userId: "invalid-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
