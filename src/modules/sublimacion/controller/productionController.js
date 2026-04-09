import { generate_bill_counter_production } from "../../../core/middleware/lib/BillNumber.js";
import { Production } from "../models/Production.js";
import { Company } from "../../general/models/Company.js";
import { Pedido } from "../models/Pedido.js";
import { UserCompany } from "../models/UserCompany.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_production = async (req, res) => {
  try {
    const { company_id, pedido_id } = req.params;
    const {
      responsible_production,
      delivery_date_production,
      priority_production,
    } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const companyX = await Company.findById(company_id);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const pedidoX = await Pedido.findById(pedido_id);
    if (!pedidoX)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    const bill_counter_production =
      await generate_bill_counter_production(company_id);

    const new_production = new Production({
      bill_counter: bill_counter_production,
      price_production: pedidoX.price_pedido,
      type_production: pedidoX.type_pedido,
      quantity_production: pedidoX.quantity_pedido,
      delivery_date_production,
      responsible_production,
      priority_production,
      company: {
        _id: pedidoX.company._id,
        name_company: pedidoX.company.name_company,
        name_founder: pedidoX.company.name_founder,
        nit_company: pedidoX.company.nit_company,
      },
      client: {
        _id: pedidoX.client._id,
        name_client: pedidoX.client.name_client,
        phone_client: pedidoX.client.phone_client,
      },
      pedido: {
        _id: pedidoX._id,
        bill_counter: pedidoX.bill_counter,
        date_pedido: pedidoX.date_pedido,
        hour_date: pedidoX.hour_pedido,
        description_pedido: pedidoX.description_pedido,
        type_pedido: pedidoX.type_pedido,
        quantity_pedido: pedidoX.quantity_pedido,
        price_pedido: pedidoX.price_pedido,
        state_pedido: pedidoX.state_pedido,
      },
    });

    // await Company.updateOne(
    //   { _id: company_id },
    //   {
    //     $push: {
    //       production_company_sublimacion: {
    //         _id: new_production._id,
    //         bill_counter: new_production.bill_counter,
    //         price_production: new_production.price_production,
    //         type_production: new_production.type_production,
    //         quantity_production: new_production.quantity_production,
    //         delivery_date_production: new_production.delivery_date_production,
    //         responsible_production: new_production.responsible_production,
    //         priority_production: new_production.priority_production,
    //       },
    //     },
    //   },
    // );

    const save_production = await new_production.save();

    res.status(200).json({
      msj: "Pedido pasado a produccion",
      status: true,
      save_production,
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

export const assigned_user_production = async (req, res) => {
  try {
    const { company_id, production_id } = req.params;
    const { user_company_id } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const [company_data, production_data] = await Promise.all([
      Company.findById(company_id),
      Production.findById(production_id),
    ]);

    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });
    if (!production_data)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    const user_company_data = await UserCompany.findById(user_company_id);
    if (!user_company_data)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    await Production.updateOne(
      { _id: production_id },
      {
        $set: {
          userCompany: {
            _id: user_company_data._id.toString(),
            name_user_company: user_company_data.name_user_company,
          },
        },
      },
    );

    res
      .status(200)
      .json({ msj: "Empleado asignado a produccion", statis: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const finalized_production = async (req, res) => {
  try {
    const { company_id, pedido_id, production_id } = req.params;
    const { finalized_production } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const companyX = await Company.findById(company_id);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const pedidoX = await Pedido.findById(pedido_id);
    if (!pedidoX)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    const productionX = await Production.findById(production_id);
    if (!productionX)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    if (finalized_production === "Finalizado") {
      await Production.findByIdAndUpdate(production_id, {
        $set: {
          finalized_production: "Finalizado",
          production_finalized_date: new Date().toLocaleDateString(),
        },
      });

      // await Company.updateOne(
      //   {
      //     _id: company_id,
      //     "production_company_sublimacion._id": production_id,
      //   },
      //   {
      //     $set: {
      //       "production_company_sublimacion.$.finalized_production":
      //         "Finalizado",
      //       "production_company_sublimacion.$.production_finalized_date":
      //         new Date().toLocaleDateString(),
      //     },
      //   },
      // );
    }

    res.status(200).json({
      msj: "Produccion de producto finalizada. El trabajo ha sido completado exitosamente",
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

export const list_productions_company = async (req, res) => {
  try {
    const { company_id, production_id, query } = req.params;
    const filter = Number(query);

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const companyX = await Company.findById(company_id).lean();
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrad", status: false });

    const produccionX = await Production.find({
      _id: production_id,
    }).lean();
    if (!produccionX)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    let priority;
    if (filter === 0) priority = "Baja";
    if (filter === 1) priority = "Media";
    if (filter === 2) priority = "Alta";
    if (filter === 3) priority = "Urgente";

    let produccions = produccionX;
    // console.log("productions", produccions);

    if (priority !== "")
      produccions = produccions.filter(
        (p) => p.priority_production === priority,
      );

    const count = produccions.length;

    const data = produccions
      .sort((a, b) => b._id.localCompare(a._id))
      .slice(req.body.skippag, req.body.skippag + req.body.limit);

    res.status(200).json({
      msj: "Cargandos informacion de producciones",
      statu: true,
      data,
      pagination: {
        pag: req.params.pag,
        perpage: req.body.limit,
        pags: Math.ceil(count / req.body.limit),
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

export const list_productions_company_id = async (req, res) => {
  try {
    const { company_id, production_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_user_company = req.user.type_dato === "user_company";
    const is_super_admin = req.user.role === "Super Admin";

    if (
      !is_super_admin &&
      is_company &&
      is_user_company &&
      req.user.id !== company_id
    )
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const companyX = await Company.findOne({ _id: company_id });
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const productionX = await Production.findById(production_id);
    if (!productionX)
      return res
        .status(404)
        .json({ msj: "Produccion no encontrada", status: false });

    res.status(200).json({
      msj: "Cargando informacion de produccion",
      status: true,
      productionX,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
