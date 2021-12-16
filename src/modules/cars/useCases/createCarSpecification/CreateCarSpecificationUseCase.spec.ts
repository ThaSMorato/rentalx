import { AppError } from "../../../../shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "../../repositories/in-memory/SpecificationsRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should be able to add a new specification to a car", async () => {
    const car = {
      brand: "brand",
      category_id: "123",
      daily_rate: 123,
      description: "description car",
      fine_amount: 63,
      license_plate: "asd1234",
      name: "name car",
    };

    const specification = {
      description: "description",
      name: "specification car",
    };

    await specificationsRepositoryInMemory.create(specification);

    const { id } = await specificationsRepositoryInMemory.findByName(
      specification.name
    );

    await carsRepositoryInMemory.create(car);

    const { id: car_id } = await carsRepositoryInMemory.findByLicensePlate(
      car.license_plate
    );

    await createCarSpecificationUseCase.execute({
      car_id,
      specifications_id: [id],
    });

    const expected_car = await carsRepositoryInMemory.findById(car_id);

    expect(expected_car).toHaveProperty("specifications");
    expect(expected_car.specifications[0].id).toEqual(id);
  });

  it("should not be able to add a new specification to an unexistent car", async () => {
    expect(async () => {
      await createCarSpecificationUseCase.execute({
        car_id: "123",
        specifications_id: ["1", "2", "3", "4"],
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
