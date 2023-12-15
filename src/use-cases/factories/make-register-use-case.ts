import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { RegisterUseCase } from "../register";

function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(prismaUsersRepository);

  return registerUseCase;
}

export { makeRegisterUseCase };
