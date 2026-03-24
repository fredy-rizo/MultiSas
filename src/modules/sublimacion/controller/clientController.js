import { Client } from "../models/Client.js";
import { Company } from "../../general/models/Company.js";
import mongoose from "mongoose";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_client_company = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      document_type_client,
      number_document_client,
      name_client,
      email_client,
      phone_client,
    } = req.body;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const new_create_client = await Client.create({
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
      document_type_client,
      number_document_client,
      name_client,
      email_client,
      phone_client,
    });

    // await Company.updateOne(
    //   { _id: data_company._id },
    //   {
    //     $push: {
    //       client_company_sublimacion: {
    //         _id: new_create_client._id.toString(),
    //         document_type_client: new_create_client.document_type_client,
    //         number_document_client: new_create_client.number_document_client,
    //         name_client: new_create_client.name_client,
    //         email_client: new_create_client.email_client,
    //         phone_client: new_create_client.phone_client,
    //       },
    //     },
    //   },
    // );

    res.status(200).json({
      msj: "Nuevo cliente creado exitosamente",
      status: true,
      new_create_client,
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

export const update_client_company = async (req, res) => {
  try {
    const { company_id, client_id } = req.params;

    const updating_data = {
      document_type_client: req.body.document_type_client,
      number_document_client: req.body.number_document_client,
      name_client: req.body.name_client,
      email_client: req.body.email_client,
      phone_client: req.body.phone_client,
    };

    const company_data = await Client.findOne({ "company._id": company_id });
    if (!company_data)
      return res.status(404).json({ msj: "Cliente no encontrado en empresa" });

    await Client.updateOne({ _id: client_id }, { $set: updating_data });

    // const [client_data_result, company_data_result] = await Promise.all([
    //   Client.updateOne({ _id: client_id }, { $set: updating_data }),

    //   Company.updateOne(
    //     {
    //       _id: company_id,
    //       "client_company_sublimacion._id": client_id,
    //     },
    //     {
    //       $set: {
    //         "client_company_sublimacion.$": {
    //           _id: client_id,
    //           ...updating_data,
    //         },
    //       },
    //     },
    //   ),
    // ]);

    // if (client_data_result.matchedCount === 0)
    //   return res
    //     .status(404)
    //     .json({ msj: "Cliente no encontrado", status: false });

    // if (company_data_result.matchedCount === 0)
    //   return res.status(404).json({
    //     msj: "Cliente no encontrado dentro de la empresa",
    //     status: false,
    //   });

    res
      .status(200)
      .json({ msj: "Cliente actualizado correctamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_client_company = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Client.countDocuments(filter);

    const data = await Client.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando clientes",
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

export const delete_client_company = async (req, res) => {
  try {
    const { client_id } = req.params;

    let client_data = await Client.findById(client_id);
    if (!client_data)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    await Promise.all([
      Client.deleteOne({ _id: client_id }),
      // Company.updateOne(
      //   { _id: new mongoose.Types.ObjectId(client_data.company._id) },
      //   {
      //     $pull: {
      //       client_company_sublimacion: { _id: client_id.toString() },
      //     },
      //   },
      // ),
    ]);

    res
      .status(200)
      .json({ msj: "Cliente eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
