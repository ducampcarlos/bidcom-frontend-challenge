import { DummyJsonProductRepository } from "@/infrastructure/dummyjson/DummyJsonProductRepository";
import { GetProductBySkuUseCase } from "@/core/use-cases/GetProductBySku";
import { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";

const productRepository = new DummyJsonProductRepository();

export const searchProductsUseCase = new SearchProductsUseCase(productRepository);
export const getProductBySkuUseCase = new GetProductBySkuUseCase(productRepository);
export const listCategoriesUseCase = new ListCategoriesUseCase(productRepository);
