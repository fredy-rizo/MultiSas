import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_supplier,
  delete_supplier,
  list_supplier,
  update_supplier,
} from "../controller/supplierController.js";
const router = Router();

router.post(
  "/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_supplier,
); // Crear proveedor

router.put(
  "/update/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_supplier,
); // Actualizar proveedor

router.get(
  "/:company_id/list/:supplier_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_supplier,
); // Listar proveedores

router.delete(
  "/:supplier_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_supplier,
); // Eliminar proveedor

export default router;
