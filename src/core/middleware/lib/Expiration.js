import { Company } from "../../../modules/general/models/Company.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const check_plan_expiration = async (req, res, next) => {
  try {
    const user = await Company.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ msj: "Usuario no encontrado", status: false });

    const raw = user.expired_available_plans;

    if (!raw) {
      req.user.available_plans = "";
      return next();
    }

    const parts = raw.split("/");
    if (parts.length !== 3) {
      req.user.day_available_plans = "";
      return next();
    }

    let [day, month, year] = parts;

    day = Number(day);
    month = Number(month);
    year = year.length === 2 ? Number("20" + year) : Number(year);

    const expired = new Date(year, month - 1, day);

    if (
      isNaN(expired.getTime()) ||
      expired.getDate() !== day ||
      expired.getMonth() !== month - 1 ||
      expired.getFullYear() !== year
    ) {
      req.user.day_available_plans = "";
      return next();
    }

    const today = new Date();
    const diff = expired - today;
    const days_lef = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days_lef <= 0) {
      await Company.updateOne(
        { _id: user._id },
        {
          $set: {
            available_plans: "Sin Plan",
            type_available_plans: "Vacio",
            months_quantity: 0,
            day_available_plans: "",
            expired_available_plans: "",
          },
        },
      );

      req.user.day_available_plans = "";
      return next();
    }

    req.user.day_available_plans = days_lef;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
