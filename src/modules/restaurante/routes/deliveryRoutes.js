import { Router } from "express";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  TokenAny,
  TokenAuthorize,
} from "../../../core/middleware/tools/Token.js";
import {
  create_delivery,
  list_deliverys,
  update_payment_method_delivery,
  update_status_delivery,
} from "../controller/deliveryController.js";
const router = Router();

router.post(
  "/:company_id/:product_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  create_delivery,
); // Crear domicilio de productos (menu)

router.put(
  "/status/:company_id/:delivery_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_status_delivery,
); // Actualizar estado del domicilio de productos (menu)

router.put(
  "/update/:company_id/methods/:delivery_id",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  update_payment_method_delivery,
); // Actualizar metodo de pado de domicilio de productos (menu)

router.get(
  "/list/:company_id/:delivery_id/:query",
  TokenAny,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_deliverys,
); // Mostrar informacion de domicilios de productos (menu)

export default router;
