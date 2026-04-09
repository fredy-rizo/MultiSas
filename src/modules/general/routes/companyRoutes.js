import { Router } from "express";
import {
  active_account_by_company,
  create_user_company_by_admin,
  list_user_by_company_active,
  list_user_by_company_not_active,
  login_company,
  login_user_by_company,
  logout_company,
  register_company,
  test_plan_axpiration,
  update_data_company,
} from "../../general/controller/userController.js";
import {
  Token,
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import { check_plan_expiration } from "../../../core/middleware/lib/Expiration.js";
const router = Router();

router.post("/register-company", register_company); // Crear empresa (Super Admin)

// router.post("/login-company", check_plan_expiration, login_company); // Iniciar sesion (Admin de empresa)

router.post("/login-company", login_company); // Iniciar sesion (Admin de empresa)

router.put(
  "/update-company/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Super Admin"),
  update_data_company,
); // Actualizar datos de empresa (Super Admin)

router.post(
  "/create-user-company-by-admin/:company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_user_company_by_admin,
); // Crear perfil de vendedor/Consultor para empresa (Admin de empresa)

router.put(
  "/active-account-user-by-company/:user_company_id",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  active_account_by_company,
); // Activar perfil de vendedor de empresa (Admin de empresa)

router.post("/login-user-company", login_user_by_company); // Iniciar sesion (perfil de empresa)

router.get(
  "/test_plan",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  check_plan_expiration,
  test_plan_axpiration,
); // Validar expiracion de plan

router.put("/logout-company", TokenAny, logout_company); // Cerrar sesion (Admin de empresa)

router.get(
  "/list-user-by-company-active/:company_id/:pag?/:perpage?",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_user_by_company_active,
); // Listar usuarios activos (Admin de empresa)

router.get(
  "/list-user-by-company-not-active/:company_id/:pag?/:perpage?",
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_user_by_company_not_active,
); // Listar usuarios activos (Admin de empresa)

export default router;
