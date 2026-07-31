import {
  Company,
  encrypt_password,
  compare_password,
} from "../models/Company.js";
import config from "../../../config.js";
import jwt from "jsonwebtoken";
// import { modulesByType } from "../../../core/middleware/tools/modules.js";
// import {
//   compare_password_user_company,
//   encrypt_password_user_company,
//   UserCompany,
// } from "../../sublimacion/models/U.js";
import { companyConfig } from "../../../core/middleware/lib/companyConfig.js";
import {
  User,
  compare_password_user_company,
  encrypt_password_user_company,
} from "../models/User.js";

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

    let counters = {};
    let role_user = "Super Admin";

    if (type_company) {
      const config = companyConfig[type_company];

      if (!config)
        return res
          .status(400)
          .json({ msj: "Tipo de empresa invalida", status: false });

      counters = config.counters;
    } else {
      role_user = "Super Admin";
    }

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
      // modules,
      counters,
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
    const { available_plans, type_available_plans, months_quantity } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin || !is_company)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

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
          role_user: "Admin",
          active_account: [{ name: "Activo", value: "2" }],
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
      user_name_company,
      user_email_company,
      user_password_company,
      nit_company_by_user,
      user_role_company,
    } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const total_user_company = await User.findOne({
      "company._id": company_id,
    });

    if (user_plan === "Plan Basico" && total_user_company >= 1)
      return res.status(403).json({
        msj: "El plan basico solo permite 1 usuario por empresa",
        status: false,
      });

    if (
      !user_name_company ||
      !user_email_company ||
      !user_role_company ||
      !user_password_company ||
      !nit_company_by_user
    )
      return res.status(403).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    const password_encypt_user_company = await encrypt_password_user_company(
      user_password_company,
    );

    const new_user_company = new User({
      user_name_company,
      user_email_company,
      user_role_company,
      user_password_company: password_encypt_user_company,
      nit_company_by_user: data_company.nit_company,
      active: false,
      company: {
        _id: data_company._id,
        name_company: data_company.name_company,
        name_founder: data_company.name_founder,
        nit_company: data_company.nit_company,
      },
    });

    const data_user_company = await new_user_company.save();
    res.status(200).json({
      msj: `Perfil de ${user_role_company} creado exitosamente para ${data_company.name_company}`,
      status: true,
      data_user_company,
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

    const data_user_company = await User.findById(user_company_id);
    if (!data_user_company)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      req.user.id !== data_user_company.company
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const result = await User.updateOne(
      { _id: user_company_id },
      { $set: { active } },
    );

    res
      .status(200)
      .json({ msj: "Cuenta activada exitosamente", status: true, result });
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
    const { nit_company_by_user, user_password_company } = req.body;

    if (!nit_company_by_user || !user_password_company)
      return res.status(403).json({
        msj: "Completa todos los campos para iniciar sesion",
        status: true,
      });

    const user_company = await User.findOne({
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
      user_password_company,
      user_company.user_password_company,
    );
    if (!password_validate_user_company)
      return res
        .status(203)
        .json({ msj: "Credenciales incorrectas", status: false });

    const token = jwt.sign(
      {
        _id: user_company._id,
        user_name_company: user_company.user_name_company,
        user_email_company: user_company.user_email_company,
        nit_company_by_user: user_company.nit_company_by_user,
        user_role_company: user_company.user_role_company,
        active: user_company.active,
      },
      config.SECRET,
      { expiresIn: "365d" },
    );

    const new_user_company = {
      _id: user_company._id,
      token,
    };

    await User.updateOne({ _id: user_company._id }, new_user_company);
    res.status(200).json({
      msj: "Iniciando sesion...",
      status: true,
      token,
      data: {
        company: user_company.company,
        user_name_company: user_company.user_name_company,
        user_email_company: user_company.user_email_company,
        nit_company_by_user: user_company.nit_company_by_user,
        user_role_company: user_company.user_role_company,
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

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = {
      company_id: company_id,
      active: true,
    };

    const cant = await User.find(filter).countDocuments();
    const data = await User.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando usuarios activados...",
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

export const list_user_by_company_not_active = async (req, res) => {
  try {
    const { company_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res.status(404).json({ msj: "Empresa no encontrada" });

    const filter = {
      company_id: company_id,
      active: false,
    };

    const cant = await User.find(filter).countDocuments();
    const data = await User.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando usuarios no activados...",
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

// ------------------------ No en uso
export const calcular_nomina = async (req, res) => {
  try {
    const { company_id, nomina_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data) {
      return res.status(404).json({
        msj: "Empresa no encontrada",
        status: false,
      });
    }

    const nomina_data = await Roster.findById(nomina_id);
    if (!nomina_data) {
      return res.status(404).json({
        msj: "Nomina no encontrada",
        status: false,
      });
    }

    const empleados = await Employee.find({
      stade_employee: "Activo",
      company: company_id,
    });

    if (!empleados.length) {
      return res.status(404).json({
        msj: "No hay empleados activos",
        status: false,
      });
    }

    for (const emp of empleados) {
      const salario = emp.base_saraly_employee;

      const salud = salario * 0.04;
      const pension = salario * 0.04;

      const auxilio = salario <= 2 * 1750000 ? 200000 : 0;

      const accrued = salario + auxilio;
      const deduction = salud + pension;
      const net = accrued - deduction;

      const detalle = await DetailedPayroll.create({
        nomina: nomina_id,
        employee: emp._id,
        base_saraly_employee: salario,
        days_worked: 30,
        accrued,
        deduction,
        net,
      });

      await PayrollConcept.insertMany([
        {
          nomina_detalle_id: detalle._id,
          name_concept: "salario",
          type_concept: "devengado",
          valor: salario,
        },
        {
          nomina_detalle_id: detalle._id,
          name_concept: "auxilio_transporte",
          type_concept: "devengado",
          valor: auxilio,
        },
        {
          nomina_detalle_id: detalle._id,
          name_concept: "salud",
          type_concept: "deduccion",
          valor: salud,
        },
        {
          nomina_detalle_id: detalle._id,
          name_concept: "pension",
          type_concept: "deduccion",
          valor: pension,
        },
      ]);
    }

    await Roster.findByIdAndUpdate(nomina_id, {
      stade: "Calculada",
    });

    return res.status(200).json({
      msj: "Nomina calculada exitosamente",
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const recalcular_nomina = async (req, res) => {
  try {
    const { company_id, nomina_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id) {
      return res.status(403).json({
        msj: "No puedes acceder a esta función",
        status: false,
      });
    }

    const company_data = await Company.findById(company_id);
    if (!company_data) {
      return res.status(404).json({
        msj: "Empresa no encontrada",
        status: false,
      });
    }

    const nomina_data = await Roster.findById(nomina_id);
    if (!nomina_data) {
      return res.status(404).json({
        msj: "Nomina no encontrada",
        status: false,
      });
    }

    const detalles = await DetailedPayroll.find({
      nomina: nomina_id,
    });

    const detalles_id = detalles.map((item) => item._id);

    await Promise.all([
      PayrollConcept.deleteMany({
        nomina_detalle_id: { $in: detalles_id },
      }),

      DetailedPayroll.deleteMany({
        nomina: nomina_id,
      }),

      Roster.findByIdAndUpdate(nomina_id, {
        stade: "draft",
      }),
    ]);

    return calcular_nomina(req, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
