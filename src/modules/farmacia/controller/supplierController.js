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
      nit_company,
      city,
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
      return res.status(403).json({
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
      !nit_company ||
      !address_company ||
      !city
    )
      return res.status(400).json({
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
      nit_company,
      city,
    });

    res.status(200).json({
      msj: "Proveedor creado exitosamente",
      status: true,
      new_supplier,
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

export const update_supplier = async (req, res) => {
  try {
    const { company_id, supplier_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const [company_data, supplier_data] = await Promise.all([
      Company.findById(company_id),
      Supplier.findById(supplier_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    if (!supplier_data)
      return res
        .status(404)
        .json({ msj: "Proveedor no encontrado", status: false });

    const data_update = {
      name_company: req.body.name_company,
      contact_name_company: req.body.contact_name_company,
      email_company: req.body.email_company,
      phone_company: req.body.phone_company,
      address_company: req.body.address_company,
      nit_company: req.body.nit_company,
      city: req.body.city,
    };

    const resp = await Supplier.updateOne(
      { _id: supplier_id },
      { $set: data_update },
    );

    res
      .status(200)
      .json({ msj: "Proveedor actualizado correctamente", status: true, resp });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_supplier = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Supplier.countDocuments(filter);

    const data = await Supplier.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando proveedores",
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

export const delete_supplier = async (req, res) => {
  try {
    const { supplier_id } = req.params;

    const data_supplier = await Supplier.findById(supplier_id);
    if (!data_supplier)
      return res
        .status(404)
        .json({ msj: "Proveedor no encontrado", status: false });

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== supplier_data.company
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    await Supplier.deleteOne({ _id: supplier_id });

    res
      .status(200)
      .json({ msj: "Proveedor eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
