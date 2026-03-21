import { Router } from "express";
import {
  Token,
  TokenAny,
  TokenAuthorize,
  // TokenAdmin,
  // TokenSuperAdmin,
} from "../../../core/middleware/tools/Token.js";
import {
  create_client_company,
  delete_client_company,
  list_client_company,
  update_client_company,
} from "../controller/clientController.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
const router = Router();

router.post(
  "/create-client-company/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  // TokenAdmin,
  // TokenSuperAdmin,
  create_client_company,
); // Crear cliente de empresa

router.put(
  "/update-client-company/:company_id/:client_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_client_company,
); // Actualizar cliente de empresa

router.get(
  "/list-client-company/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_client_company,
); // Listar clientes de la empresa

router.delete(
  "/delete-client-company/:client_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_client_company,
); // Eliminar cliente de la empresa

export default router;
