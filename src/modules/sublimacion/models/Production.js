import mongoose from "mongoose";
const { Schema } = mongoose;

const productionSchema = new Schema(
  {
    bill_counter: String,
    price_production: Number,
    type_production: String,
    quantity_production: String,
    delivery_date_production: String,
    responsible_production: String,
    priority_production: {
      type: String,
      enum: ["Baja", "Media", "Alta", "Urgente", ""],
      default: "",
    },
    finalized_production: { type: String, default: "" },
    production_finalized_date: { type: String, default: "" },
    userCompany: {
      _id: String,
      name_user_company: String,
    },
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
    },
    client: {
      _id: String,
      name_client: String,
      phone_client: String,
    },
    pedido: {
      _id: String,
      bill_counter: String,
      date_pedido: String,
      hour_pedido: String,
      description_pedido: String,
      type_pedido: String,
      quantity_pedido: String,
      price_pedido: String,
      state_pedido: String,
    },
  },
  { timestamps: true },
);

/*
    type_production → Definir si es uniforme, camisa, sudadera, etc...

    quantity_production → Definir la cantidad de produccion a realizar

    delivery_date_production → Definir fecha de entraga del producto

    responsible_production → Desigar al diseñador responsable del trabajo

    priority_production → Definir que tan importante es el trabajo a realizar

    company → Tomar datos de la empresa

    client → Tomar datos del cliente de la empresa

    user → Tomar datos de los usuarios que hay dentro de la empresa
*/

export const Production = mongoose.model(
  "production_sublimacion",
  productionSchema,
);
