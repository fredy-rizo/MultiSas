import { Company } from "../../../modules/general/models/Company.js";

export const generate_bill_number = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada en contador");

  const number = company.bill_counter.toString().padStart(3, "0");

  return `FAC-${number}`;
};

export const generate_bill_number_brief_case = async (company_id) => {
  const company_x = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_brief_case: 1 } },
    { new: true },
  );

  if (!company_x) throw new Error("Empresa no encontrada");

  const data_number = company_x.bill_counter_brief_case
    .toString()
    .padStart(4, "0");

  return `AS-${data_number}`;
};

export const generate_bill_number_shopping = async (company_id) => {
  const company_X = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_shopping: 1 } },
    { new: true },
  );

  if (!company_X) throw new Error("Empresa no encontrada");

  const data_number = company_X.bill_counter_shopping
    .toString()
    .padStart(4, "0");

  return `OC-${data_number}`;
};

export const generate_bill_number_pedido = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_pedido: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada");

  const data_number = company.bill_counter_pedido.toString().padStart(3, "0");

  return `PD-${data_number}`;
};

export const generate_bill_counter_production = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_production: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada");

  const data_number = company.bill_counter_production
    .toString()
    .padStart(3, "0");

  return `PROD-${data_number}`;
};

export const generate_bill_credit = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_credit: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada");

  const data_number = company.bill_counter_credit.toString().padStart(3, "0");

  return `CN-${data_number}`;
};

export const generate_bill_debit = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_debit: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada");

  const data_number = company.bill_counter_debit.toString().padStart(3, "0");

  return `DN-${data_number}`;
};

export const generate_bill_number_pedido_restaurante = async (company_id) => {
  const company = await Company.findByIdAndUpdate(
    company_id,
    { $inc: { bill_counter_pedido_restaurante: 1 } },
    { new: true },
  );

  if (!company) throw new Error("Empresa no encontrada");

  const data_number = company.bill_counter_pedido_restaurante
    .toString()
    .padStart(3, "0");

  return `PD-${data_number}`;
};
