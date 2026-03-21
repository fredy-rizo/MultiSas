import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const userCompanySchema = new Schema(
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
    token: { type: String, default: "" },
    email_user_company: String,
    name_user_company: String,
    nit_company_by_user: String,
    password_user_company: String,
    type_dato: { type: String, default: "user_company" },
    role_user_company: {
      type: String,
      enum: ["Vendedor", "Consultor", "Sin rol", "Diseñador"],
      default: "Sin rol",
    },
    active: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

/*
    company - traer todos los datos de la empresa por su ID

    
    email_user_company → email del vendedor/consultor del usuario de la empresa
    name_user_company → nombre del vendedor/consultor del usuario de la empresa
    password_user_company → creacion de la contraseña del vendedor/consultor del usuario de la empresa
    role_user_company → rol a asignar (si es vendedor o consultor)

    active → activar y desactivar usuario de la empresa

*/

export const encrypt_password_user_company = async (password) => {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
};

export const compare_password_user_company = async (
  password,
  received_password,
) => {
  return await bcrypt.compare(password, received_password);
};

export const UserCompany = mongoose.model(
  "usercompany_sublimacion",
  userCompanySchema,
);
