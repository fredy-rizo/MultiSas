import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_category,
  delete_category,
  list_categorys,
  update_category,
} from "../controller/categoryController.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
const router = Router();

router.post(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_category,
); // Crear categorias

router.put(
  "/updating/:company_id/:category_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_category,
); // Actualizar categoria

router.get(
  "/list/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_categorys,
); // Listar todas las categorias

router.delete(
  "/delete/:category_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_category,
); // Eliminar categoria

export default router;
