import { Supplier } from "../models/Supplier.js";
import { Company } from "../../general/models/Company.js";
import mongoose from "mongoose";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_supplier_company = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      document_type_supplier,
      number_document_supplier,
      company_name,
      contact_name,
      email_supplier,
      phone_supplier,
      address_supplier,
      city_supplier,
    } = req.body;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    if (
      !document_type_supplier ||
      !number_document_supplier ||
      !company_name ||
      !contact_name ||
      !email_supplier ||
      !phone_supplier ||
      !address_supplier ||
      !city_supplier
    )
      return res.status(403).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    const new_create_supplier = await Supplier.create({
      company: {
        _id: data_company._id,
        name_company: data_company.name_company,
        name_founder: data_company.name_founder,
        nit_company: data_company.nit_company,
        available_plans: data_company.available_plans,
        type_available_plans: data_company.type_available_plans,
        months_quantity: data_company.months_quantity,
        expired_available_plans: data_company.expired_available_plans,
      },
      document_type_supplier,
      number_document_supplier,
      company_name,
      contact_name,
      email_supplier,
      phone_supplier,
      address_supplier,
      city_supplier,
    });

    // await Company.updateOne(
    //   { _id: data_company._id },
    //   {
    //     $push: {
    //       supplier_company_sublimacion: {
    //         _id: new_create_supplier._id.toString(),
    //         document_type_supplier,
    //         number_document_supplier,
    //         company_name,
    //         contact_name,
    //         email_supplier,
    //         phone_supplier,
    //         address_supplier,
    //         city_supplier,
    //       },
    //     },
    //   },
    // );

    res.status(200).json({
      msj: "Nuevo proveedor creado exitosamente",
      status: true,
      new_create_supplier,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const update_supplier_company = async (req, res) => {
  try {
    const { company_id, supplier_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const supplier_data = await Supplier.findById(supplier_id);
    if (!supplier_data)
      return res
        .status(404)
        .json({ msj: "Proovedor no encontrado", status: false });

    const updating_data = {
      document_type_supplier: req.body.document_type_supplier,
      number_document_supplier: req.body.number_document_supplier,
      company_name: req.body.company_name,
      contact_name: req.body.contact_name,
      email_supplier: req.body.email_supplier,
      phone_supplier: req.body.phone_supplier,
      address_supplier: req.body.address_supplier,
      city_supplier: req.body.city_supplier,
    };

    const resp = await Supplier.updateOne(
      { _id: supplier_id },
      { $set: updating_data },
    );
    // const [supplier_data_result, company_data_result] = await Promise.all([

    // Company.updateOne(
    //   {
    //     _id: company_id,
    //     "supplier_company_sublimacion._id": supplier_id,
    //   },
    //   {
    //     $set: {
    //       "supplier_company_sublimacion.$": {
    //         _id: supplier_id,
    //         ...updating_data,
    //       },
    //     },
    //   },
    // ),
    // ]);

    // if (supplier_data_result.matchedCount === 0)
    //   return res
    //     .status(404)
    //     .json({ msj: "Proveedor no encontrado", status: false });

    // if (company_data_result.matchedCount === 0)
    //   return res.status(404).json({
    //     msj: "Proveedor no encontrado dentro de la empresa",
    //     status: false,
    //   });

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

export const list_supplier_company = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", stauts: false });

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

export const delete_supplier_company = async (req, res) => {
  try {
    const { supplier_id } = req.params;

    // const is_admin = req.user.role_user === "Admin";
    // if (!is_admin)
    //   return res
    //     .status(403)
    //     .json({ msj: "No tienes permisos para esta funcion", status: false });

    let supplier_data = await Supplier.findById(supplier_id);
    if (!supplier_data)
      return res
        .status(404)
        .json({ msj: "Proveedor no encontrado", status: false });

    await Promise.all([
      Supplier.deleteOne({ _id: supplier_id }),
      // Company.updateOne(
      //   { _id: new mongoose.Types.ObjectId(supplier_data.company._id) },
      //   {
      //     $pull: {
      //       supplier_company_sublimacion: { _id: supplier_id.toString() },
      //     },
      //   },
      // ),
    ]);

    res
      .status(200)
      .json({ msj: "Proveedor eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
