import { AppError } from "../../../../shared/errors/AppError";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategory: CreateCategoryUseCase;
let categoriesRepository: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    createCategory = new CreateCategoryUseCase(categoriesRepository);
  });

  it("should be able to create a new category", async () => {
    const category = {
      name: "Category test",
      description: "Just a category for test",
    };

    await createCategory.execute(category);

    const categoryCreated = await categoriesRepository.findByName(
      category.name
    );

    expect(categoryCreated).toHaveProperty("id");
  });

  it("should not be able to create a new category if the name exists", async () => {
    expect(async () => {
      const category = {
        name: "Category test",
        description: "Just a category for test",
      };

      await createCategory.execute(category);

      await createCategory.execute(category);
    }).rejects.toBeInstanceOf(AppError);
  });
});
