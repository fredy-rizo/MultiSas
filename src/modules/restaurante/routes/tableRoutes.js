import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_table,
  delete_table,
  list_tables,
  update_table,
} from "../controller/tableController.js";
const router = Router();

router.post(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_table,
); // Crear mesa de local en resturante

router.put(
  "/updating/:company_id/:table_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_table,
); // Actualizar mesa del local en restaurante

router.delete(
  "/remove/:company_id/:table_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_table,
); // Eliminar mesa de restaurante

router.get(
  "/list/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_tables,
); // Listar todas las mesas

export default router;
