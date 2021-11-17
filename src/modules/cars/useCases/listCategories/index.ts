import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ListCategoriesController } from "./ListCategoriesController";
import { ListCategoryUseCase } from "./ListCategoriesUseCase";

export const listCategories = () => {
  const categoriesRepository = new CategoriesRepository();
  const listCategoryUseCase = new ListCategoryUseCase(categoriesRepository);
  const listCategoriesController = new ListCategoriesController(
    listCategoryUseCase
  );
  return listCategoriesController;
};
