import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_client,
  delete_client,
  list_client,
  update_client,
} from "../controller/clientController.js";
const router = Router();

router.post(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_client,
); // Crear cliente en farmacia (no obligatorio)

router.put(
  "/:company_id/updating/:client_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_client,
); // Actualizar cliente en farmacia

router.get(
  "/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_client,
); // Listar clientes en farmacia

router.delete(
  "/:client_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_client,
); // Eliminar cliente en farmacia

export default router;
