import { Pay } from "../models/Pay.js";
import { Roster } from "../models/Roster.js";
import { Employee } from "../models/Employee.js";
import { Company } from "../../general/models/Company.js";
import { PayrollConcept } from "../models/PayrollConcept.js";
import { ConceptPayroll } from "../models/ConceptPayroll.js";
import { DetailedPayroll } from "../models/DetailedPayroll.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const crear_nomina = async (req, res) => {
  try {
    const { company_id, employee_id } = req.params;
    const { start_period, end_period } = req.body;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_company && is_super_admin && req.user.id !== company_id)
      return res.status(403).json({
        msj: "No puedes acceder a esta funcion 'CTRL'",
        status: false,
      });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const employee_data = await Employee.findById(employee_id);
    if (!employee_data)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    const new_nomina = new Roster({
      start_period,
      end_period,
      company: company_id,
      employee: employee_id,
      stade: "Draft",
    });

    const resp_nomina = await new_nomina.save();
    res
      .status(200)
      .json({ msj: "Nomina creada exitosamente", status: true, resp_nomina });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const calcular_nomina = async (req, res) => {
  try {
    const { company_id, nomina_id, employee_id } = req.params;

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const nomida_data = await Roster.findById(nomina_id);
    if (!nomida_data)
      return res
        .status(404)
        .json({ msj: "Nomina no encontrada", status: false });

    const employee_data = await Employee.findById(employee_id);
    if (!employee_data)
      return res
        .status(404)
        .json({ msj: "Empleado no encontrado", status: false });

    const employee_resp = await Employee.find({ stade_employee: "Activo" });

    for (const emp of employee_resp) {
      const salario = emp.base_saraly_employee;
      const salud = salario * 0.04;
      const pension = salario * 0.04;
      const auxilio = salario <= 2 * 1750000 ? 2000000 : 0;

      const accrued = salario + auxilio;
      const deduction = salario + pension;
      const net = accrued - deduction;

      const detalle = await DetailedPayroll.create([
        {
          nomina: nomina_id,
          employee: emp._id,
          base_saraly_employee: salario,
          days_worked: 30,
          accrued,
          deduction,
          net,
        },
      ]);

      const detalle_id = detalle[0]._id;
      await PayrollConcept.insertMany([
        {
          nomina_detalle_id: detalle_id,
          name_concept: "salario",
          type_concept: "devengado",
          valor: salario,
        },
        {
          nomina_detalle_id: detalle_id,
          name_concept: "auxilio_transporte",
          type_concept: "devengado",
          valor: auxilio,
        },
        {
          nomina_detalle_id: detalle_id,
          name_concept: "salud",
          type_concept: "deduccion",
          valor: salud,
        },
        {
          nomina_detalle_id: detalle_id,
          name_concept: "pension",
          type_concept: "deduccion",
          valor: pension,
        },
      ]);
    }

    await Roster.findByIdAndUpdate(nomina_id, { stade: "Calculada" });
    res
      .status(200)
      .json({ msj: "Nomina calculada exitosamente", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const recalcular_nomina = async (req, res) => {
  try {
    const { company_id, nomina_id } = req.params;

    const is_company = req.user.type_dato === "company";
    const is_super_admin = req.user.role === "Super Admin";

    if (!is_super_admin && is_company && req.user.id !== company_id)
      return res
        .status(403)
        .json({ msj: "No puedes acceder a esta funcion 'CTRL", status: false });

    const company_data = await Company.findById(company_id);
    if (!company_data)
      return res
        .status(404)
        .json({ msj: "Empresa no encontrada", status: false });

    const nomina_data = await Roster.findById(nomina_id);
    if (!nomina_data)
      return res
        .status(404)
        .json({ msj: "Nomina no encontrada", status: false });

    const detalles = await DetailedPayroll.find({ nomina: nomina_id });
    const detalles_id = detalles.map((d) => d._id);

    await Promise.all([
      PayrollConcept.deleteMany({ nomina_detalle_id: { $in: detalles_id } }),
      DetailedPayroll.deleteMany({ nomina: nomina_id }),
      Roster.findByIdAndUpdate(nomina_id, { stade: "draft" }),
    ]);

    req.params.nomina_id = nomina_id;
    return calcular_nomina(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
