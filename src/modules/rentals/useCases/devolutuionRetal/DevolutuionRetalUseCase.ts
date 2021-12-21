import { inject, injectable } from "tsyringe";

import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { ICarsRepository } from "../../../cars/repositories/ICarsRepository";
import { Rental } from "../../infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
  rental_id: string;
}

const MINIMUM_DAYLI = 0;

@injectable()
export class DevolutuionRetalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ rental_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) {
      throw new AppError("Rental does not exist");
    }

    const car = await this.carsRepository.findById(rental.car_id);

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compare(rental.start_date, dateNow, "days");

    if (daily <= MINIMUM_DAYLI) {
      daily = MINIMUM_DAYLI + 1;
    }

    const delay = this.dateProvider.compare(
      rental.expected_return_date,
      dateNow,
      "days"
    );

    let calculate_fine = 0;

    if (delay > 0) {
      calculate_fine = delay * car.fine_amount;
    }

    const total = daily * car.daily_rate + calculate_fine;

    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(rental.car_id, true);

    return rental;
  }
}
