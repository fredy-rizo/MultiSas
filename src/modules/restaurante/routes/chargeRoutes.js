import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { create_charge, list_charge } from "../controller/chargeController.js";
const router = Router();

router.post(
  "/:company_id/:product_id/:pedido_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_charge,
); // Cobrar los pedidos

router.get(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_charge,
); // Listar los cobros realizados en pedidos

export default router;
