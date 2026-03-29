import mongoose from "mongoose";
const { Schema } = mongoose;

const pedidoSchema = new Schema(
  {
    product: {
      _id: String,
      name_product: String,
      description_product: String,
      price_product: String,
      extras: [
        {
          name_extra: String,
          price_extra: String,
        },
      ],
    },
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
    },
    bill_counter: String,
    date_pedido: String,
    hour_pedido: String,
    price_pedido: String,
  },
  { timestamps: true },
);

/*
    bill_counter -> Contador de pedidos
    date_pedido -> Tomar fecha en que se hizo el pedido DD/MM/AA
    hour_pedido -> Tomar hora en que se hizo el pedido
    price_pedido -> Tomar precio de pedido desde product
*/

export const Pedido = mongoose.model("pedido_restaurante", pedidoSchema);
