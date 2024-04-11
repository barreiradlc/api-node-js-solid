import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;

let sut: CheckInUseCase;

const checkInPayload = {
  gymId: "gym-1",
  description: "Js gym",
  userId: "user-1",
  userLatitude: -15.8055607,
  userLongitude: -47.9515105,
};

const checkInDistantPayload = {
  gymId: "gym-2",
  description: "Ts gym",
  userId: "user-1",
  userLatitude: -18.7160732,
  userLongitude: -52.8619346,
};

describe("Register UseCase", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-1",
      description: "Js gym",
      title: "",
      phone: null,
      latitude: -15.8055607,
      longitude: -47.9515105,
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
      userLatitude: -15.8055607,
      userLongitude: -47.9515105,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to create check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: -15.8055607,
      userLongitude: -47.9515105,
    });

    await expect(() =>
      sut.execute({
        gymId: checkInPayload.gymId,
        userId: checkInPayload.userId,
        userLatitude: -15.8055607,
        userLongitude: -47.9515105,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to create check in twice in different day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0, 0));

    await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: -15.8055607,
      userLongitude: -47.9515105,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: checkInPayload.gymId,
      userId: checkInPayload.userId,
      userLatitude: -15.8055607,
      userLongitude: -47.9515105,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should NOT be able to create check in on distant gym", async () => {
    await gymsRepository.create({
      id: "gym-2",
      description: "Js gym",
      title: "",
      phone: null,
      latitude: -15.8055607,
      longitude: -47.9515105,
    });

    await expect(() =>
      sut.execute({
        gymId: checkInDistantPayload.gymId,
        userId: checkInDistantPayload.userId,
        userLatitude: checkInDistantPayload.userLatitude,
        userLongitude: checkInDistantPayload.userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
