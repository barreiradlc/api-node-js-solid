import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchCheckinsUserHistoryUseCase } from './fetch-user-check-ins-history';

let checkInsRepository: CheckInsRepository
let sut: FetchCheckinsUserHistoryUseCase

describe('Check ins useCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchCheckinsUserHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch checkins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    })

    await checkInsRepository.create({
      gym_id: 'gym-2',
      user_id: 'user-1'
    })

    const { checkIns } = await sut.execute({ userId: 'user-1', page: 1 })


    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' })
    ])
  })

  it('should be able to fetch paginated checkins history', async () => {
    for (let index = 1; index < 23; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index}`,
        user_id: 'user-1'
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})