import { Router } from "express";
import {
  create_sale,
  list_sale,
  list_sale_company_id,
} from "../controller/saleController.js";
import {
  Token,
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
const router = Router();

router.post(
  "/create-sale/:company_id/:production_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_sale,
); // Generar venta

router.get(
  "/list-sale/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_sale,
); // Listar ventas

router.get(
  "/list/:company_id/unique/:sale_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  list_sale_company_id,
); // Listar ventas por ID

export default router;
