import { Gym } from "@prisma/client";

interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
}

export { GymsRepository };
