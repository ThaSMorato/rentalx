import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authentiacteUserUseCase: AuthenticateUserUseCase;
let usersRepository: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

const user: ICreateUserDTO = {
  driver_license: "00123",
  name: "Test user",
  email: "test@test.com",
  password: "1234",
};

describe("Authenticate User", () => {
  beforeEach(() => {
    process.env.JWT_PUBLIC_KEY = "123123";
    usersRepository = new UserRepositoryInMemory();
    authentiacteUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
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
