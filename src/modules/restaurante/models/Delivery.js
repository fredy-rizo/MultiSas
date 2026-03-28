import mongoose from "mongoose";
const { Schema } = mongoose;

const deliverySchema = new Schema(
  {
    name_client_delivery: String,
    phone_client_delivery: String,
    address_client_delivery: String,
    references_client_delivery: { type: String, default: "" },
    status_delivery: {
      type: String,
      enum: ["En camino", "Entregado", "No entregado", ""],
      default: "",
    },
    payment_method: {
      type: String,
      enum: ["Efectivo", "Transferencia", ""],
      default: "",
    },
    paid: { type: Boolean, default: false },
    product: {
      _id: String,
      name_product: String,
      price_product: String,
      extras: [
        {
          name_extra: String,
          price_extra: String,
        },
      ],
    },
  },
  { timestamps: true },
);

/*
  name_client_delivery -> Nombre del cliente
  phone_client_delivery -> Telefono del cliente
  address_client_delivery -> Direccion del cliente
  references_client_delivery -> Referencias de la casa del cliente
  status_delivery -> Estado del domicilio
  payment_method -> Metodo de pago
  paid -> Saber si ya esta pagado
*/

export const Delivery = mongoose.model("delivery_restaurante", deliverySchema);
