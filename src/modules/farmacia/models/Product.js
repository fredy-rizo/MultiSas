import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    bill_counter: String,
    name_product: String,
    category_product: String,
    cost_product: String,
    price_product: String,
    unit_product: {
      type: String,
      enum: [
        "unidad",
        "kg",
        "gramo",
        "litro",
        "metro",
        "caja",
        "paquete",
        "rollo",
        "",
      ],
      default: "",
    },
    stock_product: String,
    minimum_stock_product: String,
    batch_product: String,
    expiration_date_product: String,
  },
  { timestamps: true },
);

/*
    bill_counter -> Contador de enumeracion de productos
    name_product -> Nombre de producto
    category_product -> Categoria de producto
    cost_produtc -> Costo de compra de producto
    price_product -> precio de venta de producto
    unit_product -> Definir como se vende el producto
    stock_product -> Cantidad maxima de compra de producto en farmacia
    minimum_stock_product -> Cantidad minima de producto en farmacia
    batch_product -> Lote de producto
    expiration_date_product -> Fecha de vencimiento de producto DD/MM/AA
*/

export const Product = mongoose.model("product_pharmacy", productSchema);
