document.addEventListener("DOMContentLoaded", () => {
  const contadorEl = document.getElementById("contador");

  // Función para actualizar el contador
  function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((suma, prod) => suma + prod.cantidad, 0);
    if (contadorEl) contadorEl.textContent = total;
  }

  // Actualizar contador al cargar la página
  actualizarContador();

  // Escuchar cambios en localStorage desde otras pestañas
  window.addEventListener("storage", () => {
    actualizarContador();
  });

  // Esto permite que si productos2.html está abierta en otra pestaña, al agregarlos se vea al instante
  const carritoObserver = setInterval(() => {
    actualizarContador();
  }, 300); // revisa cada 300ms

});
