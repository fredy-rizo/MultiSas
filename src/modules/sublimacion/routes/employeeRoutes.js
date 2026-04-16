import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_employee,
  delete_employee,
  list_active_employee,
  list_employee_company,
  list_inactive_employee,
  update_employee,
} from "../controller/employeeController.js";
const router = Router();

router.post(
  "/create/:company_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_employee,
); // Crear empleado

router.put(
  "/update/:company_id/:employee_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_employee,
); // Actualizar empleado

router.get(
  "/list/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_employee_company,
); // Listar empleados

router.get(
  "/list-active/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_active_employee,
); // Listar empleados activos

router.get(
  "/list-inactive/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_inactive_employee,
); // Listar empleados activos

router.delete(
  "/remove/:employee_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  delete_employee,
); // Eliminar empleado

export default router;
