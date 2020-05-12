import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

interface Response {
  id: string;
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Response> {
    const transactionRepository = getRepository(Transaction);
    const customTransactionsRepository = getCustomRepository(
      TransactionsRepository,
    );

    const acceptableTypes = ['income', 'outcome'];

    if (!acceptableTypes.includes(type)) {
      throw new AppError('This type is not valid');
    }

    const checkBalance = await (await customTransactionsRepository.getBalance())
      .total;

    if (checkBalance < value && type === 'outcome') {
      throw new AppError('Yout have no founds');
    }

    const categoryRepository = getRepository(Category);

    const checkExistsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkExistsCategory) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);
    }

    const getCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: getCategory?.id,
    });

    await transactionRepository.save(transaction);

    return {
      id: transaction.id,
      title,
      value,
      type,
      category,
    };
  }
}

export default CreateTransactionService;
