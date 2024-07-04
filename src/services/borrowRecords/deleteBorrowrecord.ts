import Joi from 'joi';

import { AppDataSource } from 'src/utils/data-source';
import { INTERNAL_SERVER_ERROR, INVALID_BORROW_RECORD_ID, UNAUTHORIZED } from 'src/utils/constants';

import type { ServiceResponseReturnType } from 'src/types';
import { fieldsValidator } from 'src/utils/methodHelper';
import { BorrowRecord } from 'src/entities/borrowRecords';

const DeleteBorrowRecordSchema = Joi.object({
  borrowRecordId: Joi.string().guid().message(INVALID_BORROW_RECORD_ID),
});

interface IDeleteBorrowRecorderviceParams {
  borrowRecordId: string;
}

class DeleteBorrowRecordService {
  static async run({ borrowRecordId }: IDeleteBorrowRecorderviceParams): ServiceResponseReturnType {
    try {
      // Validating parameters
      const errors = fieldsValidator({
        schema: DeleteBorrowRecordSchema,
        fields: { borrowRecordId },
      });

      if (errors) {
        return [errors];
      }

      const BorrowRecordRepository = AppDataSource.getRepository(BorrowRecord);

      const borrowRecordData = await BorrowRecordRepository.findOneBy({
        id: borrowRecordId,
      });

      if (!borrowRecordData?.id) {
        return [
          {
            errorType: UNAUTHORIZED,
            message: INVALID_BORROW_RECORD_ID,
          },
        ];
      }

      await BorrowRecordRepository.delete({ id: borrowRecordId });

      return [null, { message: `Borrow Record has been successfully deleted!` }];
    } catch (error) {
      console.log('Error while deleting an borrow record', error);
      return [{ errorType: INTERNAL_SERVER_ERROR }];
    }
  }
}

export default DeleteBorrowRecordService;
