import { Company } from "../../general/models/Company.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_product = async (req, res) => {
  try {
    const { company_id, category_id } = req.params;
    const { name_product, description_product, price_product, extras } =
      req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const category_data = await Category.findById(category_id);
    if (!category_data)
      return res
        .status(404)
        .json({ msj: "Categoria no encontrada", status: false });

    const new_product = new Product({
      name_product,
      description_product,
      price_product,
      extras,
      company: {
        _id: company_data._id.toString(),
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
        type_dato: company_data.type_dato,
      },
      category: {
        _id: category_data._id.toString(),
        name_category: category_data.name_category,
        description_category: category_data.description_category,
        sort_order: category_data.sort_order,
        status_category: category_data.status_category,
      },
    });

    const save_product = await new_product.save();
    res.status(200).json({
      msj: "Producto creado correctamente",
      status: true,
      save_product,
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
    const { name_product, description_product, price_product, status_product } =
      req.body;

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
          description_product,
          price_product,
          status_product,
        },
      },
    );

    res
      .status(200)
      .json({ msj: "Producto actualizado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msj });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const push_extra_product = async (req, res) => {
  try {
    const { company_id_resp, product_id_resp } = req.params;
    const { name_extra, price_extra } = req.body;

    console.log("req.params", req.params);

    const company_data = await Company.findById(company_id_resp);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const product_data = await Product.findById(product_id_resp);
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    await Product.updateOne(
      { _id: product_id_resp },
      {
        $push: {
          extras: { name_extra, price_extra },
        },
      },
    );

    res
      .status(200)
      .json({ msj: "Extra agregado exitosamente al producto", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const update_product_extra = async (req, res) => {
  try {
    const { company_id, product_id, extra_id } = req.params;
    const { name_extra, price_extra } = req.body;

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

    const product_extra_data = await Product.updateOne(
      {
        _id: product_id,
        "extras._id": extra_id,
      },
      {
        $set: {
          "extras.$.name_extra": name_extra,
          "extras.$.price_extra": price_extra,
        },
      },
    );

    if (!product_extra_data)
      return res
        .status(404)
        .json({ msj: "Extra no encontrado en producto", status: false });

    res
      .status(200)
      .json({ msj: "Extra actualizado correctamente", status: true });
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

    await Product.deleteOne({ _id: product_id });

    res
      .status(200)
      .json({ msj: "Producto eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const delete_extra_product = async (req, res) => {
  try {
    const { company_id, product_id, extra_id } = req.params;

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

    const product_extra_data = await Product.updateOne(
      {
        _id: product_id,
      },
      {
        $pull: {
          extras: { _id: extra_id },
        },
      },
    );

    if (!product_extra_data)
      return res
        .status(404)
        .json({ msj: "Extra no encontrado en producto", status: false });

    res.status(200).json({ msj: "Extra eliminado de producto", status: true });
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
    const cant = await Product.countDocuments(filter);

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
