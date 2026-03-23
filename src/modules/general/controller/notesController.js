import {
  generate_bill_debit,
  generate_bill_credit,
} from "../../../core/middleware/lib/BillNumber.js";
import { Production } from "../../sublimacion/models/Production.js";
import { Client } from "../../sublimacion/models/Client.js";
import { Sale } from "../../sublimacion/models/Sale.js";
import { CreditNote } from "../models/CreditNote.js";
import { DebitNote } from "../models/DebitNote.js"
import { Company } from "../models/Company.js";
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_credit_note = async (req, res) => {
  try {
    const { company_id, sale_id, production_id, client_id } = req.params;
    const { reason, total } = req.body;

    const companyX = await Company.findById(company_id);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const saleX = await Sale.findById(sale_id);
    if (!saleX)
      return res
        .status(404)
        .json({ msj: "Venta no encontrada", status: false });

    const productionX = await Production.findById(production_id);
    if (!productionX)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    const clientX = await Client.findById(client_id);
    if (!clientX)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    if (!reason || !total)
      return res
        .status(403)
        .json({ msj: "Completa todos los campos", status: false });

    const bill_counter_credit = await generate_bill_credit(company_id);
    const new_credit_note = new CreditNote({
      bill_number: bill_counter_credit,
      date_credit_note: new Date().toLocaleDateString(),
      reason,
      total,
      company: {
        _id: companyX._id,
        name_company: companyX.name_company,
        name_founder: companyX.name_founder,
        nit_company: companyX.nit_company,
      },
      client: {
        _id: clientX._id,
        document_type_client: clientX.document_type_client,
        number_document_client: clientX.number_document_client,
        name_client: clientX.name_client,
        emial_client: clientX.email_client,
        phone_client: clientX.phone_client,
      },
      production: {
        _id: productionX._id,
        bill_number: productionX.bill_counter,
        price_production: productionX.price_production,
        type_production: productionX.type_production,
        quantity_production: productionX.quantity_production,
      },
      sale: {
        _id: saleX._id,
        bill_number: saleX.bill_number,
        date_sale: saleX.date_sale,
        quantity: saleX.quantity,
        state: saleX.state,
        price: saleX.price,
        sub_total: saleX.sub_total,
        total: saleX.total,
      },
    });

    const save_note_credit = await new_credit_note.save();
    res.status(200).json({
      msj: "Nota credito creada exitosamente",
      status: true,
      save_note_credit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
