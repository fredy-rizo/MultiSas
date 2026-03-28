import { Product } from "../models/Product.js";
import { Delivery } from "../models/Delivery.js";
import { Company } from "../../general/models/Company.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const create_delivery = async (req, res) => {
  try {
    const { company_id, product_id } = req.params;
    const {
      name_client_delivery,
      phone_client_delivery,
      address_client_delivery,
      references_client_delivery,
    } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const product_data = await Product.findById(product_id);
    if (!product_data)
      return res
        .status(404)
        .json({ msj: "Producto no encontrado", status: false });

    if (
      !name_client_delivery ||
      !phone_client_delivery ||
      !address_client_delivery
    )
      return res
        .status(403)
        .json({ msj: "Completa los campos", status: false });

    const new_delivery = new Delivery({
      name_client_delivery,
      phone_client_delivery,
      address_client_delivery,
      references_client_delivery,
      product: {
        _id: product_data._id.toString(),
        name_product: product_data.name_product,
        price_product: product_data.price_product,
        extras: product_data.extras,
      },
    });

    const save_delivery = await new_delivery.save();
    res.status(200).json({
      msj: "Nuevo domicilio creado exitosamente",
      status: true,
      save_delivery,
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

export const update_status_delivery = async (req, res) => {
  try {
    const { company_id, delivery_id } = req.params;
    const { status_delivery } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const delivery_data = await Delivery.findById(delivery_id);
    if (!delivery_data)
      return res
        .status(404)
        .json({ msj: "Domicilio no encontrado", status: false });

    await Delivery.updateOne(
      { _id: delivery_id },
      { $set: { status_delivery } },
    );

    res.status(200).json({
      msj: "Estado de domicilio actualizado exitosamente",
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

export const update_payment_method_delivery = async (req, res) => {
  try {
    const { company_id, delivery_id } = req.params;
    const { payment_method, paid } = req.body;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const delivery_data = await Delivery.findById(delivery_id);
    if (!delivery_data)
      return res
        .status(404)
        .json({ msj: "Domicilio no encontrado", status: false });

    await Delivery.updateOne(
      { _id: delivery_id },
      { $set: { payment_method, paid } },
    );

    res.status(200).json({
      msj: "Domicilio pagado exitosamente",
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

export const list_deliverys = async (req, res) => {
  try {
    const { company_id, delivery_id, query } = req.params;
    const filter = Number(query);

    const company_data = await Company.findById(company_id).lean();
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const delivery_data = await Delivery.find({ _id: delivery_id }).lean();
    if (!delivery_data)
      return res
        .status(404)
        .json({ msj: "Domicilio no encontrado", status: false });

    let status = "";
    if (filter === 0) status = "En camino";
    if (filter === 1) status = "Entragado";
    if (filter === 2) status = "No entregado";

    let deliverys = delivery_data;

    if (status !== "")
      deliverys = deliverys.filter((p) => p.status_delivery === status);

    const cant = deliverys.length;
    const data = deliverys
      .sort((a, b) => b._id.localeCompare(a._id))
      .slice(req.body.skippag, req.body.skippag + req.body.limit);

    res.status(200).json({
      msj: "Cargando informacion de domicilios",
      status: true,
      data,
      pagination: {
        pag: req.body.pag,
        perpage: req.body.limit,
        pags: Math.ceil(cant / req.body.limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
