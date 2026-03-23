import { generate_bill_number_pedido } from "../../../core/middleware/lib/BillNumber.js";
import { Company } from "../../general/models/Company.js";
import { UserCompany } from "../models/UserCompany.js";
import { Pedido } from "../models/Pedido.js";
import { Client } from "../models/Client.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_pedido = async (req, res) => {
  try {
    // const { company_id, client_id, user_company_id } = req.params;
    const { company_id, client_id } = req.params;
    const { description_pedido, type_pedido, quantity_pedido, price_pedido } =
      req.body;

    const companyX = await Company.findById(company_id);
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const clientX = await Client.findById(client_id);
    if (!clientX)
      return res
        .status(404)
        .json({ msj: "Cliente no encontrado", status: false });

    // const userCompanyX = await Company.findOne({
    //   "user_company_sublimacion._id": user_company_id,
    // });
    // if (!userCompanyX)
    //   return res
    //     .status(404)
    //     .json({ msj: "Usuario de empresa no encontrado", status: false });

    if (
      !description_pedido ||
      !type_pedido ||
      !quantity_pedido ||
      !price_pedido
    )
      return res.status(203).json({
        msj: "Completa todos los campos para continuar",
        status: false,
      });

    const bill_counter_pedido = await generate_bill_number_pedido(company_id);

    const new_pedido = new Pedido({
      bill_counter: bill_counter_pedido,
      date_pedido: new Date().toLocaleDateString(),
      hour_pedido: new Date().toLocaleTimeString(),
      description_pedido,
      type_pedido,
      quantity_pedido,
      price_pedido,
      state_pedido: "Pendiente",
      company: {
        _id: companyX._id,
        name_company: companyX.name_company,
        name_founder: companyX.name_founder,
        nit_company: companyX.nit_company,
        available_plans: companyX.available_plans,
        months_quantity: companyX.months_quantity,
        expired_available_plans: companyX.expired_available_plans,
      },
      client: {
        _id: clientX._id,
        document_type_client: clientX.document_type_client,
        number_document_client: clientX.number_document_client,
        name_client: clientX.name_client,
        email_client: clientX.email_client,
        phone_client: clientX.phone_client,
      },
    });

    // await Company.updateOne(
    //   { _id: company_id },
    //   {
    //     $push: {
    //       pedido_company_sublimacion: {
    //         _id: new_pedido._id.toString(),
    //         bill_counter: new_pedido.bill_counter,
    //         date_pedido: new_pedido.date_pedido,
    //         description_pedido: new_pedido.description_pedido,
    //         type_pedido: new_pedido.type_pedido,
    //         quantity_pedido: new_pedido.quantity_pedido,
    //         state_pedido: new_pedido.state_pedido,
    //       },
    //     },
    //   },
    // );

    const save_pedido = await new_pedido.save();

    res.status(200).json({
      msj: "Nuevo pedido registrado correctamente",
      status: true,
      save_pedido,
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

export const update_pedido_state = async (req, res) => {
  try {
    const { company_id, pedido_id } = req.params;
    const { state_pedido } = req.body;

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

    const [pedido_updated] = await Promise.all([
      Pedido.updateOne({ _id: pedido_id }, { $set: { state_pedido } }),
      // Company.updateOne(
      //   {
      //     _id: company_id,
      //     "pedido_company_sublimacion._id": pedido_id,
      //   },
      //   {
      //     $set: {
      //       "pedido_company_sublimacion.$.state_pedido": state_pedido,
      //     },
      //   },
      // ),
    ]);

    if (pedido_updated.matchedCount === 0)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    // if (company_pedido_updated.matchedCount === 0)
    //   return res
    //     .status(404)
    //     .json({ msj: "Pedido no encontrado en la compañia", status: false });

    res.status(200).json({
      msj: "Estado del pedido actualizado correctamente",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const list_pedidos = async (req, res) => {
  try {
    const { company_id, pedido_id, query } = req.params;
    const filter = Number(query);

    const companyX = await Company.findById(company_id).lean();
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const pedidoX = await Pedido.find({ _id: pedido_id }).lean();
    if (!pedidoX)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    let state = "";
    if (filter === 0) state = "Pendiente";
    if (filter === 1) state = "En produccion";
    if (filter === 2) state = "Entregado";

    let pedidos = pedidoX;

    if (state !== "") pedidos = pedidos.filter((p) => p.state_pedido === state);

    const count = pedidos.length;

    const data = pedidos
      .sort((a, b) => b._id.localeCompare(a._id))
      .slice(req.body.skippag, req.body.skippag + req.body.limit);

    res.status(200).json({
      msj: "Cargando informacion de pedidos",
      status: true,
      data,
      pagination: {
        pag: req.body.pag,
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

export const list_pedido = async (req, res) => {
  try {
    const { company_id, pedido_id } = req.params;

    const companyX = await Company.findOne(
      { _id: company_id },
      // { pedido_company_sublimacion },
    );
    if (!companyX)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const pedidoX = await Pedido.findById(pedido_id);
    if (!pedidoX)
      return res
        .status(404)
        .json({ msj: "Pedido no encontrado", status: false });

    res
      .status(200)
      .json({ msj: "Cargando informacion de pedido", status: true, pedidoX });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
