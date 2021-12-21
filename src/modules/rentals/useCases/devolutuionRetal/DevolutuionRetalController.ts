import { Request, Response } from "express";
import { container } from "tsyringe";

import { DevolutuionRetalUseCase } from "./DevolutuionRetalUseCase";

export class DevolutuionRetalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: rental_id } = request.params;

    const devolutuionRetalUseCase = container.resolve(DevolutuionRetalUseCase);

    const rental = await devolutuionRetalUseCase.execute({ rental_id });

    return response.json(rental);
  }
}
