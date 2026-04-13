import mongoose from "mongoose";
const { Schema } = mongoose;

const conceptPayrollSchema = new Schema(
  {
    detail_payroll: String,
    payroll_concept: String,
    valor: Number,
  },
  { timestamps: true },
);

/*
    nomina_detalle_id -> a qué cálculo pertenece.
    concepto_id -> qué concepto se aplicó.
    valor -> cuánto representa ese concepto.
*/

export const ConceptPayroll = mongoose.model(
  "concept_payroll_sublimacion",
  conceptPayrollSchema,
);
