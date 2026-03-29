import { Company } from "../../general/models/Company.js";
import { Product } from "../models/Product.js";
import { Pedido } from "../models/Pedido.js";
import { Charge } from "../models/Charge.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_charge = async (req, res) => {
  try {
    const { company_id, product_id, pedido_id } = req.params;
    const { payment_method, paid } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const product_data = await Product.findById(product_id);
    if (!product_data)
      return res.status(404).json({ msj: "Producto no encontrado" });

    const pedido_data = await Pedido.findById(pedido_id);
    if (!pedido_data)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    const new_charge = new Charge({
      product: {
        _id: product_data._id.toString(),
        name_product: product_data.name_product,
        description_product: product_data.description_product,
        price_product: product_data.price_product,
        extras: product_data.extras,
      },
      company: {
        _id: company_data._id.toString(),
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
      },
      payment_method,
      paid,
      price_charge: product_data.price_product,
    });

    const save_charge = await new_charge.save();
    res.status(200).json({
      msj: "Cobro realizado correctamente",
      status: true,
      save_charge,
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

export const list_charge = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Charge.countDocuments(filter);

    const data = await Charge.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando cobros realizados",
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
