import { getRepository, Repository } from "typeorm";

import { ICarsImageRepository } from "../../../repositories/ICarsImageRepository";
import { CarImage } from "../entities/CarImage";

export class CarsImageRepository implements ICarsImageRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<void> {
    const carImage = this.repository.create({ car_id, image_name });

    await this.repository.save(carImage);
  }
}
