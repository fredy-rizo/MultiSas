import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    name_client: { type: String, default: "" },
    email_client: { type: String, default: "--------------" },
    phone_client: { type: String, default: "--------------" },
    nit_client: { type: String, default: "Sin NIT" },
    type_client: {
      type: String,
      enum: ["Individual", "Empresa", "--------------"],
      default: "--------------",
    },
    address_client: { type: String, default: "--------------" },
    company_id: String,
  },
  { timestamps: true },
);

export const Client = mongoose.model("client_pharmacy", clientSchema);
