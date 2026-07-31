import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    company: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name_company: String,
      name_founder: String,
      nit_company: String,
    },
    token: { type: String, default: "" },
    user_name_company: String,
    user_email_company: String,
    user_password_company: String,
    nit_company_by_user: String,
    type_date: { type: String, default: "user_company" },
    user_role_company: {
      type: String,
      default: "Sin rol",
    },
    active: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const encrypt_password_user_company = async (password) => {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
};

export const compare_password_user_company = async (
  password_user_company,
  received_password,
) => {
  return await bcrypt.compare(password_user_company, received_password);
};

export const User = mongoose.model("user_general", userSchema);
