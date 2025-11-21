class CalculadoraPrecios {
    constructor() {
        this.IVA = 0.15;
    }

    procesarProducto(nombre, precioBase) {
        //Regla de negocio: el precio no puede ser negativo
        if (precioBase < 0) {
            throw new Error("El precio no puede ser negativo");
        }

        const precioNum = parseFloat(precioBase);
        const montoIVA = precioNum * this.IVA;
        const precioTotal = precioNum + montoIVA;

        // Retornamos el valor ya procesado
        return {
            nombre: nombre,
            precioBase: precioNum,
            iva: montoIVA.toFixed(2),
            total: precioTotal.toFixed(2)
        };
    }
}