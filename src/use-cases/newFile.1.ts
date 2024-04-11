import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchCheckinsUserHistoryUseCase } from './fetch-user-check-ins-history';
import { checkInsRepository, sut } from './fetch-user-check-ins-history.spec';

describe('Check ins useCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchCheckinsUserHistoryUseCase(checkInsRepository);
  });

  it('should be able to fetch checkins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1'
    });

    await checkInsRepository.create({
      gym_id: 'gym-2',
      user_id: 'user-1'
    });

    const { checkIns } = await sut.execute({ userId: 'user-1' });


    expect();
  });
});
