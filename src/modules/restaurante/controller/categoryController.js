import { Company } from "../../general/models/Company.js";
import { Category } from "../models/Category.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_category = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
