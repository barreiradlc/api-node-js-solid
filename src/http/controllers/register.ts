import { EmailAlreadyExistsError } from "@/use-cases/errors/user-already-exists";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ email, name, password });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send();
    }

    return reply.status(500).send();
  }

  return reply.status(201).send({ email });
}
