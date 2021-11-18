import { Specification } from "../../entities/Specification";
import {
  ICreateSpecificationsDTO,
  ISpecificationsRepository,
} from "../ISpecificationsRepository";

const specifications = [];

export class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[];

  constructor() {
    this.specifications = specifications;
  }

  create({ name, description }: ICreateSpecificationsDTO): Promise<void> {
    return new Promise((resolve, reject) => {
      const specification = new Specification();

      Object.assign(specification, {
        name,
        description,
        created_at: new Date(),
      });

      this.specifications.push(specification);

      resolve();
    });
  }

  findByName(name: string): Promise<Specification> {
    return new Promise((resolve, reject) => {
      const specification = this.specifications.find(
        (specification) => specification.name === name
      );

      resolve(specification);
    });
  }
}
