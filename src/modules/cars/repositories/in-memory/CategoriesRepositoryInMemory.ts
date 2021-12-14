import { Category } from "../../infra/typeorm/entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoriesDTO,
} from "../ICategoriesRepository";

export class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async findByName(name: string): Promise<Category> {
    const category = this.categories.find((category) => category.name === name);
    return category;
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async create({ name, description }: ICreateCategoriesDTO): Promise<void> {
    const category = new Category();

    Object.assign(category, { name, description, created_at: Date.now() });

    this.categories.push(category);
  }
}
