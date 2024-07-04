import Joi from 'joi';
import type { ServiceResponseReturnType } from 'src/types';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_BORROW_RECORD_ID } from 'src/utils/constants';
import { fieldsValidator } from 'src/utils/methodHelper';

import { BorrowRecord } from 'src/entities/borrowRecords';

const GetBorrowRecordSchema = Joi.object({
  borrowRecordId: Joi.string().guid().message(INVALID_BORROW_RECORD_ID),
});

interface IGetBorrowRecordServiceParams {
  borrowRecordId: string;
}

class GetBorrowRecordService {
  static async run({ borrowRecordId }: IGetBorrowRecordServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: GetBorrowRecordSchema,
        fields: { borrowRecordId },
      });

      if (errors) {
        return [errors];
      }

      const BorrowRecordRepository = AppDataSource.getRepository(BorrowRecord);

      // Fetch the Borrow Record
      const borrowRecord = await BorrowRecordRepository.findOne({
        where: { id: borrowRecordId },
        relations: {
          book: { author: true },
        },
        select: {
          book: {
            author: {
              name: true,
              birthdate: true,
              bio: true,
              id: true,
            },
            title: true,
            publishedYear: true,
            availableCopies: true,
            id: true,
          },
        },
      });

      if (!borrowRecord?.id) {
        return [
          {
            errorType: INTERNAL_SERVER_ERROR,
            message: INVALID_BORROW_RECORD_ID,
          },
        ];
      }

      return [null, { data: borrowRecord }];
    } catch (error) {
      console.log('Error while fetching the borrow Record', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default GetBorrowRecordService;
