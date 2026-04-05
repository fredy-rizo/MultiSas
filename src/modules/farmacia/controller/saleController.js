import { generate_bill_number_sale_pharmacy } from "../../../core/middleware/lib/BillNumber.js";
import { Company } from "../../general/models/Company.js";
import { Product } from "../models/Product.js";
import { Client } from "../models/Client.js";
import { Sale } from "../models/Sale.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_sale = async (req, res) => {
  try {
    const { company_id, product_id } = req.params;
    const { client_id, type_payment, quantity } = req.body;

    if (!quantity || quantity <= 0)
      return res.status(203).json({
        msj: "La cantidad a comprar debe ser mayor a 0",
        status: false,
      });

    const [company_data, product_data] = await Promise.all([
      Company.findById(company_id),
      Product.findById(product_id),
    ]);

    let client_data = null;

    if (client_id) {
      client_data = await Client.findById(client_id);
      if (!client_data)
        return res
          .status(404)
          .json({ msj: "Cliente no encontrado", status: false });
    }

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    const bill_number = await generate_bill_number_sale_pharmacy(
      product_data.company,
    );
    const new_sale = new Sale({
      bill_counter: bill_number,
      company: company_data._id.toString(),
      product: {
        _id: product_data._id.toString(),
        bill_counter: product_data.bill_counter,
        name_product: product_data.name_product,
        category_product: product_data.category_product,
        unit_product: product_data.unit_product,
        price_product: product_data.price_product,
        batch_product: product_data.batch_product,
      },
      client: client_data
        ? {
            _id: client_data._id.toString(),
            name_client: client_data.name_client,
          }
        : null,
      type_payment,
      quantity: Number(quantity),
      price: product_data.price_product,
      sub_total: product_data.price_product * Number(quantity),
      total: product_data.price_product * Number(quantity),
    });

    const save_sale = await new_sale.save();
    res
      .status(404)
      .json({ msj: "Venta realizada exitosamente", status: true, save_sale });
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

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { company: company_id };
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
