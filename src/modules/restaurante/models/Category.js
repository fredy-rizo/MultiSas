import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name_category: String,
    description_category: String,
    sort_order: String,
    status_category: { type: Boolean, default: true },
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
      type_dato: String,
    },
  },
  { timestamps: true },
);

/*
    name_category → Nombre de la categoria (Entrada, Platos Fuertes, Bebidas, Postres, etc...)

    description_category → Describir que contiene la categoria

    sort_order → Orden de clasificacion de las categorias

    status_category → Activar la categoria
*/

export const Category = mongoose.model("category_restaurante", categorySchema);
