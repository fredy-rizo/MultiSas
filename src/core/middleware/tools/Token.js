import jwt from "jsonwebtoken";
import config from "../../../config.js";
import { Company } from "../../../modules/general/models/Company.js";
import { UserCompany } from "../../../modules/sublimacion/models/UserCompany.js";
import plan from "../json/plan.json" with { type: "json" };

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
  // console.log("authHeaderrrr", authHeader);
  const token = authHeader?.split(" ")[1];
  // console.log("token desde tokenAny middleware", token);
  // return;
  if (!token)
    return res.status(401).json({ msj: "Sin autorizacionS", status: false });

  try {
    const decoded = jwt.verify(token, config.SECRET);

    let company = await Company.findById(decoded._id);
    // console.log("company en token", company._id);
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

    let user_company = await UserCompany.findById(decoded._id);
    if (user_company) {
      req.user = {
        id: user_company.id,
        type_dato: "user_company",
        role: user_company.role_user_company,
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
    let data_user;

    if (req.user.type_dato === "company") {
      data_user = await Company.findById(req.user.id);

      if (!data_user)
        return res
          .status(404)
          .json({ msj: "Empresa no encontrada", status: false });

      if (!roles.includes(data_user.role_user))
        return res
          .status(403)
          .json({ msj: "No tienes permisos", status: false });
    }

    if (req.user.type_dato === "user_company") {
      data_user = await UserCompany.findById(req.user.id);

      if (!data_user)
        return res
          .status(404)
          .json({ msj: "Usuario de empresa no encontrado", status: false });

      if (!data_user.active)
        return res.status(403).json({ msj: "Usuario inactivo", status: false });

      if (!roles.includes(data_user.role_user_company))
        return res
          .status(403)
          .json({ msj: "No tienes permisos", status: false });
    }

    next();
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
