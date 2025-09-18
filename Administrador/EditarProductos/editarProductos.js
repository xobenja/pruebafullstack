document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid-productos");

  // Productos iniciales con id único
  const productosIniciales = [
    { id: 1, nombre: "Hamburguesas", desc: "Smash burger casera.", precio: 5990, img: "../../img/smash-burger-que-es.jpg" },
    { id: 2, nombre: "Papas fritas", desc: "Crocantes, porción individual.", precio: 2490, img: "../../img/papas-fritas-saludables-1080x550-1-1200x720.jpg" },
    { id: 3, nombre: "Completo", desc: "Pan, vienesa, palta, tomate, mayo.", precio: 2990, img: "../../img/Foto_1.jpeg" }
  ];

  // Mezclar iniciales + guardados (sobrescribe por id)
  function combinarProductos() {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    const mapa = new Map();
    [...productosIniciales, ...guardados].forEach(p => mapa.set(p.id, p));
    return Array.from(mapa.values());
  }

  // Productos actuales
  let productos = combinarProductos();
  // Guardar todos los productos
  function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));

    //  Notificar a todas las pestañas
    window.dispatchEvent(new StorageEvent("storage", { key: "productos" }));

    // Notificar también a la misma pestaña
    window.dispatchEvent(new Event("productos-actualizados"));
  }

  // Renderizar productos
  function renderProductos() {
    grid.innerHTML = "";
    productos.forEach((p, index) => {
      const card = document.createElement("article");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="info">
          <h3>${p.nombre}</h3>
          <p class="desc">${p.desc}</p>
          <p class="precio">$${p.precio}</p>
        </div>
        <button class="btn-edit" data-index="${index}">Editar</button>
        <button class="btn-del" data-index="${index}">Eliminar</button>
      `;
      grid.appendChild(card);
    });

    // Botones editar
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", e => abrirModalEditar(e.target.dataset.index));
    });

    // Botones eliminar
    document.querySelectorAll(".btn-del").forEach(btn => {
      btn.addEventListener("click", e => {
        productos.splice(e.target.dataset.index, 1);
        guardarProductos();
        renderProductos();
      });
    });
  }

  // Modal de edición
  function abrirModalEditar(index) {
    const producto = productos[index];

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Editar Producto</h2>
        <label>Nombre</label>
        <input type="text" id="edit-nombre" value="${producto.nombre}">
        <label>Descripción</label>
        <textarea id="edit-desc">${producto.desc}</textarea>
        <label>Precio</label>
        <input type="number" id="edit-precio" value="${producto.precio}">
        <label>Imagen</label>
        <input type="file" id="edit-img" accept="image/*">
        <img src="${producto.img}" alt="Preview" class="preview">
        <div class="acciones">
          <button id="guardar">Guardar</button>
          <button id="cancelar">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Cancelar
    modal.querySelector("#cancelar").addEventListener("click", () => modal.remove());

    // Guardar cambios
    modal.querySelector("#guardar").addEventListener("click", () => {
      const nuevoNombre = modal.querySelector("#edit-nombre").value.trim();
      const nuevaDesc = modal.querySelector("#edit-desc").value.trim();
      const nuevoPrecio = parseFloat(modal.querySelector("#edit-precio").value);
      const inputImg = modal.querySelector("#edit-img");

      const actualizarProducto = (imgFinal) => {
        productos[index] = {
          id: producto.id || Date.now(), // conservar id
          nombre: nuevoNombre || producto.nombre,
          desc: nuevaDesc || producto.desc,
          precio: !isNaN(nuevoPrecio) ? nuevoPrecio : producto.precio,
          img: imgFinal
        };
        guardarProductos();
        renderProductos();
        modal.remove();
      };

      if (inputImg.files && inputImg.files[0]) {
        const reader = new FileReader();
        reader.onload = e => actualizarProducto(e.target.result);
        reader.readAsDataURL(inputImg.files[0]);
      } else {
        actualizarProducto(producto.img);
      }
    });
  }

  renderProductos();
});
