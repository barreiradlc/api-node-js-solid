import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkIn = this.checkIns.find((item) => item.user_id === userId);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      validated_at: data.validated_at
        ? new Date(data.validated_at)
        : new Date(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }
}

export { InMemoryCheckInsRepository };
