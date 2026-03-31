import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_product,
  list_products,
  list_products_stocks_minimum,
  update_product,
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

router.get(
  "/stock/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_products_stocks_minimum,
); // Listar productos con stock menor o igual a minimum_stock

router.get(
  "/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_products,
); // Listar productos de farmacia

export default router;
