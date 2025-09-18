document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid-productos");

  // Productos iniciales con id
  const productosIniciales = [
    { id: 1, nombre: "Hamburguesas", desc: "Smash burger casera.", precio: 5990, img: "../../img/smash-burger-que-es.jpg" },
    { id: 2, nombre: "Papas fritas", desc: "Crocantes, porción individual.", precio: 2490, img: "../../img/papas-fritas-saludables-1080x550-1-1200x720.jpg" },
    { id: 3, nombre: "Completo", desc: "Pan, vienesa, palta, tomate, mayo.", precio: 2990, img: "../../img/Foto_1.jpeg" }
  ];

  // Función para combinar iniciales + guardados sin duplicar
  function combinarProductos() {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    const mapa = new Map();

    // Primero los iniciales
    productosIniciales.forEach(p => mapa.set(p.id, p));
    //  sobreescriben si tienen el mismo id
    guardados.forEach(p => mapa.set(p.id, p));

    return Array.from(mapa.values());
  }

  // Estado inicial
  let productos = combinarProductos();

  // Renderizar productos
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
        <a href="../IniciarSesion/iniciarSesion.html" class="btn">Agregar</a>
      `;
      grid.appendChild(card);
    });
  }

  // Escucha cambios desde otra pestaña (editarProductos.html)
  window.addEventListener("storage", e => {
    if (e.key === "productos") {
      productos = combinarProductos();
      renderProductos();
    }
  });

  // Escucha evento custom (cuando editarProductos lo dispare en la misma pestaña)
  window.addEventListener("productos-actualizados", () => {
    productos = combinarProductos();
    renderProductos();
  });

  // Render inicial
  renderProductos();
});
