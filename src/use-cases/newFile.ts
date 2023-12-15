import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository, sut } from "./check-in.spec";

describe("Register UseCase", () => {
  beforeEach(() => {
    InMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(InMemoryCheckInsRepository);
  });

  it("should create user", async () => {
    const { user } = await sut.execute(userPayload);

    expect(user.id).toEqual(expect.any(String));
  });
});
