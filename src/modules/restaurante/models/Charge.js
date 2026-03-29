import mongoose from "mongoose";
const { Schema } = mongoose;

const chargeSchema = new Schema(
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
    payment_method: {
      type: String,
      enum: ["Efectivo", "Transferencia", "Tarjeta", ""],
      default: "",
    },
    paid: { type: Boolean, default: false },
    price_charge: String,
  },
  { timestamps: true },
);

/*
    payment_method -> Metodo de pago
    paid -> Definir estado de pago
*/

export const Charge = mongoose.model("charge_restaurante", chargeSchema);
