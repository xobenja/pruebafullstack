document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid-productos");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorEl = document.getElementById("contador");

  // Productos iniciales (sin repetidos)
  const productosIniciales = [
    { id: "p1", nombre: "Hamburguesas", desc: "Smash burger casera.", precio: 5990, img: "../../img/smash-burger-que-es.jpg" },
    { id: "p2", nombre: "Papas fritas", desc: "Crocantes, porción individual.", precio: 2490, img: "../../img/papas-fritas-saludables-1080x550-1-1200x720.jpg" },
    { id: "p3", nombre: "Completo", desc: "Pan, vienesa, palta, tomate, mayo.", precio: 2990, img: "../../img/Foto_1.jpeg" }
    //  Aquí puedes añadir más productos iniciales manualmente si quieres
  ];

  // Traer productos nuevos desde localStorage (editarProductos.html)
  let productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

  // Combinar y eliminar duplicados por nombre (o por id)
  let productos = [...productosIniciales, ...productosGuardados].filter((v,i,a)=>a.findIndex(p=>p.nombre===v.nombre)===i);

  // Render de productos
  function renderProductos() {
    grid.innerHTML = "";
    productos.forEach(p => {
      const card = document.createElement("article");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="info">
          <h3>${p.nombre}</h3>
          <p class="desc">${p.desc}</p>
          <p class="precio">$${p.precio}</p>
        </div>
        <button class="btn agregar" data-id="${p.id || p.nombre}" data-name="${p.nombre}" data-price="${p.precio}">Agregar</button>
      `;
      grid.appendChild(card);
    });
    actualizarBotones();
    escucharBotones();
  }

  // Actualizar contador del carrito
  function actualizarContador() {
    const total = carrito.reduce((suma, prod) => suma + prod.cantidad, 0);
    if (contadorEl) contadorEl.textContent = total;
  }

  // Agregar producto al carrito
  function agregarProducto(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    actualizarBotones();
  }

  // Actualizar botones "Agregar"
  function actualizarBotones() {
    document.querySelectorAll(".agregar").forEach(btn => {
      const id = btn.dataset.id;
      if (carrito.find(p => p.id === id)) {
        btn.textContent = "Agregado ✓";
        btn.disabled = true;
      } else {
        btn.textContent = btn.dataset.name;
        btn.disabled = false;
      }
    });
  }

  // Escuchar clicks en botones
  function escucharBotones() {
    document.querySelectorAll(".agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const producto = {
          id: btn.dataset.id,
          nombre: btn.dataset.name,
          precio: parseInt(btn.dataset.price, 10)
        };
        agregarProducto(producto);
      });
    });
  }

  // Escuchar cambios en localStorage para productos nuevos
  window.addEventListener("storage", e => {
    if (e.key === "productos") {
      const nuevos = JSON.parse(localStorage.getItem("productos")) || [];
      productos = [...productosIniciales, ...nuevos].filter((v,i,a)=>a.findIndex(p=>p.nombre===v.nombre)===i);
      renderProductos();
    }
    if (e.key === "carrito") {
      carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      actualizarContador();
      actualizarBotones();
    }
  });

  // Inicializar
  renderProductos();
  actualizarContador();
});
