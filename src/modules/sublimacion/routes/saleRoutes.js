import { Router } from "express";
import { create_sale, list_sale } from "../controller/saleController.js";
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

export default router;
