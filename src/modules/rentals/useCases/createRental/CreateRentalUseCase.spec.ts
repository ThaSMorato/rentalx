import faker from "faker";

import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Car } from "../../../cars/infra/typeorm/entities/Car";
import { CarsRepositoryInMemory } from "../../../cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

const DAY = 24 * 60 * 60 * 1000;

const car = {
  name: faker.vehicle.vehicle(),
  description: faker.vehicle.type(),
  daily_rate: faker.datatype.number(200),
  license_plate: faker.vehicle.vrm(),
  fine_amount: faker.datatype.number(120),
  category_id: "category_id_123",
  brand: faker.vehicle.model(),
} as Car;

describe("Create Rental", () => {
  beforeEach(async () => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );

    await carsRepositoryInMemory.create(car);

    const created_car = await carsRepositoryInMemory.findByLicensePlate(
      car.license_plate
    );

    car.id = created_car.id;
  });

  it("should be able to create a new rental", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: car.id,
      expected_return_date: new Date(new Date().getTime() + DAY),
    };

    const rental = await createRentalUseCase.execute(rentalCreateData);

    expect(rental).toEqual(
      expect.objectContaining({
        ...rentalCreateData,
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
  });

  it("should not be able to create a new rental to an already rentaled car", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: car.id,
      expected_return_date: new Date(new Date().getTime() + DAY),
    };

    await createRentalUseCase.execute(rentalCreateData);

    await expect(
      createRentalUseCase.execute({
        ...rentalCreateData,
        user_id: `not${rentalCreateData.user_id}`,
      })
    ).rejects.toEqual(new AppError("Car is already rentaled"));
  });

  it("should not be able to create a new rental to an user that already rentaled car", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: car.id,
      expected_return_date: new Date(new Date().getTime() + DAY),
    };

    await createRentalUseCase.execute(rentalCreateData);

    await expect(
      createRentalUseCase.execute({
        ...rentalCreateData,
        car_id: `not${rentalCreateData.car_id}`,
      })
    ).rejects.toEqual(new AppError("User already have an open car rental"));
  });

  it("should not be able to create a new rental to an expected_return_date less than 24 hours from now", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: car.id,
      expected_return_date: new Date(),
    };

    await expect(createRentalUseCase.execute(rentalCreateData)).rejects.toEqual(
      new AppError("Expected return needs to be more than 24 hours")
    );
  });
});
