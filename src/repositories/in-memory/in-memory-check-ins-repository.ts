import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

class InMemoryCheckInsRepository implements CheckInsRepository {  
  public checkIns: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        (checkInDate.isAfter(startOfTheDay) ||
          checkInDate.isSame(startOfTheDay)) &&
        checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyChenkinsByUserId(userId: string, page: number) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
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
