import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarUseCase } from "./CreateCarUseCase";

export class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      daily_rate,
      brand,
      category_id,
      fine_amount,
      license_plate,
    } = request.body;

    const createCarUseCase = container.resolve(CreateCarUseCase);

    createCarUseCase.execute({
      name,
      description,
      daily_rate,
      brand,
      category_id,
      fine_amount,
      license_plate,
    });

    return response.status(201).send();
  }
}
