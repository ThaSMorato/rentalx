import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authentiacteUserUseCase: AuthenticateUserUseCase;
let usersRepository: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

const user: ICreateUserDTO = {
  driver_license: "00123",
  name: "Test user",
  email: "test@test.com",
  password: "1234",
};

const OLD_ENV = process.env;

describe("Authenticate User", () => {
  beforeAll(() => {
    process.env.JWT_PUBLIC_KEY = "JWT_PUBLIC_KEY";
    process.env.REFRESH_PUBLIC_KEY = "REFRESH_PUBLIC_KEY";
  });

  beforeEach(() => {
    usersRepository = new UserRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authentiacteUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should be able to authenticate an existing user", async () => {
    await createUserUseCase.execute(user);

    const result = await authentiacteUserUseCase.execute(user);
    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexisting user", async () => {
    await expect(authentiacteUserUseCase.execute(user)).rejects.toEqual(
      new AppError("Email or Password incorrect")
    );
  });

  it("should not be able to authenticate with incorrect password", async () => {
    await createUserUseCase.execute(user);
    await expect(
      authentiacteUserUseCase.execute({
        email: user.email,
        password: `not${user.password}`,
      })
    ).rejects.toEqual(new AppError("Email or Password incorrect"));
  });
});
