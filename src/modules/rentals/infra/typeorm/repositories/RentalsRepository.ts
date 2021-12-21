import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "../../../dtos/ICreateRentalDTO";
import { IRentalsRepository } from "../../../repositories/IRentalsRepository";
import { Rental } from "../entities/Rental";

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findByUserId(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ["car"],
    });

    return rentals;
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const opennedByCar = await this.repository.findOne({
      where: { car_id, end_date: null },
    });
    return opennedByCar;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const opennedByUser = await this.repository.findOne({
      where: { user_id, end_date: null },
    });
    return opennedByUser;
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
    id,
    end_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      expected_return_date,
      user_id,
      id,
      end_date,
    });

    await this.repository.save(rental);

    return rental;
  }
}
