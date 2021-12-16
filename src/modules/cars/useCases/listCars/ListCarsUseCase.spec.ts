import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars Usecase", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it("should be able to list all available cars", async () => {
    const car1 = {
      name: "Car 1",
      description: "car test 1",
      brand: "Audi",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 110,
      license_plate: "DEF-1110",
    };

    const car2 = {
      name: "Car 2",
      description: "car test 2",
      brand: "Audi",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 220,
      license_plate: "DEF-2210",
    };

    carsRepositoryInMemory.create(car1);
    carsRepositoryInMemory.create(car2);

    carsRepositoryInMemory.cars[1].available = false;

    const cars = await listCarsUseCase.execute({});

    const expectedCar = await carsRepositoryInMemory.findByLicensePlate(
      car1.license_plate
    );

    expect(cars).toEqual([expectedCar]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car1 = {
      name: "Car 1",
      description: "car test 1",
      brand: "Audi1",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 110,
      license_plate: "DEF-1110",
    };

    const car2 = {
      name: "Car 2",
      description: "car test 2",
      brand: "Audi2",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 220,
      license_plate: "DEF-2210",
    };

    carsRepositoryInMemory.create(car1);
    carsRepositoryInMemory.create(car2);

    const cars = await listCarsUseCase.execute({ brand: car1.brand });

    const expectedCar = await carsRepositoryInMemory.findByLicensePlate(
      car1.license_plate
    );

    expect(cars).toEqual([expectedCar]);
  });

  it("should be able to list all available cars by name", async () => {
    const car1 = {
      name: "Car 1",
      description: "car test 1",
      brand: "Audi",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 110,
      license_plate: "DEF-1110",
    };

    const car2 = {
      name: "Car 2",
      description: "car test 2",
      brand: "Audi",
      category_id: "asdaasdwawd",
      daily_rate: 40,
      fine_amount: 220,
      license_plate: "DEF-2210",
    };

    carsRepositoryInMemory.create(car1);
    carsRepositoryInMemory.create(car2);

    const cars = await listCarsUseCase.execute({ name: car1.name });

    const expectedCar = await carsRepositoryInMemory.findByLicensePlate(
      car1.license_plate
    );

    expect(cars).toEqual([expectedCar]);
  });

  it("should be able to list all available cars by category", async () => {
    const car1 = {
      name: "Car 1",
      description: "car test 1",
      brand: "Audi",
      category_id: "asdaasdwawd1",
      daily_rate: 40,
      fine_amount: 110,
      license_plate: "DEF-1110",
    };

    const car2 = {
      name: "Car 2",
      description: "car test 2",
      brand: "Audi",
      category_id: "asdaasdwawd2",
      daily_rate: 40,
      fine_amount: 220,
      license_plate: "DEF-2210",
    };

    carsRepositoryInMemory.create(car1);
    carsRepositoryInMemory.create(car2);

    const cars = await listCarsUseCase.execute({
      category_id: car1.category_id,
    });

    const expectedCar = await carsRepositoryInMemory.findByLicensePlate(
      car1.license_plate
    );

    expect(cars).toEqual([expectedCar]);
  });
});
