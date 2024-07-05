import Joi from 'src/utils/joiDate';
import moment from 'moment';

import { AppDataSource } from 'src/utils/data-source';
import { 
  INTERNAL_SERVER_ERROR, 
  INVALID_PARAMETER, 
  INVALID_BORROW_RECORD_ID, 
  BORROW_RECORD_NOT_FOUND, 
  INVAID_BORROW_RECORD_RETURN_DATE 
} from 'src/utils/constants';
import { fieldsValidator } from 'src/utils/methodHelper';

import type { ServiceResponseReturnType } from 'src/types';

const UpdateBorrowRecordSchema = Joi.object({
  returnDate: Joi.date().format('YYYY-MM-DD'),
  borrowRecordId: Joi.string().guid().message(INVALID_BORROW_RECORD_ID).required(),
})

interface IUpdateBorrowRecordServiceParams {
  returnDate?: string;
  borrowRecordId: string;
}

class UpdateBorrowRecordService {
  static async run({
    returnDate,
    borrowRecordId
  }: IUpdateBorrowRecordServiceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: UpdateBorrowRecordSchema,
        fields: { returnDate, borrowRecordId },
      });

      if (errors) {
        return [errors];
      }

      const BorrowRecordRepository = AppDataSource.getRepository(borrowRecordId);

      // Check if borrow record exists
      const borrowRecordData = await BorrowRecordRepository.findOne({
        where: {
          id: borrowRecordId,
        },
      })

      if (!borrowRecordData?.id) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: BORROW_RECORD_NOT_FOUND,
          },
        ];
      }

      if (!moment(borrowRecordData.borrowDate, 'YYYY-MM-DD').isBefore(moment(returnDate, 'YYYY-MM-DD'))) {
        return [
          {
            errorType: INVALID_PARAMETER,
            message: INVAID_BORROW_RECORD_RETURN_DATE,
          },
        ];
      }

      await BorrowRecordRepository.save({
        id: borrowRecordData.id,
        borrowDate: borrowRecordData.borrowDate,
        returnDate: returnDate ?? borrowRecordData.returnDate,
        borrower: borrowRecordData.borrower,
        book: borrowRecordData.bookId
      });

      return [
        null,
        {
          data: { id: borrowRecordData.id, returnDate, borrowDate: borrowRecordData.borrowDate },
          message: `Borrow Record has been successfully updated!`,
        },
      ];
    } catch (error) {
      console.log('Error while updating an borrow record', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default UpdateBorrowRecordService;
