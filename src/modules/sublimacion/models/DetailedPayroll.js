import mongoose from "mongoose";
const { Schema } = mongoose;

const detailedPayrollSchema = new Schema(
  {
    nomida: String,
    base_saraly_employee: Number,
    days_worked: String,
    accrued: String,
    deduction: String,
    net: String,
    company: String,
    employee: {
      id: String,
      name_employee: String,
      type_document_employee: String,
      number_document_employee: String,
      base_saraly_employee: String,
      type_contract_employee: String,
      stade_employee: String,
    },
  },
  { timestamps: true },
);

/*
    nomina_id -> referencia al periodo.
    base_saraly_employee -> salario usado en ese cálculo (puede cambiar).
    days_worked -> base para prorrateo.
    accrued -> todo lo que gana (ingresos).
    deduction -> descuentos (salud, pensión, etc.).
    net -> lo que realmente recibe.
    employee-> datos de empleado.
    company -> id de empresa
*/

export const DetailedPayroll = mongoose.model(
  "detailt_payroll_sublimacion",
  detailedPayrollSchema,
);
