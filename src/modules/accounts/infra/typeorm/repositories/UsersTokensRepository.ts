import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "../../../dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "../../../repositories/IUsersTokensRepository";
import { UserTokens } from "../entities/UserTokens";

export class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create(create_token_data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create(create_token_data);

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const tokens = await this.repository.findOne({ user_id, refresh_token });

    return tokens;
  }

  async deleteById(token_id: string): Promise<void> {
    await this.repository.delete(token_id);
  }
}
