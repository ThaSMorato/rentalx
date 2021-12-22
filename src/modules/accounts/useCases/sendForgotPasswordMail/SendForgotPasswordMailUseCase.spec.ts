import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UserRepositoryInMemory } from "../../repositories/in-memory/UserRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepository: UserRepositoryInMemory;
let usersTokensRepository: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;
let mailProvider: IMailProvider;

const sendMail = jest.fn();

const user: ICreateUserDTO = {
  driver_license: "00123",
  name: "Test user",
  email: "test@test.com",
  password: "1234",
};

describe("#Send Forgot Password Mail UseCase", () => {
  beforeEach(async () => {
    usersRepository = new UserRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    mailProvider = {
      sendMail,
    };
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
    await createUserUseCase.execute(user);
    const created_user = await usersRepository.findByEmail(user.email);

    user.id = created_user.id;
  });

  it("should be able to send forgot password mail to user", async () => {
    await sendForgotPasswordMailUseCase.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      user.email,
      expect.any(String),
      expect.any(Object),
      expect.any(String)
    );
  });

  it("should not be able to send email if users does not exist", async () => {
    try {
      await sendForgotPasswordMailUseCase.execute(`not${user.email}`);
    } catch (e) {
      expect(e).toBeInstanceOf(AppError);
      expect(e.message).toBe("User does not exists!");
    }
  });

  it("should be able to create a users token", async () => {
    const spyCreateToken = jest.spyOn(usersTokensRepository, "create");

    await sendForgotPasswordMailUseCase.execute(user.email);

    expect(spyCreateToken).toHaveBeenCalled();
    expect(spyCreateToken).toHaveBeenCalledTimes(1);
    expect(spyCreateToken).toHaveBeenCalledWith({
      expires_date: expect.any(Date),
      refresh_token: expect.any(String),
      user_id: user.id,
    });
  });
});
