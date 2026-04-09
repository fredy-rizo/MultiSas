import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_invoice,
  list_brief,
  record_payments,
} from "../controller/briefcaseController.js";
const router = Router();

router.post(
  "/invoice/:company_id/:pedido_id/:client_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_invoice,
); // Crear factura

router.post(
  "/record/:company_id/payments/:invoice_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  record_payments,
); // Registro de pagos de facturas

router.get(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_brief,
); // Listar cartera

export default router;
