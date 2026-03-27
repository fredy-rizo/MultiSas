import express from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config.js";

// import { Token } from "./middleware/tools/Token.js";
// import { check_plan_expiration } from "./middleware/lib/Expiration.js";

// TODO → General
import Company from "./modules/general/routes/companyRoutes.js";
import Notes from "./modules/general/routes/notesRoutes.js";

// TODO → Cuenta contable
import AccountPlan from "./modules/cuenta_contable/routes/accountPlanRoutes.js";

//TODO → Sublimacion
import Supplier from "./modules/sublimacion/routes/supplierRoutes.js";
import Client from "./modules/sublimacion/routes/clientRoutes.js";
import Sale from "./modules/sublimacion/routes/saleRoutes.js";
import Pedido from "./modules/sublimacion/routes/pedidoRoutes.js";
import Production from "./modules/sublimacion/routes/productionRoutes.js";

// TODO → Restaurante
import Category from "./modules/restaurante/routes/categoryRoutes.js";
import Product from "./modules/restaurante/routes/productRoutes.js";
import Table from "./modules/restaurante/routes/tableRoutes.js";

const app = express();
console.log(config);

app.set("port", config.PORT);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Time → ", new Date());
  next();
});

// app.use("/api", Token, check_plan_expiration);
// TODO → General
app.use("/api/user", Company);
app.use("/api/notes", Notes);

// TODO → Cuenta contable
app.use("/api/account_plan", AccountPlan);

// TODO → Sublimacion
app.use("/api/supplier", Supplier);
app.use("/api/client", Client);
app.use("/api/sale", Sale);
app.use("/api/pedido", Pedido);
app.use("/api/production", Production);

// TODO → Restaurante
app.use("/api/category", Category);
app.use("/api/product", Product);
app.use("/api/table", Table);

export default app;
