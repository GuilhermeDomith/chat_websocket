import { getCustomRepository, getRepository, Repository } from "typeorm"
import { User } from "../entities/User"
import { UsersRepository } from "../repositories/UsersRepository";

interface IUserCreate {
  email: string
}


class UsersService {
  private usersRepo: Repository<User>;

  constructor() {
    this.usersRepo = getCustomRepository(UsersRepository);
  }
  
  async create({ email }: IUserCreate) {
    const userAlreadyExists = await this.usersRepo.findOne({ email });

    if(userAlreadyExists) {
      return userAlreadyExists;
    }

    const user = this.usersRepo.create({ email });
    return await this.usersRepo.save(user)
  }
}

export { UsersService }