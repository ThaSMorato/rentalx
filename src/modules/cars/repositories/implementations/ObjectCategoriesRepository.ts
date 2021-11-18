import { Category } from "../../entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoriesDTO,
} from "../ICategoriesRepository";

const categories = [];

export class CategoriesRepository implements ICategoriesRepository {
  private categories: Category[];

  constructor() {
    this.categories = categories;
  }

  create({ name, description }: ICreateCategoriesDTO): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const category: Category = new Category();

      Object.assign(category, {
        name,
        description,
        created_at: new Date(),
      });

      this.categories.push(category);
      resolve();
    });
  }

  list(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      resolve(this.categories);
    });
  }

  findByName(name: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      const category = this.categories.find(
        (category) => category.name === name
      );

      resolve(category);
    });
  }
}
