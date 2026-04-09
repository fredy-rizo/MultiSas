import mongoose from "mongoose";
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    company: String,
    client: String,
    pedido: {
      _id: String,
      bill_counter: String,
      date_pedido: String,
      hour_pedido: String,
      quantity_pedido: String,
      price_pedido: String,
    },
    total: Number,
    balance: Number,
    status: {
      type: String,
      enum: ["Pendiente", "Pagado", "Atrasado"],
      default: "Pendiente",
    },
    issue_date: Date,
    due_date: Date,
    is_credit: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/*
    company -> id de empresa
    client -> id de cliente
    total -> pago total de factura
    balance -> saldo pendiente de factura (si existe)
    status -> estado de factura
    issue_date -> fecha de emision de factura
    due_date -> fecha limite de pago
    is_credit -> si fue factura a credito o al contado
*/

export const Invoice = mongoose.model("invoice_sublimacion", invoiceSchema);
