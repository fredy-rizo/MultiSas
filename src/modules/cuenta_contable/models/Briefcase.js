import mongoose from "mongoose";
const { Schema } = mongoose;

const briefcaseSchema = new Schema(
  {
    bill_number: String,
    date_create: String,
    product_description_brief: String,
    debit: String,
    credit: String,
    amount: String,
    type_brief_case: String,
  },
  { timestamps: true },
);

/*  
    TODO → El asiento contable depende de los planes contables

    bill_counter → Contador para asientos contables (AS-0000)

    date_create → Fecha en que se creo (compra/venta)

    product_description → Agarrar campo a la hora de la compra o la venta de productos
    
    debit → Cuando entra algo (compras)

    debit → Cuando sale algo (ventas)

    amount → Agarrar precio de la compra o de la venta que se genera

    type_brief_case → Si es compra o venta

    state

    ! IMPORTANTE

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

export const BriefCase = mongoose.model("briefcase", briefcaseSchema);
