import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../../infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  users_tokens: UserTokens[];

  constructor() {
    this.users_tokens = [];
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, { expires_date, refresh_token, user_id });

    this.users_tokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    return this.users_tokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async deleteById(token_id: string): Promise<void> {
    const token = this.users_tokens.find(
      (userToken) => userToken.id === token_id
    );
    this.users_tokens.splice(this.users_tokens.indexOf(token));
  }

  async findByToken(token: string): Promise<UserTokens> {
    return this.users_tokens.find(
      (userToken) => userToken.refresh_token === token
    );
  }
}
