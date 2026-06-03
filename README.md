Comando para subir a git

1. git status
2. git add .
3. git commit -m ""
4. git push origin main

---

// --------------------------
// ------------------------

---

Empleado
id
nombre
documento
salario_base
tipo_contrato (fijo, indefinido, prestación)
estado

---

Nomina (cabecera por periodo)
id
periodo_inicio
periodo_fin
estado (draft, calculada, pagada)

---

NominaDetalle
id
nomina_id
empleado_id
salario_base
dias_trabajados
devengado
deducciones
neto

---

ConceptoNomina
id
nombre (salario, auxilio, horas extra, salud, pensión)
tipo (devengado | deduccion)
formula (opcional)

---

NominaConcepto
nomina_detalle_id
concepto_id
valor

---

const mongoose = require('mongoose');
const Nomina = require('../models/Nomina');
const NominaDetalle = require('../models/NominaDetalle');
const NominaConcepto = require('../models/NominaConcepto');
const Empleado = require('../models/Empleado');
const Pago = require('../models/Pago');

// 1. Crear nómina (cabecera)
exports.crearNomina = async (req, res) => {
try {
const { periodo_inicio, periodo_fin, empresa_id } = req.body;

    const nomina = await Nomina.create({
      periodo_inicio,
      periodo_fin,
      empresa_id,
      estado: 'draft'
    });

    res.json(nomina);

} catch (err) {
res.status(500).json({ error: err.message });
}
};

// 2. Calcular nómina completa
exports.calcularNomina = async (req, res) => {
const session = await mongoose.startSession();
session.startTransaction();

try {
const { nomina_id } = req.params;

    const empleados = await Empleado.find({ estado: 'activo' });

    for (const emp of empleados) {
      const salario = emp.salario_base;

      // cálculos base Colombia (simplificado)
      const salud = salario * 0.04;
      const pension = salario * 0.04;
      const auxilio = salario <= 2 * 1300000 ? 162000 : 0; // ejemplo

      const devengado = salario + auxilio;
      const deducciones = salud + pension;
      const neto = devengado - deducciones;

      const detalle = await NominaDetalle.create([{
        nomina_id,
        empleado_id: emp._id,
        salario_base: salario,
        dias_trabajados: 30,
        devengado,
        deducciones,
        neto
      }], { session });

      const detalleId = detalle[0]._id;

      await NominaConcepto.insertMany([
        { nomina_detalle_id: detalleId, nombre: 'salario', tipo: 'devengado', valor: salario },
        { nomina_detalle_id: detalleId, nombre: 'auxilio_transporte', tipo: 'devengado', valor: auxilio },
        { nomina_detalle_id: detalleId, nombre: 'salud', tipo: 'deduccion', valor: salud },
        { nomina_detalle_id: detalleId, nombre: 'pension', tipo: 'deduccion', valor: pension }
      ], { session });
    }

    await Nomina.findByIdAndUpdate(nomina_id, { estado: 'calculada' }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Nómina calculada' });

} catch (err) {
await session.abortTransaction();
session.endSession();
res.status(500).json({ error: err.message });
}
};

// 3. Recalcular nómina (borra y vuelve a calcular)
exports.recalcularNomina = async (req, res) => {
const session = await mongoose.startSession();
session.startTransaction();

try {
const { nomina_id } = req.params;

    const detalles = await NominaDetalle.find({ nomina_id });

    const detalleIds = detalles.map(d => d._id);

    await NominaConcepto.deleteMany({ nomina_detalle_id: { $in: detalleIds } }, { session });
    await NominaDetalle.deleteMany({ nomina_id }, { session });

    await Nomina.findByIdAndUpdate(nomina_id, { estado: 'draft' }, { session });

    await session.commitTransaction();
    session.endSession();

    // volver a calcular
    req.params.nomina_id = nomina_id;
    return exports.calcularNomina(req, res);

} catch (err) {
await session.abortTransaction();
session.endSession();
res.status(500).json({ error: err.message });
}
};

// 4. Obtener nómina completa
exports.getNomina = async (req, res) => {
try {
const { nomina_id } = req.params;

    const nomina = await Nomina.findById(nomina_id).lean();

    const detalles = await NominaDetalle.find({ nomina_id }).lean();

    const detalleIds = detalles.map(d => d._id);

    const conceptos = await NominaConcepto.find({
      nomina_detalle_id: { $in: detalleIds }
    }).lean();

    res.json({ nomina, detalles, conceptos });

} catch (err) {
res.status(500).json({ error: err.message });
}
};

// 5. Pagar nómina
exports.pagarNomina = async (req, res) => {
const session = await mongoose.startSession();
session.startTransaction();

try {
const { nomina_id } = req.params;

    const detalles = await NominaDetalle.find({ nomina_id });

    for (const det of detalles) {
      await Pago.create([{
        tercero_id: det.empleado_id,
        tipo: 'nomina',
        monto: det.neto,
        metodo_pago: 'transferencia',
        fecha: new Date()
      }], { session });
    }

    await Nomina.findByIdAndUpdate(nomina_id, {
      estado: 'pagada',
      fecha_pago: new Date()
    }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'Nómina pagada' });

} catch (err) {
await session.abortTransaction();
session.endSession();
res.status(500).json({ error: err.message });
}
};

// 6. Liquidar empleado (retiro)
exports.liquidarEmpleado = async (req, res) => {
try {
const { empleado_id } = req.params;

    const emp = await Empleado.findById(empleado_id);

    const salario = emp.salario_base;

    // cálculo básico
    const cesantias = salario;
    const intereses = cesantias * 0.12;
    const prima = salario;
    const vacaciones = salario / 2;

    const total = cesantias + intereses + prima + vacaciones;

    res.json({
      empleado: emp.nombre,
      liquidacion: {
        cesantias,
        intereses,
        prima,
        vacaciones,
        total
      }
    });

} catch (err) {
res.status(500).json({ error: err.message });const mongoose = require('mongoose');

// 7. Reporte por empleado
exports.getNominaEmpleado = async (req, res) => {
try {
const { empleado_id } = req.params;

    const detalles = await NominaDetalle.find({ empleado_id }).lean();

    res.json(detalles);

} catch (err) {
res.status(500).json({ error: err.message });
}
};

const PagoSchema = new mongoose.Schema({
empresa_id: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Empresa',
required: true,
index: true
},

tercero_id: {
type: mongoose.Schema.Types.ObjectId,
required: true,
index: true
},

tipo_tercero: {
type: String,
enum: ['empleado', 'proveedor', 'cliente'],
default: 'empleado'
},

tipo: {
type: String,
enum: ['nomina', 'proveedor', 'gasto', 'anticipo', 'otro'],
required: true,
index: true
},

referencia_id: {
type: mongoose.Schema.Types.ObjectId,
default: null
},

monto: {
type: Number,
required: true
},

metodo_pago: {
type: String,
enum: ['efectivo', 'transferencia', 'nequi', 'daviplata', 'cheque', 'tarjeta'],
required: true
},

banco: String,

numero_referencia: String,

fecha: {
type: Date,
default: Date.now
},

estado: {
type: String,
enum: ['pendiente', 'aprobado', 'anulado'],
default: 'aprobado'
},

observacion: String,

creado_por: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Usuario'
}

}, {
timestamps: true
});

module.exports = mongoose.model('Pago', PagoSchema);
}
};
