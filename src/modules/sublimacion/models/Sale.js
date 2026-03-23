import mongoose from "mongoose";
const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    bill_number: String,
    date_sale: String,
    client: {
      _id: String,
      name_client: String,
    },
    payment_method: {
      type: String,
      enum: ["Tarjeta de credito", "Transferencia", "Efectivo"],
      default: "Efectivo",
    },
    production: {
      _id: String,
      bill_counter: String,
      price_production: String,
      type_production: String,
      quantity_production: String,
      delivery_date_production: String,
      responsible_production: String,
      priority_production: String,
      production_finalized_date: String,
    },
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
      available_plans: String,
      months_quantity: Number,
      expired_available_plans: String,
    },
    quantity: { type: Number, default: 0 },
    state: { type: String, default: "Pagado" },
    price: Number,
    sub_total: Number,
    total: Number,
  },
  { timestamps: true },
);

/*
  bill_number → Numero de factura
  
  client → Datos del cliente que compra

  payment_method → Metodos de pago al realizar la compra

  product → Datos del producto al comprar

  quantity → Cantidad a comprar

  state → Para validar el pago de la venta(Pendiente, Pagada, Ajustada, Anulada)
  
  price → Precio de producto

  sub_total → Precio real del producto al comprar

  total → Precio final de la compra
  
*/

export const Sale = mongoose.model("sale_sublimacion", saleSchema);
