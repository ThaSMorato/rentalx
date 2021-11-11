import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ListCategoriesController } from "./ListCategoriesController";
import { ListCategoryUseCase } from "./ListCategoriesUseCase";

const categoriesRepository = CategoriesRepository.getInstance();
const listCategoryUseCase = new ListCategoryUseCase(categoriesRepository);
const listCategoriesController = new ListCategoriesController(
  listCategoryUseCase
);

export { listCategoriesController };
