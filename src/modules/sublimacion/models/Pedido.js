import mongoose from "mongoose";
const { Schema } = mongoose;

const pedidoSchema = new Schema(
  {
    bill_counter: String,
    date_pedido: String,
    hour_pedido: String,
    description_pedido: String,
    type_pedido: String,
    quantity_pedido: String,
    price_pedido: String,
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
      available_plans: String,
      months_quantity: Number,
      expired_available_plans: String,
    },
    client: {
      _id: String,
      document_type_client: String,
      number_document_client: String,
      name_client: String,
      email_client: String,
      phone_client: String,
    },
    state_pedido: {
      type: String,
      enum: ["Pendiente", "En produccion", "Entregado", ""],
      default: "",
    },
  },
  { timestamps: true },
);

/*
  date_pedido → Tomar fecha en que se hizo el pedido DD/MM/AA
  
  hour_pedido → Tomar hora en que se hizo el pedido

  description_pedido → Describir el pedido que se esta haciendo

  type_pedido → Definir que tipo de pedido es (Uniforme, Camisa, Gorras, etc)
  
  company → Tomar datos de la empresa

  client → Tomar datos de cliente

  state_pedido → Designar que el
  
*/

export const Pedido = mongoose.model("pedido_sublimacion", pedidoSchema);
