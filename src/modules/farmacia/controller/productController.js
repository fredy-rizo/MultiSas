import mongoose from "mongoose";
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
      batch_product,
      // expiration_date_product,
    } = req.body;

    if (
      !name_product ||
      !category_product ||
      !cost_product ||
      !price_product ||
      !unit_product ||
      !stock_product ||
      !minimum_stock_product ||
      !batch_product
      // !expiration_date_product
    )
      return res
        .status(403)
        .json({ msj: "Completa todos los campos", status: false });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const parsed_batches = batch_product.map((batch, index) => {
      if (!batch.lote || !batch.expiration_date || !batch.quantity) {
        throw new Error(`Datos incompletos en lote ${index + 1}`);
      }

      let parsedDate;

      if (/^\d{4}-\d{2}-\d{2}$/.test(batch.expiration_date)) {
        const [year, month, day] = batch.expiration_date.split("-");
        parsedDate = new Date(year, month - 1, day);
      } else if (/^\d{2}\/\d{2}\/\d{2}$/.test(batch.expiration_date)) {
        const [day, month, year] = batch.expiration_date.split("/");
        parsedDate = new Date(`20${year}`, month - 1, day);
      } else {
        throw new Error(
          `Formato de fecha inválido en lote ${index + 1}: ${batch.expiration_date}`,
        );
      }
      if (!(parsedDate instanceof Date) || isNaN(parsedDate)) {
        throw new Error(
          `Fecha inválida en lote ${index + 1}: ${batch.expiration_date}`,
        );
      }

      return {
        lote: batch.lote,
        expiration_date: parsedDate,
        quantity: batch.quantity,
      };
    });

    const bill_counter_pharmacy =
      await generate_bill_number_phaymacy(company_id);
    // const bill_counter_batch = await generate_bill_number_batch(company_id);

    const new_product_pharmacy = new Product({
      bill_counter: bill_counter_pharmacy,
      name_product,
      category_product,
      cost_product,
      price_product,
      unit_product,
      stock_product,
      minimum_stock_product,
      // expiration_date_product,
      batch_product: parsed_batches,
      company: company_data._id,
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

export const update_product_batch = async (req, res) => {
  try {
    const { company_id, product_id, batch_id } = req.params;
    const { lote, expiration_date, quantity } = req.body;

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

    let parsedDate;

    if (/^\d{4}-\d{2}-\d{2}$/.test(expiration_date)) {
      const [year, month, day] = expiration_date.split("-");
      parsedDate = new Date(year, month - 1, day);
    } else if (/^\d{2}-\d{2}-\d{2}$/.test(expiration_date)) {
      const [year, month, day] = expiration_date.split("/");
      parsedDate = new Date(`20${year}`, month - 1, day);
    } else {
      return res.status(400).json({
        msj: `Formato de fecha invalido: ${expiration_date}`,
        status: false,
      });
    }

    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ msj: `Fecha invalida ${expiration_date}`, status: false });
    }

    const product_batch_data = await Product.updateOne(
      {
        _id: product_id,
        "batch_product._id": batch_id,
      },
      {
        $set: {
          "batch_product.$.lote": lote,
          "batch_product.$.expiration_date": parsedDate,
          "batch_product.$.quantity": quantity,
        },
      },
    );

    // console.log("OLAAAAAAAAAAAAAAAAAAAAAAAA", product_batch_data);
    // return;

    if (!product_batch_data)
      return res
        .status(404)
        .json({ msj: "Lote no encontrado en producto", status: false });

    res
      .status(200)
      .json({ msj: "Lote actualizado correctamente", status: true });
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

export const list_product_lotes = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const today = new Date();
    const filter = {
      "company._id": company_id,
      batch_product: {
        $elemMatch: {
          expiration_date: { $lt: today },
        },
      },
    };

    const cant = await Product.countDocuments(filter);

    const data = await Product.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando productos vencidos",
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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const delete_product_lote = async (req, res) => {
  try {
    const { company_id, product_id, batch_id } = req.params;

    // const company_data = await Company.findById
    const [company_data, product_data] = await Promise.all([
      Company.findById(company_id),
      Product.findById(product_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    const batch_exits = product_data.batch_product.id(batch_id);
    if (!batch_exits)
      return res
        .status(404)
        .json({ msj: "Lote no encontrado en producto", status: false });

    const result = await Product.updateOne(
      { _id: product_id },
      {
        $pull: {
          batch_product: {
            _id: new mongoose.Types.ObjectId(batch_id),
          },
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        msj: "No se pudo eliminar el lote",
        status: false,
      });
    }

    res
      .status(200)
      .json({ msj: "Lote eliminado exitosamente de producto", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const delete_product = async (req, res) => {
  try {
    const { company_id, product_id } = req.params;

    const [company_data, product_data] = await Promise.all([
      Company.findById(company_id),
      Product.findById(product_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    await Product.deleteOne({ _id: product_id });
    res
      .status(200)
      .json({ msj: "Producto eliminado correctamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
