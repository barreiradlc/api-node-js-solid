import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

class InMemoUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: `${this.users.length + 1}`,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}

export { InMemoUsersRepository };
