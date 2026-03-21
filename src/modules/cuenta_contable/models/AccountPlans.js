import mongoose from "mongoose";
const { Schema } = mongoose;

const accountPlansSchema = new Schema(
  {
    company: {
      _id: String,
      name_company: String,
      name_founder: String,
      nit_company: String,
    },
    code_plan: {
      type: String,
      enum: ["1101", "1102", "1201", "1301", "2101", "2201", "4101", "5101"],
    },
    account_plan: {
      type: String,
      enum: [
        "Caja",
        "Banco",
        "Clientes",
        "Inventario",
        "Proveedores",
        "Cuentas por pagar",
        "Ventas",
        "Costo de ventas",
      ],
    },
    type_account: {
      type: String,
      enum: ["Activo", "Pasivo", "Ingreso", "Costo", ""],
      default: "",
    },
  },
  { timestamps: true },
);

/*

    *1 – Activos

        1101 → Caja

        1102 → Banco

        1201 → Clientes

        1301 → Inventario

    *2 – Pasivos

        2101 → Proveedores

        2201 → Cuentas por pagar

    *4 – Ingresos

        4101 → Ventas

    *5 – Costos / Gastos

        5101 → Costo de ventas


    ? -------------------------------------------------------------------------- ¿

    TODO → El asiento contable depende de los planes contables

    bill_counter → Contador para asientos contables (AS-0000)

    date_create → Fecha en que se creo (compra/venta)

    product_description → Agarrar campo a la hora de la compra o la venta de productos
    
    debit → Cuando entra algo (compras)

    debit → Cuando sale algo (ventas)

    amount → Agarrar precio de la compra o de la venta que se genera

    type_brief_case → Si es compra o venta

    state


    ? ----------------------------------------------------------------------------- ¿

    * Debito

    Inventario (Débito): cuando la empresa recibe o aumenta mercancía para vender.

    Caja (Débito): cuando el cliente paga en efectivo.
    
    Banco (Débito): cuando el cliente paga por transferencia o tarjeta.
    
    Clientes (Débito): cuando la venta es a crédito al cliente.
    
    Cuentas por cobrar (Débito): nombre general para dinero que el cliente debe.
    
    Costo de ventas (Débito): cuando se reconoce el costo del producto que se vendió.
    
    * Credito

    Proveedores (Crédito): cuando la mercancía se compra a crédito y se pagará después.

    Cuentas por pagar (Crédito): igual que proveedores, usado como nombre más general de deuda.

    Caja (Crédito): cuando la mercancía se paga en efectivo al momento.

    Banco (Crédito): cuando la mercancía se paga con transferencia o desde cuenta bancaria.

    Ventas (Crédito): cuando se registra el ingreso por vender productos.

    Ingresos por ventas (Crédito): mismo uso que ventas, nombre más formal.

    Inventario (Crédito): cuando la mercancía sale del almacén porque fue vendida.


*/

export const AccountPlan = mongoose.model("accountplan", accountPlansSchema);
