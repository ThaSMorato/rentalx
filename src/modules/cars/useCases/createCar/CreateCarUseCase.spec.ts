import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = {
      brand: "brand",
      category_id: "123",
      daily_rate: 123,
      description: "description car",
      fine_amount: 63,
      license_plate: "asd1234",
      name: "name car",
    };

    await createCarUseCase.execute(car);

    const resultCar = await carsRepositoryInMemory.findByLicensePlate(
      car.license_plate
    );

    expect(resultCar).toHaveProperty("id");
  });

  it("should not be able to create a car with the same license plate", async () => {
    expect(async () => {
      const car = {
        brand: "brand",
        category_id: "123",
        daily_rate: 123,
        description: "description car",
        fine_amount: 63,
        license_plate: "asd1234",
        name: "name car",
      };

      await createCarUseCase.execute(car);

      await createCarUseCase.execute(car);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new car with available equal true", async () => {
    const car = {
      brand: "brand",
      category_id: "123",
      daily_rate: 123,
      description: "description car",
      fine_amount: 63,
      license_plate: "asd1234",
      name: "name car",
    };

    await createCarUseCase.execute(car);

    const resultCar = await carsRepositoryInMemory.findByLicensePlate(
      car.license_plate
    );

    expect(resultCar.available).toBeTruthy();
  });
});
