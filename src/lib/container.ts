import { DummyJsonProductRepository } from "@/infrastructure/dummyjson/DummyJsonProductRepository";
import { GetProductBySkuUseCase } from "@/core/use-cases/GetProductBySku";
import { GetProductListingUseCase } from "@/core/use-cases/GetProductListing";
import { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";

const productRepository = new DummyJsonProductRepository();

export const searchProductsUseCase = new SearchProductsUseCase(productRepository);
export const getProductBySkuUseCase = new GetProductBySkuUseCase(productRepository);
export const listCategoriesUseCase = new ListCategoriesUseCase(productRepository);
export const getProductListingUseCase = new GetProductListingUseCase(searchProductsUseCase, listCategoriesUseCase);
