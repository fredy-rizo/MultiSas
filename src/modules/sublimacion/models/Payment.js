import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    company: String,
    invoice: String,
    client: String,
    amount: Number,
    method: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

/*
    company -> id de empresa
    invoice -> id de factura
    client -> id de cliente
    amout -> monto de pago
    method -> metodo de pago
    date -> fecha real del pago
*/

export const Payment = mongoose.model("payment_sublimacion", paymentSchema);
