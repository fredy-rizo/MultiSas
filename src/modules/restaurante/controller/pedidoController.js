import { generate_bill_number_pedido_restaurante } from "../../../core/middleware/lib/BillNumber.js";
import { Company } from "../../general/models/Company.js";
import { Pedido } from "../models/Pedido.js";
import { Product } from "../models/Product.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_pedido_restaurante = async (req, res) => {
  try {
    const { company_id, product_id } = req.params;
    const { price_pedido } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const product_data = await Product.findById(product_id);
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    const bill_counter_pedido_restaurante =
      await generate_bill_number_pedido_restaurante(company_id);

    const new_pedido_restaurante = new Pedido({
      bill_counter: bill_counter_pedido_restaurante,
      date_pedido: new Date().toLocaleDateString(),
      hour_pedido: new Date().toLocaleTimeString(),
      price_pedido,
      product: {
        _id: product_data._id,
        name_product: product_data.name_product,
        description_product: product_data.description_product,
        price_product: product_data.price_product,
        extras: product_data.extras,
      },
      company: {
        _id: company_data._id,
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
      },
    });

    const save_pedido_restaurante = await new_pedido_restaurante.save();
    res.status(200).json({
      msj: "Nuevo pedido registrado exitosamente en restaurante",
      status: true,
      save_pedido_restaurante,
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

export const list_pedidos = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Pedido.countDocuments(filter);

    const data = await Pedido.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando todos los pedidos",
      status: true,
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
