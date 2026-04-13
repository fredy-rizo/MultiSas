import mongoose from "mongoose";
const { Schema } = mongoose;

const rosterSchema = new Schema(
  {
    start_period: String,
    end_period: String,
    stade: {
      type: String,
      enum: ["Draft", "Calculada", "Pagada", ""],
      default: "",
    },
    company: String,
    employee: String,
  },
  { timestamps: true },
);

/*
    start_period -> periodo de inicio
    end_period -> periodo de fin
    stade -> estado
    company -> id de empresa
    employee -> id de empleado
*/

export const Roster = mongoose.model("roster_sublimacion", rosterSchema);
