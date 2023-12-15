import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

const checkInPayload = {
  gymId: "gym-1",
  userId: "user-1",
};

describe("Register UseCase", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to create check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
    });

    await expect(() =>
      sut.execute({
        gymId: checkInPayload.gymId,
        userId: checkInPayload.userId,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to create check in twice in different day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
