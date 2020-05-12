import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);

    const csvFilePath = path.join(uploadConfig.directory, filename);

    const readCSVStram = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStram.pipe(parseStream);

    const data = [];

    parseCSV.on('data', obj => {
      data.push(obj);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    // await transactionRepository.save(transactions)

    return data;
  }
}

export default ImportTransactionsService;
