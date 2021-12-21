import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UserRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UserRepository";
import { UsersTokensRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing from request", 401);
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw new AppError("Invalid token type", 401);
  }

  try {
    const { sub: user_id } = verify(
      token,
      process.env.JWT_PUBLIC_KEY
    ) as IPayload;

    const usersRepository = new UserRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exist", 401);
    }

    request.user = { id: user_id };

    next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
}
