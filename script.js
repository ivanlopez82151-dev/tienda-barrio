let productos = [
    { id: 1, nombre: "Pan", precio: 2000, stock: 50, categoria: "Alimentos", activo: true },
    { id: 2, nombre: "Leche", precio: 3800, stock: 30, categoria: "Lácteos", activo: true },
    { id: 3, nombre: "Huevos", precio: 650, stock: 20, categoria: "Alimentos", activo: true },
    { id: 4, nombre: "Arroz", precio: 4000, stock: 40, categoria: "Alimentos", activo: true },
    { id: 5, nombre: "Aceite", precio: 16000, stock: 15, categoria: "Alimentos", activo: true },
    { id: 6, nombre: "Azúcar", precio: 2800, stock: 25, categoria: "Alimentos", activo: true }
];

let carrito = [];

function renderizarProductos() {
    const contenedor = document.getElementById('productos-disponibles');
    contenedor.innerHTML = '';
    productos.forEach(p => {
        if (p.stock > 0 && p.activo) {
            const div = document.createElement('div');
            div.className = 'producto';
            div.innerHTML = `
                <h3>${p.nombre}</h3>
                <p>$${p.precio}</p>
                <p>Stock: ${p.stock}</p>
                <p>Categoría: ${p.categoria}</p>
                <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
            `;
            contenedor.appendChild(div);
        }
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto || producto.stock <= 0) return;
    const item = carrito.find(c => c.id === id);
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    producto.stock--;
    renderizarCarrito();
    renderizarProductos();
}

function renderizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
            <button onclick="eliminarDelCarrito(${item.id})">X</button>
        `;
        lista.appendChild(li);
        total += item.precio * item.cantidad;
    });
    document.getElementById('total-carrito').textContent = total;
}

function eliminarDelCarrito(id) {
    const item = carrito.find(c => c.id === id);
    if (!item) return;
    const producto = productos.find(p => p.id === id);
    producto.stock += item.cantidad;
    carrito = carrito.filter(c => c.id !== id);
    renderizarCarrito();
    renderizarProductos();
}

document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    alert(`Compra finalizada. Total: $${document.getElementById('total-carrito').textContent}`);
    carrito = [];
    productos.forEach(p => p.stock = p.stock); // Solo para resetear visualmente
    renderizarCarrito();
    renderizarProductos();
});

// INVENTARIO
function renderizarInventario() {
    const contenedor = document.getElementById('lista-inventario');
    contenedor.innerHTML = '';
    productos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'item-inventario';
        div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>Precio: $${p.precio}</p>
            <p>Stock: ${p.stock}</p>
            <p>Categoría: ${p.categoria}</p>
            <p>Activo: ${p.activo ? 'Sí' : 'No'}</p>
            <button onclick="editarProducto(${p.id})">Editar</button>
            <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

document.getElementById('form-producto').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const categoria = document.getElementById('categoria').value || "General";
    const activo = document.getElementById('activo').checked;

    const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
    productos.push({ id: nuevoId, nombre, precio, stock, categoria, activo });
    document.getElementById('form-producto').reset();
    renderizarInventario();
    renderizarProductos();
});

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    const nuevoPrecio = parseFloat(prompt("Nuevo precio:", producto.precio));
    const nuevoStock = parseInt(prompt("Nuevo stock:", producto.stock));
    const nuevaCategoria = prompt("Nueva categoría:", producto.categoria);
    const nuevoActivo = confirm("¿Está activo?") || producto.activo;

    if (nuevoNombre && !isNaN(nuevoPrecio) && !isNaN(nuevoStock)) {
        producto.nombre = nuevoNombre;
        producto.precio = nuevoPrecio;
        producto.stock = nuevoStock;
        producto.categoria = nuevaCategoria;
        producto.activo = nuevoActivo;
        renderizarInventario();
        renderizarProductos();
    }
}

function eliminarProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        productos = productos.filter(p => p.id !== id);
        carrito = carrito.filter(c => c.id !== id);
        renderizarInventario();
        renderizarProductos();
        renderizarCarrito();
    }
}

// XML
function generarXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<productos>\n';
    productos.forEach(p => {
        const valor = (p.precio * p.stock).toFixed(2);
        const fecha = new Date().toISOString().split('T')[0]; // Fecha actual (solo YYYY-MM-DD)

        xml += `  <producto id="${p.id}">\n`;
        xml += `    <nombre>${p.nombre}</nombre>\n`;
        xml += `    <precio>${p.precio}</precio>\n`;
        xml += `    <stock>${p.stock}</stock>\n`;
        xml += `    <categoria>${p.categoria}</categoria>\n`;
        xml += `    <activo>${p.activo}</activo>\n`;
        xml += `    <valor>${valor}</valor>\n`;
        xml += `    <fecha_creacion>${fecha}</fecha_creacion>\n`;
        xml += `  </producto>\n`;
    });
    xml += '</productos>';
    return xml;
}

function renderizarXML() {
    const xmlStr = generarXML();
    document.getElementById('xml-tree').textContent = xmlStr;

    // Eliminamos los campos de valor total y porcentaje
    // document.getElementById('total-xml').textContent = total.toFixed(2);
    // document.getElementById('porcentaje-xml').textContent = porcentaje.toFixed(2) + '%';
}

// NAVEGACIÓN
document.getElementById('btn-comprar').addEventListener('click', () => {
    document.getElementById('comprar').classList.add('active');
    document.getElementById('inventario').classList.remove('active');
    document.getElementById('xml').classList.remove('active');
    renderizarProductos();
    renderizarCarrito();
});

document.getElementById('btn-inventario').addEventListener('click', () => {
    document.getElementById('comprar').classList.remove('active');
    document.getElementById('inventario').classList.add('active');
    document.getElementById('xml').classList.remove('active');
    renderizarInventario();
});

document.getElementById('btn-xml').addEventListener('click', () => {
    document.getElementById('comprar').classList.remove('active');
    document.getElementById('inventario').classList.remove('active');
    document.getElementById('xml').classList.add('active');
    renderizarXML();
});

// Inicializar
renderizarProductos();
renderizarInventario();
renderizarXML();