import {
  Company,
  encrypt_password,
  compare_password,
} from "../models/Company.js";
import config from "../../../config.js";
import jwt from "jsonwebtoken";
import { modulesByType } from "../../../core/middleware/tools/modules.js";
import {
  compare_password_user_company,
  encrypt_password_user_company,
  UserCompany,
} from "../../sublimacion/models/UserCompany.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const register_company = async (req, res) => {
  try {
    const { name_company, name_founder, nit_company, password, type_company } =
      req.body;

    if (!name_company || !name_founder || !nit_company || !password)
      return res.status(203).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    const modules = modulesByType[type_company];
    // if (!modules)
    //   return res
    //     .status(400)
    //     .json({ msj: "Tipo de empresa invalido", status: false });

    let data_nit_company = await Company.findOne({ nit_company });
    if (data_nit_company)
      return res.status(202).json({
        msj: "Esta empresa ya se encuentra registrada",
        status: false,
      });

    const data_password = await encrypt_password(password);
    const new_company = new Company({
      password: data_password,
      name_company,
      name_founder,
      nit_company,
      type_company, //! Enviarlo SIEMPRE, no enviarlo para Super Admin
      modules,
      active_account: [{ name: "Pendiente", value: "1" }],
    });

    const save_company = await new_company.save();
    res.status(200).json({
      msj: "Empresa registrada exitosamente",
      status: true,
      save_company,
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

export const login_company = async (req, res) => {
  try {
    const { nit_company, password } = req.body;

    if (!nit_company || !password)
      return res.status(203).json({
        msj: "Completa los campos para iniciar sesion",
        status: false,
      });

    let data_company = await Company.findOne({ nit_company });
    if (!data_company)
      return res.status(404).json({
        msj: "Nit/Rut no valido. Ingresa uno nuevamente",
        status: false,
      });

    const password_validate = await compare_password(
      password,
      data_company.password,
    );
    if (!password_validate)
      return res
        .status(203)
        .json({ msj: "Contraseña incorrecta", status: false });

    const token = jwt.sign(
      {
        _id: data_company._id,
        name_company: data_company.name_company,
        name_founder: data_company.name_founder,
        name_sellers: data_company.name_sellers,
        nit_company: data_company.nit_company,
        role_user: data_company.role_user,
        active_account: data_company.active_account,
        available_plans: data_company.available_plans,
        day_available_plans: data_company.day_available_plans,
        expired_available_plans: data_company.expired_available_plans,
      },
      config.SECRET,
      { expiresIn: "365d" },
    );

    const new_data_company = {
      _id: data_company._id,
      token,
    };

    await Company.updateOne({ _id: data_company._id }, new_data_company);
    res.status(200).json({
      msj: "Bienvenido!",
      status: true,
      token,
      user: {
        _id: data_company._id,
        name_company: data_company.name_company,
        name_founder: data_company.name_founder,
        name_sellers: data_company.name_sellers,
        nit_company: data_company.nit_company,
        role_user: data_company.role_user,
        active_account: data_company.active_account,
        available_plans: data_company.available_plans,
        day_available_plans: data_company.day_available_plans,
        expired_available_plans: data_company.expired_available_plans,
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

export const update_data_company = async (req, res) => {
  try {
    const { company_id } = req.params;
    const {
      // role_user,
      // day_available_plans,
      available_plans,
      type_available_plans,
      months_quantity,
    } = req.body;

    // if (req.user.role_user !== "Super Admin")
    //   return res.status(403).json({
    //     msj: "No tienes permisos para realizar esta funcion",
    //     status: false,
    //   });

    const company = await Company.findById(company_id);
    if (!company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    let expired_available_plans = null;

    const today = new Date();
    const expired_date = new Date(today);

    const day_available_plans = today.toLocaleDateString();

    if (type_available_plans === "Mensual") {
      const months = Number(months_quantity) || 1;
      expired_date.setMonth(expired_date.getMonth() + months);
      expired_available_plans = expired_date.toLocaleDateString();
    }

    if (type_available_plans === "Anual") {
      expired_date.setFullYear(expired_date.getFullYear() + 1);
      expired_available_plans = expired_date.toLocaleDateString();
    }

    await Company.updateOne(
      { _id: company._id },
      {
        $set: {
          // role_user,
          available_plans,
          type_available_plans,
          months_quantity,
          expired_available_plans,
          day_available_plans,
        },
      },
    );

    res.status(200).json({
      msj: "Datos actualizados correctamente",
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

export const create_user_company_by_admin = async (req, res) => {
  try {
    const { company_id } = req.params;
    const user_plan = req.user.available_plans;
    const {
      email_user_company,
      name_user_company,
      role_user_company,
      password_user_company,
    } = req.body;

    // if (req.user.role_user !== "Admin")
    //   return res.status(403).json({
    //     msj: "No tienes permisos para realizar esta funcion",
    //     status: false,
    //   });

    let data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const total_user_company = await UserCompany.findOne({
      "company._id": company_id,
    });

    if (user_plan === "Plan Basico" && total_user_company >= 1)
      return res.status(403).json({
        msj: "El plan basico solo permite 1 usuario por empresa",
        status: false,
      });

    if (
      !email_user_company ||
      !name_user_company ||
      !role_user_company ||
      !password_user_company
    )
      return res.status(403).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    const password_encypt_user_company = await encrypt_password_user_company(
      password_user_company,
    );

    const new_user_company = await UserCompany.create({
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
      email_user_company,
      name_user_company,
      role_user_company,
      password_user_company: password_encypt_user_company,
      nit_company_by_user: data_company.nit_company,
      active: false,
    });

    // await Company.updateOne(
    //   { _id: data_company._id },
    //   {
    //     $push: {
    //       user_company_sublimacion: {
    //         _id: new_user_company._id.toString(),
    //         email_user_company,
    //         name_user_company,
    //         role_user_company,
    //         password_encypt_user_company: password_encypt_user_company,
    //         active: false,
    //       },
    //     },
    //   },
    // );

    res.status(200).json({
      msj: `Perfil de ${role_user_company} creado exitosamente`,
      status: true,
      new_user_company,
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

export const login_user_by_company = async (req, res) => {
  try {
    const { nit_company_by_user, password_user_company } = req.body;

    if (!nit_company_by_user || !password_user_company)
      return res.status(403).json({
        msj: "Completa todos los campos para iniciar sesion",
        status: true,
      });

    // const data_company = await UserCompany.findOne({
    // nit_company: nit_company_by_user,
    // "user_company_sublimacion.email_user_company": email_user_company,
    //   "company.nit_company": nit_company_by_user,
    //   email_user_company,
    // });
    // if (!data_company)
    //   return res
    //     .status(404)
    //     .json({ msj: "Usuario de empresa no encontrado", status: false });

    const user_company = await UserCompany.findOne({
      "company.nit_company": nit_company_by_user,
    });
    if (!user_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    if (!user_company.active)
      return res
        .status(403)
        .json({ msj: "Empleado inactivo dentro de la empresa", status: false });

    const password_validate_user_company = await compare_password_user_company(
      password_user_company,
      user_company.password_user_company,
    );
    if (!password_validate_user_company)
      return res
        .status(203)
        .json({ msj: "Credenciales incorrectas", status: false });

    const token = jwt.sign(
      {
        _id: user_company._id,
        email_user_company: user_company.email_user_company,
        name_user_company: user_company.name_user_company,
        nit_company_by_user: user_company.nit_company_by_user,
        role_user_company: user_company.role_user_company,
        active: user_company.active,
      },
      config.SECRET,
      { expiresIn: "365d" },
    );

    const new_user_company = {
      _id: user_company._id,
      token,
    };

    await UserCompany.updateOne({ _id: user_company._id }, new_user_company);
    res.status(200).json({
      msj: "Iniciando sesion...",
      status: true,
      token,
      data: {
        company: {
          _id: user_company.company._id,
          name_company: user_company.company.name_company,
          name_founder: user_company.company.name_founder,
          nit_company: user_company.company.nit_company,
          available_plans: user_company.company.available_plans,
          type_available_plans: user_company.company.type_available_plans,
          months_quantity: user_company.company.months_quantity,
          expired_available_plans: user_company.company.expired_available_plans,
        },
        email_user_company: user_company.email_user_company,
        name_user_company: user_company.name_user_company,
        role_user_company: user_company.role_user_company,
        nit_company_by_user: user_company.nit_company_by_user,
        active: user_company.active,
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

export const active_account_by_company = async (req, res) => {
  try {
    const { user_company_id } = req.params;
    const { active } = req.body;

    let data_user_company = await UserCompany.findById(user_company_id);
    if (!data_user_company)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado en empresa", status: false });

    const result = await UserCompany.updateOne(
      { _id: user_company_id },
      { $set: { active } },
    );

    res
      .status(200)
      .json({ msj: "Cuenta activada correctamente", status: true, result });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const test_plan_axpiration = async (req, res) => {
  try {
    return res.json({
      status: true,
      day_lef: req.user.day_available_plans,
      user_id: req.user.id,
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

export const logout_company = async (req, res) => {
  try {
    const { nit_company } = req.body;

    let data_company = await Company.findOne({ nit_company });

    if (nit_company !== data_company.nit_company)
      return res
        .status(403)
        .json({ msj: "No puedes cerrar sesion", status: false });

    if (data_company) {
      await Company.updateOne(
        { _id: data_company._id },
        { $set: { token: "" } },
      );
      return res.status(200).json({ msj: "Cerrando sesion...", status: true });
    } else {
      return res
        .status(404)
        .json({ msj: "NIT de empresa no encontrado", status: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_user_by_company_active = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const cant = await UserCompany.find({
      "company._id": company_id,
      active: true,
    }).countDocuments();
    const data = await UserCompany.find({
      "company._id": company_id,
      active: true,
    })
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando usuarios activados...",
      status: true,
      data,
      pagination: {
        pags: req.params.pag,
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

export const list_user_by_company_not_active = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res.status(404).json({ msj: "Empresa no encontrada" });

    const cant = await UserCompany.find({
      "company._id": company_id,
      active: false,
    }).countDocuments();
    const data = await UserCompany.find({
      "company._id": company_id,
      active: false,
    })
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando usuarios no activados...",
      status: true,
      data,
      pagination: {
        pags: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
