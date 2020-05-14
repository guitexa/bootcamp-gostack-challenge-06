import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const csvFilePath = path.join(uploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const data = [];

    parseCSV.on('data', line => {
      data.push({
        title: line[0],
        value: line[2],
        type: line[1],
        category: line[3],
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    for (let i = 0; i < data.length; i++) {
      await createTransaction.execute({
        title: data[i].title,
        value: data[i].value,
        type: data[i].type,
        category: data[i].category,
      });
    }

    return data;
  }
}

export default ImportTransactionsService;
