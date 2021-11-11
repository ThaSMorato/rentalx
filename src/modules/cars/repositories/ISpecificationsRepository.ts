import { Specification } from "../model/Specification";

export interface ICreateSpecificationsDTO {
  name: string;
  description: string;
}
export interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificationsDTO): void;
  findByName(name: string): Specification;
}
