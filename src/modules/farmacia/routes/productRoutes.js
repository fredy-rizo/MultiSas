import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_product,
  delete_product,
  delete_product_lote,
  list_product_lotes,
  list_products,
  list_products_stocks_minimum,
  update_product,
  update_product_batch,
} from "../controller/productController.js";
const router = Router();

router.post(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_product,
); // Crear producto en farmacia

router.put(
  "/:company_id/updating/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_product,
); // Actualizar producto en farmacia

router.put(
  "/:company_id/company/:product_id/product/:batch_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_product_batch,
); // Actualizar lotes

router.get(
  "/stock/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_products_stocks_minimum,
); // Listar productos con stock menor o igual a minimum_stock

router.get(
  "/lotes/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_product_lotes,
); // Listar productos vencidos

router.get(
  "/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_products,
); // Listar productos de farmacia

router.delete(
  "/remove/:company_id/-/:product_id/-/:batch_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_product_lote,
); // Eliminar lote de producto en farmacia

router.delete(
  "/:company_id/-/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_product,
); // Eliminar producto en farmacia

export default router;
