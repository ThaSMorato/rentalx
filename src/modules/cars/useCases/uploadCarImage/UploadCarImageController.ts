import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImageUseCase } from "./UploadCarImageUseCase";

export class UploadCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const images = request.files as Express.Multer.File[];

    const images_name = images.map(
      (file: Express.Multer.File) => file.filename
    );

    const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);

    uploadCarImageUseCase.execute({ car_id: id, images_name });

    return response.status(201).send();
  }
}
