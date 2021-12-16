import { Specification } from "../../infra/typeorm/entities/Specification";
import {
  ICreateSpecificationsDTO,
  ISpecificationsRepository,
} from "../ISpecificationsRepository";

export class SpecificationsRepositoryInMemory
  implements ISpecificationsRepository
{
  specifications: Specification[] = [];

  async create({ name, description }: ICreateSpecificationsDTO): Promise<void> {
    const specification = new Specification();
    Object.assign(specification, {
      name,
      description,
    });
    this.specifications.push(specification);
  }

  async findByName(name: string): Promise<Specification> {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const all_specifications = this.specifications.filter((specification) =>
      ids.includes(specification.id)
    );

    return all_specifications;
  }
}
