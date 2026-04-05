import mongoose from "mongoose";
const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    bill_counter: String,
    company: String,
    product: {
      _id: String,
      bill_counter: String,
      name_product: String,
      category_product: String,
      unit_product: String,
      price_product: String,
      batch_product: [
        {
          lote: String,
          expiration_date: Date,
          quantity: Number,
        },
      ],
    },
    client: {
      _id: String,
      name_client: String,
    },
    type_payment: {
      type: String,
      enum: ["Efectivo", "Tarjeta", "Transferencia"],
      default: "Efectivo",
    },
    quantity: { type: Number, default: 0 },
    price: String,
    sub_total: String,
    total: String,
  },
  { timestamps: true },
);

/*
    company_id -> Id de empresa
    product -> Datos de producto para compra
    client -> Datos de cliente para compra (opcional)
    type_payment -> Metodo de pago para compra
    quantity -> Cantidad a comprar
    subtotal -> precio total
*/

export const Sale = mongoose.model("sale_pharmacy", saleSchema);
