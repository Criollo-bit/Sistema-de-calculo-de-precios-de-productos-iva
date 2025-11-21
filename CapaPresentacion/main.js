let gestorBD;
let gestorLogica;

window.onload = function() {
    try {
        gestorBD = new BaseDeDatos();
        gestorLogica = new CalculadoraPrecios();
        console.log("Sistema iniciado correctamente.");
    } catch (error) {
        console.error(error);
        alert("Error grave: No se encuentran las clases 'BaseDeDatos' o 'CalculadoraPrecios'. Revisa si los nombres de las carpetas son correctos.");
    }
};
  //esto es por si no se cargan bien los archivos
function agregarProducto() {
    if (!gestorBD || !gestorLogica) {
        alert("El sistema no se cargó bien. Revisa la consola (F12).");
        return;
    }

    const nombre = document.getElementById('nombreInput').value;
    const precio = document.getElementById('precioInput').value;

    if(nombre === "" || precio === "") {
        alert("Por favor llena los campos");
        return;
    }

    try {
        const productoProcesado = gestorLogica.procesarProducto(nombre, precio);
        gestorBD.guardarProducto(productoProcesado);
        renderizarLista();
        limpiarFormulario();
    } catch (error) {
        alert("Error: " + error.message);
    }
}

function renderizarLista() {
    const lista = document.getElementById('listaResultados');
    lista.innerHTML = "";
    
    const productos = gestorBD.obtenerTodos();

    productos.forEach(p => {
        const item = document.createElement('li');
        item.style.padding = "5px";
        item.style.borderBottom = "1px solid #eee";
        item.textContent = `${p.nombre} | Base: $${p.precioBase} | Total: $${p.total}`;
        lista.appendChild(item);
    });
}

function limpiarFormulario() {
    document.getElementById('nombreInput').value = "";
    document.getElementById('precioInput').value = "";
    document.getElementById('nombreInput').focus();
}

function descargarArchivo() {
    //Pedimos los datos a la "Base de Datos"
    const productos = gestorBD.obtenerTodos();
    
    if (productos.length === 0) {
        alert("No hay datos para guardar.");
        return;
    }

    //Converto el Array a formato Texto (String)
    let contenidoTexto = "--- REPORTE DE PRODUCTOS ---\n\n";
    
    productos.forEach(p => {
        contenidoTexto += `PRODUCTO: ${p.nombre}\n`;
        contenidoTexto += `PRECIO BASE: $${p.precioBase}\n`;
        contenidoTexto += `TOTAL (con IVA): $${p.total}\n`;
        contenidoTexto += "--------------------------\n";
    });

    //Creamos un "Blob" que es como un archivo simulado en memoria
    const archivo = new Blob([contenidoTexto], { type: 'text/plain' });
    
    //Creamos un enlace invisible para descargarlo
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "BaseDeDatos_Productos.txt";
    
    // Hacemos clic automático y limpiamos
    enlace.click();
    URL.revokeObjectURL(enlace.href);
}