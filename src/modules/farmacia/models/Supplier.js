import mongoose from "mongoose";
const { Schema } = mongoose;

export const supplierSchema = new Schema(
  {
    name_company: String,
    contact_name_company: String,
    nit_company: String,
    email_company: String,
    phone_company: String,
    address_company: String,
    city: String,
    company: String,
  },
  { timestamps: true },
);

export const Supplier = mongoose.model("supplier_pharmacy", supplierSchema);
