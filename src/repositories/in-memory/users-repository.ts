interface InMemoryUser {
  name: string;
  email: string;
  password: string;
}

class InMemoUsersRepository {
  public users: InMemoryUser[] = [];

  async create(data: InMemoryUser) {
    this.users.push(data);
  }

  async findByEmail(email: string) {
    const user = this.users.find((item) => item.email === email);

    return user;
  }
}

export { InMemoUsersRepository };
