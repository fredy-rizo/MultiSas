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
