import { hash } from "bcryptjs";
import { EmailAlreadyExistsError } from "./errors/user-already-exists";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}

export { RegisterUseCase };
