import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("Email or Password incorrect");

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) throw new AppError("Email or Password incorrect");

    const token = sign(
      {
        email: user.email,
        name: user.name,
      },
      process.env.JWT_PUBLIC_KEY,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    const tokenResponse: IResponse = {
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    };

    return tokenResponse;
  }
}
