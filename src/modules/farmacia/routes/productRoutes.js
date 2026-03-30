import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_product,
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

export default router;
