import { Specification } from "../infra/typeorm/entities/Specification";

export interface ICreateSpecificationsDTO {
  name: string;
  description: string;
}
export interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificationsDTO): Promise<void>;
  findByName(name: string): Promise<Specification>;
}
