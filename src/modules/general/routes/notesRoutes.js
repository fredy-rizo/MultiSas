import { Router } from "express";
import {
  Token,
  TokenAuthorize,
  TokenValidationPlan,
} from "../../../core/middleware/tools/Token.js";
import { create_credit_note } from "../controller/notesController.js";
const router = Router();

router.post(
  "/credit/:company_id/:sale_id/:production_id/:client_id",
  Token,
  TokenAuthorize("Admin", "Super Admin"),
  TokenValidationPlan("Plan Basico"),
  create_credit_note,
);

export default router;
