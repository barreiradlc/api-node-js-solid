import { saveNumberToPrismaDecimal } from "@/utils/decimal-parse-prisma";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
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

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: saveNumberToPrismaDecimal(data.latitude),
      longitude: saveNumberToPrismaDecimal(data.longitude),
      created_at: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }
}
export { InMemoryGymsRepository };
