import { inject, injectable } from "tsyringe";

import { IUserResponseDTO } from "../../dtos/IUserResponseDTO";
import { UserMap } from "../../mapper/UserMap";
import { IUserRepository } from "../../repositories/IUserRepository";

@injectable()
export class ProfileUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.userRepository.findById(id);

    return UserMap.toDTO(user);
  }
}
