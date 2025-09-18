document.addEventListener("DOMContentLoaded", () => {
  const listaCarrito = document.getElementById("lista-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contadorEl = document.getElementById("contador");

  function actualizarContador() {
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    if (contadorEl) contadorEl.textContent = total;
  }

  function renderCarrito() {
    if (carrito.length === 0) {
      listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
      actualizarContador();
      return;
    }

    listaCarrito.innerHTML = carrito.map(p => `
      <div class="carrito-item">
        <div class="carrito-info">
          <h3>${p.nombre}</h3>
          <p class="carrito-precio">Precio: $${p.precio}</p>
          <p>
            Cantidad: 
            <button class="disminuir" data-id="${p.id}">-</button>
            <span class="cantidad">${p.cantidad}</span>
            <button class="incrementar" data-id="${p.id}">+</button>
          </p>
        </div>
        <button class="quitar" data-id="${p.id}">Eliminar</button>
      </div>
    `).join("");

    // Total
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    listaCarrito.innerHTML += `
      <div class="carrito-total">
        <h3>Total:</h3>
        <p>$${total}</p>
      </div>
    `;

    actualizarContador();

    // Eventos eliminar, incrementar y disminuir
    document.querySelectorAll(".quitar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
      });
    });

    document.querySelectorAll(".incrementar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod) prod.cantidad++;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
      });
    });

    document.querySelectorAll(".disminuir").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const prod = carrito.find(p => p.id === id);
        if (prod) {
          prod.cantidad--;
          if (prod.cantidad <= 0) carrito = carrito.filter(p => p.id !== id);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCarrito();
      });
    });
  }

  // Vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  });

  // Finalizar compra → imprime boleta
  document.getElementById("finalizar-compra").addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    // Generar boleta
    let boleta = `=== BOLETA WallEat ===\nVendedor: Ficticio\n\n`;
    let total = 0;
    carrito.forEach(p => {
      boleta += `${p.nombre} x${p.cantidad} - $${p.precio} c/u = $${p.precio * p.cantidad}\n`;
      total += p.precio * p.cantidad;
    });
    boleta += `\nTOTAL: $${total}\n\n¡Gracias por tu compra!\n====================`;

    // Abrir boleta en nueva ventana para imprimir
    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.write(`<pre>${boleta}</pre>`);
    nuevaVentana.document.close();
    nuevaVentana.print();

    // Vaciar carrito
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  });

  // Escuchar cambios de carrito desde otra pestaña o productos2.html
  window.addEventListener("storage", (e) => {
    if (e.key === "carrito") {
      carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      renderCarrito();
    }
  });

  renderCarrito();
});
