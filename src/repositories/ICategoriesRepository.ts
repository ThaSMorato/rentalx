import { Category } from "../module/Category";

export interface ICreateCategoriesDTO {
  name: string;
  description: string;
}
export interface ICategoriesRepository {
  findByName(name: string): Category;
  list(): Category[];
  create({ name, description }: ICreateCategoriesDTO): void;
}
