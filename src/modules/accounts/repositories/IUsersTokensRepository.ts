import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export interface IUsersTokensRepository {
  create(create_token_data: ICreateUserTokenDTO): Promise<UserTokens>;
  findByUserIdAndToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;
  deleteById(token_id: string): Promise<void>;
  findByToken(token: string): Promise<UserTokens>;
}
