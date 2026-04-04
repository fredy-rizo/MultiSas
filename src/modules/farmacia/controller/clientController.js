import { Client } from "../models/Client.js";
import { Company } from "../../general/models/Company.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_client = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      name_client,
      email_client,
      phone_client,
      nit_client,
      type_client,
      address_client,
    } = req.body;

    if (!name_client)
      return res.status(403).json({ msj: "Campo requerido", status: false });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const new_client = new Client({
      name_client,
      email_client,
      phone_client,
      nit_client,
      type_client,
      address_client,
      company_id: company_data._id,
    });

    const save_client = await new_client.save();
    res
      .status(200)
      .json({ msj: "Cliente creado exitosamente", status: true, save_client });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const update_client = async (req, res) => {
  try {
    const { company_id, client_id } = req.params;

    const updating_data = {
      name_client: req.body.name_client,
      email_client: req.body.email_client,
      phone_client: req.body.phone_client,
      nit_client: req.body.nit_client,
      type_client: req.body.type_client,
      address_client: req.body.address_client,
    };

    const company_data = await Client.findOne({ company_id: company_id });
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado en empresa", status: false });

    await Client.updateOne({ _id: client_id }, { $set: updating_data });

    res
      .status(200)
      .json({ msj: "Cliente actualizado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_client = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { company_id: company_id };
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

export const delete_client = async (req, res) => {
  try {
    const { client_id } = req.params;

    let client_data = await Client.findById(client_id);
    if (!client_data)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    await Client.deleteOne({ _id: client_id });
    res
      .status(200)
      .json({ msj: "Cliente eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
