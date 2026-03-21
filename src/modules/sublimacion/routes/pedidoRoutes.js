import { Router } from "express";
import {
  Token,
  TokenAny,
  TokenAuthorize,
  TokenUserCompany,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_pedido,
  list_pedido,
  list_pedidos,
  update_pedido_state,
} from "../controller/pedidoController.js";
const router = Router();

router.post(
  "/:company_id/:client_id/:user_company_id",
  // TokenUserCompany,
  // Token,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_pedido,
); // Crear pedido

router.put(
  "/update-state/:company_id/:pedido_id",
  // Token,
  // TokenUserCompany,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_pedido_state,
); // Actualizar estado de pedido

router.get(
  "/list/:company_id/:pedido_id/:query/:pag?/:perpage?",
  // Token,
  // TokenUserCompany,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_pedidos,
); // Listar informacion de pedidos

router.get(
  "/list-data/:company_id/:pedido_id/unique",
  // Token,
  // TokenUserCompany,
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  list_pedido,
); // Listar pedido por

export default router;
