import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { RentalsRepositoryInMemory } from "../../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

const DAY = 24 * 60 * 60 * 1000;

describe("Create Rental", () => {
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: "car_id_123",
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
      car_id: "car_id_123",
      expected_return_date: new Date(new Date().getTime() + DAY),
    };

    await createRentalUseCase.execute(rentalCreateData);

    expect(async () => {
      await createRentalUseCase.execute({
        ...rentalCreateData,
        user_id: `not${rentalCreateData.user_id}`,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental to an user that already rentaled car", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: "car_id_123",
      expected_return_date: new Date(new Date().getTime() + DAY),
    };

    await createRentalUseCase.execute(rentalCreateData);

    expect(async () => {
      await createRentalUseCase.execute({
        ...rentalCreateData,
        car_id: `not${rentalCreateData.car_id}`,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental to an expected_return_date less than 24 hours from now", async () => {
    const rentalCreateData = {
      user_id: "user_id_123",
      car_id: "car_id_123",
      expected_return_date: new Date(),
    };

    expect(async () => {
      await createRentalUseCase.execute(rentalCreateData);
    }).rejects.toBeInstanceOf(AppError);
  });
});
