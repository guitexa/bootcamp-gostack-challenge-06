import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpPath,

  storage: multer.diskStorage({
    destination: tmpPath,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(5).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
