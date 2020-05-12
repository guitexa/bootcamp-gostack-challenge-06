import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const checkValidID = await transactionRepository.findOne(id);

    if (!checkValidID) {
      throw new AppError('This ID is not valid');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
