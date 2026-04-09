import { Router } from "express";
import {
  Token,
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  assigned_user_production,
  create_production,
  finalized_production,
  list_productions_company,
  list_productions_company_id,
} from "../controller/productionController.js";
const router = Router();

router.post(
  "/:company_id/:pedido_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_production,
); // pasar pedido a produccion

router.post(
  "/:company_id/assigned/:production_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  assigned_user_production,
); // Asignar empleado(responsable) a producccion

router.post(
  "/finalized/:company_id/:pedido_id/:production_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  finalized_production,
); // Finalizar entrega de pedido

router.get(
  "/list/:company_id/:production_id/:query/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_productions_company,
); // Cargar todas las producciones de la empresa

router.get(
  "/list-one/:company_id/:production_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  list_productions_company_id,
); // Listar por ID

export default router;
