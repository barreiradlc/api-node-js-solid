import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;

let sut: CheckInUseCase;

const checkInPayload = {
  gymId: "gym-1",
  userId: "user-1",
  userLatitude: 0,
  userLongitude: 0,
};

describe("Register UseCase", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.gyms.push({
      id: "gym-1",
      description: "Js gym",
      title: "",
      phone: null,
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to create check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: checkInPayload.gymId,
        userId: checkInPayload.userId,
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to create check in twice in different day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
