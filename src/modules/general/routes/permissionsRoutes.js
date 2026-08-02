import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_permission,
  delete_permission,
  list_permission,
  update_permission,
} from "../controller/permissionsController.js";
const router = Router();

router.post(
  "/:company_id/:user_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_permission,
); // Crear permisos

router.put(
  "/:permission_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_permission,
); // Actualizar permisos

router.get(
  "/list/:company_id/:pag?/:perpage?",
  Paginate,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  list_permission,
); // Listar permisos

router.delete(
  "/remove/:permission_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_permission,
); // Eliminar permiso

export default router;
