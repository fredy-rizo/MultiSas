import { Router } from "express";
import {
  Token,
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_supplier_company,
  delete_supplier_company,
  list_supplier_company,
  update_supplier_company,
} from "../controller/supplierController.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
const router = Router();

router.post(
  "/create-supplier-company/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_supplier_company,
); // Crear proveedor de empresa

router.put(
  "/update-supplier-company/:company_id/:supplier_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_supplier_company,
); // Actualizar proveedor de empresa

router.get(
  "/list-supplier-company/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_supplier_company,
); // Listar proveedores de la empresa

router.delete(
  "/delete-supplier-company/:supplier_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_supplier_company,
); // Eliminar proveedor de la empresa

export default router;
