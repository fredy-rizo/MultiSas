import { AccountPlan } from "../../../modules/cuenta_contable/models/AccountPlans.js";
import { Company } from "../../general/models/Company.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_account_plan = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { code_plan, account_plan, type_account } = req.body;

    if (!code_plan || !account_plan || !type_account)
      return res
        .status(403)
        .json({ msj: "Completea todos los campos", status: false });

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const new_account_plan = await AccountPlan.create({
      company: {
        _id: data_company._id,
        name_company: data_company.name_company,
        name_founder: data_company.name_founder,
        nit_company: data_company.nit_company,
      },
      code_plan,
      account_plan,
      type_account,
    });

    // const save_account_plan = await new_account_plan.save();

    await Company.updateOne(
      { _id: data_company._id },
      {
        $push: {
          account_plan_company: {
            _id: new_account_plan._id.toString(),
            code_plan,
            account_plan,
            type_account,
          },
        },
      },
    );

    res.status(200).json({
      msj: "Plan de cuenta creado correctamente",
      status: true,
      new_account_plan,
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

export const list_account_plan = async (req, res) => {
  try {
    const { company_id } = req.params;

    const data_company = await Company.findById(company_id);
    if (!data_company)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const filter = { "company._id": company_id };
    const cant = await AccountPlan.countDocuments(filter);

    const data = await AccountPlan.find(filter)
      .skip(req.body.skippag)
      .limit(req.body.limit)
      .sort({ _id: -1 });

    res.status(200).json({
      msj: "Cargando plan de cuentas...",
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
