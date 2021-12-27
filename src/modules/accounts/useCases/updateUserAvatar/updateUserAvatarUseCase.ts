import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IRequest {
  user_id: string;
  avatar_file: string;
}
@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.userRepository.findById(user_id);

    if (user.avatar) {
      await this.storageProvider.remove(user.avatar, "avatar");
    }

    await this.storageProvider.save(avatar_file, "avatar");

    user.avatar = avatar_file;

    await this.userRepository.create(user);
  }
}
