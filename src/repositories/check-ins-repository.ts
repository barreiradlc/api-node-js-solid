import { CheckIn, Prisma } from "@prisma/client";

interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}

export { CheckInsRepository };
