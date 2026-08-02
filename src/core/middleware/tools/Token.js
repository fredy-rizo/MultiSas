import jwt from "jsonwebtoken";
import config from "../../../config.js";
import { Company } from "../../../modules/general/models/Company.js";
// import { UserCompany } from "../../../modules/sublimacion/models/UserCompany.js";
import { User } from "../../../modules/general/models/User.js";
import plan from "../json/plan.json" with { type: "json" };
import { Permissions } from "../../../modules/general/models/Permissions.js";
import mongoose, { mongo } from "mongoose";

export const Token = async (req, res, next) => {
  const authHeader = req.headers["token-access"];
  const token = authHeader?.split(" ")[1];
  // console.log("Token desde middleware", token);

  if (!token)
    return res.status(401).json({ msj: "Sin autorizacion", status: false });

  jwt.verify(token, config.SECRET, async (err, user) => {
    if (err) {
      if (err.message === "jwt expired")
        return res
          .status(403)
          .json({ msj: "Sesion finalizada", status: false });
      return res
        .status(403)
        .json({ msj: `${err.message}. Rechazo en la conexion`, status: false });
    }

    let data_user = await Company.findById(user._id);
    if (!data_user)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    req.user = {
      id: data_user.id,
      name_company: data_user.name_company,
      name_founder: data_user.name_founder,
      name_sellers: data_user.name_sellers,
      nit_company: data_user.nit_company,
      role_user: data_user.role_user,
      active_account: data_user.active_account,
      available_plans: data_user.available_plans,
      day_available_plans: data_user.day_available_plans,
      expired_available_plans: data_user.expired_available_plans,
    };
    next();
    return;
  });
};

export const TokenUserCompany = async (req, res, next) => {
  const authHeader = req.headers["token-access"];
  const token = authHeader?.split(" ")[1];

  if (!token)
    return res.status(401).json({ msj: "Sin autorizacion", status: false });

  jwt.verify(token, config.SECRET, async (err, user) => {
    if (err) {
      if (err.message === "jwt expired")
        return res
          .status(403)
          .json({ msj: "Sesion finalizada", status: false });
      return res
        .status(403)
        .json({ msj: `${err.message}. Rechazo en la conexion`, status: false });
    }

    let data_user = await UserCompany.findById(user._id);
    if (!data_user)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    req.user = {
      id: data_user.id,
      email_user_company: data_user.email_user_company,
      name_user_company: data_user.name_user_company,
      nit_company_by_user: data_user.nit_company_by_user,
      role_user_company: data_user.role_user_company,
      active: data_user.active,
    };
    next();
    return;
  });
};

export const TokenAny = async (req, res, next) => {
  const authHeader = req.headers["token-access"];
  const token = authHeader?.split(" ")[1];
  if (!token)
    return res.status(401).json({ msj: "Sin autorizacionS", status: false });
  try {
    const decoded = jwt.verify(token, config.SECRET);

    const company = await Company.findById(decoded._id);
    if (company) {
      req.user = {
        id: company.id,
        type_dato: "company",
        role: company.role_user,
        plan: company.available_plans,
        active: company.active_account,
        data: company,
      };
      return next();
    }

    const user_company = await User.findById(decoded._id);
    if (user_company) {
      req.user = {
        id: user_company.id,
        type_dato: "user_company",
        role: user_company.user_role_company,
        active: user_company.active,
        data: user_company,
      };
      return next();
    }

    return res
      .status(404)
      .json({ msj: "Usuario no encontrado", status: false });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const TokenAuthorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (req.user.type_dato === "company") {
        const company = await Company.findById(req.user.id);

        if (!company)
          return res
            .status(404)
            .json({ msj: "Empresa no encontrada", status: false });

        if (!company.active_account)
          return res
            .status(403)
            .json({ msj: "Empresa inactiva", status: false });

        if (!roles.includes(company.role_user))
          return res
            .status(403)
            .json({ msj: "No tienes permisos", status: false });

        return next();
      }

      if (req.user.type_dato === "user_company") {
        const user = await User.findById(req.user.id);

        if (!user)
          return res
            .status(404)
            .json({ msj: "Usuario de empresa no encontrado", status: false });

        if (!user.active)
          return res
            .status(403)
            .json({ msj: "Usuario inactivo", status: false });

        return next();
      }

      return res
        .status(403)
        .json({ msj: "Tipo de usuario no valido", status: false });
    } catch (err) {
      res
        .status(500)
        .json({ msj: "Error al validar autorizacion", status: false, err });
    }
  };
};

export const TokenPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === "Super Admin") return next();

      if (req.user.type_dato === "company") return next();

      const permission_user = await Permissions.findOne({
        "company._id": new mongoose.Types.ObjectId(req.params.company_id),
        "user._id": new mongoose.Types.ObjectId(req.user.id),
      });

      if (!permission_user)
        return res
          .status(403)
          .json({ msj: "No tienes permisos", status: false });

      if (!permission_user.permissions.includes(permissions))
        return res
          .status(403)
          .json({ msj: "No tienes permisos", status: false });

      next();
    } catch (err) {
      res
        .status(500)
        .json({ msj: "Error al validar permisos", status: false, err });
    }
  };
};

export const TokenValidationPlan = (feature) => {
  return (req, res, next) => {
    const userPlan = req.user.available_plans;
    const allowedPlans = plan.features[feature];

    if (!allowedPlans || !allowedPlans.includes(userPlan))
      return res
        .status(403)
        .json({ msj: "Tu plan no permite usar esta funcion", status: false });

    next();
  };
};
