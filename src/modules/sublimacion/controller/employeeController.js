import { Company } from "../../general/models/Company.js";
import { Employee } from "../models/Employee.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_employee = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      name_employee,
      type_document_employee,
      number_document_employee,
      base_saraly_employee,
      type_contract_employee,
      type_employee,
    } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ mj: "Empresa no encontrada", status: false });

    const is_company = req.user.type_dato === "company";
    const is_user_admin = req.user.role === "Super Admin";

    if (!is_user_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const new_employee = new Employee({
      name_employee,
      type_document_employee,
      number_document_employee,
      base_saraly_employee,
      type_contract_employee,
      stade_employee: "Inactivo",
      type_employee,
      company: company_id,
    });

    const save_employee = await new_employee.save();
    res.status(200).json({
      msj: "Empleado creado correctamente",
      status: true,
      save_employee,
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

export const update_employee = async (req, res) => {
  try {
    const { company_id, employee_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const updating = {
      name_employee: req.body.name_employee,
      type_document_employee: req.body.type_document_employee,
      number_document_employee: req.body.number_document_employee,
      base_saraly_employee: req.body.base_saraly_employee,
      type_contract_employee: req.body.type_contract_employee,
      stade_employee: req.body.stade_employee,
      type_employee: req.body.type_employee,
    };

    const company_data = await Employee.findOne({ _id: employee_id });
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    await Employee.updateOne({ _id: employee_id }, { $set: updating });
    res
      .status(200)
      .json({ msj: "Empleado actualizado correctamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_employee_company = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { company: company_id };
    const cant = await Employee.countDocuments(filter);

    const data = await Employee.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando empleados",
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

export const list_active_employee = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const company_data = await Company.findById(company_id).lean();
    if (!company_data)
      return res
        .status(403)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter_1 = {
      company: company_id,
      stade_employee: "Activo",
    };

    const cant = await Employee.countDocuments(filter_1);
    const data = await Employee.find(filter_1)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando empleados activos",
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

export const list_inactive_employee = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const company_data = await Company.findById(company_id).lean();
    if (!company_data)
      return res
        .status(403)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter_1 = {
      company: company_id,
      stade_employee: "Inactivo",
    };

    const cant = await Employee.countDocuments(filter_1);
    const data = await Employee.find(filter_1)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando empleados inactivos",
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

export const delete_employee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    let employee_data = await Employee.findById(employee_id);
    if (!employee_data)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_company && is_super_admin && req.user.id !== employee_data.company)
      return res
        .status(403)
        .json({
          msj: "No puedes acceder a esta funcion 'CTRL'",
          status: false,
        });

    await Employee.deleteOne({ _id: employee_id });

    res
      .status(200)
      .json({ msj: "Empleado eliminado exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
