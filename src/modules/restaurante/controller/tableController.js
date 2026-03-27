import { Company } from "../../general/models/Company.js";
import { Table } from "../models/Table.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_table = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { number_table, capacity_table } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const new_table = new Table({
      number_table,
      capacity_table,
      company: {
        _id: company_data._id.toString(),
        name_company: company_data.name_company,
        name_founder: company_data.name_founder,
        nit_company: company_data.nit_company,
        type_dato: company_data.type_dato,
      },
    });

    const save_table = await new_table.save();
    res
      .status(200)
      .json({ msj: "Mesa creada exitosamente", status: true, save_table });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const update_table = async (req, res) => {
  try {
    const { company_id, table_id } = req.params;
    const { number_table, capacity_table } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const table_data = await Table.findById(table_id);
    if (!table_data)
      return res.status(404).json({ msj: "Mesa no encontrada", status: false });

    await Table.updateOne(
      { _id: table_id },
      {
        $set: {
          number_table,
          capacity_table,
        },
      },
    );

    res
      .status(200)
      .json({ msj: "Mesa actualizada exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const update_occupied_table = async (req, res) => {
  try {
    const { company_id, table_id } = req.params;
    const { occupied } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const table_data = await Table.findById(table_id);
    if (!table_data)
      return res.status(404).json({ msj: "Mesa no encontrada", status: false });

    await Table.updateOne(
      { _id: table_id },
      {
        $set: {
          occupied,
        },
      },
    );

    res.status(200).json({
      msj: "Estado de la mesa actualizado exitosamenete",
      status: true,
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

export const update_reserve_table = async (req, res) => {
  try {
    const { company_id, table_id } = req.params;
    const { reserved, observation_reserved } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const table_data = await Table.findById(table_id);
    if (!table_data)
      return res.status(404).json({ msj: "Mesa no encontrada", status: false });

    await Table.updateOne(
      { _id: table_id },
      {
        $set: {
          reserved,
          hour_reserved: new Date().toLocaleDateString(),
          observation_reserved,
        },
      },
    );

    res.status(200).json({
      msj: "Reserva de la mesa actualizada correctamente",
      status: true,
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

export const delete_table = async (req, res) => {
  try {
    const { company_id, table_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const table_data = await Table.findById(table_id);
    if (!table_data)
      return res.status(404).json({ msj: "Mesa no encontrada", status: false });

    await Table.deleteOne({ _id: table_id });

    res.status(200).json({ msj: "Mesa eliminada exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_tables = async (req, res) => {
  try {
    const { company_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await Table.countDocuments(filter);

    const data = await Table.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando mesas",
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
