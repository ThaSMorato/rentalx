import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { authConfig } from "../../../../config/auth";
import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("Email or Password incorrect");

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) throw new AppError("Email or Password incorrect");

    const {
      expires_in_token,
      public_jwt_secret,
      public_refresh_secret,
      expires_in_refresh,
      expires_in_refresh_number,
    } = authConfig;

    const token = sign(
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

    const refresh_token = sign({ email: user.email }, public_refresh_secret, {
      subject: user.id,
      expiresIn: expires_in_refresh,
    });

    const refresh_expires_date = this.dateProvider.getDateFromNowWithDays(
      expires_in_refresh_number
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_expires_date,
    });

    const tokenResponse: IResponse = {
      user: {
        email: user.email,
        name: user.name,
      },
      token,
      refresh_token,
    };

    return tokenResponse;
  }
}
