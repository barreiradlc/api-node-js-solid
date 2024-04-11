import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym';


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

const fakeGymInput = {
  title: 'Js Gym',
  description: null,
  phone: null,
  latitude: -15.8055607,
  longitude: -47.9515105,

}

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository)

  })

  it('Should create gym', async () => {
    const { gym } = await sut.execute(fakeGymInput)


    expect(gym.id).toEqual(expect.any(String))
  })
})