export const companyConfig = {
    farmacia: {
        modules: [
            "inventario",
            "compras",
            "ventas",
            "lotes",
            "clientes",
            "proveedores",
        ],

        counters: {
            bill_counter_pharmacy: 0,
            bill_counter_sale_pharmacy: 0,
            bill_counter_batch: 0,
        },
    },

    restaurante: {
        modules: [
            "mesas",
            "pedidos",
            "cocina",
        ],

        counters: {
            bill_counter_pedido_restaurante: 0,
        },
    },

    comercial: {
        modules: [
            "ventas",
            "compras",
            "inventario",
        ],

        counters: {
            bill_counter: 0,
            bill_counter_credit: 0,
            bill_counter_debit: 0,
        },
    },

    produccion: {
        modules: [
            "produccion",
            "inventario",
            "materia_prima",
        ],

        counters: {
            bill_counter_production: 0,
        },
    },
};