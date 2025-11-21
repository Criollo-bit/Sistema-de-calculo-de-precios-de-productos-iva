class BaseDeDatos {
    constructor() {
        this.almacenamiento = [];
    }

    guardarProducto(producto) {
        this.almacenamiento.push(producto);
        console.log("Base de Datos: Producto guardado correctamente", this.almacenamiento);
    }

    obtenerTodos() {
        return this.almacenamiento;
    }
}