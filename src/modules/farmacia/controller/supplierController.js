import { Supplier } from "../models/Supplier.js";
import { Company } from "../../general/models/Company.js";
import mongoose from "mongoose";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_supplier = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      name_company,
      contact_name_company,
      email_company,
      phone_company,
      address_company,
    } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res
        .status(403)
        .json({
          msj: "No puedes acceder a esta funcion 'CTRL'",
          sstatus: false,
        });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    if (
      !name_company ||
      !contact_name_company ||
      !email_company ||
      !phone_company ||
      !address_company
    )
      return res
        .status(400)
        .json({
          msj: "Completa todos los campos para continuar",
          status: false,
        });

    const new_supplier = await Supplier.create({
      company: company_id,
      name_company,
      contact_name_company,
      email_company,
      phone_company,
      address_company,
    });

    res
      .status(200)
      .json({
        msj: "Proveedor creado exitosamente",
        status: true,
        new_supplier,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
