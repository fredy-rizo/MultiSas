import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  calcular_nomina,
  crear_nomina,
  recalcular_nomina,
} from "../controller/rosterController.js";
const router = Router();

router.post(
  "/:company_id/:employee_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  crear_nomina,
); // Crear nominar

router.post(
  "/:company_id/calculate/:nomina_id/nomina/:employee_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  calcular_nomina,
); // Calcular nomina

router.post(
  "/recalcular/:company_id/nomina/:nomina_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  recalcular_nomina,
); // Recalcular nomina

export default router;
