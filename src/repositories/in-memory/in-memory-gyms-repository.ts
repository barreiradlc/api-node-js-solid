import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";

class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gyms) => gyms.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
export { InMemoryGymsRepository };
