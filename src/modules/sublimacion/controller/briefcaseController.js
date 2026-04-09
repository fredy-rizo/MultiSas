import { Company } from "../../general/models/Company.js";
import { Invoice } from "../models/Invoice.js";
import { Payment } from "../models/Payment.js";
import { Pedido } from "../models/Pedido.js";
import { Client } from "../models/Client.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_invoice = async (req, res) => {
  try {
    const { company_id, pedido_id, client_id } = req.params;
    const { total, issue_date, due_date, is_credit } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res
        .status(403)
        .json({ msj: "No puedes acceder a esta funcion 'CTRL", status: false });

    const [company_data, pedido_data, client_data] = await Promise.all([
      Company.findById(company_id),
      Pedido.findById(pedido_id),
      Client.findById(client_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Emmpresa no encontrada", status: false });
    if (!pedido_data)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });
    if (!client_data)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    const total_amount = Number(pedido_data.price_pedido);
    const new_invoice = new Invoice({
      company: company_id,
      client: client_id,
      pedido: {
        _id: pedido_data._id.toString(),
        bill_counter: pedido_data.bill_counter,
        date_pedido: pedido_data.date_pedido,
        hour_pedido: pedido_data.hour_pedido,
        quantity_pedido: pedido_data.quantity_pedido,
        price_pedido: pedido_data.price_pedido,
      },
      total: total_amount,
      balance: total_amount,
      issue_date,
      due_date,
      is_credit,
    });

    const save_invoice = await new_invoice.save();
    res.status(200).json({
      msj: "Factura generada exitosamente",
      status: true,
      save_invoice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const record_payments = async (req, res) => {
  try {
    const { company_id, invoice_id } = req.params;
    const { amount, method } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res
        .status(403)
        .json({ msj: "No puedes acceder a esta funcion 'CTRL", status: false });

    const [company_data, invoice_data] = await Promise.all([
      Company.findById(company_id),
      Invoice.findById(invoice_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
    if (!invoice_data)
      return res
        .status(404)
        .json({ msj: "Factura no encontrada", status: false });

    const new_payment = new Payment({
      company: company_id,
      invoice: invoice_id,
      client: invoice_data.client,
      amount,
      method,
    });
    const save_payment = await new_payment.save();

    invoice_data.balance -= amount;
    if (invoice_data.balance <= 0) {
      invoice_data.status = "Pagado";
      invoice_data.balance = 0;
    } else if (new Date() > invoice_data.due_date) {
      invoice_data.status = "Atrasado";
    }
    const save_invoice = await invoice_data.save();

    res.status(200).json({
      msj: "Pago registrado exitosamente",
      status: true,
      save_payment,
      save_invoice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_brief = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { company: company_id };
    const cant = await Invoice.countDocuments(filter);

    const data = await Invoice.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando cartera",
      status: true,
      data,
      pagination: {
        pag: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
