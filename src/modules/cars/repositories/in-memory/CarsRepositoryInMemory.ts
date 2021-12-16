import { ICreateCarDTO } from "../../dtos/ICreateCarDTO";
import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

export class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async create(ICreateCarDTO: ICreateCarDTO): Promise<void> {
    const car = new Car();

    Object.assign(car, ICreateCarDTO);

    this.cars = [
      ...this.cars.filter((inside_car) => inside_car.id !== car.id),
      car,
    ];
  }

  async listAllAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]> {
    return this.cars.filter(
      (car) =>
        car.available &&
        ((brand && car.brand === brand) ||
          (category_id && car.category_id === category_id) ||
          (name && car.name === name) ||
          (!brand && !category_id && !name))
    );
  }

  async findById(car_id: string): Promise<Car> {
    return this.cars.find((car) => car.id === car_id);
  }
}
