import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

async function registerUseCase({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new Error("Email already taken!");
  }

  const password_hash = await hash(password, 6);

  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  });
}

export { registerUseCase };
