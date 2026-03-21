import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
      type_dato: String,
    },
    category: {
      _id: String,
      name_category: String,
      description_category: String,
      sort_order: String,
      status_category: Boolean,
    },
    name_product: String,
    description_product: String,
    price_product: String,
    status_product: { type: Boolean, default: true },
    available: { type: Boolean, default: true },
    variants: [String],
    extras: [String],
  },
  { timestamps: true },
);

/*
    company → Datos de la compañia

    category → Datos de la categoria

    name_product → Nombre del producto

    description_product → Descripcion del producto

    price_product → Precio del producto

    status_product → Definir si esta activo o no

    available → Definir si esta disponible o no

    variants → ¿?

    extras → Poner si lleva extras demas el producto

*/

export const Product = mongoose.model("product_restaurante", productSchema);
