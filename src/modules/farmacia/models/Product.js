import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    bill_counter: String,
    name_product: String,
    category_product: {
      type: String,
      enum: [
        "Analgesicos",
        "Antibioticos",
        "Gastrointestinal",
        "Antialergicos",
        "Diabetes",
        "Cardiovascular",
        "Vitaminas",
        "Higiene",
        "Material medico",
        "Respiratorio",
      ],
    },
    cost_product: String,
    price_product: String,
    unit_product: {
      type: String,
      enum: [
        "Unidad",
        "Kg",
        "Gramo",
        "Litro",
        "Metro",
        "Caja",
        "Paquete",
        "Rollo",
        "",
      ],
      default: "",
    },
    stock_product: Number,
    minimum_stock_product: Number,
    batch_product: [
      {
        lote: String,
        expiration_date: Date,
        quantity: Number,
      },
    ],
    expiration_date_product: String,
    company: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        immutable: true,
      },
      name_company: String,
      name_founder: String,
    },
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
    // expiration_date_product -> Fecha de vencimiento de producto DD/MM/AA
*/

export const Product = mongoose.model("product_pharmacy", productSchema);
