import { Permissions } from "../models/Permissions.js";
import { Company } from "../models/Company.js";
import { User } from "../models/User.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_permission = async (req, res) => {
  try {
    const { company_id, user_id } = req.params;
    const { permissions } = req.body;

    const [companyX, userX] = await Promise.all([
      Company.findById(company_id),
      User.findById(user_id),
    ]);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
    if (!userX)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    const exist_permission = await Permissions.findOne({
      company: company_id,
      user: user_id,
    });
    if (exist_permission)
      return res
        .status(400)
        .json({ msj: "El usuario ya tiene permisos asignados", status: false });

    const new_permission = new Permissions({
      company: {
        _id: companyX._id,
      },
      user: {
        _id: userX._id,
      },
      permissions,
    });

    const data_permission = await new_permission.save();
    res.status(200).json({
      msj: "Permisos asignados exitosamente",
      status: true,
      data_permission,
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

export const update_permission = async (req, res) => {
  try {
    const { permission_id } = req.params;
    const { permissions } = req.body;

    const permissionX = await Permissions.findById(permission_id);
    if (!permissionX)
      return res
        .status(404)
        .json({ msj: "Permisos no encontrados", status: false });

    if (!Array.isArray(permissions))
      return res
        .status(400)
        .json({ msj: "Permisos no enviados", status: false });

    const permission = await Permissions.findOneAndUpdate(
      {
        _id: permission_id,
      },
      {
        permissions,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      msj: "Permisos actualizados exitosamente",
      status: true,
      permission,
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

export const list_permission = async (req, res) => {
  try {
    const { company_id } = req.params;

    const companyX = await Company.findById(company_id);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { company_id: { _id: companyX._id } };
    const cant = await Permissions.countDocuments(filter);

    const data = await Permissions.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando...",
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

export const delete_permission = async (req, res) => {
  try {
    const { permission_id } = req.params;

    const permissionX = await Permissions.findById(permission_id);
    if (!permissionX)
      return res
        .status(404)
        .json({ msj: "Permiso no encontrado", status: false });

    const data_remove = await Permissions.deleteOne({ _id: permission_id });
    res
      .status(200)
      .json({
        msj: "Permiso eliminado exitosamente",
        status: true,
        data_remove,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json;
  }
};
