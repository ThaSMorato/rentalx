import { Category } from "../infra/typeorm/entities/Category";

export interface ICreateCategoriesDTO {
  name: string;
  description: string;
}
export interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create({ name, description }: ICreateCategoriesDTO): Promise<void>;
}
