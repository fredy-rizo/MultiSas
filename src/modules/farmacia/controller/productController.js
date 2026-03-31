import {
  generate_bill_number_batch,
  generate_bill_number_phaymacy,
} from "../../../core/middleware/lib/BillNumber.js";
import { Company } from "../../general/models/Company.js";
import { Product } from "../models/Product.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_product = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      name_product,
      category_product,
      cost_product,
      price_product,
      unit_product,
      stock_product,
      minimum_stock_product,
      expiration_date_product,
    } = req.body;

    if (
      !name_product ||
      !category_product ||
      !cost_product ||
      !price_product ||
      !unit_product ||
      !stock_product ||
      !minimum_stock_product ||
      !expiration_date_product
    )
      return res
        .status(403)
        .json({ msj: "Completa todos los campos", status: false });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const bill_counter_pharmacy =
      await generate_bill_number_phaymacy(company_id);
    const bill_counter_batch = await generate_bill_number_batch(company_id);

    const new_product_pharmacy = new Product({
      bill_counter: bill_counter_pharmacy,
      name_product,
      category_product,
      cost_product,
      price_product,
      unit_product,
      stock_product,
      minimum_stock_product,
      batch_product: bill_counter_batch,
      expiration_date_product,
      company: {
        _id: company_data._id.toString(),
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
      },
    });

    const save_product_pharmacy = await new_product_pharmacy.save();
    res.status(200).json({
      msj: "Producto creado exitosamente",
      status: true,
      save_product_pharmacy,
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

export const update_product = async (req, res) => {
  try {
    const { company_id, product_id } = req.params;
    // console.log("req.params", req.params);
    const {
      name_product,
      category_product,
      cost_product,
      price_product,
      unit_product,
      stock_product,
      minimum_stock_product,
      expiration_date_product,
    } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const product_data = await Product.findById(product_id);
    // console.log("product", product_data);
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    await Product.updateOne(
      { _id: product_id },
      {
        $set: {
          name_product,
          category_product,
          cost_product,
          price_product,
          unit_product,
          stock_product,
          minimum_stock_product,
          expiration_date_product,
        },
      },
    );

    res
      .status(200)
      .json({ msj: "Producto actualizado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_products_stocks_minimum = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = {
      "company._id": company_id,
      $expr: {
        $lte: [
          { $toDouble: "$stock_product" },
          { $toDouble: "$minimum_stock_product" },
        ],
      },
    };

    const cant = await Product.countDocuments(filter);
    const data = await Product.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando productos con stock bajo",
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

export const list_products = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    // console.log("filter", filter);
    const cant = await Product.countDocuments(filter);
    // console.log("cant", cant);

    const data = await Product.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando productos",
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
