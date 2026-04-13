import mongoose from "mongoose";
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name_employee: String,
    type_document_employee: String,
    number_document_employee: Number,
    base_saraly_employee: Number,
    type_contract_employee: {
      type: String,
      enum: ["Fijo", "Indefinido", "Prestaciones", ""],
      default: "",
    },
    stade_employee: String,
    type_employee: String,
    company: String,
  },
  { timestamps: true },
);

/*
    name_employee -> nombre del empleado
    type_document_employee -> tipo de documento (cc, pp, ext, etc)
    number_document_employee -> numero de documento
    base_saraly_employee -> salario base del empleado
    type_contract_employee -> tipo de contrato (fijo, indefinido, prestaciones)
    stade_employee -> estado de empleado (activo o inactivo)
    type_employee -> que rol cumple el empleado (diseñador, opereador, etc)
    company -> id de empresa
  
*/

export const Employee = mongoose.model("employee_sublimacion", employeeSchema);
