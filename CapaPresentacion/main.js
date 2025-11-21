let gestorBD;
let gestorLogica;

window.onload = function() {
    gestorBD = new BaseDeDatos();
    gestorLogica = new CalculadoraPrecios();
};


function previsualizarCalculo() {
    const nombre = document.getElementById('nombreInput').value;
    const precio = document.getElementById('precioInput').value;
    const cajaPreview = document.getElementById('previewBox');

    // Si no hay precio, ocultamos la caja de cálculo
    if (precio === "") {
        cajaPreview.style.display = "none";
        return;
    }

    try {
        const datos = gestorLogica.procesarProducto(nombre || "Producto", precio);

        // Mostramos los resultados
        cajaPreview.style.display = "block";
        document.getElementById('prevBase').innerText = `$${datos.precioBase}`;
        document.getElementById('prevIVA').innerText = `$${datos.iva}`;
        document.getElementById('prevTotal').innerText = `$${datos.total}`;

    } catch (error) {
        // Si el precio es negativo ocultamos la preview
        cajaPreview.style.display = "none";
    }
}

function agregarProducto() {
    if (!gestorBD || !gestorLogica) return;

    const nombre = document.getElementById('nombreInput').value;
    const precio = document.getElementById('precioInput').value;

    if(nombre === "" || precio === "") {
        alert("Por favor llena los campos");
        return;
    }

    try {
        // SECCION LÓGICA
        const productoProcesado = gestorLogica.procesarProducto(nombre, precio);

        // SECCION DATOS
        gestorBD.guardarProducto(productoProcesado);

        // SECCION VISUAL
        renderizarLista();
        mostrarNotificacion();
        
        // Limpiamos
        limpiarFormulario();

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Animación de Notificación
function mostrarNotificacion() {
    const toast = document.getElementById('notificacion');
    toast.classList.add('mostrar');
    
    // Quitar la notificación después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 3000);
}

function renderizarLista() {
    const lista = document.getElementById('listaResultados');
    lista.innerHTML = "";
    
    const productos = gestorBD.obtenerTodos();

    if (productos.length === 0) {
        lista.innerHTML = '<li style="color: #999; justify-content: center;">La base de datos está vacía...</li>';
        return;
    }

    productos.forEach(p => {
        const item = document.createElement('li');
        // Usamos iconos también en la lista
        item.innerHTML = `
            <span><i class="fas fa-box"></i> <b>${p.nombre}</b></span>
            <span>Precio Final: <b style="color: #27ae60">$${p.total}</b></span>
        `;
        lista.appendChild(item);
    });
}

function limpiarFormulario() {
    document.getElementById('nombreInput').value = "";
    document.getElementById('precioInput').value = "";
    document.getElementById('previewBox').style.display = "none"; 
    document.getElementById('nombreInput').focus();
}

function descargarArchivo() { 
    const productos = gestorBD.obtenerTodos();
    if (productos.length === 0) { alert("Nada que descargar"); return; }

    let contenidoTexto = "--- INVENTARIO ---\n";
    productos.forEach(p => {
        contenidoTexto += `[${p.nombre}] - Total: $${p.total}\n`;
    });

    const archivo = new Blob([contenidoTexto], { type: 'text/plain' }); 
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "Inventario.txt";
    enlace.click();
} 