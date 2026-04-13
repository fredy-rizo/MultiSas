import mongoose from "mongoose";
const { Schema } = mongoose;

const payrollConceptSchema = new Schema(
  {
    name_concept: String,
    type_concept: {
      type: String,
      enum: ["devengado", "deduccion"],
    },
    formula: String,
    company: String,
  },
  { timestamps: true },
);

/*
    nombre -> salario, auxilio, horas_extra, salud, pensión.
    tipo -> devengado suma al ingreso y la deduccion resta.
    formula -> lógica para cálculo (ej -> salario * 0.04).
*/

export const PayrollConcept = mongoose.model(
  "payroll_concept_sublimacion",
  payrollConceptSchema,
);
