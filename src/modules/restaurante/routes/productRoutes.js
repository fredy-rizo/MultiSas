import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_product,
  delete_extra_product,
  delete_product,
  list_products,
  push_extra_product,
  update_product,
  update_product_extra,
} from "../controller/productController.js";
const router = Router();

router.post(
  "/:company_id/:category_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_product,
); // Crear producto (menu)

router.put(
  "/:company_id/updating/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_product,
); // Actualizar producto (menu)

router.put(
  "/agregate/:company_id_resp/extra/:product_id_resp/push",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  push_extra_product,
); // Agregar extra a product (menu)

router.put(
  "/updating/:company_id/:product_id/:extra_id/product",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_product_extra,
); // Actualizar extras de productos(menu)

router.delete(
  "/delete/:company_id/product/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_product,
); // Eliminar producto (menu)

router.delete(
  "/delete/:company_id/product/:product_id/extra/:extra_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_extra_product,
); // Eliminar extras de producto (menu)

router.get(
  "/list/:company_id/product",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_products,
); // Listar productos (menu)

export default router;
