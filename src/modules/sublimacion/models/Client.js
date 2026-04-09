import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    // company: {
    //   _id: String,
    //   name_company: String,
    //   name_founder: String,
    //   nit_company: String,
    //   available_plans: String,
    //   type_available_plans: String,
    //   months_quantity: Number,
    //   expired_available_plans: String,
    // },
    company: String,
    document_type_client: {
      type: String,
      enum: ["CC", "NIT", "CE", "PP", ""],
      default: "",
    },
    number_document_client: { type: String, default: "Vacio" },
    name_client: { type: String, default: "Vacio" },
    email_client: { type: String, default: "Vacio" },
    phone_client: { type: String, default: "Vacio" },
  },
  { timestamps: true },
);

/*
    document_type_client → Determinar si es CC, CE, PP, NIT

    number_document_type → Numero de documento del cliente

    name_client → Razon social del cliente (nombre del cliente)

    contact_name → Nombre de contacto del cliente

    email_client → Correo electronico del cliente

    phone_client → Numero de telefono del cliente
*/

export const Client = mongoose.model("client_sublimacion", clientSchema);
