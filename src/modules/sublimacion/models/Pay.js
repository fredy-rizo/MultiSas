import mongoose from "mongoose";
const { Schema } = mongoose;

const paySchema = new Schema(
  {
    company: String,
    tercero: String,
    tipo_tercero: {
      type: String,
      enum: ["empleado", "proveedor", "cliente"],
      default: "empleado",
    },
    tipo: {
      type: String,
      enum: ["nomina", "proveedor", "gastos", "anticipo", "otro"],
    },
    monto: Number,
    metodo_pago: {
      type: String,
      enum: [
        "efectivo",
        "transferencia",
        "nequi",
        "daviplata",
        "cheque",
        "tarjeta",
      ],
    },
    banco: String,
    numero_referencia: String,
    fecha: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "anulado"],
      default: "aprobado",
    },
    observacion: String,
    creado_por: String,
  },
  { timestamps: true },
);

/*
    company -> id de la empresa a la que pertenece el pago
    tercero -> id o identificador de la persona/entidad que recibe el pago
    tipo_tercero -> define si el tercero es empleado, proveedor o cliente
    tipo -> categoría del pago: nomina, proveedor, gastos, anticipo u otro
    monto -> valor total del pago realizado
    metodo_pago -> forma en que se pagó: efectivo, transferencia, nequi, daviplata, cheque o tarjeta
    banco -> nombre del banco usado en el pago (si aplica)
    numero_referencia -> número de comprobante, transacción o referencia bancaria
    fecha -> fecha en que se realizó o registró el pago
    estado -> estado actual del pago: pendiente, aprobado o anulado
    observacion -> comentario, detalle o nota adicional sobre el pago
*/

export const Pay = mongoose.model("pay_sublimacion", paySchema);
