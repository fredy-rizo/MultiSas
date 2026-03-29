import { Router } from "express";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_pedido_restaurante,
  list_pedidos,
} from "../controller/pedidoController.js";
const router = Router();

router.post(
  "/restaurante/:company_id/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_pedido_restaurante,
); // Crear pedido para restaurante

router.get(
  "/restaurante/:company_id/:pag?/:perpage?",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_pedidos,
); // Listar pedidos de restaurante

export default router;
