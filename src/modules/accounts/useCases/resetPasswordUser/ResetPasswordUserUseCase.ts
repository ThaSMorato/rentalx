import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export class ResetPasswordUserUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const user_token = await this.usersTokensRepository.findByToken(token);

    if (!user_token) {
      throw new AppError("Invalid token");
    }

    const token_already_expired = this.dateProvider.compareIfBefore(
      user_token.expires_date,
      this.dateProvider.dateNow()
    );

    if (token_already_expired) {
      throw new AppError("Token already expired");
    }

    const user = await this.userRepository.findById(user_token.user_id);

    user.password = await hash(password, 8);

    await this.userRepository.create(user);

    await this.usersTokensRepository.deleteById(user_token.id);
  }
}
