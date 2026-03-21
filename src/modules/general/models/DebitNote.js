import mongoose from "mongoose";
const { Schema } = mongoose;

const debitNoteSchema = new Schema(
  {
    bill_number: String, // Automatico
    date_debit_note: String, // Automatico
    reason: String, // Manual
    total: String, // Manual
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
    },
    client: {
      _id: String,
      document_type_client: String,
      number_document_client: String,
      name_client: String,
      emial_client: String,
      phone_client: String,
    },
    production: {
      _id: String,
      bill_number: String,
      price_production: String,
      type_production: String,
      quantity_production: String,
    },
    sale: {
      _id: String,
      bill_number: String,
      date_sale: String,
      quantity: Number,
      state: String,
      price: Number,
      sub_total: Number,
      total: Number,
    },
  },
  { timestamps: true },
);

export const DebitNote = mongoose.model("debit_note", debitNoteSchema);
