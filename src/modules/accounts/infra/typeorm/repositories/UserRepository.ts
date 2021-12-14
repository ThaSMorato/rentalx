import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { User } from "../entities/User";

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    return user;
  }

  async create({
    driver_license,
    email,
    name,
    password,
    avatar,
    id,
  }: ICreateUserDTO) {
    const user = this.repository.create({
      driver_license,
      email,
      name,
      password,
      avatar,
      id,
    });

    await this.repository.save(user);
  }
}
