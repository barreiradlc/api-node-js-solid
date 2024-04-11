import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from '@prisma/client';

interface FetchCheckinsUserHistoryRequest {
  userId: string;
  page: number;
}

interface FetchCheckinsUserHistoryResponse {
  checkIns: CheckIn[];
}

class FetchCheckinsUserHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({
    userId,
    page
  }: FetchCheckinsUserHistoryRequest): Promise<FetchCheckinsUserHistoryResponse> {

    const checkIns = await this.checkInsRepository.findManyChenkinsByUserId(userId, page);

    return { checkIns }
  }
}


export { FetchCheckinsUserHistoryUseCase };
