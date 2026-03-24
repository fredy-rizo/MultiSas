import { Company } from "../../general/models/Company.js";
import { Category } from "../models/Category.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_category = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { name_category, description_category, sort_order } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const new_category = new Category({
      name_category,
      description_category,
      sort_order,
      company: {
        _id: company_data._id.toString(),
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
        type_dato: company_data.type_dato,
      },
    });

    const save_category = await new_category.save();
    res.status(200).json({
      msj: "Categoria registrada exitosamente",
      status: true,
      save_category,
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

export const update_category = async (req, res) => {
  try {
    const { company_id, category_id } = req.params;
    const { name_category, description_category, sort_order } = req.body;

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

    await Category.updateOne(
      { _id: category_id },
      { $set: { name_category, description_category, sort_order } },
    );

    res
      .status(200)
      .json({ msj: "Categoria actualizada exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_categorys = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Category.countDocuments(filter);

    const data = await Category.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando categorias",
      status: true,
      data,
      pagination: {
        pag: req.body.skippag,
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

export const delete_category = async (req, res) => {
  try {
    const { category_id } = req.params;

    let category_data = await Category.findById(category_id);
    if (!category_data)
      return res
        .status(404)
        .json({ msj: "Categoria no encontrada", status: false });

    await Category.deleteOne({ _id: category_id });

    res
      .status(200)
      .json({ msj: "Categoria eliminada exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
