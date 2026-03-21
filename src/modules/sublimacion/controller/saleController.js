import { Sale } from "../models/Sale.js";
import { Client } from "../models/Client.js";
import { Company } from "../../general/models/Company.js";
import { Production } from "../models/Production.js";
import {
  generate_bill_number,
  generate_bill_number_brief_case,
} from "../../../core/middleware/lib/BillNumber.js";
// import { BriefCase } from "../../models/sublimacion/Briefcase.js";
// import { AccountPlan } from "../../models/sublimacion/AccountPlans.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_sale = async (req, res) => {
  try {
    const { company_id, production_id } = req.params;
    const { client, payment_method, quantity, purchase_method } = req.body;

    // purchase_method → Forma de pago simulada(no almacenado)

    if (!quantity || quantity <= 0)
      return res.status(203).json({
        msj: "La cantidad a comprar debe ser maypr a 0",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const client_data = await Client.findById(client);
    if (!client_data)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    const production_data = await Production.findById(production_id);
    if (!production_data)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    const bill_number = await generate_bill_number(production_data.company._id);
    const new_sale = await Sale.create({
      bill_number,
      client: {
        _id: client_data._id.toString(),
        name_client: client_data.name_client,
      },
      production: {
        _id: production_data._id.toString(),
        bill_number: production_data.bill_counter,
        price_production: production_data.price_production,
        type_production: production_data.type_production,
        quantity_production: production_data.quantity_production,
        delivery_date_production: production_data.delivery_date_production,
        responsible_production: production_data.responsible_production,
        priority_production: production_data.priority_production,
        production_finalized_date: production_data.production_finalized_date,
      },
      payment_method,
      quantity: Number(quantity),
      price,
      sub_total,
      total,
    });

    await Company.updateOne(
      { _id: data_company._id },
      {
        $push: {
          sale_company_sublimacion: {
            _id: new_sale._id.toString(),
            bill_number,
            client: {
              _id: client_data._id.toString(),
              name_client: client_data.name_client,
            },
            production: {
              _id: production_data._id.toString(),
              bill_number: production_data.bill_counter,
              price_production: production_data.price_production,
              type_production: production_data.type_production,
              quantity_production: production_data.quantity_production,
              delivery_date_production:
                production_data.delivery_date_production,
              responsible_production: production_data.responsible_production,
              priority_production: production_data.priority_production,
              production_finalized_date:
                production_data.production_finalized_date,
            },
            payment_method,
            quantity: Number(quantity),
            price,
            sub_total,
            total,
          },
        },
      },
    );

    // Crear asiento contable
    // const today = new Date();
    // const day = today.getDate();
    // const month = today.getMonth() + 1;
    // const year = today.getFullYear();

    // const date_create_formatted = `${day}/${month}/${year}`;

    // const bill_number_brief_case = await generate_bill_number_brief_case(
    //   data_company._id,
    // );
    // await BriefCase.create({
    //   bill_number: bill_number_brief_case,
    //   date_create: date_create_formatted,
    //   debit: "Clientes",
    //   credit: "Ingresos por ventas",
    //   amount: product_data.selling_price,
    //   type_brief_case: "Venta",
    // });

    // Crear asiento contable
    // const inventory_account = await AccountPlan.findOne({
    //   "company._id": company_id,
    //   account_plan: "Ventas" || "Clientes",
    // });

    // let credit_account_name;

    // if (purchase_method === "caja") credit_account_name = "Caja";
    // if (purchase_method === "banco") credit_account_name = "Banco";
    // if (purchase_method === "ventas") credit_account_name = "Ventas";
    // if (purchase_method === "inventario") credit_account_name = "Inventario";

    // const credit_account = await AccountPlan.findOne({
    //   "company._id": company_id,
    //   account_plan: credit_account_name,
    // });

    // if (!inventory_account || !credit_account)
    //   return res.status(400).json({
    //     msj: "Las cuentas contables necesarias no existen en el plan de cuentas",
    //     status: false,
    //   });

    // // Factura enumerada
    // const bill_counter_brief_case =
    //   await generate_bill_number_brief_case(company_id);

    // const today = new Date();
    // const date_create_formatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // await BriefCase.create({
    //   bill_number: bill_counter_brief_case,
    //   date_create: date_create_formatted,
    //   product_description_brief: `Venta ${new_sale.product.product_name} - Precio de venta ${new_sale.product.selling_price}`,
    //   debit: inventory_account.account_plan,
    //   credit: credit_account.account_plan,
    //   amount: new_sale.sub_total,
    //   type_brief_case: "Venta de producto",
    // });

    res
      .status(200)
      .json({ msj: "Venta realizada correctamente", status: true, new_sale });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_sale = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Sale.countDocuments(filter);

    const data = await Sale.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando ventas",
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_sale_company_id = async (req, res) => {
  try {
    const { company_id, sale_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const data_sale = await Sale.findById(sale_id);
    if (!data_sale)
      return res
        .status(404)
        .json({ msj: "Venta no encontrada", status: false });

    const is_admin =
      req.user.role_user === "Admin" || req.user.role_user === "Super Admin";
    if (!is_admin)
      return res
        .status(403)
        .json({ msj: "No tienes permisos para esta funcion", status: false });

    const info_company_sale = await Sale.findOne({
      _id: sale_id,
    });

    res.status(200).json({
      msj: "Mostrando venta detallada",
      status: true,
      info_company_sale,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
