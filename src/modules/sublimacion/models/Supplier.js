import mongoose from "mongoose";
const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
      available_plans: String,
      type_available_plans: String,
      months_quantity: Number,
      expired_available_plans: String,
    },
    document_type_supplier: {
      type: String,
      enum: ["CC", "NIT", ""],
      default: "",
    },
    number_document_supplier: String,
    company_name: String,
    contact_name: String,
    email_supplier: String,
    phone_supplier: String,
    address_supplier: String,
    city_supplier: String,
  },
  { timestamps: true },
);

/*
    document_type_supplier → Determinar si es CC, NIT

    number_document_type → Numero de documento del proveedor

    company_name → Razon social del proveedor (nombre de la empresa)

    contact_name → Nombre de contacto del proveedor

    email_supplier → Correo electronico del proveedor

    phone_supplier → Numero de telefono del proveedor

    address_supplier → Direccion del proveedor

    city_supplier → Ciudad del proveedor
*/

export const Supplier = mongoose.model("supplier_sublimacion", supplierSchema);
