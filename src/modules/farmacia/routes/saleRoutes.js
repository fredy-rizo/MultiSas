import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import { create_sale, list_sale } from "../controller/saleController.js";
const router = Router();

router.post(
  "/:company_id/sale/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_sale,
); // Crear venta en farmacia

router.get(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_sale,
); // Listar ventas en farmacia

export default router;
