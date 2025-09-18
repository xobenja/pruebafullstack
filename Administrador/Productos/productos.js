document.addEventListener('DOMContentLoaded', () => {
    const btnNuevo = document.getElementById('btn-nuevo');
    const modal = document.getElementById('modal');
    const btnCerrar = document.getElementById('cerrar-modal');
    const formProducto = document.getElementById('form-producto');
    const productosBody = document.getElementById('productos-body');
    const contadorEl = document.getElementById("contador");

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let productoEditando = null;

    function actualizarContador() {
        const total = carrito.reduce((suma, prod) => suma + prod.cantidad, 0);
        if (contadorEl) contadorEl.textContent = total;
    }

    function agregarAlCarrito(producto) {
        const existe = carrito.find(p => p.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
    }

    btnNuevo.addEventListener('click', () => {
        productoEditando = null;
        modal.classList.remove('oculto');
        formProducto.reset();
        document.getElementById('modal-titulo').innerText = 'Nuevo Producto';
    });

    btnCerrar.addEventListener('click', () => {
        modal.classList.add('oculto');
        formProducto.reset();
        productoEditando = null;
    });

    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('producto-nombre').value.trim();
        const desc = document.getElementById('producto-desc').value.trim();
        const precio = parseFloat(document.getElementById('producto-precio').value);
        const categoria = document.getElementById('producto-categoria').value;
        const archivoImg = document.getElementById('producto-img').files[0];

        if (!nombre || nombre.length > 100) { alert("Nombre requerido, máximo 100 caracteres"); return; }
        if (desc.length > 500) { alert("Descripción máximo 500 caracteres"); return; }
        if (isNaN(precio) || precio < 0) { alert("Precio requerido y mayor o igual a 0"); return; }
        if (!categoria) { alert("Debe seleccionar una categoría"); return; }

        const guardarProducto = (imgBase64) => {
            if (productoEditando) {
                productoEditando.nombre = nombre;
                productoEditando.desc = desc;
                productoEditando.precio = precio;
                productoEditando.categoria = categoria;
                if (imgBase64) productoEditando.img = imgBase64;
            } else {
                const nuevoProducto = {
                    id: Date.now(),
                    nombre,
                    desc,
                    precio,
                    categoria,
                    img: imgBase64 || ""
                };
                productos.push(nuevoProducto);
            }

            localStorage.setItem('productos', JSON.stringify(productos));
            mostrarProductos();
            formProducto.reset();
            modal.classList.add('oculto');
            productoEditando = null;
        };

        if (archivoImg) {
            const reader = new FileReader();
            reader.onload = () => guardarProducto(reader.result);
            reader.readAsDataURL(archivoImg);
        } else {
            guardarProducto();
        }
    });

    function mostrarProductos() {
        productosBody.innerHTML = '';
        productos.forEach(prod => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img src="${prod.img}" alt="${prod.nombre}" width="50"></td>
                <td>${prod.nombre}</td>
                <td>${prod.desc}</td>
                <td>$${prod.precio}</td>
                <td>${prod.categoria}</td>
                <td>
                    <button class="btn-editar btn-accion" data-id="${prod.id}">✏️</button>
                    <button class="btn-accion eliminar" data-id="${prod.id}">🗑️</button>
                    <button class="agregar btn-accion" data-id="${prod.id}" data-name="${prod.nombre}" data-price="${prod.precio}" data-img="${prod.img}">➕</button>
                </td>
            `;
            productosBody.appendChild(fila);
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                productoEditando = productos.find(p => p.id == id);
                abrirModalEditar(productoEditando);
            });
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                productos = productos.filter(p => p.id != id);
                localStorage.setItem('productos', JSON.stringify(productos));
                mostrarProductos();
            });
        });

        document.querySelectorAll('.agregar').forEach(btn => {
            btn.addEventListener('click', () => {
                const productoCarrito = {
                    id: btn.dataset.id,
                    nombre: btn.dataset.name,
                    precio: parseInt(btn.dataset.price, 10),
                    img: btn.dataset.img
                };
                agregarAlCarrito(productoCarrito);

                const prev = btn.textContent;
                btn.textContent = "✓";
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = prev;
                    btn.disabled = false;
                }, 700);
            });
        });
    }

    function abrirModalEditar(prod) {
        modal.classList.remove('oculto');
        document.getElementById('modal-titulo').innerText = 'Editar Producto';
        document.getElementById('producto-nombre').value = prod.nombre;
        document.getElementById('producto-desc').value = prod.desc;
        document.getElementById('producto-precio').value = prod.precio;
        document.getElementById('producto-categoria').value = prod.categoria;
        document.getElementById('producto-img').value = '';
    }

    mostrarProductos();
    actualizarContador();
});
