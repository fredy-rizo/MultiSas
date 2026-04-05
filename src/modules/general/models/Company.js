import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    token: { type: String, default: "" },
    type_company: { type: String, default: "" },
    password: { type: String, default: "" },
    name_company: { type: String, default: "" },
    name_founder: { type: String, default: "" },
    nit_company: { type: String, default: "" },
    type_dato: { type: String, default: "company" },
    role_user: {
      type: String,
      enum: ["Super Admin", "Admin", "Vendedor", "Sin rol"],
      default: "Sin rol",
    },
    active_account: [{ name: String, value: String }],
    available_plans: {
      type: String,
      enum: [
        "Plan Basico",
        "Plan Profesional",
        "Plan Premium",
        "Plan Personalizado",
        "Sin Plan",
      ],
      default: "Sin Plan",
    },
    type_available_plans: {
      type: String,
      enum: ["Mensual", "Anual", "Vacio", "Permanente"],
      default: "Vacio",
    },
    modules: { type: [String], default: [] },
    months_quantity: { type: Number, default: 0 },
    day_available_plans: { type: String, default: "" },
    expired_available_plans: { type: String, default: "" },
    bill_counter: { type: Number, default: 0 },
    bill_counter_brief_case: { type: Number, default: 0 },
    bill_counter_shopping: { type: Number, default: 0 },
    bill_counter_pedido: { type: Number, default: 0 },
    bill_counter_production: { type: Number, default: 0 },
    bill_counter_credit: { type: Number, default: 0 },
    bill_counter_debit: { type: Number, default: 0 },
    bill_counter_pedido_restaurante: { type: Number, default: 0 },
    bill_counter_pharmacy: { type: Number, default: 0 },
    bill_counter_sale_pharmacy: { type: Number, default: 0 },
    bill_counter_batch: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

/*
    type_company → si es empresa de ferreteria, sublimacion, hotel, drogueria, verdureria, etc...
    name_company → nombre de empresa
    name_founder → nombre de fundador de la empresa
    nit_company → identificacion de la empresa (NIT/RUT)

    role_user (Super Admin) → administrador encargador de registrar a las empresas y dar soporte
    role_user (Admin) → administrador de la empresa (se encarga solamente de registrar sus vendedores y distribuidores)

    active_account (name: Pendiente - value: 1) → validando pago
    active_account (name: Activo - value: 2) → se aprobo pago y se activa cuenta
    active_account (name: Inactivo - value: 3) → caduco el tiempo estimado de pago que habia activado

    available_plans → PLAN BÁSICO — $29.000 COP / mes
        Incluye:

            1.Facturación electrónica estándar
            Genera facturas con todos los campos requeridos y produce los archivos XML y PDF.

            2.Gestión de clientes y productos, y proveedores
            Permite crear, editar y consultar clientes y productos simples.

            3.Almacenamiento de documentos (básico)
            Guarda un volumen limitado de facturas en el sistema.

            4.1 usuario y 1 empresa
            Acceso único para un negocio pequeño sin multiusuario.

            5.Soporte por chat básico
            Atención para dudas operativas simples.

    available_plans → PLAN PROFESIONAL — $59.000 COP / mes
        Incluye:

            1.Todo lo del Plan Básico
            Conserva todas las funciones ya mencionadas.

            2.Notas crédito y notas débito
            Permite corregir o ajustar valores de facturas emitidas.

            3.Inventario básico
            Controla existencias, entradas y salidas sin funciones avanzadas.

            4.Reportes de ventas generales
            Muestra resúmenes de ventas por fechas, cliente o producto.

            5.Multiusuario
            Permite varios usuarios con permisos simples.

            6.API de consulta
            Permite obtener información de facturas desde aplicaciones externas.

            7.Mayor capacidad de almacenamiento
            Guarda más documentos que el plan básico.

            8.Soporte estándar
            Respuestas más rápidas y con ayuda técnica básica.

    available_plans → PLAN PREMIUM — $119.000 COP / mes
        Incluye:

            1.Todo lo del Plan Profesional
            Mantiene todas las funciones previas.

            2.Inventario avanzado
            Manejo de costos, kardex, alertas de stock y bodegas múltiples.

            3.Cartera y registro de pagos
            Control de cuentas por cobrar, vencimientos y abonos.

            4.Multiempresa
            Maneja varias empresas desde un mismo panel.

            5.API completa (crear y consultar)
            Permite integrar sistemas externos para generar y consultar documentos.

            6.Roles y permisos avanzados
            Control granular sobre acciones permitidas para cada usuario.

            7.Almacenamiento ampliado
            Mayor capacidad para históricos y documentos anexos.

            8.Plantillas personalizadas
            Permite personalizar el diseño del PDF con logotipo, colores y estructura.

            9.Soporte prioritario
            Atención más rápida y resolución técnica avanzada.

    available_plans → PLAN PERSONALIZADO - depende de lo que pida usuario

    type_available_plans → elegir si es plan mensual o anual, (el permanente es para el superadmin)

    months_quantity → elegir cantidad de meses

    day_available_plans → agrega dia, hora y fecha del dia que se adquirio el plan

    expired_available_plans → Dependiendo de lo que se elija en "available_plans" pone aca los dias que faltan para terminar plan

    bill_counter → Contador para enumerar las facturas desde 000 hasta infinito de convinaciones

    bill_counter_brief_case → Contador para enumerar los asientos contables

    bill_counter_pedido → Contador para enumerar facturas en pedidos

    bill_counter_production → Contador para enumerar facturas en producciones

    bill_counter_pharmacy → Contador para enumerar productos en farmacia

    bill_counter_batch → Contador para enumerar lotes en farmacia

*/

export const encrypt_password = async (password) => {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
};

export const compare_password = async (password, received_password) => {
  return await bcrypt.compare(password, received_password);
};

export const Company = mongoose.model("company", companySchema);
