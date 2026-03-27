import mongoose from "mongoose";
const { Schema } = mongoose;

const tableSchema = new Schema(
  {
    number_table: Number,
    capacity_table: Number,
    occupied: { type: Boolean, default: false },
    reserved: { type: Boolean, default: false },
    hour_reserved: { type: String, default: "" },
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
        number_table -> numero de la mesa
        capacity_table -> capacidad de la mesa
        occupied -> Saber si esta ocupada
        reserved -> Saber si esta reservada
        hour_reserved -> Saber la hora de la reserva
*/

export const Table = mongoose.model("table_restaurante", tableSchema);
