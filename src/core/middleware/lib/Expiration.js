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

    if (!user.expired_available_plans) {
      req.user.day_available_plans = 0;
      return next();
    }

    const today = new Date();
    const expired = new Date(user.expired_available_plans);

    const diff = expired - today;
    const days_left = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days_left <= 0) {
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

    req.user.day_available_plans = days_left;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
