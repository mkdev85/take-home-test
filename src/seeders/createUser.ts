import { User } from 'src/entities/user';
import { AppDataSource } from 'src/utils/data-source';

const createUser = async () => {
  const UserRepository = AppDataSource.getRepository(User);
  const userEmail = 'admin@gmail.com';

  const user = await UserRepository.findOneBy({ email: userEmail });

  if (user) {
    console.log('user =>', user.id);
    return;
  }

  const userData = UserRepository.create({
    first_name: 'admin',
    last_name: 'admin',
    password: 'admin',
    email: userEmail,
  });

  await UserRepository.save(userData);
};

export default createUser;
