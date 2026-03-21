import { Router } from "express";
import { Token, TokenAuthorize } from "../../../core/middleware/tools/Token.js";
import { Paginate } from "../../../core/middleware/tools/Pagination.js";
import {
  create_account_plan,
  list_account_plan,
} from "../controller/accountPlanController.js";

const router = Router();

router.post(
  "/:company_id",
  Token,
  TokenAuthorize("Admin", "Super Admin"),
  create_account_plan,
); // Crear plan contable

router.get(
  "/list/:company_id/:pag?/:perpage?",
  Token,
  TokenAuthorize("Admin", "Super Admin"),
  Paginate,
  list_account_plan,
);

export default router;
