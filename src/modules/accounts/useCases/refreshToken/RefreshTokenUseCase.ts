import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { authConfig } from "../../../../config/auth";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IPayload {
  sub: string;
  email: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<IResponse> {
    const {
      expires_in_token,
      public_jwt_secret,
      public_refresh_secret,
      expires_in_refresh,
      expires_in_refresh_number,
    } = authConfig;

    const { sub: user_id, email } = verify(
      token,
      authConfig.public_refresh_secret
    ) as IPayload;

    const user_tokens = await this.usersTokensRepository.findByUserIdAndToken(
      user_id,
      token
    );

    if (!user_tokens) {
      throw new AppError("Refresh token not found");
    }

    await this.usersTokensRepository.deleteById(user_tokens.id);

    const user = await this.userRepository.findByEmail(email);

    const user_token = sign(
      {
        email: user.email,
        name: user.name,
      },
      public_jwt_secret,
      {
        subject: user.id,
        expiresIn: expires_in_token,
      }
    );

    const refresh_token = sign({ email }, public_refresh_secret, {
      subject: user_id,
      expiresIn: expires_in_refresh,
    });

    const refresh_expires_date = this.dateProvider.getDateFromNow(
      expires_in_refresh_number
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date: refresh_expires_date,
    });

    return {
      token: user_token,
      refresh_token,
    };
  }
}
