import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListCarsUseCase } from "./ListCarsUseCase";

interface IRequestQuery {
  brand: string;
  name: string;
  category_id: string;
}

export class ListCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const query = request.query as any;

    const { brand, name, category_id } = query as IRequestQuery;

    const listCarsUseCase = container.resolve(ListCarsUseCase);

    const cars = await listCarsUseCase.execute({ brand, name, category_id });

    return response.json(cars);
  }
}
